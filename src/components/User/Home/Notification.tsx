import React, { useEffect, useState } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import UserPic from '../../../assets/images/user.png';
import { NavLink } from 'react-router-dom';
import HireHub from '../../../assets/images/HireHub.png'
import { postAxios } from '../../../constraints/axios/postAxios';
import { postEndpoints } from '../../../constraints/endpoints/postEndpoints';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';
import { toast } from 'sonner';

interface NotificationProps {
  userPhoto: string;
  userName: string;
  notificationType: 'like' | 'comment';
  notificationContent?: string;
  postContent: string;
  postImage: string;
  onBack: () => void;
}

const Notification: React.FC<NotificationProps> = () => {

    const [notification, setNotification] = useState([]);

    const userId = useSelector((store:RootState)=>store.UserAuth.userData?._id);
    const token = useSelector((store:RootState)=>store.UserAuth.token);

    async function getAllNotification(){
        try {
            const response = await postAxios.get(`${postEndpoints.notification}?userId=${userId}`,{
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
            console.log("NOtification data api", response.data);
            if(response.data.success){
                setNotification(response.data.data);
            }
        } catch (error) {
            console.log("error fetching notification",error);
            toast.error("Error fetching notification")
        }
    }


    useEffect(()=>{
        getAllNotification();
    },[])

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto mt-4 px-4">
        <NavLink to='/'>
        <button className="flex items-center text-blue-500 mb-4 hover:bg-slate-300 rounded-xl px-1">
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back
        </button>
        </NavLink>
        <div className="flex items-center p-4 bg-white shadow rounded-lg mb-4">
          <img
            src={UserPic}
            alt="User Profile"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="ml-4 flex-1">
            <p className="text-sm font-medium text-gray-900">
              <span className="font-bold">sreehari</span> liked post
            </p>
            {/* {notificationType === 'comment' && (
              <p className="text-sm text-gray-500 mt-1">{notificationContent}</p>
            )} */}
          </div>
          <img
            src={HireHub}
            alt="Post"
            className="w-16 h-16 rounded-lg object-cover ml-4"
          />
        </div>
      </div>
    </div>
  );
};

export default Notification;
