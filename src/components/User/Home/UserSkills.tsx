import  { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { userAxios } from "../../../constraints/axios/userAxios";
import { userEndpoints } from "../../../constraints/endpoints/userEndpoints";
import ProfileSideNav from "./ProfileSideNav";
import SidebarNav from "./SidebarNav";
import SkillAdd from "./SkillAdd";
import EditSkills from "./EditSkills";
import { RootState } from "../../../redux/store/store";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const UserSkills = () => {
  const [skills, setSkills] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [sameUser, setSameUser] = useState<boolean>(true);

  const { id } = useParams<{ id?: string }>();
  const email = useSelector((store: RootState) => store.UserAuth.userData?.email);
  const userId = useSelector((store: RootState) => store.UserAuth.userData?._id);

  useEffect(() => {
    if (userId !== id) {
      setSameUser(false);
    } else {
      setSameUser(true);
    }
  }, [id, userId]);

  useEffect(() => {
    if (email) {
      userSkills();
    }
  }, [email, sameUser]);

  const sentId = sameUser ? userId : id;

  async function userSkills() {
    try {
      const response = await userAxios.get(`${userEndpoints.userSkills}?userId=${sentId}`);
      if (response.data.success) {
        setSkills(response.data.skills);
      }
    } catch (error) {
      console.error("Error fetching user skills:", error);
    }
  }

  const handleOnSuccess = (skills: string[]) => {
    setSkills(skills);
  };

  const handleSkillAdd = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleEditSkills = () => {
    setIsEditModal(true);
  };

  const handleEditClose = () => {
    setIsEditModal(false);
  };

  const toggleShowAllSkills = () => {
    setShowAllSkills(prevShowSkills => !prevShowSkills);
  };

  const skillsToShow = showAllSkills ? skills : skills.slice(0, 3);

  return (
    <div>
      <ProfileSideNav />
      <SidebarNav />
      <div className="max-w-2xl w-full mx-auto mb-8 bg-white mt-10 p-4 rounded-lg shadow-lg">
        <div className="text-center font-semibold font-sans mb-4">User Skills</div>
        <div className="space-y-4">
          {skills.length > 0 && sameUser && (
            <div className="flex justify-end">
              <button
                onClick={handleEditSkills}
                className="bg-cyan-400 py-1 px-3 rounded text-white hover:bg-cyan-300"
              >
                Add more skills
              </button>
            </div>
          )}
          {skills.length > 0 ? (
            skillsToShow.map((skill, index) => (
              <div key={index} className="px-4 py-2 bg-gray-100 rounded-lg shadow-md">
                <span className="text-gray-700">* {skill}</span>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">
              <p>No skills added yet</p>
            </div>
          )}
          {skills.length === 0 ? (
            sameUser && (
              <div onClick={handleSkillAdd} className="mt-5 py-2 text-center w-full bg-slate-500 rounded text-white font-semibold hover:bg-slate-400 cursor-pointer">
                Add Skills
              </div>
            )
          ) : (
            skills.length > 3 && (
              <div onClick={toggleShowAllSkills} className="mt-5 py-2 text-center w-full bg-slate-300 rounded-xl text-white font-semibold hover:bg-slate-400 cursor-pointer">
                {showAllSkills ? <span>Show Less <ExpandLessIcon/></span>  : <span>Show More <ExpandMoreIcon/></span>}
              </div>
            )
          )}
          {isModalOpen && (
            <SkillAdd
              isOpen={isModalOpen}
              onClose={handleClose}
              onSuccess={handleOnSuccess}
            />
          )}
          {isEditModal && (
            <EditSkills
              isOpen={isEditModal}
              onClose={handleEditClose}
              skillsValue={skills}
              onSuccess={handleOnSuccess}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSkills;
