import { Link, useParams } from 'react-router-dom';
import HireHub from '../../../assets/images/HireHub.png';
import user from '../../../assets/images/user.png';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { RootState } from '../../../redux/store/store';
import { userAxios } from '../../../constraints/axios/userAxios';
import { userEndpoints } from '../../../constraints/endpoints/userEndpoints';
import { toast } from 'sonner';

const SidebarProfile = () => {
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [profileImg, setProfileImg] = useState<string>(user);
  const [coverImg, setCoverImg] = useState<string>(HireHub);
  const [sameUser, setSameUser] = useState<boolean>(true);

  const token = useSelector((store: RootState) => store.UserAuth.token);
  const userId = useSelector((store:RootState)=>store.UserAuth.userData?._id);

  const {id} = useParams<{id?:string}>();
  
  useEffect(() => {
        
    if (userId !== id) {
        setSameUser(false);
    } else {
        setSameUser(true);
    }
    showCoverImg();
        showImage();
}, [id, userId]);

  
const sentId = sameUser ? userId : id
    async function userDetails() {
      try {
        const response = await userAxios.get(`${userEndpoints.viewDetails}?userId=${sentId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.success) {
          setName(response.data.details.name);
          setTitle(response.data.details.title);
        }
        if (response.status === 403) {
          toast.error("Token expired login again");
        }
      } catch (error) {
        toast.error("Error occurred, please log in after some time.");
      }
    }


    async function showImage() {
      try {
          const response = await userAxios.get(`${userEndpoints.getProfileImages}?userId=${sentId}`, {
              headers: {
                  Authorization: `Bearer ${token}`
              }
          });

          if (response.data.success && response.data.data && response.data.data.imageUrl) {
              setProfileImg(response.data.data.imageUrl);
          } else {
              setProfileImg(user); 
          }
      } catch (error) {
          console.error("Error fetching profile image:", error);
          setProfileImg(user);
      }
  }

  async function showCoverImg(){
    try {
      console.log("Sending userId:", sentId);
      
        const response = await userAxios.get(`${userEndpoints.getCoverImage}?userId=${sentId}`,{
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
        if(response.data.success){
            setCoverImg(response.data.data.imageUrl);
        } 
    } catch (error) {
        console.error("Error fetching cover image:", error);
        setCoverImg(HireHub)
    }
}

  useEffect(()=>{
    showImage();
    userDetails();
    showCoverImg();
  },[token])

  return (
    <div className="fixed top-24 left-0 w-64 sm:w-72 h-52 ml-4 sm:ml-10 rounded-lg border-4 shadow-2xl z-50 mt-4">
      <div className="bg-white rounded-md relative shadow-xl hover:shadow-2xl">
        <img src={coverImg} alt="Cover photo" className="w-full h-16 object-cover rounded-lg hover:border-2" />
        <div className="rounded-full bg-slate-300 w-12 h-12 sm:w-16 sm:h-16 absolute left-1/2 transform -translate-x-1/2 -bottom-6 sm:-bottom-8 border-4 border-white shadow-xl flex items-center justify-center overflow-hidden hover:shadow-2xl hover:border-2">
          <img src={profileImg} alt="profile photo" className="w-full h-full object-cover rounded-full" />
        </div>
      </div>
      <div className="absolute bottom-[40px] sm:bottom-[50px] left-1/2 transform -translate-x-1/2 text-center w-full">
        <div className="text-sm sm:text-base font-semibold">{name}</div>
        <div className="text-xs sm:text-sm text-gray-600">{title}</div>
      </div>
      <div className="absolute mt-16 sm:mt-20 bottom-0 left-1/2 transform -translate-x-1/2 w-full px-4">
        <Link to='/userprofile/:id'>
          <button className="w-full text-slate-400 rounded-md text-xs sm:text-sm font-semibold shadow-lg border-2 border-slate-500 hover:bg-slate-200 hover:font-bold">View Profile</button>
        </Link>
      </div>
    </div>
  );
};

export default SidebarProfile;
