import React, { FC, useEffect, useState } from 'react';
import { TextField, IconButton, Avatar } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { postAxios } from '../../../constraints/axios/postAxios';
import { postEndpoints } from '../../../constraints/endpoints/postEndpoints';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';
import { toast, Toaster } from 'sonner';
import { format } from 'date-fns';

export interface Comment {
  _id: string;
  UserId:string;
  user: {
    avatar: {
      imageUrl: string;
    };
    name: string;
  };
  content: string;
  createdAt: Date;
}

interface CommentModalProps {
  isOpen: boolean;
  onClose: (newComments: Comment[]) => void;
  postId: string;
  UserId: string;
}

const CommentModal: FC<CommentModalProps> = ({ isOpen, onClose, postId }) => {
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [error, setError] = useState('');
  const token = useSelector((store: RootState) => store.UserAuth.token);
  const userId = useSelector((store: RootState) => store.UserAuth.userData?._id);

  

  async function fetchComments() {
    try {
      const response = await postAxios.get(`${postEndpoints.fetchComment}?postId=${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      console.log("Fetch comments response:", response.data);
  
      if (response.data.success) {
        setComments(response.data.data.map((comment: Comment, index: number) => ({
          ...comment,
          id: `${comment._id}-${index}`
        })));
      }
    } catch (error) {
      console.error("Error occurred fetching comments", error);
    }
  }

  const handleSend = async () => {
    setError('');
    if (!newComment.trim()) {
      setError("Comment cannot be empty");
      return;
    }
    try {
      const response = await postAxios.post(
        `${postEndpoints.addComment}?postId=${postId}&userId=${userId}`,
        { newComment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      console.log("send comment data", response.data);
  
      if (response.data.success) {
        toast.success("You commented on this post");
        const newCommentData = {
          ...response.data.data,
          id: `${response.data.data.id}-${Date.now()}`
        };
        const updatedComments = [...comments, newCommentData];
        setComments(updatedComments);
        onClose(updatedComments);
        setNewComment('');
      }
    } catch (error) {
      console.error("Error while sending comment", error);
    }
  };

  const handleCommentWrite = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewComment(e.target.value);
    setError('');
  }

  const onDelete = async (commentId: string) => {
    try {
      console.log("commentId",commentId);
      
      const response = await postAxios.delete(`${postEndpoints.deleteComment}?commentId=${commentId}&postId=${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        toast.success("Comment deleted successfully");
        setComments(comments.filter(comment => comment._id !== commentId));
      }
    } catch (error) {
      console.error("Error while deleting comment", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [token]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <Toaster position="top-center" expand={false} richColors />
      <div className="comment-modal bg-white p-4 rounded-lg shadow-lg max-w-lg w-full">
        <div className="comments mb-4 max-h-60 overflow-y-auto">
          {comments.length === 0 ? (
            <p className='flex items-center justify-center'>No comments added yet</p>
          ) : (
            comments.map((comment, index) => (
              <div key={`${comment.id}-${index}`} className="comment flex items-start mb-2">
                <Avatar src={comment.user.avatar.imageUrl} className="mr-2" />
                <div className="flex-1">
                  <div className="font-semibold">{comment.user.name} <span className="text-sm text-gray-500">{format(new Date(comment.createdAt), 'Pp')}</span></div>
                  <div className="text-gray-600 font-bold">{comment.content}</div>
                </div>
                {comment.UserId== userId&&(<IconButton size="small" onClick={() => onDelete(comment._id)}>
                  <DeleteIcon fontSize="small" className='hover:text-red-500'/>
                </IconButton>)}
              </div>
            ))
          )}
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
          {error && (<div className='text-sm text-red-500'>{error}</div>)}
          <IconButton color="primary" onClick={handleSend}>
            <SendIcon />
          </IconButton>
        </div>
        <div className="flex justify-end mt-4">
          <button className="text-blue-500" onClick={() => onClose(comments)}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;