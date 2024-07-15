import { Avatar } from '@mui/material';
import { useEffect, useState } from 'react';
import HireHubLogo from '../../../assets/images/HireHub.png';
import notificationLogo from '../../../assets/images/notificationLogo.jpg';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../redux/slice/UserSlice';
import { userAxios } from '../../../constraints/axios/userAxios';
import { userEndpoints } from '../../../constraints/endpoints/userEndpoints';
import { toast } from 'sonner';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import { RootState } from '../../../redux/store/store';

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSticky, setIsSticky] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [profileImg, setProfileImg] = useState('');

  const token = useSelector((store:RootState)=>store.UserAuth.token);
  const userId = useSelector((store:RootState)=>store.UserAuth.userData?._id);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsSticky(true);
      } else {
        setTimeout(()=>{

          setIsSticky(false);
        },1000)
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

  async function fetchProfileImg(){
    try {
      const response = await userAxios.get(`${userEndpoints.getProfileImages}?userId=${userId}`, {
          headers: {
              Authorization: `Bearer ${token}`
          }
      });

      if (response.data.success && response.data.data && response.data.data.imageUrl) {
          setProfileImg(response.data.data.imageUrl);
      } else {
        setProfileImg("/broken-image.jpg"); 
            }
  } catch (error) {
      console.error("Error fetching profile image:", error);
      setProfileImg("/broken-image.jpg"); 
      }
  }
  useEffect(()=>{
    fetchProfileImg();
  },[ token,profileImg])

  const handleMouseEnter = () => {
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    setTimeout(()=>{

      setShowDropdown(false);
    },1000)
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
      <div
        className='flex items-center relative'
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
<Avatar src={profileImg || "/broken-image.jpg"} className='mr-5 cursor-pointer' />
{showDropdown && (
          <div className='absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10'>
            <div className='p-2 cursor-pointer hover:bg-gray-100' onClick={handleLogout}>Logout</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;