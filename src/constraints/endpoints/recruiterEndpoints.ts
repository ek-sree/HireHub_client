export const API_GATEWAY_BASE_URL = 'http://localhost:4000/recruiter';

export const recruiterEndpoints = {
    register: `${API_GATEWAY_BASE_URL}/register`,
    otp: `${API_GATEWAY_BASE_URL}/otp`,
    resendOtp: `${API_GATEWAY_BASE_URL}/resend-otp`,
    login: `${API_GATEWAY_BASE_URL}/login`,

    getrecruiters: `${API_GATEWAY_BASE_URL}/getrecruiters`
}