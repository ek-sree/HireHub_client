import { Avatar } from '@mui/material';
import HireHubLogo from '../../../assets/images/HireHub.png';
import notificationLogo from '../../../assets/images/notificationLogo.jpg';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../../redux/slice/RecruiterSlice';
import { recruiterAxios } from '../../../constraints/axios/recruiterAxios';
import { recruiterEndpoints } from '../../../constraints/endpoints/recruiterEndpoints';
import { toast } from 'sonner';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import MessageRoundedIcon from '@mui/icons-material/MessageRounded';

function Navbar() {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    const response = await recruiterAxios.post(recruiterEndpoints.logout);
    if(response.data.success) {
      dispatch(logout());
      navigate('/');
    } else {
      toast("Something happened, please try again later");
    }
  };

  return (
    <div className='shadow-lg flex items-center h-20 px-5'>
      <div className='w-20'>
        <img
          src={HireHubLogo}
          alt="HireHub-Logo"
          className="max-w-full h-12 rounded-3xl w-16 md:w-auto"
        />
      </div>
      <div className='flex items-center flex-grow justify-center'>
        <input
          type="text"
          className='border bg-slate-100 border-slate-400 rounded-lg py-1 px-16'
          placeholder="Search"
        />
        <NavLink
          to='/recruiter/home'
          className={({ isActive }) =>
            isActive ? 'ml-28 font-medium underline cursor-pointer flex' : 'ml-28 font-medium hover:underline cursor-pointer flex'
          }
        >
          <HomeRoundedIcon />
          Home
        </NavLink>
        <NavLink
          to='/recruiter/allCandidates'
          className={({ isActive }) =>
            isActive ? 'ml-28 font-medium underline cursor-pointer' : 'ml-28 font-medium hover:underline cursor-pointer flex'
          }
        >
          <MessageRoundedIcon />
          Candidates
        </NavLink>
      </div>
      <div className='mr-9 cursor-pointer' onClick={handleLogout}>Logout</div>
      <div className='flex items-center'>
        <img
          src={notificationLogo}
          alt="notification-logo"
          className="max-w-full h-auto rounded-3xl w-8 mr-8"
        />
        <Avatar src="/broken-image.jpg" className='mr-5'/>
      </div>
    </div>
  );
}

export default Navbar;
