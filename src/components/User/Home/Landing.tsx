import Navbar from './Navbar'
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';

function Landing() {

  const userData = useSelector((state: RootState)=>state.UserAuth.userData);
  const isAuthenticated = useSelector((state: RootState)=>state.UserAuth.isAuthenticated);
console.log("is authenticated",isAuthenticated);


  return (
    <div>
        <Navbar/>
        <p>{userData?.name}</p>
    </div>
  )
}

export default Landing