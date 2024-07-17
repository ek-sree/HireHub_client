import Slider from "react-slick";
import ThumbUpRoundedIcon from '@mui/icons-material/ThumbUpRounded';
import ModeCommentRoundedIcon from '@mui/icons-material/ModeCommentRounded';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useState } from "react";
import { postAxios } from "../../../constraints/axios/postAxios";
import { postEndpoints } from "../../../constraints/endpoints/postEndpoints";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { Link } from "react-router-dom";
import CommentModal from "./CommentModal";

const Post = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedPostId, setSelectedPostId] = useState<string>('');

  const token = useSelector((store: RootState) => store.UserAuth.token);
  const userId = useSelector((store: RootState)=> store.UserAuth.userData?._id);

  async function getAllPosts() {
    try {
      const response = await postAxios.get(`${postEndpoints.getPosts}?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("api res",response.data);
      
      if (response.data.success) {
        setPosts((prev) => [...prev, ...response.data.data.map(post => ({
          ...post,
          isLiked: post.likes.some(like => like.userId === userId)
        }))]);
      }
    } catch (error) {
      console.log("Error occurred fetching all data", error);
    }
  }

  const handleLike = async (postId: string) => {
    try {
      const response = await postAxios.post(`${postEndpoints.likePost}?postId=${postId}&userId=${userId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setPosts(posts.map(post => 
          post._id === postId ? { ...post, likes: [...post.likes, { userId }], isLiked: true } : post
        ));
      }
    } catch (error) {
      console.log("error liking post", error);
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
          post._id === postId ? { ...post, likes: post.likes.filter(like => like.userId !== userId), isLiked: false } : post
        ));
      }
    } catch (error) {
      console.log("error unliking post", error);
    }
  }

  const handleCommentModal = (postId) => {
    setSelectedPostId(postId);
    setIsModalOpen(true);
  }

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight) {
      setPage(prev => prev + 1);
    }
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [page]);

  useEffect(() => {
    if (token) {
      getAllPosts();
    }
  }, [page]);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      {posts.map((post, index) => (
        <div key={index} className="bg-white rounded-lg shadow-lg p-4 mb-10">
          <div className="flex items-center mb-4">
            <img src={post.user.avatar.imageUrl} alt="user" className="rounded-full w-11 h-11 border-4 border-gray-100" />
            <div className="ml-4">
              <Link to={`/userprofile/${post.UserId}`}>
                <div className="font-semibold cursor-pointer">{post.user.name}</div>
              </Link>
              <div className="text-gray-500 text-sm">{new Date(post.created_at).toLocaleString()}</div>
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
              <ModeCommentRoundedIcon fontSize="small" onClick={() => handleCommentModal(post._id)} />
              <span className="text-gray-500">{post.comments.length} Comments</span>
            </div>
          </div>
        </div>
      ))}
      {isModalOpen && (
        <CommentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          postId={selectedPostId}
        />
      )}
    </div>
  );
}

export default Post;
