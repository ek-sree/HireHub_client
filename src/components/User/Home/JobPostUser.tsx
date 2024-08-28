import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Toaster, toast } from 'sonner';
import { LinearProgress, Stack } from '@mui/material';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import JopType from '../../../assets/images/man-working-on-a-laptop-from-side-view.png';
import CompanyImage from '../../../assets/images/facebook-new-logo-change-designboom-02.webp';
import SkillLogo from '../../../assets/images/skills.png';
import JobApplyModal from './JobApplyModal';
import { jobpostAxios } from '../../../constraints/axios/jobpostAxios';
import { jobpostEndpoints } from '../../../constraints/endpoints/jobpost.Endpoints';
import { RootState } from '../../../redux/store/store';
import { useDebonceSearch } from '../../../customHook/searchHook';

interface Jobs {
  _id: string;
  position: string;
  place: string;
  jobType: string[];
  employmentType: string[];
  skills: string[];
  companyName: string;
  applications: Array<{ email: string }>;
}

const JobPostUser: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [jobs, setJobs] = useState<Jobs[]>([]);
  const [employmentType, setEmploymentType] = useState<string[]>([]);
  const [jobType, setJobType] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [jobId, setJobId] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const email = useSelector((store: RootState) => store.UserAuth.userData?.email);

  const [debouncedQuery] = useDebonceSearch(searchQuery, 500);

  const handleApplyClick = (jobId: string) => {
    setJobId(jobId);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSuccess = () => {
    setIsSuccess(prev => !prev);
    toast.success('Applied successfully');
  };

  const getAllJobs = async () => {
    setLoading(true);
    const params = new URLSearchParams();

    employmentType.forEach(type => params.append('employment', type));
    jobType.forEach(type => params.append('job', type));

    try {
      const response = await jobpostAxios.get(`${jobpostEndpoints.getallJobs}?${params.toString()}&search=${searchQuery}`);

      if (response.data.success) {
        setJobs(response.data.job);
        setJobId(response.data.job._id);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllJobs();
  }, [employmentType, jobType, debouncedQuery, isSuccess]);

  const handleEmploymentTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    setEmploymentType(prev =>
      checked ? [...prev, value] : prev.filter(type => type !== value)
    );
  };

  const handleJobTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    setJobType(prev =>
      checked ? [...prev, value] : prev.filter(type => type !== value)
    );
  };

  return (
    <div className="max-w-full px-4 md:max-w-[960px] mx-auto mt-10 mb-10 relative">
      <Toaster position="top-center" expand={false} richColors />
      
      <div className="md:fixed md:right-10 md:top-40 rounded-xl p-4 mb-6 md:mb-0 shadow-shadowAll bg-white">
        <div className="mb-2 font-bold">Filter</div>
        
        <div className="mb-2 font-semibold text-[15px]">Employment type:</div>
        <div className="flex flex-wrap gap-2 text-[13px] text-slate-400">
          {['Remote', 'On-site', 'Hybrid'].map(type => (
            <div key={type} className="flex items-center">
              <input
                type="checkbox"
                id={type}
                value={type}
                onChange={handleEmploymentTypeChange}
                className="mr-1"
              />
              <label htmlFor={type}>{type}</label>
            </div>
          ))}
        </div>
        
        <div className="mb-2 font-semibold text-[15px] mt-3">Job Type:</div>
        <div className="flex flex-wrap gap-2 text-[13px] text-slate-400">
          {['Part-time', 'Full-time', 'Contract', 'Internship'].map(type => (
            <div key={type} className="flex items-center">
              <input
                type="checkbox"
                id={type}
                value={type}
                onChange={handleJobTypeChange}
                className="mr-1"
              />
              <label htmlFor={type}>{type}</label>
            </div>
          ))}
        </div>
        
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {setSearchQuery(e.target.value); setLoading(true)}}
          className="mt-5 shadow-shadowAll rounded-md px-3 py-1 w-full"
          placeholder="Search by place"
        />
      </div>

      <div className="md:ml-0">
        {loading ? (
          <Stack sx={{ width: '100%', color: 'grey.500' }} spacing={2}>
            <LinearProgress color="secondary" />
            <LinearProgress color="success" />
            <LinearProgress color="inherit" />
          </Stack>
        ) : jobs.length === 0 ? (
          <div className="text-center mt-10">No job posts yet</div>
        ) : (
          <div className="flex flex-col items-center">
            {jobs.map(job => (
              <div
                key={job._id}
                className="w-full md:w-[600px] font-bold text-xl rounded-lg p-4 shadow-md mb-4"
              >
                <div className="flex items-center">
                  <img
                    src={CompanyImage}
                    alt="company logo"
                    className="h-12 w-14 rounded-full border-2 border-slate-400 shadow-lg object-cover"
                  />
                  <span className="ml-2 text-slate-600">{job.companyName}</span>
                </div>
                <div className="font-normal text-base text-slate-400 mt-5">
                  <div className="mt-2 mb-2 flex items-center">
                    <img src={JopType} alt="Job Type" className="h-4 mr-2" />
                    <span>{job.position}</span>
                  </div>
                  <div className="flex items-center mt-2">
                    <LocationOnRoundedIcon fontSize="small" className="text-black mr-2" />
                    <span>{job.place}</span>
                  </div>
                  <div className="mt-2 flex items-center">
                    <img src={JopType} alt="Job Type" className="h-4 mr-2" />
                    <span>{job.jobType.join(', ')}</span>
                  </div>
                  <div className="mt-2 flex items-center">
                    <WorkRoundedIcon fontSize="small" className="text-black mr-2" />
                    <span>{job.employmentType.join(', ')}</span>
                  </div>
                  <div className="mt-2 flex items-center flex-wrap">
                    <img src={SkillLogo} alt="skills" className="h-5 mr-2" />
                    <span>Skills: {job.skills.join(', ')}</span>
                  </div>
                  {!job.applications.some(application => application.email === email) ? (
                    <div
                      onClick={() => handleApplyClick(job._id)} 
                      className="flex justify-center bg-cyan-300 mt-6 rounded-lg text-white font-semibold hover:font-normal hover:bg-cyan-400 shadow-lg hover:cursor-pointer py-2"
                    >
                      Apply Now
                    </div>
                  ) : (
                    <div className="flex justify-center bg-gray-300 mt-6 rounded-lg text-white font-semibold cursor-not-allowed py-2">
                      You have already applied
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <JobApplyModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
        jobId={jobId}
      />
    </div>
  );
};

export default JobPostUser;