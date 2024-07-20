import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="bg-black w-64 h-screen fixed">
      <div className="mt-40 ml-8">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            isActive
              ? "text-black font-bold rounded-s-xl px-4 py-2 bg-white block text-center"
              : "text-white px-4 py-2 block text-center"
          }
        >
          Dashboard
        </NavLink>
      </div>
      <div className="pt-16 pl-8">
        <NavLink
          to="/admin/usermanagment"
          className={({ isActive }) =>
            isActive ? "text-black font-bold rounded-s-xl px-4 py-2 bg-white block text-center" : "text-white px-4 py-2 block text-center"
          }
        >
          User Management
        </NavLink>
      </div>
      <div className="pt-16 pl-8">
        <NavLink
          to="/admin/recruitermanagment"
          className={({ isActive }) =>
            isActive ? "text-black font-bold rounded-s-xl px-4 py-2 bg-white block text-center" : "text-white px-4 py-2 block text-center"
          }
        >
          Recruiter Management
        </NavLink>
      </div>
      <div className="pt-16 pl-8">
        <NavLink
          to="/admin/repostpostmanagment"
          className={({ isActive }) =>
            isActive ? "text-black font-bold rounded-s-xl px-4 py-2 text-sm bg-white block text-center" : "text-white px-4 py-2 block text-center"
          }
        >
          Repost Post Management
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
