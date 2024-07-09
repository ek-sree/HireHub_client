import { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import { Button } from "@material-tailwind/react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate, useParams } from "react-router-dom";
import { jobpostAxios } from "../../../constraints/axios/jobpostAxios";
import { jobpostEndpoints } from "../../../constraints/endpoints/jobpost.Endpoints";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";

interface Application {
  _id: string;
  name: string;
  email: string;
  phone: string;
  resume: string;
}

const ViewApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resumeUrl, setResumeUrl] = useState('');
  const navigate = useNavigate();
  const { jobId } = useParams();
  const token = useSelector((store: RootState) => store.RecruiterAuth.token);

  const fetchApplications = async () => {
    if (!jobId) {
      toast.error('Job ID not found');
      return;
    }

    try {
      const response = await jobpostAxios.get(`${jobpostEndpoints.viewApplication}?jobId=${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("dataaaaaa", response.data);

      if (response.data.success) {
        setApplications(response.data.applications || []);
      } else {
        throw new Error('Failed to fetch applications');
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to fetch applications');
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [jobId]);

  const handleAccept = (id: string) => {
    toast.success(`Accepted application ${id}`);
  };

  const handleReject = (id: string) => {
    toast.error(`Rejected application ${id}`);
  };

  const handleBack = () => {
    navigate('/recruiter/home');
  };

  const handleViewCV = (resumeUrl: string) => {
    setResumeUrl(resumeUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setResumeUrl('');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Toaster position="top-center" expand={false} richColors />
      <Button variant="text" className="mb-4 flex items-center gap-2" onClick={handleBack}>
        <ArrowLeftIcon strokeWidth={2} className="h-5 w-5" /> Back
      </Button>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="w-full bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Phone</th>
              <th className="py-3 px-6 text-left">Resume</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {applications.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-3">No applications found.</td>
              </tr>
            ) : (
              applications.map((application) => (
                <tr key={application._id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left">{application.name}</td>
                  <td className="py-3 px-6 text-left">{application.email}</td>
                  <td className="py-3 px-6 text-left">{application.phone}</td>
                  <td className="py-3 px-6 text-left">
                    <a
                      href="#"
                      className="text-blue-500 hover:underline cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        handleViewCV(application.resume);
                      }}
                    >
                      View CV
                    </a>
                  </td>
                  <td className="py-3 px-6 text-left">
                    <button className="py-1 px-3 bg-green-500 text-white rounded mr-2" onClick={() => handleAccept(application._id)}>Accept</button>
                    <button className="py-1 px-3 bg-red-500 text-white rounded" onClick={() => handleReject(application._id)}>Reject</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-4xl">
            <button className="text-gray-500 hover:text-gray-700 float-right" onClick={closeModal}>Close</button>
            <iframe src={resumeUrl} className="w-full h-96 mt-4" title="Resume"></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewApplications;
