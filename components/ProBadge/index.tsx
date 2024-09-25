import React from "react";

const ProBadge = () => {
	return (
		<div className="text-[10px] group z-10">
			<div className="flex flex-col relative">
				<div className=" bg-indigo-500 px-2 rounded-full text-white">
					Pro
				</div>
				<span className="bg-[#282828] text-white opacity-0 px-2 shadow rounded group-hover:opacity-100 transition duration-500 absolute top-0 left-0 w-40 mt-6">
					This feature is not available in your plan
				</span>
			</div>
		</div>
	);
};

export default ProBadge;
