import LoadingSpinner from "@/app/util-components/loading-spinner";

export default function Loading() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <LoadingSpinner />
        </div>
    );
}