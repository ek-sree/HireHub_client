import { useParams } from "react-router-dom";
import FriendSuggestion from "../../components/User/Home/FriendSuggestion";
import Navbar from "../../components/User/Home/Navbar"
import Postbar from "../../components/User/Home/Postbar";
import ProfileSideNav from "../../components/User/Home/ProfileSideNav";
import SidebarNav from "../../components/User/Home/SidebarNav"
import UserPost from "../../components/User/Home/UserPost";
import UserProfile from "../../components/User/Home/UserProfilePhoto"
import UserSkills from "../../components/User/Home/UserSkills";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";

const UserProfilePage = () => {
  const [sameUser, setSameUser] = useState(true);

  const {id} = useParams<{id?:string}>();

  const userId = useSelector((store:RootState)=>store.UserAuth.userData?._id);

    useEffect(() => {
        if (userId && id && userId.toString() === id || id=== undefined) {
            setSameUser(true);
        } else {
            setSameUser(false);
        }
    }, [id, userId]);

  return (
    <>
      <Navbar />
      <div className="">
        <ProfileSideNav/>
        <SidebarNav />
        <UserProfile />
        {sameUser&&(<Postbar/>)}
        <UserSkills/>
        <UserPost/>
        <FriendSuggestion/>
      </div>
    </>
  );
};

export default UserProfilePage;
