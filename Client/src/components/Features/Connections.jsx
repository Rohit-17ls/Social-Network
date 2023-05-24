import React, { useEffect, useState } from 'react'
import SmallSpinner from '../SmallSpinner';
import SmartText from '../SmartText';

const Connections = ({type, username}) => {

    const [connections, setConnections] = useState([]);
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        
        const fetchConnections = async() => {
            const res = await fetch('http://localhost:3000/api/connections', {
              method: 'POST', 
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({username})
            });
            const data = await res.json();

            console.log(data);

            setIsFetching(false);

            if(!data.isRetrieved){
              setError(data.status);
              return;
            } 

            setConnections(data);
      
        }

        fetchConnections();

    }, []);

    if(error) return <strong>{error}</strong>

  return (
    <div className='bg-bglight w-[90%] rounded-lg max-h-[40vh] min-h-fit overflow-y-scroll px-1' id="connections">
      {isFetching ? <SmallSpinner/> : 
      <>
      
        {type === 'Followers' && (connections.followers.length ? connections.followers.map((connection, id) => <div className="w-full p-2 border-b-2 hover:bg-[#2b2a2aad] border-grayedcolor" key={id}><SmartText text={`@${connection.username}`}/></div>) : <span>No Followers</span>)}
        {type === 'Following' && (connections.following.length ? connections.following.map((connection, id) => <div className="w-full p-2 border-b-2 hover:bg-[#2b2a2aad] border-grayedcolor" key={id}><SmartText text={`@${connection.username}`}/></div>)  : <span>Following none</span>)}

      
      </>
      
      }
    </div>
  )
}

export default Connections;