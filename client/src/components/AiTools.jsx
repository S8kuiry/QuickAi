import React from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useUser } from '@clerk/clerk-react'


const AiTools = () => {
    const navigate = useNavigate()
    const { user } = useUser()
    return (
        <motion.div
            initial={{ opacity: 0, y: 150 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1 }}
            className='w-full flex flex-col items-center justify-center mt-[6rem] '>
            <h1 className='text-5xl font-semibold text-gray-900 my-4'>Powerful AI Tools</h1>
            <p className='w-full text-center text-gray-600 text-center '>Everything you need to create, enhance, and optimize your content with<br></br> cutting-edge AI technology.</p>

            {/*----------- data section -------------- */}
            <div className="w-[90%] flex flex-wrap items-center justify-center gap-8 mt-10">
                {
                    assets.AiToolsData.map((itm) => (
                        <motion.div
                            whileHover={{ y: -6 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => user && navigate(`${itm.path}`)} className="flex w-[21rem] h-[15rem] flex-col items-start
                    gap-4 py-6 px-6 rounded-lg shadow-[0_0_10px_0_rgba(0,0,0,0.2)] ">
                            <itm.Icon style={{ background: `linear-gradient(135deg, ${itm.bg.from}, ${itm.bg.to})`, color: 'white' }} className={`w-12 h-12 rounded-xl p-3 `} />
                            <p className='font-bold text-gray-900 text-xl'>{itm.title}</p>
                            <p className='text-gray-400 text-[0.9rem]'>{itm.description}</p>

                        </motion.div>
                    ))
                }

            </div>
        </motion.div>
    )
}

export default AiTools