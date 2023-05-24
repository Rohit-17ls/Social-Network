import React, { useState, useEffect, useRef } from 'react'
import Spinner from '../components/Spinner';
import NeedsAuthentication from '../components/NeedsAuthentication';
import SmallSpinner from '../components/SmallSpinner';
import ExplorePost from '../components/Posts/ExplorePost'

const lorem = `  Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt ea enim, facere repellendus mollitia nostrum quisquam animi eligendi aperiam blanditiis corrupti non est. Rem et consectetur neque laudantium officiis eligendi.
Atque ipsum voluptas saepe voluptates inventore voluptatum unde, praesentium qui assumenda tempore aperiam nulla, hic magni iusto adipisci quisquam! Doloremque fugiat vitae iste iusto suscipit eius aliquam veniam ab debitis!
Rem voluptas impedit ea doloremque, ullam non asperiores consequatur totam commodi, unde iste. Repellat totam magni deleniti assumenda dolorum laboriosam adipisci quod, dolorem in sapiente autem omnis reprehenderit architecto? Iste?
Et iste, obcaecati placeat officiis ratione eveniet ea. Assumenda, nobis aperiam. Cum nostrum, vitae, quidem deserunt, ullam ipsa necessitatibus pariatur cupiditate mollitia suscipit officiis rem dignissimos officia nobis soluta accusantium?
Accusantium dolores, quas, recusandae modi fugiat facilis animi odio, ipsum magnam sequi nemo consectetur repellat? Quae ipsum architecto quo, odit, optio fuga pariatur mollitia doloribus sunt quidem, animi perspiciatis eligendi!`
const renders = [Math.round(Math.random()*15), Math.round(Math.random()*7)];

const Explore = () => {

 const [isAuthorized, setIsAuthorized] = useState(true);
 const [isLoading, setIsLoading] = useState(true);
 const [isIntersecting, setIsIntersecting] = useState(false);
 const [offset, setOffset] = useState(0);
 const [posts, setPosts] = useState([]);
 const [isFetching, setIsFetching] = useState(false);
 const [error, setError] = useState('');

 const observedRef = useRef();

  useEffect(() => {
    const fetchPosts = async() => {
        setIsFetching(true);
        console.log('Refetching');
        const res = await fetch('http://localhost:3000/api/explore', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({offset: offset*3})
        });
        const data = await res.json();
        console.log(data);
        
        if(!offset) setIsLoading(false);
        setIsFetching(false);
        
        if(data.unauthorized){
            setIsAuthorized(false);
            return;
        }
        
        if(!data.isRetrieved){
            setError(data.status);
            return;
        }
        
        data.posts.forEach((post) => {
            post.links = post.links.map((link, id) => link.link);
            post.tags = post.tags.map((tag, id) => tag.tag);
        })
        

        setPosts([...posts, ...data.posts]);
    }
    console.log(isIntersecting);
    if(isIntersecting || isLoading){
        fetchPosts();
        setOffset(offset+1);
    }

  }, [isIntersecting]);

  useEffect(() => {
    if(observedRef.current){

        const intersectionObserver = new IntersectionObserver(
            ([entry]) => {

                // setOffset(offset + 1);
                setIsIntersecting(entry.isIntersecting);
            }, {rootMargin: '200px'});
    
    
            // Subscribe to the observe method
            intersectionObserver.observe(observedRef.current);
    
            return () => {
                intersectionObserver.disconnect();
            }
    }

  }, [isIntersecting, isLoading])

  if(!isAuthorized) return <NeedsAuthentication/>

  return (
    <div>
        <strong className='block w-[100vw] text-3xl mx-auto mt-[4em] my-0 h-fit p-3'>Explore</strong>
        {isLoading ? <Spinner/> : 
        // {!isLoading ? <Spinner/> : 
        
        <div>
            <section className='my-4'>
            {
                posts.map((post, id) => <div><ExplorePost data={post}/></div>)
            }
            
            </section>
        
            <div ref={observedRef} className={`h-[100px] ${'py-4'}`}>
                {error ? <strong className='block p-[30px] mx-auto my-[6vh]'>You've probably reached the end</strong> :
                    <>
                    <strong className='text-xl block my-3'>Stick with us while we bring you latest the posts</strong>
                    <SmallSpinner/>
                </>}

            </div>    

            
        </div>


        }
    </div>
   
  )
}

export default Explore