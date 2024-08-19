import { Route, Routes } from 'react-router-dom'
import HomePage from '../pages/recruiter/HomePage'
import PrivateRouter from '../utils/recruiter/PrivateRouter'
import LoginPage from '../pages/User/LoginPage'
import SignupPage from '../pages/User/SignupPage'
import PublicRouter from '../utils/user/PublicRouter'
import OtpPage from '../pages/User/OtpPage'
import ViewApplications from '../components/recruiter/Home/ViewApplications'
import ShortListedCandidatesPages from '../pages/recruiter/ShortListedCandidatesPages'
import ShortListedOnJobPage from '../pages/recruiter/ShortListedOnJobPage'
import UserProfilePage from '../pages/recruiter/UserProfilePage'
// import MessageRecruiter from '../pages/recruiter/MessageRecruiter'
import AwaitedCandidatesPage from '../pages/recruiter/AwaitedCandidatesPage'


const RecruiterRouter = () => {
  return (
    <Routes>
        <Route element={<PublicRouter/>}>
            <Route path='/' element={<LoginPage/>}/>
            <Route path='/otp' element={<OtpPage/>}/>
            <Route path='/signup' element={<SignupPage/>}/>
        </Route>
        <Route element={<PrivateRouter/>}>
            <Route path='/home' element={<HomePage/>}/>
            <Route path='/viewapplication/:jobId' element={<ViewApplications/>}/>
            <Route path='/shortlistedOnJob/:jobId' element={<ShortListedOnJobPage/>}/>
            <Route path='/allCandidates' element={<ShortListedCandidatesPages/>}/>
            <Route path='/userprofile/:id' element={<UserProfilePage/>}/>
            {/* <Route path='/message' element={<MessageRecruiter/>}/> */}
            <Route path='/awaitedCandidate/:jobId' element={<AwaitedCandidatesPage/>}/>
        </Route>
    </Routes>
  )
}

export default RecruiterRouter