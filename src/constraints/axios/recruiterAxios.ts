import axios from "axios";
import { API_GATEWAY_BASE_URL } from "../endpoints/recruiterEndpoints";

export const recruiterAxios = axios.create({
    baseURL: API_GATEWAY_BASE_URL,
    headers:{
        "Content-Type":"application/json",
    },
    withCredentials:true
});