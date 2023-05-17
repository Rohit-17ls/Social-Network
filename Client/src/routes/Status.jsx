import React, {useEffect, useState} from 'react'
import Spinner from '../components/Spinner';
import NeedsAuthentication from '../components/NeedsAuthentication';

const Status = () => {

    const [isFetching, setIsFetching] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(true);

    useEffect(() => {
        

    }, []);


    if(!isAuthorized) return <NeedsAuthentication/>

  return (
    <>
    {isFetching ? <Spinner/> :
        <div className='my-10'>
            <strong className='block text-2xl'>Statuses</strong>
        </div>
    }
    </>
  )
}

export default Status