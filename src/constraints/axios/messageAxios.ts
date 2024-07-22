import axios from "axios";
import { API_GATEWAY_BASE_URL } from "../endpoints/messageEndpoints";

export const messageAxios = axios.create({
    baseURL:API_GATEWAY_BASE_URL,
    headers:{
        "Content-Type": "multipart/form-data",
    },
    withCredentials:true
})