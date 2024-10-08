 export const API_GATEWAY_BASE_URL = 'https://hirehubbackend.online/admin';
//  export const API_GATEWAY_BASE_URL = 'http://localhost:4000/admin';
 

 export const adminEndpoints = {
     adminlogin: `${API_GATEWAY_BASE_URL}/login`,
     getUser: `${API_GATEWAY_BASE_URL}/getalluser`,
     getUnVerifiedRecruiter: `${API_GATEWAY_BASE_URL}/getVerifiedRecruiter`,
     verifiRecruiter: `${API_GATEWAY_BASE_URL}/verifyRecruiter`,
     getrecruiters: `${API_GATEWAY_BASE_URL}/getrecruiters`,
     blockUser: `${API_GATEWAY_BASE_URL}/blockuser`,
     blockRecruiter: `${API_GATEWAY_BASE_URL}/blockRecruiter`,
     searchUser: `${API_GATEWAY_BASE_URL}/searchUser`,
     searchRecruiter :`${API_GATEWAY_BASE_URL}/searchRecruiter`,
     getReportPost: `${API_GATEWAY_BASE_URL}/fetchRepostPost`,
     getUserReports: `${API_GATEWAY_BASE_URL}/fetchUserRepost`,
     getAllPosts: `${API_GATEWAY_BASE_URL}/getAllPostReport`,
     getAllJobPost: `${API_GATEWAY_BASE_URL}/getAllJobPostRepost`,
     getBlockedUser: `${API_GATEWAY_BASE_URL}/getBlockedUser`,
     getBlockedRecruiter:`${API_GATEWAY_BASE_URL}/getBlockedRecruiter`,
     clearReportPost: `${API_GATEWAY_BASE_URL}/clearReportPost`



    }