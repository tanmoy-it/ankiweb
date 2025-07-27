'use client';
import { Button } from "@/components/ui/button";

type PaginationControlsProps = {
    currentPage: number;
    totalPages: number;
    setCurrentPage: (page: number) => void;
};

export default function PaginationControls({ currentPage, totalPages, setCurrentPage }: PaginationControlsProps) {
    return (
        <div className="flex justify-center items-center space-x-2 float-right mt-4">
            <Button
                className={``}
                variant={"default"}
                size="sm"
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
            >
                Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (num) => (
                    <Button
                        className={``}
                        key={num}
                        size="sm"
                        variant={
                            num === currentPage
                                ? "secondary"
                                : "default"
                        }
                        onClick={() => setCurrentPage(num)}
                    >
                        {num}
                    </Button>
                )
            )}
            <Button
                className={``}
                variant={"default"}
                size="sm"
                onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
            >
                Next
            </Button>
        </div>
    );
}
