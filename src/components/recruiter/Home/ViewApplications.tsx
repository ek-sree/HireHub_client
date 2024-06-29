import  { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import { Button } from "@material-tailwind/react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const ViewApplications = () => {
  const [applications, setApplications] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    
  }, []);

  const handleView = (id) => {
    toast.success(`View application ${id}`);
  };

  const handleAccept = (id) => {
    toast.success(`Accepted application ${id}`);
  };

  const handleReject = (id) => {
    toast.error(`Rejected application ${id}`);
  };

  const handleBack = () => {
        navigate('/recruiter/home')
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
              <th className="py-3 px-6 text-left">Username</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Message</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {applications.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-3">No applications found.</td>
              </tr>
            ) : (
              applications.map((application) => (
                <tr key={application.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">{application.username}</td>
                  <td className="py-3 px-6 text-left">{application.email}</td>
                  <td className="py-3 px-6 text-left">{application.message}</td>
                  <td className="py-3 px-6 text-left">
                    <button className="py-1 px-3 mr-2 bg-blue-500 text-white rounded" onClick={() => handleView(application.id)}>View</button>
                    <button className="py-1 px-3 mr-2 bg-green-500 text-white rounded" onClick={() => handleAccept(application.id)}>Accept</button>
                    <button className="py-1 px-3 bg-red-500 text-white rounded" onClick={() => handleReject(application.id)}>Reject</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewApplications;
