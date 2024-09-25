import { LinkIcon, ShareIcon } from "@heroicons/react/20/solid";
import {
	ArrowTopRightOnSquareIcon,
	PencilIcon,
	QrCodeIcon,
} from "@heroicons/react/24/outline";
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useQuery } from "react-query";
import CustomFormResponsesTab from "@components/CustomFormResponsesTab";
import DashboardNavbar from "@components/DashboardNavbar";
import DeleteFormModal from "@components/Modals/DeleteFormModal";
import EditCustomFormModal from "@components/Modals/EditCustomFormModal";
import Footer from "@components/Footer";
import FormAnalyticsTab from "@components/FormAnalyticsTab";
import FormSettingsTab from "@components/FormSettingsTab";
import FormShareModal from "@components/Modals/FormShareQRModal";
import IntegrationsTab from "@components/IntegrationsTab";
import { getAllForms, getFormById } from "@api/forms";
import { classNames } from "@utils/index";
import TransferFormWorkspaceModal from "@components/Modals/TransferFormWorkspaceModal";

const CustomFormDetailsPage = () => {
	const router = useRouter();

	const { data: allCustomForms } = useQuery("forms", getAllForms, {});

	const { data, isLoading } = useQuery(
		["forms", router.query.slug],
		() => getFormById(parseInt(router.query.slug as string)),
		{
			initialData: {
				status: "success",
				data: allCustomForms?.data?.find(
					(item) => item.id?.toString() === router?.query?.slug
				),
			},
			enabled: typeof router.query.slug === "string",
		}
	);

	const selectedForm = useMemo(() => {
		if (!data?.data) return null;
		if (!router?.query?.slug) return null;
		return data.data;
	}, [data?.data]);

	const closeDeleteModal = () => {
		if (!router.query.slug) return;
		router.push(
			{
				query: {
					tab: router.query.tab,
					slug: router.query.slug,
				},
			},
			undefined,
			{ scroll: false }
		);
	};

	const Tabs = [
		{
			name: "RESPONSES",
			label: "Responses",
			showForDraft: true,
		},
		{
			name: "INTEGRATIONS",
			label: "Integrations",
			showForDraft: true,
		},
		{
			name: "ANALYTICS",
			label: "Analytics",
			showForDraft: false,
		},
		{
			name: "SETTINGS",
			label: "Settings",
			showForDraft: true,
		},
	];

	const changeActiveTab = (tabName: string) => {
		router.push({
			query: {
				tab: tabName,
				slug: router.query.slug,
			},
		});
	};

	const activeTab = useMemo(
		() => router.query.tab ?? "RESPONSES",
		[router?.query?.tab]
	);

	const copyFormLink = async () => {
		if (!selectedForm) {
			return;
		}

		if (selectedForm.options?.visibility === "draft") {
			toast.error("Form is still in draft mode");
			return;
		}
		// Check if browser supports clipboard
		if (!navigator.clipboard) {
			toast.error("Your browser does not support clipboard");
			return;
		}

		// Copy to clipboard
		await navigator.clipboard.writeText(
			`${window.location.protocol}//${window.location.host}/form/${selectedForm?.public_id}`
		);
		toast.success("Link copied to clipboard");

		if (navigator.share === undefined) return;
		navigator.share({
			title: selectedForm?.name + " - ByteForms",
			url: `${window.location.protocol}//${window.location.host}/r/${selectedForm?.public_id}`,
			text: "Fill this form",
		});
	};

	const [showShareModal, setShowShareModal] = useState(false);
	const shareQrCode = () => {
		if (!selectedForm) {
			return;
		}

		if (selectedForm.options?.visibility === "draft") {
			toast.error("Form is still in draft mode");
			return;
		}

		setShowShareModal(true);
		// if (navigator.share === undefined) return;
		// navigator.share({
		// 	title: selectedForm?.name + " - ByteForms",
		// 	url: `${window.location.protocol}//${window.location.host}/r/${selectedForm?.public_id}`,
		// 	text: "Fill this form",
		// });
	};
	return (
		<>
			<Toaster />
			<Head>
				<title>
					{selectedForm?.name
						? `${selectedForm?.name} - ByteForms`
						: `ByteForms`}
				</title>
			</Head>
			<main className="w-full overflow-x-hidden">
				<DashboardNavbar />
				<FormShareModal
					selectedForm={selectedForm}
					open={showShareModal}
					setOpen={setShowShareModal}
				/>
				<div className="mx-auto container px-6 py-12 sm:py-12 lg:py-16 w-full max-w-6xl">
					<div className="flex items-center justify-between">
						<Link href="/dashboard" className="button-outlined">
							<span aria-hidden="true"> &larr;</span>
							<span className="pl-2">Back</span>
						</Link>
					</div>
					<div className="mt-4">
						<div className="flex flex-col md:flex-row md:items-start md:justify-between">
							<div>
								<div className="flex items-center space-x-2">
									<p>{selectedForm?.name}</p>
									{selectedForm?.options?.visibility ===
										"draft" && (
										<>
											<span className="inline-flex items-center rounded-full bg-gray-200 px-2  text-[10px] font-semibold text-gray-800">
												Draft
											</span>
										</>
									)}
								</div>
								{selectedForm && (
									<p className="text-sm text-gray-500">
										Created:{" "}
										{format(
											parseISO(selectedForm?.created_at),
											"dd MMM yyyy 'at' HH:mm"
										)}
									</p>
								)}
							</div>
							{!data?.data?.is_custom && (
								<div className="flex-wrap flex items-center gap-2 mt-4 md:mt-0">
									{/* <button
										type="button"
										onClick={copyFormLink}
										title="Copy link to share"
										className={classNames(
											selectedForm?.options
												?.visibility === "draft"
												? "opacity-60"
												: "",
											"button-outlined flex items-center space-x-1"
										)}
									>
										<LinkIcon className="w-3 h-3" />
									</button> */}
									<button
										type="button"
										onClick={shareQrCode}
										title="Share Form"
										className={classNames(
											selectedForm?.options
												?.visibility === "draft"
												? "opacity-60"
												: "",
											"button-outlined flex items-center space-x-1"
										)}
									>
										<ShareIcon className="w-3 h-3" />
										<span>Share</span>
									</button>
									<Link
										href={
											selectedForm?.options
												?.visibility === "draft"
												? "#"
												: {
														pathname:
															"/dashboard/[slug]/embed",
														query: {
															slug: selectedForm?.public_id,
														},
												  }
										}
										className={classNames(
											"button-outlined flex items-center space-x-1",
											selectedForm?.options
												?.visibility !== "draft"
												? ""
												: "opacity-60"
										)}
									>
										<span>Embed Form</span>
									</Link>
									<Link
										target={"_blank"}
										href={{
											pathname: "/form/[slug]",
											query: {
												slug: selectedForm?.public_id,
												isPreview: true,
											},
										}}
										className="button-outlined flex items-center space-x-1"
									>
										<span>View Form</span>
										<ArrowTopRightOnSquareIcon className="w-3 h-3" />
									</Link>
									<Link
										target={"_blank"}
										href={{
											pathname:
												selectedForm?.form_type ===
												"quiz"
													? "/quiz-builder"
													: "/builder",
											query: {
												formId: selectedForm?.id,
											},
										}}
										className="button-secondary flex items-center space-x-1"
									>
										<PencilIcon className="w-3 h-3" />
										<span>Edit</span>
									</Link>
								</div>
							)}
						</div>

						<div className="flex items-center space-x-3 mt-4 border-b">
							{Tabs.map((tab) => (
								<button
									onClick={() => changeActiveTab(tab.name)}
									type="button"
									className={classNames(
										activeTab === tab.name
											? "text-black border-b-black"
											: "text-gray-400 border-b-transparent",
										`border-b-2 text-sm pb-3 hover:text-black transition`
									)}
									key={tab.name}
								>
									{tab.label}
								</button>
							))}
						</div>

						{activeTab === "RESPONSES" &&
							typeof router.query.slug === "string" && (
								<CustomFormResponsesTab
									formId={parseInt(router.query.slug)}
								/>
							)}
						{data?.data?.public_id &&
							activeTab === "INTEGRATIONS" &&
							typeof router.query.slug === "string" && (
								<IntegrationsTab
									formId={parseInt(router.query.slug)}
								/>
							)}

						{activeTab === "ANALYTICS" &&
							typeof router.query.slug === "string" && (
								<FormAnalyticsTab
									publicId={data?.data?.public_id}
									formId={parseInt(router.query.slug)}
									data={data}
								/>
							)}
						{activeTab === "SETTINGS" && (
							<FormSettingsTab
								formId={parseInt(router.query.slug as string)}
							/>
						)}
					</div>
				</div>
			</main>
			<Footer />

			{selectedForm && (
				<>
					<DeleteFormModal
						form={selectedForm}
						open={router.query.action === "delete"}
						onClose={closeDeleteModal}
					/>

					<EditCustomFormModal
						form={selectedForm}
						open={router.query.action === "edit"}
						onClose={closeDeleteModal}
					/>

					<TransferFormWorkspaceModal
						form={selectedForm}
						open={router.query.action === "workspace-transfer"}
						onClose={closeDeleteModal}
					/>
				</>
			)}
		</>
	);
};

export default CustomFormDetailsPage;
