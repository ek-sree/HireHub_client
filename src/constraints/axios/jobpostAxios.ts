import axios from "axios";
import { API_GATEWAY_BASE_URL } from "../endpoints/jobpost.Endpoints";
import socketService from "../../socket/socketService";
import { toast } from "sonner";

export const jobpostAxios = axios.create({
    baseURL: API_GATEWAY_BASE_URL,
    headers:{
        "Content-Type":"application/json",
    },
    withCredentials:true,
})

jobpostAxios.interceptors.request.use(
    (config) => {
        let token = localStorage.getItem('userToken');
        
        if (!token) {
            token = localStorage.getItem('recruiterToken');
        }
        
        if (!token) {
            token = localStorage.getItem('adminToken');
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

jobpostAxios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 403) {
            toast.error("Token expired, please log in again.");
            localStorage.removeItem('userToken');
            socketService.disconnect();
            
        }
        return Promise.reject(error);
    }
);