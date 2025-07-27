"use client";

import {
	ColumnDef,
	flexRender,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	getCoreRowModel,
	ColumnFiltersState,
	getFilteredRowModel,
	useReactTable,
	VisibilityState,
	RowSelectionState,
} from "@tanstack/react-table";

import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
	DropdownMenuLabel,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
	ChevronDown,
	Download,
	Filter,
	Search,
	Settings2,
	X,
	MoreHorizontal,
	ArrowUpDown,
	ArrowUp,
	ArrowDown,
} from "lucide-react";

// Server-side data support
// eslint-disable-next-line
interface ServerSideOptions<TData> {
	totalCount: number;
	pageIndex: number;
	pageSize: number;
	onPaginationChange: (pageIndex: number, pageSize: number) => void;
	onSortingChange?: (sorting: SortingState) => void;
	onFiltersChange?: (filters: ColumnFiltersState) => void;
	onGlobalFilterChange?: (globalFilter: string) => void;
}

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	// Core features (opinionated defaults)
	enableRowSelection?: boolean;
	enableBulkActions?: boolean;
	
	// Optional configurations
	searchPlaceholder?: string;
	emptyStateMessage?: string;
	isLoading?: boolean;
	
	// Server-side support
	serverSide?: ServerSideOptions<TData>;
	
	// Event handlers
	onRowSelectionChange?: (selectedRows: TData[]) => void;
	onExport?: (data: TData[]) => void;
	bulkActions?: Array<{
		label: string;
		icon?: React.ReactNode;
		onClick: (selectedRows: TData[]) => void;
		variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
	}>;
}

// Opinionated defaults
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 100];

export function DataTable<TData, TValue>({
	columns,
	data,
	enableRowSelection = false,
	enableBulkActions = false,
	searchPlaceholder = "Search...",
	emptyStateMessage = "No results found.",
	isLoading = false,
	serverSide,
	onRowSelectionChange,
	onExport,
	bulkActions = [],
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
	const [globalFilter, setGlobalFilter] = useState<string>("");
	const [showColumnFilters, setShowColumnFilters] = useState(false);
	
	// Debounce ref for global filter
	const debounceRef = useRef<NodeJS.Timeout | null>(null);

	const isServerSide = !!serverSide;

	// Enhanced columns with selection if enabled
	const enhancedColumns = useMemo(() => {
		if (!enableRowSelection) return columns;

		return [
			{
				id: "select",
				// eslint-disable-next-line
				header: ({ table }: any) => {
					const isAllSelected = table.getIsAllPageRowsSelected();
					const isSomeSelected = table.getIsSomePageRowsSelected();
					return (
						<Checkbox
							className=""
							checked={isAllSelected ? true : isSomeSelected ? "indeterminate" : false}
							onCheckedChange={(value: boolean) => {
								table.toggleAllPageRowsSelected(!!value);
							}}
							aria-label="Select all"
						/>
					);
				},
				// eslint-disable-next-line
				cell: ({ row }: any) => (
					<Checkbox
						className=""
						checked={row.getIsSelected()}
						onCheckedChange={(value: boolean) => {
							row.toggleSelected(!!value);
						}}
						aria-label="Select row"
					/>
				),
				enableSorting: false,
				enableHiding: false,
				size: 50,
			},
			...columns,
		];
	}, [columns, enableRowSelection]); // Remove rowSelection dependency to prevent unnecessary re-renders

	// Handle server-side changes - optimized to reduce re-renders
	// eslint-disable-next-line
	const handleSortingChange = useCallback((updater: any) => {
		setSorting(updater);
		if (serverSide?.onSortingChange) {
			const newSorting = typeof updater === 'function' ? updater(sorting) : updater;
			serverSide.onSortingChange(newSorting);
		}
	}, [serverSide, sorting]);

	// eslint-disable-next-line
	const handleFiltersChange = useCallback((updater: any) => {
		setColumnFilters(updater);
		if (serverSide?.onFiltersChange) {
			const newFilters = typeof updater === 'function' ? updater(columnFilters) : updater;
			serverSide.onFiltersChange(newFilters);
		}
	}, [serverSide, columnFilters]);

	const handleGlobalFilterChange = useCallback((value: string) => {
		setGlobalFilter(value);
		
		// Debounce server-side filter calls
		if (serverSide?.onGlobalFilterChange) {
			if (debounceRef.current) {
				clearTimeout(debounceRef.current);
			}
			debounceRef.current = setTimeout(() => {
				serverSide.onGlobalFilterChange!(value);
			}, 300); // 300ms debounce
		}
	}, [serverSide?.onGlobalFilterChange]);

	const table = useReactTable({
		data,
		columns: enhancedColumns,
		onSortingChange: handleSortingChange,
		onColumnFiltersChange: handleFiltersChange,
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		onGlobalFilterChange: handleGlobalFilterChange,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: isServerSide ? undefined : getPaginationRowModel(),
		getSortedRowModel: isServerSide ? undefined : getSortedRowModel(),
		getFilteredRowModel: isServerSide ? undefined : getFilteredRowModel(),
		globalFilterFn: "includesString",
		manualPagination: isServerSide,
		manualSorting: isServerSide,
		manualFiltering: isServerSide,
		pageCount: isServerSide ? Math.ceil(serverSide.totalCount / serverSide.pageSize) : undefined,
		enableRowSelection: enableRowSelection,
		// eslint-disable-next-line
		getRowId: (row: any, index: number) => {
			// Try to use id field first, fallback to index
			return row.id?.toString() || index.toString();
		},
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
			globalFilter,
			...(isServerSide ? {
				pagination: {
					pageIndex: serverSide.pageIndex,
					pageSize: serverSide.pageSize,
				}
			} : {}),
		},
		initialState: {
			pagination: {
				pageSize: DEFAULT_PAGE_SIZE,
			},
		},
	});

	// Memoize selected rows calculation for performance
	const selectedRows = useMemo(() => {
		return table.getFilteredSelectedRowModel().rows.map((row) => row.original);
	}, [table]);

	// Handle row selection change
	useEffect(() => {
		if (onRowSelectionChange && enableRowSelection) {
			onRowSelectionChange(selectedRows);
		}
	}, [selectedRows, onRowSelectionChange, enableRowSelection]);

	// Cleanup debounce timeout on unmount
	useEffect(() => {
		return () => {
			if (debounceRef.current) {
				clearTimeout(debounceRef.current);
			}
		};
	}, []);

	// Export functionality
	const handleExport = useCallback(() => {
		if (onExport) {
			const exportData = selectedRows.length > 0 ? selectedRows : data;
			onExport(exportData);
		}
	}, [onExport, selectedRows, data]);

	// Pagination handlers for server-side - optimized dependencies
	const handlePaginationChange = useCallback((pageIndex: number, pageSize: number) => {
		if (isServerSide) {
			serverSide!.onPaginationChange(pageIndex, pageSize);
		} else {
			table.setPageIndex(pageIndex);
			table.setPageSize(pageSize);
		}
	}, [isServerSide, serverSide, table]);

	// Generate page numbers for pagination - memoized for performance
	const pageNumbers = useMemo(() => {
		const pageCount = table.getPageCount();
		const currentPage = isServerSide ? serverSide!.pageIndex : table.getState().pagination.pageIndex;
		const pages = [];

		if (pageCount <= 7) {
			for (let i = 0; i < pageCount; i++) {
				pages.push(i);
			}
		} else {
			if (currentPage <= 3) {
				pages.push(0, 1, 2, 3, 4, -1, pageCount - 1);
			} else if (currentPage >= pageCount - 4) {
				pages.push(0, -1, pageCount - 5, pageCount - 4, pageCount - 3, pageCount - 2, pageCount - 1);
			} else {
				pages.push(0, -1, currentPage - 1, currentPage, currentPage + 1, -1, pageCount - 1);
			}
		}

		return pages;
	}, [table, isServerSide, serverSide]);

	return (
		<div className="space-y-4">
			{/* Toolbar */}
			<div className="flex items-center justify-between">
				<div className="flex flex-1 items-center space-x-2">
					{/* Global Search */}
					<div className="relative max-w-sm">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							type="text"
							placeholder={searchPlaceholder}
							value={globalFilter ?? ""}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleGlobalFilterChange(e.target.value)}
							className="pl-9"
						/>
						{globalFilter && (
							<Button
								variant="ghost"
								size="sm"
								onClick={() => handleGlobalFilterChange("")}
								className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0"
							>
								<X className="h-3 w-3" />
							</Button>
						)}
					</div>

					{/* Column Filters Toggle */}
					<Button
						variant="outline"
						size="sm"
						onClick={() => setShowColumnFilters(!showColumnFilters)}
						className="h-8 border-dashed"
					>
						<Filter className="mr-2 h-4 w-4" />
						Filters
						{showColumnFilters && <X className="ml-2 h-4 w-4" />}
					</Button>

					{/* Bulk Actions */}
					{enableBulkActions && selectedRows.length > 0 && (
						<div className="flex items-center space-x-2 mr-2">
							<span className="text-sm text-muted-foreground">
								{selectedRows.length} row(s) selected
							</span>
							{bulkActions.map((action, index) => (
								<Button
									key={index}
									variant={action.variant || "outline"}
									size="sm"
									onClick={() => action.onClick(selectedRows)}
									className="h-8"
								>
									{action.icon}
									{action.label}
								</Button>
							))}
						</div>
					)}
				</div>

				<div className="flex items-center space-x-2">
					{/* Export Button */}
					{onExport && (
						<Button
							variant="outline"
							size="sm"
							onClick={handleExport}
							className="h-8"
						>
							<Download className="mr-2 h-4 w-4" />
							Export
						</Button>
					)}

					{/* Column Visibility */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm" className="h-8">
								<Settings2 className="mr-2 h-4 w-4" />
								View
								<ChevronDown className="ml-2 h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-[200px]">
							<DropdownMenuLabel className="" inset={false}>Toggle columns</DropdownMenuLabel>
							<DropdownMenuSeparator className="" />
							{table
								.getAllColumns()
								.filter((column) => column.getCanHide())
								.map((column) => (
									<DropdownMenuCheckboxItem
										key={column.id}
										className="capitalize"
										checked={column.getIsVisible()}
										onCheckedChange={(value: boolean) =>
											column.toggleVisibility(!!value)
										}
									>
										{column.id}
									</DropdownMenuCheckboxItem>
								))}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			{/* Column Filters */}
			{showColumnFilters && (
				<div className="flex flex-wrap gap-2 p-4 border rounded-lg bg-muted/50">
					{table
						.getAllColumns()
						.filter((column) => column.getCanFilter())
						.map((column) => (
							<div key={column.id} className="flex items-center space-x-2">
								<Input
									type="text"
									placeholder={`Filter ${column.id}...`}
									value={(column.getFilterValue() as string) ?? ""}
									onChange={(event: React.ChangeEvent<HTMLInputElement>) => column.setFilterValue(event.target.value)}
									className="h-8 w-[150px]"
								/>
								{Boolean(column.getFilterValue()) && (
									<Button
										variant="ghost"
										size="sm"
										onClick={() => column.setFilterValue("")}
										className="h-8 w-8 p-0"
									>
										<X className="h-3 w-3" />
									</Button>
								)}
							</div>
						))}
				</div>
			)}

			{/* Table */}
			<div className="rounded-md border">
				<Table className="">
					<TableHeader className="">
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id} className="">
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id} className="font-medium">
										{header.isPlaceholder
											? null
											: flexRender(header.column.columnDef.header, header.getContext())}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody className="">
						{isLoading ? (
							<TableRow className="">
								<TableCell colSpan={enhancedColumns.length} className="h-24 text-center">
									<div className="flex items-center justify-center space-x-2">
										<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
										<span>Loading...</span>
									</div>
								</TableCell>
							</TableRow>
						) : table.getRowModel().rows && table.getRowModel().rows.length > 0 ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
									className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted/80"
								>
									{/* eslint-disable-next-line */}
									{row.getVisibleCells().map((cell: any) => (
										<TableCell key={cell.id} className="">
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow className="">
								<TableCell colSpan={enhancedColumns.length} className="h-24 text-center">
									<div className="flex flex-col items-center justify-center space-y-2">
										<div className="text-muted-foreground text-sm">
											{emptyStateMessage}
										</div>
										{globalFilter && (
											<Button
												className=""
												variant="outline"
												size="sm"
												onClick={() => handleGlobalFilterChange("")}
											>
												Clear search
											</Button>
										)}
									</div>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{/* Pagination */}
			<div className="flex items-center justify-between px-2">
				<div className="flex items-center space-x-6 text-sm text-muted-foreground">
					<div className="flex items-center space-x-2">
						<p>Rows per page</p>
						<Select
							value={`${isServerSide ? serverSide.pageSize : table.getState().pagination.pageSize}`}
							onValueChange={(value: string) => {
								const newPageSize = Number(value);
								if (isServerSide) {
									handlePaginationChange(0, newPageSize);
								} else {
									table.setPageSize(newPageSize);
								}
							}}
						>
							<SelectTrigger className="h-8 w-[70px]">
								<SelectValue placeholder={isServerSide ? serverSide.pageSize : table.getState().pagination.pageSize} />
							</SelectTrigger>
							<SelectContent side="top" className="">
								{DEFAULT_PAGE_SIZE_OPTIONS.map((pageSize) => (
									<SelectItem key={pageSize} value={`${pageSize}`} className="">
										{pageSize}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="flex w-[100px] items-center justify-center text-sm">
						Page {(isServerSide ? serverSide.pageIndex : table.getState().pagination.pageIndex) + 1} of {table.getPageCount()}
					</div>
					<div>
						{isServerSide ? serverSide.totalCount : table.getFilteredRowModel().rows.length} total rows
						{enableRowSelection && selectedRows.length > 0 && (
							<span className="ml-2">({selectedRows.length} selected)</span>
						)}
					</div>
				</div>
				<div className="flex items-center space-x-2">
					<Pagination className="">
						<PaginationContent className="">
							<PaginationItem>
								<PaginationPrevious
									className={`cursor-pointer ${
										!table.getCanPreviousPage() ? "pointer-events-none opacity-50" : ""
									}`}
									onClick={() => {
										if (isServerSide) {
											handlePaginationChange(
												serverSide.pageIndex - 1,
												serverSide.pageSize
											);
										} else {
											table.previousPage();
										}
									}}
								/>
							</PaginationItem>

							{pageNumbers.map((pageNumber: number, index: number) => (
								<PaginationItem key={index}>
									{pageNumber === -1 ? (
										<PaginationEllipsis className="" />
									) : (
										<PaginationLink
											className="cursor-pointer"
											isActive={pageNumber === (isServerSide ? serverSide.pageIndex : table.getState().pagination.pageIndex)}
											onClick={() => {
												if (isServerSide) {
													handlePaginationChange(pageNumber, serverSide.pageSize);
												} else {
													table.setPageIndex(pageNumber);
												}
											}}
										>
											{pageNumber + 1}
										</PaginationLink>
									)}
								</PaginationItem>
							))}

							<PaginationItem>
								<PaginationNext
									className={`cursor-pointer ${
										!table.getCanNextPage() ? "pointer-events-none opacity-50" : ""
									}`}
									onClick={() => {
										if (isServerSide) {
											handlePaginationChange(
												serverSide.pageIndex + 1,
												serverSide.pageSize
											);
										} else {
											table.nextPage();
										}
									}}
								/>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</div>
			</div>
		</div>
	);
}

// Enhanced column helper functions for common use cases
export const createSelectColumn = () => ({
	id: "select",
	// eslint-disable-next-line
	header: ({ table }: any) => (
		<Checkbox
			checked={
				table.getIsAllPageRowsSelected() ||
				(table.getIsSomePageRowsSelected() && "indeterminate")
			}
			onCheckedChange={(value: boolean) =>
				table.toggleAllPageRowsSelected(!!value)
			}
			aria-label="Select all"
			className=""
		/>
	),
	// eslint-disable-next-line
	cell: ({ row }: any) => (
		<Checkbox
			checked={row.getIsSelected()}
			onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
			aria-label="Select row"
			className=""
		/>
	),
	enableSorting: false,
	enableHiding: false,
});

export const createSortableColumn = (accessorKey: string, header: string) => ({
	accessorKey,
	// eslint-disable-next-line
	cell: ({ cell }: any) => {
		return (
			<div className="flex items-center">
				{cell.getValue() ? cell.getValue() : "-"}
			</div>
		);
	},
	// eslint-disable-next-line
	header: ({ column }: any) => (
		<Button
			variant="ghost"
			size="sm"
			onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			className=""
		>
			{header}
			{column.getIsSorted() === "asc" ? (
				<ArrowUp className="ml-2 h-4 w-4" />
			) : column.getIsSorted() === "desc" ? (
				<ArrowDown className="ml-2 h-4 w-4" />
			) : (
				<ArrowUpDown className="ml-2 h-4 w-4" />
			)}
		</Button>
	),
});

export const createActionsColumn = (
	actions: Array<{
		label: string;
		icon?: React.ReactNode;
		// eslint-disable-next-line
		onClick: (row: any) => void;
		variant?:
			| "default"
			| "destructive"
			| "outline"
			| "secondary"
			| "ghost"
			| "link";
	}>
) => ({
	id: "actions",
	enableHiding: false,
	// eslint-disable-next-line
	cell: ({ row }: any) => {
		return (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
						<span className="sr-only">Open menu</span>
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="">
					{actions.map((action, index) => (
						<Button
							key={index}
							variant={action.variant || "ghost"}
							size="sm"
							onClick={() => action.onClick(row.original)}
							className="w-full justify-start"
						>
							{action.icon}
							{action.label}
						</Button>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
		);
	},
});
