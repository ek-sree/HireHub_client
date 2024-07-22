import React, { useEffect, useState } from "react";
import { Avatar, IconButton } from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import ImageIcon from "@mui/icons-material/Image";
import SendIcon from "@mui/icons-material/Send";
import CheckIcon from '@mui/icons-material/Check';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { useParams, useLocation } from "react-router-dom";
import { messageAxios } from "../../../constraints/axios/messageAxios";
import { messageEndpoints } from "../../../constraints/endpoints/messageEndpoints";
import socketService from "../../../socket/socketService";
import messageWallpaper from '../../../assets/images/WhatsApp-Chat-theme-iPhone-stock-744.webp';

interface Message {
    _id: string;
    sender: string;
    text: string;
    timestamp: string;
    seen: boolean;
}

interface User {
    id: string;
    name: string;
    avatar: {
        imageUrl: string;
        originalname: string;
    };
}

interface MessageData {
    messages: Message[];
    user: User | null;
}

const MessageArea: React.FC = () => {
    const [data, setData] = useState<MessageData | null>(null);
    const [messageInput, setMessageInput] = useState('');
    const userId = useSelector((store: RootState) => store.UserAuth.userData?._id);
    // const { chatId } = useParams<{ chatId?: string }>();
    const token = useSelector((store: RootState) => store.UserAuth.token);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const recieverId = queryParams.get('recieverId');
    const chatId = queryParams.get('chatId');

    async function getMessages() {
        try {
            const response = await messageAxios.get(`${messageEndpoints.getMessage}?userId=${userId}&recieverId=${recieverId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("Messages fetched:", response.data);
            
            if (response.data.success) {
                setData(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    }

    useEffect(() => {
        getMessages();
    }, [token, recieverId]);

    useEffect(() => {
        if (chatId) {
            console.log("Setting up socket for chatId:", chatId);
            socketService.connect();
            socketService.joinConversation(chatId);
            
            socketService.onNewMessage((message) => {
                console.log("Received new message:", message);
                setData(prevData => {
                    const newMessage = {
                        _id: message._id || Date.now().toString(),
                        sender: message.senderId,
                        text: message.content,
                        timestamp: new Date().toISOString(),
                        seen: false
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
    }, [chatId]);

    const getFormattedDate = (date: string) => {
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        if (date === today) return 'Today';
        if (date === yesterday) return 'Yesterday';

        return new Date(date).toLocaleDateString();
    };

    const handleSendMessage = () => {
        if (messageInput.trim() && chatId && userId && recieverId) {
            console.log("Attempting to send message:", { chatId, userId, recieverId, messageInput });
            socketService.sendMessage({
                chatId,
                senderId: userId,
                receiverId: recieverId,
                content: messageInput
            });
            setMessageInput('');
        } else {
            console.error("Missing required data for sending message:", { chatId, userId, recieverId, messageInput });
        }
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
            const showDate = message.timestamp !== currentDate;
            currentDate = message.timestamp;

            return (
                <div key={message._id}>
                    {showDate && (
                        <div className="text-center my-2 text-sm text-gray-500 bg-blue-200 rounded-md shadow-md mx-auto w-1/6">
                            {getFormattedDate(message.timestamp)}
                        </div>
                    )}
                    <div className={`flex ${message.sender === userId ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-2 rounded-lg max-w-xs ${message.sender === userId ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                            <div>{message.text}</div>
                            <div className="flex items-center mt-1 text-xs text-gray-400">
                                <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
                                {message.sender === userId && (
                                    <span className="ml-1">
                                        {message.seen ? <DoneAllIcon fontSize="small" /> : <CheckIcon fontSize="small" />}
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
            <div className="flex items-center justify-between p-4 border-b border-gray-300">
                <div className="flex items-center gap-4">
                    <Avatar src={data?.user?.avatar?.imageUrl} />
                    <div>
                        <h2 className="text-lg font-semibold">{data?.user?.name || 'Username'}</h2>
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
                <div className="flex items-center gap-2">
                    <IconButton>
                        <InsertEmoticonIcon />
                    </IconButton>
                    <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                    />
                    <IconButton>
                        <ImageIcon />
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