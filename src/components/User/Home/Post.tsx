import { useEffect, useState, useRef, useCallback } from 'react';
import Slider from 'react-slick';
import ThumbUpRoundedIcon from '@mui/icons-material/ThumbUpRounded';
import ModeCommentRoundedIcon from '@mui/icons-material/ModeCommentRounded';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { Link } from "react-router-dom";
import CommentModal, { Comment } from "./CommentModal";
import { postAxios } from "../../../constraints/axios/postAxios";
import { postEndpoints } from "../../../constraints/endpoints/postEndpoints";
import DeletePostModal from './DeletePostModal';
import { Posts } from '../../../interface/JobInterfaces/IJobInterface';
import { toast, Toaster } from 'sonner';
import ReportPostModal from './ReportPostModal';
import EditPostModal from './EditPostModal';
import socketService from '../../../socket/socketService';
import { incrementUnseenCount } from '../../../redux/slice/NotificationSlice';
import Shimmer from './Shimmer';



const Post = () => {
  const [posts, setPosts] = useState<Posts[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedPostId, setSelectedPostId] = useState<string>('');
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [dropdowns, setDropdowns] = useState<{ [key: string]: boolean }>({});
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>('');
  const [isReportModal, setIsReportModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Posts | null>(null);

  const token = useSelector((store: RootState) => store.UserAuth.token);
  const userId = useSelector((store: RootState) => store.UserAuth.userData?._id);

  const dispatch = useDispatch();
  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  async function getAllPosts() {
    if (!hasMore) return;
    setLoading(true);
    try {
      const response = await postAxios.get(`${postEndpoints.getPosts}?page=${page}`);
      console.log("response posts", response.data);

      if (response.data.success) {
        const newPosts = response.data.data.map((post: Posts) => ({
          ...post,
          isLiked: post.likes.some((like: any) => like.UserId === userId),
          imagesLoaded: false
        }));
        setPosts(prev => [...prev, ...newPosts]);
        setHasMore(newPosts.length > 0);
        
        newPosts.forEach((post: Posts) => {
          post.imageUrl.forEach((url: string) => {
            const img = new Image();
            img.src = url;
            img.onload = () => {
              setPosts(prevPosts => 
                prevPosts.map(p => 
                  p._id === post._id ? { ...p, imagesLoaded: true } : p
                )
              );
            };
          });
        });
      }
    } catch (error) {
      console.log("Error occurred fetching all data", error);
    } finally {
      setLoading(false);
    }
  }

  const handleLike = async (postId: string, postUser: string) => {
    try {
      const response = await postAxios.post(
        `${postEndpoints.likePost}?postId=${postId}&UserId=${userId}&postUser=${postUser}`
      );
  
      console.log("Like response:", response.data);
  
      if (response.data.success) {
        const likedPostUser = response.data.data.find((post: Post) => post._id === postId)?.postUser || postUser;
        console.log("Liked post user:", likedPostUser);
  
        setPosts(posts.map(post =>
          post._id === postId ? { ...post, likes: [...post.likes, { UserId: userId }], isLiked: true } : post
        ));
        if(likedPostUser !== userId){
          socketService.connect();
          socketService.emitLikeNotification({
            userId: likedPostUser,
            postId: postId,
            likedBy: userId
          });
        }
  
        if (likedPostUser !== userId) {
          dispatch(incrementUnseenCount(likedPostUser));
        }
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleUnlike = async (postId: string) => {
    try {
      const response = await postAxios.post(`${postEndpoints.unlikePost}?postId=${postId}&userId=${userId}`);

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

  const toggleDropdown = (postId: string) => {
    setDropdowns(prev => ({ ...prev, [postId]: !prev[postId] }));
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

  const handleReport = (postId: string) => {
    setIsReportModal(true);
    setSelectedPostId(postId);
  }

  const handleEdit = (postId: string) => {
    const post = posts.find(p => p._id === postId);
    if (post) {
      setSelectedPost(post);
      setIsEditModal(true);
    }
  };

  const handleIsEditModalClose = () => {
    setDropdowns({});
    setIsEditModal(false);
    setSelectedPost(null);
  }

  const handleIsReportModalClose = () => {
    setDropdowns({})
    setIsReportModal(false);
  }

  const handleEditSuccess = (postId: string, newDescription: string) => {
    setPosts(posts.map(post =>
      post._id === postId ? { ...post, description: newDescription } : post
    ));
  };

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

  if (loading && posts.length === 0) {
    return (
      <div className="max-w-2xl mx-auto mt-10">
        {[...Array(3)].map((_, index) => (
          <Shimmer key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <Toaster position="top-center" expand={false} richColors />
      {posts.map((post, index) => (
        <div 
          key={`${post._id}-${index}`} 
          className="bg-white rounded-lg shadow-lg p-4 mb-10"
          ref={index === posts.length - 1 ? lastPostElementRef : null}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              {post.user && post.user.avatar ? (
                <img src={post.user.avatar.imageUrl} alt="user" className="rounded-full w-11 h-11 border-4 border-gray-100" />
              ) : (
                <div className="rounded-full w-11 h-11 bg-gray-200"></div>
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
                  {post.UserId === userId ? (
                    <>
                      <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => handleEdit(post._id)}>Edit</button>
                      <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => handleDelete(post._id, post.imageUrl[0])}>Delete</button>
                    </>
                  ) : (
                    <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => handleReport(post._id)}>Report</button>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="mb-4">
            <p>{post.description}</p>
          </div>
          <div className="post-images">
            {post.imagesLoaded ? (
              <Slider {...settings}>
                {post.imageUrl.map((image, imgIndex) => (
                  <div key={imgIndex}>
                    <img src={image} alt={`Post image ${imgIndex + 1}`} />
                  </div>
                ))}
              </Slider>
            ) : (
              <Shimmer />
            )}
          </div>
          <div className="flex justify-between mt-10 mb-4">
            <div className="flex items-center space-x-2">
              <ThumbUpRoundedIcon
                fontSize="small"
                onClick={() => post.isLiked ? handleUnlike(post._id) : handleLike(post._id, post.UserId)}
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
      {loading && <Shimmer />}
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
      {isReportModal && (
        <ReportPostModal
          isOpen={isReportModal}
          onClose={handleIsReportModalClose}
          postId={selectedPostId}
        />
      )}
      {isEditModal && selectedPost && (
        <EditPostModal
          isOpen={isEditModal}
          onClose={handleIsEditModalClose}
          post={selectedPost}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
}

export default Post;