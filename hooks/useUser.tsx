import { useRouter } from "next/router";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { getCurrentUser } from "@api/auth";

const useUser = (
	{ redirect } = {
		redirect: false,
	}
) => {
	const user = useQuery({
		queryKey: ["currentUser"],
		queryFn: getCurrentUser,
		retry: 0,
	});

	const router = useRouter();
	useEffect(() => {
		if (!user.isLoading && !user.data?.data && user.error) {
			if (redirect) {
				router.replace(`/login?next=${router.asPath}`);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user, redirect]);

	return user;
};

export default useUser;
