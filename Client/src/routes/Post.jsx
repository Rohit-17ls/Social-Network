import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Spinner from '../components/Spinner';

const Post = () => {

    const{postID} = useParams();
    const [postState, setPostState] = useState(false);
    const [data, setData] = useState({});
    const [imageURL, setImageURL] = useState('');
    const cloudName = 'duoljv54r';

    // Need not be logged in to view a random public post
    useEffect(() => {

        const retrievePostData = async() => {
            const res = await fetch(`http://localhost:3000/api/post/${postID}`);
            const data = await res.json();
            console.log(data);
            setData(data);
            if(data.img_public_id){
                setImageURL(`https://res.cloudinary.com/${cloudName}/image/upload/${data.img_version}/${data.img_folder_name}/${data.img_public_id}`);
            }
            setPostState(true);
        }

        retrievePostData();

    }, [])

  return (
    <>
        {!postState ? <Spinner/> : 
        <div className='border border-solid border-themecolor bg-bglight w-2/3 m-auto h-fit' id="post">
            {imageURL ? <img className=' m-auto w-2/5 aspect-[15/16]' src={imageURL}/> : <></>}
        </div>
        }
    </>
  )
}

export default Post;