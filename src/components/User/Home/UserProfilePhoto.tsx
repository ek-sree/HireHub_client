import { useState } from 'react';
import HireHub from '../../../assets/images/HireHub.png';
import User from '../../../assets/images/user.png';
import UserProfileDetails from './UserProfileDetails';
import ProfileModal from './ProfileModal';

const UserProfile = () => {
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    const handleProfileOpenModal=()=>{
        setIsProfileModalOpen(true)
    }

    const handleProfileModalClose =()=>{
        setIsProfileModalOpen(false);
    }

    return (
        <div className=" max-w-2xl mx-auto mt-10 px-6 py-8 rounded-lg shadow-md relative">
            <div className="relative h-32 rounded-md overflow-hidden shadow-2xl">
                <img src={HireHub} alt="Cover photo" className="w-full h-full object-cover rounded-lg" />
            </div>
            <div className="absolute left-1/2 transform -translate-x-1/2 -mt-16 w-28 h-28 border-4 border-slate-200 rounded-full bg-slate-100 shadow-xl flex items-center justify-center">
                <img onClick={handleProfileOpenModal} src={User} alt="user" className="w-full h-full rounded-full" />
            </div>
            <div className="mt-20">
                <UserProfileDetails />
            </div>
            {isProfileModalOpen &&(
                <ProfileModal 
                isOpen={isProfileModalOpen}
                onClose={handleProfileModalClose}
                />
            )}
        </div>
    );
};

export default UserProfile;
