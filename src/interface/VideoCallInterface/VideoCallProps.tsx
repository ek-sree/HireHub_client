export interface VideoCallProps {
    localStream: MediaStream | null;
    remoteStream: MediaStream | null;
    onEndCall: ()=> void;
}

export interface IncommigCallProps{
    callerId: string;
    callerName: string;
    onAccept:()=> void;
    onReject:()=>void;
}