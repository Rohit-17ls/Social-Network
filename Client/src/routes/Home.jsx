import React from "react";
import chat_logo from '../../public/social_chat.jpg'

const Signup = () => {

   return(
    <div className="absolute flex flex-row xl-max:flex-col items-center left-0 h-3/4 w-100vw h-100vh bg-[#a8fc94] my-0" style={{width:'100vw', height: '100vh'}}>
            <div className="flex flex-col justify-center w-2/3 h-full my-5">
                <span className="text-black font-semibold text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">Simple.Secure.Reliable</span>
                <span className="block text-black font-semibold text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl mb-5 sm :mb-0 md:mb-3 lg:mb-4 xl:mb-5">Messaging</span>
                <span className="text-black text-xs sm:text-sm md:text-lg lg:text-xl xl:text-2xl">Simple, reliable, private messaging</span>
                <span className="text-black text-xs sm:text-sm md:text-lg lg:text-xl xl:text-2xl">available all over the world.</span>
            </div>
            <div className="flex justify-center m-5 h-full">
                <img src={chat_logo} alt="chat_logo" className="w-[500px] m-auto"/>
            </div> 
      </div>
   )
}

export default Signup;