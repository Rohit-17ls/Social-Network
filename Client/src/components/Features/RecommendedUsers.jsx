import React, {useEffect, useState} from 'react'
import SmallSpinner from '../SmallSpinner';
import user from '../../../public/user.jpg';
import { useLocation, useNavigate } from 'react-router-dom';

//    Always fetches exactly three recommended users
const RecommendedUsers = () => {

    const [isFetching, setIsFetching] = useState(true);
    const [recommendedUsers, setRecommendedUsers] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecommendedUsers = async() => {
            const res = await fetch('http://localhost:3000/api/recommended', {
                method: 'POST',
                credentials: 'include',
                headers:{
                    'Content-Type': 'application/json'
                }
            });
            const data = await res.json();
            setIsFetching(false);

            if(!data.isRetrieved){
                setError(data.status);
                return;
            }
            console.log(data);
            setRecommendedUsers(data.recommendedUsers);
        }
        fetchRecommendedUsers();

    }, []);

   

    if(error) return <strong className='m-auto text-errorcolor'>{error}</strong>

  return (
   <div className= 'bg-bglight p-3 w-min-[300px] w-max-[400px] flex flex-col justify-evenly items-center border border-solid border-grayedcolor rounded-lg'>
        {recommendedUsers.map((userData, id) => 
            // <div className='w-full text-start p-2 pl-[5%] border-b-grayedcolor border-b-2' onClick={() => {navigate(`/user/${userData.username}`);}}>
            <div className='w-full text-start p-2 pl-[5%] border-b-grayedcolor border-b-2' onClick={() => {window.open(`http://localhost:5173/user/${userData.username}`,'_blank', 'rel=noopener noreferrer');}}>
                <img className='w-[60px] h-[60px] rounded-[100vh] inline border-2 border-solid border-themecolor' src={userData.img_public_id && !isFetching ? `https://res.cloudinary.com/duoljv54r/image/upload/${userData.img_version}/${userData.img_folder_name}/${userData.img_public_id}` :  user}/>
                {isFetching ? <SmallSpinner/> : <strong className='mx-4 my-2 p-2 text-xl'>{userData.username}</strong>}
            </div>
        )}
   </div>

  )
}

export default RecommendedUsers