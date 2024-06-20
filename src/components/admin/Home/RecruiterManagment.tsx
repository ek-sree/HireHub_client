import { useEffect, useState } from "react";
import { toast } from "sonner";
import Navbar from "./Navbar";
import Sidebar from "./SideBar";
import { recruiterAxios } from "../../../constraints/axios/recruiterAxios";
import { recruiterEndpoints } from "../../../constraints/endpoints/recruiterEndpoints";

interface IRecruiter {
    _id: string;
    name: string;
    email: string;
    phone: string;
    isBlocked: boolean;
}

const RecruiterManagement = () => {
    const [recruiters, setRecruiters] = useState<IRecruiter[]>([]);

    const getAllUsers = async () => {
        try {
            const response = await recruiterAxios.get(recruiterEndpoints.getrecruiters);
            console.log("Response from API:", response);

            if (response.data.success === false) {
                toast.error(response.data.message);
            } else {
                setRecruiters(response.data.recruiter_data || []);
            }
        } catch (error) {
            console.log("Error occurred fetching all users", error);
            toast.error("An error occurred, please try again later!!");
        }
    };

    useEffect(() => {
        getAllUsers();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <Sidebar />
            <div className="container mx-auto mt-20 px-4">
                <h2 className="text-2xl font-bold text-center mb-8">Recruiter Management</h2>
                <div className="flex justify-center">
                    <div className="w-full max-w-4xl">
                        {recruiters.length === 0 ? (
                            <p className="text-center text-gray-600">No recruiter found.</p>
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
                                            <tr key={recruiter._id} className="border-b border-gray-200 hover:bg-gray-100">
                                                <td className="py-3 px-6 text-left whitespace-nowrap">{recruiter.name}</td>
                                                <td className="py-3 px-6 text-left">{recruiter.email}</td>
                                                <td className="py-3 px-6 text-left">{recruiter.phone ? recruiter.phone : "not found"}</td>
                                                <td className="py-3 px-6 text-left">{recruiter.isBlocked ? 'Blocked' : 'Active'}</td>
                                                <td className="py-3 px-6 text-left">
                                                    <button
                                                        className={`py-2 px-4 rounded ${recruiter.isBlocked ? 'bg-green-500 font-bold text-white hover:shadow-2xl hover:font-semibold' : 'bg-red-500 font-bold text-white hover:shadow-2xl hover:font-semibold'}`}
                                                        // onClick={() => toggleBlockStatus(recruiter._id)}
                                                    >
                                                        {recruiter.isBlocked ? 'Unblock' : 'Block'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecruiterManagement;
