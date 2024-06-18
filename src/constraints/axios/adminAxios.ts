import axios from "axios";
import { API_GATEWAY_BASE_URL } from "../endpoints/adminEndpoints";

export const adminAxios = axios.create({
    baseURL: API_GATEWAY_BASE_URL,
    headers:{
        "Content-Type":"application/json",
    },
    withCredentials:true,
})