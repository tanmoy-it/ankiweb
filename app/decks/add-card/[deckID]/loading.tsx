import LoadingSpinner from "@/app/util-components/loading-spinner";

export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <h1 className="font-bold p-2 px-3 bg-dune-50/5 rounded-lg flex items-center gap-2">
                <div className="w-5 h-5 bg-dune-100/20 rounded animate-pulse" />
                Study Deck:{" "}
                <div className="w-24 h-5 bg-dune-100/20 rounded animate-pulse ml-1.5" />
            </h1>
            <div className="h-[calc(100vh-200px)] w-full flex items-center justify-center mt-10">
                <LoadingSpinner />
            </div>
        </div>
    );
}