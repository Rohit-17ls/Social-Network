import React, { useContext, useEffect, useRef, useState } from 'react'
import NeedsAuthentication from '../components/NeedsAuthentication';
import { AuthContext } from '../context/AuthContext';
import useAuthorize from '../hooks/useAuthorize';
import Spinner from '../components/Spinner';
import axios from 'axios'


const NewPost = () => {

  // Below couple of lines are pretty standard in all routes that require authorization for access
  const authorize = useAuthorize();
  const {getCredentials, getAuthState : isAuthorized, setAuthState} = useContext(AuthContext);
  const [isAuthorizing, setIsAuthorizing] =  useState(true);
  const inputRef = useRef();
  const apiKey = '473667842556293';
  const cloudName = 'duoljv54r';
  const BACKEND_API_URL = `http://localhost:3000/api/newpost`;

  const uploadImage =  async (e) => {
    e.preventDefault()

    // get signature. In reality you could store this in localstorage or some other cache mechanism, it's good for 1 hour
    const signatureResponse = await axios.post(`${BACKEND_API_URL}/get_signature`)
  
    const data = new FormData()
    data.append("file", inputRef.current.files[0])
    data.append("api_key", apiKey)
    data.append("signature", signatureResponse.data.signature)
    data.append("timestamp", signatureResponse.data.timestamp)
  
    const cloudinaryResponse = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, data, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: function (e) {
        console.log(e.loaded / e.total)
      }
    })
    console.log(cloudinaryResponse.data)
  
    // send the image info back to our server
    const photoData = {
      public_id: cloudinaryResponse.data.public_id,
      version: cloudinaryResponse.data.version,
      signature: cloudinaryResponse.data.signature
    }
  
    // Save image's public id to database
    axios.post(`${BACKEND_API_URL}/save_image`, photoData)

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
    <>{!isAuthorized() ?
        (isAuthorizing ? <Spinner/> : <NeedsAuthentication/>) :
        <div>
            <div>Code for NewPost Component, just testing the image upload</div>
            <form id="upload-form" className='m-6' onSubmit={uploadImage}>
                <input id="file-field" type="file" ref={inputRef}/>
                <button className='bg-themecolor'>Upload</button>
            </form>

        </div>
    }

    </>
  )
}

export default NewPost;