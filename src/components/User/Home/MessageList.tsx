import React, { useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import { NavLink } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { toast } from "sonner";
import { messageAxios } from "../../../constraints/axios/messageAxios";
import socketService from "../../../socket/socketService";
import { messageEndpoints } from "../../../constraints/endpoints/messageEndpoints";
import { ChatData } from "../../../interface/Message/IMessage";

interface MessageListProps {
  onChatSelect: (chat: ChatData) => void;
}

const MessageList: React.FC<MessageListProps> = ({ onChatSelect }) => {
  const [search, setSearch] = useState("");
  const [chats, setChats] = useState<ChatData[]>([]);
  const [, setNewMessageChatIds] = useState<Set<string>>(new Set());

  const token = useSelector((store: RootState) => store.UserAuth.token);
  const userId = useSelector((store: RootState) => store.UserAuth.userData?._id);

  const loadConversation = async () => {
    try {
      const response = await messageAxios.get(
        `${messageEndpoints.getConvoData}?userId=${userId}`
      );

      if (response.data.success) {
        const sortedChats = response.data.data.sort(
          (a: ChatData, b: ChatData) =>
            new Date(b.lastMessage?.createdAt || 0).getTime() -
            new Date(a.lastMessage?.createdAt || 0).getTime()
        );
        setChats(sortedChats);
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

    socketService.connect();

    if (userId) {
      socketService.emitUserOnline(userId);
    }

    socketService.onUserStatusChanged((data) => {
      setChats((prevChats) =>
        prevChats.map((chat) => {
          const updatedUsers = chat.users.map((user) =>
            user.id === data.userId
              ? { ...user, isOnline: data.isOnline }
              : user
          );
          return { ...chat, users: updatedUsers };
        })
      );
    });

    socketService.onNewMessage((message) => {
      setChats((prevChats) => {
        const updatedChats = prevChats.map((chat) =>
          chat._id === message.chatId
            ? {
                ...chat,
                lastMessage: {
                  ...message,
                  createdAt: new Date().toISOString(),
                },
              }
            : chat
        );
        return updatedChats.sort(
          (a, b) =>
            new Date(b.lastMessage?.createdAt || 0).getTime() -
            new Date(a.lastMessage?.createdAt || 0).getTime()
        );
      });

      if (message.receiverId === userId) {
        setNewMessageChatIds((prev) => new Set(prev).add(message.chatId));
      }
    });

    return () => {
      socketService.disconnect();
    };
  }, [userId, token]);

  const getOtherUser = (chat: ChatData) => {
    return chat.users.find((user) => user.id !== userId) || chat.users[0];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const isUnread = (chat: ChatData) => {
    return chat.lastMessage && chat.lastMessage.recieverId === userId && !chat.lastMessage.read;
  };

  return (
    <div className="p-4 border-2 border-gray-200 rounded-lg w-full">
      <h2 className="text-xl font-semibold mb-4">Message Lists</h2>
      <div className="p-4">
        <NavLink
          to="/"
          className="font-semibold hover:bg-slate-200 py-2 px-2 rounded-xl"
        >
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
          chats.map((chat) => {
            const otherUser = getOtherUser(chat);
            const unread = isUnread(chat);

            return (
              <div
                key={chat._id}
                onClick={() => {
                  onChatSelect(chat);
                  setNewMessageChatIds((prev) => {
                    const updated = new Set(prev);
                    updated.delete(chat._id); 
                    return updated;
                  });
                }}
                className={`flex items-center gap-4 p-2 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition cursor-pointer ${
                  unread ? "bg-green-100" : "bg-white"
                }`}
              >
                <div className="relative">
                  <Avatar
                    src={otherUser.avatar.imageUrl}
                    alt={otherUser.name}
                  />
                  <span
                    className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full ${
                      otherUser.isOnline ? "bg-green-500" : "bg-gray-500"
                    }`}
                  ></span>
                  {unread && (
                    <span className="absolute top-0 left-0 block h-2 w-2 rounded-full bg-green-500"></span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{otherUser.name}</span>
                    {unread && (
                      <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        New
                      </span>
                    )}
                  </div>
                  {chat.lastMessage ? (
                    <span className="text-sm text-gray-500">
                      {chat.lastMessage.content}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400">
                      No messages yet
                    </span>
                  )}
                  {chat.lastMessage && (
                    <div className="flex items-center">
                      <span className="text-xs text-gray-900 font-semibold italic pr-2">
                        {formatDate(chat.lastMessage.createdAt)}
                      </span>
                    </div>
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
