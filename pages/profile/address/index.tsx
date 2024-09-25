import { AddressElement, Elements } from "@stripe/react-stripe-js";
import { StripeAddressElementChangeEvent, loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import toast, { LoaderIcon, Toaster } from "react-hot-toast";
import { useMutation, useQueryClient } from "react-query";
import { editUser, getCurrentUser } from "@api/auth";
import { useRouter } from "next/router";
import useUser from "@hooks/useUser";
import Head from "next/head";
import { AxiosError } from "axios";
import { BaseResponse } from "@api/types/responses";

// const stripePromise = loadStripe(
// 	process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
// );
const stripePromise = loadStripe(
	// process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
 'pk_test_51NyRFESE8n0P7R1Qa6w8wBXGLYqNpwe8zoTTjzI4PPZcDG2nXfuqYIA9LZjAliYSM4VzDzP4tyoFywCi0KC4P90l00O3cAE12N'

  );

const AddressPage = () => {
	const [addressValue, setAddressValue] = useState<
		StripeAddressElementChangeEvent["value"] | null
	>(null);

	const { mutateAsync: saveProfile, isLoading: isSavingProfile } =
		useMutation({
			mutationFn: editUser,
		});

	const { data, isLoading } = useUser();
	const router = useRouter();

	useEffect(() => {
		if (router.isReady) {
			if (!isLoading && data) {
				if (data?.data?.name) {
					setAddressValue((prev) => ({
						...(prev as any),
						address: data.data!.address,
						name: data.data!.name,
					}));
				}
				if (data?.data?.address?.line1 && !router.query.edit) {
					const url = router.query?.next as string;
					if (url) {
						router.push(url);
					} else {
						router.push("/dashboard");
					}
				}
			}
		}
	}, [data, isLoading, router]);

	const client = useQueryClient();

	const onSave = async () => {
		if (!addressValue) {
			return;
		}

		try {
			const res = await saveProfile({
				name: addressValue.name,
				address: addressValue.address,
			});
			if (res.status === "success") {
				toast.success("Address updated");

				client.fetchQuery({
					queryKey: ["currentUser"],
					queryFn: getCurrentUser,
				});

				const url = router.query?.next as string;
				if (url) {
					router.push(url);
				} else {
					router.push("/dashboard");
				}
			} else {
				console.error("[editProfile]", res);
				toast.error("Something went wrong");
			}
		} catch (error) {
			toast.error(
				(error as AxiosError<BaseResponse<null>>)?.response?.data
					?.message ?? "Something went wrong"
			);
			console.error("[editProfile]", error);
		}
	};

	return (
		<div>
			<Head>
				<title>
					{router.query.edit ? "Edit" : "Enter"} your Address |
					ByteForms
				</title>
			</Head>
			<div className="bg-gray-100">
				<Toaster />
				<div className=" flex items-center justify-center h-full min-h-screen">
					<div className="rounded-md overflow-hidden h-full max-w-md w-full z-[60] bg-white shadow-xl  mx-auto ">
						<div>
							<div className="p-4 sm:p-7 overflow-y-auto">
								<div className="flex items-center">
									<h3 className="text-lg font-semibold text-gray-800 ">
										{router.query.edit
											? "Edit your address"
											: "Enter your billing address to continue"}
									</h3>
								</div>

								<div className="mt-2">
									{data?.data?.email && (
										<Elements stripe={stripePromise}>
											<AddressElement
												onChange={(e) => {
													setAddressValue(e.value);
												}}
												options={{
													allowedCountries: data?.data
														?.address?.country
														? [
																data?.data
																	?.address
																	?.country,
														  ]
														: undefined,
													defaultValues:
														addressValue?.name
															? {
																	name:
																		addressValue.name ??
																		undefined,
																	address:
																		addressValue.address ??
																		undefined,
															  }
															: undefined,
													// fields: {
													// 	phone:"always",
													// },
													mode: "billing",
												}}
											/>
										</Elements>
									)}
								</div>

								<div className="mt-5 flex justify-end gap-x-2 print:hidden">
									{router.query.edit && (
										<button
											disabled={isSavingProfile}
											className="button-outlined"
											onClick={() => {
												router.push("/dashboard");
											}}
										>
											Cancel
										</button>
									)}
									<button
										disabled={
											!addressValue?.name ||
											!addressValue.address?.line1 ||
											isSavingProfile
										}
										className="button-primary space-x-2"
										onClick={onSave}
									>
										{isSavingProfile && <LoaderIcon />}
										<span>Continue</span>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AddressPage;
