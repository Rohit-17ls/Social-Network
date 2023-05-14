import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../public/social_network_logo.png'
import useGetCookie from '../hooks/useGetCookie';


const Navbar = () => {

  const getCookie = useGetCookie();
  const navigate = useNavigate();

  return (
    <div className='w-full z-10 h-20 sm:h-16 md:h-16 lg:h-20 xl:h-24 fixed p-4  bg-themecolor text-white flex flex-row justify-between items-center text-2xl'>
      <div className='flex flex-row justify-start items-center' onClick={() => {navigate('/')}}>
        <img src={logo} alt='logo' className='w-12 ml-1 sm:w-8 md:w-12 lg:w-16 xl:w-16 md:ml-3 sm:ml-2'/>
        <span className='text-themecolor sm:text-white text-xs/4 sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold ml-2 md:ml-5 sm:ml-2'>Social Network</span>
      </div>
      <div className='text-xs sm:text-sm md:text-md lg:text-lg xl:text-xl'>
        <Link className='text-white hover:text-blurcolor no-underline font-bold' to={`/user/${getCookie('jwt') ? JSON.parse(atob(getCookie('jwt')?.value.split('.')[1])).username : ''}`}>Profile</Link>
        <Link className='text-white no-underline mx-12 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-20 font-bold hover:text-blurcolor' to="/login">Login</Link>
        <Link className='text-white no-underline mr-10 font-bold hover:text-blurcolor sm:mr-3 md:mr-5 lg:mr-7 xl:mr-10' to="/signup">Signup</Link>        
      </div>
    </div>
  )
}

export default Navbar