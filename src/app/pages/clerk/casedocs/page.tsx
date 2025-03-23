

// app/FilterableCaseTable.tsx
"use client";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CaseTable from "@/components/common/casedetails/CaseTable";

const caseCategories = {
    Civil: ["Property Disputes", "Contract Disputes", "Family Law", "Employment Law Cases"],
    Criminal: ["Robbery", "Drugs", "Crime Against Persons", "Crime Against Property"],
};

export default function FilterableCaseTable() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedCaseType, setSelectedCaseType] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const casesPerPage = 10;

    return (
        <div className="p-6">
            <div className="flex gap-4 mb-4">
                <Select onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Civil">Civil Cases</SelectItem>
                        <SelectItem value="Criminal">Criminal Cases</SelectItem>
                    </SelectContent>
                </Select>

                <Select onValueChange={setSelectedCaseType} disabled={!selectedCategory}>
                    <SelectTrigger className="w-[250px]">
                        <SelectValue placeholder="Select Case Type" />
                    </SelectTrigger>
                    <SelectContent>
                        {selectedCategory &&
                            caseCategories[selectedCategory as keyof typeof caseCategories].map((type) => (
                                <SelectItem key={type} value={type}>
                                    {type}
                                </SelectItem>
                            ))}
                    </SelectContent>
                </Select>

                <Input
                    type="text"
                    placeholder="Search Case Title..."
                    className="w-[250px]"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <Button
                    variant="outline"
                    onClick={() => {
                        setSelectedCategory(null);
                        setSelectedCaseType(null);
                        setSearch("");
                        setCurrentPage(1);
                    }}
                >
                    Clear Filters
                </Button>
            </div>

            {/* Pass the pagination props and filters to the CaseTable */}
            <CaseTable
                selectedCategory={selectedCategory}
                selectedCaseType={selectedCaseType}
                search={search}
                currentPage={currentPage}
                casesPerPage={casesPerPage}
                setCurrentPage={setCurrentPage}
            />
        </div>
    );
}
