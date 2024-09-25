import { SetStateAction, memo, useEffect, useState } from "react";
import Typewriter, {
	TypewriterClass,
	TypewriterState,
} from "typewriter-effect";
const TypewriterInput: React.FC<{ sentences: string[] }> = ({ sentences }) => {
	return (
		<div className="md:flex text-indigo-400 md:overflow-hidden md:whitespace-nowrap">
			<span className="mr-1 text-gray-400"> Generate a </span>
			<Typewriter
				options={{
					strings: sentences,
					autoStart: true,
					loop: true,
					delay: 30,
					deleteSpeed: 30,
				}}
			/>
		</div>
	);
};

export default TypewriterInput;
