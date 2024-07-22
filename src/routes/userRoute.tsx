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
import JobPostUserPage from "../pages/User/JobPostUserPage";
import CV from "../components/User/Home/CV";
import UserPost from "../components/User/Home/UserPost";
import UserSkills from "../components/User/Home/UserSkills";
import MessagePage from "../pages/User/MessagePage";

const UserRoute = () => {
  return (
    <Routes>
      <Route element={<PrivateRouter />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/sidenav" element={<SidebarNav/>}/>
        <Route path="/sidenavprofile" element={<SidebarProfile/>}/>
        <Route path="/postbar" element={<Postbar/>} />
        <Route path="/posts/:id" element={<Post/>} />
        <Route path="/friendSuggestion" element={<FriendSuggestion/>}/>
        <Route path="/userprofile/:id" element={<UserProfilePage/>}/>
        <Route path="/jobposts" element={<JobPostUserPage/>}/>
        <Route path="/userprofile/user-resume/:id" element={<CV/>}/>
        <Route path="/userprofile/user-post/:id" element={<UserPost/>}/>
        <Route path="/userprofile/user-skills/:id" element={<UserSkills/>}/>
        <Route path="/message/:id" element={<MessagePage/>}/>
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
