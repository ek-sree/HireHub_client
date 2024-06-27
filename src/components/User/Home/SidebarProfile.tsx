import { Link } from 'react-router-dom';
import HireHub from '../../../assets/images/HireHub.png';
import user from '../../../assets/images/user.png';

const SidebarProfile = () => {
  return (
    <div className="fixed top-24 left-0 w-44 h-64 ml-10 rounded-lg border-4 shadow-2xl z-50 mt-4">
      <div className="bg-white h-28 rounded-md relative shadow-xl hover:shadow-2xl">
        <img src={HireHub} alt="Cover photo" className="w-full h-full object-cover rounded-lg hover:border-2" />
        <div className="rounded-full bg-slate-300 w-16 h-16 absolute left-1/2 transform -translate-x-1/2 -bottom-8 border-4 border-white shadow-xl flex items-center justify-center overflow-hidden hover:shadow-2xl hover:border-2">
          <img src={user} alt="profile photo" className="w-full h-full object-cover rounded-full" />
        </div>
      </div>
      <div className="absolute bottom-[73px] left-1/2 transform -translate-x-1/2 text-center text-sm font-semibold">
        Sreehari E K
      </div>
      <div className="absolute bottom-[54px] left-1/2 transform -translate-x-1/2 text-center text-xs text-gray-600">
        sreeharisree105@gmail.com
      </div>
      <div className="absolute mt-24 left-1/2 transform -translate-x-1/2 w-full">
      <Link to='/userprofile'>
        <button className="w-full bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-400 hover:font-medium">View Profile</button>
      </Link>
      </div>
    </div>
  );
};

export default SidebarProfile;
