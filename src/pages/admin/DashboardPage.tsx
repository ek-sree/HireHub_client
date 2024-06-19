import Dashboard from '../../components/admin/Home/Dashboard'
import Navbar from '../../components/admin/Home/Navbar'
import Sidebar from '../../components/admin/Home/SideBar'

const DashboardPage = () => {
  return (
    <div>
      <Navbar/>
      <Sidebar/>
        <Dashboard/>
    </div>
  )
}

export default DashboardPage