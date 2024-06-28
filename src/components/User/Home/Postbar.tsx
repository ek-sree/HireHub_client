import AddPhotoAlternateTwoToneIcon from '@mui/icons-material/AddPhotoAlternateTwoTone';

const Postbar = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-slate-100 mt-6 p-4 rounded-lg shadow-lg">
        <textarea
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="What's on your mind?"
        ></textarea>
        <div className="mt-3 flex justify-between items-center">
          <div className="hover:scale-110 hover:bg-gray-200 p-2 rounded-full transition-transform duration-200 ease-in-out">
            <AddPhotoAlternateTwoToneIcon />
          </div>
          <button className="bg-cyan-300 text-blue-700 font-semibold px-4 py-2 rounded-md hover:bg-cyan-200 hover:font-normal focus:outline-none focus:ring-2 focus:ring-blue-400">
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default Postbar;
