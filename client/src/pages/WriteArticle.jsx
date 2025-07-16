import { PenBoxIcon, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import Loader from '../components/Loader.jsx';
import Markdown from 'react-markdown';

const WriteArticle = () => {
  const url = axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

  const articleLength = [
    { length: 800, text: "Short (500-800 words)" },
    { length: 1200, text: "Medium (800-1200 words)" },
    { length: 1600, text: "Long (1200+ words)" },
  ];

  const [selectedLength, setSelectedLength] = useState(articleLength[0]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const { getToken } = useAuth();
  const [copy, setCopy] = useState(false)



  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const prompt = `Write an article about ${input} of length ${selectedLength.text}`;
      const { data } = await axios.post(`/api/ai/generate-article`, {
        prompt,
        length: selectedLength.length
      }, {
        headers: {
          Authorization: `Bearer ${await getToken()}`
        }
      });

      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

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
      className='p-10 h-[100%] overflow-y-scroll w-[100%]'
    >
      <div className="w-full flex flex-wrap items-start justify-start gap-6">

        {/*----------- Generate Article Panel ---------------*/}
        <div className="w-[30rem] rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-start justify-start p-8 gap-6">
          <div className="flex items-center justify-start gap-2">
            <Sparkles className='h-7 w-7 text-blue-500' />
            <p className='text-[1.5rem] font-semibold text-gray-900'>AI Article Writer</p>
          </div>

          <div className="w-full">
            <label className='text-sm text-gray-900 font-medium block mb-1'>Article Topic</label>
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              type='text'
              placeholder='e.g., The future of artificial intelligence'
              className='w-full h-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 text-sm placeholder-gray-400'
            />
          </div>

          <div className="w-full">
            <label className='text-sm text-gray-900 font-medium block mb-2'>Article Length</label>
            <div className='flex flex-wrap gap-3'>
              {articleLength.map((itm) => (
                <button
                  key={itm.text}
                  onClick={() => setSelectedLength(itm)}
                  className={`cursor-pointer text-sm rounded-full py-2 px-4 ${selectedLength.text === itm.text
                    ? "bg-blue-50 text-blue-700 border border-blue-700"
                    : "text-gray-700/70 border border-gray-300"
                    }`}
                >
                  {itm.text}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={onSubmitHandler}
            className='cursor-pointer w-full bg-gradient-to-r from-[#226BFF] to-[#65ADFF] hover:opacity-90 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition'
          >
            {loading ? (
              <Loader />
            ) : (
              <>
                <PenBoxIcon className='w-5 h-5' />
                <span>Generate Article</span>
              </>
            )}
          </button>
        </div>

        {/*----------- Result Section ----------------*/}
        <div className="w-[31rem] min-h-[34rem] max-h-[35rem] bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
          <div className=" w-full flex items-center justify-between gap-2 mb-4">
            <div className="w-[70%]  flex gap-2 items-center">
              <PenBoxIcon className='h-7 w-7 text-blue-500' />
              <p className='text-[1.5rem] font-semibold text-gray-900'>Generated Article</p>
            </div>
            <div onClick={handleCopy} className="bg-[#226BFF] py-1 px-1 rounded-md cursor-pointer">
              {copy ? <img src='/copy-done.svg' className='w-4'></img> : <img src='/copy.svg' className='w-4'></img>}

            </div>
          </div>

          <div className="flex-1 overflow-y-scroll pr-4">
            {content.trim() ? (
                          <div className="reset-tw">
                            <Markdown>{content}</Markdown>
                          </div>
            ) : (
              <div className="w-full flex flex-col items-center justify-start pt-34 h-full">
                <PenBoxIcon className='h-14 w-14 text-gray-500/70' />
                <p className='text-gray-500/70 my-4'>Enter a topic and click "Generate Article" to get started</p>
              </div>
            )}
          </div>
        </div>











      </div>
    </motion.div>
  );
};

export default WriteArticle;
