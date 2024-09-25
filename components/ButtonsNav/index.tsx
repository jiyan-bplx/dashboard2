import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from "@headlessui/react";
import { PencilIcon, CogIcon } from '@heroicons/react/24/solid';

interface CompanyInfo {
  name: string;
  description: string;
}

export default function NewWebsitePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [companyInfoList, setCompanyInfoList] = useState<CompanyInfo[]>([]);


  return (
    <div className="container mx-auto p-4">
      {/* New Website Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-[#FF4D70] hover:bg-[#FF3660] text-white font-semibold py-2 px-6 rounded-full inline-flex items-center transition duration-300 ease-in-out"
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-lg">New Website</span>
      </button>

      {/* Modal for Company Info */}
 
    </div>
  );
}
