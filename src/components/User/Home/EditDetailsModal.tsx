import { FC, FormEvent } from "react";
import { Toaster } from "sonner";

interface JobApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}



const EditDetailsModal: FC<JobApplyModalProps> = ({ isOpen, onClose,onSuccess }) => {


  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
 
    onSuccess()
    onClose()
  };






  if (!isOpen) return null;

  return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <Toaster position="top-center" expand={false} richColors />
      <div className="bg-white p-6 rounded shadow-lg w-[500px]">
        <div className="flex justify-end">
          <button onClick={onClose}>&times;</button>
        </div>
        <h2 className="text-xl font-bold mb-4">Edit </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 mt-8">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="text" className="w-full p-2 border border-gray-300 rounded mt-1"  required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input type="number" className="w-full p-2 border border-gray-300 rounded mt-1"  required />
          </div>
         
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
