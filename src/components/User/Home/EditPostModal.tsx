import  { FC, useState, useEffect } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { postAxios } from "../../../constraints/axios/postAxios";
import { postEndpoints } from "../../../constraints/endpoints/postEndpoints";
import { toast } from 'sonner';
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { Posts } from '../../../interface/JobInterfaces/IJobInterface';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Posts | null;
  onSuccess: (postId: string, newDescription: string) => void;
}

const EditPostModal: FC<EditModalProps> = ({ isOpen, onClose, post, onSuccess }) => {
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const token = useSelector((store: RootState) => store.UserAuth.token);

  useEffect(() => {
    if (post) {
      setDescription(post.description);
    }
  }, [post]);


  const handleSave = async () => {
    setError('');
    if (!post || !description){
 setError("Description cant be empty")
        return
    }

    setIsLoading(true);
    try {
      const response = await postAxios.put(
        `${postEndpoints.updatePost}/${post._id}`,
        { description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success("Post updated successfully!");
        onSuccess(post._id, description);
        onClose();
      } else {
        toast.error("Failed to update post");
      }
    } catch (error) {
      console.error("Error updating post", error);
      toast.error("An error occurred while updating the post");
    } finally {
      setIsLoading(false);
    }
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  if (!isOpen || !post) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white relative w-1/4 p-6 rounded-lg max-h-90vh overflow-hidden">
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 text-gray-700 text-2xl"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4">Edit Post</h2>
        <div className="mb-4">
          <Slider {...settings}>
            {post.imageUrl.map((image:string, index:number) => (
              <div key={index} className="w-full h-64 flex items-center justify-center">
                <img src={image} alt={`Post image ${index + 1}`} className="max-w-full max-h-full object-contain" />
              </div>
            ))}
          </Slider>
        </div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full h-32 p-2 border rounded resize-none mb-4"
          placeholder="Edit your post description..."
        />
        {error&&(<div className='text-sm text-red-600'>{error}</div>)}
        <div className="flex justify-end">
          <button 
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditPostModal;