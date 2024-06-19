import { Route, Routes } from "react-router-dom"
import DashboardPage from "../pages/admin/DashboardPage";
import LoginPage from "../pages/admin/LoginPage";
import UserManagmentPage from "../pages/admin/UserManagmentPage";
import Sidebar from "../components/admin/Home/SideBar";



const AdminRouter = () =>{
    return(
        <Routes>
            <Route path="/" element={<LoginPage/>}/>
            <Route path="/dashboard" element={<DashboardPage/>}/>  
            <Route path="/usermanagment" element={<UserManagmentPage/>}/>  
            <Route path="/side" element={<Sidebar/>}/>  
        </Routes>
    )
}

export default AdminRouter;