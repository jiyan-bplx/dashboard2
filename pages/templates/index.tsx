import Head from "next/head";
import Link from "next/link";
import React, { useState, useMemo, ChangeEvent } from "react";
import Footer from "@components/Footer";
import Navbar from "@components/Navbar";
import { FormTemplates } from "../../data/Templates";
import { useRouter } from "next/router";
import TemplatePreviewModal from "@components/Modals/TemplatePreviewModal";

const FormTemplatesPage = () => {
	const router = useRouter();
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [selectedCategory, setSelectedCategory] = useState<string | null>(
		null
	);

	const filteredTemplates = useMemo(() => {
		return FormTemplates.filter(
			(template) =>
				template.name
					.toLowerCase()
					.includes(searchTerm.toLowerCase()) &&
				(selectedCategory
					? template.category === selectedCategory
					: true)
		);
	}, [searchTerm, selectedCategory]);

	const categories = useMemo(() => {
		return [
			"Arts & Crafts",
			"Automotive",
			"Animal Welfare",
			"Business",
			"Contact",
			"Product",
			"Event",
			"HR",
			"Education",
			"Fitness",
			"Feedback",
			"Health",
			"Food & Drink",
			"Travel",
			"Hospitality",
			"IT",
			"Nonprofit",
			"Library",
			"Real Estate",
			"Home & Garden",
			"Language Learning",
			"Music",
		];
	}, []);

	const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
		setSelectedCategory(null); // Unselect category when searching
		setSearchTerm(e.target.value);
	};

	const handleCategorySelect = (category: string) => {
		setSearchTerm("");
		setSelectedCategory(category === selectedCategory ? null : category);
	};

	return (
		<>
			<TemplatePreviewModal
				template={FormTemplates.find(
					(item) => item.slug === router.query.template
				)}
				isOpen={
					typeof router.query.template === "string" &&
					FormTemplates.some(
						(item) => item.slug === router.query.template
					)
				}
				closeModal={() => {
					router.replace("/templates");
				}}
			/>
			<Navbar />
			<div className="container mx-auto my-16">
				<Head>
					<title>Form Templates</title>
				</Head>
				<h1 className="text-3xl font-medium text-center ">
					Form Templates
				</h1>
				<p className="text-center">To help you get started</p>

				{/* Search input */}
				<div className="mt-8 mb-4 flex justify-center">
					<input
						type="text"
						placeholder="Search templates..."
						value={searchTerm}
						onChange={handleSearchChange}
						className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full max-w-md"
					/>
				</div>

				{/* Category filter buttons */}
				<div className="flex flex-wrap justify-center gap-2 mb-8">
					{categories.map((category) => (
						<button
							key={category}
							onClick={() => handleCategorySelect(category)}
							className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
								selectedCategory === category
									? "bg-[#4f46e5] text-white"
									: "bg-gray-200 text-gray-700 hover:bg-gray-300"
							}`}
						>
							{category}
						</button>
					))}
				</div>

				<div className="grid px-4 md:px-0 md:grid-cols-3 mt-8 gap-6">
					{filteredTemplates.map((template, index) => (
						<div
							key={index}
							className="py-6 px-4 bg-gray-100 rounded shadow"
						>
							<p className="text- font-medium leading-6 text-gray-900">
								{template.name}
							</p>
							<p className="text-sm text-gray-500 mt-1">
								{template.description}
							</p>
							<div className="flex space-x-2">
								<Link
									href={{
										query: {
											template: template.slug,
										},
									}}
									className="button-primary mt-4"
									scroll={false}
								>
									Preview
								</Link>
								<Link
									href={{
										pathname: `/builder`,
										query: {
											workspace: router.query.workspace,
											template: template.slug,
										},
									}}
									className="button-secondary mt-4"
								>
									Use this template
								</Link>
							</div>
						</div>
					))}
				</div>

				{filteredTemplates.length === 0 && (
					<div className="text-center mt-8">
						<p className="text-gray-500 mb-4">
							No templates found matching your search? No problem!
						</p>
						<Link href="/ai" className="button-primary">
							Generate with AI
						</Link>
					</div>
				)}
			</div>
			<Footer />
		</>
	);
};

export default FormTemplatesPage;
