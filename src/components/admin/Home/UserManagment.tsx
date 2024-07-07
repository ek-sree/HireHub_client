import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { Toaster, toast } from "sonner";
import Sidebar from "./SideBar";
import { adminAxios } from "../../../constraints/axios/adminAxios";
import { adminEndpoints } from "../../../constraints/endpoints/adminEndpoints";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { Button, IconButton } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { LinearProgress, Stack } from "@mui/material";
import { useDebonceSearch } from "../../../customHook/searchHook";

interface IUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  isBlocked: boolean;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [defaultUser, setDefaultUser] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState("A-Z");
  const [statusFilter, setStatusFilter] = useState("All");

  const token = useSelector((state: RootState) => state.AdminAuth.token);

  const [debouncedSearchQuery] = useDebonceSearch(searchQuery, 500);

  const filterUsers = (users: IUser[], status: string) => {
    if (status === "All") {
      return users;
    } else {
      const isBlocked = status === "Blocked";
      return users.filter(user => user.isBlocked === isBlocked);
    }
  };

  const getAllUsers = async (page = 1) => {
    try {
      const response = await adminAxios.get(
        `${adminEndpoints.getUser}?page=${page}&limit=2`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("res api", response);

      if (response.data.success === false) {
        toast.error(response.data.message);
      } else {
        const fetchedUsers = response.data.user_data || [];
        const filteredUsers = filterUsers(fetchedUsers, statusFilter);
        setUsers(filteredUsers);
        setTotalPages(Math.ceil(response.data.totalUsers / 2));
        setDefaultUser(filteredUsers);
      }
    } catch (error) {
      console.log("Error occurred fetching all users", error);
      toast.error("An error occurred, please try again later!!");
    }
  };

  const blockUser = async (userId: string) => {
    try {
      const response = await adminAxios.put(
        `${adminEndpoints.blockUser}/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("response of block user", response);

      if (response.data.success === true) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, isBlocked: !user.isBlocked } : user
          )
        );
        toast.success(response.data.message);
      }
    } catch (error) {
      console.log("Error occurred blocking users", error);
      toast.error("An error occurred, please try again later!!");
    }
  };

  const fetchUserBySearch = async () => {
    try {
      setLoading(true);
      const response = await adminAxios.get(
        `${adminEndpoints.searchUser}?search=${debouncedSearchQuery}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoading(false);

      console.log("searched response", response);

      if (response.data.success) {
        const searchedUsers = response.data.users;
        const filteredUsers = filterUsers(searchedUsers, statusFilter);
        setUsers(filteredUsers);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log("Error occurred searching user list", error);
      toast.error("An error occurred, please try again");
    }
  };

  useEffect(() => {
    if (debouncedSearchQuery) {
      fetchUserBySearch();
    } else {
      setUsers(defaultUser);
    }
  }, [debouncedSearchQuery, token, statusFilter]);

  useEffect(() => {
    getAllUsers(currentPage);
  }, [currentPage, statusFilter]);

  const getItemProps = (index: number) => ({
    variant: currentPage === index ? "filled" : "text",
    color: currentPage === index ? "green" : "black",
    onClick: () => setCurrentPage(index),
    className: "rounded-full",
    size: currentPage === index ? "lg" : "md",
  });

  const next = () => {
    if (currentPage === totalPages) return;
    setCurrentPage(currentPage + 1);
  };

  const prev = () => {
    if (currentPage === 1) return;
    setCurrentPage(currentPage - 1);
  };

  const sortUsers = (order: string) => {
    const sortedUsers = [...users].sort((a, b) => {
      if (order === "A-Z") {
        return a.name.localeCompare(b.name);
      } else if (order === "Z-A") {
        return b.name.localeCompare(a.name);
      }
      return 0;
    });
    setUsers(sortedUsers);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Sidebar />
      <Toaster position="top-center" expand={false} richColors />
      <div className="container mx-auto mt-20 px-4">
        <h2 className="text-2xl font-bold text-center mb-8">User Management</h2>
        <div className="flex justify-center">
          <div className="w-full max-w-4xl">
            <div className="mb-6">
              <input
                type="text"
                name=""
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 border rounded-lg w-full max-w-md"
                placeholder="Search by name"
              />
            </div>
            <div className="flex justify-end mb-6">
              <select
                value={sortOrder}
                onChange={(e) => {
                  setSortOrder(e.target.value);
                  sortUsers(e.target.value);
                }}
                className="px-4 py-2 border rounded-lg mr-4"
              >
                <option value="A-Z">A-Z</option>
                <option value="Z-A">Z-A</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="All">All</option>
                <option value="Blocked">Blocked</option>
                <option value="Unblocked">Unblocked</option>
              </select>
            </div>
            {loading ? (
              <Stack sx={{ width: '100%', color: 'grey.500' }} spacing={2}>
                <LinearProgress color="secondary" />
                <LinearProgress color="success" />
                <LinearProgress color="inherit" />
              </Stack>
            ) : (
              <>
                {users.length === 0 ? (
                  <p className="text-center text-gray-600">No users found.</p>
                ) : (
                  <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    <table className="min-w-full bg-white">
                      <thead>
                        <tr className="w-full bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                          <th className="py-3 px-6 text-left">Name</th>
                          <th className="py-3 px-6 text-left">Email</th>
                          <th className="py-3 px-6 text-left">Phone</th>
                          <th className="py-3 px-6 text-left">Status</th>
                          <th className="py-3 px-6 text-left">Action</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-600 text-sm font-light">
                        {users.map((user) => (
                          <tr
                            key={user._id}
                            className="border-b border-gray-200 hover:bg-gray-100"
                          >
                            <td className="py-3 px-6 text-left whitespace-nowrap">
                              {user.name}
                            </td>
                            <td className="py-3 px-6 text-left">{user.email}</td>
                            <td className="py-3 px-6 text-left">
                              {user.phone ? user.phone : "not found"}
                            </td>
                            <td className="py-3 px-6 text-left">
                              {user.isBlocked ? "Blocked" : "Active"}
                            </td>
                            <td className="py-3 px-6 text-left">
                              <button
                                className={`py-2 px-4 rounded ${
                                  user.isBlocked
                                    ? "bg-green-500 font-bold text-white hover:shadow-2xl hover:font-semibold"
                                    : "bg-red-500 font-bold text-white hover:shadow-2xl hover:font-semibold"
                                }`}
                                onClick={() => blockUser(user._id)}
                              >
                                {user.isBlocked ? "Unblock" : "Block"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <div className="flex items-center gap-4 mt-4 justify-center">
                  <Button
                    variant="text"
                    className={`flex items-center gap-2 rounded-full ${
                      currentPage === 1 ? "text-gray-400" : ""
                    }`}
                    onClick={prev}
                    disabled={currentPage === 1}
                  >
                    <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" /> Previous
                  </Button>
                  <div className="flex items-center gap-2 font-semibold">
                    {[...Array(totalPages)].map((_, index) => (
                      <IconButton key={index + 1} {...getItemProps(index + 1)}>
                        {index + 1}
                      </IconButton>
                    ))}
                  </div>
                  <Button
                    variant="text"
                    className={`flex items-center gap-2 rounded-full ${
                      currentPage === totalPages ? "text-gray-400" : ""
                    }`}
                    onClick={next}
                    disabled={currentPage === totalPages}
                  >
                    Next <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
