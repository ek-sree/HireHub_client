import React, { useEffect, useRef, useState } from "react";
import { MdVideocamOff, MdVideocam, MdMicOff, MdMic, MdCallEnd } from "react-icons/md";

interface VideoCallProps {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  onEndCall: () => void;
}

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

  const handleToggleCamera = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => track.enabled = !track.enabled);
      setIsCameraOff(!isCameraOff);
    }
  };

  const handleToggleMic = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
      setIsMicOff(!isMicOff);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-90 flex flex-col items-center justify-center">
      {/* Remote video (full screen) */}
      <video 
        ref={remoteVideoRef} 
        autoPlay 
        className="w-full h-full object-cover"
      />
      
      {/* Local video (picture-in-picture) */}
      <video 
        ref={localVideoRef} 
        autoPlay 
        muted 
        className="absolute top-2 right-2 w-1/3 sm:w-1/4 md:w-1/5 border-2 border-white rounded-lg z-10"
      />
      
      {/* Control buttons */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-4">
        <button 
          onClick={handleToggleCamera} 
          className="bg-blue-500 text-white p-2 sm:p-3 rounded-full"
        >
          {isCameraOff ? <MdVideocamOff size={24} /> : <MdVideocam size={24} />}
        </button>
        <button 
          onClick={handleToggleMic} 
          className="bg-blue-500 text-white p-2 sm:p-3 rounded-full"
        >
          {isMicOff ? <MdMicOff size={24} /> : <MdMic size={24} />}
        </button>
        <button 
          onClick={onEndCall} 
          className="bg-red-500 text-white p-2 sm:p-3 rounded-full"
        >
          <MdCallEnd size={24} />
        </button>
      </div>
    </div>
  );
};

export default VideoCall;