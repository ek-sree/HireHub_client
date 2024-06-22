import { Route, Routes } from 'react-router-dom'
import HomePage from '../pages/recruiter/HomePage'
import PrivateRouter from '../utils/recruiter/PrivateRouter'
import LoginPage from '../pages/User/LoginPage'
import SignupPage from '../pages/User/SignupPage'
import PublicRouter from '../utils/user/PublicRouter'
import OtpPage from '../pages/User/OtpPage'


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
        </Route>
    </Routes>
  )
}

export default RecruiterRouter