// GlobalIncomingCallHandler.tsx
import React, { useEffect, useState } from "react";
import { useWebRTC } from "../../../Contex/ProviderWebRTC";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

interface IncomingCallNotificationProps {
  callerId: string;
  callerName: string;
  onAccept: () => void;
  onReject: () => void;
}

const IncomingCallNotification: React.FC<IncomingCallNotificationProps> = ({ callerName, onAccept, onReject }) => {
  return (
    <div className="fixed bottom-4 right-4 left-4 md:left-auto md:w-80 bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-4">
        <h4 className="font-bold text-lg">{callerName}</h4>
        <p className="text-sm text-gray-500">Incoming video call...</p>
      </div>
      <div className="flex">
        <button onClick={onAccept} className="flex-1 bg-green-500 text-white py-3 font-semibold hover:bg-green-600 transition-colors">
          Accept
        </button>
        <button onClick={onReject} className="flex-1 bg-red-500 text-white py-3 font-semibold hover:bg-red-600 transition-colors">
          Reject
        </button>
      </div>
    </div>
  );
};

const GlobalIncomingCallHandler: React.FC = () => {
  const { acceptCall, endCall } = useWebRTC();
  const [incomingCall, setIncomingCall] = useState<{ from: string; callerName: string; offer: RTCSessionDescriptionInit } | null>(null);
  const userId = useSelector((store: RootState) => store.UserAuth.userData?._id) || '';

  useEffect(() => {
    const handleIncomingCall = (data: { from: string; callerName: string; offer: RTCSessionDescriptionInit }) => {
      // console.log('Incoming call data:', data);
      setIncomingCall(data);
    };

    socket.on('incomingCall', handleIncomingCall);

    return () => {
      socket.off('incomingCall', handleIncomingCall);
    };
  }, []);

  const handleAccept = () => {
    if (incomingCall) {
      acceptCall(userId, incomingCall.from, incomingCall.offer);
      setIncomingCall(null);
    }
  };

  const handleReject = () => {
    endCall();
    setIncomingCall(null);
  };

  if (!incomingCall) return null;

  return (
    <IncomingCallNotification
      callerId={incomingCall.from}
      callerName={incomingCall.callerName}
      onAccept={handleAccept}
      onReject={handleReject}
    />
  );
};

export default GlobalIncomingCallHandler;