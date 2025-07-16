import React from 'react';

const Loader = ({community}) => {
  return (
    <div className="flex items-center justify-center w-full h-full bg-transparent my-2">
      <div className="flex space-x-1">
        <span className={`w-2 h-2 ${community?"bg-purple-500":"bg-white"} rounded-full bounce-dot`} style={{ animationDelay: '0s' }}></span>
        <span className={`w-2 h-2 ${community?"bg-purple-500":"bg-white"} rounded-full bounce-dot`} style={{ animationDelay: '0.2s' }}></span>
        <span className={`w-2 h-2 ${community?"bg-purple-500":"bg-white"} rounded-full bounce-dot`} style={{ animationDelay: '0.4s' }}></span>
      </div>
    </div>
  );
};

export default Loader;
