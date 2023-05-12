import React, { useContext, useEffect, useState } from 'react'
import NeedsAuthentication from '../components/NeedsAuthentication';
import { AuthContext } from '../context/AuthContext';
import useAuthorize from '../hooks/useAuthorize';
import Spinner from '../components/Spinner';
import Dashboard from '../components/Dashboard';
import Search from '../components/Search';


function Profile() {

  // Below couple of lines are pretty standard in all routes that require authorization for access
  const authorize = useAuthorize();
  const {getCredentials, getAuthState : isAuthorized, setAuthState} = useContext(AuthContext);
  const [isAuthorizing, setIsAuthorizing] =  useState(true);

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
        <div className='w-full flex flex-row justify-start llg-max:flex-col-reverse mt-[12em]'>
          <Dashboard/>
          <div className='w-1/3 llg-max:w-full m-3'>
            <strong className='w-full text-3xl text-center block'>Search</strong>
            <Search/>
          </div>
        </div>
    }

    </>
  )
}

export default Profile;