import { Route, Routes } from "react-router-dom"
import UserRoute from "./routes/userRoute"

function App() {

  return (
    <>
    <Routes>
      <Route path="/*" element={<UserRoute/>}/>
    </Routes>
    </>
  )
}

export default App
