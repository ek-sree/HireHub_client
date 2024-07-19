import GroupAddRoundedIcon from '@mui/icons-material/GroupAddRounded';

const FriendSuggestion = () => {
  return (
    <div className="hidden sm:block fixed top-32 right-10 w-60 h-auto rounded-lg shadow-2xl py-6 px-2 z-50 bg-white">
      <div className="text-center font-semibold mb-4">Friend Suggestions</div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <img src="https://via.placeholder.com/48" alt="Friend 1" className="w-12 h-12 rounded-full mr-3" />
          <span className="font-semibold">John Doe</span>
        </div>
        <GroupAddRoundedIcon fontSize='small' className='shadow-sm hover:scale-110 hover:bg-gray-200 rounded-md transition-transform duration-200 ease-in-out'/>
      </div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <img src="https://via.placeholder.com/48" alt="Friend 2" className="w-12 h-12 rounded-full mr-3" />
          <span className="font-semibold">Jane Smith</span>
        </div>
        <GroupAddRoundedIcon fontSize='small' className='shadow-sm hover:scale-110 hover:bg-gray-200 rounded-md transition-transform duration-200 ease-in-out'/>
      </div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <img src="https://via.placeholder.com/48" alt="Friend 3" className="w-12 h-12 rounded-full mr-3" />
          <span className="font-semibold">Alice Johnson</span>
        </div>
        <GroupAddRoundedIcon fontSize='small' className='shadow-sm hover:scale-110 hover:bg-gray-200 rounded-md transition-transform duration-200 ease-in-out'/>
      </div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <img src="https://via.placeholder.com/48" alt="Friend 3" className="w-12 h-12 rounded-full mr-3" />
          <span className="font-semibold">Alice Johnson</span>
        </div>
        <GroupAddRoundedIcon fontSize='small' className='shadow-sm hover:scale-110 hover:bg-gray-200 rounded-md transition-transform duration-200 ease-in-out'/>
      </div>
      <div className='flex justify-center text-slate-500 hover:text-cyan-500 hover:cursor-pointer'>
        see more...
      </div>
    </div>
  );
};

export default FriendSuggestion;
