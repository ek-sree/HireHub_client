import React, { useState, useRef } from "react";
import ProfileSideNav from "./ProfileSideNav";
import SidebarNav from "./SidebarNav";
import CvModal from "./CvModal";

interface CVItem {
    id: number;
    title: string;
    url: string;
}

const Cv = () => {
    const [cvItems, setCVItems] = useState<CVItem[]>([]);
    const [isOpenModal, setIsOpenModal] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null); 

    const handleAddCV = () => {
        setIsOpenModal(true);
    };

    const handleClose=()=>{
        setIsOpenModal(false);
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const newCVItem: CVItem = {
                id: Date.now(),
                title: file.name,
                url: URL.createObjectURL(file),
            };
            setCVItems(prevItems => [...prevItems, newCVItem]);
        }
    };

    const handleRemoveCV = (id: number) => {
        setCVItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    return (
        <div className="max-w-2xl mx-auto py-8">
            <SidebarNav/>
            <ProfileSideNav/>
            <h1 className="text-3xl font-bold mb-6">Your CVs</h1>


            
            <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                className="hidden"
                onChange={handleFileChange}
            />

           
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cvItems.map(cv => (
                    <div key={cv.id} className="bg-white p-4 rounded shadow-md">
                        <h2 className="text-xl font-semibold mb-2">{cv.title}</h2>
                        <div className="flex items-center space-x-4">
                            <a href={cv.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View CV</a>
                            <button onClick={() => handleRemoveCV(cv.id)} className="text-red-500 hover:text-red-700">Remove</button>
                        </div>
                    </div>
                ))}
            </div>

           
            <div className="mt-8">
                <button onClick={handleAddCV} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                    Add More CV
                </button>
            </div>
            {isOpenModal&&(
                <CvModal
                isOpen={isOpenModal}
                onClose={handleClose}
                />
            )}
        </div>
    );
};

export default Cv;
