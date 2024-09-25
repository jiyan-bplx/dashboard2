import { AxiosError } from "axios";
import Head from "next/head";
import Link from "next/link";
import { useForm } from "react-hook-form";
import toast, { LoaderIcon, Toaster } from "react-hot-toast";
import validator from "validator";
import { sendPasswordResetEmail } from "@api/auth";
import { ForgotPasswordResponse } from "@api/auth/responses";
import { convertToCamelCase, getFieldMessageFromTag } from "@utils/index";
type FormFields = {
	email: string;
};
export default function ForgotPasswordPage() {
	const {
		register,
		formState: { isSubmitting, errors, isSubmitSuccessful },
		handleSubmit,
		setError,
		getValues,
	} = useForm<FormFields>({});

	const onSubmit = async (data: FormFields) => {
		try {
			const res = await sendPasswordResetEmail(data.email);
			if (res.status === "success") {
				toast.success("Password Reset link sent successfully", {
					duration: 30000,
				});
			} else {
				toast.error(res.message ?? "An error occured");
				console.error("[onForgotPassword] Response", res);
			}
		} catch (err) {
			console.error("[onForgotPassword]", err);
			const e = err as AxiosError<ForgotPasswordResponse>;
			if (e?.response?.data?.message) {
				toast.error(e.response.data.message);
			} else {
				if (
					e?.response?.data?.errors &&
					e?.response?.data?.errors?.length > 0
				) {
					e.response.data.errors.forEach((error) => {
						setError(
							convertToCamelCase(error.field) as keyof FormFields,
							{
								message: getFieldMessageFromTag(
									error.tag,
									error.field
								),
							}
						);
					});
				} else {
					toast.error("Something went wrong");
				}
			}
		}
	};
	return (
		<>
			<Head>
				<title>Forgot Password | ByteForms</title>
			</Head>
			<Toaster />
			<div className="flex min-h-screen">
				<div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
					<div className="mx-auto w-full max-w-sm lg:w-96">
						<div>
							<h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
								Forgot Password ?
							</h2>
							<p className="text-gray-500">
								{isSubmitSuccessful
									? `We have sent a recovery link to your email: ${getValues(
											"email"
									  )}`
									: "We'll send a recovery link to your email"}
							</p>
						</div>

						<div className="mt-8">
							<div className="mt-6">
								{isSubmitSuccessful ? null : (
									<form
										onSubmit={handleSubmit(onSubmit)}
										className="space-y-6"
									>
										<div>
											<label
												htmlFor="email"
												className="block text-sm font-medium text-gray-700"
											>
												Email address
											</label>
											<div className="mt-1">
												<input
													{...register("email", {
														required:
															"Please enter your email",
														validate: (val) =>
															validator.isEmail(
																val
															) ||
															"Please enter a valid email",
													})}
													type="email"
													placeholder="Enter your email"
													autoComplete="email"
													className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
												/>
											</div>
											{errors?.email?.message && (
												<p className="text-xs text-red-500 mt-2 text-left">
													{errors?.email?.message}
												</p>
											)}
										</div>

										<div>
											<button
												disabled={isSubmitting}
												type="submit"
												className=" button-primary w-full justify-center space-x-2 items-center"
											>
												{isSubmitting && <LoaderIcon />}
												<span>Send recovery link</span>
											</button>
										</div>
									</form>
								)}
								<Link
									href="/login"
									className="justify-center flex button-outlined w-full mt-4"
								>
									<span>Back to login</span>
								</Link>
							</div>
						</div>
					</div>
				</div>
				<div className="relative hidden w-0 flex-1 lg:block">
					<img
						className="absolute inset-0 h-full w-full object-cover"
						src="https://images.unsplash.com/photo-1505904267569-f02eaeb45a4c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
						alt=""
					/>
					<div className="relative">
						<div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
							<p className="text-2xl font-medium md:w-1/2 text-white ">
								Create beautiful forms and share them anywhere
							</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
