import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import Navbar from "./Navbar";
import Sidebar from "./SideBar";
import { adminAxios } from "../../../constraints/axios/adminAxios";
import { adminEndpoints } from "../../../constraints/endpoints/adminEndpoints";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { Button, IconButton } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useDebonceSearch } from "../../../customHook/searchHook";
import { LinearProgress, Stack } from "@mui/material";

interface IRecruiter {
  _id: string;
  name: string;
  email: string;
  phone: string;
  isBlocked: boolean;
}

const RecruiterManagement = () => {
  const [recruiters, setRecruiters] = useState<IRecruiter[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [defaultValue, setDefaultValue] = useState<IRecruiter[]>([]);
  const [loading, setLoading] = useState(false);
  const token = useSelector((state: RootState) => state.AdminAuth.token);

  const debouncedValue = useDebonceSearch(searchQuery, 500);

  const getAllRecruiter = async (page = 1) => {
    try {
      const response = await adminAxios.get(
        `${adminEndpoints.getrecruiters}?page=${page}&limit=2`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Response from API:", response);

      if (response.data.success === false) {
        toast.error(response.data.message);
      } else {
        setRecruiters(response.data.recruiter_data || []);
        setTotalPages(Math.ceil(response.data.totalRecruiters / 2));
        setDefaultValue(response.data.recruiter_data);
      }
    } catch (error) {
      console.log("Error occurred fetching all users", error);
      toast.error("An error occurred, please try again later!!");
    }
  };

  const blockRecruiter = async (recruitersId: string) => {
    try {
      const response = await adminAxios.put(
        `${adminEndpoints.blockRecruiter}/${recruitersId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("response of recruiter blocked data", response);
      if (response.data.success === true) {
        setRecruiters((prevRecruiter) =>
          prevRecruiter.map((recruiter) =>
            recruiter._id === recruitersId
              ? { ...recruiter, isBlocked: !recruiter.isBlocked }
              : recruiter
          )
        );
        toast.success(response.data.message);
      } else {
        setRecruiters(response.data.recruiter_data || []);
        setTotalPages(Math.ceil(response.data.totalRecruiter / 2));
      }
    } catch (error) {
      console.log("Error occurred blocking users", error);
      toast.error("An error occurred, please try again later!!");
    }
  };

  const fetchRecruiterBySearch = async () => {
    try {
      setLoading(true);
      const response = await adminAxios.get(
        `${adminEndpoints.searchRecruiter}?search=${debouncedValue}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoading(false);
      console.log("api res search recr", response);
      if (response.data.success) {
        setRecruiters(response.data.recruiter);
        return;
      }
      toast.error("No user found");
      return;
    } catch (error) {
      console.log("Error occurred searching user list", error);
      toast.error("An error occurred, please try again");
    }
  };

  useEffect(() => {
    getAllRecruiter(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (debouncedValue) {
      fetchRecruiterBySearch();
    } else {
      setRecruiters(defaultValue);
    }
  }, [debouncedValue, token]);

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

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Sidebar />
      <Toaster position="top-center" expand={false} richColors />
      <div className="container mx-auto mt-20 px-4">
        <h2 className="text-2xl font-bold text-center mb-8">
          Recruiter Management
        </h2>
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
            {loading ? (
              <Stack sx={{ width: "100%", color: "grey.500" }} spacing={2}>
                <LinearProgress color="secondary" />
                <LinearProgress color="success" />
                <LinearProgress color="inherit" />
              </Stack>
            ) : (
              <>
                {recruiters.length === 0 ? (
                  <p className="text-center text-gray-600">
                    No recruiter found.
                  </p>
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
                        {recruiters.map((recruiter) => (
                          <tr
                            key={recruiter._id}
                            className="border-b border-gray-200 hover:bg-gray-100"
                          >
                            <td className="py-3 px-6 text-left whitespace-nowrap">
                              {recruiter.name}
                            </td>
                            <td className="py-3 px-6 text-left">
                              {recruiter.email}
                            </td>
                            <td className="py-3 px-6 text-left">
                              {recruiter.phone ? recruiter.phone : "not found"}
                            </td>
                            <td className="py-3 px-6 text-left">
                              {recruiter.isBlocked ? "Blocked" : "Active"}
                            </td>
                            <td className="py-3 px-6 text-left">
                              <button
                                className={`py-2 px-4 rounded ${
                                  recruiter.isBlocked
                                    ? "bg-green-500 font-bold text-white hover:shadow-2xl hover:font-semibold"
                                    : "bg-red-500 font-bold text-white hover:shadow-2xl hover:font-semibold"
                                }`}
                                onClick={() => blockRecruiter(recruiter._id)}
                              >
                                {recruiter.isBlocked ? "Unblock" : "Block"}
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
                    <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" />{" "}
                    Previous
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
                    Next
                    <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
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

export default RecruiterManagement;
