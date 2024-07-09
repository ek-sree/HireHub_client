export const API_GATEWAY_BASE_URL = 'http://localhost:4000/recruiter/jobpost';

export const jobpostEndpoints = {
    addjob: `${API_GATEWAY_BASE_URL}/addjob`,
    getjobs: `${API_GATEWAY_BASE_URL}/getjob`,
    getallJobs: `${API_GATEWAY_BASE_URL}/getalljobs`,
    editJobs: `${API_GATEWAY_BASE_URL}/editjobs`,
    applyJob: `${API_GATEWAY_BASE_URL}/applyjob`,
    viewApplication: `${API_GATEWAY_BASE_URL}/viewApplications`
}