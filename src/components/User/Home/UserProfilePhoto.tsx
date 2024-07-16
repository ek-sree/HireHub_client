import { useEffect, useState } from 'react';
import HireHub from '../../../assets/images/HireHub.png';
import User from '../../../assets/images/user.png';
import UserProfileDetails from './UserProfileDetails';
import ProfileModal from './ProfileModal';
import { userAxios } from '../../../constraints/axios/userAxios';
import { userEndpoints } from '../../../constraints/endpoints/userEndpoints';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';
import CoverPhotoModal from './CoverPhotoModal';
import { useParams } from 'react-router-dom';

const UserProfile = () => {
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isCoverImgModal, setIsCoverImageModal] = useState(false);
    const [profileImg, setProfileImg] = useState<string>(User);
    const [coverImg, setCoverImg] = useState<string>(HireHub);
    const [sameUser, setSameUser] = useState<boolean>(true);

    const {id} = useParams<{id?:string}>();

    const token = useSelector((store: RootState) => store.UserAuth.token);
    const userId = useSelector((store:RootState)=>store.UserAuth.userData?._id);

    useEffect(() => {
        
        if (userId !== id) {
            setSameUser(false);
        } else {
            setSameUser(true);
        }
        showCoverImg();
            showImage();
    }, [id, userId,token,sameUser,coverImg,profileImg]);
    

    const handleProfileOpenModal = () => {
        setIsProfileModalOpen(true);
    };

    const handleProfileModalClose = () => {
        setIsProfileModalOpen(false);
    };

    const handleSuccess = (profile: string) => {
        setProfileImg(profile); 
    };

    const handleCoverImgOpenModal = () => {
        setIsCoverImageModal(true);
    };

    const handleCoverImgCloseModal = () => {
        setIsCoverImageModal(false);
    };

    const handleSuccessCoverImg = (coverUrl: string) => {
        setCoverImg(coverUrl);
    };

    const sentId = sameUser ? userId : id;
    async function showImage() {
        try {
            const response = await userAxios.get(`${userEndpoints.getProfileImages}?userId=${sentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                const imageUrl = response.data.data?.imageUrl || User; 
                setProfileImg(imageUrl);
            } else {
                setProfileImg(User); 
            }
        } catch (error) {
            console.error("Error fetching profile image:", error);
            setProfileImg(User);
        }
    }

    async function showCoverImg() {
        console.log("Sending userId:", sentId);

        try {
            const response = await userAxios.get(`${userEndpoints.getCoverImage}?userId=${sentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data.success) {
                const imageUrl = response.data.data?.imageUrl || HireHub; 
                setCoverImg(imageUrl);
            } else {
                setCoverImg(HireHub); 
            }
        } catch (error) {
            console.error("Error fetching cover image:", error);
            setCoverImg(HireHub);
        }
    }

    // useEffect(() => {
    //     if (token) {
    //         showCoverImg();
    //         showImage();
    //     }
    // }, [token,sameUser,coverImg,profileImg,id,userId]);

    return (
        <div className="max-w-2xl mx-auto mt-10 px-6 py-8 rounded-lg shadow-md relative">
            <div className="relative h-32 rounded-md overflow-hidden shadow-2xl">
                <img 
                    onClick={sameUser ? handleCoverImgOpenModal : undefined} 
                    src={coverImg|| HireHub} 
                    alt="Cover photo" 
                    className="w-full h-full object-cover rounded-lg" 
                />
            </div>
            <div className="absolute left-1/2 transform -translate-x-1/2 -mt-16 w-28 h-28 border-4 border-slate-200 rounded-full bg-slate-100 shadow-xl flex items-center justify-center">
                
                <img
                    onClick={sameUser? handleProfileOpenModal : undefined}
                    src={profileImg || User} 
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
            {isCoverImgModal && (
                <CoverPhotoModal
                    isOpen={isCoverImgModal}
                    onClose={handleCoverImgCloseModal}
                    onSuccess={handleSuccessCoverImg}
                    imgUrl={coverImg}
                />
            )}
        </div>
    );
};

export default UserProfile;
