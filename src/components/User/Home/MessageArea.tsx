import React, { useEffect, useState, useRef } from "react";
import { Avatar, IconButton } from "@mui/material";
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

interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  imagesUrl:string[];
  chatId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface User {
  id: string;
  name: string;
  avatar: {
    imageUrl: string;
    originalname: string;
  };
}

interface ChatData {
  _id: string;
  lastMessage?: {
    chatId: string;
    content: string;
    createdAt: string;
    receiverId: string;
    senderId: string;
    updatedAt: string;
    _id: string;
  };
  participants: string[];
  users: User[];
}

interface MessageAreaProps {
  chat: ChatData;
}

interface ImageData {
  messages: Message[];
}

const MessageArea: React.FC<MessageAreaProps> = ({ chat }) => {
  const [data, setData] = useState<ImageData | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [theme, setTheme] = useState('light');
  const [skinTone, setSkinTone] = useState('light');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const userId = useSelector((store: RootState) => store.UserAuth.userData?._id);
  const token = useSelector((store: RootState) => store.UserAuth.token);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (chat && userId) {
      getMessages();
    }
  }, [chat, userId, token]);

  useEffect(() => {
    if (chat._id) {
      console.log("Setting up socket for chatId:", chat._id);
      socketService.connect();
      socketService.joinConversation(chat._id);

      const receiverId = chat.lastMessage?.receiverId || chat.users.find(user => user.id !== userId)?.id;

      socketService.onNewMessage((message) => {
        console.log("Received new message:", message);
        setData(prevData => {
          const newMessage: Message = {
            _id: message._id || Date.now().toString(),
            senderId: message.senderId,
            receiverId: message.receiverId,
            content: message.content,
            imagesUrl: message.data?.imagesUrl || [], 
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

  const handleSendMessage = async () => {
    const receiverId = chat.lastMessage?.receiverId || chat.users.find(user => user.id !== userId)?.id;
    if ((messageInput.trim() || selectedImages.length > 0) && chat._id && userId && receiverId) {
      let imageUrls: string[] = [];

      if (selectedImages.length > 0) {
        imageUrls = await uploadImages(selectedImages);
      }

      console.log("Attempting to send message:", { chatId: chat._id, userId, receiverId, messageInput, images: imageUrls });
      
      socketService.sendMessage({
        chatId: chat._id,
        senderId: userId,
        receiverId: receiverId,
        content: messageInput,
        images: imageUrls
      });
      
      setMessageInput('');
      setSelectedImages([]);
      setShowEmojiPicker(false);
    } else {
      console.error("Missing required data for sending message:", { chatId: chat._id, userId, receiverId, messageInput, images: selectedImages });
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

  return (
    <div className="flex flex-col h-full">
      <Toaster position="top-center" expand={false} richColors />
      <div className="flex items-center justify-between p-4 border-b border-gray-300">
        <div className="flex items-center gap-4">
          <Avatar src={chat.users.find(user => user.id !== userId)?.avatar.imageUrl} />
          <div>
            <h2 className="text-lg font-semibold">{chat.users.find(user => user.id !== userId)?.name || 'Username'}</h2>
            <span className="text-sm text-gray-500">Online</span>
          </div>
        </div>
        <IconButton>
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
        <div className="relative flex items-center gap-2">
          <IconButton onClick={handleEmojiPickerToggle}>
            <InsertEmoticonIcon />
          </IconButton>
          {showEmojiPicker && (
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
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
          />
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
          <IconButton color="primary" onClick={handleSendMessage}>
            <SendIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default MessageArea;