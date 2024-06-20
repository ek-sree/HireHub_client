import { Route, Routes } from "react-router-dom"
import DashboardPage from "../pages/admin/DashboardPage";
import LoginPage from "../pages/admin/LoginPage";
import UserManagmentPage from "../pages/admin/UserManagmentPage";
import RecruiterManagmentPages from "../pages/admin/RecruiterManagmentPages";
import PrivateRouter from "../utils/admin/PrivateRouter";
import PublicRouter from "../utils/admin/PublicRouter";



const AdminRouter = () =>{
    return(
        <Routes>
            <Route element={<PublicRouter/>}>
            <Route path="/" element={<LoginPage/>}/>
            </Route>
            <Route element={<PrivateRouter />}>
            <Route path="/dashboard" element={<DashboardPage/>}/>  
            <Route path="/usermanagment" element={<UserManagmentPage/>}/>
            <Route path="/recruitermanagment" element={<RecruiterManagmentPages/>}/>  
            </Route>
        </Routes>
    )
}

export default AdminRouter;