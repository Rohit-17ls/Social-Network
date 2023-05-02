import React from "react";
import { Link } from "react-router-dom";

const Signup = () => {

   return(
    <div className='flex flex-col gap-3'>
      <h1 className="text-white text-bold">List of routes just for testing, comment out when writing code  for this component</h1>
      <Link to="/user/asdf">Profile</Link>
      <Link to="/login">Login</Link>
      <Link to="/signup">Signup</Link>
      <Link to="/new/post">New Post</Link>

    </div>
   )
}

export default Signup;