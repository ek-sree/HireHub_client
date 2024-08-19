import React, { useState, useRef, useEffect } from "react";
import ProfileSideNav from "./ProfileSideNav";
import SidebarNav from "./SidebarNav";
import CvModal from "./CvModal";
import { userAxios } from "../../../constraints/axios/userAxios";
import { userEndpoints } from "../../../constraints/endpoints/userEndpoints";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { toast } from "sonner";

interface CVItem {
    title: string;
    url: string;
    fileName: string;
}

const Cv = () => {
    const [cvItems, setCVItems] = useState<CVItem[]>([]);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const token = useSelector((store: RootState) => store.UserAuth.token);
    const email = useSelector((store: RootState) => store.UserAuth.userData?.email);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAddCV = () => {
        setIsOpenModal(true);
    };

    const handleClose = () => {
        setIsOpenModal(false);
    }

    const onSuccess = () => {
        cvLoad();
    };

    async function cvLoad() {
        try {
            const response = await userAxios.get(`${userEndpoints.getCv}?email=${email}`);
            if (response.data.success) {
                const fetchedCVItems = response.data.cv.map((item: { url: string, filename: string }) => ({
                    title: item.filename || 'Unknown CV',
                    url: item.url,
                    fileName: item.filename,
                }));
                setCVItems(fetchedCVItems);
            }
        } catch (error) {
            toast("error occurred can't show CV now");
            console.log("error fetching CV", error);
            throw new Error("Error occurred fetching CV");
        }
    }

    useEffect(() => {
        cvLoad();
    }, [token]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const newCVItem: CVItem = {
                title: file.name,
                url: URL.createObjectURL(file),
                fileName: file.name,
            };
            setCVItems(prevItems => [...prevItems, newCVItem]);
        }
    };

    const handleRemoveCV = async (url: string) => {
        try {
            setIsLoading(true);
            const response = await userAxios.delete(`${userEndpoints.deleteCv}?url=${url}&email=${email}`);
            if (response.data.success) {
                setCVItems(allCv => allCv.filter(cv => cv.url !== url));
                toast("CV deleted");
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            toast("error occurred can't delete CV now");
            console.log("error delete CV", error);
            throw new Error("Error occurred delete CV");
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-8">
            <SidebarNav />
            <ProfileSideNav />
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
                    <div key={cv.url} className="bg-white p-4 rounded shadow-md">
                        <h2 className="text-xl font-semibold mb-2">{cv.fileName}</h2>
                        <div className="flex items-center space-x-4">
                            <a
                                href={cv.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`text-blue-500 hover:underline ${isLoading ? 'cursor-not-allowed text-gray-400' : 'hover:cursor-pointer'}`}
                                onClick={(e) => isLoading && e.preventDefault()}
                                aria-disabled={isLoading}
                            >
                                View CV
                            </a>
                            <button
                                onClick={() => !isLoading && handleRemoveCV(cv.url)}
                                className={`text-red-500 ${isLoading ? 'cursor-not-allowed text-gray-400' : 'hover:text-red-700'}`}
                                disabled={isLoading}
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8">
                <button onClick={handleAddCV} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                    Add More CV
                </button>
            </div>
            {isOpenModal && (
                <CvModal
                    isOpen={isOpenModal}
                    onClose={handleClose}
                    onSuccess={onSuccess}
                />
            )}
             <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50">
                <SidebarNav />
            </div>
        </div>
    );
};

export default Cv;
