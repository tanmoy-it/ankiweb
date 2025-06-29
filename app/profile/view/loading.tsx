export default async function UserProfilePageLoading() {
	return (
        <div className="grid grid-cols-9 grid-rows-6 gap-3 p-3 grid-flow-row animate-pulse">
            <div className="bg-gray-300/80 p-3 shadow-xl row-span-6 col-span-3 rounded-xl h-[700px]">
            </div>
            <div className="bg-gray-300/80 p-3 shadow-xl row-span-3 col-span-6 rounded-xl"></div>
            <div className="bg-gray-300/80 p-3 shadow-xl row-span-3 col-span-3 rounded-xl"></div>
            <div className="bg-gray-300/80 p-3 shadow-xl row-span-3 col-span-3 rounded-xl"></div>
        </div>
	);
}
