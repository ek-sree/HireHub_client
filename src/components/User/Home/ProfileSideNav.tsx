import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import { NavLink, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';

const ProfileSideNav = () => {
  const [sameUser, setSameUser] = useState(true);

  const { id } = useParams<{ id?: string }>();
  const userId = useSelector((store: RootState) => store.UserAuth.userData?._id);

  useEffect(() => {
    if (userId !== id) {
      setSameUser(false);
    } else {
      setSameUser(true);
    }
  }, [userId, id, sameUser]);

  const sentId = sameUser ? userId : id;

  return (
    <div className="fixed top-28 left-0 w-72 ml-10 rounded-lg shadow-2xl py-6 px-2 z-50 bg-white backdrop-filter backdrop-blur-3xl bg-opacity-20">
      <NavLink
        to={`/userprofile/user-skills/${sentId}`}
        className={({ isActive }) =>
          isActive
            ? 'py-3 flex items-center gap-4 justify-start pl-2 text-white bg-cyan-300 rounded-lg'
            : 'py-3 flex items-center gap-4 font-semibold justify-start pl-2 text-slate-400 hover:font-semibold'
        }
      >
        <HomeRoundedIcon />
        <span>Skills</span>
      </NavLink>
      {sameUser && (
        <NavLink
          to={`/userprofile/user-resume/${sentId}`}
          className={({ isActive }) =>
            isActive
              ? 'py-3 flex items-center gap-4 font-semibold justify-start pl-2 text-white bg-cyan-300 rounded-lg'
              : 'py-3 flex items-center gap-4 font-semibold justify-start pl-2 text-slate-400 hover:font-normal'
          }
        >
          <GroupRoundedIcon />
          <span>C V</span>
        </NavLink>
      )}
      <NavLink
        to={`/userprofile/user-post/${sentId}`}
        className={({ isActive }) =>
          isActive
            ? 'py-3 flex items-center gap-4 font-semibold justify-start pl-2 text-white bg-cyan-300 rounded-lg'
            : 'py-3 flex items-center gap-4 font-semibold justify-start pl-2 text-slate-400 hover:font-normal'
        }
      >
        <WorkRoundedIcon />
        <span>Posts</span>
      </NavLink>
    </div>
  );
};

export default ProfileSideNav;
