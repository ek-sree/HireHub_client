import Slider from 'react-slick';
import HireHub from '../../../assets/images/HireHub.png';
import UserImg from '../../../assets/images/user.png';
import { postAxios } from '../../../constraints/axios/postAxios';
import { postEndpoints } from '../../../constraints/endpoints/postEndpoints';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';
import { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { userAxios } from '../../../constraints/axios/userAxios';
import { userEndpoints } from '../../../constraints/endpoints/userEndpoints';
import UserInfo from './UserInfo';

const UserProfile = () => {
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [profileImg, setProfileImg] = useState<string>(UserImg);
  const [coverImg, setCoverImg] = useState<string>(HireHub);
  const [posts, setPosts] = useState([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [userId, setUserId] = useState('');
  const token = useSelector((store: RootState) => store.RecruiterAuth.token);

  const { id } = useParams<{ id?: string }>();
  console.log("params id", id);

  async function userDetails() {
    try {
      const response = await userAxios.get(`${userEndpoints.viewDetails}?userId=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        setName(response.data.details.name);
        setTitle(response.data.details.title);
      }
      if (response.status === 403) {
        toast.error("Token expired login again");
      }
    } catch (error) {
      toast.error("Error occurred, please log in after some time.");
    }
  }

  async function getUserPosts() {
    try {
      const response = await postAxios.get(`${postEndpoints.userPosts}?userId=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("api data post of user", response.data);

      if (response.data.success) {
        setPosts(response.data.data);
      }
    } catch (error) {
      console.log("Error occurred fetching all data", error);
    }
  }

  async function showImage() {
    try {
      const response = await userAxios.get(`${userEndpoints.getProfileImages}?userId=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        const imageUrl = response.data.data?.imageUrl || UserImg;
        setProfileImg(imageUrl);
      } else {
        setProfileImg(UserImg);
      }
    } catch (error) {
      console.error("Error fetching profile image:", error);
      setProfileImg(UserImg);
    }
  }

  async function showCoverImg() {
    try {
      const response = await userAxios.get(`${userEndpoints.getCoverImage}?userId=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.success) {
        const imageUrl = response.data.data?.imageUrl || HireHub;
        setCoverImg(imageUrl);
      } else {
        setCoverImg(HireHub);
      }
    } catch (error) {
      console.error("Error fetching cover image:", error);
      setCoverImg(HireHub);
    }
  }

  async function userSkills() {
    try {
      const response = await userAxios.get(`${userEndpoints.userSkills}?userId=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        setSkills(response.data.skills);
      }
    } catch (error) {
      console.error("Error fetching user skills:", error);
    }
  }

  const toggleShowAllSkills = () => {
    setShowAllSkills(prevShowSkills => !prevShowSkills);
  };

  const skillsToShow = showAllSkills ? skills : skills.slice(0, 3);

  const handleInfoModal = (id: string) => {
    setIsModalOpen(!isModalOpen);
    setUserId(id);
  }

  useEffect(() => {
    getUserPosts();
    userDetails();
    showCoverImg();
    showImage();
    userSkills();
  }, [token]);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <NavLink to='/recruiter/allCandidates'>
        <div className="ml-4 bg-blue-400 text-white w-24 p-3 rounded-lg hover:bg-blue-700 cursor-pointer border border-blue-300 shadow-md transition duration-300">
          <span className="flex items-center justify-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            Back
          </span>
        </div>
      </NavLink>

      <div className="bg-white p-6 flex flex-col items-center shadow-md rounded-lg">
        <div
          className="h-48 bg-cover bg-center rounded-lg w-full max-w-screen-md flex items-center justify-center"
          style={{ backgroundImage: `url(${coverImg})` }}
        >
          <img
            src={profileImg}
            alt="Profile"
            className="h-24 w-24 rounded-full border-4 border-white mt-52"
          />
        </div>

        <div className="text-center mt-16 mb-3">
          <h1 className="text-2xl font-bold">{name}</h1>
          <p className="text-gray-600">{title}</p>
        </div>
        <div onClick={() => handleInfoModal(id)} className="text-blue-600 italic mb-3 cursor-pointer">
          more details *
        </div>
        <div className="border-2 border-blue-500 w-1/4 flex text-center justify-center py-2 rounded-lg hover:bg-blue-100 font-semibold text-lg cursor-pointer shadow-md transition duration-300">
          Message
        </div>

        <div className="max-w-2xl w-full mx-auto mb-8 bg-white mt-10 p-4 rounded-lg shadow-lg">
          <div className="text-center font-semibold font-sans mb-4">User Skills</div>
          <div className="space-y-4">
            {skills.length > 0 ? (
              skillsToShow.map((skill, index) => (
                <div key={index} className="px-4 py-2 bg-blue-100 rounded-lg shadow-md">
                  <span className="text-gray-700">{skill}</span>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500">
                <p>No skills added yet</p>
              </div>
            )}
            {skills.length > 3 && (
              <div onClick={toggleShowAllSkills} className="mt-5 py-2 text-center w-full bg-blue-500 rounded-xl text-white font-semibold hover:bg-blue-700 cursor-pointer transition duration-300">
                {showAllSkills ? "Show Less 🔼" : "Show More 🔽"}
              </div>
            )}
          </div>
        </div>

        <div className="max-w-2xl w-full mx-auto mt-10">
          {posts.map((post, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-4 mb-10">
              <div className="flex items-center mb-4">
                <div className="ml-4">
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
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <UserInfo
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          userId={userId}
        />
      )}
    </div>
  );
};

export default UserProfile;
