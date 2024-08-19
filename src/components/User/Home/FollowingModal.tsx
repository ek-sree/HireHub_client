import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { toast, Toaster } from "sonner";
import { userAxios } from "../../../constraints/axios/userAxios";
import { userEndpoints } from "../../../constraints/endpoints/userEndpoints";
import { NavLink } from "react-router-dom";

interface Following {
  id: string;
  name: string;
  avatar: {
    imageUrl: string;
  };
  isFollowing: boolean;
}

interface FollowingProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  id: string;
}

const FollowingModal: FC<FollowingProps> = ({ onClose, isOpen, id, onSuccess }) => {
  const [followings, setFollowings] = useState<Following[]>([]);

  const userId = useSelector((store: RootState) => store.UserAuth.userData?._id);
  const sameUser = userId == id;

  async function getFollowers() {
    try {
      const response = await userAxios.get(`${userEndpoints.followingList}?userId=${id}`);
      if (response.data.success) {
        setFollowings(response.data.data);
      }
    } catch (error) {
      toast.error("Error occurred, Please login again!!");
      console.log("error occurred while fetching followers");
    }
  }

  const handleFollow = async (id: string) => {
    try {
      const response = await userAxios.post(`${userEndpoints.follow}?userId=${userId}`, { id });
      if (response.data.success) {
        setFollowings(prevFollowings =>
          prevFollowings.map(following =>
            following.id === id
              ? { ...following, isFollowing: false } 
              : following
          )
        );
      } else {
        toast.error("Unable to follow user.");
      }
    } catch (error) {
      toast.error("Error occurred while toggling follow status.");
    }
  };

  const handleUnFollow = async (id: string) => {
    try {
      const response = await userAxios.post(`${userEndpoints.unfollow}?userId=${userId}&id=${id}`);
      if (response.data.success) {
        setFollowings(prevFollowings =>
          prevFollowings.map(following =>
            following.id === id
              ? { ...following, isFollowing: true } 
              : following
          )
        );
      }
    } catch (error) {
      console.log("Error occurred while unfollowing", error);
    }
  };

  useEffect(() => {
    getFollowers();
  }, [id]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <Toaster position="top-center" expand={false} richColors />
      <div className="bg-white w-full max-w-md p-4 rounded-lg shadow-lg">
        <div className="flex justify-center items-center  relative mb-4">
          <h2 className="text-xl font-bold underline">Followers</h2>
          <button onClick={()=>{onClose(); onSuccess()}} className="text-gray-500 hover:text-gray-800 absolute right-0">
            Close
          </button>
        </div>
        <div className="space-y-4">
          {followings.length === 0 ? (
            <span className="font-medium text-slate-500">"No followers found"</span>
          ) : (
            followings.map((following) => (
              <div key={following.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={following.avatar.imageUrl}
                    alt={following.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                 <NavLink to={`/userprofile/${following.id}`} onClick={onClose}><span className="font-medium hover:text-slate-400">{following.name}</span></NavLink> 
                </div>
                <button>
                  {sameUser&&(
                  !following.isFollowing ? (
                    <span
                      onClick={() => handleUnFollow(following.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Unfollow
                    </span>
                  ) : (
                    <span
                      onClick={() => handleFollow(following.id)}
                      className="text-green-500 hover:text-green-700"
                    >
                      Follow
                    </span>
                 ) )}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowingModal;
