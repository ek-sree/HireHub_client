import { FC, FormEvent, useState } from "react";
import { userAxios } from "../../../constraints/axios/userAxios";
import { userEndpoints } from "../../../constraints/endpoints/userEndpoints";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";

interface SkillAddMOdal {
    isOpen: boolean;
    onClose: ()=>void;
    onSuccess:(skills:string[])=>void;
}

const SkillAdd: FC<SkillAddMOdal> = ({isOpen, onClose, onSuccess}) => {

    const hardcodedSkills = ['javascript', 'react', 'docker', 'typescript','nodejs','mongodb','python'];

    const [skills, setSkills] = useState<string[]>([]);
    const [skillInput, setSkillInput] = useState('');
    const [filteredSkills, setFilteredSkills] = useState<string[]>([]);
    const email = useSelector((store:RootState)=> store.UserAuth.userData?.email);
    const token = useSelector((store: RootState)=>store.UserAuth.token);

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


    const handleRemoveSkill = (skill: string) => {
        setSkills(skills.filter(s => s !== skill));
    };

    
    const handleSkillSelect = (skill: string) => {
        if (!skills.includes(skill)) {
            setSkills([...skills, skill]);
        }
        setSkillInput('');
        setFilteredSkills([]);
    };

    const handleSubmit= async(e: FormEvent)=>{
        console.log(skills);
        
        e.preventDefault();
        const response = await userAxios.post(`${userEndpoints.userSkillsAdd}?email=${email}`,{skills}, {
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
        console.log("sadasd",response.data);
        
        if(response.data.success){
            onSuccess(response.data.result)
            onClose();
        }
    }

    if(!isOpen) return null;
  return (
    <div >
        <div className="fixed inset-0 flex items-center justify-center bg-slate-500 bg-opacity-50">
        <div className="bg-white p-6 w-[556px] rounded shadow-lg">
            <div className="flex justify-end">
                <button onClick={onClose}> &times; </button>
            </div>
            <h2 className="text-xl font-bold mb-4">Edit</h2>
            <form onSubmit={handleSubmit}>
            <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Skills</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                            value={skillInput}
                            onChange={handleSkillsChange}
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
                        {/* {errors.skills && <div className="text-red-500 text-xs">{errors.skills}</div>} */}
                    </div>
                    <div className="flex justify-center mt-6">
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                            Save Changes
                        </button>
                    </div>
            </form>
        </div>
    </div>
    </div>
  )
}

export default SkillAdd