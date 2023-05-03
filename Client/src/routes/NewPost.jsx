import React, { useContext, useEffect, useRef, useState } from 'react'
import NeedsAuthentication from '../components/NeedsAuthentication';
import { AuthContext } from '../context/AuthContext';
import useAuthorize from '../hooks/useAuthorize';
import Spinner from '../components/Spinner';
import axios from 'axios'


const LinkField = ({id, setPostData, postData}) => {

  const updateField = (e, id) => {
    const links = postData.links;
    links[id] = e.target.value;
    setPostData(prevData => { return {...prevData, links}});
  }

  return(
    <input className='block m-3 p-1 text-center rounded-xl' type="text" onChange={(e) => {updateField(e, id)}}/>
  )
}


const TagField = ({id, setPostData, postData}) => {

  const updateField = (e, id) => {
    const tags = postData.tags;
    tags[id] = e.target.value;
    setPostData(prevData => { return {...prevData, tags}});
  }

  return(
    <input className='block m-3 p-1 text-center rounded-xl' type="text" onChange={(e) => {updateField(e, id)}}/>
  )
}

const NewPost = () => {

  // Below couple of lines are pretty standard in all routes that require authorization for access
  const authorize = useAuthorize();
  const {getCredentials, getAuthState : isAuthorized, setAuthState} = useContext(AuthContext);
  const [isAuthorizing, setIsAuthorizing] =  useState(true);
 
  const [postData, setPostData] = useState({
                                            image : '',
                                            text: '',
                                            links: [],
                                            tags: []
                                          })

  const [image, setImage] = useState();
  const inputRef = useRef();
  const imgRef = useRef();
  const cloudName = 'duoljv54r';
  const BACKEND_API_URL = `http://localhost:3000/api/newpost`;

  const addLink = () => {
    console.log(postData);
    setPostData(prevState => { return {...prevState, links : [...prevState.links, '']} })
  }

  const addTag = () => {
    console.log(postData);
    setPostData(prevState => { return {...prevState, tags : [...prevState.tags, '']} })
  }

  const sendImageToServer = async (res) => {
    console.log(res.data.url.split('upload/'));
    setImage(res.data.url);

    try{
      const imgData = res.data.url.split('upload/')[1].split('/');

      res = await fetch(`${BACKEND_API_URL}/save_image`, {
        method : 'POST',
        credentials: 'include',
        headers: {
          'Content-Type' : 'application/json'
        },
        body : JSON.stringify({version: imgData[0], folderName: imgData[1], publicID : imgData[2]})
      })

    }catch(err){
      console.log("Something went wrong", err);
    }
  }

  const uploadImage =  async (e) => {
    e.preventDefault()
    const file = inputRef.current.files[0];
    const formData = new FormData();
    formData.append('file', file)
    formData.append('upload_preset', 'cd70zixl');

    let res = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, formData)
    .then(res => sendImageToServer(res))
    .catch(err => console.log(err));

}

  const updateImagePreview = (e) => {
    const file = inputRef.current.files[0];
    imgRef.current.src = URL.createObjectURL(file);
  }


  useEffect(() => {

    const checkAuthorization = async() => {
      
      if(!isAuthorized()){
        const res = await authorize(getCredentials());
        const authStatus = await res.json();
        if(authStatus.isAuthorized) setAuthState(true);
        console.log(authStatus, isAuthorized);
      }
      setIsAuthorizing(false);
      
    }

    
    checkAuthorization();


  }, []);


  return (
    <>
    {!isAuthorized() ?
        (isAuthorizing ? <Spinner/> : <NeedsAuthentication/>) :
        <div className='my-20 w-full'>

          <section className = 'w-full flex flex-row justify-evenly gap-5'>
            <table className='m-10 w-1/2 border-separate border-spacing-10'>
              <tr>
                <th colSpan={3}><strong className = 'text-3xl'>NEW POST</strong></th>
              </tr>
              <tr>
                <td>
                  <strong>Image :</strong>
                </td>
                <td colSpan={2} className='hover:bg-bglight'>
                  <form id="upload-form" className='border-solid border-bglight border rounded -xl p-4 m-6' onSubmit={uploadImage} onChange={updateImagePreview}>
                    <input id="file-field" type="file" ref={inputRef}/>
                    <button className='bg-themecolor'>Upload</button>
                  </form>
                </td>
              </tr>

              <tr>
                <td>
                    <strong>Textual Content :</strong>
                </td>
                <td colSpan={2}>
                    <textarea className='bg-bglight outline-none w-full m-6 p-2' onChange={(e) => {setPostData(prevData => {return {...prevData, text: e.target.value}})}}></textarea>
                </td>
              </tr>

              <tr>
                <td>
                  <strong>Links : </strong>
                </td>
                <td className='flex flex-col justify-center items-center hover:bg-bglight'>
                  {postData.links.map((link, id) => <LinkField key={id} id={id} setPostData = {setPostData} postData = {postData}/>)}
                  <button onClick={addLink}> + Add Link</button>
                </td>
              </tr>

              <tr>
                <td>
                  <strong>Tagged : </strong>
                </td>
                <td className='flex flex-col justify-center items-center hover:bg-bglight'>
                  {postData.tags.map((tag, id) => <TagField key={id} id={id} setPostData = {setPostData} postData = {postData}/>)}
                  <button onClick={addTag}> + Add Tag @</button>
                </td>
              </tr>



            </table>

            <div className='border border-solid border-bglight w-1/3 h-fit'>
              <strong className='text-3xl'>Preview</strong>
              <div className='w-full h-fit my-5 flex flex-col justify-center items-center gap-3'>
                <img ref={imgRef} className='w-5/6 aspect-[15/16] mb-4'></img>
                <div className='w-5/6 h-fit text-xl text-ellipsis'>{postData.text}</div>
                {postData.links.map((link, id) => <a href={link} key={id}>{link}</a>)}
                {postData.tags.map((tag, id) => <span className='text-themecolor font-semibold'>@{tag}</span>)}

              </div>
            </div>
          </section>

        </div>
    }

    </>
  )
}

export default NewPost;