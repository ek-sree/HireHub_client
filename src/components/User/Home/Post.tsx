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

const Post = () => {
  const [posts, setPosts] = useState([]);
  const token = useSelector((store: RootState) => store.UserAuth.token);

  async function getAllPosts() {
    try {
      const response = await postAxios.get(postEndpoints.getPosts, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setPosts(response.data.data);
      }
    } catch (error) {
      console.log("Error occurred fetching all data", error);
    }
  }

  useEffect(() => {
    getAllPosts();
  }, [token]);

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

export default Post;