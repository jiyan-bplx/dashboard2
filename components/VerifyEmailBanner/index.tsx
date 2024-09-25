import { useState } from "react";
import toast from "react-hot-toast";
import useUser from "@hooks/useUser";
import { sendVerificationEmail } from "@api/auth";
import { BaseResponse } from "@api/types/responses";
import { AxiosError } from "axios";

const VerifyEmailBanner = () => {
	const { data: userData, isLoading } = useUser({
		redirect: true,
	});

	const [sending, setSending] = useState(false);

	const resendEmail = async () => {
		if (userData?.data?.email) {
			try {
				setSending(true);
				const res = await sendVerificationEmail(userData?.data?.email);
				setSending(false);

				if (res?.status === "success") {
					toast.success("Email sent");
				} else {
					toast.error("Something went wrong 1");
				}
			} catch (error) {
				setSending(false);
				toast.error(
					(error as AxiosError<BaseResponse<null>>)?.response?.data
						?.message ?? "Something went wrong"
				);
			}
		} else {
			toast.error("Something went wrong");
		}
	};
	return (
		<div className="bg-black">
			<div className="mx-auto max-w-7xl py-3 px-3 sm:px-6 lg:px-8 text-center">
				<p className="font-medium text-white text-xs md:text-sm">
					<span className="">
						Please check your email to verify your account.
					</span>
					<span className="ml-2 inline-block">
						<button
							disabled={sending}
							onClick={resendEmail}
							type="button"
							className="flex rounded-md px-2 py-1 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white underline underline-offset-4 transition"
						>
							{sending ? "Sending..." : "Resend Email"}
						</button>
					</span>
				</p>
			</div>
		</div>
	);
};

export default VerifyEmailBanner;
