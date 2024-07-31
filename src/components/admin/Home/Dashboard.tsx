import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { adminAxios } from "../../../constraints/axios/adminAxios";
import { adminEndpoints } from "../../../constraints/endpoints/adminEndpoints";
import { useEffect, useState } from "react";
import { toast } from "sonner";

ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  Tooltip,
  Legend
);

function Dashboard() {
  const [users, setUsers] = useState<number>(0); 
  const [posts, setPosts] = useState<number>(0);
  const [jobs, setJobs] = useState<number>(0);
  const [blockedUser, setBlockedUser] = useState<number>(0);
  const [blockedRecruiter, setBlockedRecruiter] = useState<number>(0); 
  const token = useSelector((store: RootState) => store.AdminAuth.token);

  async function getAllUsers() {
    const response = await adminAxios.get(adminEndpoints.getUserReports, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("dashboard data users", response.data);

    if (response.data.success) {
      setUsers(response.data.data);
    }
  }

  async function getAllPosts() {
    const response = await adminAxios.get(adminEndpoints.getAllPosts, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    console.log("Post reports api", response.data);
    if (response.data.success) {
      setPosts(response.data.data);
    }
  }

  async function getAllJobPost() {
    try {
      const response = await adminAxios.get(adminEndpoints.getAllJobPost, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log("Fetch jobpost api", response.data);
      if (response.data.success) {
        setJobs(response.data.data);
      }
    } catch (error) {
      console.log("error fetching job post", error);
      toast("error getting jobposts")
    }
  }

  async function getBlockedUser() {
    try {
      const response = await adminAxios.get(adminEndpoints.getBlockedUser, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log("data api blocked user", response.data);
      if (response.data.success) {
        setBlockedUser(response.data.data);
      }
    } catch (error) {
      console.log("error fetching blocked user", error);
      toast("error getting blocked user")
    }
  }

  async function getBlockedRecruiter() { 
    try {
      const response = await adminAxios.get(adminEndpoints.getBlockedRecruiter, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log("data api blocked recruiter", response.data);
      if (response.data.success) {
        setBlockedRecruiter(response.data.data);
      }
    } catch (error) {
      console.log("error fetching blocked recruiter", error);
      toast("error getting blocked recruiter")
    }
  }

  useEffect(() => {
    getAllUsers();
    getAllPosts();
    getAllJobPost();
    getBlockedUser();
    getBlockedRecruiter(); 
  }, [token]);

  const AllDetails = {
    labels: ['Total Users', 'Total job post', 'Total user post'],
    datasets: [
      {
        data: [users, jobs, posts],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  const BlockedData = {
    labels: ['Blocked User', 'Blocked Recruiter'],
    datasets: [
      {
        label: 'Blocked details',
        data: [blockedUser, blockedRecruiter], 
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Blocked Reports',
      },
    },
  };

  return (
    <div className="pl-72">
      <div className="p-6 bg-gray-100">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Data Report</h2>
            <Doughnut data={AllDetails} />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-700"></h2>
            <Bar options={barOptions} data={BlockedData} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-blue-500 text-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Total Users</h3>
            <p className="text-3xl font-bold">{users || "0"}</p>
          </div>
          <div className="bg-green-500 text-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Total Jobs</h3>
            <p className="text-3xl font-bold">{jobs || "0"}</p>
          </div>
          <div className="bg-yellow-500 text-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Total Posts</h3>
            <p className="text-3xl font-bold">{posts || "0"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
