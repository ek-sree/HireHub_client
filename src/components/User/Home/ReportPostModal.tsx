import { ChangeEvent, FC, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import { postAxios } from "../../../constraints/axios/postAxios";
import { postEndpoints } from "../../../constraints/endpoints/postEndpoints";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { toast, Toaster } from "sonner";

interface ReportPostProps {
  isOpen: boolean;
  onClose:()=>void;
  postId: string;
}

const ReportPostModal: FC<ReportPostProps> = ({ isOpen, onClose, postId }) => {
  const [selectedReason, setSelectedReason] = useState("");
  const hardcodedReasons = ["Inappropriate image", "Inappropriate content", "Sexual content"];

  const UserId = useSelector((store:RootState)=>store.UserAuth.userData?._id);
  
  const handleReasonChange = (event: ChangeEvent<HTMLSelectElement>) => {
      setSelectedReason(event.target.value);
    };

    const handleSend= async()=>{
        if (!selectedReason) {
            toast.error("Please select a reason before sending.");
            return;
          }
          console.log("rason:-" ,selectedReason);
          
        const respones = await postAxios.post(`${postEndpoints.reportPost}?UserId=${UserId}&postId=${postId}`, { reason: selectedReason })
        if(respones.data.success){
            toast.success("reported successfully")
            setSelectedReason("");
            onClose();
        }
    }
    
    if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                    <Toaster position="top-center" expand={false} richColors />
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full transform transition-all duration-300 ease-in-out">
        <div className="flex justify-between items-center">
          <p className="flex-grow text-center font-medium underline">Report Post</p>
          <CloseIcon onClick={onClose} fontSize="small" className="cursor-pointer" />
        </div>
        <div className="mt-7">
          <select
            className="w-full p-2 border rounded"
            value={selectedReason}
            onChange={handleReasonChange}
          >
            {!selectedReason && <option value="">Choose a reason</option>}
            {hardcodedReasons.map((reason, index) => (
              <option key={index} value={reason}>
                {reason}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end mt-4">
        <button
          onClick={handleSend}  
            className="bg-cyan-300 text-white py-2 px-4 rounded-lg hover:bg-cyan-400 transition-colors duration-200"
          >
            Send</button>
        </div>
      </div>
    </div>
  );
};

export default ReportPostModal;
