import { useState, useEffect } from "react";
import { userAxios } from "../../../constraints/axios/userAxios";
import { userEndpoints } from "../../../constraints/endpoints/userEndpoints";
import ProfileSideNav from "./ProfileSideNav";
import SidebarNav from "./SidebarNav";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import SkillAdd from "./SkillAdd";
import EditSkills from "./EditSkills";

const UserSkills = () => {
  const [skills, setSkills] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [showAllSkills, setShowAllSkills] = useState(false);

  const token = useSelector((store: RootState) => store.UserAuth.token);
  const email = useSelector((store: RootState) => store.UserAuth.userData?.email);

  useEffect(() => {
    if (email) {
      userSkills();
    }
  }, [email]);

  async function userSkills() {
    try {
      const response = await userAxios.get(`${userEndpoints.userSkills}?email=${email}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.success) {
        setSkills(response.data.skills);
      }
    } catch (error) {
      console.log("Error occurred showing skills", error);
      throw new Error("Error occurred fetching user skills");
    }
  }

  const handleOnSuccess=(skills:string[])=>{
    setSkills(skills);
  }

  const hahndleonSuccess =(skills:string[])=>{
    setSkills(skills);
  }

  const handleSkillAdd = ()=>{
    setIsModalOpen(true);
  }

  const handleClose = ()=>{
    setIsModalOpen(false);
  }

  const handleEditSkills= () =>{
    setIsEditModal(true);
  }

  const handleEditClose=()=>{
    setIsEditModal(false);
  }

  const toggleShowAllSkills=()=>{
    setShowAllSkills(prevShowSkills=> !prevShowSkills);
  }

  const skillsToShow = showAllSkills ? skills : skills.slice(0, 3);

  return (
    <div className="max-w-2xl mx-auto mb-8 bg-white mt-10 p-4 rounded-lg shadow-lg">
      <ProfileSideNav />
      <SidebarNav />
      <div className="text-center font-semibold font-sans">
        UserSkills
      </div>
      {skills.length > 0 && (
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
          <div key={index} className="mt-4 ml-10">
            <label> * {skill}</label>
            <hr className="my-2 border-gray-200" />
          </div>
        ))
      ) : (
        <div className="mt-4 ml-10 text-center">
          <p>No skills added yet</p>
        </div>
      )}
      {skills.length==0? 
    <div onClick={handleSkillAdd} className="mt-5 py-1 text-center w- bg-slate-500 rounded text-white font-semibold hover:bg-slate-400 hover:font-normal hover:cursor-pointer">
    Add Skills
  </div> : (
   skills.length > 3 && (
    <div onClick={toggleShowAllSkills} className="mt-5 py-1 text-center w-full bg-slate-300 rounded-xl text-white font-semibold hover:bg-slate-400 hover:font-normal hover:cursor-pointer">
      {showAllSkills ? "Show Less 🔼" : "Show More 🔽"}
    </div>
    )
  )
      }
      {isModalOpen &&(
        <SkillAdd
        isOpen={isModalOpen}
        onClose={handleClose}
        onSuccess={hahndleonSuccess}
        />
      )}
      {isEditModal &&(
        <EditSkills
        isOpen={isEditModal}
        onClose={handleEditClose}
        skillsValue={skills}
        onSuccess={handleOnSuccess}
        />
      )}
    </div>
  );
};

export default UserSkills;
