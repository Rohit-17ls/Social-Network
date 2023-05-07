import React, { useEffect, useRef } from 'react'
import Tag from './Tag'

const PostBody = ({data}) => {

    const postTextRef = useRef();

    useEffect(() => {
        postTextRef.current.innerHTML = data.text_content.replace(/@[a-zA-Z0-9_-]*/g, (match, id) => {
            return `<a href='/user/${match.slice(1,)}' class='text-tagcolor font-semibold no-underline'>${match}</a>`
        });
    }, []);


  return (
    <div className='w-full mb-4'>
        <div className='text-xl text-left text-clip py-3' ref={postTextRef}></div>
        <div className='text-left my-3'>
                 {data.links.map((link, id) => <a target="_blank" className='block' href={link} key={id}>{link}</a>)}
        </div>
        <div className='text-left my-3'>
            {data.tags.map((tag, id) => <Tag  key={id} tagName={tag}/>)}
        </div>
    </div>
  )
}

export default PostBody