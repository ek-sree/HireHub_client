import Navbar from './Navbar'
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';
import { Navigate } from 'react-router-dom';
import SidebarNav from './SidebarNav';
import SidebarProfile from './SidebarProfile';
import Postbar from './Postbar';
import Post from './Post';
import FriendSuggestion from './FriendSuggestion';

function Landing() {

  const userData = useSelector((state: RootState) => state.UserAuth.userData);
  const isAuthenticated = useSelector((state: RootState) => state.UserAuth.token);

  if (!isAuthenticated && userData?.status) {
    return <Navigate to='/'/>
  }

  return (
    <div className=''>
      <Navbar/>
        <Postbar/>
        <Post/>
        <FriendSuggestion/>
        <SidebarProfile />
        <SidebarNav />
    </div>
  )
}

export default Landing
