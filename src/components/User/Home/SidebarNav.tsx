import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import DriveFileRenameOutlineRoundedIcon from '@mui/icons-material/DriveFileRenameOutlineRounded';
import ChatRoundedIcon from '@mui/icons-material/ChatRounded';
import { NavLink } from 'react-router-dom';

const SidebarNav = () => {
  return (
    <div className="fixed top-96 left-0 w-44 h- ml-10 rounded-lg shadow-2xl py-6 px-2 z-50 bg-white backdrop-filter backdrop-blur-3xl bg-opacity-20">
      <NavLink
        to="/home"
        className={({ isActive }) =>
          isActive
            ? 'py-3 flex items-center gap-4 justify-start pl-2 text-white bg-cyan-300 rounded-lg'
            : 'py-3 flex items-center gap-4 font-semibold justify-start pl-2 text-slate-400 hover:font-semibold'
        }
      >
        <HomeRoundedIcon />
        <span>HOME</span>
      </NavLink>
      <NavLink
        to="/userprofile"
        className={({ isActive }) =>
          isActive
            ? 'py-3 flex items-center gap-4 font-semibold justify-start pl-2 text-white bg-cyan-300 rounded-lg'
            : 'py-3 flex items-center gap-4 font-semibold justify-start pl-2 text-slate-400 hover:font-normal'
        }
      >
        <GroupRoundedIcon />
        <span>Profile</span>
      </NavLink>
      <NavLink
        to="/work"
        className={({ isActive }) =>
          isActive
            ? 'py-3 flex items-center gap-4 font-semibold justify-start pl-2 text-white bg-cyan-300 rounded-lg'
            : 'py-3 flex items-center gap-4 font-semibold justify-start pl-2 text-slate-400 hover:font-normal'
        }
      >
        <WorkRoundedIcon />
        <span>Work</span>
      </NavLink>
      <NavLink
        to="/new-post"
        className={({ isActive }) =>
          isActive
            ? 'py-3 flex items-center gap-4 font-semibold justify-start pl-2 text-white bg-cyan-300 rounded-lg'
            : 'py-3 flex items-center gap-4 font-semibold justify-start pl-2 text-slate-400 hover:font-normal'
        }
      >
        <DriveFileRenameOutlineRoundedIcon />
        <span>New post</span>
      </NavLink>
      <NavLink
        to="/message"
        className={({ isActive }) =>
          isActive
            ? 'py-3 flex items-center gap-4 font-semibold justify-start pl-2 text-white bg-cyan-300 rounded-lg'
            : 'py-3 flex items-center gap-4 font-semibold justify-start pl-2 text-slate-400 hover:font-normal'
        }
      >
        <ChatRoundedIcon />
        <span>Message</span>
      </NavLink>
    </div>
  );
};

export default SidebarNav;
