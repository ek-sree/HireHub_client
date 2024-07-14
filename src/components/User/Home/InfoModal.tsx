import { FC, useEffect, useState } from "react";
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import LocalPhoneRoundedIcon from '@mui/icons-material/LocalPhoneRounded';
import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import { userAxios } from "../../../constraints/axios/userAxios";
import { userEndpoints } from "../../../constraints/endpoints/userEndpoints";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { toast } from "sonner";
import EditInfo from "./EditInfo";
import { useParams } from "react-router-dom";

interface InfoModalInterface {
  isOpen: boolean;
  onClose: () => void;
 
}

const InfoModal: FC<InfoModalInterface> = ({ isOpen, onClose }) => {

    const [Email, setEmail] = useState('');
    const [place,setPlace] = useState<string[]>([]);
    const [phone, setPhone] = useState('');
    const [Education, setEducation] = useState<string[]>([]);
    const [isOpenEditModal, setIsOpenEditModal] = useState<boolean>(false);
    const [sameUser, setSameUser] = useState<boolean>(true);

    const email = useSelector((store: RootState)=>store.UserAuth.userData?.email);
    const token = useSelector((store:RootState)=> store.UserAuth.token);
    const userId = useSelector((store:RootState)=>store.UserAuth.userData?._id);

    const {id} = useParams<{id:string}>();
console.log("howwwwww",id);

useEffect(() => {
  if (userId && id && userId.toString() === id || id=== undefined) {
      setSameUser(true);
  } else {
      setSameUser(false);
  }
}, [id, userId]);

    async function userInfo(){
        
     try {
        const response = await userAxios.get(`${userEndpoints.userInfo}?email=${email}`,{
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
        console.log("info api",response);
        
        if(response.data.success){
            setEmail(response.data.info.email);
            setPhone(response.data.info.phone);
            setEducation(response.data.info.education);
            setPlace(response.data.info.place);
            
        }
     } catch (error) {
        toast("Error occure, user info is unavailable");
     }
    }

    

    const handleEdit = () =>{
        setIsOpenEditModal(true);
    }

    const handleEditonClose = () =>{
        setIsOpenEditModal(false);
    }

    const handleSuccess=(data:{phone:string, education:string[], place:string[]})=>{
        setPhone(data.phone)
        setEducation(data.education)
        setPlace(data.place)
    }

    useEffect(()=>{
        userInfo();
    },[])

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-500 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-[400px]">
        <div className="flex justify-end">
          <button onClick={onClose}>&times;</button>
        </div>
        <h2 className="text-xl font-bold mb-4">User Information</h2>
        <div className="mb-4">
          <label className="flex items-center text-sm font-medium text-gray-700">Email:</label>
          <div className="flex items-center mt-1 space-x-2">
            <MailOutlineRoundedIcon fontSize="small" />
            <div className="p-2  rounded">{Email}</div>
          </div>
        </div>
        <div className="mb-4">
          <label className="flex items-center text-sm font-medium text-gray-700">Phone:</label>
          <div className="flex items-center mt-1 space-x-2">
            <LocalPhoneRoundedIcon fontSize="small" />
            <div className="p-2  rounded">{phone}</div>
          </div>
        </div>
        <div className="mb-4">
          <label className="flex items-center text-sm font-medium text-gray-700">Place:</label>
          <div className="flex items-center mt-1 space-x-2">
            <FmdGoodOutlinedIcon fontSize="small" />
            <div className="p-2  rounded">{place.length!== 0? place.join(', ') : "Not yet added"}</div>
          </div>
        </div>
        <div className="mb-4">
          <label className="flex items-center text-sm font-medium text-gray-700">Education:</label>
          <div className="flex items-center mt-1 space-x-2">
            <SchoolOutlinedIcon fontSize="small" />
            <div className="p-2  rounded">{Education.length!== 0 ? Education.join(', ') : "Not yet added"}</div>
          </div>
        </div>
        {sameUser&&(<div className="flex justify-end mt-6">
          <button onClick={handleEdit}  className="bg-blue-500 text-white px-4 py-2 rounded">
            Edit
          </button>
        </div>)}
      </div>
      {isOpenEditModal && (
        <EditInfo
        isOpen={isOpenEditModal}
        onClose={handleEditonClose}
        onSuccess={handleSuccess}
        placeValue={place}
        phoneValue={phone}
        educationValue={Education}
        />
      )}
    </div>
  );
};

export default InfoModal;
