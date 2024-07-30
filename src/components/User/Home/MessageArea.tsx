import React, { useEffect, useState, useRef } from "react";
import { Avatar, CircularProgress, IconButton } from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import ImageIcon from "@mui/icons-material/Image";
import SendIcon from "@mui/icons-material/Send";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { messageAxios } from "../../../constraints/axios/messageAxios";
import { messageEndpoints } from "../../../constraints/endpoints/messageEndpoints";
import socketService from "../../../socket/socketService";
import messageWallpaper from '../../../assets/images/WhatsApp-Chat-theme-iPhone-stock-744.webp';
import EmojiPicker from 'emoji-picker-react';
import { toast, Toaster } from "sonner";
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import TheatersIcon from '@mui/icons-material/Theaters';
import DeleteIcon from '@mui/icons-material/Delete';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import WaveSurfer from 'wavesurfer.js'
import { Message , User, ChatData, MessageAreaProps, ImageData  } from "../../../interface/Message/IMessage";
import { useWebRTC } from "../../../Contex/ProviderWebRTC";



const MessageArea: React.FC<MessageAreaProps> = ({ chat }) => {
  const [data, setData] = useState<ImageData | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [theme, setTheme] = useState('light');
  const [skinTone, setSkinTone] = useState('light');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const userId = useSelector((store: RootState) => store.UserAuth.userData?._id);
  const token = useSelector((store: RootState) => store.UserAuth.token);
  const [isOtherUserOnline, setIsOtherUserOnline] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading]= useState(false);
  const [progress, setProgress] = React.useState(0);
  const [handleVoiceToogle, setHandleVoiceToogle] = useState<boolean>(false);
  const [recordingDuriation, setRecordingDuriation] = useState(0);
  const [waveform, setWaveform] = useState(null);
  const [currentPlayBackTime, setCurrentPlayBackTime] = useState(0);
  const [totalDuriation, setTotalDuriation] = useState(0);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [renderedAudio, setRenderedAudio] = useState(null);
  const [forTest, setForTest] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const { startCall } = useWebRTC();
  
  const otherUserId = chat.users.find(user => user.id !== userId)?.id;


  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const waveFormRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
    }, 800);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const handleVoiceStart = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
    setIsRecording(true);
    setHandleVoiceToogle(true);
    setRecordingDuriation(0);
    setCurrentPlayBackTime(0);
    setTotalDuriation(0);
    
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioRef.current = new Audio();
  
      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
        const audioURL = URL.createObjectURL(blob);
        const audio = new Audio(audioURL);
        setRecordedAudio(audio);
  
        waveform?.load(audioURL);
      }
      mediaRecorder.start();
    }).catch(error => {
      console.log("Error recording", error);
    });
  }
  

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuriation((prevDuration) => {
          setTotalDuriation(prevDuration + 1);
          return prevDuration + 1;
        });
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    }
  }, [isRecording]); 

  const handleDeleteVoice = () => {
    setRecordingDuriation(0);
    setCurrentPlayBackTime(0);
    setTotalDuriation(0);
    setRecordedAudio(null);
    setRenderedAudio(null);
    setIsPlaying(false);
    setHandleVoiceToogle(false);
    // setForTest(false);
    setIsRecording(false);
  
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
  
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
  
    if (waveform) {
      waveform.empty();
      waveform.destroy();
      setWaveform(null);
    }
  
    URL.revokeObjectURL(recordedAudio?.src);
  
    if (mediaRecorderRef.current && mediaRecorderRef.current.stream) {
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };
  

  const handleStopRecording = () => {
    setForTest(true);
    setIsRecording(false);  
    if (mediaRecorderRef.current && handleVoiceToogle) {
      mediaRecorderRef.current.stop();
      waveform?.stop();
  
      const audioChunks: BlobPart[] = [];
      mediaRecorderRef.current.addEventListener('dataavailable', (event) => {
        audioChunks.push(event.data);
      });
  
      mediaRecorderRef.current.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        setRecordedAudio(audio);
        setRenderedAudio(audioBlob);
        
        if (waveform) {
          waveform.load(audioUrl);
        }
      });
    }
  };

  useEffect(() => {
    if (recordedAudio) {
      const updatePlayBackTime = () => {
        setCurrentPlayBackTime(recordedAudio.currentTime);
      };
      recordedAudio.addEventListener("timeupdate", updatePlayBackTime);
      return () => {
        recordedAudio.removeEventListener("timeupdate", updatePlayBackTime);
      };
    }
  }, [recordedAudio]);

  const handlePlayAudio = () => {
    setIsPlaying(true);
    if (recordedAudio) {
      recordedAudio.play();
      if (waveform) {
        waveform.play();
      }
    }
  };

  const handlePauseAudio = () => {
    setIsPlaying(false);
    waveform?.stop();
    recordedAudio?.pause();
  };
  async function getMessages() {
    try {
      if (!userId || !chat || !chat.users) {
        console.error("Missing userId or chat data");
        return;
      }
  
      const otherUser = chat.users.find(user => user.id !== userId);
      const receiverId = otherUser?.id;
  
      if (!receiverId) {
        console.error("Could not determine receiverId");
        return;
      }
  
      if (userId.length !== 24 || receiverId.length !== 24) {
        console.error("Invalid userId or receiverId format");
        return;
      }
          
      const response = await messageAxios.get(`${messageEndpoints.getMessage}?userId=${userId}&receiverId=${receiverId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Messages fetched:", response.data);
  
      if (response.data.success) {
        setData(response.data.data);
      } else {
        console.error("Error fetching messages:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }



  useEffect(() => {
    if (waveFormRef.current) {
      const wavesurfer = WaveSurfer.create({
        container: waveFormRef.current,
        waveColor: "#ccc",
        progressColor: "#4a9eff",
        cursorColor: "#7ae3c3",
        barWidth: 2,
        height: 30,
        responsive: true
      });
      setWaveform(wavesurfer);

      wavesurfer.on("finish", () => {
        setIsPlaying(false);
      });

      return () => {
        wavesurfer.destroy();
      };
    }
  }, []);

  useEffect(() => {
    if (waveform) handleVoiceStart();
  }, [waveform]);

  const formatTimes = (time: number): string => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (chat && userId) {
      getMessages();
    }
    socketService.connect();
  
    if (userId) {
      socketService.emitUserOnline(userId);
    }
  
    const otherUser = chat.users.find(user => user.id !== userId);
    if (otherUser) {
      setIsOtherUserOnline(otherUser.isOnline || false);
    }
  
    socketService.onUserStatusChanged((data) => {
      if (data.userId === otherUser?.id) {
        setIsOtherUserOnline(data.isOnline);
      }
    });
  
    return () => {
      socketService.disconnect();
    };
  }, [chat, userId, token]);

  
  useEffect(() => {
    if (chat._id) {
      console.log("Setting up socket for chatId:", chat._id);
      socketService.connect();
      socketService.joinConversation(chat._id);

      // const receiverId = chat.lastMessage?.receiverId || chat.users.find(user => user.id !== userId)?.id;

      socketService.onNewMessage((message) => {
        console.log("Received new message in real-time:", message);
        setData(prevData => {
          const newMessage: Message = {
            _id: message._id || Date.now().toString(),
            senderId: message.senderId,
            receiverId: message.receiverId,
            content: message.content,
            imagesUrl: message.data?.imagesUrl || [], 
            videoUrl: message.data?.videoUrl,
            recordUrl: message.data?.recordUrl,
            recordDuration: message.data?.recordDuration, 
            chatId: message.chatId,
            createdAt: message.createdAt || new Date().toISOString(),
            updatedAt: message.updatedAt || new Date().toISOString(),
            __v: message.__v || 0
          };
          return {
            ...prevData,
            messages: [...(prevData?.messages || []), newMessage]
          };
        });
      });

      return () => {
        console.log("Disconnecting socket");
        socketService.disconnect();
      };
    }
  }, [chat._id, userId]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [data?.messages]);

  const getFormattedDate = (date: string) => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (date === today) return 'Today';
    if (date === yesterday) return 'Yesterday';

    return new Date(date).toLocaleDateString();
  };

  const handleEmojiPickerToggle = (event: React.MouseEvent) => {
    event.stopPropagation();
    setShowEmojiPicker(prev => !prev);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 5) {
      toast.error("You can only select up to 5 images at a time.");
      return;
    }
    setSelectedImages(prevImages => [...prevImages, ...files].slice(0, 5));
  };

  const removeSelectedImage = (index: number) => {
    setSelectedImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 1) {
      toast.error("You can only select one video at a time.");
      return;
    }
  
    const file = files[0];
    console.log("Selected video file:", file);
    const videoElement = document.createElement('video');
    
    videoElement.preload = 'metadata';
    videoElement.src = URL.createObjectURL(file);
    
    videoElement.onloadedmetadata = () => {
      URL.revokeObjectURL(videoElement.src);
      if (videoElement.duration > 60) {
        toast.error("Video length must be below 1 minute.");
        setSelectedVideo(null);
      } else {
        setSelectedVideo(file);
      }
    };
  };

  const removeSelectedVideo = () => {
    setSelectedVideo(null);
    console.log("Video removed");
  };

  const uploadImages = async (images: File[]) => {
    const receiverId = chat.lastMessage?.receiverId || chat.users.find(user => user.id !== userId)?.id;
    if (!images || images.length == 0) {
      return;
    }
    const formData = new FormData();
    images.forEach(image => {
      formData.append('images', image);
    });
    const response = await messageAxios.post(`${messageEndpoints.sendImages}?chatId=${chat._id}&senderId=${userId}&receiverId=${receiverId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log("Image upload response:", response.data);
    
    if (response.data.success) {
      return response.data.data;
    }
    return [];
  };

  const uploadVideo= async(video:File)=>{
    try {
    const receiverId = chat.lastMessage?.receiverId || chat.users.find(user => user.id !== userId)?.id;
    if(!video){
      return;
    }
    const formData = new FormData();
    formData.append('video', video);
      const response = await messageAxios.post(`${messageEndpoints.sendVideo}?chatId=${chat._id}&senderId=${userId}&receiverId=${receiverId}`,formData,{
        headers:{
          Authorization: `Bearer ${token}`
        }
      })
      if(response.data.success){
        return response.data.data;
      }
      return '';
    } catch (error) {
      console.log("error uploading video",error);
      toast.error("Cant send video right now")
    }
  }

  const uploadAudio = async(audio:string)=>{
    try {
      console.log("Audio here for send",audio);
      
      const receiverId = chat.lastMessage?.receiverId || chat.users.find(user => user.id !== userId)?.id;
      if(!audio){
        return;
      }
      const formData = new FormData();
      formData.append('audio', audio);
      const response = await messageAxios.post(`${messageEndpoints.sendAudio}?chatId=${chat._id}&senderId=${userId}&receiverId=${receiverId}`, formData,{
        headers:{
          Authorization: `Bearer ${token}`
        }
      })
      console.log("response",response.data);
      if(response.data.success){
        return response.data.data
      }
      return '';
    } catch (error) {
      console.log("Error uploading audio",error);
      toast.error("Error cant send audio right now")
    }
  }

  const handleSendMessage = async () => {
    try {
      setLoading(true);
      const receiverId = chat.lastMessage?.receiverId || chat.users.find(user => user.id !== userId)?.id;
      if ((messageInput.trim() || selectedImages.length > 0 || selectedVideo || recordedAudio) && chat._id && userId && receiverId) {
        let imageUrls: string[] = [];
        let videoUrls: string = '';
        let recordUrl: string = '';
        
        if (selectedImages.length > 0) {
          imageUrls = await uploadImages(selectedImages);
        }
        if (selectedVideo) {
          videoUrls = await uploadVideo(selectedVideo);
        }
        if (recordedAudio) {
          recordUrl = await uploadAudio(renderedAudio);
        }
  
        console.log("Attempting to send message:", { chatId: chat._id, userId, receiverId, messageInput, images: imageUrls, videoUrls, recordUrl });
        
        socketService.sendMessage({
          chatId: chat._id,
          senderId: userId,
          receiverId: receiverId,
          content: messageInput,
          images: imageUrls,
          video: videoUrls,
          record: recordUrl,
          recordDuration: totalDuriation
        });
        
        setMessageInput('');
        setSelectedImages([]);
        setSelectedVideo(null);
        setShowEmojiPicker(false);
        
        // Clear recorded audio and close voice toggle
        if (recordedAudio) {
          setRecordedAudio(null);
          setRenderedAudio(null);
          setHandleVoiceToogle(false);
          setIsRecording(false);
          setRecordingDuriation(0);
          setCurrentPlayBackTime(0);
          setTotalDuriation(0);
          setIsPlaying(false);
          if (waveform) {
            waveform.empty();
          }
        }
      } else {
        toast.error("Error something is missing, try later");
        console.error("Missing required data for sending message:", { chatId: chat._id, userId, receiverId, messageInput, images: selectedImages });
      }
    } catch (error) {
      console.log("Error happened sending message", error);
      toast.error("Error occurred, try later");
    } finally {
      setLoading(false);
    }
  };
  
  const addEmoji = (emojiObject: { emoji: string }) => {
    setMessageInput(prevInput => prevInput + emojiObject.emoji);
  };

  const renderMessages = () => {
    if (!data || !data.messages || data.messages.length === 0) {
      return (
        <div className="flex justify-center items-center h-full">
          <p className="text-gray-500 text-lg">No messages. Start a new conversation!</p>
        </div>
      );
    }
  
    let currentDate = '';
  
    return data.messages.map((message) => {
      const messageDate = new Date(message.createdAt).toISOString().split('T')[0];
      const showDate = messageDate !== currentDate;
      currentDate = messageDate;
  
      return (
        <div key={message._id}>
          {showDate && (
            <div className="text-center my-2 text-sm text-gray-500 bg-blue-200 rounded-md shadow-md mx-auto w-1/6">
              {getFormattedDate(messageDate)}
            </div>
          )}
          <div className={`flex ${message.senderId === userId ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-2 rounded-lg max-w-xs ${message.senderId === userId ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
              {message.content && <div>{message.content}</div>}
              {message.imagesUrl && message.imagesUrl.length > 0 && (
                <div className="mt-2">
                  {message.imagesUrl.map((imageUrl, index) => (
                    <img 
                      key={index} 
                      src={imageUrl} 
                      alt={`Shared image ${index + 1}`} 
                      className="max-w-full h-auto rounded mb-2" 
                    />
                  ))}
                </div>
              )}
              {message.videoUrl && (
          <div className="mt-2">
            <video controls className="max-w-full h-auto rounded">
              <source src={message.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
     {message.recordUrl && (
          <div className="mt-2">
            <audio controls className="w-full">
              <source src={message.recordUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
            <div className="waveform" ref={el => {
              if (el && !el.hasChildNodes()) {
                const wavesurfer = WaveSurfer.create({
                  container: el,
                  waveColor: "#ccc",
                  progressColor: "#4a9eff",
                  cursorColor: "#7ae3c3",
                  barWidth: 2,
                  height: 30,
                  responsive: true
                });
                wavesurfer.load(message.recordUrl);
              }
            }} />
            {message.recordDuration && (
              <span className="text-xs text-gray-500 ml-2">
                Duration: {formatTimes(message.recordDuration)}
              </span>
            )}
          </div>
        )}
                  <div ref={messagesEndRef} />
              <div className="flex items-center mt-1 text-xs text-gray-400">
                <span>{new Date(message.createdAt).toLocaleTimeString()}</span>
                {message.senderId === userId && (
                  <span className="ml-1">
                    <CheckIcon fontSize="small" />
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    });
  };

  console.log("is it rerendering without any change i made?");

  function formatTime(currentPlayBackTime: number): React.ReactNode {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="flex flex-col h-full">
      <Toaster position="top-center" expand={false} richColors />
      <div className="flex items-center justify-between p-4 border-b border-gray-300">
        <div className="flex items-center gap-4">
          <Avatar src={chat.users.find(user => user.id !== userId)?.avatar.imageUrl} />
          <div>
            <h2 className="text-lg font-semibold">{chat.users.find(user => user.id !== userId)?.name || 'Username'}</h2>
            <div className={`text-sm ${isOtherUserOnline ? 'text-green-500' : 'text-red-500'}`}>
              {isOtherUserOnline ? 'Online' : 'Offline'}
            </div>
          </div>
        </div>
        <IconButton onClick={() => otherUserId && startCall(otherUserId)}>         
           <VideocamIcon />
        </IconButton>
      </div>

      <div
        className="flex-1 p-4 overflow-y-auto"
        style={{
          backgroundImage: `url(${messageWallpaper})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="space-y-4">
          {renderMessages()}
        </div>
      </div>

      <div className="p-4 border-t border-gray-300">
        {selectedImages.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedImages.map((img, index) => (
              <div key={index} className="relative">
                <img src={URL.createObjectURL(img)} alt={`Selected ${index}`} className="w-16 h-16 object-cover rounded" />
                <button onClick={() => removeSelectedImage(index)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1">
                  <CloseIcon fontSize="small" />
                </button>
              </div>
            ))}
          </div>
        )}
        
        {selectedVideo && (
  <div className="relative mt-2">
    <video controls className="w-64 h-36 object-cover rounded">
    <source src={URL.createObjectURL(selectedVideo)} type={selectedVideo.type} />
      Your browser does not support the video tag.
    </video>
    <button onClick={removeSelectedVideo} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1">
      <CloseIcon fontSize="small" />
    </button>
  </div>
)}
        <div className="relative flex items-center gap-2">
          <IconButton onClick={handleEmojiPickerToggle}>
            <InsertEmoticonIcon />
          </IconButton>
          {showEmojiPicker && !handleVoiceToogle &&(
            <div ref={emojiPickerRef} className="absolute bottom-14 left-0 z-10">
              <EmojiPicker
                onEmojiClick={addEmoji}
                theme={theme}
                skinTone={skinTone}
              />
              <div onClick={() => setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light')} className="flex gap-2 mt-2 border-2 border-slate-500 w-16 rounded-xl shadow-xl hover:bg-slate-300 cursor-pointer">
                <button className="pl-3 font-medium">
                  {theme === 'light' ? 'Dark' : 'Light'}
                </button>
              </div>
            </div>
          )}
        {!handleVoiceToogle ? (
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
          />
        ) : (
          <div className="voice-recording-controls">
            <IconButton onClick={handleDeleteVoice}>
              <DeleteIcon />
            </IconButton>
            <span className="border-2 rounded-lg p-2 drop-shadow-xl">Recording : {recordingDuriation} .s</span>
          </div>
        )}
          {!handleVoiceToogle&&(
            <>
            <IconButton onClick={() => fileInputRef.current?.click()}>
            <ImageIcon />
            <input 
              type="file" 
              ref={fileInputRef}
              style={{ display: 'none' }} 
              onChange={handleFileChange}
              multiple
              accept="image/*"
            />
          </IconButton>
          <IconButton onClick={() => videoInputRef.current?.click()}>
            <TheatersIcon />
            <input 
              type="file"
              ref={videoInputRef}
              style={{ display: 'none' }}
              onChange={handleVideoFileChange}
              accept="video/*"
            />
          </IconButton></>
          )}
          {messageInput.trim() || selectedImages.length > 0 || selectedVideo ? (
  <IconButton color="primary" onClick={handleSendMessage} disabled={loading}>
    {loading ? <CircularProgress variant="determinate" value={progress} /> : <SendIcon />}
  </IconButton>
) : (!handleVoiceToogle ? (
  <IconButton onClick={handleVoiceStart}>
    <KeyboardVoiceIcon />
  </IconButton>
) : (
  <>
    {!recordedAudio ? (
      <IconButton onClick={handleStopRecording}>
        <StopCircleIcon />
      </IconButton>
    ) : (
      <>
        <IconButton onClick={isPlaying ? handlePauseAudio : handlePlayAudio}>
          {isPlaying ? <PauseCircleIcon /> : <PlayCircleIcon />}
        </IconButton>
        <div className="w-60" ref={waveFormRef} hidden={handleVoiceToogle} />{
  recordedAudio && isPlaying &&(
    <span>{formatTimes(currentPlayBackTime)}</span>
  )
}{
  recordedAudio && !isPlaying &&(
    <span>{formatTimes(totalDuriation)}</span>
  )
}
<audio ref={audioRef} hidden/>
        <IconButton color="primary" onClick={handleSendMessage} disabled={loading}>
          {loading ? <CircularProgress variant="determinate" value={progress} /> : <SendIcon />}
        </IconButton>
      </>
    )}
  </>
))}
        </div>
      </div>
    </div>
  );
};

export default MessageArea;