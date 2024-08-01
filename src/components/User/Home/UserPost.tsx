import ThumbUpRoundedIcon from '@mui/icons-material/ThumbUpRounded';
import ModeCommentRoundedIcon from '@mui/icons-material/ModeCommentRounded';
import ProfileSideNav from './ProfileSideNav';
import SidebarNav from './SidebarNav';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';
import { postAxios } from '../../../constraints/axios/postAxios';
import { postEndpoints } from '../../../constraints/endpoints/postEndpoints';
import Slider from 'react-slick';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const UserPost = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [sameUser, setSameUser] = useState<boolean>(true);
  const token = useSelector((store: RootState) => store.UserAuth.token);
  const userId = useSelector((store:RootState)=>store.UserAuth.userData?._id);

  const {id} = useParams<{id?:string}>()

  useEffect(() => {
    if (userId !== id) {
      setSameUser(false);
    } else {
      setSameUser(true);
    }
  

    if (token && (sameUser !== null)) {
      getUserPosts();
    }
  }, [id, userId, token, sameUser]);


  async function getUserPosts() {
  if (isLoading) return; 
  
  setIsLoading(true);
  try {
    const sentId = sameUser ?  id : userId;
    console.log("=-=-=-=-",sentId);
    
    const response = await postAxios.get(`${postEndpoints.userPosts}?userId=${sentId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (response.data.success) {
      setPosts(response.data.data);
    }
  } catch (error) {
    console.log("Error occurred fetching all data", error);
  } finally {
    setIsLoading(false);
  }
}
  

  // useEffect(() => {
  //   getUserPosts();
  // }, [token,sameUser, id]);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
         <ProfileSideNav/>
         <SidebarNav/>
      {posts.map((post, index) => (
        <div key={index} className="bg-white rounded-lg shadow-lg p-4 mb-10">
          <div className="flex items-center mb-4">
            {/* <img src={post.user.avatar.imageUrl} alt="user" className="rounded-full w-11 h-11 border-4 border-gray-100" /> */}
            <div className="ml-4">
                {/* <div className="font-semibold cursor-pointer">{post.user.name}</div> */}
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
              <ThumbUpRoundedIcon fontSize="small" />
              <span className="text-gray-500">{post.likes.length} Likes</span>
            </div>
            <div className="flex items-center space-x-2">
              <ModeCommentRoundedIcon fontSize="small" />
              <span className="text-gray-500">{post.comments.length} Comments</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default UserPost