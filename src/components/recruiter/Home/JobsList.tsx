import { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import { Link } from 'react-router-dom';
import { jobpostAxios } from '../../../constraints/axios/jobpostAxios';
import { jobpostEndpoints } from '../../../constraints/endpoints/jobpost.Endpoints';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';
import { Button } from '@material-ui/core';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import SkillLogo from '../../../assets/images/skills.png';
import JopType from '../../../assets/images/man-working-on-a-laptop-from-side-view.png';
import JobpostEditModal from './JobpostEditModal';
import AddNewJob from './AddNewJob';
import { Job } from '../../../interface/JobInterfaces/IJobInterface';

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

  const getJobs = async () => {
    try {
      const response = await jobpostAxios.get(`${jobpostEndpoints.getjobs}?recruiterId=${recruiterId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("list data",response.data);

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
    <div className="min-h-screen p-4 w-fit mx-auto">
      <Toaster position="top-center" expand={false} richColors />

      <Button variant="contained" color="primary" onClick={handleNewJobModal} className="mb-4">
        Add New Job
      </Button>

      <div className="overflow-x-auto mt-4">
        {jobs.length === 0 ? (
          <div className="text-center text-gray-500">No jobs found.</div>
        ) : (
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden divide-y divide-gray-200">
            <thead className="bg-gray-200">
              <tr className="text-gray-600 text-sm">
                <th className="py-3 px-6 text-left">Company Name</th>
                <th className="py-3 px-6 text-left">Position</th>
                <th className="py-3 px-6 text-left">Location, Employment Type, Job Type, Skills</th>
                <th className="py-3 px-6 text-left">Total Applications</th>
                <th className="py-3 px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {jobs.map((job, index) => (
                <tr key={job._id} className="text-gray-600 text-sm">
                  <td className="py-4 px-6">{job.companyName}</td>
                  <td className="py-4 px-6">{job.position}</td>
                  <td className="py-4 px-6 flex items-center">
                    <LocationOnRoundedIcon fontSize="small" />
                    <span className="ml-1">{job.place}</span>
                  </td>
                  <td className="py-4 px-6 flex items-center">
                    <img src={JopType} alt="job type" className="h-4 w-4 mr-1" />
                    <span>{job.employmentType.join(', ')}</span>
                  </td>
                  <td className="py-4 px-6 flex items-center">
                    <WorkRoundedIcon fontSize="small" />
                    <span className="ml-1">{job.jobType.join(', ')}</span>
                  </td>
                  <td className="py-4 px-6 flex items-center">
                    <img src={SkillLogo} alt="skill logo" className="h-4 w-4 mr-1" />
                    <span>{job.skills.join(', ')}</span>
                  </td>
                  <td className="py-4 px-6 text-center">{applicationCount[index]}</td>
                  <td className="py-4 px-6">
                    <div className="flex">
                      <button
                        onClick={() => handleEditClick(job)}
                        className="text-sm text-blue-500 hover:underline cursor-pointer mr-10"
                      >
                        Edit
                      </button>
                      <Link to={`/recruiter/viewapplication/${job._id}`}>
                        <button className="text-sm text-blue-500 hover:underline cursor-pointer">
                          View Application
                        </button>
                      </Link>
                    </div>
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
