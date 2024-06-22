
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

const PublicRouter = () => {
console.log('uhnyhn');
const role = Cookies.get('role');
if(role==="user"){
  return  <Navigate to="/home" replace /> ;
}else if(role == 'recruiter'){
  return  <Navigate to="/recruiter/home" replace /> ;

}
return <Outlet/>
};

export default PublicRouter;
