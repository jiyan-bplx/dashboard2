import "react-image-crop/dist/ReactCrop.css";
import ReactCrop, { PixelCrop, type Crop } from "react-image-crop";
import { useEffect, useState, DependencyList, useRef } from "react";
import { canvasPreview } from "./CanvasPreview";

export function useDebounceEffect(
	fn: () => void,
	waitTime: number,
	deps?: DependencyList
) {
	useEffect(() => {
		const t = setTimeout(() => {
			fn.apply(undefined, deps as any);
		}, waitTime);

		return () => {
			clearTimeout(t);
		};
	}, deps);
}

function ImageCropper({
	src,
	setCroppedUrl,
}: {
	src: string;
	setCroppedUrl?: (blob: Blob) => void;
}) {
	const [crop, setCrop] = useState<Crop>();
	const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
	const previewCanvasRef = useRef<HTMLCanvasElement>(null);
	const imgRef = useRef<HTMLImageElement>(null);
	const hiddenAnchorRef = useRef<HTMLAnchorElement>(null);
	const blobUrlRef = useRef("");

	useEffect(() => {
		// 	get image width and height
		const img = new Image();
		img.src = src;
		img.onload = () => {
			// setImageSize({ width: img.width, height: img.height });
			setCrop({
				width: 75,
				height: 75,
				unit: "%",
				x: 12.5,
				y: 12.5,
			});
		};
	}, [src]);

	async function onDownloadCropClick() {
		const image = imgRef.current;
		const previewCanvas = previewCanvasRef.current;
		if (!image || !previewCanvas || !completedCrop) {
			throw new Error("Crop canvas does not exist");
		}

		// This will size relative to the uploaded image
		// size. If you want to size according to what they
		// are looking at on screen, remove scaleX + scaleY
		const scaleX = image.naturalWidth / image.width;
		const scaleY = image.naturalHeight / image.height;

		const offscreen = new OffscreenCanvas(
			completedCrop.width * scaleX,
			completedCrop.height * scaleY
		);
		const ctx = offscreen.getContext("2d");
		if (!ctx) {
			throw new Error("No 2d context");
		}

		(ctx as any).drawImage(
			previewCanvas,
			0,
			0,
			previewCanvas.width,
			previewCanvas.height,
			0,
			0,
			offscreen.width,
			offscreen.height
		);
		// You might want { type: "image/jpeg", quality: <0 to 1> } to
		// reduce image size
		const blob: Blob = await (offscreen as any).convertToBlob({
			type: "image/png",
		});

		setCroppedUrl?.(blob);
		// if (hiddenAnchorRef.current) {
		// 	hiddenAnchorRef.current.href = blobUrlRef.current;
		// 	hiddenAnchorRef.current.click();
		// }
	}

	useDebounceEffect(
		async () => {
			if (
				completedCrop?.width &&
				completedCrop?.height &&
				imgRef.current &&
				previewCanvasRef.current
			) {
				// We use canvasPreview as it's much faster than imgPreview.
				canvasPreview(
					imgRef.current,
					previewCanvasRef.current,
					completedCrop
				).then(() => {
					onDownloadCropClick();
				});
			}
		},
		100,
		[completedCrop]
	);

	return (
		<div className="relative">
			<ReactCrop
				crop={crop}
				onChange={(c) => setCrop(c)}
				onComplete={(c) => setCompletedCrop(c)}
			>
				<img src={src} alt="Image" ref={imgRef} />
			</ReactCrop>
			{!!completedCrop && (
				<>
					<div
						className="absolute inset-0 w-full h-full"
						style={{
							visibility: "hidden",
						}}
					>
						<canvas
							ref={previewCanvasRef}
							style={{
								border: "1px solid black",
								objectFit: "contain",
								width: completedCrop.width,
								height: completedCrop.height,
							}}
						/>
					</div>
					<div>
						<a
							href="#hidden"
							ref={hiddenAnchorRef}
							download
							style={{
								position: "absolute",
								top: "-200vh",
								visibility: "hidden",
							}}
						>
							Hidden download
						</a>
					</div>
				</>
			)}
		</div>
	);
}

export default ImageCropper;
