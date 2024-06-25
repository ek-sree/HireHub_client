import Navbar from './Navbar'
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';
import { Navigate } from 'react-router-dom';

function Landing() {

  const userData = useSelector((state: RootState)=>state.UserAuth.userData);
  const isAuthenticated = useSelector((state: RootState)=>state.UserAuth.token);
console.log("is authenticated",isAuthenticated);
console.log("is dssts",userData?.status);

if(!isAuthenticated && userData?.status){
  return <Navigate to='/'/>
}

  return (
    <div>
        <Navbar/>
        <p>{userData?.name}</p>
    </div>
  )
}

export default Landing