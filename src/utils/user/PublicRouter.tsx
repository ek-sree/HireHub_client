import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { Navigate, Outlet } from "react-router-dom";

const PublicRouter = () => {
  const isAuthenticated = useSelector((state: RootState) => state.UserAuth.isAuthenticated);

  return isAuthenticated ? <Navigate to="/home" replace /> : <Outlet />;
};

export default PublicRouter;
