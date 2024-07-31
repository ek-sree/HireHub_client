import { useEffect, useRef, useState } from "react";
import { VideoCallProps } from "../../../interface/VideoCallInterface/VideoCallProps";

const VideoCall: React.FC<VideoCallProps> = ({ localStream, remoteStream, onEndCall }) => {
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const [isCameraOff, setIsCameraOff] = useState(false);
    const [isMicOff, setIsMicOff] = useState(false);

    useEffect(() => {
        if (localVideoRef.current && localStream) {
          localVideoRef.current.srcObject = localStream;
        }
      }, [localStream]);
      
      useEffect(() => {
        if (remoteVideoRef.current && remoteStream) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
      }, [remoteStream]);
      
    const toggleCamera = () => {
        if (localStream) {
            localStream.getVideoTracks().forEach(track => {
                track.enabled = !track.enabled;
                setIsCameraOff(!track.enabled);
            });
        }
    };

    const toggleMic = () => {
        if (localStream) {
            localStream.getAudioTracks().forEach(track => {
                track.enabled = !track.enabled;
                setIsMicOff(!track.enabled);
            });
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="relative w-full h-full flex items-center justify-center bg-black">
                <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="object-cover h-full w-full"
                />
                <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="absolute top-4 right-4 w-64 h-44 bg-gray-900 border-2 border-white rounded-lg"
                />
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
                    <button
                        onClick={toggleCamera}
                        className={`p-2 ${isCameraOff ? 'bg-green-500' : 'bg-gray-200'} text-gray-800 rounded`}
                    >
                        {isCameraOff ? 'Turn Camera On' : 'Turn Camera Off'}
                    </button>
                    <button
                        onClick={toggleMic}
                        className={`p-2 ${isMicOff ? 'bg-green-500' : 'bg-gray-200'} text-gray-800 rounded`}
                    >
                        {isMicOff ? 'Turn Mic On' : 'Turn Mic Off'}
                    </button>
                    <button
                        onClick={onEndCall}
                        className="p-2 bg-red-600 text-white rounded"
                    >
                        End Call
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VideoCall;
