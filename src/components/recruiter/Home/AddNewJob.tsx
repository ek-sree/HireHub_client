import { FC, FormEvent, useState } from "react";
import { Toaster, toast } from "sonner";
import { jobpostAxios } from "../../../constraints/axios/jobpostAxios";
import { jobpostEndpoints } from "../../../constraints/endpoints/jobpost.Endpoints";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";

interface Job {
    _id: string;
    position: string;
    place: string;
    jobType: string[];
    employmentType: string[];
    experience:string;
    skills: string[];
    companyName: string;
  }

interface NewJobAddModalProps {
    isNewJobModal: boolean;
    onClose: () => void;
    addJobList:(job:Job) => void;
}

const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship'];
const employmentTypes = ["Remote", 'On-site', 'Hybrid'];
const hardcodedSkills = ['javascript', 'react', 'docker', 'typescript','nodejs','mongodb','python'];

const AddNewJob: FC<NewJobAddModalProps> = ({ isNewJobModal, onClose, addJobList }) => {

    const [position, setPosition] = useState('');
    const [place, setPlace] = useState('');
    const [jobType, setJobType] = useState<string[]>([]);
    const [employmentType, setEmploymentType] = useState<string[]>([]);
    const [skills, setSkills] = useState<string[]>([]);
    const [skillInput, setSkillInput] = useState('');
    const [filteredSkills, setFilteredSkills] = useState<string[]>([]);
    const [experience, setExperience] = useState('');

    const recruiterId = useSelector((state: RootState)=>state.RecruiterAuth.recruiterData?._id)
    const companyName = useSelector((state: RootState)=> state.RecruiterAuth.recruiterData?.companyName);

    

    const [errors, setErrors] = useState({
        position: '',
        place: '',
        jobType: '',
        employmentType: '',
        experience:'',
        skills: '',
    });

    const handleCheckboxChange = (setState: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
        setState(prev => {
            if (prev.includes(value)) {
                return prev.filter(item => item !== value);
            } else {
                return [...prev, value];
            }
        });
    };

    const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSkillInput(value);
        if (value) {
            const filtered = hardcodedSkills.filter(skill =>
                skill.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredSkills(filtered);
        } else {
            setFilteredSkills([]);
        }
    };

    const handleSkillSelect = (skill: string) => {
        if (!skills.includes(skill)) {
            setSkills([...skills, skill]);
        }
        setSkillInput('');
        setFilteredSkills([]);
    };

    const handleRemoveSkill = (skill: string) => {
        setSkills(skills.filter(s => s !== skill));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const newErrors = {
            position: position ? '' : 'Please fill the position',
            place: place ? '' : 'Please fill the place',
            jobType: jobType.length > 0 ? '' : 'Please select at least one job type',
            employmentType: employmentType.length > 0 ? '' : 'Please select at least one employment type',
            experience:experience ? '':"Please fill this",
            skills: skills.length > 0 ? '' : 'Please add at least one skill'
        };

        setErrors(newErrors);

        const hasErrors = Object.values(newErrors).some((error) => error);

        if (hasErrors) {
            toast.error("Please fill in all fields");
            return;
        }

        const upperCase = place.toUpperCase()

        const data = {
            position,
            place:upperCase,
            jobType,
            employmentType,
            experience,
            skills,
            companyName,
            recruiterId
        };

        try {
          console.log("ready to send job add data to frontend");
          
            const response = await jobpostAxios.post(jobpostEndpoints.addjob, data);
            console.log("response add job", response);
            if(response.data.success){
                addJobList(response.data.job);
                toast.success("Job posted successfully.");
                onClose();
            }
        } catch (error) {
            toast.error("An error occurred while posting the job.");
            console.error("Error posting job:", error);
        }
    };

    if (!isNewJobModal) return null;
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-x-auto">
            <Toaster position="top-center" expand={false} richColors />
            <div className="bg-white p-6 rounded shadow-lg w-[500px]">
                <div className="flex justify-end">
                    <button onClick={onClose}>&times;</button>
                </div>
                <h2 className="text-xl font-bold mb-4">Add New Job</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4 mt-8">
                        <label className="block text-sm font-medium text-gray-700">Position</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                            placeholder="Which position"
                        />
                        {errors.position && <div className="text-red-500 text-xs">{errors.position}</div>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Place</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                            value={place}
                            onChange={(e) => setPlace(e.target.value)}
                            placeholder="Enter the place"
                        />
                        {errors.place && <div className="text-red-500 text-xs">{errors.place}</div>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Job Type</label>
                        {jobTypes.map(type => (
                            <div key={type}>
                                <input
                                    type="checkbox"
                                    id={type}
                                    checked={jobType.includes(type)}
                                    onChange={() => handleCheckboxChange(setJobType, type)}
                                />
                                <label htmlFor={type} className="ml-2">{type}</label>
                            </div>
                        ))}
                        {errors.jobType && <div className="text-red-500 text-xs">{errors.jobType}</div>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Employment Type</label>
                        {employmentTypes.map(type => (
                            <div key={type}>
                                <input
                                    type="checkbox"
                                    id={type}
                                    checked={employmentType.includes(type)}
                                    onChange={() => handleCheckboxChange(setEmploymentType, type)}
                                />
                                <label htmlFor={type} className="ml-2">{type}</label>
                            </div>
                        ))}
                        {errors.employmentType && <div className="text-red-500 text-xs">{errors.employmentType}</div>}
                    </div>
                    <div className="mb-4 mt-8">
                        <label className="block text-sm font-medium text-gray-700">Experience</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                            placeholder="Freshers or 1 year experience"
                        />
                        {errors.experience && <div className="text-red-500 text-xs">{errors.experience}</div>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Skills</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                            value={skillInput}
                            onChange={handleSkillsChange}
                            placeholder="What are the skills needed"
                        />
                        {filteredSkills.length > 0 && (
                            <ul className="border border-gray-300 mt-1 rounded max-h-40 overflow-y-auto">
                                {filteredSkills.map((skill) => (
                                    <li
                                        key={skill}
                                        className="p-2 hover:bg-gray-200 cursor-pointer"
                                        onClick={() => handleSkillSelect(skill)}
                                    >
                                        {skill}
                                    </li>
                                ))}
                            </ul>
                        )}
                        <div className="mt-2 flex flex-wrap">
                            {skills.map((skill) => (
                                <div key={skill} className="flex items-center bg-gray-200 px-2 py-1 rounded-full mr-2 mb-2">
                                    <span>{skill}</span>
                                    <button
                                        type="button"
                                        className="ml-2 text-red-500 hover:text-red-700"
                                        onClick={() => handleRemoveSkill(skill)}
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                        {errors.skills && <div className="text-red-500 text-xs">{errors.skills}</div>}
                    </div>
                    <div className="flex justify-end mt-6">
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddNewJob;
