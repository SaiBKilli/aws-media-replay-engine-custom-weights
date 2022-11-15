/*
 * Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import _ from 'lodash';
import {useHistory} from "react-router-dom";
import {Backdrop, CircularProgress} from "@material-ui/core";
import {duration, makeStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import {ProgramDropdown} from "../../components/Programs/ProgramDropdown";
import {EventDropdown} from "../../components/Event/EventDropdown";
import {TransitionsDropdown} from "../../components/Replay/TransitionsDropdown";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import {
    Table, TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Breadcrumbs, Checkbox,
    FormControl,
    FormControlLabel,
    FormLabel,
    MenuItem,
    Paper, Radio,
    RadioGroup,
    Select,
    TextField, Typography,

} from "@material-ui/core";
import {PluginPriorityItem} from "./PluginPriorityItem"
import {API} from "aws-amplify";
import {useSessionContext} from "../../contexts/SessionContext";
import {MultiSelectWithChips} from "../../components/MultiSelectWithChips/MultiSelectWithChips";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import Tooltip from '@material-ui/core/Tooltip';
import {TransitionClipPreview} from './TransitionClipPreview';
import InfoIcon from '@material-ui/icons/Info';
import Slider from '@material-ui/core/Slider';

const useStyles = makeStyles((theme) => ({
    content: {
        marginTop: 'auto',
        flexGrow: 1,
    },
    radioGroup: {
        paddingLeft: 18
    },
    labelSpace: {
        paddingBottom: 5
    },
    field: {
        paddingTop: 5,
        paddingBottom: 5
    },
    timePickerInput: {
        backgroundColor: "#EDEDED",
        color: theme.palette.secondary.main
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },

}));

const HlsResolutions = [
    "4K (3840 x 2160)",
    "2K (2560 x 1440)",
    "16:9 (1920 x 1080)",
    "1:1 (1080 x 1080)",
    "4:5 (864 x 1080)",
    "9:16 (608 x 1080)",
    "720p (1280 x 720)",
    "480p (854 x 480)",
    "360p (640 x 360)"
]


export const ReplayCreate = () => {
    const classes = useStyles();
    const history = useHistory();
    const stateParams = _.get(history, 'location.state');

    const [audioTrackOptions, setAudioTrackOptions] = React.useState([]);
    const [selectedProgram, setSelectedProgram] = React.useState("-NA-");
    const [selectedTransition, setSelectedTransition] = React.useState("None");
    const [selectedTransitionConfig, setSelectedTransitionConfig] = React.useState("");
    const [selectedEvent, setSelectedEvent] = React.useState("-NA-");
    const [selectedAudioTrack, setSelectedAudioTrack] = React.useState("-NA-");
    const [replayDescription, setReplayDescription] = React.useState("");
    const [replayMode, setReplayMode] = React.useState("Duration");
    const [availableFeatures, setAvailableFeatures] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isLoadingAttribValues, setIsLoadingAttribValues] = React.useState(false);
    const [replayDuration, setReplayDuration] = React.useState(60);
    const [adInsertDuration, setAdInsertDuration] = React.useState(1);
    const [adPosition, setAdPosition] = React.useState('Beginning')
    const [adInsertionMode, setAdInsertionMode] = React.useState('Minutes')
    const [formInvalid, setFormInvalid] = React.useState(true)
    const [featuresObject, setFeaturesObject] = React.useState([])
    const {authenticatedUserName} = useSessionContext();
    const [pluginNamePlusAttribValues, setPluginNamePlusAttribValues] = React.useState([])
    const [resolutionValues, setResolutionValues] = React.useState([])
    const [outputFormat, setOutputFormat] = React.useState('')
    const [uxlabel, setUXlabel] = React.useState('')
    const [open, setOpen] = React.useState(false);
    const [previewOpen, setPreviewOpen] = React.useState(false);
    const [fadeInMs, setFadeInMs] = React.useState(0);
    const [fadeOutMs, setFadeOutMs] = React.useState(0);
    const [durationFromToleranceValue, setDurationFromToleranceValue] = React.useState(30);
    


    let featuresM = new Map()
    const [checkBoxState, setCheckBoxState] = React.useState({
        checkedFillToExact: true,
        checkedEqualDistro: false,
        checkedCatchup: false,
        checkedTransitions: true,
        checkedIgnoreLowQualitySegments: false
    });

    const handleCheckBoxChange = (event) => {
        setCheckBoxState({...checkBoxState, [event.target.name]: event.target.checked});
    };

    const handleAudioTrackChange = async (event) => {
        setSelectedAudioTrack(event.target.value);
        //validateForm()
    }

    const getFormValues = () => {


        let formValues = {
            "Program": selectedProgram,
            "Event": selectedEvent,
            "AudioTrack": selectedAudioTrack,
            "Description": replayDescription,
            "UxLabel": uxlabel,
            "Requester": authenticatedUserName,
            "Catchup": checkBoxState.checkedCatchup,
            "CreateMp4": outputFormat === "Mp4" ? true : false,
            "CreateHls": outputFormat === "Hls" ? true : false,
            "ClipfeaturebasedSummarization": replayMode === "Clips" ? true : false,
            "Resolutions": outputFormat !== "" ? resolutionValues : [],
            "IgnoreDislikedSegments": checkBoxState.checkedIgnoreLowQualitySegments
        }
        if (replayMode === "Duration") {
            formValues['DurationbasedSummarization'] = {
                "Duration": parseInt(replayDuration),
                "FillToExact": checkBoxState.checkedFillToExact,
                "EqualDistribution": checkBoxState.checkedEqualDistro,
                "ToleranceMaxLimitInSecs": parseFloat(durationFromToleranceValue)
            }
        }

        // Get Priority Info
        let clips = []
        _.forEach(featuresObject, f => {

            let clip = {}
            let clipinfo = _.split(f[Object.keys(f)[0]], '^')
            //console.log('clipinfo: ', clipinfo);

            clip['Name'] = Object.keys(f)[0]

            if (replayMode === "Duration") {
                // Consider features whose Weight is more than Zero , which means they are included in the replay
                if (parseInt(clipinfo[0]) > 0) {
                    clip['Weight'] = parseInt(clipinfo[0])
                    clip['AttribValue'] = clipinfo[3].trim() === "false" ? false : true
                    clip['AttribName'] = clipinfo[4].trim()
                    clip['PluginName'] = clipinfo[5].trim()

                    clips.push(clip)
                }
            }

            if (replayMode === "Clips") {
                clip['Include'] = clipinfo[1] == "true" ? true : false
                // Include all Plugins
                _.forEach(pluginNamePlusAttribValues, (feature) => {
                    const featureValues = feature.split('|')
                    if (feature === clip['Name']) {
                        clip['AttribValue'] = featureValues[2].trim() === "false" ? false : true
                        clip['AttribName'] = featureValues[1].trim()
                        clip['PluginName'] = featureValues[0].trim()
                    }
                })

                clips.push(clip)
            }
            //clip['Duration'] = "-"
        })
        formValues['Priorities'] = {
            "Clips": clips
        }
        formValues['TransitionName'] = selectedTransition

        // Non Image Transitions may not have Config
        if (selectedTransitionConfig.hasOwnProperty("Config")){
            formValues['TransitionOverride'] = {
                "FadeInMs": parseFloat(fadeInMs),
                "FadeOutMs": parseFloat(fadeOutMs)
            }
        }

        
        return formValues
    }


    const handleFormSubmit = async (e) => {

        e.preventDefault();
        

        if (!formInvalid) {
            setIsLoading(true)
            try {
                await API.post('api', `replay`, {
                    body: getFormValues()
                });
                history.push({pathname: "/listReplays"});
            }
            catch (error) {
                console.log(error);
                return {success: false};
            }
            finally {
                setIsLoading(false)
            }
        }

    };


    const goBack = () => {
        history.goBack();
    };

    const handleInputChange = (e) => {
        if (e.target.id === 'desc') {
            setReplayDescription(e.target.value)
        }
        else if (e.target.id === 'duration') {
            setDuration(e.target.value)
            
        }
        else if (e.target.id === 'adInsertDuration') {
            setAdInsertDuration(e.target.value)
        }
        else if (e.target.id === 'uxlabel') {
            setUXlabel(e.target.value)
        }

    }

    const fetchAudioTracks = async (url) => {
        try {
            let response = await API.get('api', url);
            return {success: true, data: response};
        }
        catch (error) {
            return {success: false};
        }
    };

    
    const handlePreviewClose = () => {
        setPreviewOpen(false)
    }
    const handlePreviewClick = async (event) => {
        setPreviewOpen(true)
    }

    const handleTransitionChange = async (selectedValue, selectedConfig) => {
        setSelectedTransition(selectedValue);

        setSelectedTransitionConfig(selectedConfig)
        setFadeOutMs(
          selectedConfig.hasOwnProperty("Config")
            ? selectedConfig.Config.FadeOutMs
            : 0
        );

        setFadeInMs(
            selectedConfig.hasOwnProperty("Config")
              ? selectedConfig.Config.FadeInMs
              : 0
          );
    }

    const handleProgramChange = async (event) => {
        setSelectedProgram(event.target.value);
        setSelectedEvent("-NA-");
        // Only if Program and Event are available , initiate a lookup
        if (selectedEvent !== '-NA-' && event.target.value !== '-NA-') {
            let res = await fetchAudioTracks(`event/${selectedEvent}/program/${event.target.value}`)
            let resultEvent = res.data;
            if (res.success) {
                if (resultEvent.hasOwnProperty('AudioTracks'))
                    setAudioTrackOptions(resultEvent.AudioTracks);
            }
            else {
                setAudioTrackOptions([]);
                setSelectedAudioTrack("-NA-")
            }

            // Load features
            setAvailableFeatures([]);

            try {
                let res = await API.get('api', `replay/program/${event.target.value}/event/${selectedEvent}/features`);
                setAvailableFeatures(res);
            }
            catch (error) {

            }

        }

        //validateForm()
    }

    const handleReplayModeChange = async (event) => {
        setReplayMode(event.target.value);
    }

    const handleAdPositionChange = async (event) => {
        setAdPosition(event.target.value);
    }

    const handleAdInsertionModeChange = async (event) => {
        setAdInsertionMode(event.target.value);
    }

    const handleEventChange = async (event) => {
        if(event.target.value !== 'Load More') {
            setSelectedEvent(event.target.value);
        }

        if (event.target.value !== '-NA-' && selectedProgram !== '-NA-' && event.target.value !== 'Load More') {
            let res = await fetchAudioTracks(`event/${event.target.value}/program/${selectedProgram}`)
            let resultEvent = res.data;
            if (res.success && resultEvent !== null) {
                if (resultEvent.hasOwnProperty('AudioTracks'))
                    setAudioTrackOptions(resultEvent.AudioTracks);
            }
            else {
                setAudioTrackOptions([]);
                setSelectedAudioTrack("-NA-")
            }

            // Load features
            setAvailableFeatures([]);
            try {

                let res = await API.get('api', `replay/program/${selectedProgram}/event/${event.target.value}/features`);
                setAvailableFeatures(res);
            }
            catch (error) {

            }

        }

        //validateForm()

    }

    const handleReplayDurationChange = (e) => {
        setReplayDuration(e.target.value);
        
    }

    const handleFadeInChange = (e) => {
        setFadeInMs(e.target.value);
    }

    const handleFadeOutChange = (e) => {
        setFadeOutMs(e.target.value);
    }

    const handleAdInsertDurationChange = (e) => {
        if (e.target.value > 0) {
            setAdInsertDuration(e.target.value);
        }
    }

    const isFeatureSelected = () => {

        // let res = false
        // let i = 0
        // _.forEach(featuresObject, (key) => {
        //     const featValue = featuresObject[i][Object.keys(key)[0]]
        //     ++i
        //     const weight = featValue.split('^')[0]
        //     //console.log('weight: ', weight);

        //     if (parseInt(weight) >= 0){
        //         res = true
        //     }
        // })
        return true
    }

    React.useEffect(() => {
        //console.log(replayMode);
        if (selectedProgram === '-NA-' || selectedEvent === '-NA-' || selectedAudioTrack === '-NA-' || replayDescription.trim() === '' || uxlabel.trim() === '')
            setFormInvalid(true)
        else {
            if (outputFormat !== "") {
                if (resolutionValues.length === 0) {
                    setFormInvalid(true)
                    return
                }
            }

            if (replayMode === "Duration") {
                if (!isFeatureSelected()) {
                    setFormInvalid(true)
                }
                else
                    setFormInvalid(false)
            }
            else
                setFormInvalid(false)
        }

    }, [selectedProgram, selectedEvent, selectedAudioTrack, replayDescription, featuresObject, replayMode, resolutionValues, outputFormat, uxlabel]);

    // Updates the Weight state against the Feature Plugin Name
    // Used for persistence into DDB
    const handleOnWeightChange = (feature, weight, checkedInclude) => {
        let tmp = [...featuresObject]

        let i = 0
        _.forEach(tmp, (key) => {
            if (Object.keys(key)[0] === feature) {
                if (weight > 0)
                    //Weight, Include, Duration, AttribValue, AttribName, PluginName
                    tmp[i][Object.keys(key)[0]] = weight.toString() + "^" + checkedInclude + "^TBD" + "^" + feature.split('|')[2].trim() + "^" + feature.split('|')[1].trim() + "^" + feature.split('|')[0].trim()
                else
                    tmp[i][Object.keys(key)[0]] = weight.toString() + "^" + checkedInclude + "^TBD" + "^" + "-" + "^" + "-" + "^" + "-"
            }
            i++
        })

        setFeaturesObject(tmp)
    }

    React.useEffect(() => {

    }, [featuresObject]);


    const getAttributeValues = async () => {
        setIsLoadingAttribValues(true)
        let result = []
        await Promise.all(
            availableFeatures.map(async (feature) => {
                result.push(await getAttributeValue(feature))
            })
        )
        setIsLoadingAttribValues(false)
        return result
    }

    const getAttributeValue = async (feature) => {
        const pluginName = (feature.split('|')[0]).trim()
        //console.log('pluginName: ', pluginName);
        const pluginOutputAttribName = (feature.split('|')[1]).trim()
        //console.log('pluginOutputAttribName: ', pluginOutputAttribName);
        try {
            //console.log(`replay/feature/program/${selectedProgram}/event/${selectedEvent}/outputattribute/${pluginOutputAttribName}/plugin/${pluginName}`);
            let response = await API.get('api-data-plane', `replay/feature/program/${selectedProgram}/event/${selectedEvent}/outputattribute/${pluginOutputAttribName}/plugin/${pluginName}`);
            //console.log(response)
            return response
        }
        catch (error) {
            return {success: false};
        }
    }

    const handleOutputFormatChange = (event) => {
        setOutputFormat(event.target.value);
    }

    /* React.useEffect(() => {

   }, [pluginAttributeValues]);
 */

    // Convert an array of Feature Plugin names into an array of objects having name and weight
    // This array gets used to handle WeightChange event and update state of each Weight with
    // the corresponding Feature Plugin
    React.useEffect(() => {
        
        (async () => {
            const pluginAttribValues = await getAttributeValues()
            //console.log('pluginAttribValues: ', pluginAttribValues);

            let featuresobjs = []
            let pluginNameAndValues = []

            // feature = TennisSegmentation - SetPoint
            _.forEach(availableFeatures, (feature) => {
                //console.log('feature: ', feature);

                //pluginAttrValues = False, True
                const filteredPlugins =  _.filter(pluginAttribValues, (ftr) => {
                    return ftr[feature]
                });
                //console.log(`filteredPlugins=${filteredPlugins}`);

                const pluginAttrValues = _.get(filteredPlugins, `[0]${[feature]}`, []);
                //console.log(`pluginAttrValues=${pluginAttrValues}`);
                
                _.forEach(pluginAttrValues, (pluginAttrVal) => {
                    //console.log('pluginAttrVal: ', pluginAttrVal);

                    //if (pluginAttrVal.toString() === 'False' || pluginAttrVal.toString() === 'false' || 
                    // Assume that Plugins store Feature results as bool in DDB
                    if (pluginAttrVal.toString() === 'false'){

                        if (featuresobjs.filter(f => f[feature + ' | ' + pluginAttrVal.toString()]).length === 0)
                            featuresobjs.push({[feature + ' | ' + pluginAttrVal.toString()]: "0^false^TBD^-"})

                        // TennisSegmentation - SetPoint - False
                        if (!pluginNameAndValues.includes(feature + ' | ' + pluginAttrVal.toString()))
                            pluginNameAndValues.push(feature + ' | ' + pluginAttrVal.toString())
                    }
                })

                // We Assume that Plugins persist feature output as a boolean. Since False is such a 
                // rare thing, we default the value to be True based on the features listed in each Plugin Attributes
                const pluginAttrVal = 'true' // Default Output Attr Result

                // // Make sure we dont add duplicates
                if (featuresobjs.filter(f => f[feature + ' | ' + pluginAttrVal]).length === 0)
                    featuresobjs.push({[feature + ' | ' + pluginAttrVal]: "0^false^TBD^-"})

                if (!pluginNameAndValues.includes(feature + ' | ' + pluginAttrVal))
                    pluginNameAndValues.push(feature + ' | ' + pluginAttrVal)

                   
                //}

            })
            //console.log(featuresobjs);
            setFeaturesObject(featuresobjs)

            setPluginNamePlusAttribValues(pluginNameAndValues)

        })();
    }, [availableFeatures]);

    const handleResolutionChange = (e) => {

        // For a Multi Select, the Value wil be an Array
        let filter = e.target.value;
        let tmpFltrValues = []
        _.forEach(filter, f => {
            tmpFltrValues.push(f)
        })
        setResolutionValues(tmpFltrValues)
    }

    const handleResolutionDeleteChip = (chipToDelete) => {
        const tmpFilterValues = _.filter(resolutionValues, item => {
            return item !== chipToDelete;
        });
        //
        setResolutionValues(tmpFilterValues)
    }

    
    const getFromDurationTolerance = (value) =>{
        setDurationFromToleranceValue(parseFloat(value))
    }
    
    const marks = [
        {
            value: 0,
            label: 0
        },
        
        {
            value: 60,
            label: 60
        }
    ];

    
    return (
        <div>
            {
                isLoading ?
                    <div>
                        <Backdrop open={true} className={classes.backdrop}>
                            <CircularProgress color="inherit"/>
                        </Backdrop>
                    </div> :
                    <form onSubmit={handleFormSubmit}>
                        <Grid container direction="column" spacing={3} className={classes.content}>

                            <Grid item>
                                <Breadcrumbs aria-label="breadcrumb">
                                    <Link color="inherit" component="button" variant="subtitle1" onClick={goBack}>
                                        {"Replays"}
                                    </Link>
                                    <Typography color="textPrimary">{"Create Replay"}</Typography>
                                </Breadcrumbs>
                            </Grid>

                            <Grid item sm={11}>
                                <Paper>
                                    <Grid container direction="column" spacing={4}>
                                        <Grid item sm={11}>
                                            <FormLabel
                                                required={true}>{"Program"}</FormLabel>
                                            <ProgramDropdown DisableLabel={true} handleChange={handleProgramChange}
                                                             selected={selectedProgram}
                                                             hasSelectAll={false}/>
                                        </Grid>
                                        <Grid item sm={11}>
                                            <FormLabel
                                                required={true}>{"Event"}</FormLabel>
                                            <EventDropdown DisableLabel={true} handleChange={handleEventChange}
                                                           selected={selectedEvent} SelectedProgram={selectedProgram}/>
                                        </Grid>
                                        <Grid item sm={11}>
                                            <FormControl variant="outlined" size="small" fullWidth>
                                                <FormLabel required={true}>{"Audio Track"}</FormLabel>
                                                <Select
                                                    value={selectedAudioTrack}
                                                    onChange={handleAudioTrackChange}
                                                >
                                                    <MenuItem value={"-NA-"}>--Select--</MenuItem>
                                                    {
                                                        _.map(audioTrackOptions, (audio, index) => {
                                                            return (
                                                                <MenuItem key={index} value={audio}>{audio}</MenuItem>
                                                            )
                                                        })
                                                    }
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        <Grid item sm={11}>
                                            <FormLabel
                                                required={true}>{"Description"}</FormLabel>
                                            <TextField
                                                className={classes.field}
                                                id="desc"
                                                size="small"
                                                variant="outlined"
                                                required
                                                fullWidth
                                                value={replayDescription}
                                                onChange={handleInputChange}
                                                multiline={true}
                                                rows={3}
                                                rowsMax={4}
                                            />
                                        </Grid>
                                        <Grid item sm={11}>
                                            <FormLabel
                                                required={true}>{"Fan experience UX label"}</FormLabel>
                                            <TextField
                                                className={classes.field}
                                                id="uxlabel"
                                                size="small"
                                                variant="outlined"
                                                required
                                                fullWidth
                                                value={uxlabel}
                                                onChange={handleInputChange}
                                            />
                                        </Grid>
                                        <Grid item sm={11}>
                                            <FormControlLabel control={
                                                <Checkbox
                                                    color="primary"
                                                    checked={checkBoxState.checkedIgnoreLowQualitySegments}
                                                    onChange={handleCheckBoxChange}
                                                    name="checkedIgnoreLowQualitySegments"
                                                    inputProps={{'aria-label': 'primary checkbox'}}
                                                />
                                            } label="Ignore low quality segments ?"/>
                                            <Tooltip title="Ignores all segments which have been disliked (thumbs down) in the Clip Preview page">
                                                <InfoIcon 
                                                    style={{color: "cornflowerblue", verticalAlign: "middle", cursor: "pointer"}}
                                                />
                                            </Tooltip>
                                            
                                        </Grid>
                                        <Grid item sm={11} style={{padding: "0px"}}>
                                            <FormControl component="fieldset" style={{width: "100%"}}>
                                                <RadioGroup aria-label="replayMode" name="replayMode" value={replayMode}
                                                            onChange={handleReplayModeChange}>
                                                    <TableContainer component={Paper}
                                                                    className={classes.expandableTableContainer}
                                                                    style={{padding: "0px", width: "100%"}}>
                                                        <Table aria-label="inner table" size="small"
                                                               style={{width: "100%"}}>
                                                            <TableBody>
                                                                <TableRow style={{height: "150px"}}>
                                                                
                                                                    <TableCell align="left" style={{borderBlock: "none", width: "20%"}}>
                                                                        <FormControlLabel value="Duration"
                                                                                        control={<Radio size="small"
                                                                                                        color="primary"/>}
                                                                                        label="Duration based (Secs)"/>
                                                                    </TableCell>
                                                                    <TableCell align="left" style={{borderBlock: "none", width: "25%", verticalAlign:"bottom"}}>
                                                                    {
                                                                        replayMode === "Duration" &&           
                                                                        <> 
                                                                            <TextField 
                                                                                className={classes.field}
                                                                                id="desc"
                                                                                size="small"
                                                                                variant="outlined"
                                                                                required
                                                                                value={replayDuration}
                                                                                onChange={handleReplayDurationChange}
                                                                                type={"number"}
                                                                            />
                                                                            <FormControlLabel 
                                                                                        control={
                                                                                            <>
                                                                                            <Typography id="non-linear-slider" gutterBottom style={{paddingTop:"10px"}}>
                                                                                                Target reel duration (Secs) : 
                                                                                            </Typography>
                                                                                            <Tooltip title="Segment clips vary in size. MRE will make best effort to include eligible segments within the target reel duration range.">
                                                                                                    <InfoIcon 
                                                                                                        style={{color: "cornflowerblue", verticalAlign: "middle", cursor: "pointer", paddingBottom: "1px", paddingLeft: "0px"}}
                                                                                                    />
                                                                                            </Tooltip>
                                                                                            
                                                                                            </>
                                                                                    }
                                                                                        style={{ paddingLeft: "10px", width: "100%" }}
                                                                                />
                                                                            
                                                                            {
                                                                                parseFloat(durationFromToleranceValue) > 0 ?
                                                                                <Typography id="non-linear-slider" gutterBottom style={{paddingTop:"5px"}}>
                                                                                                {parseFloat(replayDuration)} - {parseFloat(replayDuration) + parseFloat(durationFromToleranceValue)}
                                                                                            </Typography>
                                                                                    :
                                                                                    <Typography id="non-linear-slider" gutterBottom style={{paddingTop:"5px"}}>
                                                                                    {parseFloat(replayDuration) + parseFloat(durationFromToleranceValue)} - {parseFloat(replayDuration)}
                                                                                </Typography>

                                                                            }
                                                                            
                                                                                
                                                                            </>
                                                                        }
                                                                        </TableCell>
                                                                        <TableCell align="left" style={{borderBlock: "none", width: "35%"}}>
                                                                        {
                                                                            replayMode === "Duration" &&  
                                                                            <>
                                                                            <FormControlLabel 
                                                                                            control={
                                                                                            <>
                                                                                                <Typography
                                                                                                    className={classes.title}
                                                                                                    variant="body2"
                                                                                                    id="tableTitle"
                                                                                                    component="div">
                                                                                                    Tolerance (Secs)
                                                                                                </Typography>
                                                                                                <Tooltip title="Tolerance can be used to control the maximum duration of the hightlights reel. ">
                                                                                                    <InfoIcon 
                                                                                                        style={{color: "cornflowerblue", verticalAlign: "middle", cursor: "pointer", paddingBottom: "1px", paddingLeft: "2px"}}
                                                                                                    />
                                                                                                </Tooltip> 
                                                                                            </>
                                                                                        }
                                                                                        style={{paddingLeft: "10px", paddingBottom: "5px"}}/>
                                                                            <Box style={{
                                                                                borderStyle: "solid",
                                                                                borderColor: "gray",
                                                                                paddingLeft: 40,
                                                                                paddingRight: 40,
                                                                                paddingTop: 50,
                                                                                borderWidth: 1
                                                                            }}>
                                                                            {
                                                                                replayMode === "Duration" &&       
                                                                                <>
                                                                                    
                                                                                    <Slider
                                                                                        getAriaValueText={getFromDurationTolerance}
                                                                                        valueLabelDisplay="on"
                                                                                        defaultValue={30}
                                                                                        step={1}
                                                                                        min={0}
                                                                                        max={60}
                                                                                        marks={marks}
                                                                                    />
                                                                                </>     
                                                                                
                                                                            }
                                                                            
                                                                            </Box>
                                                                            </>    
                                                                            }
                                                                        </TableCell>
                                                                    
                                                                    <TableCell align="left"
                                                                               style={{borderBlock: "none", width: "20%"}}>
                                                                        {
                                                                            replayMode === "Duration" &&  
                                                                            <FormControlLabel control={
                                                                                <Checkbox
                                                                                    color="primary"
                                                                                    checked={checkBoxState.checkedEqualDistro}
                                                                                    onChange={handleCheckBoxChange}
                                                                                    name="checkedEqualDistro"
                                                                                    inputProps={{'aria-label': 'primary checkbox'}}
                                                                                />
                                                                            } label="Equal distribution ?"/>
                                                                        }
                                                                    </TableCell>
                                                                </TableRow>
                                                                <TableRow className={classes.root}>
                                                                    <TableCell align="left" colSpan={2}
                                                                               style={{borderBlock: "none"}}>
                                                                        <FormControlLabel value="Clips"
                                                                                          control={<Radio size="small"
                                                                                                          color="primary"/>}
                                                                                          label="Clip feature based"/>
                                                                    </TableCell>
                                                                </TableRow>

                                                                <TableRow>
                                                                    <TableCell align="left" colSpan={5}>
                                                                        <FormControlLabel value="Clips"
                                                                                          control={<Typography
                                                                                              className={classes.title}
                                                                                              variant="h6"
                                                                                              id="tableTitle"
                                                                                              component="div">
                                                                                              Priorities
                                                                                          </Typography>}
                                                                                          style={{paddingLeft: "10px"}}/>
                                                                        <Box style={{
                                                                            borderStyle: "solid",
                                                                            borderColor: "gray",
                                                                            padding: 10,
                                                                            borderWidth: 1
                                                                        }}>
                                                                            <TableContainer component={Paper}
                                                                                            style={{paddingLeft: "10px"}}>
                                                                                <Table aria-label="inner table"
                                                                                       size="small"
                                                                                       style={{width: "100%"}}>
                                                                                    <TableHead>
                                                                                        <TableRow>
                                                                                            <TableCell align="left">Feature
                                                                                                Plugin</TableCell>
                                                                                            {
                                                                                                replayMode === "Duration" &&
                                                                                                <TableCell
                                                                                                    align="center">Weight
                                                                                                    (1 - 100, 0 -
                                                                                                    Exclude)</TableCell>
                                                                                            }

                                                                                            {
                                                                                                replayMode !== "Duration" &&
                                                                                                <TableCell
                                                                                                    align="center">Include
                                                                                                    ?</TableCell>
                                                                                            }

                                                                                            {/* <TableCell align="left">Duration</TableCell> */}
                                                                                        </TableRow>
                                                                                    </TableHead>
                                                                                    {
                                                                                        isLoadingAttribValues ?
                                                                                            <div>
                                                                                                <Backdrop open={true}
                                                                                                          className={classes.backdrop}>
                                                                                                    <CircularProgress
                                                                                                        color="inherit"/>
                                                                                                </Backdrop>
                                                                                            </div> :
                                                                                            <TableBody>
                                                                                                {/* {
                                                                        availableFeatures.length === 0 && replayMode === "Duration" &&
                                                                        <TableRow className={classes.root}>
                                                                            <TableCell align="center" size="medium" colSpan={4}>
                                                                                <Typography color="primary" >{"N/A"}</Typography>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    } */}
                                                                                                {
                                                                                                    _.map(pluginNamePlusAttribValues, (feature, index) => {
                                                                                                        return <PluginPriorityItem
                                                                                                            key={index}
                                                                                                            Feature={feature}
                                                                                                            onWeightChange={handleOnWeightChange}
                                                                                                            Duration="TBD"
                                                                                                            ReplayMode={replayMode}
                                                                                                        />
                                                                                                    })
                                                                                                }
                                                                                                {
                                                                                                    pluginNamePlusAttribValues.length === 0 &&
                                                                                                    <TableRow
                                                                                                        className={classes.root}>
                                                                                                        <TableCell
                                                                                                            align="center"
                                                                                                            size="medium"
                                                                                                            colSpan={4}>
                                                                                                            <Typography
                                                                                                                color="primary">{"No feature plugins available"}</Typography>
                                                                                                        </TableCell>
                                                                                                    </TableRow>
                                                                                                }
                                                                                            </TableBody>
                                                                                    }
                                                                                </Table>
                                                                            </TableContainer>
                                                                        </Box>
                                                                    </TableCell>
                                                                </TableRow>


                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                </RadioGroup>
                                            </FormControl>
                                        </Grid>

                                        <Grid item sm={8} style={{paddingBottom: "5px", paddingTop: "0px"}}>
                                            <FormControlLabel control={
                                                <Checkbox
                                                    color="primary"
                                                    checked={checkBoxState.checkedCatchup}
                                                    onChange={handleCheckBoxChange}
                                                    name="checkedCatchup"
                                                    inputProps={{'aria-label': 'uncontrolled-checkbox'}}
                                                />
                                            } label="Catchup?"/>
                                        </Grid>

                                        <Grid item sm={8} style={{paddingBottom: "5px", paddingTop: "0px"}}>
                                            <RadioGroup value={outputFormat} onChange={handleOutputFormatChange}>
                                                <FormControlLabel control={
                                                    <Radio
                                                        value={"Mp4"}
                                                        color="primary"
                                                    />
                                                } label="Create MP4 Program"/>
                                                <FormControlLabel control={
                                                    <Radio
                                                        value={"Hls"}
                                                        color="primary"
                                                    />
                                                } label="Create HLS Program"/>
                                            </RadioGroup>


                                        </Grid>
                                        <Grid item sm={10}
                                              style={{marginLeft: "55px", paddingBottom: "5px", paddingTop: "10px"}}>
                                            <FormControlLabel control={
                                                <MultiSelectWithChips
                                                    label="Output Resolutions *"
                                                    options={HlsResolutions}
                                                    selected={resolutionValues}
                                                    handleChange={handleResolutionChange}
                                                    handleDelete={handleResolutionDeleteChip}
                                                    hasDropdownComponent={false}
                                                    fullWidth={false}
                                                    disabled={outputFormat === ""}
                                                />
                                            }/>
                                        </Grid>

                                        <Grid item sm={11} style={{paddingBottom: "10px", paddingTop: "10px"}}>
                                            <FormControlLabel value="VideoTransitionEffects"
                                                control={<Typography
                                                className={classes.title}
                                                variant="h6"
                                                id="tableTitle"
                                                component="div">
                                                Video Transition Effects
                                                </Typography>}
                                                style={{paddingLeft: "10px", paddingBottom: "10px"}}/>

                                                <Box style={{
                                                    borderStyle: "solid",
                                                    borderColor: "gray",
                                                    padding: 10,
                                                    borderWidth: 1
                                                }}>
                                                    <FormControlLabel label="Transition" labelPlacement="start" control={ 
                                                        <TransitionsDropdown DisableLabel={true} handleTransitionChange={handleTransitionChange}
                                                                    selected={selectedTransition}
                                                                    hasSelectAll={false}/>

                                                    }/>
                                                    {
                                                        selectedTransition !== "None" &&
                                                        <>
                                                            <Tooltip title="Preview Transition effect">
                                                                <PlayCircleFilledIcon  
                                                                    color={selectedTransition === "None" ? "initial" : "primary"} 
                                                                    style={{ marginLeft: "20px", verticalAlign: "middle", cursor: "pointer"}}
                                                                    onClick={handlePreviewClick}
                                                                    
                                                                />
                                                            </Tooltip>
                                                            <TableContainer component={Paper}
                                                                        className={classes.expandableTableContainer}
                                                                        style={{paddingTop: "10px", width: "100%"}}>
                                                                <Table aria-label="inner table" size="small"
                                                                    style={{width: "100%"}}>
                                                                    <TableBody>
                                                                        <TableRow className={classes.root}>
                                                                            <TableCell align="left"
                                                                                    style={{borderBlock: "none", width: "20%"}}>
                                                                                Description
                                                                            </TableCell>
                                                                            <TableCell align="left"
                                                                                    style={{borderBlock: "none"}}>
                                                                                {
                                                                                    selectedTransitionConfig.Description
                                                                                }
                                                                            </TableCell>
                                                                        </TableRow>
                                                                        {   
                                                                            selectedTransitionConfig.hasOwnProperty("Config") &&
                                                                            <>
                                                                            <TableRow className={classes.root}>
                                                                                <TableCell align="left"
                                                                                        style={{borderBlock: "none"}}>
                                                                                    Fade in (ms)
                                                                                </TableCell>
                                                                                <TableCell align="left" style={{borderBlock: "none"}}>
                                                                                    <>
                                                                                    <FormControlLabel control={ 
                                                                                            <TextField
                                                                                                className={classes.field}
                                                                                                id="desc"
                                                                                                size="small"
                                                                                                variant="outlined"
                                                                                                required
                                                                                                value={fadeInMs}
                                                                                                onChange={handleFadeInChange}
                                                                                                type={"number"}
                                                                                            />
                                                                                        }/>
                                                                                    <Tooltip title="Specify the length of time, in milliseconds for the transition overlay image to reach full opacity">
                                                                                        <InfoIcon 
                                                                                            style={{color: "cornflowerblue", verticalAlign: "middle", cursor: "pointer"}}
                                                                                        />
                                                                                    </Tooltip>    
                                                                                    </>
                                                                                </TableCell>
                                                                            </TableRow>
                                                                            <TableRow className={classes.root}>
                                                                                <TableCell align="left"
                                                                                        style={{borderBlock: "none"}}>
                                                                                        Fade Out (ms)
                                                                                </TableCell>
                                                                                <TableCell align="left"
                                                                                        style={{borderBlock: "none"}}>
                                                                                        <>
                                                                                        <FormControlLabel control={ 
                                                                                            <TextField
                                                                                                className={classes.field}
                                                                                                id="desc"
                                                                                                size="small"
                                                                                                variant="outlined"
                                                                                                required
                                                                                                value={ fadeOutMs }
                                                                                                onChange={handleFadeOutChange}
                                                                                                type={"number"}
                                                                                            />
                                                                                        }/>
                                                                                        <Tooltip title="Specify the length of time, in milliseconds for the transition overlay image to reach full transparency">
                                                                                            <InfoIcon 
                                                                                                style={{color: "cornflowerblue", verticalAlign: "middle", cursor: "pointer"}}
                                                                                            />
                                                                                        </Tooltip>    
                                                                                        </>
                                                                                </TableCell>
                                                                            </TableRow>
                                                                            </>
                                                                        }
                                                                        {   
                                                                            selectedTransitionConfig.hasOwnProperty("PreviewVideoLocation") &&
                                                                            <TableRow className={classes.root}>
                                                                                <TableCell align="left"
                                                                                        style={{borderBlock: "none"}}>
                                                                                    Preview clip location
                                                                                </TableCell>
                                                                                <TableCell align="left"
                                                                                        style={{borderBlock: "none"}}>
                                                                                    {
                                                                                        selectedTransitionConfig.PreviewVideoLocation
                                                                                    }
                                                                                </TableCell>
                                                                            </TableRow>
                                                                        }
                                                                        {   
                                                                            selectedTransitionConfig.hasOwnProperty("TransitionClipLocation") &&
                                                                            <TableRow className={classes.root}>
                                                                                <TableCell align="left"
                                                                                        style={{borderBlock: "none"}}>
                                                                                    Transition clip location
                                                                                </TableCell>
                                                                                <TableCell align="left"
                                                                                        style={{borderBlock: "none"}}>
                                                                                    {
                                                                                        selectedTransitionConfig.TransitionClipLocation
                                                                                    }
                                                                                </TableCell>
                                                                            </TableRow>
                                                                        }
                                                                        {   
                                                                            selectedTransitionConfig.hasOwnProperty("ImageLocation") &&
                                                                            <TableRow className={classes.root}>
                                                                                <TableCell align="left"
                                                                                        style={{borderBlock: "none"}}>
                                                                                    Transition image location
                                                                                </TableCell>
                                                                                <TableCell align="left"
                                                                                        style={{borderBlock: "none"}}>
                                                                                    {
                                                                                        selectedTransitionConfig.ImageLocation
                                                                                    }
                                                                                </TableCell>
                                                                            </TableRow>
                                                                        }
                                                                        
                                                                    </TableBody>
                                                                </Table>
                                                            </TableContainer>
                                                        </>
                                                    }
                                                    
                                                </Box>

                                        </Grid>

                                    </Grid>
                                </Paper>
                                <Box py={3}>
                                    <Grid container item direction="row" justify="flex-end" spacing={3}>
                                        <Grid item>
                                            <Button color="primary" onClick={goBack}>
                                                <Typography variant="subtitle1">Cancel</Typography>
                                            </Button>
                                        </Grid>
                                        <Grid item>
                                            <Button disabled={formInvalid} color="primary" variant="contained"
                                                    type="submit">
                                                <Typography variant="subtitle1">Create Replay</Typography>
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>
                        </Grid>

                        
                    </form>
            }

            {
                previewOpen &&
                <TransitionClipPreview 
                    Open={previewOpen} 
                    OnPreviewClose={handlePreviewClose} 
                    TransitionName={selectedTransition}
                    TransitionConfig={selectedTransitionConfig}/>

            }

        </div>
    );
}

