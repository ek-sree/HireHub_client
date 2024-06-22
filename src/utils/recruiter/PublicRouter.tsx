import { useSelector } from "react-redux"
import { RootState } from "../../redux/store/store"
import { Navigate, Outlet } from "react-router-dom";


const PublicRouter = () =>{
    const isAuthenticated = useSelector((state: RootState)=> state.RecruiterAuth.isAuthenticated);

    console.log(isAuthenticated,"reeee");
    
    return isAuthenticated ? <Navigate to='/recruiter/home' replace/> : <Outlet/>
}

export default PublicRouter;
