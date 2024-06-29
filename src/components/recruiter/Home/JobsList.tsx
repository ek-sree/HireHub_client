import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import JopType from '../../../assets/images/man-working-on-a-laptop-from-side-view.png';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import SkillLogo from '../../../assets/images/skills.png';
import JobpostEditModal from './JobpostEditModal';
import { useState } from 'react';
import { Toaster} from 'sonner';
import { Link } from 'react-router-dom';
import AddNewJob from './AddNewJob';

const JobsList = () => {

    const [isModalOpen, setModalOpen] = useState(false);
    const [isNewJobModal, setNewJobModal] = useState(false);


    const handleNewJobModal = () => {
        setNewJobModal(true);
    }


    const handleNewJobModalClose = () => {
        setNewJobModal(false);
    }

    const handleCloseModal = () => {
        setModalOpen(false);
    }

    const handleModalOpen = () => {
        setModalOpen(true);
    }



  return (
    <div className="relative mt-16">
         <Toaster position="top-center" expand={false} richColors />
      <button onClick={handleNewJobModal} className="absolute bottom-[578px] right-5 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg">
        Add New Job
      </button>
      <div className="flex flex-wrap gap-4 p-4">
        <div className="bg-slate-200 w-72 h-auto rounded-lg p-4 shadow-lg">
          <div className="text-center font-semibold">
            ABC Company
          </div>
          <div className="mt-4 text-center text-sm text-slate-600">
            Full Stack Developer
          </div>
          <div className="mt-3 flex items-center text-sm text-slate-500">
            <LocationOnRoundedIcon fontSize='small' />
            <span className='ml-1'>Bangalore</span>
          </div>
          <div className="mt-3 flex items-center text-sm text-slate-500">
            <img src={JopType} alt="job type" className='h-4 w-4 mr-1' />
            <span>Remote</span>
          </div>
          <div className="mt-3 flex items-center text-sm text-slate-500">
            <WorkRoundedIcon fontSize='small' />
            <span className='ml-1'>Full-time</span>
          </div>
          <div className="mt-3 flex items-center text-sm text-slate-500 flex-wrap">
            <img src={SkillLogo} alt="skill logo" className='h-4 w-4 mr-1' />
            <span>Skills: </span>
            <span className="ml-1">JavaScript, React, Node.js, MongoDB, Docker, Microservices</span>
          </div>
        </div>
        {/* Add more job cards here as needed */}
        <div className="bg-slate-200 w-72 h-auto rounded-lg p-4 shadow-md">
          <div className="text-center font-semibold">
            XYZ Company
          </div>
          <div className="mt-4 text-center text-sm text-slate-500">
            Backend Developer
          </div>
          <div className="mt-3 flex items-center text-sm text-slate-500">
            <LocationOnRoundedIcon fontSize='small' />
            <span className='ml-1'>San Francisco</span>
          </div>
          <div className="mt-3 flex items-center text-sm text-slate-500">
            <img src={JopType} alt="job type" className='h-4 w-4 mr-1' />
            <span>On-site</span>
          </div>
          <div className="mt-3 flex items-center text-sm text-slate-500">
            <WorkRoundedIcon fontSize='small' />
            <span className='ml-1'>Part-time</span>
          </div>
          <div className="mt-3 flex items-center text-sm text-slate-500 flex-wrap">
            <img src={SkillLogo} alt="skill logo" className='h-4 w-4 mr-1' />
            <span>Skills required: </span>
            <span className="ml-1">Python, Django, PostgreSQL, Docker, REST API</span>
          </div>
        </div>
        {/* Add more job cards if needed */}
        <div className="bg-slate-200 w-72 h-auto rounded-lg p-4 shadow-lg">
          <div className="text-center font-semibold">
            ABC Company
          </div>
          <div className="mt-4 text-center text-sm text-slate-500">
            Full Stack Developer
          </div>
          <div className="mt-3 flex items-center text-sm text-slate-500">
            <LocationOnRoundedIcon fontSize='small' />
            <span className='ml-1'>Bangalore</span>
          </div>
          <div className="mt-3 flex items-center text-sm text-slate-500">
            <img src={JopType} alt="job type" className='h-4 w-4 mr-1' />
            <span>Remote</span>
          </div>
          <div className="mt-3 flex items-center text-sm text-slate-500">
            <WorkRoundedIcon fontSize='small' />
            <span className='ml-1'>Full-time</span>
          </div>
          <div className="mt-3 flex items-center text-sm text-slate-500 flex-wrap">
            <img src={SkillLogo} alt="skill logo" className='h-4 w-4 mr-1' />
            <span>Skills: </span>
            <span className="ml-1">JavaScript, React, Node.js, MongoDB, Docker, Microservices</span>
          </div>
        </div>
        <div className="bg-slate-200 w-72 h-auto rounded-lg p-4 shadow-lg">
          <div className="text-center font-semibold">
            ABC Company
          </div>
          <div className="mt-4 text-center text-sm text-slate-500">
            Full Stack Developer
          </div>
          <div className="mt-3 flex items-center text-sm text-slate-500">
            <LocationOnRoundedIcon fontSize='small' />
            <span className='ml-1'>Bangalore</span>
          </div>
          <div className="mt-3 flex items-center text-sm text-slate-500">
            <img src={JopType} alt="job type" className='h-4 w-4 mr-1' />
            <span>Remote</span>
          </div>
          <div className="mt-3 flex items-center text-sm text-slate-500">
            <WorkRoundedIcon fontSize='small' />
            <span className='ml-1'>Full-time</span>
          </div>
          <div className="mt-3 flex items-center text-sm text-slate-500 flex-wrap">
            <img src={SkillLogo} alt="skill logo" className='h-4 w-4 mr-1' />
            <span>Skills: </span>
            <span className="ml-1">JavaScript, React, Node.js, MongoDB, Docker, Microservices</span>
          </div>
        </div>
        <div className="bg-slate-200 w-72 h-auto rounded-lg p-4 shadow-lg">
          <div className="text-center font-semibold">
            ABC Company
          </div>
          <div className="mt-4 text-center text-sm text-slate-500">
            Full Stack Developer
          </div>
          <div className="mt-3 flex items-center text-sm text-slate-500">
            <LocationOnRoundedIcon fontSize='small' />
            <span className='ml-1'>Bangalore</span>
          </div>
          <div className="mt-3 flex items-center text-sm text-slate-500">
            <img src={JopType} alt="job type" className='h-4 w-4 mr-1' />
            <span>Remote</span>
          </div>
          <div className="mt-3 flex items-center text-sm text-slate-500">
            <WorkRoundedIcon fontSize='small' />
            <span className='ml-1'>Full-time</span>
          </div>
          <div className="mt-3 flex items-center text-sm text-slate-500 flex-wrap">
            <img src={SkillLogo} alt="skill logo" className='h-4 w-4 mr-1' />
            <span>Skills: </span>
            <span className="ml-1">JavaScript, React, Node.js, MongoDB, Docker, Microservices</span>
          </div>
        </div>
        <div className="bg-slate-200 w-72 h-auto rounded-lg p-4 shadow-lg">
          <div className="text-center font-semibold">
            ABC Company
          </div>
          <div className="mt-4 text-center text-sm text-slate-500">
            Full Stack Developer
          </div>
          <div className="mt-3 flex items-center text-sm text-slate-500">
            <LocationOnRoundedIcon fontSize='small' />
            <span className='ml-1'>Bangalore</span>
          </div>
          <div className="mt-3 flex items-center text-sm text-slate-500">
            <img src={JopType} alt="job type" className='h-4 w-4 mr-1' />
            <span>Remote</span>
          </div>
          <div className="mt-3 flex items-center text-sm text-slate-500">
            <WorkRoundedIcon fontSize='small' />
            <span className='ml-1'>Full-time</span>
          </div>
          <div className="mt-3 flex items-center text-sm text-slate-500 flex-wrap">
            <img src={SkillLogo} alt="skill logo" className='h-4 w-4 mr-1' />
            <span>Skills: </span>
            <span className="ml-1">JavaScript, React, Node.js, MongoDB, Docker, Microservices</span>
          </div>
        <div className='flex justify-between mt-6'>
            <span onClick={handleModalOpen} className='bg-blue-500 px-2 rounded-md text-white hover:cursor-pointer hover:bg-blue-600'>Edit</span>
           <Link to='/recruiter/viewapplication'><span className='bg-blue-500 px-2 rounded-md text-white hover:cursor-pointer hover:bg-blue-600'>View application</span></Link> 
        </div>
        </div>
      </div>
      <JobpostEditModal isOpen={isModalOpen} onClose={handleCloseModal} />
      <AddNewJob isNewJobModal={isNewJobModal} onClose={handleNewJobModalClose} />    </div>
  )
}

export default JobsList;