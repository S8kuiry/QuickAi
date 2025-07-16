import React from 'react'
import assets from '../assets/assets'
import {PricingTable} from '@clerk/clerk-react'
import {motion} from 'framer-motion'

const Plan = () => {
  return (
    <motion.div 
    initial={{ opacity: 0, y: 150 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1 }}
    className='flex flex-col w-full items-center justify-center mt-[8rem] mb-[8rem]' >
        <h1 className='text-5xl font-semibold text-gray-900 my-4'>Choose Your Plan</h1>
        <p className='w-full text-center text-gray-500 text-center '>Start for free and scale up as you grow. Find the perfect plan for your<br></br>content creation needs.</p>

        <div className="w-2xl flex flex-wrap items-center justify-center gap-4 mt-[5rem]">
            <PricingTable 
         
            className="w-[21rem]"/>
        </div>
    </motion.div>
  )
}

export default Plan