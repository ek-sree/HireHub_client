import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { Toaster, toast } from "sonner";
import Sidebar from "./SideBar";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { Button, IconButton } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { LinearProgress, Stack } from "@mui/material";
import { adminAxios } from "../../../constraints/axios/adminAxios";
import { adminEndpoints } from "../../../constraints/endpoints/adminEndpoints";
import { postAxios } from "../../../constraints/axios/postAxios";
import { postEndpoints } from "../../../constraints/endpoints/postEndpoints";

const UserManagement: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState("most-reported");
  const [reportData, setReportData] = useState<any[]>([]);

  const token = useSelector((state: RootState) => state.AdminAuth.token);

  async function fetchReportedPost(page = 1) {
    setLoading(true);
    try {
      const response = await adminAxios.get(
        `${adminEndpoints.getReportPost}?page=${page}&sortOrder=${sortOrder}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("data fetch areport", response.data);

      if (response.data.success) {
        setReportData(response.data.data);
        setTotalPages(Math.ceil(response.data.totalPosts / 2));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log("Error fetching reported posts", error);
    } finally {
      setLoading(false);
    }
  }

  const handleDeletePost = async (postId: string, imageUrls: string[]) => {
    console.log("delete post repo", postId, imageUrls);

    try {
      const imageUrlString = imageUrls.join(",");

      const response = await postAxios.delete(
        `${
          postEndpoints.deletePost
        }?postId=${postId}&imageUrl=${encodeURIComponent(imageUrlString)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data.data);

      if (response.data.success) {
        setReportData((prev) => prev.filter((post) => post._id !== postId));
        toast.success("Post deleted successfully");
      } else {
        toast.error(response.data.message || "Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting reported post", error);
      toast.error("An error occurred while deleting the post");
    }
  };

  useEffect(() => {
    fetchReportedPost(currentPage);
  }, [currentPage, token, sortOrder]);

  const next = () => {
    if (currentPage === totalPages) return;
    setCurrentPage(currentPage + 1);
  };

  const prev = () => {
    if (currentPage === 1) return;
    setCurrentPage(currentPage - 1);
  };

  const getItemProps = (index: number) => ({
    variant: currentPage === index ? "filled" : "text",
    color: currentPage === index ? "green" : "black",
    onClick: () => setCurrentPage(index),
    className: "rounded-full",
    size: currentPage === index ? "lg" : "md",
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Sidebar />
      <Toaster position="top-center" expand={false} richColors />
      <div className="container mx-auto mt-20 px-4">
        <h2 className="text-2xl font-bold text-center mb-8">
          Post Report Management
        </h2>
        <div className="flex justify-center">
          <div className="w-full max-w-4xl">
            <div className="flex justify-end mb-6">
              <select
                value={sortOrder}
                onChange={(e) => {
                  setSortOrder(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border rounded-lg mr-4"
              >
                <option value="most-reported">Most reported</option>
                <option value="least-reported">Less reported</option>
              </select>
            </div>
            {loading ? (
              <Stack sx={{ width: "100%", color: "grey.500" }} spacing={2}>
                <LinearProgress color="secondary" />
                <LinearProgress color="success" />
                <LinearProgress color="inherit" />
              </Stack>
            ) : (
              <>
                {reportData.length === 0 ? (
                  <p className="text-center text-gray-600">No reports found.</p>
                ) : (
                  <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    <table className="min-w-full bg-white">
                      <thead>
                        <tr className="w-full bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                          <th className="py-3 px-6 text-left">Image</th>
                          <th className="py-3 px-6 text-left">Content</th>
                          <th className="py-3 px-6 text-left">Reason</th>
                          <th className="py-3 px-6 text-left">Total reports</th>
                          <th className="py-3 px-6 text-left">Action</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-600 text-sm font-light">
                        {reportData.map((post: any) => (
                          <tr
                            key={post._id}
                            className="border-b border-gray-200 hover:bg-gray-100"
                          >
                            <td className="py-3 px-6 text-left whitespace-nowrap">
                              <img
                                src={post.imageUrl[0]}
                                alt="post img here"
                                className="w-16 h-16 object-cover"
                              />
                            </td>
                            <td className="py-3 px-6 text-left">
                              {post.description}
                            </td>
                            <td className="py-3 px-6 text-left">
                              {post.reportPost
                                .map((r: any) => r.reason)
                                .join(", ")}
                            </td>
                            <td className="py-3 px-6 text-left">
                              {post.reportPost.length}
                            </td>
                            <td className="py-3 px-6 text-left">
                              <button
                                onClick={() =>
                                  handleDeletePost(post._id, post.imageUrl)
                                }
                                className="bg-red-500 py-2 px-2 rounded-md font-medium text-white shadow-md"
                              >
                                Delete
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

                  {totalPages > 0 &&
                    [...Array(totalPages)].map((_, index) => (
                      <IconButton key={index + 1} {...getItemProps(index + 1)}>
                        {index + 1}
                      </IconButton>
                    ))}

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
