
import { FC, useEffect, useState } from "react";
import hireHub from '../../../assets/images/HireHub.png'
import AddPhotoAlternateRoundedIcon from '@mui/icons-material/AddPhotoAlternateRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { userAxios } from "../../../constraints/axios/userAxios";
import { userEndpoints } from "../../../constraints/endpoints/userEndpoints";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { toast, Toaster } from "sonner";

interface coverPhotoModalProps{
    isOpen:boolean;
    onClose:()=>void;
    onSuccess:(coverImgUrl:string)=>void;
    imgUrl:string
}

const CoverPhotoModal: FC<coverPhotoModalProps> = ({isOpen, onClose, onSuccess, imgUrl}) => {

    const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState(imgUrl || hireHub);

  const email = useSelector((store:RootState)=>store.UserAuth.userData?.email);


  const handleImageChange=(e: React.ChangeEvent<HTMLInputElement>)=>{
    if(e.target.files){
        setImage(e.target.files[0]);
    }
  }

  const handleUploadImage=async()=>{
    if(!image){
        toast.error("Select one image")
        return;
    }
    const formdata = new FormData();
    formdata.append("image",image);
    const response = await userAxios.post(`${userEndpoints.addCoverPhoto}?email=${email}`,formdata, {
        headers:{
            "Content-Type":"multipart/form-data"
        }
    })
    if(response.data.success){
        onSuccess(response.data.data.imageUrl);
        onClose()
    }
  }

  useEffect(() => {
    if (image) {
      const url = URL.createObjectURL(image);
      setImageUrl(url);
    } else {
      setImageUrl(imgUrl || hireHub);
    }
  }, [image, imgUrl]);

  if(!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-500 bg-opacity-50 z-50">
         <Toaster position="top-center" expand={false} richColors />
    <div className="bg-slate-50 p-6 rounded-lg shadow-lg w-[540px]">
      <div className="flex justify-end mb-4">
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">&times;</button>
      </div>
      <div className="flex justify-center mb-5 underline font-semibold">{!image ? "Add Profile" : "Edit Profile"}</div>
      <div className="flex flex-col items-center">
        <img src={imageUrl} alt="user profile" className="w-full h-72 mb-4 border-2" />
        <div className="flex space-x-4 bg-slate-300 hover:bg-slate-400 hover:scale-110 transition-transform duration-500 ease-in-out rounded-full py-1 px-1">
          <label title={!image ? "Add Profile" : "Edit Profile"} className="cursor-pointer">
            {!image ? (
              <AddPhotoAlternateRoundedIcon />
            ) : (
              <EditRoundedIcon />
            )}
            <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
          </label>
        </div>
        <div>
          {/* <button className="mt-4 text-black px-2 py- rounded-full font-medium border-2 border-slate-500 bg-slate-300 hover:bg-slate-400-600 mr-3">
            Delete
          </button> */}
          <button onClick={handleUploadImage} className="mt-4 bg-cyan-300 px-2 py-1 rounded-full font-medium text-white hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-transform transform hover:scale-105 active:scale-95 duration-300 ease-in-out">
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
  )
}

export default CoverPhotoModal