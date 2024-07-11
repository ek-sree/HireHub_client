import { ChangeEvent, FC, FormEvent, useState } from "react";
import { toast } from "sonner";
import { RootState } from "../../../redux/store/store";
import { useSelector } from "react-redux";
import { userAxios } from "../../../constraints/axios/userAxios";
import { userEndpoints } from "../../../constraints/endpoints/userEndpoints";

interface TitleModalProps {
  isOpen: boolean;
  onClose: () => void;
  titleData: (data: string)=> void;
}

const TitleModal: FC<TitleModalProps> = ({ isOpen, onClose, titleData }) => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const maxLength = 70;

  const token = useSelector((store: RootState) => store.UserAuth.token);
  const email = useSelector((store: RootState) => store.UserAuth.userData?.email);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); 
    console.log("gonna send", token, email);

    try {
      const response = await userAxios.post(`${userEndpoints.addTitle}?email=${email}`, { title }, {
        headers: {
          Authorization: `Bearer ${token}` 
        }
      });
      console.log("spi data", response);
      
      if (response.data.success) {
        titleData(response.data.result);
        onClose();
        return;
      }

      toast.error("Error occurred, can't add title right now!!");
    } catch (error) {
      console.error("Error during title submission", error);
      toast.error("An error occurred while adding the title.");
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= maxLength) {
      setTitle(e.target.value);
      setError('');
    } else {
      setError("Maximum length reached");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-[500px]">
        <div className="flex justify-end">
          <button onClick={onClose}>&times;</button>
        </div>
        <div className="justify-center flex">Add Title</div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 mt-8">
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input 
              type="text" 
              className="w-full p-2 border border-gray-300 rounded mt-1" 
              value={title} 
              onChange={handleChange} 
              placeholder="Enter here" 
            />
            <div className="text-sm text-slate-300">{maxLength - title.length}</div>
          </div>
          {error && (
            <div className="text-sm text-red-600">{error}</div>
          )}
          <button className="bg-cyan-300 py-1 px-2 rounded-md text-white" type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default TitleModal;
