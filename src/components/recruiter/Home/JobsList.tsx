import { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import { Link } from 'react-router-dom';
import { jobpostAxios } from '../../../constraints/axios/jobpostAxios';
import { jobpostEndpoints } from '../../../constraints/endpoints/jobpost.Endpoints';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import JobpostEditModal from './JobpostEditModal';
import AddNewJob from './AddNewJob';
import { Job } from '../../../interface/JobInterfaces/IJobInterface';
import { XMarkIcon } from "@heroicons/react/24/outline"; 
import { CheckCircleIcon } from '@heroicons/react/24/outline';

const JobsList = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isNewJobModal, setNewJobModal] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applicationCount, setApplicationCount] = useState<number[]>([]);
  const [editJob, setEditJob] = useState<Job | null>(null);
  const token = useSelector((store: RootState) => store.RecruiterAuth.token);
  const recruiterId = useSelector((store: RootState) => store.RecruiterAuth.recruiterData?._id);

  const handleNewJobModal = () => {
    setNewJobModal(true);
  };

  const handleNewJobModalClose = () => {
    setNewJobModal(false);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleEditClick = (job: Job) => {
    setEditJob(job);
    setModalOpen(true);
  };

  const addJobList = (job: Job) => {
    setJobs(prevJobs => [...prevJobs, job]);
  };

  const updateJobList = (updatedJob: Job) => {
    setJobs(prevJobs => prevJobs.map(job => (job._id === updatedJob._id ? updatedJob : job)));
  };

  const handlesoftDelete = async (id: string) => {
    try {
      const response = await jobpostAxios.put(`${jobpostEndpoints.softDeleteJob}/${id}`);

      if (response.data.success) {
        toast.success(response.data.message);
        setJobs(prevJobs => prevJobs.map(job => 
          job._id === id ? { ...job, isBlocked: !job.isBlocked } : job
        ));
      } else {
        toast.error("Failed to update job status");
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('Error deleting job');
    }
  };

  const getJobs = async () => {
    try {
      const response = await jobpostAxios.get(`${jobpostEndpoints.getjobs}?recruiterId=${recruiterId}`);
      const jobsData: Job[] = response.data.job;
      const applicationCounts = jobsData.map(job =>
        job.applications?.filter(application => application.status === "pending").length || 0
      );

      setJobs(jobsData);
      setApplicationCount(applicationCounts);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  useEffect(() => {
    getJobs();
  }, [recruiterId, token]);

  return (
    <div className="min-h-screen p-4 w-full mx-auto">
      <Toaster position="top-center" expand={false} richColors />

      <button onClick={handleNewJobModal} className='bg-blue-800 py-2 px-2 rounded-md text-white font-medium hover:bg-blue-900'>
        Add New Job
      </button>

      <div className="overflow-x-auto mt-4">
        {jobs.length === 0 ? (
          <div className="text-center text-gray-500">No jobs found.</div>
        ) : (
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden divide-y divide-gray-200">
            <thead className="bg-gray-200">
              <tr className="text-gray-600 text-sm">
                <th className="py-3 px-6 text-left">Position</th>
                <th className="py-3 px-6 text-left">Location</th>
                <th className="py-3 px-6 text-left">Employment Type</th>
                <th className="py-3 px-6 text-left">Job Type</th>
                <th className="py-3 px-6 text-left">Skills</th>
                <th className="py-3 px-6 text-left">Experience</th>
                <th className="py-3 px-6 text-left">Created Date</th> 
                <th className="py-3 px-6 text-center">Total Applications</th>
                <th className="py-3 px-6 text-center">View All Applications</th>
                <th className="py-3 px-6 text-center">View Shortlisted Candidates</th>
                <th className="py-3 px-6 text-center">View Awaited Candidates</th>
                <th className="py-3 px-6 text-center">Edit / Hide Job</th> 
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {jobs.map((job, index) => (
                <tr key={job._id} className="text-gray-600 text-sm">
                  <td className="py-4 px-6">{job.position}</td>
                  <td className="py-4 px-6 flex items-center">
                    <LocationOnRoundedIcon fontSize="small" />
                    <span className="ml-1">{job.place}</span>
                  </td>
                  <td className="py-4 px-6">{job.employmentType.join(', ')}</td>
                  <td className="py-4 px-6">{job.jobType.join(', ')}</td>
                  <td className="py-4 px-6">{job.skills.join(', ')}</td>
                  <td className="py-4 px-6">{job.experience}</td>
                  <td className="py-4 px-6">{job.created_at ? new Date(job.created_at).toLocaleDateString() : 'N/A'}</td> 
                  <td className="py-4 px-6 text-center">{applicationCount[index]}</td>
                  <td className="py-4 px-6 text-center flex">
              
                    <Link to={`/recruiter/viewapplication/${job._id}`}>
                      <button className="text-sm text-slate-600 hover:shadow-xl shadow-lg font-serif cursor-pointer hover:bg-slate-100  rounded">
                        View Application
                      </button>
                    </Link>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <Link to={`/recruiter/shortlistedOnJob/${job._id}`}>
                      <button className="text-sm text-black font-serif shadow-lg p-2 rounded-md hover:bg-slate-100 cursor-pointer">
                        View
                      </button>
                    </Link>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <Link to={`/recruiter/awaitedCandidate/${job._id}`}>
                      <button className="text-sm text-black font-serif shadow-lg p-2 rounded-md hover:bg-slate-100 cursor-pointer">
                        View
                      </button>
                    </Link>
                  </td>
                  <td className="py-4 px-6 text-center">
                  <button
                      onClick={() => handleEditClick(job)}
                      className="text-sm text-blue-500 hover:underline cursor-pointer mt-2 bg-orange-100 px-3 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handlesoftDelete(job._id)}
                      className="text-red-500 hover:text-red-700 mt-3"
                    >
                      {job.isBlocked ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      ) : (
                        <XMarkIcon className="h-5 w-5" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <JobpostEditModal isOpen={isModalOpen} onClose={handleCloseModal} job={editJob} onUpdateJobList={updateJobList} />
      <AddNewJob isNewJobModal={isNewJobModal} onClose={handleNewJobModalClose} addJobList={addJobList} />
    </div>
  );
};

export default JobsList;
