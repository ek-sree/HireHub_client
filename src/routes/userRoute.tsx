import { Route, Routes } from "react-router-dom";
import LoginPage from "../pages/User/LoginPage";
import SignupPage from "../pages/User/SignupPage";
import HomePage from "../pages/User/HomePage";
import OtpPage from "../pages/User/OtpPage";
import PrivateRouter from "../utils/user/PrivateRouter";
import PublicRouter from "../utils/user/PublicRouter";

const UserRoute = () => {
  return (
    <Routes>
      <Route element={<PrivateRouter />}>
        <Route path="/home" element={<HomePage />} />
      </Route>
      <Route element={<PublicRouter />}>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/otp" element={<OtpPage />} />
      </Route>
    </Routes>
  );
};

export default UserRoute;
