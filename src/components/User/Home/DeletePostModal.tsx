import React, { useState } from 'react';
import { postAxios } from '../../../constraints/axios/postAxios';
import { postEndpoints } from '../../../constraints/endpoints/postEndpoints';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';
import { Posts } from '../../../interface/JobInterfaces/IJobInterface';
import { CircularProgress } from '@mui/material';

interface DeletePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId:string;
  imageUrl:string;
  onSuccess: (deletedPostId: Posts[]) => void;
}

const DeletePostModal: React.FC<DeletePostModalProps> = ({ isOpen, onClose, postId, imageUrl, onSuccess }) => {

    const [loading, setLoading] = useState<boolean>(false);
    const [progress, setProgress] = React.useState(0);


    React.useEffect(() => {
        const timer = setInterval(() => {
          setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
        }, 800);
    
        return () => {
          clearInterval(timer);
        };
      }, []);

    const handleConfirmDelete=async()=>{
        setLoading(true)
        const response = await postAxios.delete(`${postEndpoints.deletePost}?postId=${postId}&imageUrl=${imageUrl}`)
        console.log("delete post api",response.data);
        
        if(response.data.success){
            setLoading(false);
            onSuccess(response.data.data);
            onClose()
        }
    }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full transform transition-all duration-300 ease-in-out">
        <h2 className="text-xl font-semibold mb-4 justify-center flex">Confirm Delete</h2>
        <p className="mb-4">Are you sure you want to delete this post?</p>
        <div className="flex justify-end space-x-4">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          {loading? <CircularProgress variant="determinate" value={progress} />:
          <button
          disabled={loading}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={handleConfirmDelete}
          >
            Delete
          </button>
}
        </div>
      </div>
    </div>
  );
};

export default DeletePostModal;
