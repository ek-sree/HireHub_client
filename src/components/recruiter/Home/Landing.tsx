import { useSelector } from 'react-redux';
import Navbar from './Navbar';
import { RootState } from '../../../redux/store/store';
import JobsList from './JobsList';

function Landing() {
  const isVerified = useSelector((state: RootState) => state.RecruiterAuth.recruiterData?.isVerified);

  return (
    <div>
      <Navbar />
      {!isVerified ? (
        <p>You are not verified..Wait for admin to verify</p>
      ) : (
        <>
          <JobsList/>
        </>
      )}
    </div>
  );
}

export default Landing;
