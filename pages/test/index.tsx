import React from 'react';

const NewWebsiteButton = () => {
  return (
    <button className="bg-[#FF4D70] hover:bg-[#FF3660] text-white font-semibold py-2 px-6 rounded-full inline-flex items-center transition duration-300 ease-in-out">
      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span className="text-lg">New Website</span>
    </button>
  );
};

export default NewWebsiteButton;