import AddPhotoAlternateTwoToneIcon from '@mui/icons-material/AddPhotoAlternateTwoTone';
import React, { useRef, useState } from 'react';
import { toast, Toaster } from 'sonner';
import { postAxios } from '../../../constraints/axios/postAxios';
import { postEndpoints } from '../../../constraints/endpoints/postEndpoints';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';
import { CircularProgress } from '@mui/material';

const Postbar = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState<boolean>(false);

  const token = useSelector((store:RootState)=>store.UserAuth.token);
  const userId = useSelector((store:RootState)=>store.UserAuth.userData?._id);

  const [progress, setProgress] = React.useState(0);
  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
    }, 800);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const handleAddImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
    setError('');
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];

    const invalidFiles = files.filter(file => !validImageTypes.includes(file.type));
    if (invalidFiles.length > 0) {
      setError('Only image files (jpg, png, gif) are allowed.');
      return;
    }

    setSelectedImages((prevImages) => [...prevImages, ...files]); 
    setError('');
  };

  const handleRemoveImage = (image: File) => {
    setSelectedImages((prevImages) => prevImages.filter((file) => file !== image));
  };

  const handleText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    setError('');
  };

  const handleSubmit = async () => {
    try {
      setError('');
      if (!selectedImages.length || !text) {
        setError("Can't post empty data, add something");
        return;
      }
      setLoading(true);

      const formData = new FormData();
      formData.append('text', text);
      selectedImages.forEach((image) => {
        formData.append('images', image); 
      });

      const response = await postAxios.post(`${postEndpoints.addPost}?userId=${userId}`, formData, {
        headers:{
          Authorization: `Bearer ${token}`
        }
      });
      console.log("api data",response.data);

      if (response.data.success) {
        toast.success("Post added successfully");
        setText('');
        setSelectedImages([]);
      }
    } catch (error) {
      console.log("Error occurred while adding images", error);
      toast("Error occurred while adding posts");
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
       <Toaster position="top-center" expand={false} richColors />
      <div className="bg-slate-100 mt-6 p-4 rounded-lg shadow-lg">
        <textarea
          value={text}
          onChange={handleText}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="What's on your mind?"
        ></textarea>
        <div className="mt-3 flex justify-between items-center">
          <div
            onClick={handleAddImage}
            className="hover:scale-110 hover:bg-gray-200 p-2 rounded-full transition-transform duration-200 ease-in-out"
          >
            <AddPhotoAlternateTwoToneIcon />
          </div>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
            multiple 
          />
          {loading ? (
            <CircularProgress variant="determinate" value={progress} />
          ) : (
            <button disabled={loading} onClick={handleSubmit} className="bg-cyan-300 text-blue-700 font-semibold px-4 py-2 rounded-md hover:bg-cyan-200 hover:font-normal focus:outline-none focus:ring-2 focus:ring-blue-400">
              Post
            </button>
          )}
        </div>
        {error && <div className='text-red-600 text-sm'>{error}</div>}
        <div className="mt-4 flex flex-wrap gap-4">
          {selectedImages.map((image, index) => (
            <div key={index} className="relative">
              <img src={URL.createObjectURL(image)} alt={`Selected ${index}`} className="w-24 h-24 object-cover rounded-md" />
              <button
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 focus:outline-none"
                onClick={() => handleRemoveImage(image)}
              >
                x
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Postbar;
