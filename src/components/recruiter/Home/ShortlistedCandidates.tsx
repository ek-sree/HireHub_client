import { useState, useEffect } from 'react';
import user from '../../../assets/images/user.png';
import { jobpostAxios } from '../../../constraints/axios/jobpostAxios';
import { jobpostEndpoints } from '../../../constraints/endpoints/jobpost.Endpoints';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';
import { Candidate } from '../../../interface/JobInterfaces/IJobInterface';

const ShortListedCandidates = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const recruiterId = useSelector((store: RootState) => store.RecruiterAuth.recruiterData?._id);
  const token = useSelector((store: RootState) => store.RecruiterAuth.token);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const response = await jobpostAxios.get(`${jobpostEndpoints.viewAcceptApplications}?recruiterId=${recruiterId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success && response.data.candidates) {
        setCandidates(response.data.candidates);
      } else {
        setError('Failed to fetch candidates');
      }
    } catch (error) {
      setError('Error fetching candidates');
      console.error('Error fetching candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewCV = (resumeUrl: string) => {
    window.open(resumeUrl, '_blank');
  };

  const handleSendMessage = (candidateId: string) => {
    console.log(`Send message to candidate with id: ${candidateId}`);
  };

  useEffect(() => {
    fetchCandidates();
  }, [recruiterId]);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex justify-center mt-5 text-xl font-semibold underline text-slate-700">All Candidates</div>
      <div className="mt-5">
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-center text-gray-500">{error}</div>
        ) : candidates.length > 0 ? (
          candidates.map(candidate => (
            <div key={candidate.id} className="flex items-center justify-between p-4 border-b border-gray-200 hover:bg-gray-100 cursor-pointer">
              <div className="flex items-center">
                <img
                  src={candidate.profilePhoto || user}
                  alt="profile"
                  className="w-12 h-12 rounded-full"
                />
                <div className="ml-4">
                  <div className="font-semibold text-slate-700">{candidate.name}</div>
                  <div className="text-sm text-gray-500">Email: {candidate.email}</div>
                  <div className="text-sm text-gray-500">Phone: {candidate.phone}</div>
                  <div className="text-sm text-blue-500 hover:underline cursor-pointer">
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleViewCV(candidate.resume);
                      }}
                    >
                      View CV
                    </a>
                  </div>
                  <div className="text-sm text-blue-500 hover:underline cursor-pointer">
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleSendMessage(candidate.id);
                      }}
                    >
                      Send Message
                    </a>
                  </div>
                </div>
              </div>
              <div> 
                <div className='text-sm text-blue-500 hover:underline cursor-pointer'>View Profile</div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">No candidates found.</div>
        )}
      </div>
    </div>
  );
};

export default ShortListedCandidates;
