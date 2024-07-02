import { FC, FormEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Toaster, toast } from "sonner";
import { RootState } from "../../../redux/store/store";

interface JobApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Resume {
  id: number;
  file: File | null;
}

const JobApplyModal: FC<JobApplyModalProps> = ({ isOpen, onClose,onSuccess }) => {
  const [resumes, setResumes] = useState<Resume[]>([{ id: 1, file: null }]);
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(1);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const reduxEmail = useSelector((store: RootState)=> store.UserAuth.userData?.email) || '';
  const reduxPhone = useSelector((store: RootState)=> store.UserAuth.userData?.phone) || '';

  useEffect(()=>{
    setEmail(reduxEmail);
    setPhone(reduxPhone);
  },[isOpen])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if(resumes.every((resume)=>resume.file===null)){
        toast.error("Please select at least one resume file.")
        return
    }
    if(selectedResumeId === null){
        toast.error("Please select a resume to submit.")
        return;
    }
    onSuccess()
    onClose()
  };

  const handleAddResume = () => {
    setResumes([...resumes, { id: resumes.length + 1, file: null }]);
  };

  const handleRemoveResume = (id: number) => {
    setResumes((prevResume) => {
        if(selectedResumeId === id){
            setSelectedResumeId(null);
        }
        return prevResume.filter((resumes) => resumes.id !== id);
    })
  };

  const handleResumeChange = (id: number, file: File | null) => {
    setResumes(
      resumes.map((resume) =>
        resume.id === id ? { ...resume, file } : resume
      )
    );
  };

  const handleRadioChange = (id: number) => {
    setSelectedResumeId(id);
  };

  if (!isOpen) return null;

  return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <Toaster position="top-center" expand={false} richColors />
      <div className="bg-white p-6 rounded shadow-lg w-[500px]">
        <div className="flex justify-end">
          <button onClick={onClose}>&times;</button>
        </div>
        <h2 className="text-xl font-bold mb-4">Apply for Job</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 mt-8">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="text" className="w-full p-2 border border-gray-300 rounded mt-1" value={email} onChange={(e)=> setEmail(e.target.value)} required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input type="number" className="w-full p-2 border border-gray-300 rounded mt-1" value={phone} onChange={(e)=> setPhone(e.target.value)} required />
          </div>
          <div className="mt-8">
            <label className="block text-sm font-medium text-gray-700">Resumes</label>
            <div className="max-h-48 overflow-y-auto">
              {resumes.map((resume) => (
                <div key={resume.id} className="flex items-center mb-2">
                  <input
                    type="file"
                    accept=".pdf"
                    className="w-full p-2 border border-gray-300 rounded mr-2"
                    onChange={(e) => handleResumeChange(resume.id, e.target.files ? e.target.files[0] : null)}
                  />
                  <input
                    type="radio"
                    name="selectedResume"
                    checked={selectedResumeId === resume.id}
                    onChange={() => handleRadioChange(resume.id)}
                    className="mr-2"
                  />
                  {resumes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveResume(resume.id)}
                      className="text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddResume}
              className="mt-2 text-blue-500 hover:underline"
            >
              Add more PDF
            </button>
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

export default JobApplyModal;
