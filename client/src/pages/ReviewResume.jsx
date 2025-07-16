import { Sparkles, File } from 'lucide-react';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import Markdown from 'react-markdown';

const ReviewResume = () => {
  axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

  const [input, setInput] = useState(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [copy, setCopy] = useState(false)
  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!input) {
      toast.error("Please select a file");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('resume', input);

      const token = await getToken();

      const { data } = await axios.post('/api/ai/resume-review', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "An error occurred");
      console.error(error);
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
      className="p-10 h-full overflow-y-scroll w-full"
    >
      <div className="w-full flex flex-wrap items-start justify-start gap-6">
        {/* Upload Box */}
        <div className="w-[30rem] bg-white rounded-xl shadow-lg p-8 gap-6 flex flex-col">
          <div className="flex items-center gap-2">
            <Sparkles className="h-7 w-7 text-[#00DA83]" />
            <p className="text-xl font-semibold text-gray-900">Review Resume</p>
          </div>

          <div className="w-full">
            <label className="text-sm font-medium text-gray-900 block mb-2">Upload Resume</label>
            <input
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setInput(e.target.files[0])}
              type="file"
              required
              className="pt-[3%] w-full h-12 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <p className="text-xs text-gray-500/70 mt-1">Supports PDF, JPG, PNG. Max size 5MB.</p>
          </div>

          <button
            onClick={onSubmitHandler}
            className="cursor-pointer w-full bg-gradient-to-r from-[#00DA83] to-[#009BB3] hover:opacity-90 text-white py-2 rounded-lg flex items-center justify-center gap-2"
          >
            {loading ? <Loader /> : <><File className="w-5 h-5" /> Review Resume</>}
          </button>
        </div>

        {/* Results Box */}
        <div className="w-135 h-130 bg-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <File className="h-7 w-7 text-[#00DA83]" />
              <p className="text-xl font-semibold text-gray-900">Analysis Results</p>
            </div>
            <div onClick={handleCopy} className="bg-[#009BB3] py-1 px-1 rounded-md cursor-pointer">
              {copy ? <img src='/copy-done.svg' className='w-4'></img> : <img src='/copy.svg' className='w-4'></img>}

            </div>
          </div>
          <div className="w-full h-[90%] overflow-y-scroll">
            {content.trim() ? (
              <div className="reset-tw">
                <Markdown>{content}</Markdown>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center pt-20 text-gray-500/70">
                <File className="h-14 w-14" />
                <p className="mt-4">Upload your resume and click "Review Resume" to get started.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ReviewResume;
