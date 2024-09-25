import Head from "next/head";
import React, { useEffect, useState } from "react";
import NewFormModal from "@components/Modals/NewFormModal";

const NewFormPage = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	useEffect(() => {
		setIsModalOpen(true);
	}, []);

	return (
		<>
			<Head>
				<title>New Form | ByteForms</title>
			</Head>
			<div>
				{/* <div>NewFormPage</div> */}
				<NewFormModal
					closeModal={() => setIsModalOpen(false)}
					isOpen={isModalOpen}
				/>
			</div>
		</>
	);
};

export default NewFormPage;
