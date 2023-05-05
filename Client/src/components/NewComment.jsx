import React, {useState, useContext} from 'react';
import Input from './Input'
import SendIcon from '../icons/SendIcon'
import SmallSpinner from './SmallSpinner';
import useAuthorize from '../hooks/useAuthorize';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const NewComment = ({postID, isPostingComment, setIsPostingComment}) => {

  const [newComment, setNewComment] = useState('');
  const [postingError, setPostingError] = useState('');

  const navigate = useNavigate();

    // Below couple of lines are pretty standard in all routes that require authorization for access
    const authorize = useAuthorize();
    const {getCredentials, getAuthState : isAuthorized, setAuthState} = useContext(AuthContext);


  const postComment = async() => {
    setIsPostingComment(true);
    if(!isAuthorized()){
      const res = await authorize(getCredentials());
      const authStatus = await res.json();
      if(!authStatus.isAuthorized) navigate('/login');
      console.log(authStatus);
    }

    console.log(newComment);

    let res = await fetch(`http://localhost:3000/api/new/comment`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type' : 'application/json',
      },
      body : JSON.stringify({comment: newComment, post_id: postID})
    });

    res = await res.json();
    if(!res.isPostedComment) setPostingError("Couldn't post comment !!!");

    setIsPostingComment(false);


  }
  
  const newCommentHandler = (newComment) => {
    setNewComment(newComment);
  }

  return (
    
    <div className='border-b border-grayedcolor w-full flex flex-row justify-start gap-4 p-3'>
      <div className='w-4/5'>
        <Input type={"text"} name={"comment"} defaultValue={"Your comment"} handler={newCommentHandler}/>
      </div>
      <pre className='m-3 p-3 bg-themecolor mx-2 rounded-full hover:opacity-90' onClick={() => {postComment()}}>
        {isPostingComment ? <SmallSpinner/> : <SendIcon/>}
        <b className='bg-errorcolor'>{postingError}</b>
      </pre>
    </div>
  )
}

export default NewComment