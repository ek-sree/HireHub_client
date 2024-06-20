import { useSelector } from "react-redux"
import { RootState } from "../../../redux/store/store"

function Dashboard() {

  const adminData = useSelector((state: RootState)=> state.AdminAuth.adminData)
  const isAuthenticated = useSelector((state: RootState) => state.AdminAuth.isAuthenticated)
console.log("Admin is AUthenticated ?", isAuthenticated);

  return (
    <div className="pl-72">
        <p className="pl-96">dashboard</p>
        <p>Admin {adminData?.email}</p>
    </div>
  )
}

export default Dashboard