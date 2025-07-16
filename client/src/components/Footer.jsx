import React, { useState } from 'react'
import { motion } from 'framer-motion'


const Footer = () => {
    const [copied, setCopied] = useState(false)
    const email = "subharthykuiry@gmail.com"

    const emailHandler = () => {
        navigator.clipboard.writeText(email)
        setCopied(true)
        setInterval(() => {
            setCopied(false)
        }, 1500)
    }
    return (
        <div className='w-[100%]  h-[10rem] '>
            <footer className="px-6 md:px-16 lg:px-24 xl:px-32 pt-8 w-full text-gray-500">
                <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-500/30 pb-6">
                    <div className="md:max-w-96">
                        <motion.div
                            whileHover={{ scale: 1.03, y: -5 }}
                            className="cursor-pointer text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 font-extrabold text-2xl tracking-tight gap-6">
                            MadeBy
                            <span className="ml-3 text-white bg-black px-2 py-1 rounded-md shadow-sm text-xl ">
                                Subharthy
                            </span>
                        </motion.div>
                        <p className="mt-6 text-sm">
                            I’m Subharthy Kuiry building *Quick AI* as a practice project. Let’s collaborate and create impactful projects together.
                            Experience AI-powered content creation—write, generate, and enhance with QuickAI.

                        </p>
                    </div>

                    <div className="flex-1 flex items-start md:justify-end gap-20">
                        <div>
                            <h2 className="font-semibold mb-5 text-gray-800">Connect </h2>
                            <ul className="text-sm  space-y-2">
                                <motion.li whileHover={{ translateX: 5 }} className='hover:text-purple-500 hover:underline font-semibold'>
                                    <a href="https://github.com/S8kuiry" target="_blank" rel="noopener noreferrer">Github</a>
                                </motion.li>
                                <motion.li whileHover={{ translateX: 5 }} className='hover:text-purple-500 hover:underline font-semibold'>
                                    <a href="https://www.linkedin.com/in/subharthy-kuiry-5b568927b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer">Linkedin</a>
                                </motion.li>
                                <motion.li whileHover={{ translateX: 5 }} className='hover:text-purple-500 hover:underline font-semibold'>
                                    <a href="https://api.whatsapp.com/send/?phone=917980647151&text=Hi+Subharthy%2C+I+saw+your+project%21&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer">WhatsApp</a>
                                </motion.li>
                                <motion.li whileHover={{ translateX: 5 }} className='hover:text-purple-500 hover:underline font-semibold'>
                                    <a href="https://portfolio-git-main-subharthys-projects.vercel.app/" target="_blank" rel="noopener noreferrer">Check Out my Portfolio</a>
                                </motion.li>
                            </ul>

                        </div>

                        <div>
                            <h2 className="font-semibold text-gray-800 mb-5">Contact</h2>
                            <div className="text-sm space-y-2">
                                <p>Get in touch with me via email for updates, ideas, or collaborations.</p>
                                <div className="flex items-center gap-2 pt-4">

                                    <button onClick={emailHandler} className="cursor-pointer bg-[var(--color-primary)] w-54 h-9 text-white rounded-md flex
                                    items-center justify-center gap-4">
                                        { copied?<img src='/copy-done.svg' className='w-3'></img>: <img src='/copy.svg' className='w-3'></img>}
                                        {copied ? "Copied" : "Copy Email Address"}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <p className="pt-4 text-center text-xs md:text-sm pb-5">
                    Copyright 2024 © Subharthy Kuiry. All Rights Reserved.
                </p>
            </footer>
        </div>
    )
}

export default Footer
