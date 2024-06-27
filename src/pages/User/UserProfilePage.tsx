import Navbar from "../../components/User/Home/Navbar"
import Postbar from "../../components/User/Home/Postbar";
import SidebarNav from "../../components/User/Home/SidebarNav"
import UserPost from "../../components/User/Home/UserPost";
import UserProfile from "../../components/User/Home/UserProfilePhoto"
import UserSkills from "../../components/User/Home/UserSkills";

const UserProfilePage = () => {
  return (
    <>
      <Navbar />
      <div className="bg-slate-100">
        <SidebarNav />
        <UserProfile />
        <Postbar/>
        <UserSkills/>
        <UserPost/>
      </div>
    </>
  );
};

export default UserProfilePage;
