'use client';
import { useState } from 'react';

export function usePagination(itemCount: number, itemsPerPage: number) {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);

    const totalPages = Math.ceil(itemCount / itemsPerPage);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    return {
        searchQuery,
        currentPage,
        totalPages,
        setCurrentPage,
        handleSearchChange,
    };
}
