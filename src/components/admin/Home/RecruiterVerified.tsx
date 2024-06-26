import { useEffect, useState, useCallback } from "react";
import { Toaster, toast } from "sonner";
import { adminAxios } from "../../../constraints/axios/adminAxios";
import { adminEndpoints } from "../../../constraints/endpoints/adminEndpoints";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { Link } from "react-router-dom";

interface IRecruiter {
    _id: string;
    name: string;
    email: string;
    phone: string;
    isBlocked: boolean;
}

const RecruiterVerified = () => {
    const [recruiters, setRecruiters] = useState<IRecruiter[]>([]);
    const [verificationChange, setVerificationChange] = useState(false);
    const token = useSelector((state: RootState) => state.AdminAuth.token);

    const getVerifiedRecruiter = useCallback(async () => {
        console.log("call for verified");

        try {
            const response = await adminAxios.get(adminEndpoints.getUnVerifiedRecruiter, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("Response from API:", response);

            if (response.data.success === false) {
                toast.error(response.data.message);
            } else {
                setRecruiters(response.data.recruiter_data || []);
            }
        } catch (error) {
            console.log("Error occurred fetching all unverified recruiters", error);
            toast.error("An error occurred, please try again later!!");
        }
    }, [token]);

    const isVerified = async (recruiterId: string) => {
        try {
            const response = await adminAxios.put(`${adminEndpoints.verifiRecruiter}/${recruiterId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("verified recruiter", response);
            if (response.data.success) {
                toast.success("Recruiter verified successfully");
                setVerificationChange(!verificationChange);
            }
        } catch (error) {
            console.log("Error occurred verifying recruiter", error);
            toast.error("An error occurred, please try again later!!");
        }
    }

    useEffect(() => {
        getVerifiedRecruiter();
    }, [getVerifiedRecruiter, verificationChange]);

    return (
        <div className="min-h-screen bg-gray-100">
            <Toaster position="top-center" expand={false} richColors />
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
                                            <th className="py-3 px-6 text-left pl-32">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-600 text-sm font-light">
                                        {recruiters.map((recruiter) => (
                                            <tr key={recruiter._id} className="border-b border-gray-200 hover:bg-gray-100">
                                                <td className="py-3 px-6 text-left whitespace-nowrap">{recruiter.name}</td>
                                                <td className="py-3 px-6 text-left">{recruiter.email}</td>
                                                <td className="py-3 px-6 text-left">{recruiter.phone ? recruiter.phone : "not found"}</td>
                                                <td className="py-3 px-6 text-left">
                                                    <button
                                                        className="py-2 px-4 rounded bg-green-500 font-bold text-white hover:shadow-2xl hover:font-semibold"
                                                        onClick={() => isVerified(recruiter._id)}
                                                    >
                                                        Verify
                                                    </button>
                                                    <button
                                                        className="ml-16 py-2 px-4 rounded bg-red-500 font-bold text-white hover:shadow-2xl hover:font-semibold"
                                                        // onClick={() => isRejected(recruiter._id)}
                                                    >
                                                        Reject
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        <div className="mt-16">
                        <Link to='/admin/dashboard' className="bg-slate-300 py-1 px-2 rounded-lg font-bold hover:bg-slate-200 hover:font-semibold"> to dashboard</Link>
                    </div>
                    </div>
                    
                </div>
            </div>
        </div>
    );
};

export default RecruiterVerified;
