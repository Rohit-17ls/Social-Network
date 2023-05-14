import React, { useEffect, useState } from 'react'
import Spinner from './Spinner';
import UserPost from './UserPost';
import { useLocation} from 'react-router-dom';

const UserPosts = ({username, ordering}) => {

    const [status, setStatus] = useState('');
    const [posts, setPosts] = useState([]);
    const [isFetching, setIsFetching] = useState(true);
    const [refetch, setRefetch] = useState(0);
    const [rerender, setRerender] = useState(0);
    
    const location = useLocation();
    const [currentLocation, setCurrentLocation] = useState(location);

    useEffect(() => {
        if(posts.length){
            if(ordering === 'Recent'){
                console.log('reordering recent');
                posts.sort((postA, postB) => { 
                    if(new Date(postA.time_stamp) > new Date(postB.time_stamp)) return -1;
                    else return 1
                });
            }else if(ordering === 'Popular'){
                console.log('reordering popular');
                posts.sort((postA, postB) => { 
                    if(postA.likes + postA.dislikes > postB.likes + postB.dislikes) return -1;
                    else return 1;
                });
            }
            setRerender(!rerender);
        }

    }, [ordering]);

    useEffect(() => {

        const retrieveUserPosts = async() => {
            const res = await fetch(`http://localhost:3000/api/userposts`, {
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
                setStatus(data.status);
                return;
            }

            data.posts.map((post, ind) => {
                if(post.links.length) post.links = post.links.map((link, id) => link.link);
                if(post.tags.length)  post.tags = post.tags.map((tag, id) => tag.tag);
            })

            setPosts(data.posts);

        }

        retrieveUserPosts();

    }, [refetch, location, currentLocation]);

    


    if(status) return <div className='font-semibold'>{status}</div>

  return (
    <>{isFetching ? <Spinner/> :
    <section className='text-center w-fit h-fit mx-1 px-3'>
    {posts.map((post, id) => <UserPost key={id} 
                                        data={post} 
                                        refetch={refetch} 
                                        setRefetch={setRefetch} 
                                        rerender={rerender}
                                        setRerender={setRerender}
                                        />)}
    </section> 
    }
    </>
  )
}

export default UserPosts