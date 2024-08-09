import { FC, FormEvent, useState } from "react";
import { userAxios } from "../../../constraints/axios/userAxios";
import { userEndpoints } from "../../../constraints/endpoints/userEndpoints";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";

interface EditInfoModalProps{
    isOpen: boolean;
    onClose: ()=>void;
    onSuccess:(data: { phone: string; education: string[], place:string[] })=>void;
    phoneValue:string;
    educationValue:string[];
    placeValue:string[];
}

const EditInfo: FC<EditInfoModalProps> = ({isOpen, onClose, onSuccess, phoneValue, educationValue, placeValue}) => {

    const [phone, setPhone] = useState(phoneValue);
    const [Place, setPlace] = useState<string[]>(placeValue);
    const [Education, setEducation] = useState<string[]>(educationValue);
    const [error, setError] = useState('');

    const email = useSelector((store:RootState)=>store.UserAuth.userData?.email);


    const data = {
        phone,
        Place,
        Education,
        email
    }
   
    

    const handleSubmit = async(e: FormEvent) =>{
        setError('')
        e.preventDefault();
        if (!/^\d{10}$/.test(phone)) {
            setError("Enter a valid phone number.");
            return;
          }
          console.log("getetttet",data);
          
          const response = await userAxios.post(userEndpoints.userInfoEdit, {data})
          console.log("response edit user info",response);
          
          if(response.data.success){
            onSuccess(response.data.data);
            onClose();
          }
    }

    const handleArrayInput = (input: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
        setter(input.split(',').map(item => item.trim()));
      };
    

    if(!isOpen)return null
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-500 bg-opacity-50">
        <div className="bg-white p-6 w-[556px]  rounded shadow-lg">
            <div className="flex justify-end">
                <button onClick={onClose}> &times; </button>
            </div>
            <h2 className="text-xl font-bold mb-4">Edit</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4 mt-8">
                    <label className="flex text-sm font-medium text-gray-700">Phone</label>
                    <input type="number" name="phone" id="" placeholder="Enter your number" value={phone} onChange={(e)=>setPhone(e.target.value)} className="w-full border border-gray-300 p-2 rounded mt-1"/>
                    {error&&<div className="text-sm text-red-500">{error}</div>}
                </div>
                <div className="mb-4">
                    <label className="flex text-sm font-medium text-gray-700">Place</label>
                    <input type="text" name="place" id="" placeholder="Your place" value={Place} onChange={(e)=> handleArrayInput(e.target.value, setPlace)} className="w-full border border-gray-300 p-2 rounded mt-1"/>
                </div>
                <div className="mb-4">
                    <label className="flex text-sm font-medium text-gray-700">Education</label>
                    <input type="text" name="education" id="" placeholder="Your education" value={Education} onChange={(e)=> handleArrayInput(e.target.value, setEducation)}  className="w-full border border-gray-300 p-2 rounded mt-1"/>
                </div>
                <div className="flex justify-center mt-6">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Submit
            </button>
          </div>
            </form>
        </div>
    </div>
  )
}

export default EditInfo