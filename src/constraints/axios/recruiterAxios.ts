import axios from "axios";
import { API_GATEWAY_BASE_URL } from "../endpoints/recruiterEndpoints";
import { toast } from "sonner";
import socketService from "../../socket/socketService";

export const recruiterAxios = axios.create({
    baseURL: API_GATEWAY_BASE_URL,
    headers:{
        "Content-Type":"application/json",
    },
    withCredentials:true
});

recruiterAxios.interceptors.request.use(
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


recruiterAxios.interceptors.response.use(
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