import GroupAddRoundedIcon from '@mui/icons-material/GroupAddRounded';
import PersonRemoveRoundedIcon from '@mui/icons-material/PersonRemoveRounded';
import { userAxios } from '../../../constraints/axios/userAxios';
import { userEndpoints } from '../../../constraints/endpoints/userEndpoints';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';
import { useEffect, useState } from 'react';
import UserPic from '../../../assets/images/user.png'
import { NavLink } from 'react-router-dom';
import { toast } from 'sonner';
import { IconButton } from '@mui/material';

interface Friend {
  id: string;
  name: string;
  avatar: {
    imageUrl: string;
    originalname: string;
  };
  isOnline: boolean;
  isFollowing: boolean;
}

const FriendSuggestion = () => {
  const [friends, setFriends] = useState<Friend[]>([]);

  const userId = useSelector((store: RootState) => store.UserAuth.userData?._id);
  const token = useSelector((store: RootState) => store.UserAuth.token);

  async function getFriendSuggestion() {
    try {
      const response = await userAxios.get(`${userEndpoints.friendSuggestion}?userId=${userId}`);
      if (response.data.success) {
        setFriends(response.data.data.map((friend: Friend) => ({...friend, isFollowing: false})));
      }
    } catch (error) {
      console.log("Error while fetching friend suggestion", error);
    }
  }

  const handleFollow = async (id: string) => {
    try {
      const response = await userAxios.post(`${userEndpoints.follow}?userId=${userId}`, { id });
      if (response.data.success) {
        setFriends(friends.map(friend => 
          friend.id === id ? {...friend, isFollowing: true} : friend
        ));
        toast.success("Successfully followed user.");
      } else {
        toast.error("Unable to follow user.");
      }
    } catch (error) {
      console.error("Error occurred while following user:", error);
      toast.error("Error occurred while following user.");
    }
  };

  const handleUnfollow = async (id: string) => {
    try {      
      const response = await userAxios.post(`${userEndpoints.unfollow}?userId=${userId}&id=${id}`);
      if (response.data.success) {
        setFriends(friends.map(friend => 
          friend.id === id ? {...friend, isFollowing: false} : friend
        ));
        toast.success("Successfully unfollowed user.");
      } else {
        toast.error("Unable to unfollow user.");
      }
    } catch (error) {
      console.error("Error occurred while unfollowing user:", error);
      toast.error("Error occurred while unfollowing user.");
    }
  };

  useEffect(() => {
    getFriendSuggestion();
  }, [token]);

  return (
    <div className="hidden sm:block fixed top-32 right-10 w-60 h-auto rounded-lg shadow-2xl py-6 px-2 z-50 bg-white">
      <div className="text-center font-semibold mb-4 underline">Friend Suggestions</div>
      {friends.map(friend => (
        <div key={friend.id} className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <img
              src={friend.avatar.imageUrl || UserPic}
              alt={friend.name}
              className="w-11 h-11 rounded-full mr-3 shadow-xl border-2"
            />
            <NavLink to={`/userprofile/${friend.id}`}>
              <span className="font-normal font-serif text-slate-500 cursor-pointer hover:text-blue-400">{friend.name}</span>
            </NavLink>
          </div>
          <IconButton onClick={() => friend.isFollowing ? handleUnfollow(friend.id) : handleFollow(friend.id)}>
            {friend.isFollowing ? (
              <PersonRemoveRoundedIcon
                fontSize="small"
                className="shadow-sm hover:scale-110 hover:bg-gray-200 rounded-md transition-transform duration-200 ease-in-out text-red-500"
              />
            ) : (
              <GroupAddRoundedIcon
                fontSize="small"
                className="shadow-sm hover:scale-110 hover:bg-gray-200 rounded-md transition-transform duration-200 ease-in-out"
              />
            )}
          </IconButton>
        </div>
      ))}
    </div>
  );
};

export default FriendSuggestion;