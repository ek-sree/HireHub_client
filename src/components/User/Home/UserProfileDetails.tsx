import  { useState } from 'react';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import EditDetailsModal from './EditDetailsModal';
import TitleModal from './TitleModal';



const UserProfileDetails = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTitleMOdalOpen, setTitleModalOpen] = useState(false);
    const [title, setTitle] = useState('');

    const handleOpenModal = () => {
        setIsModalOpen(true);
    }
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
    }

    const handleTitleModal = ()=>{
      setTitleModalOpen(true);
    }

    const handleCloseTitleModal = () => {
      setTitleModalOpen(false);
    }

    const onTitleData = (data:string)=>{
      setTitle(data);
    }

  return (
    <div className="mt-36 flex flex-col items-center">
      <div className="mb-4 text-center">
        <span className="font-semibold text-3xl text-slate-500">Sreehari E K</span>
      </div>
      <div className="flex items-center mb-2 gap-3">
        {!title? <div className='bg-slate-200 py-1 px-2 rounded-md shadow-md hover:cursor-pointer hover:bg-slate-300' onClick={handleTitleModal}>Add title</div> :
        <span className="font-medium">{title}</span>}
      </div>
        <EditRoundedIcon onClick={handleOpenModal} className="cursor-pointer mr-2" />

      {isModalOpen && (
        <EditDetailsModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
      {isTitleMOdalOpen && (
        <TitleModal
        isOpen={isTitleMOdalOpen}
        onClose={handleCloseTitleModal}
        titleData={onTitleData}
        />
      )}
    </div>
  );
}

export default UserProfileDetails;
