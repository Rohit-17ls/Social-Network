import React, {useState, useEffect, useRef} from 'react';
import PostBody from './PostBody';
import Upvote from '../../icons/Upvote';
import Downvote from '../../icons/Downvote';
import CommentsIcon from '../../icons/CommentsIcon';
import CopyLinkIcon from '../../icons/CopyLinkIcon';
import { useNavigate } from 'react-router-dom';


const UserPost = ({data}) => {

    const [imageURL, setImageURL] = useState('');
    const navigate = useNavigate();
    const cloudName = 'duoljv54r';
    const [postData, setPostData] = useState(data);

    const refetchPost = async() => {
        let res = await fetch(`http://localhost:3000/api/explore/post`,{
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({post_id: postData.post_id})
        });
        res = await res.json();

        if(!res.isRetrieved){
            return;
        }

        setPostData(res.data);
    }


    const vote = async(vote_type) => {
        let res = await fetch(`http://localhost:3000/api/${vote_type === 'l' ? 'upvote' : 'downvote'}/post/${postData.post_id}`,{
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        res = await res.json();
        console.log(res);
        
        
        if(res.unauthorized) modalRef.current.showModal();
        refetchPost();
    
    }



    useEffect(() => {
        const constructImageURL = () => {
            if(postData.img_public_id !== '0'){
                setImageURL(`https://res.cloudinary.com/${cloudName}/image/upload/${postData.img_version}/${postData.img_folder_name}/${postData.img_public_id}`);
            }else{
                setImageURL('');
            }
        }
        constructImageURL();
    }, [postData]);

  return (
    <div className='border border-solid border-grayedcolor bg-bglight w-[96%] max-w-[600px] min-w-[500px] m-auto  min-h-fit px-5' id="post-container"  onDoubleClick = {() => { navigate(`/post/${postData.post_id}`)}} title="Double Click to view full post">
           <div className='h-full px-3 my-0 min-h-fit' id="post">
                <span className='p-5 block w-full text-left'>
                    <strong className='text-2xl' onClick={() => { navigate(`/user/${postData.username}`)}}>{postData.username}</strong>
                    <span className='text-grayedcolor m-4'>{new Date(postData.time_stamp).toLocaleString()}</span>
                </span>
            </div>
            {imageURL ? <img className='m-auto border border-solid border-tagcolor rounded-xl post-image' src={imageURL}/> : <></>}
            <PostBody data={postData}/>
            <div className='m-0 w-full flex flex-row justify-evenly bg-bglight p-3'>
                <span onClick={() => {vote('l')}}>
                    <strong>{postData.likes}</strong>
                    <Upvote fill={postData.userVote === 'l' ? '#078350': 'white'}/>
                </span>    
                <span onClick={() => {vote('d')}}>
                    <strong>{postData.dislikes}</strong>
                    <Downvote fill={postData.userVote === 'd' ? '#ee0303': 'white'}/>
                </span>    
                <span title="copy link to post" className="link-icon" onClick={() => {navigator.clipboard.writeText(`http://localhost:5173/post/${postData.post_id}`)}}>
                    <CopyLinkIcon/>
                </span>    
                <span onClick={() => { navigate(`/post/${postData.post_id}`)}}>
                    <CommentsIcon fill={'white'}/>
                </span>    
            </div>
    </div>
  )
}

export default UserPost