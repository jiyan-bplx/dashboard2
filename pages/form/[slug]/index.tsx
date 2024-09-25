import once from "lodash.once";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import FormRenderer from "@components/FormRenderer";
import { createFormAnalytics, getFormByPublicId } from "@api/forms";
import { GetFormByIdResponse } from "@api/forms/responses";
import { classNames, getDeviceAndOs } from "@utils/index";

const RenderForm = ({
	form,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const router = useRouter();

	const hideTitle = router.query.hideTitle === "true";
	const hideBorders = router.query.hideBorders === "true";
	const transparentBackground = router.query.transparentBackground === "true";
	const embedType = (router.query.embedType as any) || ("iframe" as any);

	const submitFormViewToAnalytics = async () => {
		if (
			!router.query.isPreview &&
			form?.data?.options?.visibility !== "draft" &&
			!router.query?.response
		) {
			try {
				const device = getDeviceAndOs();
				createFormAnalytics({
					form_id: router.query.slug as string,
					browser: device.browser,
					os: device.os,
					open_count: true,
					analytics_data: true,
					device: device.mobile ? "Mobile" : "Desktop",
				});
			} catch (error) {
				console.error("[submitFormViewToAnalytics]", error);
			}
		}
	};
	const initAnalytics = once(submitFormViewToAnalytics);

	useEffect(() => {
		if (router.isReady && router.query.slug && form) {
			initAnalytics();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router, form]);

	return (
		<div>
			{router.query.isPreview === "true" && (
				<div className="fixed w-full isolate flex items-center z-50 gap-x-6 overflow-hidden bg-gray-50 px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
					<div
						className="absolute left-[max(-7rem,calc(50%-52rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
						aria-hidden="true"
					>
						<div
							className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
							style={{
								clipPath:
									"polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)",
							}}
						/>
					</div>
					<div
						className="absolute left-[max(45rem,calc(50%+8rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
						aria-hidden="true"
					>
						<div
							className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
							style={{
								clipPath:
									"polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)",
							}}
						/>
					</div>
					<div className="flex-grow z-50 flex flex-wrap items-center gap-x-4 ">
						<p className="text-sm leading-6 text-gray-900">
							You are viewing a preview of this form.{" "}
						</p>
						<Link
							href={`/form/${router.query.slug}`}
							className="flex-none rounded-full bg-gray-900 px-3.5 py-1 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
						>
							<span className="pr-2">View published version</span>
							<span aria-hidden="true">&rarr;</span>
						</Link>
					</div>
				</div>
			)}
			<div
				className={classNames(
					router.query.isPreview === "true" ? "pt-4" : ""
				)}
			>
				<FormRenderer
					formInitialData={form}
					responseID={router.query.response as string}
					formId={router.query.slug as string}
					options={{
						hideTitle,
						embedType,
						transparentBackground,
						hideBorders,
					}}
				/>
			</div>
		</div>
	);
};

export const getServerSideProps = (async ({ req, query }) => {
	const userIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
	const formId = query.slug as string;
	if (typeof formId === "string") {
		try {
			const form = await getFormByPublicId(formId, {
				"x-forwarded-for": userIp as string,
				"X-Real-IP": userIp as string,
				"X-Next-IP": userIp as string,
				"x-real-ip": userIp as string,
			});
			return {
				props: {
					form,
				},
			};
		} catch (err) {
			console.error("[getFormByPublicId] Server Side", err);
			return { props: { form: null } };
		}
	}
	console.error("[getFormByPublicId] Server Side", "No formId");

	return { props: { form: null } };
}) satisfies GetServerSideProps<{ form: GetFormByIdResponse | null }>;

export default RenderForm;
