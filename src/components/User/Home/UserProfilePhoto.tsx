import HireHub from '../../../assets/images/HireHub.png';
import User from '../../../assets/images/user.png';
import UserProfileDetails from './UserProfileDetails';

const UserProfile = () => {
  return (
    <div className='bg-white max-w-3xl mx-auto mt-10 px-6 py-8 rounded-lg shadow-md'>
      <div className="relative h-72 rounded-md overflow-hidden shadow-2xl">
        <img src={HireHub} alt="Cover photo" className="w-full h-full object-cover rounded-lg" />
      </div>
        <div className="absolute bg-slate-100 w-52 h-56 border-4  rounded-full border-slate-200 ml-64 -mt-20 shadow-xl">
          <img src={User} alt="user" className='w-48 h-40 mt-2'/>
        </div>
      <UserProfileDetails initialName={''} />
    </div>
  );
};

export default UserProfile;
