// import { useState } from 'react';
// import MessageArea from '../../components/User/Home/MessageArea';
// import MessageList from '../../components/User/Home/MessageList';


// interface User {
//     id: string;
//     name: string;
//     avatar: {
//       imageUrl: string;
//       originalname: string;
//     };
//   }
  
//   interface ChatData {
//     _id: string;
//     lastMessage?: {
//       chatId: string;
//       content: string;
//       createdAt: string;
//       receiverId: string;
//       senderId: string;
//       updatedAt: string;
//       _id: string;
//     } | null;
//     participants: string[];
//     users: User[];
//   }

// const MessageRecruiter = () => {
//     const [selectedChat, setSelectedChat] = useState<ChatData | null>(null);

//     const handleChatSelect = (chat: ChatData) => {
//       setSelectedChat(chat);
//     };
  
//     return (
//       <div className="flex h-screen">
//         <div className="w-1/3 border-r border-gray-300">
//           {/* <MessageList onChatSelect={handleChatSelect} /> */}
//         </div>
//         <div className="w-2/3">
//           {selectedChat ? (
//             // <MessageArea chat={selectedChat} />
//           ) : (
//             <div className="flex items-center justify-center h-full text-gray-500">
//               Select a chat to start messaging
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

// export default MessageRecruiter