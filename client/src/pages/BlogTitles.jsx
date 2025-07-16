import { Pen, HashIcon, Sparkles } from 'lucide-react'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Loader from '../components/Loader.jsx';
import axios from 'axios'
import toast from 'react-hot-toast';
import { useAuth } from '@clerk/clerk-react';
import ReactMarkdown from 'react-markdown';






const BlogTitles = () => {
  axios.defaults.baseURL = import.meta.env.VITE_BASE_URL
  const [content, setContent] = useState("")
  const blogCategories = ['General', 'Technology', 'Business', 'Health', 'Lifestyle', 'Education', 'Travel', 'Food']
  const [selectedCategory, setselectedCategory] = useState(blogCategories[0])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [copy, setCopy] = useState(false)

  const { getToken } = useAuth()


  const onSubmitHandler = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const prompt = `Generate a blog title for the keyword ${input} in the category ${selectedCategory}`
      const { data } = await axios.post('/api/ai/blog-title', { prompt }, {
        headers: {
          Authorization: `Bearer ${await getToken()}`
        }
      })
      if (data.success) {
        setContent(data.content)

      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
      console.log(error.message)

    }
    setLoading(false)


  }


  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content); // ✅ Use it as a function
      setCopy(true);
      setTimeout(() => setCopy(false), 1500);
    } catch (err) {
      toast.error("Clipboard copy failed: " + err.message);
      console.error(err);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 200 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2 }}
      className='p-10 h-[100%] overflow-y-scroll  w-[100%] '>
      <div className="w-full flex flex-wrap items-start justify-start gap-6">
        {/*----------- generate article --------------- */}
        <div className="w-[30rem] rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-start justify-start p-8 gap-6">

          {/* Title */}
          <div className="flex items-center justify-start gap-2">
            <Sparkles className='h-7 w-7 text-purple-500' />
            <p className='text-[1.5rem] font-semibold text-gray-900'>AI Title Generator</p>
          </div>

          {/* Topic Input */}
          <div className="w-full">
            <label className='text-sm text-gray-900 font-medium block mb-1'>Keyword</label>
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              type='text'
              placeholder='e.g., The future of artificial intelligence'
              className='w-full h-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 text-sm placeholder-gray-400'
            />
          </div>

          {/* Article Length */}
          <div className="w-full">
            <label className='text-sm text-gray-900 font-medium block mb-2'>Category</label>
            <div className='flex flex-wrap gap-3'>
              {blogCategories.map((itm) => (
                <button onClick={() => setselectedCategory(itm)} className={`cursor-pointer w-30 text-sm  rounded-full py-2 px-4 
                  ${selectedCategory === itm ? "bg-purple-50 text-purple-700 border border-purple-700" : "text-gray-700/70 border border-gray-300"}`}>{itm}</button>

              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button onClick={onSubmitHandler} className='cursor-pointer w-full bg-gradient-to-r from-[#C341F6] to-[#8E37EB] hover:opacity-90 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition'>
            {loading ? <>
              <Loader />
            </> : <>
              <HashIcon className='w-5 h-5' />
              Generate Title
            </>}
          </button>
        </div>

        {/*----------------- result section ----------------------- */}

        <div className="w-[31rem] min-h-[34rem] max-h-[35rem] bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
          <div className="w-full flex items-center justify-between gap-2 mb-4">
            <div className="w-[70%] flex items-center  gap-2">
              <HashIcon className='h-7 w-7 text-[#8E37EB]' />
              <p className='text-[1.5rem] font-semibold text-gray-900'>Generated Title</p>
            </div>
            <div onClick={handleCopy} className="bg-[#8E37EB] py-1 px-1 rounded-md cursor-pointer">
              {copy ? <img src='/copy-done.svg' className='w-4'></img> : <img src='/copy.svg' className='w-4'></img>}

            </div>
          </div>

          <div className="flex-1 overflow-y-scroll pr-4">
            {typeof content === 'string' && content.trim() ? (
              <div className="prose prose-sm sm:prose lg:prose-lg max-w-none pb-10">
                <ul className="list-disc pl-6">
                  {content
                    .split('\n')
                    .filter(line => line.trim())
                    .map((line, i) => {
                      const cleanLine = line
                        .replace(/[*_~`#>]+/g, '') // Removes *, _, ~, `, #, > etc.
                        .trim();
                      return <li key={i}>{cleanLine}</li>;
                    })}

                </ul>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center justify-start pt-34 h-full">
                <HashIcon className='h-14 w-14 text-gray-500/70' />
                <p className='text-gray-500/70 my-4'>Enter a topic and click "Generate Article" to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default BlogTitles;
