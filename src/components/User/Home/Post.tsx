import user from '../../../assets/images/user.png';
import hirehub from '../../../assets/images/HireHub.png';
import ThumbUpRoundedIcon from '@mui/icons-material/ThumbUpRounded';
import ModeCommentRoundedIcon from '@mui/icons-material/ModeCommentRounded';

const Post = () => {
  return (
    <div className="max-w-2xl mx-auto mt-10">
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="flex items-center mb-4">
          <img src={user} alt="user" className="rounded-full w-11 h-11 border-4 border-gray-100" />
          <div className="ml-4">
            <div className="font-semibold">User Name</div>
            <div className="text-gray-500 text-sm">Time</div>
          </div>
        </div>
        <div className="mb-4">
          <p>Here you can add the post content, like a text or description.</p>
        </div>
        <div className="rounded-lg overflow-hidden">
          <img src={hirehub} alt="post content" className="w-full h-auto" />
        </div>
        <div className="flex justify-between mt-10 mb-4">
          <div className="flex items-center space-x-2">
            <ThumbUpRoundedIcon fontSize="small" />
            <span className="text-gray-500">100 Likes</span>
          </div>
          <div className="flex items-center space-x-2">
            <ModeCommentRoundedIcon fontSize="small" />
            <span className="text-gray-500">50 Comments</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-4 mt-10">
        <div className="flex items-center mb-4">
          <img src={user} alt="user" className="rounded-full w-11 h-11 border-4 border-gray-100" />
          <div className="ml-4">
            <div className="font-semibold">User Name</div>
            <div className="text-gray-500 text-sm">Location or Time</div>
          </div>
        </div>
        <div className="mb-4">
          <p>Here you can add the post content, like a text or description.</p>
        </div>
        <div className="rounded-lg overflow-hidden">
          <img src={hirehub} alt="post content" className="w-full h-auto" />
        </div>
        <div className="flex justify-between mt-4">
          <div className="flex items-center space-x-2">
            <ThumbUpRoundedIcon fontSize="small" />
            <span className="text-gray-500 hover:text-gray-800 hover:cursor-pointer">120 Likes</span>
          </div>
          <div className="flex items-center space-x-2">
            <ModeCommentRoundedIcon fontSize="small" />
            <span className="text-gray-500 hover:text-gray-800 hover:cursor-pointer">60 Comments</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
