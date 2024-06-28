import React, { useState } from 'react';
import EditDetails from './EditDetailsModal';

interface UserProfileDetailsProps {
  initialName: string;
}
const UserProfileDetails: React.FC<UserProfileDetailsProps> = ({ initialName }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [name, setName] = useState(initialName);
    
    const handleOpenModal = () => {
        setIsModalOpen(true);
    }
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
    }
    
    const handleSave = (newName: string) => {
        setName(newName);
    }

  return (
    <div className="mt-36 ml-56 flex flex-col">
      <div className="flex items-center justify-between mb-4 text-center">
        <span className="font-semibold text-[50px] text-slate-500 text-center">Sreehari E K</span>
        <button
          className="bg-cyan-300 py-2 px-4 rounded-lg text-white font-semibold inline-block"
          onClick={handleOpenModal}
        >
          Edit
        </button>
      </div>
      <div className="ml-6">
        <span className="font-medium">sreeharisree105@gmail.com</span>
      </div>

      {isModalOpen && (
        <EditDetails
          onClose={handleCloseModal}
          onSave={handleSave}
          currentName={name}
        />
      )}
    </div>
  );
}

export default UserProfileDetails;
