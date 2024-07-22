import MessageArea from "../../components/User/Home/MessageArea"
import MessageList from "../../components/User/Home/MessageList"

const MessagePage = () => {
  return (
    <div className="flex h-screen">
    <div className="w-1/3 border-r border-gray-300">
      <MessageList />
    </div>
    <div className="w-2/3">
      <MessageArea />
    </div>
  </div>
  )
}

export default MessagePage