import React, { useEffect, useState } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import UserPic from '../../../assets/images/user.png';
import { NavLink } from 'react-router-dom';
import { postAxios } from '../../../constraints/axios/postAxios';
import { postEndpoints } from '../../../constraints/endpoints/postEndpoints';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';
import { toast } from 'sonner';
import socketService from '../../../socket/socketService';
import { resetUnseenCount } from '../../../redux/slice/NotificationSlice';

interface NotificationItem {
  _id: string;
  userId: string;
  postId: string;
  likedBy: string;
  notification: string;
  createdAt: string;
  updatedAt: string;
  postImage: string;
  user: {
    avatar: {
      imageUrl: string;
      originalname: string;
    };
    id: string;
    isOnline: boolean;
    name: string;
  };
}

const Notification: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const userId = useSelector((store: RootState) => store.UserAuth.userData?._id);
  const token = useSelector((store: RootState) => store.UserAuth.token);

  const dispatch = useDispatch();

  async function getAllNotification() {
    console.log("Notification api call");
    try {
      const response = await postAxios.get(`${postEndpoints.notification}?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Notification data api", response.data);
      if (response.data.success) {
        setNotifications(response.data.data);
      }else{
        setNotifications([]);
      }
    } catch (error) {
      console.log("error fetching notification", error);
      toast.error("Error fetching notification");
    }
  }

  useEffect(() => {

    dispatch(resetUnseenCount());
  }, [dispatch]);

  useEffect(() => {
    socketService.connect();
    socketService.joinRoom(userId); 
    getAllNotification();

    socketService.newNotification((newNotification: NotificationItem) => {
      console.log("Received new notification:", newNotification);
      setNotifications(prevNotifications => [newNotification, ...prevNotifications]);
    });

    return () => {
      socketService.disconnect();
    };
  }, [userId, token]);


  const userNotifications = notifications.filter(notification => notification.userId === userId);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto mt-4 px-4">
        <NavLink to='/'>
          <button className="flex items-center text-blue-500 mb-4 hover:bg-slate-300 rounded-xl px-1">
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back
          </button>
        </NavLink>
        {userNotifications.length > 0 ? (
          userNotifications.map((notification) => (
            <div key={notification._id} className="flex items-center p-4 bg-white shadow rounded-lg mb-4">
              <img
                src={notification.user?.avatar?.imageUrl || UserPic}
                alt="User Profile"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  <span className="font-bold">{notification.user?.name}</span> liked your post
                </p>
              </div>
              <img
                src={notification.postImage}
                alt="Post"
                className="w-16 h-16 rounded-lg object-cover ml-4"
              />
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-lg font-medium text-gray-600">No notifications yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notification;