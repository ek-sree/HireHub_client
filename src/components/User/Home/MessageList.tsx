import { Avatar } from "@mui/material";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { messageEndpoints } from "../../../constraints/endpoints/messageEndpoints";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { toast } from "sonner";
import { messageAxios } from "../../../constraints/axios/messageAxios";

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
    recieverId: string;
    senderId: string;
    updatedAt: string;
    _id: string;
  };
  participants: string[];
  users: User[];
}

interface MessageListProps {
  onChatSelect: (chat: ChatData) => void;
}

const MessageList: React.FC<MessageListProps> = ({ onChatSelect }) => {
  const [search, setSearch] = useState('');
  const [chats, setChats] = useState<ChatData[]>([]);

  const token = useSelector((store: RootState) => store.UserAuth.token);
  const userId = useSelector((store: RootState) => store.UserAuth.userData?._id);

  const loadConversation = async () => {
    try {
      const response = await messageAxios.get(`${messageEndpoints.getConvoData}?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.success) {
        setChats(response.data.data);
      }
    } catch (error) {
      console.log("Error occurred loading conversation users", error);
      toast("Error occurred, try later");
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    loadConversation();
  }, [token]);

  const getOtherUser = (chat: ChatData) => {
    return chat.users.find(user => user.id !== userId) || chat.users[0];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="p-4 border-2 border-gray-200 rounded-lg w-full">
      <h2 className="text-xl font-semibold mb-4">Message Lists</h2>
      <div className="p-4">
        <NavLink to='/' className='font-semibold hover:bg-slate-200 py-2 px-2 rounded-xl'>
          <ArrowBackIcon /> Back
        </NavLink>
      </div>
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search users"
          className="w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-400"
        />
      </div>
      <div className="space-y-4">
        {chats.length === 0 ? (
          <div className="text-center text-gray-500">No chats found</div>
        ) : (
          chats.map(chat => {
            const otherUser = getOtherUser(chat);
            return (
              <div
                key={chat._id}
                onClick={() => onChatSelect(chat)}
                className="flex items-center gap-4 p-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition cursor-pointer"
              >
                <Avatar src={otherUser.avatar.imageUrl} alt={otherUser.name} />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-medium">{otherUser.name}</span>
                    {chat.lastMessage && (
                      <span className="text-xs text-gray-500">
                        {formatDate(chat.lastMessage.createdAt)}
                      </span>
                    )}
                  </div>
                  {chat.lastMessage ? (
                    <span className="text-sm text-gray-500">{chat.lastMessage.content}</span>
                  ) : (
                    <span className="text-sm text-gray-400">No messages yet</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MessageList;
