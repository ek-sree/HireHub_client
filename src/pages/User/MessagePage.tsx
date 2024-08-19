import React, { useState, useEffect } from "react";
import MessageArea from "../../components/User/Home/MessageArea";
import MessageList from "../../components/User/Home/MessageList";
import { ChatData } from "../../interface/Message/IMessage";


// interface User {
//   id: string;
//   name: string;
//   avatar: {
//     imageUrl: string;
//     originalname: string;
//   };
// }

// interface ChatData {
//   _id: string;
//   lastMessage?: {
//     chatId: string;
//     content: string;
//     createdAt: string;
//     receiverId: string;
//     senderId: string;
//     updatedAt: string;
//     _id: string;
//   } | null;
//   participants: string[];
//   users: User[];
// }

const MessagePage: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<ChatData | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleChatSelect = (chat: ChatData) => {
    setSelectedChat(chat);
  };

  const handleBackToList = () => {
    setSelectedChat(null);
  };

  return (
    <div className="flex h-screen">
      {(!isMobile || (isMobile && !selectedChat)) && (
        <div className={`${isMobile ? 'w-full' : 'w-1/3'} border-r border-gray-300`}>
          <MessageList onChatSelect={handleChatSelect} />
        </div>
      )}
      {(!isMobile || (isMobile && selectedChat)) && (
        <div className={`${isMobile ? 'w-full' : 'w-2/3'}`}>
          {selectedChat ? (
            <MessageArea chat={selectedChat} onBack={isMobile ? handleBackToList : undefined} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a chat to start messaging
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MessagePage;