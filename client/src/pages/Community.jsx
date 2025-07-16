import React, { use, useEffect, useState } from 'react'
import { useAuth, useUser } from '@clerk/clerk-react'
import { dummyPublishedCreationData } from '../assets/assets'
import { Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import axios from 'axios'
import toast from 'react-hot-toast'
import Loader from '../components/Loader'


const Community = () => {
  axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

  const [creations, setCreations] = useState([])
  const { user } = useUser()
  const { getToken } = useAuth()
  const [loading, setLoading] = useState(false)
  const fetchCreations = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get('/api/user/get-published-creations', {
        headers: {
          Authorization: `Bearer ${await getToken()}`
        }
      })
      if (data.success) {
        setCreations(data.creations)
      } else {
        toast.error(error.message)
      }

    } catch (error) {
      toast.error(error.message);
      console.error(error);

    }
    setLoading(false)

  }

  const imageLikeToggle = async (id) => {
    try {
      const { data } = await axios.post('/api/user/toggle-like-creation', {id},{
        headers: {
          Authorization: `Bearer ${await getToken()}`
        }
      })

      if(data.success){
        toast.success(data.message)
        await fetchCreations()
      }else{
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message);
      console.error(error);


    }
  }
  useEffect(() => {
    if (user) {
      fetchCreations()
    }
  }, [user])
  return (
    <motion.div
      initial={{ opacity: 0, y: 150 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2 }}
      className='p-10 h-[100%] w-[100%]  pb-20' >
      <div className="w-full flex items-start justify-start ">
        <p className='font-medium'>Community</p>
      </div>
      <div className="bg-white mt-8 h-[580px] w-full rounded-xl overflow-y-scroll  p-2">
        {loading ? <><Loader community={true} /></> : creations.map((itm) => (
          <div className="relative group inline-block pl-3 pt-3 w-full sm:max-w-1/2 lg:max-w-1/3 pr-3">
            <img src={itm.content} className='w-full h-full object-cover  rounded-lg'></img>
            <div className="absolute bottom-0 top-0  right-0 left-3 flex gap-2 items-end justify-end group-hover:justify-between p-3 group-hover:bg-gradient-to-b from-transparent to-black/80  text-white rounded-lg 
            transition duration-300 ease-in-out">
              <p className='text-sm hidden group-hover:block transition duration-300 ease-in-out'>{itm.prompt}</p>
              <div className="flex gap-1 items-center">
                <p>{itm.likes.length}</p>
                <Heart onClick={()=>imageLikeToggle(itm.id)} className={`min-w-5 h-5 hover:scale-110 cursor-pointer ${itm.likes.includes(user.id) ? 'fill-red-500 text-red-600' : 'text-white'}`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default Community