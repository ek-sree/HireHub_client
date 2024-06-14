import { Avatar } from '@mui/material';
import HireHubLogo from '../../../assets/images/HireHub.png';
import notificationLogo from '../../../assets/images/notificationLogo.jpg';
import searchLogo from '../../../assets/images/searchLogo.webp'

function Navbar() {
  return (
    <div className='shadow-lg flex items-center h-20 px-5'>
      <div className='w-20'>
        <img
          src={HireHubLogo}
          alt="HireHub-Logo"
          className="max-w-full h-12 rounded-3xl w-16 md:w-auto"
        />
      </div>
      <div className='flex items-center flex-grow justify-center'>
        <input
          type="text"
          className='border bg-slate-100 border-slate-400 rounded-lg py-1 px-16'
          placeholder="Search"
        />
        <div className='border border-black'>
            <img src={searchLogo} alt="search-logo" className='h-8'/>
        </div>
      </div>
      <div className='flex items-center'>
        <img
          src={notificationLogo}
          alt="notification-logo"
          className="max-w-full h-auto rounded-3xl w-8 mr-8"
        />
        <Avatar src="/broken-image.jpg" className='mr-5'/>
      </div>
    </div>
  );
}

export default Navbar;
