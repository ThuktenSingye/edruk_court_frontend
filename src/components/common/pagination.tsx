import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronsUpDown } from "lucide-react";
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

interface PaginationProps {
    totalItems: number;
    rowsPerPage: number;
    setRowsPerPage: (value: number) => void;
    currentPage: number;
    setCurrentPage: (page: number) => void;
}

export const Pagination = ({
    totalItems,
    rowsPerPage,
    setRowsPerPage,
    currentPage,
    setCurrentPage,
}: PaginationProps) => {
    const [openRowsPerPage, setOpenRowsPerPage] = useState(false);

    const totalPages = Math.ceil(totalItems / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;

    return (
        <div className="flex items-center justify-between p-4 space-x-4">
            {/* Rows per page selector */}
            <div className="flex items-center space-x-2 ml-auto">
                <span className="mr-2">Rows per page:</span>
                <Popover open={openRowsPerPage} onOpenChange={setOpenRowsPerPage}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-[100px] justify-between">
                            {rowsPerPage}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[100px] p-0">
                        <Command>
                            <CommandList>
                                <CommandGroup>
                                    {[5, 9, 15].map((value) => (
                                        <CommandItem
                                            key={value}
                                            onSelect={() => {
                                                setRowsPerPage(value);
                                                setOpenRowsPerPage(false);
                                            }}
                                        >
                                            {value}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>

            {/* Pagination Info */}
            <div>
                {startIndex + 1}-{Math.min(startIndex + rowsPerPage, totalItems)} of {totalItems}
            </div>
        </div>
    );
};