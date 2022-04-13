Search.setIndex({docnames:["api/controlplane-contentgroup","api/controlplane-event","api/controlplane-model","api/controlplane-plugin","api/controlplane-profile","api/controlplane-program","api/controlplane-replay","api/controlplane-system","api/controlplane-workflow","api/dataplane","api/gateway","index","main"],envversion:{"sphinx.domains.c":2,"sphinx.domains.changeset":1,"sphinx.domains.citation":1,"sphinx.domains.cpp":5,"sphinx.domains.index":1,"sphinx.domains.javascript":2,"sphinx.domains.math":2,"sphinx.domains.python":3,"sphinx.domains.rst":2,"sphinx.domains.std":2,sphinx:56},filenames:["api/controlplane-contentgroup.rst","api/controlplane-event.rst","api/controlplane-model.rst","api/controlplane-plugin.rst","api/controlplane-profile.rst","api/controlplane-program.rst","api/controlplane-replay.rst","api/controlplane-system.rst","api/controlplane-workflow.rst","api/dataplane.rst","api/gateway.rst","index.rst","main.rst"],objects:{"":[[0,0,1,"delete-content-group","DELETE /contentgroup/{content_group}"],[1,0,1,"delete-processed-events-from-control","DELETE /event/processed/{id}"],[1,0,1,"delete-event","DELETE /event/{name}/program/{program}"],[10,0,1,"delete-payload","DELETE /external/{proxy+}"],[2,0,1,"delete-model","DELETE /model/{name}"],[2,0,1,"delete-model-version","DELETE /model/{name}/version/{version}"],[3,0,1,"delete-plugin","DELETE /plugin/{name}"],[3,0,1,"delete-plugin-version","DELETE /plugin/{name}/version/{version}"],[4,0,1,"delete-profile","DELETE /profile/{name}"],[5,0,1,"delete-program","DELETE /program/{program}"],[6,0,1,"delete-replay","DELETE /replay/event/{name}/program/{program}/id/{replayid}"],[10,0,1,"proxy","DELETE /{proxy+}"],[9,0,1,"get-clip-preview-feedback","GET /clip/preview/program/{program}/event/{event}/classifier/{classifier}/start/{start_time}/track/{audio_track}/reviewer/{reviewer}/feedback"],[0,0,1,"list-content-groups","GET /contentgroup/all"],[1,0,1,"list-events-all","GET /event/all"],[1,0,1,"list-events-external","GET /event/all/external"],[1,0,1,"list-events-by-content-group","GET /event/contentgroup/{content_group}/all"],[1,0,1,"list-future-events","GET /event/future/all"],[1,0,1,"get-all-queued-events","GET /event/queued/all/limit/{limit}/closestEventFirst/{closestEventFirst}"],[1,0,1,"list-range-based-events","GET /event/range/{fromDate}/{toDate}"],[1,0,1,"get-edl-by-event","GET /event/{name}/edl/program/{program}/track/{audiotrack}"],[1,0,1,"get-event-export-data","GET /event/{name}/export/data/program/{program}"],[1,0,1,"get-hls-manifest-by-event","GET /event/{name}/hls/eventmanifest/program/{program}/track/{audiotrack}"],[1,0,1,"get-event","GET /event/{name}/program/{program}"],[9,0,1,"get-optimized-clip-preview-details","GET /event/{name}/program/{program}/clipstart/{start}/clipduration/{duration}/track/{tracknumber}/classifier/{classifier}/opt/previewinfo"],[9,0,1,"get-original-clip-preview-details","GET /event/{name}/program/{program}/clipstart/{start}/clipduration/{duration}/track/{tracknumber}/classifier/{classifier}/org/previewinfo"],[9,0,1,"get-matching-replay-segments","GET /event/{name}/program/{program}/profileClassifier/{classifier}/track/{tracknumber}/replay/{replayId}/segments"],[9,0,1,"get-matching-replay-segments-v2","GET /event/{name}/program/{program}/profileClassifier/{classifier}/track/{tracknumber}/replay/{replayId}/segments/v2"],[9,0,1,"get-event-segments","GET /event/{name}/program/{program}/profileClassifier/{classifier}/track/{tracknumber}/segments"],[9,0,1,"get-event-segments-for-edl","GET /event/{name}/program/{program}/profileClassifier/{classifier}/track/{tracknumber}/segments/for/edl"],[9,0,1,"get-event-segments-v2","GET /event/{name}/program/{program}/profileClassifier/{classifier}/track/{tracknumber}/segments/v2"],[9,0,1,"get-replay-segments","GET /event/{name}/program/{program}/replay/{replayId}/segments"],[1,0,1,"get-event-status","GET /event/{name}/program/{program}/status"],[1,0,1,"get-first-pts","GET /event/{name}/program/{program}/timecode/firstpts"],[10,0,1,"get-payload","GET /external/{proxy+}"],[9,0,1,"get-feature-in-segment","GET /feature/in/segment/program/{program}/event/{event}/plugin/{pluginname}/attrn/{attrname}/attrv/{attrvalue}/start/{starttime}/end/{endtime}"],[9,0,1,"get-manifest-content","GET /manifest/{bucket}/{key}/{version}"],[9,0,1,"get-media-presigned-url","GET /media/{bucket}/{key}"],[9,0,1,"get-chunk-start-time","GET /metadata/chunk/start/{program}/{event}/{profile}/{reference_time}"],[9,0,1,"get-timecode-of-frame","GET /metadata/timecode/{program}/{event}/{filename}/{frame_number}"],[2,0,1,"list-models","GET /model/all"],[2,0,1,"list-models-by-contentgroup","GET /model/contentgroup/{content_group}/all"],[2,0,1,"list-models-by-pluginclass","GET /model/pluginclass/{plugin_class}/all"],[2,0,1,"list-models-by-pluginclass-and-contentgroup","GET /model/pluginclass/{plugin_class}/contentgroup/{content_group}/all"],[2,0,1,"get-model-by-name","GET /model/{name}"],[2,0,1,"list-model-versions","GET /model/{name}/version/all"],[2,0,1,"get-model-by-name-and-version","GET /model/{name}/version/{version}"],[3,0,1,"list-plugins","GET /plugin/all"],[3,0,1,"list-plugins-by-class","GET /plugin/class/{plugin_class}/all"],[3,0,1,"list-plugins-by-class-and-contentgroup","GET /plugin/class/{plugin_class}/contentgroup/{content_group}/all"],[3,0,1,"list-plugins-by-contentgroup","GET /plugin/contentgroup/{content_group}/all"],[3,0,1,"get-plugin-by-name","GET /plugin/{name}"],[3,0,1,"list-plugin-versions","GET /plugin/{name}/version/all"],[3,0,1,"get-plugin-by-name-and-version","GET /plugin/{name}/version/{version}"],[4,0,1,"list-profiles","GET /profile/all"],[4,0,1,"list-profiles-by-contentgroup","GET /profile/contentgroup/{content_group}/all"],[4,0,1,"get-profile","GET /profile/{name}"],[5,0,1,"list-programs","GET /program/all"],[6,0,1,"get-all-replays","GET /replay/all"],[6,0,1,"listreplay-by-content-group","GET /replay/all/contentgroup/{contentGrp}"],[6,0,1,"get-all-replay-requests-for-completed-event","GET /replay/completed/events/track/{audioTrack}/program/{program}/event/{event}"],[6,0,1,"get-replay-export-data","GET /replay/export/data/{id}/event/{event}/program/{program}"],[9,0,1,"get-plugin-output-attributes-values","GET /replay/feature/program/{program}/event/{event}/outputattribute/{pluginattribute}/plugin/{pluginname}"],[6,0,1,"get-mre-stream-auth","GET /replay/mre/streaming/auth"],[6,0,1,"listreplay-by-program-event","GET /replay/program/{program}/event/{event}/all"],[6,0,1,"getfeatures-by-program-event","GET /replay/program/{program}/event/{event}/features"],[6,0,1,"get-hls-manifest-by-replayid","GET /replay/program/{program}/event/{event}/hls/replaymanifest/replayid/{replayid}"],[6,0,1,"get-replay-by-program-event-id","GET /replay/program/{program}/event/{event}/replayid/{id}"],[6,0,1,"get-all-replays-for-segment-end","GET /replay/program/{program}/event/{event}/segmentend"],[6,0,1,"get-replay-hls-locations","GET /replay/program/{program}/gameid/{event}/hls/stream/locations"],[6,0,1,"get-all-replay-requests-for-event-optosegment-end","GET /replay/track/{audioTrack}/program/{program}/event/{event}"],[9,0,1,"get-segments-for-event","GET /segments/all/program/{program}/event/{event}/classifier/{classifier}/replay"],[7,0,1,"list-system-configurations","GET /system/configuration/all"],[7,0,1,"get-system-configuration","GET /system/configuration/{name}"],[7,0,1,"list-medialive-channels","GET /system/medialive/channels"],[7,0,1,"list-mediatailor-channels","GET /system/mediatailor/channels"],[7,0,1,"list-mediatailor-playback-configurations","GET /system/mediatailor/playbackconfigurations"],[7,0,1,"generate-uuid","GET /system/uuid"],[7,0,1,"version","GET /system/version"],[9,0,1,"version","GET /version"],[8,0,1,"get-plugin-execution-status","GET /workflow/execution/program/{program}/event/{event}/chunk/{chunk_num}/plugin/{plugin_name}/status"],[8,0,1,"list-incomplete-plugin-executions","GET /workflow/execution/program/{program}/event/{event}/chunk/{chunk_num}/plugin/{plugin_name}/status/incomplete"],[10,0,1,"id1","GET /{proxy+}"],[9,0,1,"record-clip-preview-feedback","POST /clip/preview/feedback"],[9,0,1,"store-clip-result","POST /clip/result"],[1,0,1,"create-event","POST /event"],[1,0,1,"store-audio-tracks","POST /event/metadata/track/audio"],[1,0,1,"update-edl-for-event","POST /event/program/edllocation/update"],[1,0,1,"update-hls-manifest-for-event","POST /event/program/hlslocation/update"],[10,0,1,"post-payload","POST /external/{proxy+}"],[9,0,1,"store-chunk-metadata","POST /metadata/chunk"],[9,0,1,"store-frame","POST /metadata/frame"],[2,0,1,"register-model","POST /model"],[3,0,1,"register-plugin","POST /plugin"],[9,0,1,"get-dependent-plugins-output","POST /plugin/dependentplugins/output"],[9,0,1,"store-plugin-result","POST /plugin/result"],[4,0,1,"create-profile","POST /profile"],[6,0,1,"add-replay","POST /replay"],[6,0,1,"update-mp4-for-replay-request","POST /replay/mp4location/update"],[9,0,1,"update-replay-results","POST /replay/result"],[6,0,1,"update-hls-for-replay-request","POST /replay/update/hls/manifest"],[9,0,1,"get-chunks-for-segment","POST /workflow/engine/clipgen/chunks"],[9,0,1,"get-segments-for-clip-generation","POST /workflow/engine/clipgen/segments"],[8,0,1,"record-execution-details","POST /workflow/execution"],[9,0,1,"get-segment-state-for-labeling","POST /workflow/labeling/segment/state"],[9,0,1,"get-segment-state-for-optimization","POST /workflow/optimization/segment/state"],[9,0,1,"get-segment-state","POST /workflow/segment/state"],[10,0,1,"id2","POST /{proxy+}"],[0,0,1,"put-content-group","PUT /contentgroup/{content_group}"],[9,0,1,"get-all-event-segments","PUT /event/program/export/all/segments"],[1,0,1,"store-event-export-data","PUT /event/program/export_data"],[1,0,1,"update-event","PUT /event/{name}/program/{program}"],[1,0,1,"store-frame-rate","PUT /event/{name}/program/{program}/framerate/{frame_rate}"],[1,0,1,"update-event-with-replay","PUT /event/{name}/program/{program}/hasreplays"],[1,0,1,"put-event-status","PUT /event/{name}/program/{program}/status/{status}"],[1,0,1,"store-first-pts","PUT /event/{name}/program/{program}/timecode/firstpts/{first_pts}"],[10,0,1,"put-payload","PUT /external/{proxy+}"],[2,0,1,"update-model-status","PUT /model/{name}/status"],[2,0,1,"update-model-version-status","PUT /model/{name}/version/{version}/status"],[3,0,1,"update-plugin-status","PUT /plugin/{name}/status"],[3,0,1,"update-plugin-version-status","PUT /plugin/{name}/version/{version}/status"],[4,0,1,"update-profile","PUT /profile/{name}"],[4,0,1,"update-profile-status","PUT /profile/{name}/status"],[5,0,1,"create-program","PUT /program/{program}"],[6,0,1,"store-replay-export-data","PUT /replay/event/program/export_data"],[6,0,1,"update-replay-request-status","PUT /replay/program/{program}/event/{event}/replayid/{id}/status/update/{replaystatus}"],[7,0,1,"put-system-configuration","PUT /system/configuration"],[8,0,1,"put-plugin-execution-status","PUT /workflow/execution/program/{program}/event/{event}/chunk/{chunk_num}/plugin/{plugin_name}/status/{status}"],[10,0,1,"id3","PUT /{proxy+}"],[0,0,1,"","aws-mre-controlplane-contentgroup-api"],[1,0,1,"","aws-mre-controlplane-event-api"],[2,0,1,"","aws-mre-controlplane-model-api"],[3,0,1,"","aws-mre-controlplane-plugin-api"],[4,0,1,"","aws-mre-controlplane-profile-api"],[5,0,1,"","aws-mre-controlplane-program-api"],[6,0,1,"","aws-mre-controlplane-replay-api"],[7,0,1,"","aws-mre-controlplane-system-api"],[8,0,1,"","aws-mre-controlplane-workflow-api"],[9,0,1,"","aws-mre-dataplane-api"],[10,0,1,"","aws-mre-gateway-api"]]},objnames:{"0":["chalice","route","Chalice route"]},objtypes:{"0":"chalice:route"},terms:{"00":9,"1":[1,6],"1080":6,"1280":6,"1440":6,"16":6,"1920":6,"2160":6,"2560":6,"2k":6,"360":6,"360p":6,"3840":6,"4":6,"400":[1,2,3,4,6,7,9],"404":[1,2,3,4,6,7,9],"409":[1,4,6],"480":6,"480p":6,"4k":6,"5":6,"500":[0,1,2,3,4,5,6,7,8,9],"60":3,"608":6,"640":6,"720":6,"720p":6,"854":6,"864":6,"9":6,"boolean":[1,2,3,4,6],"case":9,"class":2,"default":[2,3,4,9],"function":[3,8],"new":[0,1,2,3,4,5,6,7],"return":[0,1,2,3,4,5,6,7,8,9,10],"true":[1,2,3,4,6],A:[1,2,3,4,6,7,9],By:[2,3,4,9],For:[2,3,9],If:[2,3,9],In:[2,3,4],One:[2,3,4],The:[1,4,7,9],These:3,about:9,accur:9,achiev:3,actual:1,ad:7,add:6,addit:[1,9],addition:4,additionalinfo:9,after:[1,9],all:8,allow:7,along:[6,9],also:[2,3,4],an:[1,2,3,6,8,9],analysi:4,ani:[7,8,9],api_vers:[7,9],ar:[2,3,4,6,7,8,9],archiv:1,arn:[2,3],around:9,associ:9,attribnam:6,attribut:[3,6,9],attribute1:3,attribvalu:6,audienc:6,audio:[3,6],audiotrack:9,authent:10,authinfo:6,author:[1,6],avoid:7,backup:1,badrequesterror:[1,2,3,4,6,7,9],base:[1,6,9],bearer:10,befor:[3,9],behavior:3,being:[1,6],besid:9,between:9,bodi:[1,2,3,4,6,7,8,9],bootstraptimeinminut:1,both:9,broadcast:1,cach:6,call:[6,7,9],can:[2,3,4,6,9],captur:[6,9],catchup:6,certain:9,chaliceviewerror:[0,1,2,3,4,5,6,7,8,9],channel:1,chunk:4,chunknumb:[8,9],chunksiz:[4,9],chunkstart:9,classifi:[2,3,4],client:6,clip:[6,7],clipfeaturebasedsummar:6,cloudfront:6,complet:[7,9],concurr:7,configur:[3,4,9],configuration1:[3,4],conflicterror:[1,4,6],contain:[1,2,3,9],content:[0,1,2,3,4,6,9],contentgroup:[11,12],control:[1,7,9],controlplan:[10,11,12],cooki:6,copi:[2,3],creat:[0,1,2,3,4,5,6,9],createhl:6,createmp4:6,creation:1,cred:6,current:[8,9],custom:2,dai:[6,7],data:9,dataplan:[11,12],datastor:9,date:1,datetim:1,defin:6,depend:[3,4,9],dependentplugin:[3,4],descript:[1,2,3,4,6],detail:[4,8],detector:9,dict:[1,2,3,4,6],dictionari:9,disabl:[2,3,4],doesn:[8,9],download:9,durat:[1,6],durationbasedsummar:6,durationminut:1,dure:9,dynamodb:9,e:9,each:[2,3,4,6,9],either:[8,9],element:1,els:[1,9],empti:9,enabl:[2,3,4],encapsul:3,end:3,endpoint:2,equaldistribut:6,event:[11,12],exampl:[2,3],except:[2,3],execut:3,executelambdaqualifiedarn:3,executionid:[8,9],executiontyp:3,exist:[1,2,3,7,8,9],fals:[6,9],far:9,featur:[2,3,4],featurecount:9,feedbackdetail:9,fetch:9,ffmpeg:9,file:[6,9],filenam:8,filltoexact:6,filter:1,first:[1,6,9],flag:1,follow:3,format:[1,6],found:9,frame:[1,4],framenumb:9,framework:7,framework_vers:7,frameworkvers:3,from:[1,7,9],gatewai:[11,12],gener:[1,6,7,9],given:[8,9],group:[0,1,2,3,4,6],ha:[2,3],harvest:1,have:[3,4,9],held:7,help:[1,3,6,7],hl:9,hold:[2,3],how:9,hr:1,i:9,iam:10,id:[3,4],ideal:9,identifi:[1,9],impact:3,implement:3,includ:[2,3,4,6,8,9],include_dis:[2,3,4],indic:[1,3,9],initi:1,inprogress:6,input:9,integ:[1,8,9],integr:[1,10],invok:10,item:[1,9],jwt:[6,10],kei:6,keypaidid:6,label:[2,3,4],lambda:3,lastevaluatedkei:[1,9],lastmodifi:4,latest:[2,3],learn:[2,3],length:4,less:9,limit:9,link:6,list:[0,1,2,3,4,5,6,7,8,9],live:[1,7],local:6,locat:[1,9],logic:[3,4],m3u8:9,machin:[2,3],mai:9,make:[1,6],mani:9,manifest:1,match:9,maxconcurrentworkflow:7,maximum:7,maxsegmentlength:9,maxsegmentlengthsecond:4,meant:10,media:7,medial:1,metadata:7,minut:1,ml:[2,3],mlmodelconfidencescor:3,model:[3,11,12],modelendpoint:[3,4,9],modul:7,more:[1,4,9],mp4:6,mpeg:9,name:[0,5],necessarili:9,need:[2,3,6,9],next:[1,9],non:9,none:[0,1,2,3,4,5,6,7,8,9],notfounderror:[1,2,3,4,6,7,9],number:[1,2,3,4,6,7,8,9],obj:1,object:[1,9],octet:[1,6],onc:7,one:[3,4,9],onli:[2,3,4,9],oper:3,optim:[2,3,4],optimizedcliploc:9,optimizedfeedback:9,optimizedthumbnailloc:9,option:4,optolength:9,order:[2,3,4],origin:9,originalcliploc:9,originalfeedback:9,originalthumbnailloc:9,origlength:9,otherwis:6,output:[3,6],outputattribut:3,outputattributesnamelist:9,pagin:1,pair:6,param:9,paramet:[1,2,3,4,6,7,9],parameternam:7,parametervalu:7,part:8,partial:9,past:7,payload:1,perform:[2,3,4],period:7,pk:8,plane:[7,9],playback:7,plugin:[2,4,6,11,12],pluginclass:9,pluginnam:6,point:9,polici:6,pre:9,present:9,previou:9,prior:[2,3,8,9],prioriti:6,probe:1,process:[3,4,9],processingframer:[4,9],profil:[1,11,12],profilenam:9,program:[11,12],programid:1,progress:8,project:2,provid:9,pt:[1,9],publish:[2,3],purg:7,purpos:1,python:7,queri:[2,3,4,9],queu:6,queue:7,rais:[0,1,2,3,4,5,6,7,8,9],random:7,rang:9,rate:1,reach:7,record:8,refer:[4,9],region:6,regist:[2,3],rekognit:2,relat:7,render:6,replai:[1,3,7,11,12],replayclipsretentionperiod:7,replayresult:9,report:1,repres:[4,6],reqd:6,request:[6,10],requir:3,resolut:6,result:[3,10],retain:7,retent:7,retriev:[1,8,9],revis:[2,3],run:7,s3:[1,6,9],s3bucket:9,s3kei:9,s:9,sagemak:2,schedul:1,searchwindowsecond:9,sec:4,second:4,segment:[1,4],send:10,servic:7,set:[6,9],sign:[6,9],signatur:6,size:4,so:9,sourc:[1,3],sourcevideoauth:1,sourcevideometadata:1,sourcevideourl:1,specif:[2,3],start:[1,8],startpt:9,statedefinit:[3,4],step:8,store:[0,1,5,6,9],stream:[1,9],string:[0,1,2,3,4,5,6,7,8,9],subsequ:6,summar:6,support:[1,3,6,10],supportedmediatyp:3,sync:3,syncmodel:3,system:[0,1,2,3,4,5,6,8,10,11,12],t:[8,9],tabl:[1,9],tailor:7,take:1,than:9,thi:[2,3,6,7,10],throttl:7,thumbnail:6,time:[1,9],timestamp:[1,2,3,4],token:[6,10],tool:9,total:1,transport:9,ts:9,type:3,uniqu:[1,9],until:7,updat:[3,4,8],upsert:7,url:[1,6,9],us:[1,2,3,4,6,7,9],user:9,usual:9,utc:1,uuid:[1,4],uxlabel:6,v0:[2,3],valid:6,valu:[3,6,7,9],value1:[3,4],version:4,video:[1,3,4,9],vod:1,wa:9,weight:6,when:3,wherea:9,whether:3,which:[1,2,3,4,6,9],window:9,within:[3,9],workflow:[7,11,12],x:[3,6,7,9],yet:[8,9],zero:[4,9]},titles:["Aws-Mre-Controlplane-Contentgroup-Api","Aws-Mre-Controlplane-Event-Api","Aws-Mre-Controlplane-Model-Api","Aws-Mre-Controlplane-Plugin-Api","Aws-Mre-Controlplane-Profile-Api","Aws-Mre-Controlplane-Program-Api","Aws-Mre-Controlplane-Replay-Api","Aws-Mre-Controlplane-System-Api","Aws-Mre-Controlplane-Workflow-Api","Aws-Mre-Dataplane-Api","Aws-Mre-Gateway-Api","Documentation","Documentation"],titleterms:{"class":3,"export":[1,6,9],all:[0,1,2,3,4,5,6,7,9],api:[0,1,2,3,4,5,6,7,8,9,10,11,12],attrn:9,attrnam:9,attrv:9,attrvalu:9,audio:1,audio_track:9,audiotrack:[1,6],auth:6,aw:[0,1,2,3,4,5,6,7,8,9,10],bucket:9,channel:7,chunk:[8,9],chunk_num:8,classifi:9,clip:9,clipdur:9,clipgen:9,clipstart:9,closesteventfirst:1,complet:6,configur:7,content_group:[0,1,2,3,4],contentgroup:[0,1,2,3,4,6],contentgrp:6,controlplan:[0,1,2,3,4,5,6,7,8],data:[1,6],dataplan:9,delet:[0,1,2,3,4,5,6,10],dependentplugin:9,document:[11,12],durat:9,edl:[1,9],edlloc:1,end:9,endtim:9,engin:9,event:[1,6,8,9],eventmanifest:1,execut:8,export_data:[1,6],extern:[1,10],featur:[6,9],feedback:9,filenam:9,first_pt:1,firstpt:1,frame:9,frame_numb:9,frame_r:1,framer:1,fromdat:1,futur:1,gameid:6,gatewai:10,get:[0,1,2,3,4,5,6,7,8,9,10],hasreplai:1,hl:[1,6],hlslocat:1,id:[1,6],incomplet:8,kei:9,label:9,limit:1,locat:6,manifest:[6,9],media:9,medial:7,mediatailor:7,metadata:[1,9],model:2,mp4locat:6,mre:[0,1,2,3,4,5,6,7,8,9,10],name:[1,2,3,4,6,7,9],opt:9,optim:9,org:9,output:9,outputattribut:9,playbackconfigur:7,plugin:[3,8,9],plugin_class:[2,3],plugin_nam:8,pluginattribut:9,pluginclass:2,pluginnam:9,post:[1,2,3,4,6,8,9,10],preview:9,previewinfo:9,process:1,profil:[4,9],profileclassifi:9,program:[1,5,6,8,9],proxi:10,put:[0,1,2,3,4,5,6,7,8,9,10],queu:1,rang:1,refer:[11,12],reference_tim:9,replai:[6,9],replayid:[6,9],replaymanifest:6,replaystatu:6,result:9,review:9,segment:9,segmentend:6,start:9,start_tim:9,starttim:9,state:9,statu:[1,2,3,4,6,8],stream:6,system:7,timecod:[1,9],todat:1,track:[1,6,9],tracknumb:9,updat:[1,6],uuid:7,v2:9,version:[2,3,7,9],workflow:[8,9]}})