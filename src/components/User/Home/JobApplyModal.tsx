import { FC, FormEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Toaster, toast } from "sonner";
import { RootState } from "../../../redux/store/store";
import { userAxios } from "../../../constraints/axios/userAxios";
import { userEndpoints } from "../../../constraints/endpoints/userEndpoints";
import { jobpostAxios } from "../../../constraints/axios/jobpostAxios";
import { jobpostEndpoints } from "../../../constraints/endpoints/jobpost.Endpoints";

interface JobApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  jobId: string;
}

interface Resume {
  id: number;
  file: File | null;
  title?: string;
  url?: string;
  fetched?: boolean;
}

const JobApplyModal: FC<JobApplyModalProps> = ({ isOpen, onClose, onSuccess, jobId }) => {
  const [resumes, setResumes] = useState<Resume[]>([{ id: 1, file: null }]);
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(1);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');

  const reduxEmail = useSelector((store: RootState) => store.UserAuth.userData?.email) || '';
  const reduxPhone = useSelector((store: RootState) => store.UserAuth.userData?.phone) || '';
  const reduxName = useSelector((store: RootState) => store.UserAuth.userData?.name) || '';
  const token = useSelector((store: RootState) => store.UserAuth.token);

  useEffect(() => {
    setEmail(reduxEmail);
    setPhone(reduxPhone);
    setName(reduxName);
    if (isOpen) {
      cvApply();
    }
  }, [isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (resumes.every((resume) => resume.file === null && !resume.fetched)) {
        toast.error("Please select at least one resume file.");
        return;
      }
      if (selectedResumeId === null) {
        toast.error("Please select a resume to submit.");
        return;
      }
      const resumeIds = resumes.map((resume) => resume.url).filter(Boolean).join('');
      const data = {
        name,
        email,
        phone,
        resumes:resumeIds
      }
      console.log("sending apply job ",resumes);
      
      const response = await jobpostAxios.post(`${jobpostEndpoints.applyJob}?jobId=${jobId}`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.success) {
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.log("Error applying job", error);
    }
  };

  async function cvApply() {
    try {
      const response = await userAxios.get(`${userEndpoints.getCv}?email=${reduxEmail}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("response api", response.data);

      if (response.data.success) {
        const fetchedCVItems = response.data.cv.map((item: { url: string; filename: string }, index: number) => ({
          id: index + 1,
          file: null,
          title: item.filename || 'Unknown CV',
          url: item.url,
          fetched: true,
        }));
        setResumes(fetchedCVItems);
      }
    } catch (error) {
      console.log("Error fetching CV in applying job", error);
    }
  }

  const handleAddResume = () => {
    setResumes([...resumes, { id: resumes.length + 1, file: null }]);
  };

  const handleRemoveResume = (id: number) => {
    setResumes((prevResume) => {
      if (selectedResumeId === id) {
        setSelectedResumeId(null);
      }
      return prevResume.filter((resume) => resume.id !== id);
    });
  };

  const handleResumeChange = (id: number, file: File | null) => {
    setResumes(
      resumes.map((resume) =>
        resume.id === id ? { ...resume, file, fetched: false } : resume
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
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" className="w-full p-2 border border-gray-300 rounded mt-1" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="mb-4 mt-8">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="text" className="w-full p-2 border border-gray-300 rounded mt-1" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input type="number" className="w-full p-2 border border-gray-300 rounded mt-1" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>
          <div className="mt-8">
            <label className="block text-sm font-medium text-gray-700">Resumes</label>
            <div className="max-h-48 overflow-y-auto">
              {resumes.map((resume) => (
                <div key={resume.id} className="flex items-center mb-2">
                  {!resume.fetched ? (
                    <input
                      type="file"
                      accept=".pdf"
                      className="w-full p-2 border border-gray-300 rounded mr-2"
                      onChange={(e) => handleResumeChange(resume.id, e.target.files ? e.target.files[0] : null)}
                    />
                  ) : (
                    <a
                      href={resume.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full p-2 border border-gray-300 rounded mr-2"
                    >
                      {resume.title}
                    </a>
                  )}
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
