export const API_GATEWAY_BASE_URL = 'https://hirehubbackend.online/recruiter/jobpost';
// export const API_GATEWAY_BASE_URL = 'http://localhost:4000/recruiter/jobpost';

export const jobpostEndpoints = {
    addjob: `${API_GATEWAY_BASE_URL}/addjob`,
    getjobs: `${API_GATEWAY_BASE_URL}/getjob`,
    getallJobs: `${API_GATEWAY_BASE_URL}/getalljobs`,
    editJobs: `${API_GATEWAY_BASE_URL}/editjobs`,
    applyJob: `${API_GATEWAY_BASE_URL}/applyjob`,
    viewApplication: `${API_GATEWAY_BASE_URL}/viewApplications`,
    awaitApplication: `${API_GATEWAY_BASE_URL}/awaitApplication`,
    acceptApplication: `${API_GATEWAY_BASE_URL}/acceptApplication`,
    rejectedApplication: `${API_GATEWAY_BASE_URL}/rejectApplication`,
    viewAcceptApplications:`${API_GATEWAY_BASE_URL}/acceptedApplications`,
    viewShortlistedApplication:`${API_GATEWAY_BASE_URL}/shortlistedApplication`,
    softDeleteJob:`${API_GATEWAY_BASE_URL}/softdeleteJob`,
    viewAwaitApplication: `${API_GATEWAY_BASE_URL}/viewAwaitApplication`
}