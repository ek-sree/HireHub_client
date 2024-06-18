import { Route, Routes } from "react-router-dom"
import DashboardPage from "../pages/admin/DashboardPage";
import LoginPage from "../pages/admin/LoginPage";



const AdminRouter = () =>{
    return(
        <Routes>
            <Route path="/" element={<LoginPage/>}/>
            <Route path="/dashboard" element={<DashboardPage/>}/>    
        </Routes>
    )
}

export default AdminRouter;