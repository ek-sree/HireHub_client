import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { Toaster, toast } from 'sonner';
import Sidebar from './SideBar';
import { adminAxios } from '../../../constraints/axios/adminAxios';
import { adminEndpoints } from '../../../constraints/endpoints/adminEndpoints';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';

interface IUser {
    _id: string;
    name: string;
    email: string;
    phone: string;
    isBlocked: boolean;
}

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<IUser[]>([]);
    const token  = useSelector((state: RootState) => state.AdminAuth.token);

    const getAllUsers = async () => {
        try {
            const response = await adminAxios.get(adminEndpoints.getUser, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("Response from API:", response);

            if (response.data.success === false) {
                toast.error(response.data.message);
            } else {
                setUsers(response.data.user_data || []);
            }
        } catch (error) {
            console.log("Error occurred fetching all users", error);
            toast.error("An error occurred, please try again later!!");
        }
    };

    const blockUser = async (userId: string) => {
        try {
            const response = await adminAxios.put(`${adminEndpoints.blockUser}/${userId}`,{}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log("response of block user",response);
            if(response.data.success === true){
                setUsers(prevUsers =>
                    prevUsers.map(user=>
                        user._id === userId ? {...user, isBlocked: !user.isBlocked} : user
                    )
                );
                toast.success(response.data.message)
            }
            
        } catch (error) {
            console.log("Error occurred blocking users", error);
            toast.error("An error occurred, please try again later!!");
        }
    }

    useEffect(() => {
        getAllUsers();
    }, []);
    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <Sidebar />
            <Toaster position="top-center" expand={false} richColors />
            <div className="container mx-auto mt-20 px-4">
                <h2 className="text-2xl font-bold text-center mb-8">User Management</h2>
                <div className="flex justify-center">
                    <div className="w-full max-w-4xl">
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
                                            <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-100">
                                                <td className="py-3 px-6 text-left whitespace-nowrap">{user.name}</td>
                                                <td className="py-3 px-6 text-left">{user.email}</td>
                                                <td className="py-3 px-6 text-left">{user.phone ? user.phone : "not found"}</td>
                                                <td className="py-3 px-6 text-left">{user.isBlocked ? 'Blocked' : 'Active'}</td>
                                                <td className="py-3 px-6 text-left">
                                                    <button
                                                        className={`py-2 px-4 rounded ${user.isBlocked ? 'bg-green-500 font-bold text-white hover:shadow-2xl hover:font-semibold' : 'bg-red-500 font-bold text-white hover:shadow-2xl hover:font-semibold'}`}
                                                        onClick={() => blockUser(user._id)}
                                                    >
                                                        {user.isBlocked ? 'Unblock' : 'Block'}
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

export default UserManagement;
