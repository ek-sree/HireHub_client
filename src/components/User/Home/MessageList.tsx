import { Avatar } from "@mui/material";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { messageAxios } from "../../../constraints/axios/messageAxios";
import { messageEndpoints } from "../../../constraints/endpoints/messageEndpoints";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { toast } from "sonner";

const MessageList = () => {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);

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
        setUsers(response.data.data);
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

  return (
    <div className="p-4 border-2 border-gray-200 rounded-lg w-full">
      <h2 className="text-xl font-semibold mb-4">Message Lists</h2>
      <div className="p-4">
        <NavLink to='/' className='font- font-semibold hover:bg-slate-200 py-2 px-2 rounded-xl'>
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
        {users.length === 0 ? (
          <div className="text-center text-gray-500">No users found</div>
        ) : (
          users.map(user => (
            <div key={user._id} className="flex items-center gap-4 p-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition">
              <Avatar />
              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="font-medium">{user.name}</span>
                  <span className="text-xs text-gray-500">{user.lastMessageTime}</span>
                </div>
                <span className="text-sm text-gray-500">{user.lastMessage}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MessageList;
