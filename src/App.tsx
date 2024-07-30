import { Route, Routes } from "react-router-dom";
import UserRoute from "./routes/userRoute";
import RecruiterRouter from "./routes/recruiterRouter";
import AdminRouter from "./routes/adminRouter";
import { WebRTCProvider, useWebRTC } from "./Contex/ProviderWebRTC";
import VideoCall from "./components/User/Home/VIdeoCall";
import GlobalInCommingCallHandler from "./components/User/Home/IncommingVideCall";


function App() {
  return (
    <WebRTCProvider>
    <Routes>
      <Route path="/*" element={<UserRoute />} />
      <Route path="/recruiter/*" element={<RecruiterRouter />} />
      <Route path="/admin/*" element={<AdminRouter />} />
    </Routes>
    <GlobalVideoCallHandler/>
    <GlobalInCommingCallHandler/>
    </WebRTCProvider>
  );
}

const GlobalVideoCallHandler: React.FC = ()=>{
  const {localStream, remoteStream, inCall, endCall} = useWebRTC();

  if(!inCall)return null;

  return (
    <VideoCall localStream={localStream} remoteStream={remoteStream} onEndCall={endCall}/>
  )
}

export default App;
