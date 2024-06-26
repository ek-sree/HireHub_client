import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRouter = () => {
  const isAuthenticated = useSelector((state: RootState) => state.UserAuth.token);
console.log("asdadasd");

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRouter;
