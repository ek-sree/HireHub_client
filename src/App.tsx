import { Route, Routes } from "react-router-dom";
import UserRoute from "./routes/userRoute";
import RecruiterRouter from "./routes/recruiterRouter";
import AdminRouter from "./routes/adminRouter";
import { WebRTCProvider, useWebRTC } from "./Contex/ProviderWebRTC";

function App() {
  return (
    <WebRTCProvider>
    <Routes>
      <Route path="/*" element={<UserRoute />} />
      <Route path="/recruiter/*" element={<RecruiterRouter />} />
      <Route path="/admin/*" element={<AdminRouter />} />
    </Routes>
    </WebRTCProvider>
  );
}

export default App;
