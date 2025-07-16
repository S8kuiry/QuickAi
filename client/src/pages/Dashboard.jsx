import { Gem, Sparkle, Sparkles, Stars } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { dummyCreationData } from '../assets/assets'
import { Protect, useAuth } from '@clerk/clerk-react'
import CreationItem from '../components/CreationItem'
import {motion} from 'framer-motion'
import {useUser,useClerk} from '@clerk/clerk-react'
import axios from 'axios'
import Loader from '../components/Loader.jsx'
import toast from 'react-hot-toast'


const Dashboard = () => {
  axios.defaults.baseURL = import.meta.env.VITE_BASE_URL
  const [loading,setLoading] = useState(false)

  const [creations,setCreations] = useState([])
  const {getToken} = useAuth()
  const getDashboardData = async ()=>{
    try {
      setLoading(true)
      const {data} = await axios.get('/api/user/get-user-creations',{headers:{
        Authorization:`Bearer ${await getToken()}`
      }})
      if(data.success){
        setCreations(data.creations)
      }else{
        toast.error(data.message)
      }
      
    } catch (error) {
       toast.error(error.message);
      console.error(error);
      
    }
    setLoading(false)
    
  }
  
  const {user} = useUser()
const userPlan = user?.publicMetadata?.plan || "Free"


useEffect(()=>{
  getDashboardData()

},[])
  return (
    <motion.div
    initial={{opacity:0,y:200}}
    whileInView={{opacity:1,y:0}}
    transition={{duration:1.2}}

     className="h-[100%] overflow-y-scroll  w-[100%] p-10">
      <div className="flex justify-start gap-4 flex-wrap ">
        {/*-------------- Total Creations Card ----------------- */}

        <motion.div 
        whileTap={{scale:0.96}}
        whileHover={{scale:1.01,y:-5}}
        className="shadow-gray-300/80 shadow-xl bg-white flex justify-between items-center w-78 h-32 p-4 px-6 border border-gray-400/70 rounded-lg">
            <div className="flex flex-col gap-2 ">
              <p className='text-gray-500'>Total Creations</p>
              <h2 className='font-bold text-gray-900 text-2xl'>{loading?<Loader community={true}/>:creations.length}</h2>
            </div>
            <div className="rounded-lg w-13 h-13 bg-gradient-to-br from-[#3588F2] to-[#0BB0D7] text-white flex justify-center items-center">
              <Sparkles className='w-6 text-white'  />
            </div>

        </motion.div>
        {/*----------- Total Creations Card ----------------- */}

        <motion.div
         whileTap={{scale:0.96}}
        whileHover={{scale:1.01,y:-5}}
         className=" shadow-gray-300/80 shadow-xl bg-white flex justify-between items-center w-78 h-32 p-4 px-6 border border-gray-400/70 rounded-lg">
            <div className="flex flex-col gap-2 ">
              <p className='text-gray-500'>Active Plan</p>
              <h2 className='font-semibold text-gray-900 text-xl'>
                <Protect plan={'premium'} fallback="Free">{userPlan}</Protect>
              </h2>
            </div>
            <div className="rounded-lg w-13 h-13 bg-gradient-to-br from-[#FF61C5] to-[#9E53EE] text-white flex justify-center items-center">
              <Gem className='w-6 text-white'  />
            </div>

        </motion.div>

      </div>

      {/*---------- recent creations ------------- */}
      <div className="mt-14">
        <p className='text-2xl font-semibold mb-4'>Recent Creations</p>
        <div className="flex flex-col items-center justify-start">
          {loading?<Loader community={true}/>:creations.map((item)=>(
            <CreationItem item={item} getDashboardData={getDashboardData}/>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default Dashboard
