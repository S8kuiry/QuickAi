import React from 'react'
import {useNavigate} from 'react-router-dom'
import {useClerk,useUser,UserButton} from '@clerk/clerk-react'

const Navbar = () => {
    const navigate = useNavigate()
    const {user} = useUser()
    const {openSignIn} = useClerk()
  return (
    <div className='z-20 backdrop-blur-xl fixed top-0 inset-x-0 bg-transparent
    flex items-center justify-between py-4 sm:px-20 xl:px-32'>
        <img onClick={()=> navigate('/')} className='w-32 sm:w-44 cursor-pointer' src='/logo.svg'></img>
        {
            user?<UserButton/>:(<button onClick={openSignIn} className='cursor-pointer flex items-center justify-center gap-3 bg-[var(--color-primary)] 
        rounded-full py-2 px-10 text-white '>Get Started <img src={'/arrow_icon.svg'}></img></button>)

        }
        
    </div>
  )
}

export default Navbar