import React, { FC, useEffect, useState } from 'react';
import { TextField, IconButton, Avatar } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { postAxios } from '../../../constraints/axios/postAxios';
import { postEndpoints } from '../../../constraints/endpoints/postEndpoints';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';

interface Comment {
  id: string;
  userAvatar: string;
  userName: string;
  text: string;
}

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId:string;
}

const CommentModal: FC<CommentModalProps> = ({ isOpen, onClose, postId}) => {
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [error, setError] = useState('');
  const token = useSelector((store:RootState)=>store.UserAuth.token);

    async function fetchComments(){
        try {
            const response = await postAxios.get(`${postEndpoints.fetchComment}?postId=${postId}`,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            console.log("commented api res",response.data);
            if(response.data.success){
                setComments(response.data.data);
            }
        } catch (error) {
            console.log("Error occure fetching comments");
            
        }
    }

  const handleSend = () => {
    setError('');
   if(!newComment.trim()){
        setError("Comment cannot be empty");
        return;
   }
  };

  const handleCommentWrite=(e: React.ChangeEvent<HTMLInputElement>)=>{
    setNewComment(e.target.value);
    setError('');
  }

  useEffect(()=>{
    fetchComments();
  },[token])

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="comment-modal bg-white p-4 rounded-lg shadow-lg max-w-lg w-full">
        <div className="comments mb-4 max-h-60 overflow-y-auto">
          {comments.map((comment, index) => (
            <div key={index} className="comment flex items-start mb-2">
              <Avatar src={comment.userAvatar} className="mr-2" />
              <div className="flex-1">
                <div className="font-semibold">{comment.userName}</div>
                <div className="text-gray-600">{comment.text}</div>
              </div>
              <IconButton size="small" onClick={() => onDelete(comment.id)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </div>
          ))}
        </div>
        <div className="new-comment flex items-center">
          <TextField
            variant="outlined"
            size="small"
            fullWidth
            placeholder="Write a comment..."
            value={newComment}
            onChange={handleCommentWrite}
          />
          {error&&(<div className='text-sm text-red-500'>{error}</div>)}
          <IconButton color="primary" onClick={handleSend}>
            <SendIcon />
          </IconButton>
        </div>
        <div className="flex justify-end mt-4">
          <button className="text-blue-500" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
