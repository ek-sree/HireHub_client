import { useSelector } from 'react-redux';
import Navbar from './Navbar';
import { RootState } from '../../../redux/store/store';

function Landing() {
  const isVerified = useSelector((state: RootState) => state.RecruiterAuth.recruiterData?.isVerified);

  return (
    <div>
      <Navbar />
      {!isVerified ? (
        <p>You are not verified..Wait for admin to verify</p>
      ) : (
        <>
          
          <p className='text-black'>Hello recruiter</p>
        </>
      )}
    </div>
  );
}

export default Landing;
