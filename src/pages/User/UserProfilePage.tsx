import FriendSuggestion from "../../components/User/Home/FriendSuggestion";
import Navbar from "../../components/User/Home/Navbar"
import Postbar from "../../components/User/Home/Postbar";
import ProfileSideNav from "../../components/User/Home/ProfileSideNav";
import SidebarNav from "../../components/User/Home/SidebarNav"
import UserPost from "../../components/User/Home/UserPost";
import UserProfile from "../../components/User/Home/UserProfilePhoto"
import UserSkills from "../../components/User/Home/UserSkills";

const UserProfilePage = () => {
  return (
    <>
      <Navbar />
      <div className="">
        <ProfileSideNav/>
        <SidebarNav />
        <UserProfile />
        <Postbar/>
        <UserSkills/>
        <UserPost/>
        <FriendSuggestion/>
      </div>
    </>
  );
};

export default UserProfilePage;
