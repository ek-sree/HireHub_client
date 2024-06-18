import { Route, Routes } from "react-router-dom";
import UserRoute from "./routes/userRoute";
import RecruiterRouter from "./routes/recruiterRouter";
import AdminRouter from "./routes/adminRouter";

function App() {
  return (
    <Routes>
      <Route path="/*" element={<UserRoute />} />
      <Route path="/recruiter/*" element={<RecruiterRouter />} />
      <Route path="/admin/*" element={<AdminRouter />} />
    </Routes>
  );
}

export default App;
