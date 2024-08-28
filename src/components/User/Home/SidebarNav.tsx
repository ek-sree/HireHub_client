import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import ChatRoundedIcon from '@mui/icons-material/ChatRounded';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';

const SidebarNav = () => {
  const userId = useSelector((store: RootState) => store.UserAuth.userData?._id);

  return (
    <div className="fixed md:top-96 md:left-0 md:w-72 md:h-60 bottom-0 left-0 right-0 md:ml-10 rounded-lg shadow-shadowAll md:py-6 md:px-2 z-50 bg-white backdrop-filter backdrop-blur-3xl bg-opacity-20 flex md:flex-col justify-around md:justify-start">
      <NavLink
        to="/home"
        className={({ isActive }) =>
          `md:py-3 md:px-2 flex flex-col md:flex-row items-center gap-1 md:gap-4 justify-center md:justify-start ${
            isActive
              ? 'text-cyan-300 md:bg-cyan-300 md:text-white md:rounded-lg'
              : 'text-slate-400 hover:text-cyan-300'
          }`
        }
      >
        <HomeRoundedIcon />
        <span className="text-xs md:text-base text-black">HOME</span>
      </NavLink>
      <NavLink
        to={`/userprofile/${userId}`}
        className={({ isActive }) =>
          `md:py-3 md:px-2 flex flex-col md:flex-row items-center gap-1 md:gap-4 justify-center md:justify-start ${
            isActive
              ? 'text-cyan-300 md:bg-cyan-300 md:text-white md:rounded-lg'
              : 'text-slate-400 hover:text-cyan-300'
          }`
        }
      >
        <GroupRoundedIcon />
        <span className="text-xs md:text-base text-black">Profile</span>
      </NavLink>
      <NavLink
        to="/jobposts"
        className={({ isActive }) =>
          `md:py-3 md:px-2 flex flex-col md:flex-row items-center gap-1 md:gap-4 justify-center md:justify-start ${
            isActive
              ? 'text-cyan-300 md:bg-cyan-300 md:text-white md:rounded-lg'
              : 'text-slate-400 hover:text-cyan-300'
          }`
        }
      >
        <WorkRoundedIcon />
        <span className="text-xs md:text-base text-black">Work</span>
      </NavLink>
      <NavLink
        to="/message"
        className={({ isActive }) =>
          `md:py-3 md:px-2 flex flex-col md:flex-row items-center gap-1 md:gap-4 justify-center md:justify-start ${
            isActive
              ? 'text-cyan-300 md:bg-cyan-300 md:text-white md:rounded-lg'
              : 'text-slate-400 hover:text-cyan-300'
          }`
        }
      >
        <ChatRoundedIcon />
        <span className="text-xs md:text-base text-black">Message</span>
      </NavLink>
    </div>
  );
};

export default SidebarNav;
