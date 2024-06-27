import { Route, Routes } from "react-router-dom";
import LoginPage from "../pages/User/LoginPage";
import SignupPage from "../pages/User/SignupPage";
import HomePage from "../pages/User/HomePage";
import OtpPage from "../pages/User/OtpPage";
import PrivateRouter from "../utils/user/PrivateRouter";
import PublicRouter from "../utils/user/PublicRouter";
import SidebarNav from "../components/User/Home/SidebarNav";
import SidebarProfile from "../components/User/Home/SidebarProfile";
import Postbar from "../components/User/Home/Postbar";
import Post from "../components/User/Home/Post";
import FriendSuggestion from "../components/User/Home/FriendSuggestion";
import UserProfilePage from "../pages/User/UserProfilePage";

const UserRoute = () => {
  return (
    <Routes>
      <Route element={<PrivateRouter />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/sidenav" element={<SidebarNav/>}/>
        <Route path="/sidenavprofile" element={<SidebarProfile/>}/>
        <Route path="/postbar" element={<Postbar/>} />
        <Route path="/posts" element={<Post/>} />
        <Route path="/friendSuggestion" element={<FriendSuggestion/>}/>
        <Route path="/userprofile" element={<UserProfilePage/>}/>
      </Route>
      <Route element={<PublicRouter />}>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/otp" element={<OtpPage />} />
      </Route>
    </Routes>
  );
};

export default UserRoute;
