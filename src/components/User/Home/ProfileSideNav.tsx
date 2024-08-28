import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import { NavLink, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';

interface NavItemProps {
  to: string;
  icon: JSX.Element;
  label: string;
}

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

  const navItems = [
    { to: `/userprofile/user-skills/${sentId}`, icon: <HomeRoundedIcon className=''/>, label: 'Skills' },
    ...(sameUser ? [{ to: `/userprofile/user-resume/${sentId}`, icon: <GroupRoundedIcon />, label: 'CV' }] : []),
    { to: `/userprofile/user-post/${sentId}`, icon: <WorkRoundedIcon />, label: 'Posts' },
  ];

  const NavItem = ({ to, icon, label }: NavItemProps) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex mb-3 items-center space-x-3 justify-start md:ml-12 p-2 ${
          isActive
            ? 'text-white bg-cyan-300 rounded-lg'
            : 'text-slate-400 hover:text-cyan-300'
        }`
      }
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </NavLink>
  );

  return (
    <>
      <div className="hidden md:block fixed top-28 left-0 w-72 ml-10 rounded-lg shadow-2xl py-6 px-2 z-50 bg-white backdrop-filter backdrop-blur-3xl bg-opacity-20">
        {navItems.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </div>


      <div className="md:hidden fixed bottom-6 left-0 right-0 bg-white shadow-lg z-50">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </div>
      </div>
    </>
  );
};

export default ProfileSideNav;