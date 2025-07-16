import { Sparkles, Scissors } from 'lucide-react';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Loader from '../components/Loader';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const RemoveObject = () => {
  const [image, setImage] = useState(null);
  const [selectImage, setSelectImage] = useState(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (input.trim().split(' ').length > 1) {
      toast.error("Please enter only one object name.");
      return;
    }

    if (!selectImage) {
      toast.error("Please upload an image.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('image', selectImage);
      formData.append('object', input);

      const { data } = await axios.post('/api/ai/remove-image-object', formData, {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });

      if (data.success) {
        setImage(data.content);
        toast.success("Object removed successfully!");
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 200 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2 }}
      className="p-10 h-full overflow-y-scroll w-full"
    >
      <div className="w-full flex flex-wrap gap-6">
        {/* Input Panel */}
        <div className="w-[30rem] bg-white rounded-xl shadow-lg p-8 flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-[#417DF6]" />
            <p className="text-xl font-semibold text-gray-900">Object Removal</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectImage(e.target.files[0])}
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-400"
            />
            <p className="text-xs text-gray-500 mt-1">Supports JPG, PNG, and other image formats</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Describe Object to Remove</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., tree"
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-400"
            />
            <p className="text-xs text-gray-500 mt-1">Only one object name (e.g., 'car')</p>
          </div>

          <button
            onClick={onSubmitHandler}
            className="cursor-pointer bg-gradient-to-r from-[#417DF6] to-[#8E37EB] text-white py-2 rounded-lg hover:opacity-90 flex items-center justify-center gap-2 transition"
          >
            {loading ? <Loader /> : <>
              <Scissors className="w-5 h-5" /> Remove Object
            </>}
          </button>
        </div>

        {/* Result Panel */}
        <div className="w-135 h-130 bg-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Scissors className="h-7 w-7 text-[#417DF6]" />
            <p className="text-xl font-semibold text-gray-900">Processed Image</p>
          </div>
          <div className="w-[100%] h-[85%] flex items-center justify-center">
            {image ? (
              <img onClick={()=> window.open(image, "_blank")} src={image} alt="Processed" className="cursor-pointer max-w-full max-h-full object-contain" />
            ) : (
              <div className="text-center text-gray-500">
                <Scissors className="w-12 h-12 mx-auto mb-4" />
                <p>Upload an image and describe the object to remove</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RemoveObject;
