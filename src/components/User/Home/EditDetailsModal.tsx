import React, { useState, useEffect } from 'react';

interface EditDetailsProps {
    onClose: () => void;
    onSave: (name: string) => void;
    currentName: string;
  }

const EditDetails: React.FC<EditDetailsProps> = ({ onClose, onSave, currentName }) => {
  const [name, setName] = useState(currentName);

  useEffect(() => {
    setName(currentName);
  }, [currentName]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(name);
    onClose();
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-8 shadow-lg relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500">
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">Edit Details</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Change Name</label>
            <input
              type="text"
              value={name}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border rounded-md"
              placeholder="Enter new name"
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md">
            Save
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditDetails;
