import Navbar from './Navbar'
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';
import { Navigate } from 'react-router-dom';
import SidebarNav from './SidebarNav';

function Landing() {

  const userData = useSelector((state: RootState)=>state.UserAuth.userData);
  const isAuthenticated = useSelector((state: RootState)=>state.UserAuth.token);
console.log("is authenticated",isAuthenticated);
console.log("is dssts",userData?.status);

if(!isAuthenticated && userData?.status){
  return <Navigate to='/'/>
}

  return (
    <div className='bg-slate-100'>
        <Navbar/>
        {/* <p>{userData?.name}</p> */}
        <SidebarNav/>
    </div>
  )
}

export default Landing