import { Avatar } from '@mui/material';
import { useEffect, useState } from 'react';
import HireHubLogo from '../../../assets/images/HireHub.png';
import notificationLogo from '../../../assets/images/notificationLogo.jpg';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../../redux/slice/UserSlice';
import { userAxios } from '../../../constraints/axios/userAxios';
import { userEndpoints } from '../../../constraints/endpoints/userEndpoints';
import { toast } from 'sonner';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const response = await userAxios.post(userEndpoints.logout);
      console.log("response for logout", response);
      if (response.data.success) {
        dispatch(logout());
        navigate('/');
      } else {
        toast.error("Error occurred. Please try again!!");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Error occurred. Please try again!!");
    }
  };

  return (
    <div className={`shadow-lg flex items-center h-20 px-5 ${isSticky ? 'sticky top-0 bg-white z-50' : ''}`}>
      <div className='w-20'>
        <img
          src={HireHubLogo}
          alt="HireHub-Logo"
          className="max-w-full h-12 rounded-3xl w-16 md:w-auto"
        />
      </div>
      <div className='relative flex items-center flex-grow justify-center'>
        <SearchTwoToneIcon className="absolute right-[500px] text-gray-500" />
        <input
          type="text"
          className='border bg-slate-100 border-slate-400 rounded-lg py-1 pl-10 pr-16 focus:outline-none'
          placeholder="Search"
        />
        <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
          <img src={notificationLogo} alt="notification-logo" className="max-w-full h-auto rounded-3xl w-8" />
        </div>
      </div>
      <div className='mr-9 cursor-pointer' onClick={handleLogout}>Logout</div>
      <div className='flex items-center'>
        <Avatar src="/broken-image.jpg" className='mr-5' />
      </div>
    </div>
  );
}

export default Navbar;
