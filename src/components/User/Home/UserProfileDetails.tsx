import { useEffect, useState } from 'react';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import EditDetailsModal from './EditDetailsModal';
import TitleModal from './TitleModal';
import { userAxios } from '../../../constraints/axios/userAxios';
import { userEndpoints } from '../../../constraints/endpoints/userEndpoints';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';
import InfoModal from './InfoModal';
import { useParams } from 'react-router-dom';

const UserProfileDetails = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTitleModalOpen, setTitleModalOpen] = useState(false);
    const [isInfoModalOpen, setIsInfoModal] = useState(false);
    const [title, setTitle] = useState('');
    const [name, setName] = useState('');
    const [followersCount, setFollowersCount] = useState(0);
    const [isFollowing, setIsFollowing] = useState(false);
    const [sameUser, setSameUser] = useState<boolean>(true);

    const { id } = useParams<{ id?: string }>();

    const token = useSelector((store: RootState) => store.UserAuth.token);
    const email = useSelector((store: RootState) => store.UserAuth.userData?.email);
    const userId = useSelector((store:RootState)=>store.UserAuth.userData?._id);


    console.log("userId:", userId);
console.log("viewed user id:", id);
console.log("is same user:", userId?.toString() === id);

    useEffect(() => {
        if (userId && id && userId.toString() === id || id=== undefined) {
            setSameUser(true);
        } else {
            setSameUser(false);
        }
    }, [id, userId]);
    

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleTitleModal = () => {
        setTitleModalOpen(true);
    };

    const handleCloseTitleModal = () => {
        setTitleModalOpen(false);
    };

    const onTitleData = (data: string) => {
        setTitle(data);
    };

    const handleSuccess = (data: { name: string, profileTitle: string }) => {
        setName(data.name);
        setTitle(data.profileTitle);
    };

    const handleOpenInfoModal = () => {
        setIsInfoModal(true);
    };

    const handleCloseInfoModal = () => {
        setIsInfoModal(false);
    };

    const toggleFollow = async () => {
        try {
            const response = await userAxios.post(`${userEndpoints.toggleFollow}`, { email }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.success) {
                setIsFollowing(!isFollowing);
                setFollowersCount(prevCount => isFollowing ? prevCount - 1 : prevCount + 1);
            } else {
                toast.error("Unable to follow/unfollow user.");
            }
        } catch (error) {
            toast.error("Error occurred while toggling follow status.");
        }
    };

    useEffect(() => {
        const userDetails = async () => {
            try {
                const response = await userAxios.get(`${userEndpoints.viewDetails}?email=${email}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.data.success) {
                    setName(response.data.details.name);
                    setTitle(response.data.details.title);
                    setFollowersCount(response.data.details.followersCount || 0);
                    setIsFollowing(response.data.details.isFollowing || false);
                }
                if (response.status === 403) {
                    toast.error("Token expired, login again");
                }
            } catch (error) {
                toast.error("Error occurred, please log in after some time.");
            }
        };
        userDetails();
    }, [email, token]);


    return (
        <div className="flex flex-col items-center text-center mt-6">
            <div className="mb-4">
                <span className="font-semibold text-3xl text-slate-700">{name}</span>
            </div>
            <div className="flex items-center mb-2 gap-3">
                {!title ? (
                    sameUser&&(

                        <div className="bg-slate-200 py-1 px-2 rounded-md shadow-md hover:cursor-pointer hover:bg-slate-300" onClick={handleTitleModal}>
                        Add title
                    </div>
                    )
                ) : (
                    <span className="font-medium text-lg">{title}</span>
                )}
                {sameUser&&(
                    <EditRoundedIcon onClick={handleOpenModal} className="cursor-pointer" />
                )}
            </div>
            <div className="flex items-center gap-4 mb-4">
                <span className="font-medium text-lg">{followersCount} Followers</span>
                <span className="font-medium text-lg">{followersCount} Following</span>
                </div>
                {!sameUser&&(<button
                    onClick={toggleFollow}
                    className={`px-4 py-2 rounded-lg w-full ${isFollowing ? 'text-black border-4 hover:bg-slate-200 font-medium' : 'bg-cyan-400 text-white'}`}
                >
                    {isFollowing ? 'Unfollow' : 'Follow'}
                </button>)}
            <div onClick={handleOpenInfoModal} className='mt-3 font-semibold text-blue-800 hover:cursor-pointer hover:text-blue-400 italic shadow-sm'>More info .!</div>
            {isModalOpen && (
                <EditDetailsModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    titleValue={title}
                    nameValue={name}
                    onSuccess={handleSuccess}
                />
            )}
            {isTitleModalOpen && (
                <TitleModal
                    isOpen={isTitleModalOpen}
                    onClose={handleCloseTitleModal}
                    titleData={onTitleData}
                />
            )}
            {isInfoModalOpen && (
                <InfoModal
                    isOpen={isInfoModalOpen}
                    onClose={handleCloseInfoModal}
                />
            )}
        </div>
    );
};

export default UserProfileDetails;
