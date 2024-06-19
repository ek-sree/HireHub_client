import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { userAxios } from '../../../constraints/axios/userAxios';
import { userEndpoints } from '../../../constraints/endpoints/userEndpoints';
import { toast } from 'sonner';
import Sidebar from './SideBar';

interface IUser {
    _id: string;
    name: string;
    email: string;
    phone: string;
    isBlocked: boolean;
}

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<IUser[]>([]);

    const getAllUsers = async () => {
        try {
            const response = await userAxios.get(userEndpoints.getUser);
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

    useEffect(() => {
        getAllUsers();
    }, []);

    return (
        <div>
            <Navbar />
            <Sidebar/>
            <div className="container  mt-20">
                <h2 className="flex text-center justify-center">User Management</h2>
                <div className="row justify-content-center">
                    <div className="col-md-10 flex justify-center">
                        {users.length === 0 ? (
                            <p className="text-center">No users found.</p>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-striped table-bordered">
                                    <thead className="thead-dark">
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => (
                                            <tr key={user._id}>
                                                <td>{user.name}</td>
                                                <td>{user.email}</td>
                                                <td>{user.phone}</td>
                                                <td>{user.isBlocked ? 'Blocked' : 'Active'}</td>
                                                <td>
                                                    <button
                                                        className={`btn ${user.isBlocked ? 'btn-success' : 'btn-danger'}`}
                                                        // onClick={() => toggleBlockStatus(user._id)}
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
