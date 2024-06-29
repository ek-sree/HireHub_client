import { FC, FormEvent, useState } from "react";
import { Toaster, toast } from "sonner";

interface NewJobAddModalProps {
    isNewJobModal: boolean;
    onClose: () => void;
}

const jobTypes = ['Full-time','Part-time','Contract','Internship'];
const employmentTypes = ["Remote",'On-site','Hybride'];

const AddNewJob: FC<NewJobAddModalProps> = ({isNewJobModal, onClose}) => {

    const [position, setPosition] = useState('');
    const [place, setPlace] = useState('');
    const [jobType, setJobType] = useState<string[]>([]);
    const [employmentType, setEmploymentType] = useState<string[]>([]);
    const [skills, setSkills] = useState('');

    const [errors, setErrors] = useState({
        position:'',
        place:'',
        jobType:'',
        employmentType:'',
        skills:'',
    })

    const handleCheckboxChange = (setState: React.Dispatch<React.SetStateAction<string[]>>, value:string) => {
        setState(prev => {
            if(prev.includes(value)) {
                return prev.filter(item => item !== value);
            }else{
                return [...prev, value];
            }
        })
    }

    const handleSubmit =(e: FormEvent)=>{
        e.preventDefault();

        const newErrors = {
            position: position ? '' : 'Please fill the position',
            place: place ? '' : 'Please fill the place',
            jobType: jobType.length > 0 ? '' : 'Please select at least one job type',
            employmentType: employmentType.length > 0 ? '' : 'Please select at least one employment type',
            skills: skills ? '' : 'Please fill at least one skill'
          };

          setErrors(newErrors);

          const hasErrors = Object.values(newErrors).some((error) =>error);

          if(hasErrors) {
            toast.error("please fill in all field");
            return;
          }

          toast.success("Job posted successfully.");
          onClose();
    }

    if(!isNewJobModal) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
       <Toaster position="top-center" expand={false} richColors />
        <div className="bg-white p-6 rounded shadow-lg w-[500px]">
            <div className="flex justify-end">
                <button onClick={onClose}>&times;</button>
            </div>
            <h2 className="text-xl font-bold mb-4">Edit Job Post</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 mt-8">
            <label className="block text-sm font-medium text-gray-700">Position</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded mt-1"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
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
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Skills</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded mt-1"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
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

export default AddNewJob