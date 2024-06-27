const FriendSuggestion = () => {
    return (
      <div className="fixed top-32 right-10 w-60 h-auto rounded-lg shadow-2xl py-6 px-2 z-50 bg-white">
        <div className="text-center font-semibold mb-4">Friend Suggestions</div>
        <div className="flex items-center mb-4">
          <img src="https://via.placeholder.com/48" alt="Friend 1" className="w-12 h-12 rounded-full mr-3" />
          <span className="font-semibold">John Doe</span>
        </div>
        <div className="flex items-center mb-4">
          <img src="https://via.placeholder.com/48" alt="Friend 2" className="w-12 h-12 rounded-full mr-3" />
          <span className="font-semibold">Jane Smith</span>
        </div>
        <div className="flex items-center mb-4">
          <img src="https://via.placeholder.com/48" alt="Friend 3" className="w-12 h-12 rounded-full mr-3" />
          <span className="font-semibold">Alice Johnson</span>
        </div>
      </div>
    );
  };
  
  export default FriendSuggestion;
  