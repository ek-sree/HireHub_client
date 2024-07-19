import { ChangeEvent, FC, FormEvent, useState } from "react";
import { toast, Toaster } from "sonner";
import { userAxios } from "../../../constraints/axios/userAxios";
import { userEndpoints } from "../../../constraints/endpoints/userEndpoints";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";

interface JobApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: { name: string; profileTitle: string }) => void;
  titleValue: string;
  nameValue: string;
}



const EditDetailsModal: FC<JobApplyModalProps> = ({ isOpen, onClose, onSuccess, titleValue, nameValue }) => {

  const [title, setTitle] = useState(titleValue);
  const [name, setName] = useState(nameValue);
  const [error, setError] = useState('')
  const [TitleError, setTitleError] = useState('')
  const maxTitleLength = 70;


  const token = useSelector((store:RootState)=> store.UserAuth.token);
  const email = useSelector((store: RootState)=> store.UserAuth.userData?.email);

const data = {
  name,
  title
}

  const handleSubmit = async(e: FormEvent) => {
    e.preventDefault();
    setError('')
    try {
      if(!name){
        setError("name must be needed");
        return
      }
      console.log("gonna sent",data, email);
      const response = await userAxios.post(`${userEndpoints.editDetails}?email=${email}`, {data}, {
        headers:{
          Authorization: `Bearer ${token}`
        }
      })
      console.log("api response", response);
      if(response.data.success){
        onSuccess(response.data.details)
        onClose()
      }
      else{
        toast.error(response.data)
      }
    } catch (error) {
      toast.error("Cant edit details right now , Error occured!")
    }
  };

  const handleChange=(e: ChangeEvent<HTMLInputElement>)=>{
    if(e.target.value.length <= maxTitleLength){
      setTitle(e.target.value)
      setTitleError('');
    }else{
      setTitleError("Maximux limit excessed");
    }
  }


  if (!isOpen) return null;

  return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <Toaster position="top-center" expand={false} richColors />
      <div className="bg-white p-6 rounded shadow-lg sm:w-[500px]">
        <div className="flex justify-end">
          <button onClick={onClose}>&times;</button>
        </div>
        <h2 className="text-xl font-bold mb-4">Edit </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 mt-8">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" className="w-full p-2 border border-gray-300 rounded mt-1" value={name} onChange={(e)=>setName(e.target.value)} />
            {error && <div className="text-sm text-red-500 mb-4">{error}</div>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input type="text" className="w-full p-2 border border-gray-300 rounded mt-1" onChange={handleChange} value={title} placeholder= "empty"/>
          <div className="text-sm text-slate-400">{maxTitleLength - title.length}</div>
          </div>
          {TitleError &&(<div className="text-sm text-red-600">{TitleError}</div>)}
         
          <div className="flex justify-end mt-6">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDetailsModal;
