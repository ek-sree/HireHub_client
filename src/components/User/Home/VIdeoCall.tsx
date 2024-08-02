import React, { useEffect, useRef, useState } from "react";

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
      <video ref={localVideoRef} autoPlay muted className="absolute bottom-5 right-5 w-1/4 border-2 border-white" />
      <video ref={remoteVideoRef} autoPlay className="w-full h-full object-cover" />
      <div className="absolute bottom-10 flex space-x-4">
        <button onClick={handleToggleCamera} className="bg-blue-500 text-white px-4 py-2 rounded">{isCameraOff ? "Turn Camera On" : "Turn Camera Off"}</button>
        <button onClick={handleToggleMic} className="bg-blue-500 text-white px-4 py-2 rounded">{isMicOff ? "Turn Mic On" : "Turn Mic Off"}</button>
        <button onClick={onEndCall} className="bg-red-500 text-white px-4 py-2 rounded">End Call</button>
      </div>
    </div>
  );
};

export default VideoCall;
