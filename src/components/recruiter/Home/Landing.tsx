import Navbar from './Navbar'
// import { useSelector } from 'react-redux';
// import { RootState } from '../../../redux/store/store';

function Landing() {

//   const userData = useSelector((state: RootState)=>state.UserAuth.userData);

  return (
    <div>
        <Navbar/>
        <p>Hello recruiter</p>
    </div>
  )
}

export default Landing