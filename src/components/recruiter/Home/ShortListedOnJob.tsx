import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, Toaster } from "sonner";
import { jobpostAxios } from "../../../constraints/axios/jobpostAxios";
import { jobpostEndpoints } from "../../../constraints/endpoints/jobpost.Endpoints";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { Candidate } from "../../../interface/JobInterfaces/IJobInterface";
import user from '../../../assets/images/user.png'
import { Button } from "@material-tailwind/react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";


const ShortListedOnJob = () => {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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
            const response = await jobpostAxios.get(`${jobpostEndpoints.viewShortlistedApplication}?jobId=${jobId}`,{
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
            console.log("api data shortlisted",response.data);
            
            if(response.data.success){
                setCandidates(response.data.Candidates);
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

    const handleSendMessage = (id:string)=>{
        //need to implemet message logic here ...
    }

    const handleViewCV=(id:string)=>{
        //same need to implemet view cv logic here....
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
  )
}

export default ShortListedOnJob