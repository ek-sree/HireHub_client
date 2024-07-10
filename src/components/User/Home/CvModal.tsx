import React, { FC, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { userAxios } from "../../../constraints/axios/userAxios";
import { userEndpoints } from "../../../constraints/endpoints/userEndpoints";
import CircularProgress from '@mui/material/CircularProgress';


interface CvModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess:()=>void;
}

const CvModal: FC<CvModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = React.useState(0);
    React.useEffect(() => {
        const timer = setInterval(() => {
          setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
        }, 800);
    
        return () => {
          clearInterval(timer);
        };
      }, []);

    const token = useSelector((store: RootState) => store.UserAuth.token);
    const email = useSelector((store: RootState)=>store.UserAuth.userData?.email);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleSend = async () => {
        setLoading(true);
        if (selectedFile) {
            const formData = new FormData();
            formData.set("cv", selectedFile); 

            try {
                const response = await userAxios.post(`${userEndpoints.cvUpload}?email=${email}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                });
console.log("api response add cv",response.data);

                if (response.data.success) {
                    setLoading(false)
                    onSuccess()
                    onClose();
                } else {
                    setLoading(false)
                    console.error("CV upload failed:", response.data.message);
                }
            } catch (error) {
                setLoading(false)
                console.error("Error uploading CV:", error);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg max-w-md w-full">
                <h2 className="text-2xl font-semibold mb-4">Upload CV</h2>
                <label
                    htmlFor="file-upload"
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                    Choose a file:
                </label>
                <div className="flex items-center justify-between border border-gray-300 rounded-lg px-4 py-3 mb-4">
                    <input
                        id="file-upload"
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        className="sr-only"
                        onChange={handleFileChange}
                    />
                    <span className="text-gray-500">{selectedFile?.name || "No file chosen"}</span>
                    <button
                        type="button"
                        className={'bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded'}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        Browse
                    </button>
                </div>
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-block mr-2"
                    >
                        Cancel
                    </button>
                    {loading? <CircularProgress variant="determinate" value={progress} />
                    :<button
                        onClick={handleSend}
                        className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded ${selectedFile ? "" : "opacity-50 cursor-not-allowed"}`}
                        disabled={!selectedFile}
                    >
                        Send
                    </button>
}
                </div>
            </div>
        </div>
    );
};

export default CvModal;
