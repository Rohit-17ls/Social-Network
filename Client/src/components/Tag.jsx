import React from 'react'
import { useNavigate } from 'react-router-dom'

const Tag = ({tagName}) => {

    const navigate = useNavigate();

  return (
    <span className='m-2 text-themecolor font-semibold' onClick={() => navigate(`/user/${tagName}`)}>@{tagName}</span>
  )
}

export default Tag