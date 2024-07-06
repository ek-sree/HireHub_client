export const API_GATEWAY_BASE_URL = 'http://localhost:4000';


export const userEndpoints = {
    register: `${API_GATEWAY_BASE_URL}/register`,
    otp: `${API_GATEWAY_BASE_URL}/otp`,
    resendOtp: `${API_GATEWAY_BASE_URL}/resend-otp`,
    login: `${API_GATEWAY_BASE_URL}/login`,
    logout: `${API_GATEWAY_BASE_URL}/logout`,
    addTitle: `${API_GATEWAY_BASE_URL}/addtitle`,
    editDetails: `${API_GATEWAY_BASE_URL}/editdetails`,
    viewDetails: `${API_GATEWAY_BASE_URL}/viewDetails`,
    userInfo: `${API_GATEWAY_BASE_URL}/userInfo`,
    userInfoEdit: `${API_GATEWAY_BASE_URL}/userInfoEdit`,
    userSkills: `${API_GATEWAY_BASE_URL}/userskills`,
    userSkillsAdd: `${API_GATEWAY_BASE_URL}/addUserSkills`
}
