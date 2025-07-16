import {   Sparkles , EraserIcon} from 'lucide-react'
import React, { useState } from 'react'
import {motion} from 'framer-motion'
import toast from 'react-hot-toast'
import Loader from '../components/Loader'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react'

const RemoveBackground = () => {
const {getToken} = useAuth()

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL
const [image,setImage] = useState(null)
const [selectedImage,setSelectedImage] = useState(null);
const [input,setInput] = useState(null)
const [publish,setPublish] = useState(false)

const [loading,setLoading] = useState(false)
const onSubmitHandler =async (e)=>{
  e.preventDefault()
  try {
    setLoading(true)
    const formData = new FormData()
    formData.append('image',input)
    const {data} = await axios.post('api/ai/remove-image-background',formData,{
      headers:{
        Authorization:`Bearer ${await getToken()}`
      }
    })
    if(data.success){
      setImage(data.content)
    }else{
      toast.error(data.message)
    }
    
  } catch (error) {
    console.log(error.message)
    toast.error(error.message)
    
  }
  setLoading(false)


}
  return (
    <motion.div
    initial={{opacity:0,y:200}}
    whileInView={{opacity:1,y:0}}
    transition={{duration:1.2}}
     className='p-10 h-[100%] overflow-y-scroll  w-[100%] '>
      <div className="w-full flex flex-wrap items-start justify-start gap-6">
        {/*----------- generate article --------------- */}
        <div className="w-[30rem] rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-start justify-start p-8 gap-6">

          {/* Title */}
          <div className="flex items-center justify-start gap-2">
            <Sparkles className='h-7 w-7 text-[#FF4938]' />
            <p className='text-[1.5rem] font-semibold text-gray-900'>Background Removal</p>
          </div>

          {/* Topic Input */}
          <div className="w-full ">
            <label className='text-sm text-gray-900 font-medium block mb-2'>Upload Image</label>
            <input
            accept='image/*'
              onChange={(e)=>setInput(e.target.files[0])}
              
              type='file'
              required
              placeholder='Describe what you want to see in the Image..'
              className='w-full h-13 pt-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 text-sm placeholder-gray-400'
            />
            <p className='text-gray-500/70 my-1 text-xs'>Supports JPG,PNG,and other image formats</p>

          </div>

          

          {/* Generate Button */}
          <button onClick={onSubmitHandler} className='cursor-pointer w-full bg-gradient-to-r from-[#F6AB41] to-[#FF4938] hover:opacity-90 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition'>
            { loading?<Loader/>:<><EraserIcon className='w-5 h-5' />
            Remove Background</>}
          </button>
        </div>

        {/*----------------- result section ----------------------- */}
        <div className="w-135 h-130 bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="w-full flex items-center justify-start gap-2">
            <EraserIcon className='h-7 w-7 text-[#FF4938]' />
            <p className='text-[1.5rem] font-semibold text-gray-900'>Processed Image</p>
          </div>
          <div className="w-[100%] h-[95%]   flex items-center justify-center">
            {image ? (
              <img onClick={()=> window.open(image, "_blank")} src={image}></img>

            ) : (
              <div className="w-full flex flex-col items-center justify-start pt-34 h-[100%] w-[100%]">
                <EraserIcon className='h-14 w-14 text-gray-500/70' />
                <p className='text-gray-500/70 my-4'>Upload an Image and click"Generate Image" to get started</p>


              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default RemoveBackground;
