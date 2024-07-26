import { Avatar } from '@mui/material';
import { useEffect, useState } from 'react';
import HireHubLogo from '../../../assets/images/HireHub.png';
import notificationLogo from '../../../assets/images/notificationLogo.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../redux/slice/UserSlice';
import { userAxios } from '../../../constraints/axios/userAxios';
import { userEndpoints } from '../../../constraints/endpoints/userEndpoints';
import { toast } from 'sonner';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import { RootState } from '../../../redux/store/store';
import { useDebonceSearch } from '../../../customHook/searchHook';
import socketService from '../../../socket/socketService';

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSticky, setIsSticky] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [profileImg, setProfileImg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  const token = useSelector((store: RootState) => store.UserAuth.token);
  const userId = useSelector((store: RootState) => store.UserAuth.userData?._id);

  const debouncedSearchQuery = useDebonceSearch(searchQuery, 500);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const response = await userAxios.post(`${userEndpoints.logout}?userId=${userId}`);
      if (response.data.success) {
        socketService.disconnect();
        dispatch(logout());
        navigate('/');
      } else {
        toast.error('Error occurred. Please try again!!');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error('Error occurred. Please try again!!');
    }
  };

  const fetchProfileImg = async () => {
    try {
      const response = await userAxios.get(`${userEndpoints.getProfileImages}?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success && response.data.data && response.data.data.imageUrl) {
        setProfileImg(response.data.data.imageUrl);
      } else {
        setProfileImg('/broken-image.jpg');
      }
    } catch (error) {
      console.error('Error fetching profile image:', error);
      setProfileImg('/broken-image.jpg');
    }
  };

  useEffect(() => {
    fetchProfileImg();
  }, [token]);

  const handleMouseEnter = () => {
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    setTimeout(() => {
      setShowDropdown(false);
    }, 1000);
  };

  const fetchSearchResults = async () => {
    if (debouncedSearchQuery && debouncedSearchQuery.length > 0) {
      try {
        const response = await userAxios.get(`${userEndpoints.searchUsers}?searchQuery=${debouncedSearchQuery}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("search data", response.data);

        if (response.data.success) {
          setSearchResults(response.data.data);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  useEffect(() => {
    fetchSearchResults();
  }, [debouncedSearchQuery]);

  return (
    <div className={`shadow-lg flex items-center h-20 px-5 ${isSticky ? 'sticky top-0 bg-white z-50' : ''}`}>
      <div className="w-20">
        <img src={HireHubLogo} alt="HireHub-Logo" className="max-w-full h-12 rounded-3xl w-16 md:w-auto" />
      </div>
      <div className="flex items-center flex-grow justify-between md:justify-center">
        <div className="relative flex-grow max-w-md md:mx-auto">
          <SearchTwoToneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            className="border bg-slate-100 border-slate-400 rounded-lg py-1 pl-10 pr-16 focus:outline-none w-full"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchResults && searchResults.length > 0 ? (
            <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10">
              {searchResults.map((result, index) => (
                <Link to={`/userprofile/${result._id}`}>
                <div key={index} className="p-2 cursor-pointer hover:bg-gray-100 flex items-center">
                  <img src={result.avatar.imageUrl} alt={result.name} className="h-10 w-10 rounded-full mr-3" />
                  <div>
                    <div>{result.name}</div>
                    <div className="text-sm text-gray-500">{result.profileTitle}</div>
                  </div>
                </div>
                </Link>
              ))}
            </div>
          ) : (
            debouncedSearchQuery.length > 0 && (
              <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10 p-2">
                No data found
              </div>
            )
          )}
        </div>
        <div className="ml-3 md:ml-0 flex items-center">
          <img src={notificationLogo} alt="notification-logo" className="h-auto rounded-3xl w-8" />
        </div>
      </div>
      <div className="flex items-center relative ml-4" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <Avatar src={profileImg || '/broken-image.jpg'} className="mr-5 cursor-pointer" />
        {showDropdown && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
            <div className="p-2 cursor-pointer hover:bg-gray-100" onClick={handleLogout}>
              Logout
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
