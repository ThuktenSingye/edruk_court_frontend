
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationPrevious,
    PaginationNext,
    PaginationLink,
} from "@/components/ui/pagination";

interface EventTableProps {
    events: any[];
    currentPage: number;
    eventsPerPage: number;
    paginate: (page: number) => void;
}

export default function EventTable({
    events,
    currentPage,
    eventsPerPage,
    paginate,
}: EventTableProps) {
    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const currentEventsPage = events.slice(indexOfFirstEvent, indexOfLastEvent);

    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Event List</h2>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Activity</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {currentEventsPage.map((event: any) => (
                        <TableRow key={event.id}>
                            <TableCell>
                                {event.extendedProps?.description || event.title || "No description"}
                            </TableCell>
                            <TableCell>
                                {new Date(event.start).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                                {new Date(event.start).toLocaleTimeString()}
                            </TableCell>
                            <TableCell>
                                <span className="text-red-600 font-medium">Pending</span>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Pagination */}
            <Pagination className="mt-6">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                        />
                    </PaginationItem>

                    {Array.from({ length: Math.ceil(events.length / eventsPerPage) }).map(
                        (_, idx) => (
                            <PaginationItem key={idx}>
                                <PaginationLink
                                    onClick={() => paginate(idx + 1)}
                                    isActive={currentPage === idx + 1}
                                >
                                    {idx + 1}
                                </PaginationLink>
                            </PaginationItem>
                        )
                    )}

                    <PaginationItem>
                        <PaginationNext onClick={() => paginate(currentPage + 1)} />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}
