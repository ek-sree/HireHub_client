import { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import { Button, IconButton } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
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
  const [fetchTrigger, setFetchTrigger] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();
  const { jobId } = useParams();
  const token = useSelector((store: RootState) => store.RecruiterAuth.token);

  const fetchApplications = async (page = 1) => {
    if (!jobId) {
      toast.error('Job ID not found');
      return;
    }

    try {
      const response = await jobpostAxios.get(`${jobpostEndpoints.viewApplication}?jobId=${jobId}&page=${page}&limit=2`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("dataaaaaa", response.data);

      if (response.data.success) {
        setApplications(response.data.applications || []);
        setTotalPages(Math.ceil(response.data.totalUsers / 2));
      } else {
        throw new Error('Failed to fetch applications');
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to fetch applications');
    }
  };

  useEffect(() => {
    fetchApplications(currentPage);
  }, [jobId, currentPage, fetchTrigger]);

  const handleAccept = async (id: string) => {
    setLoading(true);
    if (!jobId) {
      throw new Error("Job id is missing");
    }
    try {
      const response = await jobpostAxios.post(`${jobpostEndpoints.acceptApplication}?jobId=${jobId}&applicationId=${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        toast.success("Accepted application");
        setFetchTrigger(!fetchTrigger);
      } else {
        toast.error("Application is missing or can't be accepted right now!");
      }
    } catch (error) {
      console.error("Error accepting application:", error);
      toast.error("Failed to accept application");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (id: string) => {
    setLoading(true);
    try {
      if (!jobId) {
        throw new Error("Job id is missing");
      }
      const response = await jobpostAxios.post(`${jobpostEndpoints.rejectedApplication}?jobId=${jobId}&applicationId=${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        toast.success("Successfully rejected application");
        setFetchTrigger(!fetchTrigger);
      } else {
        toast.error("Failed to reject application");
      }
    } catch (error) {
      console.error("Error rejecting application:", error);
      toast.error("Failed to reject application");
    } finally {
      setLoading(false);
    }
  };

  const getItemProps = (index: number) => ({
    variant: currentPage === index ? "filled" : "text",
    color: currentPage === index ? "green" : "black",
    onClick: () => setCurrentPage(index),
    className: "rounded-full",
    size: currentPage === index ? "lg" : "md",
  });

  const prev = () => {
    if (currentPage === 1) return;
    setCurrentPage(currentPage - 1);
  };

  const next = () => {
    if (currentPage === totalPages) return;
    setCurrentPage(currentPage + 1);
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
    <div className="min-h-screen p-4 max-w-7xl mx-auto">
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
                    <button
                      className={`py-1 px-3 rounded mr-2 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 text-white'}`}
                      onClick={() => handleAccept(application._id)}
                      disabled={loading}
                    >
                      {loading ? 'Loading...' : 'Shortlisted'}
                    </button>
                    <button
                      className={`py-1 px-3 rounded ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 text-white'}`}
                      onClick={() => handleReject(application._id)}
                      disabled={loading}
                    >
                      {loading ? 'Loading...' : 'Reject'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center gap-4 mt-4 justify-center">
        <Button
          variant="text"
          className={`flex items-center gap-2 rounded-full ${currentPage === 1 ? "text-gray-400" : ""}`}
          onClick={prev}
          disabled={currentPage === 1}
        >
          <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" /> Previous
        </Button>
        <div className="flex items-center gap-2 font-semibold">
          {[...Array(totalPages)].map((_, index) => (
            <IconButton key={index + 1} {...getItemProps(index + 1)}>
              {index + 1}
            </IconButton>
          ))}
        </div>
        <Button
          variant="text"
          className={`flex items-center gap-2 rounded-full ${currentPage === totalPages ? "text-gray-400" : ""}`}
          onClick={next}
          disabled={currentPage === totalPages}
        >
          Next <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
        </Button>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg relative">
            <button className="absolute top-1 right-2 text-gray-500 hover:text-gray-700" onClick={closeModal}>
              <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                <path d="M6.225 4.811L4.811 6.225 10.586 12l-5.775 5.775 1.414 1.414L12 13.414l5.775 5.775 1.414-1.414L13.414 12l5.775-5.775-1.414-1.414L12 10.586z" />
              </svg>
            </button>
            <iframe src={resumeUrl} className="w-full h-96" title="Resume"></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewApplications;
