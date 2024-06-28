import JobPostUser from '../../components/User/Home/JobPostUser'
import Navbar from '../../components/User/Home/Navbar'
import SidebarNav from '../../components/User/Home/SidebarNav'
import SidebarProfile from '../../components/User/Home/SidebarProfile'

const JobPostUserPage = () => {
  return (
    <div className='bg-slate-100'>
        <Navbar/>
        <SidebarProfile/>
        <SidebarNav/>
        <JobPostUser/>
    </div>
  )
}

export default JobPostUserPage