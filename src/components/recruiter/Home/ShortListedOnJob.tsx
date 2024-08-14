import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { toast, Toaster } from "sonner";
import { jobpostAxios } from "../../../constraints/axios/jobpostAxios";
import { jobpostEndpoints } from "../../../constraints/endpoints/jobpost.Endpoints";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { Candidate } from "../../../interface/JobInterfaces/IJobInterface";
import user from '../../../assets/images/user.png'
import { Button } from "@material-tailwind/react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { userAxios } from "../../../constraints/axios/userAxios";
import { userEndpoints } from "../../../constraints/endpoints/userEndpoints";
import UserImg from '../../../assets/images/user.png';




const ShortListedOnJob = () => {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [profileImages, setProfileImages] = useState<{ [key: string]: string }>({});


    const token = useSelector((store:RootState)=>store.RecruiterAuth.token);

    const navigate = useNavigate();
    const {jobId} = useParams();

    async function fetchShortlisted(){
        try {
            console.log("jobiddd",jobId);
            
            setLoading(true);
            if(!jobId){
                toast.error("Error missing some crediential login and try again later")
                throw new Error("Error job id is missing");
            }
            const response = await jobpostAxios.get(`${jobpostEndpoints.viewShortlistedApplication}?jobId=${jobId}`)
            console.log("api data shortlisted",response.data);
            
            if(response.data.success){
                setCandidates(response.data.Candidates);
                response.data.Candidates.forEach(async (candidate: Candidate) => {
                  await showImage(candidate.userId);
                });
            }else{
                setError("No data found");
            }
        } catch (error) {
            console.log("Error fetching shorlisted candidates",error);
            toast.error("Error occured please login try again later")
        }finally{
            setLoading(false);
        }
    }


    const showImage = async (userId: string) => {
      try {
        const response = await userAxios.get(`${userEndpoints.getProfileImages}?userId=${userId}`);
        console.log("is img got?>", response.data);
  
        const imageUrl = response.data.success ? response.data.data?.imageUrl || UserImg : UserImg;
        setProfileImages(prev => ({ ...prev, [userId]: imageUrl }));
      } catch (error) {
        console.error("Error fetching profile image:", error);
        setProfileImages(prev => ({ ...prev, [userId]: UserImg }));
      }
    };

    // const handleSendMessage = (id:string)=>{
    // }

    const handleViewCV=(resumeUrl:string)=>{
      window.open(resumeUrl, '_blank');
    }

    const handleBack=()=>{
        navigate('/recruiter/home');
    }

    useEffect(()=>{
        fetchShortlisted()
    },[token, jobId]);

  return (
    <div className="p-4 max-w-7xl mx-auto">
         <Toaster position="top-center" expand={false} richColors />
         <Button variant="text" className="mb-4 flex items-center gap-2" onClick={handleBack}>
        <ArrowLeftIcon strokeWidth={2} className="h-5 w-5" /> Back
      </Button>
    <div className="flex justify-center mt-5 text-xl font-semibold underline text-slate-700">Selected Candidates</div>
    <div className="mt-5">
      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-center text-gray-500">{error}</div>
      ) : candidates.length > 0 ? (
        candidates.map(candidate => (
          <div key={candidate._id} className="flex items-center justify-between p-4 border-b border-gray-200 hover:bg-gray-100 cursor-pointer">
            <div className="flex items-center">
              <img
                  src={profileImages[candidate.userId] || user}
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
                {/* <div className="text-sm text-blue-500 hover:underline cursor-pointer">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSendMessage(candidate.id);
                    }}
                  >
                    Send Message
                  </a>
                </div> */}
              </div>
            </div>
            <div> 
            <NavLink to={`/recruiter/userprofile/${candidate.userId}`}>
                  <div className='text-sm text-blue-500 hover:underline cursor-pointer'>View Profile</div>
                </NavLink>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-500">No candidates found.</div>
      )}
    </div>
  </div>
  )
}

export default ShortListedOnJob