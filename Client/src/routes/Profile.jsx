import React, { useContext, useEffect, useRef } from 'react'
import NeedsAuthentication from '../components/NeedsAuthentication';
import { AuthContext } from '../context/AuthContext';
import useAuthorize from '../hooks/useAuthorize';


function Profile() {

  const authorize = useAuthorize();
  const {getCredentials, getAuthState} = useContext(AuthContext);
  const isAuthorizedRef = useRef(true);

  useEffect(() => {

    const checkAuthorization = async() => {

      const authState = getAuthState();

      if(!authState.isAuthorized){
        const res = await authorize(getCredentials());
        const authStatus = await res.json();
        if(!authStatus.isAuthorized) isAuthorizedRef.current = true;
        console.log(authStatus);
      }
      
    }

    checkAuthorization();


  }, []);


  return (
    <>{!isAuthorizedRef.current ? 
        <NeedsAuthentication/> :
        <div>Profile</div>
    }
    </>
  )
}

export default Profile;