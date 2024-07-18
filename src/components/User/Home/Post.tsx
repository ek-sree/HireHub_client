import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import ThumbUpRoundedIcon from '@mui/icons-material/ThumbUpRounded';
import ModeCommentRoundedIcon from '@mui/icons-material/ModeCommentRounded';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { Link } from "react-router-dom";
import CommentModal, { Comment } from "./CommentModal";
import { postAxios } from "../../../constraints/axios/postAxios";
import { postEndpoints } from "../../../constraints/endpoints/postEndpoints";
import DeletePostModal from './DeletePostModal';
import { Posts } from '../../../interface/JobInterfaces/IJobInterface';
import { toast, Toaster } from 'sonner';

const Post = () => {
  const [posts, setPosts] = useState<Posts[]>([]);
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedPostId, setSelectedPostId] = useState<string>('');
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [dropdowns, setDropdowns] = useState<{ [key: string]: boolean }>({});
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>('');

  const token = useSelector((store: RootState) => store.UserAuth.token);
  const userId = useSelector((store: RootState) => store.UserAuth.userData?._id);

  async function getAllPosts() {
    try {
      const response = await postAxios.get(`${postEndpoints.getPosts}?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("response post", response.data);

      if (response.data.success) {
        setPosts(prev => [
          ...prev, 
          ...response.data.data.map((post: Posts) => ({
            ...post,
            isLiked: post.likes.some((like: any) => like.UserId === userId)
          }))
        ]);
      }
    } catch (error) {
      console.log("Error occurred fetching all data", error);
    }
  }

  const handleLike = async (postId: string) => {
    try {
      const response = await postAxios.post(`${postEndpoints.likePost}?postId=${postId}&UserId=${userId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setPosts(posts.map(post =>
          post._id === postId ? { ...post, likes: [...post.likes, { UserId: userId }], isLiked: true } : post
        ));
      }
    } catch (error) {
      console.log("Error liking post", error);
    }
  }

  const handleUnlike = async (postId: string) => {
    try {
      const response = await postAxios.post(`${postEndpoints.unlikePost}?postId=${postId}&userId=${userId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setPosts(posts.map(post =>
          post._id === postId ? { ...post, likes: post.likes.filter((like: any) => like.UserId !== userId), isLiked: false } : post
        ));
      }
    } catch (error) {
      console.log("Error unliking post", error);
    }
  }

  const handleCommentModal = (postId: string, UserId: string) => {
    setSelectedPostId(postId);
    setSelectedUserId(UserId);
    setIsModalOpen(true);
  }

  const handleCloseModal = (newComments: Comment[]) => {
    setIsModalOpen(false);
    setPosts(posts.map(post =>
      post._id === selectedPostId ? {
        ...post,
        comments: newComments.map((comment, index) => ({
          ...comment,
          id: `${comment.id}-${index}`
        }))
      } : post
    ));
  }

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight) {
      setPage(prev => prev + 1);
    }
  }

  const toggleDropdown = (postId: string) => {
    setDropdowns(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleEdit = (postId: string) => {
    console.log("Edit post", postId);
  };

  const handleDelete = (postId: string, imageUrl: string) => {
    setDeleteModal(true);
    setSelectedPostId(postId);
    setSelectedImageUrl(imageUrl);
  };

  const closeDeleteModal = () => {
    setDropdowns({})
    setDeleteModal(false);
  };

  const handleOnSuccess = (deletedPostId: string) => {
    setDropdowns({});
    setPosts(prevPosts => prevPosts.filter(post => post._id !== deletedPostId));
    toast.success("Post deleted successfully !!")
    setDeleteModal(false);
  }


  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [page]);

  useEffect(() => {
    if (token) {
      getAllPosts();
    }
  }, [page, token]);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
               <Toaster position="top-center" expand={false} richColors />
      {posts.map((post, index) => (
        <div key={`${post._id}-${index}`} className="bg-white rounded-lg shadow-lg p-4 mb-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              {post.user && post.user.avatar && (
                <img src={post.user.avatar.imageUrl} alt="user" className="rounded-full w-11 h-11 border-4 border-gray-100" />
              )}
              <div className="ml-4">
                <Link to={`/userprofile/${post.UserId}`}>
                  <div className="font-semibold cursor-pointer">{post.user?.name || "Unknown User"}</div>
                </Link>
                <div className="text-gray-500 text-sm">{new Date(post.created_at).toLocaleString()}</div>
              </div>
            </div>
            <div className="relative">
              <MoreVertIcon className="cursor-pointer" onClick={() => toggleDropdown(post._id)} />
              {dropdowns[post._id] && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-50">
                  <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => handleEdit(post._id)}>Edit</button>
                  <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => handleDelete(post._id, post.imageUrl)}>Delete</button>
                </div>
              )}
            </div>
          </div>
          <div className="mb-4">
            <p>{post.description}</p>
          </div>
          <div className="post-images">
            <Slider {...settings}>
              {post.imageUrl.map((image, imgIndex) => (
                <div key={imgIndex}>
                  <img src={image} alt={`Post image ${imgIndex + 1}`} />
                </div>
              ))}
            </Slider>
          </div>
          <div className="flex justify-between mt-10 mb-4">
            <div className="flex items-center space-x-2">
              <ThumbUpRoundedIcon
                fontSize="small"
                onClick={() => post.isLiked ? handleUnlike(post._id) : handleLike(post._id)}
                className={post.isLiked ? "text-blue-500 cursor-pointer" : "text-gray-500 cursor-pointer"}
              />
              <span className="text-gray-500">{post.likes.length} Likes</span>
            </div>
            <div className="flex items-center space-x-2">
              <ModeCommentRoundedIcon fontSize="small" onClick={() => handleCommentModal(post._id, post.UserId)} />
              <span className="text-gray-500">{post.comments.length} Comments</span>
            </div>
          </div>
        </div>
      ))}
      {isModalOpen && (
        <CommentModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          postId={selectedPostId}
          UserId={selectedUserId}
        />
      )}
      {deleteModal && (
        <DeletePostModal
          isOpen={deleteModal}
          onClose={closeDeleteModal}
          postId={selectedPostId}
          imageUrl={selectedImageUrl}
          onSuccess={handleOnSuccess}
        />
      )}
    </div>
  );
}

export default Post;
