import { useParams } from "react-router-dom";
import FriendSuggestion from "../../components/User/Home/FriendSuggestion";
import Navbar from "../../components/User/Home/Navbar"
import Postbar from "../../components/User/Home/Postbar";
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

  useEffect(()=>{
    if(userId !== id){
        setSameUser(false);
    }else{
        setSameUser(true);
    }

  },[userId, id,sameUser])

  return (
    <>
      <Navbar />
      <div className="">
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
