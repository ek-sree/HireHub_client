import { useEffect, useState } from 'react';
import HireHub from '../../../assets/images/HireHub.png';
import User from '../../../assets/images/user.png';
import UserProfileDetails from './UserProfileDetails';
import ProfileModal from './ProfileModal';
import { userAxios } from '../../../constraints/axios/userAxios';
import { userEndpoints } from '../../../constraints/endpoints/userEndpoints';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';

const UserProfile = () => {
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [profileImg, setProfileImg] = useState<string>(User);

    const token = useSelector((store: RootState) => store.UserAuth.token);
    const email = useSelector((store: RootState) => store.UserAuth.userData?.email);

    const handleProfileOpenModal = () => {
        setIsProfileModalOpen(true);
    }

    const handleProfileModalClose = () => {
        setIsProfileModalOpen(false);
    }

    const handleSuccess = (profile: string) => {
        setProfileImg(profile); 
    }

    async function showImage() {
        try {
            const response = await userAxios.get(`${userEndpoints.getProfileImages}?email=${email}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("api data profile img", response.data);

            if (response.data.success && response.data.data && response.data.data.imageUrl) {
                setProfileImg(response.data.data.imageUrl);
            } else {
                setProfileImg(User); 
            }
        } catch (error) {
            console.error("Error fetching profile image:", error);
            setProfileImg(User);
        }
    }

    useEffect(() => {
        showImage();
    }, [token, email]);

    return (
        <div className="max-w-2xl mx-auto mt-10 px-6 py-8 rounded-lg shadow-md relative">
            <div className="relative h-32 rounded-md overflow-hidden shadow-2xl">
                <img src={HireHub} alt="Cover photo" className="w-full h-full object-cover rounded-lg" />
            </div>
            <div className="absolute left-1/2 transform -translate-x-1/2 -mt-16 w-28 h-28 border-4 border-slate-200 rounded-full bg-slate-100 shadow-xl flex items-center justify-center">
                <img
                    onClick={handleProfileOpenModal}
                    src={profileImg}
                    alt="user"
                    className="w-full h-full rounded-full"
                />
            </div>
            <div className="mt-20">
                <UserProfileDetails />
            </div>
            {isProfileModalOpen && (
                <ProfileModal 
                    isOpen={isProfileModalOpen}
                    onClose={handleProfileModalClose}
                    onSuccess={handleSuccess}
                    imgUrl={profileImg}
                />
            )}
        </div>
    );
};

export default UserProfile;
