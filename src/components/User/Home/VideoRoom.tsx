import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState } from "../../../redux/store/store";
import { useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

function VideoRoom(){
    const { roomId } = useParams<{roomId: string}>();
    const name = useSelector((store:RootState)=>store.UserAuth.userData?.name);
    const  meetingContainerRef = useRef<HTMLDivElement>(null);

    useEffect(()=>{
        const myMeeting = async()=>{
            if(meetingContainerRef.current){
                const appID = 1895663567;
                const serverSecret = '8a880aa047f071498baf9a5e388c11da';
                const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
                    appID, serverSecret, roomId || '', Date.now.toString(), name || ''
                );
                const zp = ZegoUIKitPrebuilt.create(kitToken);
                zp.joinRoom({
                    container: meetingContainerRef.current,
                    scenario:{
                        mode: ZegoUIKitPrebuilt.VideoConference,
                    }
                })
            }
        };
        myMeeting()
    },[roomId, name])
    return (
        <div>
            <div ref={meetingContainerRef} style={{width: '100%', height: '100vh'}}/>
        </div>
    )
}

export default VideoRoom;