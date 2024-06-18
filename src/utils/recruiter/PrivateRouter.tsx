import { useSelector } from "react-redux"
import { RootState } from "../../redux/store/store"
import { Navigate, Outlet } from "react-router-dom";

const PrivateRouter = () => {
  
    const isAuthenticated = useSelector((state: RootState)=>state.RecruiterAuth.isAuthenticated);
console.log(isAuthenticated,"recr");

    return isAuthenticated ? <Outlet/> : <Navigate to='/' replace />
}

export default PrivateRouter