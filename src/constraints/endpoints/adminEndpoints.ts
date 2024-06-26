 export const API_GATEWAY_BASE_URL = 'http://localhost:4000/admin';
 

 export const adminEndpoints = {
     adminlogin: `${API_GATEWAY_BASE_URL}/login`,
     getUser: `${API_GATEWAY_BASE_URL}/getalluser`,
     getUnVerifiedRecruiter: `${API_GATEWAY_BASE_URL}/getVerifiedRecruiter`,
     verifiRecruiter: `${API_GATEWAY_BASE_URL}/verifyRecruiter`,
     getrecruiters: `${API_GATEWAY_BASE_URL}/getrecruiters`,
     blockUser: `${API_GATEWAY_BASE_URL}/blockuser`,
     blockRecruiter: `${API_GATEWAY_BASE_URL}/blockRecruiter`

    }