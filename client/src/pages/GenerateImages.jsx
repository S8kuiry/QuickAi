import { Sparkles, Image } from 'lucide-react'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Loader from '../components/Loader'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react'
import toast from 'react-hot-toast'

const GenerateImages = () => {
  axios.defaults.baseURL = import.meta.env.VITE_BASE_URL
  const { getToken } = useAuth()

  const [image, setImages] = useState(null)
  const imageStyle = ['Realistic', 'Ghibli Style', 'Anime-Style', 'Cartoon-Style', 'Fantasy Style', 'Realistic Style', '3D Style', 'Potrait Style']
  const [selectedStyle, setSelectedStyle] = useState(imageStyle[0])
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState("")
  const [publish, setPublish] = useState(false)

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const prompt = `${input} in ${selectedStyle} manner`
      const { data } = await axios.post('/api/ai/generate-image', { prompt, publish }, {
        headers: {
          Authorization: `Bearer ${await getToken()}`
        }
      })
      if (data.success) {
        setImages(data.content)
      } else {
        toast.error(data.message || "Something went wrong")
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "Internal Server Error")
      console.log(error)
    }
    setLoading(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 200 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2 }}
      className='p-10 h-full overflow-y-scroll w-full'
    >
      <div className="w-full flex flex-wrap items-start justify-start gap-6">
        {/*----------- form section --------------- */}
        <div className="w-[30rem] rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-start justify-start p-8 gap-6">
          <div className="flex items-center justify-start gap-2">
            <Sparkles className='h-7 w-7 text-[#00AD25]' />
            <p className='text-[1.5rem] font-semibold text-gray-900'>AI Image Generator</p>
          </div>

          <div className="w-full">
            <label className='text-sm text-gray-900 font-medium block mb-2'>Describe Your Image</label>
            <textarea
              onChange={(e) => setInput(e.target.value)}
              value={input}
              placeholder='Describe what you want to see in the image...'
              required
              className='p-2 w-full h-28 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm placeholder-gray-400'
            />
          </div>

          <div className="w-full">
            <label className='text-sm text-gray-900 font-medium block mb-2'>Style</label>
            <div className='flex flex-wrap gap-3'>
              {imageStyle.map((itm) => (
                <button
                  key={itm}
                  onClick={() => setSelectedStyle(itm)}
                  className={`cursor-pointer text-sm rounded-full py-1 px-4 transition
                    ${selectedStyle === itm ? "bg-green-50 text-green-700 border border-green-700" : "text-gray-700/70 border border-gray-300"}`}>
                  {itm}
                </button>
              ))}
            </div>
          </div>

          <div className="my-2 flex items-center justify-start gap-3 w-full">
            <label className='relative inline-flex items-center cursor-pointer'>
              <input
                type='checkbox'
                onChange={(e) => setPublish(e.target.checked)}
                checked={publish}
                className='sr-only peer'
              />
              <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition-colors duration-200"></div>
              <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 transform peer-checked:translate-x-5"></span>
            </label>
            <p className='text-sm font-medium text-gray-700'>Make this image public</p>
          </div>

          <button
            onClick={onSubmitHandler}
            className='cursor-pointer w-full bg-gradient-to-r from-[#00AD25] to-[#04FF50] hover:opacity-90 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition'>
            {loading ? <Loader /> : <>
              <Image className='w-5 h-5' />
              Generate Image
            </>}
          </button>
        </div>

        {/*----------- image result section ----------- */}
        <div className="w-[32rem] h-[33rem] bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="w-full flex items-center justify-start gap-2 mb-4">
            <Image className='h-7 w-7 text-[#00AD25]' />
            <p className='text-[1.5rem] font-semibold text-gray-900'>Generated Image</p>
          </div>
          <div className="w-[100%] h-[85%] flex items-center justify-center pt-2">
            {image ? (
              <img onClick={()=> window.open(image, "_blank")} src={image} className='cursor-pointer w-full h-full object-contain cursor-pointer ' alt="Generated" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center">
                <Image className='h-14 w-14 text-gray-500/70' />
                <p className='text-gray-500/70 my-4 text-center'>Describe an image and click "Generate Image" to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default GenerateImages
