import User from '../../../assets/images/user.png';
import HireHub from '../../../assets/images/HireHub.png';
import ThumbUpRoundedIcon from '@mui/icons-material/ThumbUpRounded';
import ModeCommentRoundedIcon from '@mui/icons-material/ModeCommentRounded';
import ProfileSideNav from './ProfileSideNav';
import SidebarNav from './SidebarNav';

const UserPost = () => {
  return (
    <div className="max-w-2xl mx-auto mt-10 mb-10">
        <ProfileSideNav/>
        <SidebarNav/>
        <div className="bg-white rounded-lg shadow-lg p-4">
            <div className='flex items-center mb-4'>
                <img src={User} alt="userprofile" className='rounded-full w-11 h-11 border-4 border-gray-100'/>
                <div className='ml-4'>
                    <div className='font-semibold'>User Name</div>
                    <div className='text-gray-500 text-sm'>Time</div>
                </div>
            </div>
            <div className='mb-4 pt-3'>
                <p>Here is the place for add text or decription..</p>
            </div>
            <div className='rounded-lg overflow-hidden'>
                <img src={HireHub} alt="Post content" className='w-full h-auto'/>
            </div>
            <div className='flex justify-between mt-4'>
                <div className='flex items-center space-x-2'>
                    <ThumbUpRoundedIcon fontSize='small'/>
                    <span className='text-gray-500 hover:text-gray-800 hover:cursor-pointer'>100 Likes</span>
                </div>
                <div className='flex items-center space-x-2'>
                    <ModeCommentRoundedIcon fontSize='small'/>
                    <span className='text-gray-500 hover:text-gray-800 hover:cursor-pointer'>50 Comment</span>
                </div>
            </div>
        </div>
    </div>
  )
}

export default UserPost