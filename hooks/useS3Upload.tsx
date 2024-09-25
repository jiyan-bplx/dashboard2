import axios, { AxiosRequestConfig } from "axios";
import { useState } from "react";

const useS3Upload = () => {
	const [progress, setProgress] = useState(0);
	const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
	const [error, setError] = useState(null);

	const uploadFile = async (file: File, presignedUrl: string) => {
		const options: AxiosRequestConfig<File> = {
			onUploadProgress: (progressEvent) => {
				setProgress((progressEvent.progress ?? 0) * 100);
			},
			headers: {
				"Content-Type": file.type,
			},
		};

		await axios.put(presignedUrl, file, options);

		setUploadedUrl(presignedUrl);

		return {
			url: presignedUrl,
		};
	};

	return { progress, uploadedUrl, error, uploadFile };
};

export default useS3Upload;
