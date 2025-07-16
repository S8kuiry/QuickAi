import React from 'react'
import assets from '../assets/assets'
import { motion } from 'framer-motion'

const TestiMonials = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 150 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1 }}
            className='w-[100%] flex flex-col items-center justify-start mt-[10rem]'>
            <h1 className='text-5xl font-semibold text-gray-900 my-4'>Loved By Creators</h1>
            <p className='w-full text-center text-gray-500 text-center '>Don't just take our word for it. Here's what our users are saying.</p>

            {/*---------- testimonials data ------*/}
            <div className="w-[90%] flex flex-wrap items-center justify-center my-[5rem] gap-6">
                {assets.dummyTestimonialData.map((itm, index) => (
                    <motion.div
                        whileHover={{ y: -6 }}

                        transition={{ duration: 0.2 }}

                        key={index}
                        className="flex flex-col py-6 px-6 w-[20rem] h-[17rem] cursor-pointer rounded-lg shadow-[0_0_10px_0_rgba(0,0,0,0.2)] bg-white"
                    >
                        {/* Stars row */}
                        <div className="flex gap-1 mb-3">
                            {Array(5)
                                .fill(0)
                                .map((_, i) => (
                                    <img
                                        key={i}
                                        src={i < itm.rating ? assets.assets.star_icon : assets.assets.star_dull_icon}
                                        alt="star"
                                        className="w-4 h-4"
                                    />
                                ))}
                        </div>

                        {/* Content */}
                        <p className="text-gray-400 text-[0.9rem] mb-4">{itm.content}</p>

                        {/* Divider */}
                        <hr className="w-full border-t border-gray-300 my-2" />

                        {/* Name and Title */}
                        <div className="flex items-center justify-center gap-4 mt-6">
                            <img src={itm.image} className='w-12'></img>
                            <div className="mt-auto">
                                <p className="text-gray-900 font-semibold text-[1rem]">{itm.name}</p>
                                <p className="text-gray-500 text-[0.85rem]">{itm.title}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>


        </motion.div>
    )
}

export default TestiMonials