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
import { useNavigate, useParams } from 'react-router-dom';
import { messageAxios } from '../../../constraints/axios/messageAxios';
import { messageEndpoints } from '../../../constraints/endpoints/messageEndpoints';
import FollowerModal from './FollowerModal';
import FollowingModal from './FollowingModal';

const UserProfileDetails = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isTitleModalOpen, setTitleModalOpen] = useState<boolean>(false);
    const [isInfoModalOpen, setIsInfoModal] = useState<boolean>(false);
    const [title, setTitle] = useState('');
    const [name, setName] = useState('');
    const [followersCount, setFollowersCount] = useState<number>(0);
    const [followingCount, setFollowingCount] = useState<number>(0);
    const [isFollowing, setIsFollowing] = useState<boolean>(false);
    const [sameUser, setSameUser] = useState<boolean>(true);
    const [isOpenFollowers, setIsOpenFollowers] = useState<boolean>(false);
    const [idToSend, setIdToSend] = useState<string>('');
    const [isOpenFollowing, setIsopenFollowing] = useState<boolean>(false);

    const { id } = useParams<{ id?: string }>();
    const token = useSelector((store: RootState) => store.UserAuth.token);
    const userId = useSelector((store: RootState) => store.UserAuth.userData?._id);

    const navigate = useNavigate();

    useEffect(() => {
        if (userId !== id) {
            setSameUser(false);
        } else {
            setSameUser(true);
        }
        userDetails();
    }, [token, sameUser, id]);

    const handleRemoveSuccess = () => {
        userDetails(); 
    };

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);
    const handleTitleModal = () => setTitleModalOpen(true);
    const handleCloseTitleModal = () => setTitleModalOpen(false);
    const onTitleData = (data: string) => setTitle(data);
    const handleSuccess = (data: { name: string; profileTitle: string }) => {
        setName(data.name);
        setTitle(data.profileTitle);
    };
    const handleOpenInfoModal = () => setIsInfoModal(true);
    const handleCloseInfoModal = () => setIsInfoModal(false);

    const handleFollow = async () => {
        try {
            const response = await userAxios.post(`${userEndpoints.follow}?userId=${userId}`, { id });
            if (response.data.success) {
                setIsFollowing(!isFollowing);
                setFollowersCount((prevCount) => (prevCount + 1));
            } else {
                toast.error("Unable to follow/unfollow user.");
            }
        } catch (error) {
            toast.error("Error occurred while toggling follow status.");
        }
    };

    const handleUnFollow = async () => {
        try {
            const response = await userAxios.post(`${userEndpoints.unfollow}?userId=${userId}&id=${id}`);
            if (response.data.success) {
                setIsFollowing(!isFollowing);
                setFollowersCount((prevCount) => prevCount - 1);
            }
        } catch (error) {
            console.log("Error occurred while unfollowing", error);
        }
    };

    const handleSendMessage = async () => {
        try {
            const response = await messageAxios.post(`${messageEndpoints.createChatId}?userId=${userId}&recieverId=${id}`);
            if (response.data.success) {
                const chatId = response.data.data._id;
                console.log("Chat ID from server:", chatId);
                navigate(`/message/?chatId=${chatId}&recieverId=${id}`);
            }
        } catch (error) {
            console.log("Error occurred while navigating message area", error);
        }
    };

    const sentId = sameUser ? userId : (id || '');
    const userDetails = async () => {
        if (!sentId) return;
    
        try {
            const response = await userAxios.get(`${userEndpoints.viewDetails}?userId=${sentId}&followerId=${userId}`);
    
            if (response.data.success) {
                const details = response.data.details; 
                
                setName(details.name);
                setTitle(details.title);
                setFollowersCount(details.followers.length || 0);
                setFollowingCount(details.following.length || 0);
                setIsFollowing(details.isFollowing);
            }
    
            if (response.status === 403) {
                toast.error("Token expired, login again");
            }
        } catch (error) {
            toast.error("Error occurred, please log in after some time.");
        }
    };


    const handleFollowerOpen=(id:string)=>{
        setIsOpenFollowers(true);
        setIdToSend(id);
    }

    const handleFollowingOpen=(id:string)=>{
        setIsopenFollowing(true);
        setIdToSend(id)
    }
    

    return (
        <div className="flex flex-col items-center text-center mt-6">
            <div className="mb-4">
                <span className="font-semibold text-3xl text-slate-700">{name}</span>
            </div>
            <div className="flex items-center mb-2 gap-3">
                {!title ? (
                    sameUser && (
                        <div
                            className="bg-slate-200 py-1 px-2 rounded-md shadow-md hover:cursor-pointer hover:bg-slate-300"
                            onClick={handleTitleModal}
                        >
                            Add title
                        </div>
                    )
                ) : (
                    <span className="font-medium text-lg">{title}</span>
                )}
                {sameUser && (
                    <EditRoundedIcon onClick={handleOpenModal} className="cursor-pointer" />
                )}
            </div>
            <div className="flex items-center gap-4 mb-4">
                <span onClick={()=>handleFollowerOpen(sentId || '')} className="font-semibold text-lg hover:text-slate-600 cursor-pointer hover:font-normal">{followersCount} Followers</span>
                <span onClick={()=>handleFollowingOpen(sentId || '')} className="font-semibold text-lg hover:text-slate-600 cursor-pointer hover:font-normal">{followingCount} Following</span>
            </div>
            {!sameUser && (
                <div className="flex w-full gap-2">
                    {isFollowing ? (
                        <>
                            <button
                                onClick={handleUnFollow}
                                className={"flex-1 px-4 py-2 rounded-lg text-black border-4 hover:bg-slate-200 font-medium"}
                            >
                                Unfollow
                            </button>
                            <button
                                onClick={handleSendMessage}
                                className={"flex-1 px-4 py-2 rounded-lg text-black bg-slate-300 hover:bg-slate-200 font-medium"}
                            >
                                Message
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleFollow}
                            className={"px-4 py-2 rounded-lg w-full bg-cyan-400 text-white"}
                        >
                            Follow
                        </button>
                    )}
                </div>
            )}
            <div
                onClick={handleOpenInfoModal}
                className='mt-3 font-semibold text-blue-800 hover:cursor-pointer hover:text-blue-400 italic shadow-sm'
            >
                More info .!
            </div>
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
            {isOpenFollowers&&(
                <FollowerModal
                isOpen={isOpenFollowers}
                id={idToSend}
                onSuccess={handleRemoveSuccess}
                onClose={()=>setIsOpenFollowers(false)}
                />
            )}
            {isOpenFollowing&&(
                <FollowingModal
                isOpen={isOpenFollowing}
                id={idToSend}
                onSuccess={handleRemoveSuccess}
                onClose={()=>setIsopenFollowing(false)}
                />
            )}
        </div>
    );
};

export default UserProfileDetails;
