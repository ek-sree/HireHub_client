export interface WebRTCContextProps {
    localStream: MediaStream | null;
    remoteStream: MediaStream | null;
    inCall: boolean;
    startCall: (id: string) => Promise<void>;
    acceptCall: (id: string, fromId: string, offer: RTCSessionDescriptionInit) => Promise<void>;
    endCall: () => void;
    incomingCall: { fromId: string; from: string, offer: RTCSessionDescriptionInit } | null;
    setIncomingCall: React.Dispatch<React.SetStateAction<{ fromId: string; from: string, offer: RTCSessionDescriptionInit } | null>>;
}