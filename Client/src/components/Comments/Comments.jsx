import React, { useEffect, useState } from 'react';
import NewComment from './NewComment';
import Comment from './Comment';
import Spinner from '../Spinner';


const Comments = ({postID}) => {

 
 const [isFetchingComments, setIsFetchingComments] = useState(true);
 const [comments, setComments] = useState([]);
 const [refetch, setRefetch] = useState(0)


 console.log('Rerendered');
  useEffect(() => {
    console.log('Re-ran useEffect');
    const fetchComments = async() => {
        let res = await fetch(`http://localhost:3000/api/comments/${postID}`);
        res = await res.json();
        console.log(res);
        setComments(res.comments);
        setIsFetchingComments(false);
      }
      console.log(comments);

    fetchComments();

  }, [refetch]);


  return (
    <>
        
        <div  className='border-l border-solid border-grayedcolor max-h-[600px] overflow-y-scroll' id="comments">
            <strong className='text-2xl block'>Comments</strong>
            {isFetchingComments && <Spinner/>}
            {!isFetchingComments && 
                <>
                    <NewComment postID={postID} refetch={refetch} setRefetch={setRefetch}/>
                    {(comments && comments.length) ? comments.map((x, id) => <Comment key={id} commentData={x} id={id}/>) : 'No Comments yet'}
                </>}
        </div>
    
    </>
    
  )
}

export default Comments