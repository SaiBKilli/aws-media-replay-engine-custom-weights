/*
 *
 *  * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  * SPDX-License-Identifier: MIT-0
 *
 */

import React, {useEffect} from 'react';
import {useParams} from "react-router-dom";
import {makeStyles} from '@material-ui/core/styles';
import {Streamer} from "../../components/Streamer/Streamer";
import screenfull from "screenfull"
import _ from "lodash";
import {formatVideoTime} from "../../common/utils/utils";
import {CollapsedMenuOverlay} from "../../components/CollapsedMenuOverlay/CollapsedMenuOverlay";
import {ExpandedMenuOverlay} from "../../components/ExpandedMenuOverlay/ExpandedMenuOverlay";
import {API} from "aws-amplify";
import {Backdrop, CircularProgress} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100vw',
        height: '100vh',
        '& video': {
            objectFit: 'cover',
        },
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: theme.palette.secondary.main,
    },
    captionOverlay: {
        position: 'absolute',
        top: "10vh",
        left: "2vw",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        padding: 2,
    },
    fadeOut: {
        opacity: 0,
        transition: "opacity 4s ease"
    }
}));

export const HighlightViewer = (props) => {
    const classes = useStyles();
    const {event} = useParams();
    const {program} = useParams();
    const {replayId} = useParams();

    const [isPlaying, setIsPlaying] = React.useState(true);
    const [volume, setVolume] = React.useState(0.8);
    const [isFullScreen, setIsFullScreen] = React.useState(true);
    const [playedSeconds, setPlayedSeconds] = React.useState(0);
    const [progress, setProgress] = React.useState(0);
    const [seeking, setSeeking] = React.useState(false);
    const [isMenuExpanded, setIsMenuExpanded] = React.useState(true);
    const [segments, setSegments] = React.useState(null);
    const [eventDetails, setEventDetails] = React.useState(null);
    const [streamURL, setStreamURL] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [caption, setCaption] = React.useState(false);
    const [fade, setFade] = React.useState(undefined);
    const [totalHighlightsTimeSeconds, setTotalHighlightsTimeSeconds] = React.useState(undefined);
    const playerRef = React.useRef(false);
    const playerContainerRef = React.useRef(null);

    const currentTime = playerRef.current && playerRef.current.getCurrentTime();
    const elapsedTime = formatVideoTime(currentTime);
    const duration = playerRef.current && formatVideoTime(playerRef.current.getDuration());

    const addNormalizedStartTime = (originalSegments) => {
        let lastStartTime = 0;

        let result = _.map(originalSegments, (segment, index) => {
            segment['normalizedStartTimeSeconds'] = lastStartTime;
            lastStartTime = lastStartTime + (segment['OptoEnd'] || segment['End'] || 0) - (segment['OptoStart'] || segment['Start'] || 0);
            return segment;
        });

        return result;
    };

    React.useEffect(() => {


        _.map(segments, (segment, index) => {
            if (playedSeconds === 0) {
                handleCaptionChange("Clip" + 0)
            }
            if (_.parseInt(segment['normalizedStartTimeSeconds']) >= playedSeconds - 1 &&
                _.parseInt(segment['normalizedStartTimeSeconds']) < playedSeconds + 1) {
                handleCaptionChange("Clip" + index)
            }

            if (_.parseInt(playedSeconds) + 1 > _.parseInt(totalHighlightsTimeSeconds)) {
                handlePlayPause();
            }
        })

    }, [playedSeconds]);

    React.useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);
                const [segmentsResponse, eventDetails, replayResponse] = await Promise.all([
                    await API.get('api-data-plane', `event/${event}/program/${program}/replay/${replayId}/segments`),
                    await API.get('api', `event/${event}/program/${program}`),
                    await API.get('api', `replay/program/${program}/event/${event}/replayid/${replayId}`)
                ]);

                let segmentsWithStartTime = addNormalizedStartTime(segmentsResponse);

                const lastSegment = _.last(segmentsWithStartTime);

                setTotalHighlightsTimeSeconds(
                    lastSegment['normalizedStartTimeSeconds'] +
                    (lastSegment['OptoEnd'] || lastSegment['End'] || 0) -
                    (lastSegment['OptoStart'] || lastSegment['Start'] || 0)
                );

                let hlsLocation = replayResponse.HlsLocation;

                if (hlsLocation) {
                    let url = hlsLocation.split('/').splice(3, 5).join('/');
                    setStreamURL("/" + url);
                }

                setEventDetails(eventDetails);
                setSegments(segmentsWithStartTime);
            }
            finally {
                setIsLoading(false);
            }

        })();
    }, []);

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const handleFastForward = () => {
        playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10);
    };

    const handleVolumeChange = (e, newValue) => {
        setVolume(parseFloat(newValue / 100));
    };

    const handleToggleFullScreen = () => {
        screenfull.toggle(playerContainerRef.current);
        setIsFullScreen(!isFullScreen);
    };

    const handleProgress = (changeState) => {
        if (!seeking) {
            setProgress(changeState.played);
            setPlayedSeconds(_.parseInt(changeState.playedSeconds));
        }
    };

    const handleSeekChange = (e, newValue) => {
        setProgress(parseFloat(newValue / 100));
    };

    const handleSeekMouseDown = (e) => {
        setSeeking(true);
    };

    const handleSeekMouseUp = (e, newValue) => {
        setSeeking(false);
        playerRef.current.seekTo(newValue / 100);
    };

    const handleExpandMenu = () => {
        setIsMenuExpanded(true);
    };

    const handleCollapseMenu = () => {
        setIsMenuExpanded(false);
    };

    const handleSkipToSeconds = (seconds) => {
        playerRef.current.seekTo(seconds);
        setIsPlaying(true);
    };

    const handleCaptionChange = (caption) => {
        setCaption(caption);

        setTimeout(() => {
            setFade(true);
        }, 4000);

        setFade(false);
    };

    return (
        <section className={classes.root} ref={playerContainerRef}>
            {
                isLoading ?
                    <div>
                        <Backdrop className={classes.backdrop} open={true}>
                            <CircularProgress color="inherit"/>
                        </Backdrop>
                    </div> :
                    <>
                        <Streamer
                            url={process.env.REACT_APP_CLOUDFRONT_PREFIX + streamURL}
                            playing={isPlaying}
                            setIsPlaying={handlePlayPause}
                            playerRef={playerRef}
                            volume={volume}
                            onProgressChange={handleProgress}
                        />
                        {
                            <div className={clsx(classes.captionOverlay, fade && classes.fadeOut)}>
                                <Typography
                                    variant="h2"
                                >
                                    {caption}
                                </Typography>
                            </div>
                        }
                        <ExpandedMenuOverlay
                            isHidden={!isMenuExpanded}
                            playing={isPlaying}
                            volume={volume}
                            isFullScreen={isFullScreen}
                            playedSeconds={playedSeconds}
                            progress={progress}
                            playerRef={playerRef}
                            elapsedTime={elapsedTime}
                            totalDuration={duration}
                            seeking={seeking}
                            onCollapseClick={handleCollapseMenu}
                            onPlayPauseClick={handlePlayPause}
                            onFastForwardClick={handleFastForward}
                            onVolumeChangeSlide={handleVolumeChange}
                            onToggleFullScreen={handleToggleFullScreen}
                            onSeekMouseUp={handleSeekMouseUp}
                            onSeekMouseDown={handleSeekMouseDown}
                            onSeek={handleSeekChange}
                            segments={segments}
                            seekToSeconds={handleSkipToSeconds}
                            eventDetails={eventDetails}
                        />
                        :
                        <CollapsedMenuOverlay
                            isHidden={isMenuExpanded}
                            onExpandClick={handleExpandMenu}
                        />

                    </>
            }

        </section>
    );
}