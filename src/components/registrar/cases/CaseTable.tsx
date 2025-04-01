import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Eye, Trash } from "lucide-react";
import { useState } from "react";

interface Case {
    regNo: number;
    regDate: string;
    plaintiff: string;
    cidNo: string;
    caseTitle: string;
    types: string;
    bench: string;
    benchClerk: string;
    status: "Active" | "Urgent" | "Enforcement" | "Appeal";
    nature: string;
}

const rowsPerPage = 9;

export default function CaseTable({ cases, tab, setCases }: { cases: Case[], tab: Case["status"], setCases: React.Dispatch<React.SetStateAction<Case[]>> }) {
    const [page, setPage] = useState(0);
    const router = useRouter();

    const filteredCases = cases
        .filter((c) => c.status === tab)
        .slice(page * rowsPerPage, (page + 1) * rowsPerPage);

    const handleDelete = async (regNo: number) => {
        await fetch(`http://localhost:3002/cases/${regNo}`, { method: "DELETE" });
        setCases((prevCases) => prevCases.filter((c) => c.regNo !== regNo));
    };

    return (
        <div className="border rounded-lg p-2 shadow-sm">
            <Table className="bg-white">
                <TableHeader>
                    <TableRow className="bg-primary-normal">
                        {["Reg No", "Reg Date", "Plaintiff", "CID No", "Case Title", "Types", "Bench", "Bench Clerk", "Status", "Nature", "Action"].map((head) => (
                            <TableHead key={head} className="font-heading">{head}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredCases.length > 0 ? (
                        filteredCases.map((caseItem) => (
                            <TableRow key={caseItem.regNo}>
                                <TableCell>{caseItem.regNo}</TableCell>
                                <TableCell>{caseItem.regDate}</TableCell>
                                <TableCell>{caseItem.plaintiff}</TableCell>
                                <TableCell>{caseItem.cidNo}</TableCell>
                                <TableCell>{caseItem.caseTitle}</TableCell>
                                <TableCell>{caseItem.types}</TableCell>
                                <TableCell>{caseItem.bench}</TableCell>
                                <TableCell>{caseItem.benchClerk}</TableCell>
                                <TableCell><Badge className="bg-green-600 text-white">{caseItem.status}</Badge></TableCell>
                                <TableCell>{caseItem.nature}</TableCell>
                                <TableCell>
                                    {/* Updated Eye Button */}
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="mr-2"
                                        onClick={() => router.push(`/pages/judge/case/${caseItem.regNo}`)}

                                    >
                                        <Eye size={16} />
                                    </Button>
                                    <Button size="sm" variant="destructive" onClick={() => handleDelete(caseItem.regNo)}>
                                        <Trash size={16} />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={11} className="text-center">No cases found</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex justify-between items-center p-2">
                <p className="text-sm">
                    Rows per page: {rowsPerPage} | {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, cases.filter(c => c.status === tab).length)} of {cases.filter(c => c.status === tab).length}
                </p>
                <div>
                    <Button size="sm" variant="outline" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>◀</Button>
                    <Button size="sm" variant="outline" onClick={() => setPage((p) => p + 1)} disabled={(page + 1) * rowsPerPage >= cases.filter(c => c.status === tab).length}>▶</Button>
                </div>
            </div>
        </div>
    );
}
