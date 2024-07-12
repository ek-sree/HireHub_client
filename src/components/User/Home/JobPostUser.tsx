import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import JopType from '../../../assets/images/man-working-on-a-laptop-from-side-view.png';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import CompanyImage from '../../../assets/images/facebook-new-logo-change-designboom-02.webp';
import SkillLogo from '../../../assets/images/skills.png';
import JobApplyModal from './JobApplyModal';
import { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';
import { jobpostAxios } from '../../../constraints/axios/jobpostAxios';
import { jobpostEndpoints } from '../../../constraints/endpoints/jobpost.Endpoints';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';
import { useDebonceSearch } from '../../../customHook/searchHook';
import { LinearProgress, Stack } from '@mui/material';

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

const JobPostUser = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [jobs, setJobs] = useState<Jobs[]>([]);
  const [employmentType, setEmploymentType] = useState<string[]>([]);
  const [jobType, setJobType] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [jobId, setJobId] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const token = useSelector((store: RootState) => store.UserAuth.token);
  const email = useSelector((store:RootState)=>store.UserAuth.userData?.email);

  const [debouncedQuery] = useDebonceSearch(searchQuery, 500);

  const handleApplyClick = (jobId:string) => {
    setJobId(jobId);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSuccess = () => {
    setIsSuccess(prev=>!prev);
    toast.success('Applied successfully');
  };

 

  const getAllJobs = async () => {
    setLoading(true);
    const params = new URLSearchParams();

    employmentType.forEach(type => params.append('employment', type));
    jobType.forEach(type => params.append('job', type));

    const response = await jobpostAxios.get(`${jobpostEndpoints.getallJobs}?${params.toString()}&search=${searchQuery}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    console.log('get all jobs in userside', response.data);

    if (response.data.success) {
      setLoading(false);
      setJobId(response.data.job._id)
        setJobs(response.data.job);
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
    const {value, checked } = event.target;    
    setJobType(prev=>
      checked ? [...prev, value] : prev.filter(type => type !== value)
    )
  }
  console.log("job id in pobpost",jobId);
  console.log("job",jobs);
  return (
    <div className="max-w-[960px] h-auto mx-auto mt-10 mb-10 relative">
      <Toaster position="top-center" expand={false} richColors />
      <div className="right-10 bottom-[400px] rounded-xl p-4 fixed shadow-xl">
        <div className="mb-2 font-bold">Filter</div>
        <div className="mb-2 font-semibold text-[15px]">Employment type :</div>
        <div className="flex flex-col gap-2 text-[13px] text-slate-400">
          <div className="flex gap-2">
            <div className="flex items-center">
              Remote:
              <input
                type="checkbox"
                value="Remote"
                onChange={handleEmploymentTypeChange}
                className="ml-2 mt-1"
              />
            </div>
            <div className="flex items-center">
              On-site:
              <input
                type="checkbox"
                value="On-site"
                onChange={handleEmploymentTypeChange}
                className="ml-2 mt-1"
              />
            </div>
            <div className="flex items-center">
              Hybrid:
              <input
                type="checkbox"
                value="Hybrid"
                onChange={handleEmploymentTypeChange}
                className="ml-2 mt-1"
              />
            </div>
          </div>
        </div>
        <div className="mb-2 font-semibold text-[15px] mt-3">Job Type :</div>
        <div className="flex flex-col gap-2 text-[13px] text-slate-400">
          <div className="flex gap-2">
            <div className="flex items-center">
              Part-time:
              <input type="checkbox" value="Part-time" onChange={handleJobTypeChange} className="ml-2 mt-1" />
            </div>
            <div className="flex items-center">
              Full-time:
              <input type="checkbox" value="Full-time" onChange={handleJobTypeChange} className="ml-2 mt-1" />
            </div>
            <div className="flex items-center">
              Contract:
              <input type="checkbox" value="Contract" onChange={handleJobTypeChange} className="ml-2 mt-1" />
            </div>
            <div className="flex items-center">
              Internship:
              <input type="checkbox" value="Internship" onChange={handleJobTypeChange} className="ml-2 mt-1" />
            </div>
          </div>
        </div>
        <div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) =>{setSearchQuery(e.target.value),setLoading(true)}}
            className="mt-5 shadow-lg rounded-md px-3 py-1 w-full"
            placeholder="search by place"
          />
        </div>
      </div>
      {loading?(

        <Stack sx={{ width: '100%', color: 'grey.500' }} spacing={2}>
                <LinearProgress color="secondary" />
                <LinearProgress color="success" />
                <LinearProgress color="inherit" />
              </Stack>
      ):(
      
        <div className="flex justify-center items-center w-80 ml-72 mb-5 flex-col">
        {jobs.length === 0 ? (
          <div>No job post yet</div>
        ) : (
          jobs.map(job => (
            <div
              key={job._id}
              className="w-[600px] font-bold text-xl rounded-lg p-4 shadow-xl mb-4"
            >
              <div className="flex items-center">
                <img
                  src={CompanyImage}
                  alt="company image"
                  className="h-12 rounded-full w-14 border-2 border-slate-400 shadow-lg"
                />
                <span className="ml-2 text-slate-600">{job.companyName}</span>
              </div>
              <div className="font-normal text-base text-slate-400 mt-5">
                <div className="mt-2 mb-2 text-base flex items-center">
                  <img
                    src={JopType}
                    alt="JobType"
                    className="h-4 ml-1 mr-2"
                  />
                  {job.position}
                </div>
                <LocationOnRoundedIcon
                  fontSize="small"
                  className="pl-1 text-black mr-2 mb-1"
                />
                {job.place}
                <div className="mt-2 text-base flex items-center">
                  <img
                    src={JopType}
                    alt="JobType"
                    className="h-4 ml-1 mr-2"
                  />
                  {job.jobType.join(', ')}
                </div>
                <div className="mt-2 text-base">
                  <WorkRoundedIcon
                    fontSize="small"
                    className="pl-1 text-black mr-2 mb-1"
                  />
                  {job.employmentType.join(', ')}
                </div>
                <div className="mt-2 break-words text-base flex gap-1">
                  <img src={SkillLogo} alt="skills" className="h-5" />
                  skills: -{job.skills.join(', ')}
                </div>
                {!job.applications.some(application => application.email === email) ? (
                    <div
                      onClick={() => handleApplyClick(job._id)} 
                      className="flex justify-center bg-cyan-300 mt-6 rounded-lg text-white font-semibold hover:font-normal hover:bg-cyan-400 shadow-lg hover:cursor-pointer"
                    >
                      Apply Now
                    </div>
                  ) : (
                    <div className="flex justify-center bg-gray-300 mt-6 rounded-lg text-white font-semibold cursor-not-allowed">
                      You have already applied
                    </div>
                  )}
              </div>
            </div>
          ))
        )}
      </div>
        )}
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
