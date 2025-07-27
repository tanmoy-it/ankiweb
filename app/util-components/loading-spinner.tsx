import Ico from "./ico";

export default function LoadingSpinner({size}: {size?: number} = {}) {
	return (
		<div className="flex flex-col items-center w-full h-full justify-center">
			<Ico
				src="https://cdn-icons-png.flaticon.com/512/15640/15640107.png"
				size={size || 50}
				className="animate-stepper invert"
			></Ico>
			<p className="mt-4 text-lg text-gray-600">Loading ...</p>
		</div>
	);
}
