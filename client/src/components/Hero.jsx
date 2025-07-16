import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {useUser,useClerk} from '@clerk/clerk-react'
const Hero = () => {
    const {user} = useUser()
    const {openSignIn} = useClerk()
    const navigate = useNavigate()
    return (
        <motion.div
            initial={{ opacity: 0, y: 150 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1 }}
            className='px-4 sm:px-20 xl:px-32 relative inline-flex flex-col w-full items-center justify-center 
    bg-[url(/gradientBackground.png)] bg-cover bg-no-repeat min-h-screen mb-[-6rem]'>
            <p className='text-6xl w-full text-center font-bold mb-8'>Create Amazing Content<br></br> with <span className='text-[var(--color-primary)] my-2'>AI tools</span> </p>
            <p className='text-[1rem] text-gray-500 w-full text-center  '>Transform your content creation with our suite of premium Ai tools</p>
            <p className='text-[1rem] text-gray-500 w-full text-center  '>Write articles, generate images, and enhance your workflow.</p>


            {/*- button section -*/}
            <div className="w-5xl flex items-center justify-center gap-4 mt-6 ">
                <button onClick={user?()=>navigate('/ai'):openSignIn} className='cursor-pointer py-4 rounded-md px-10 bg-[var(--color-primary)] text-white'>Start Creating Now</button>
                <button className='cursor-pointer py-4 rounded-md px-8 bg-white text-gray-900 shadow-gray-300 shadow-md'>Watch Demo</button>

            </div>
            {/*-Images- */}
            <div className="w-5xl flex items-center justify-center gap-4 mt-8">
                <img src='/user_group.png' className='w-[7rem]'></img>
                <p className='text-gray-600'>Trusted by 10k+ people</p>
            </div>


        </motion.div>
    )
}

export default Hero