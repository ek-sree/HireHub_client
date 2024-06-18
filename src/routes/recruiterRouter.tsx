import { Route, Routes } from 'react-router-dom'
import HomePage from '../pages/recruiter/HomePage'
import PrivateRouter from '../utils/recruiter/PrivateRouter'
import PublicRouter from '../utils/recruiter/PublicRouter'
import LoginPage from '../pages/User/LoginPage'
import SignupPage from '../pages/User/SignupPage'


const RecruiterRouter = () => {
  return (
    <Routes>
        <Route element={<PrivateRouter/>}>
            <Route path='/home' element={<HomePage/>}/>
        </Route>
        <Route element={<PublicRouter/>}>
            <Route path='/' element={<LoginPage/>}/>
            <Route path='/signup' element={<SignupPage/>}/>
        </Route>
    </Routes>
  )
}

export default RecruiterRouter