import { FC, useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';
import { userAxios } from '../../../constraints/axios/userAxios';
import { userEndpoints } from '../../../constraints/endpoints/userEndpoints';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';
import { NavLink } from 'react-router-dom';

interface Follower {
  id: string;
  name: string;
  avatar: {
    imageUrl: string;
  };
}

interface FollowersProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess:()=>void;
  id:string;
}

const FollowerModal: FC<FollowersProps> = ({ isOpen, onClose, id ,onSuccess}) => {

    const [followers, setFollowers] = useState<Follower[]>([]);
    const [isFollow, setIsFollow] = useState<boolean>(true);

    const userId = useSelector((store:RootState)=>store.UserAuth.userData?._id);
    const sameUser = userId==id;

    async function getFollowers(){
        try {
            const response = await userAxios.get(`${userEndpoints.followersList}?userId=${id}`);
            if(response.data.success){
                setFollowers(response.data.data);
            }
        } catch (error) {
            toast.error("Error occured, Please login again!!");
            console.log("error occured while fetching followers");
        }
    }

    const handleRemoveFollower = async (id: string) => {
        try {
          const response = await userAxios.put(`${userEndpoints.removeFollower}?userId=${userId}&id=${id}`);
          if (response.data.success) {
          setIsFollow(!isFollow)
          onSuccess();
            toast.success("Successfully removed user.");
          } else {
            toast.error("Unable to remove user.");
          }
        } catch (error) {
          console.error("Error occurred while removing user:", error);
          toast.error("Error occurred while removing user.");
        }
      };
    

    useEffect(()=>{
        getFollowers();
    },[id])

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <Toaster position="top-center" expand={false} richColors />
      <div className="bg-white w-full max-w-md p-4 rounded-lg shadow-lg">
        <div className="flex justify-center items-center  relative mb-4">
          <h2 className="text-xl font-bold underline">Followers</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 absolute right-0">
            Close
          </button>
        </div>
        <div className="space-y-4">
          {followers.length===0? <span className='font-medium text-slate-500'>"No followers found"</span> :followers.map((follower) => (
            <div key={follower.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={follower.avatar.imageUrl}
                  alt={follower.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                  <NavLink to={`/userprofile/${follower.id}`} onClick={onClose}><span className="font-medium hover:text-slate-400">{follower.name}</span></NavLink>
              </div>
              <button>
                {isFollow && sameUser?<span onClick={()=>handleRemoveFollower(follower.id)} className="text-red-500 hover:text-red-700">Remove</span>: "" }
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FollowerModal;
