import { Route, Routes } from "react-router-dom"
import LoginPage from "../pages/User/LoginPage"
import SignupPage from "../pages/User/SignupPage"
import HomePage from "../pages/User/HomePage"
import OtpPage from "../pages/User/OtpPage"


const UserRoute = () => {
  return (
    <div>
        <Routes>
            <Route path="/" element={<LoginPage/>}/>
            <Route path="/signup" element={<SignupPage/>}/>
            <Route path="/home" element={<HomePage/>}/>
            <Route path="/otp" element={<OtpPage/>}/>
        </Routes>
    </div>
  )
}

export default UserRoute