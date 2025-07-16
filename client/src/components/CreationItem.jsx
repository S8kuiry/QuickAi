import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Markdown from 'react-markdown';
import { Trash } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios'; // ✅ ADD THIS

const CreationItem = ({ item, getDashboardData }) => { // ✅ Pass this prop from parent
  const [expanded, setExpanded] = useState(false);
  const { getToken } = useAuth();

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this creation?');
    if (!confirm) return;

    try {
      const { data } = await axios.delete('/api/user/delete', {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
        data: { id },
      });

      if (data.success) {
        toast.success(data.message);
        getDashboardData?.(); // Only if passed
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }
  };

  return (
    <motion.div
     
      // Click to toggle expand
      className="cursor-pointer shadow-gray-300/60 shadow-xl w-full border border-gray-300/20 rounded-lg min-h-28 h-auto my-2 bg-white flex flex-col px-6 py-4"
    >
      <div className="w-full flex items-center justify-between">
        <div  onClick={() => setExpanded(!expanded)} className="w-[90%]">
          <p className="text-lg font-semibold">{item.prompt}</p>
          <p className="text-gray-500 text-sm">
            {item.type} - {new Date(item.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="border border-blue-300 rounded-full py-2 px-4 min-w-24 w-auto h-10 flex items-center gap-2 justify-center text-sm">
            {item.type}
          </button>
          {/* The delete button */}
          <Trash
           onClick={(e) => {
    e.stopPropagation(); // ✅ Fixes issue
    handleDelete(item.id);
  }}
            className="w-5 h-5 cursor-pointer hover:text-red-600"
          />
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: -10 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: -10 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            {item.type === 'image' ? (
              <p
                onClick={() => window.open(item.content, '_blank')}
                className="text-sm text-gray-900/75 hover:underline hover:text-blue-500 my-2"
              >
                Click here to see the image
              </p>
            ) : (
              <p className="reset-tw w-[90%] mt-4 text-sm text-gray-900/75">
                <Markdown>{item.content}</Markdown>
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CreationItem;
