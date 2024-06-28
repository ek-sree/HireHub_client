import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import JopType from '../../../assets/images/man-working-on-a-laptop-from-side-view.png';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import CompanyImage from '../../../assets/images/facebook-new-logo-change-designboom-02.webp';
import SkillLogo from '../../../assets/images/skills.png';
import JobApplyModal from './JobApplyModal';
import { useState } from 'react';
import { Toaster, toast } from 'sonner';

const JobPostUser = () => {

  const [isModalOpen, setModalOpen] = useState(false);

  const handleApplyClick = () =>{
    setModalOpen(true);
  }

  const handleCloseModal = () =>{
    setModalOpen(false);
  }

  const handleSuccess = () =>{
    toast.success("Applied successfully")
  }

  return (
    <div className="max-w-[960px] h-auto mx-auto mt-10 mb-10 relative">
        <Toaster position="top-center" expand={false} richColors />
        <div className="right-10 bottom-[400px] rounded-xl p-4 fixed shadow-xl">
        <div className="mb-2 font-bold">
          Filter
        </div>
        <div className="mb-2 font-semibold text-[15px]">
          Job Type :
        </div>
        <div className="flex flex-col gap-2 text-[13px] text-slate-400">
          <div className="flex gap-2">
            <div className="flex items-center">
              Remote:
              <input type="checkbox" className="ml-2 mt-1" />
            </div>
            <div className="flex items-center">
              Work-site:
              <input type="checkbox" className="ml-2 mt-1" />
            </div>
          </div>
        </div>
        <div className="mb-2 font-semibold text-[15px] mt-3">
          Employment type :
        </div>
        <div className="flex flex-col gap-2 text-[13px] text-slate-400">
          <div className="flex gap-2">
            <div className="flex items-center">
              Part-time :
              <input type="checkbox" className="ml-2 mt-1" />
            </div>
            <div className="flex items-center">
              Full-time :
              <input type="checkbox" className="ml-2 mt-1" />
            </div>
          </div>
        </div>
        <div>
          <input type="text" className='mt-5 shadow-lg rounded-md  px-3 py-1' placeholder='search by place'/>
        </div>
      </div>
      <div className="flex justify-center items-center w-80 ml-96 mb-5 flex-col">
        <div className="bg-slate-50 w-[600px] font-bold text-xl rounded-lg p-4 shadow-xl">
          <div className='flex items-center'>
          <img src={CompanyImage} alt="company image" className='h-12 rounded-full w-14 border-2 border-slate-400 shadow-lg'/>
          <span className='ml-2 text-slate-600'>ABC company</span>
          </div>
          <div className="font-normal text-lg text-slate-400 mt-5">
            <LocationOnRoundedIcon fontSize='small' className='pl-1 text-black mr-2 mb-1'/>
            Bangalore
            <div className="mt-2 text-base flex items-center">
              <img src={JopType} alt="JobType" className='h-4 ml-1 mr-2'/>
              Remote
            </div>
            <div className="mt-2 text-base">
              <WorkRoundedIcon fontSize='small' className='pl-1 text-black mr-2 mb-1'/>
              Full time</div>
            <div className="mt-2 break-words text-base flex gap-1">
              <img src={SkillLogo} alt="skills" className='h-5'/>
              skills: -javascer, React, Angular, Microservice, Nodejs, MongoDb, Docker
            </div>
            <div onClick={handleApplyClick} className="flex justify-center bg-cyan-300 mt-6 rounded-lg text-white font-semibold hover:font-normal hover:bg-cyan-400 shadow-lg hover:cursor-pointer">
              Apply Now
            </div>
          </div>
        </div>
      </div>
      <JobApplyModal isOpen={isModalOpen} onClose={handleCloseModal} onSuccess={handleSuccess}/>
    </div>
  )
}

export default JobPostUser
