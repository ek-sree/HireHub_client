import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import SkillLogo from '../../../assets/images/skills.png';
import JopType from '../../../assets/images/man-working-on-a-laptop-from-side-view.png';
import { useEffect, useState } from 'react';
import { Toaster } from 'sonner';
import { Link } from 'react-router-dom';
import AddNewJob from './AddNewJob';
import JobpostEditModal from './JobpostEditModal';
import { jobpostAxios } from '../../../constraints/axios/jobpostAxios';
import { jobpostEndpoints } from '../../../constraints/endpoints/jobpost.Endpoints';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';

interface Job {
  _id: string;
  position: string;
  place: string;
  jobType: string[];
  employmentType: string[];
  skills: string[];
  companyName: string;
}

const JobsList = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isNewJobModal, setNewJobModal] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [editJob, setEditJob] = useState<Job | null>(null);

  const token = useSelector((store: RootState)=> store.RecruiterAuth.token);
  const recruiterId = useSelector((store: RootState)=> store.RecruiterAuth.recruiterData?._id);

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
    setJobs(prevJobs => prevJobs.map(job => job._id === updatedJob._id ? updatedJob : job));
  };

  const getJobs = async()=>{
    const response = await jobpostAxios.get(`${jobpostEndpoints.getjobs}?recruiterId=${recruiterId}`, {
      headers:{
        Authorization: `Bearer ${token}`
      }
    })

    console.log("response from get all jobs api", response);
    setJobs(response.data.job)
  }

  useEffect(()=>{
    getJobs();
  },[recruiterId, token])

  console.log("hey recruiter home",jobs);
  return (
    <div className="relative mt-16">
      <Toaster position="top-center" expand={false} richColors />
      <button onClick={handleNewJobModal} className="bottom-[300px] right-5 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg">
        Add New Job
      </button>
      <div className="flex flex-wrap gap-4 p-4">
        {jobs.length === 0?(
          <div>No data found</div>
        ):(
        jobs.map(job => (
          <div key={job._id} className="bg-slate-200 w-72 h-auto rounded-lg p-4 shadow-lg">
            <div className="text-center font-semibold">
             {job.companyName}
            </div>
            <div className="mt-4 text-center text-sm text-slate-500">
              {job.position}
            </div>
            <div className="mt-3 flex items-center text-sm text-slate-500">
              <LocationOnRoundedIcon fontSize='small' />
              <span className='ml-1'>{job.place}</span>
            </div>
            <div className="mt-3 flex items-center text-sm text-slate-500">
              <img src={JopType} alt="job type" className='h-4 w-4 mr-1' />
              <span>{job.employmentType.join(', ')}</span>
            </div>
            <div className="mt-3 flex items-center text-sm text-slate-500">
              <WorkRoundedIcon fontSize='small' />
              <span className='ml-1'>{job.jobType.join(', ')}</span>
            </div>
            <div className="mt-3 flex items-center text-sm text-slate-500 flex-wrap">
              <img src={SkillLogo} alt="skill logo" className='h-4 w-4 mr-1' />
              <span>Skills: </span>
              <span className="ml-1">{job.skills.join(', ')}</span>
            </div>
            <div className='flex justify-between mt-6'>
              <span onClick={() =>handleEditClick(job)} className='bg-blue-500 px-2 p-1 rounded-md text-white hover:cursor-pointer hover:bg-blue-600'>Edit</span>
              <Link to='/recruiter/viewapplication'><span className='bg-blue-500 px-2 p-1 rounded-md text-white hover:cursor-pointer hover:bg-blue-600'>View application</span></Link>
            </div>
          </div>
        )))}
      </div>
      <JobpostEditModal isOpen={isModalOpen} onClose={handleCloseModal} job={editJob} onUpdateJobList={updateJobList} />
      <AddNewJob isNewJobModal={isNewJobModal} onClose={handleNewJobModalClose} addJobList={addJobList}/>
    </div>
  );
};

export default JobsList;
