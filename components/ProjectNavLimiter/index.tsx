import React from 'react';

const ProjectLimitBanner = ({ projectCount = 0 }) => {
  return (

<div className="w-full p-4">
  <div className="bg-white border border-blue-200 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between shadow-sm max-w-3xl">
    <div className="flex items-center space-x-2 mb-4 sm:mb-0">
      <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <div className="flex flex-col sm:flex-row sm:items-center">
        <span className="text-gray-700 font-medium text-sm mr-2">
          You have {projectCount} projects left
        </span>
        <span className="text-gray-500 text-xs">
          Get Pro for unlimited access
        </span>
      </div>
    </div>
    <button className="relative inline-flex items-center justify-center p-[2px] bg-gradient-to-r from-[#ff5f6d] to-[#5c54f2] rounded-full">
      <span className="inline-flex items-center justify-center bg-black text-white font-bold py-2 px-4 rounded-full">
        Upgrade to Pro
      </span>
    </button>
  </div>
</div>

  // </div>
  );
};

export default ProjectLimitBanner;