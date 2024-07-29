import React, { createContext, useEffect, useRef, useState, useContext } from "react";
import { WebRTCContextProps } from "../interface/ContextInterface/WebRTCInterface";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store/store";
import socketService from "../socket/socketService";

const WebRTCContext = createContext<WebRTCContextProps | undefined>(undefined);

export const WebRTCProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [guestId, setGuestId] = useState<string>('');
    const [inCall, setInCall] = useState(false);
    const name = useSelector((store: RootState) => store.UserAuth.userData?.name);
    const userId = useSelector((store: RootState) => store.UserAuth.userData?._id);
    const peerConnection = useRef<RTCPeerConnection | null>(null);

    const startCall = async (id: string) => {
        try {
            setGuestId(id);
            const stream = await navigator.mediaDevices.getUserMedia({audio: true, video: true});
            setLocalStream(stream);

            if (!peerConnection.current) {
                peerConnection.current = new RTCPeerConnection({
                    iceServers: [
                        { urls: 'stun:stun.l.google.com:19302' },
                        { urls: 'stun:stun1.l.google.com:19302' },
                        { urls: 'stun:stun2.l.google.com:19302' },
                    ],
                });

                peerConnection.current.ontrack = (e) => {
                    if (e.streams && e.streams.length > 0) {
                        setRemoteStream(e.streams[0]);
                    }
                };

                peerConnection.current.onicecandidate = (e) => {
                    if (e.candidate) {
                        socketService.signal(id, e);
                    }
                };

                stream.getTracks().forEach((track) => peerConnection.current!.addTrack(track, stream));
            }
            const offer = await peerConnection.current.createOffer();
            await peerConnection.current.setLocalDescription(offer);

            socketService.callUser({userToCall: id, from: name!, offer, fromId: userId!});
            setInCall(true);      
        } catch (error) {
            console.error("Error starting call:", error);
        }
    };

    const acceptCall = async (id: string, fromId: string, offer: RTCSessionDescriptionInit) => {
        try {
            setGuestId(id);
            const stream = await navigator.mediaDevices.getUserMedia({audio: true, video: true});
            setLocalStream(stream);

            if (!peerConnection.current) {
                peerConnection.current = new RTCPeerConnection({
                    iceServers: [
                        { urls: 'stun:stun.l.google.com:19302' },
                        { urls: 'stun:stun1.l.google.com:19302' },
                        { urls: 'stun:stun2.l.google.com:19302' },
                        { urls: 'stun:stun3.l.google.com:19302' },
                    ]
                });

                peerConnection.current.ontrack = (e) => {
                    if (e.streams && e.streams.length > 0) {
                        setRemoteStream(e.streams[0]);
                    }
                };

                peerConnection.current.onicecandidate = (e) => {
                    if (e.candidate) {
                        socketService.signal(id, e);
                    }
                };
                stream.getTracks().forEach((track) => peerConnection.current!.addTrack(track, stream));
            }

            await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await peerConnection.current.createAnswer();
            await peerConnection.current.setLocalDescription(answer);

            socketService.callAccepted({userId: fromId, answer, context: 'webRTC'});
            setInCall(true);
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
        const handleSignal = async (data: {userId: string, type: string, candidate?: RTCIceCandidateInit; answer?: RTCSessionDescriptionInit}) => {
            try {
                const {type, candidate, answer} = data;
                console.log("Received signal", type, candidate, answer);
                
                if (peerConnection.current) {
                    if (type === 'answer' && answer) {
                        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
                    } else if (type === 'candidate' && candidate) {
                        await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
                    }
                }
            } catch (error) {
                console.log("Error handling signal", error);
            }
        };

        const handleCallUser = async (data: {userToCall: string, from: string, offer: RTCSessionDescriptionInit, fromId: string}) => {
            const {from, offer, fromId} = data;
            console.log(`Incoming call from ${from}`);
            await acceptCall(from, fromId, offer);
        };

        const handleCallEnded = () => {
            console.log("Call ended");
            endCall();
        };

        socketService.on('signal', (data) => handleSignal(data));
        socketService.on('callUser', (data) => handleCallUser(data));
        socketService.on('callEnded', handleCallEnded);

        return () => {
            socketService.off('signal', (data) => handleSignal(data));
            socketService.off('callUser', (data) => handleCallUser(data));
            socketService.off('callEnded', handleCallEnded);
        };
    }, [endCall]);

    return (
        <WebRTCContext.Provider value={{ localStream, remoteStream, inCall, startCall, acceptCall, endCall }}>
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