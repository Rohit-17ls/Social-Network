import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Notifications from '../components/Notifications';
import NotFound from './NotFound';
import Spinner from '../components/Spinner';
import NeedsAuthentication from '../components/NeedsAuthentication';

const Group = () => {

  const {groupname} = useParams();
  const [is404, setIs404] = useState(false);
  const modalRef = useRef();

  const [fetchingState, setFetchingState] = useState(true);
  const [groupData, setGroupData] = useState(null);
  

  useEffect(() => {
    
    const fetchGroupData = async() => {
      const res = await fetch(`http://localhost:3000/api/group/${groupname}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await res.json();
      setFetchingState(false);

      if(data.isNotFound) setIs404(true);
      if(data.unauthorized){
        modalRef.current.showModal();
        return;
      }
      console.log(data);
      setGroupData(data);
    }

    fetchGroupData();


  }, []);

  if(is404) return <NotFound/>

  return (
    <div>
      <dialog ref={modalRef}><NeedsAuthentication message={'Sign up to join groups'}/></dialog>
      {/* Group ID : {groupID}
      <Notifications/> */}
      {fetchingState ? <Spinner/> : 
        <></>
      }
    </div>
  )
}

export default Group;