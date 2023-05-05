import React from 'react'
import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Comment = ({commentData, id}) => {

    const commentRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        commentRef.current.innerHTML = commentData.comment.replace(/@[a-zA-Z0-9]*/g, (match, id) => {
            return `<a href='/user/${match.slice(1,)}' class='text-tagcolor font-semibold no-underline'>${match}</a>`;
        })

    }, [])


  return (
    <div className='p-3 border-b border-solid border-grayedcolor'>
        <div className='w-full text-left'>
            <strong className='mr-3' onClick={() => { navigate(`/user/${commentData.username}`)}}>{commentData.username}</strong>
            <span className='text-grayedcolor'>{new Date(commentData.time_stamp).toLocaleString()}</span>
        </div>
        <div className='m-3 ml-0 text-left' ref={commentRef}>
            {commentData.comment}
        </div>
        {/* <div className='p-2'>
            {commentData.data.likes}
        </div> */}
    </div>
  )
}

export default Comment