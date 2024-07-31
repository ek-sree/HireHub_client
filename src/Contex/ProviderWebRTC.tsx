import React, { createContext, useEffect, useRef, useState, useContext } from "react";
import { WebRTCContextProps } from "../interface/VideoCallInterface/WebRTCInterface";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store/store";
import socketService from "../socket/socketService";

const WebRTCContext = createContext<WebRTCContextProps | undefined>(undefined);

export const WebRTCProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [guestId, setGuestId] = useState<string>('');
    const [inCall, setInCall] = useState(false);
    const name = useSelector((store: RootState) => store.UserAuth.userData?.name);
    const userId = useSelector((store: RootState) => store.UserAuth.userData?._id);
    const peerConnection = useRef<RTCPeerConnection | null>(null);
    const [incomingCall, setIncomingCall] = useState<{ fromId: string; from: string, offer: RTCSessionDescriptionInit } | null>(null);
    const [pendingCandidates, setPendingCandidates] = useState<RTCIceCandidate[]>([]);
    let ID ;

    const createPeerConnection = () => {
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' },
        ],
      });
    
      pc.ontrack = (e) => {
        console.log("Received remote track", e.track);
        if (e.streams && e.streams.length > 0) {
          console.log("Setting remote stream");
          setRemoteStream(e.streams[0]);
        }
      };
    
      pc.onicecandidate = (e) => {
        if (e.candidate) {
          console.log("Sending ICE candidate", e.candidate);
          socketService.signal({
            userId: guestId,
            type: 'candidate',
            candidate: e.candidate,
            context: 'webRTC'
          });
        }
      };
    
      return pc;
    };
    

      const startCall = async (id: string) => {
        try {
          ID = id;
          setGuestId(id);
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
          setLocalStream(stream);
      
          peerConnection.current = createPeerConnection();
          stream.getTracks().forEach((track) => {
            console.log("Adding local track to peer connection", track);
            peerConnection.current!.addTrack(track, stream);
          });
      
          const offer = await peerConnection.current.createOffer();
          await peerConnection.current.setLocalDescription(offer);
      
          console.log("Sending call offer", offer);
          socketService.callUser({ userToCall: id, from: name!, offer, fromId: userId! });
          setInCall(true);
        } catch (error) {
          console.error("Error starting call:", error);
        }
      };

      const acceptCall = async (id: string, fromId: string, offer: RTCSessionDescriptionInit) => {
        try {
          setGuestId(fromId);
          console.log("Accepting call", id, fromId, offer);
          
          setGuestId(id);
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
          setLocalStream(stream);
      
          peerConnection.current = createPeerConnection();
          stream.getTracks().forEach((track) => {
            console.log("Adding local track to peer connection", track);
            peerConnection.current!.addTrack(track, stream);
          });
      
          await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await peerConnection.current.createAnswer();
          await peerConnection.current.setLocalDescription(answer);
      
          console.log("Sending call accepted signal", answer);
          socketService.onCallAccepted({ userId: fromId, answer, context: 'webRTC' });
          setInCall(true);
      
          // Add pending candidates
          pendingCandidates.forEach(async (candidate) => {
            await peerConnection.current!.addIceCandidate(candidate);
          });
          setPendingCandidates([]);
        } catch (error) {
          console.log("Error accepting call", error);
        }
      };
    

    const endCall = () => {
        try {
            if (peerConnection.current) {
                peerConnection.current.close();
                peerConnection.current = null;
            }

            if (localStream) {
                localStream.getTracks().forEach((track) => track.stop());
                setLocalStream(null);
            }

            if (remoteStream) {
                remoteStream.getTracks().forEach((track) => track.stop());
                setRemoteStream(null);
            }

            socketService.callEnd(guestId);
            setInCall(false);
        } catch (error) {
            console.log("Error ending call", error);
        }
    };

    useEffect(() => {
        socketService.connect();
      
        socketService.onSignal(async (data) => {
          try {
            const { type, candidate, answer } = data;
        
            if (peerConnection.current) {
              if (type === 'answer' && answer) {
                console.log("Setting remote description (answer)");
                await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
              } else if (type === 'candidate' && candidate) {
                if (peerConnection.current.remoteDescription) {
                  console.log("Adding ICE candidate");
                  await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
                } else {
                  console.log("Storing pending ICE candidate");
                  setPendingCandidates(prev => [...prev, candidate]);
                }
              }
            }
          } catch (error) {
            console.error("Error handling signal", error);
          }
        });
        
      
        return () => {
          socketService.disconnect();
          socketService.removeListener('signal');
          socketService.removeListener('incomingCall');
        };
      }, []);
      

    return (
        <WebRTCContext.Provider value={{
            localStream,
            remoteStream,
            inCall,
            startCall,
            acceptCall,
            endCall,
            incomingCall,
            setIncomingCall
        }}>
            {children}
        </WebRTCContext.Provider>
    );
};

export const useWebRTC = (): WebRTCContextProps => {
    const context = useContext(WebRTCContext);
    if (!context) {
        throw new Error('useWebRTC must be used within a WebRTCProvider');
    }
    return context;
};
