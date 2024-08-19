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

interface InfoModalInterface {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

const UserInfo: FC<InfoModalInterface> = ({ isOpen, onClose, userId }) => {
  const [email, setEmail] = useState('');
  const [place, setPlace] = useState<string[]>([]);
  const [phone, setPhone] = useState('');
  const [education, setEducation] = useState<string[]>([]);
  const token = useSelector((store: RootState) => store.RecruiterAuth.token);

  async function fetchUserInfo() {
    try {        
      const response = await userAxios.get(`${userEndpoints.userInfo}?userId=${userId}`);      
      if (response.data.success) {
        setEmail(response.data.info.email);
        setPhone(response.data.info.phone);
        setEducation(response.data.info.education);
        setPlace(response.data.info.place);
      } else {
        toast.error("Failed to fetch user info");
      }
    } catch (error) {
      toast.error("Error fetching user info");
    }
  }

  useEffect(() => {
    if (isOpen && userId) {
      fetchUserInfo();
    }
  }, [isOpen, userId, token]);

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
            <div className="p-2 rounded">{email}</div>
          </div>
        </div>
        <div className="mb-4">
          <label className="flex items-center text-sm font-medium text-gray-700">Phone:</label>
          <div className="flex items-center mt-1 space-x-2">
            <LocalPhoneRoundedIcon fontSize="small" />
            <div className="p-2 rounded">{phone}</div>
          </div>
        </div>
        <div className="mb-4">
          <label className="flex items-center text-sm font-medium text-gray-700">Place:</label>
          <div className="flex items-center mt-1 space-x-2">
            <FmdGoodOutlinedIcon fontSize="small" />
            <div className="p-2 rounded">{place.length !== 0 ? place.join(', ') : "Not yet added"}</div>
          </div>
        </div>
        <div className="mb-4">
          <label className="flex items-center text-sm font-medium text-gray-700">Education:</label>
          <div className="flex items-center mt-1 space-x-2">
            <SchoolOutlinedIcon fontSize="small" />
            <div className="p-2 rounded">{education.length !== 0 ? education.join(', ') : "Not yet added"}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
