import React, { useEffect, useState } from "react";
import { IncommigCallProps } from "../../../interface/VideoCallInterface/VideoCallProps";
import { useWebRTC } from "../../../Contex/ProviderWebRTC";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import socketService from "../../../socket/socketService";

const IncommingCall: React.FC<IncommigCallProps> = ({ callerId, callerName, onAccept, onReject }) => {
  return (
    <div className="fixed bottom-0 right-0 m-4 p-4 bg-white shadow-lg rounded-lg flex items-center">
      <div className="flex-1">
        <h4 className="font-bold">{callerName}</h4>
        <p className="text-sm text-gray-500">Incoming video call...</p>
      </div>
      <button onClick={onAccept} className="bg-green-500 text-white px-4 py-2 rounded mr-2">Accept</button>
      <button onClick={onReject} className="bg-red-500 text-white px-4 py-2 rounded">Reject</button>
    </div>
  );
};

const GlobalInCommingCallHandler: React.FC = () => {
  const { acceptCall, endCall } = useWebRTC();
  const [incomingCall, setIncomingCall] = useState<{ fromId: string; from: string, offer: RTCSessionDescriptionInit } | null>(null);

  const userId = useSelector((store: RootState) => store.UserAuth.userData?._id);

  useEffect(() => {
    const handleIncomingCall = (data: { from: string, offer: RTCSessionDescriptionInit, fromId: string }) => {
      console.log("Incoming call data:", data);
      setIncomingCall(data);
    };

    socketService.onIncomingCall(handleIncomingCall);
  
    return () => {
      socketService.removeListener('incomingCall');
    };
  }, []);

  const handleAccept = () => {
    if (incomingCall) {
      acceptCall(userId || '', incomingCall.from, incomingCall.offer);
      setIncomingCall(null);
    }
  };

  const handleReject = () => {
    setIncomingCall(null);
};

  if (!incomingCall) return null;

  return (
    <IncommingCall
      callerId={incomingCall.fromId}
      callerName={incomingCall.from}
      onAccept={handleAccept}
      onReject={handleReject}
    />
  );
};

export default GlobalInCommingCallHandler;
