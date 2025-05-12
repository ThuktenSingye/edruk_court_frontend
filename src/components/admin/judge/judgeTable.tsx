"use client";
import React, { useState, useMemo } from "react";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import { FaEdit, FaPlus, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    ColumnDef,
    flexRender,
} from "@tanstack/react-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { useLoginStore } from "@/app/hooks/useLoginStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Profile {
    first_name: string;
    last_name: string;
    cid_no: string;
    phone_number: string;
}

interface Court {
    id: number;
    name: string;
}

interface Judge {
    id: number;
    email: string;
    profile: Profile;
    court: Court;
}

const showSuccessToast = (action: 'added' | 'edited', role: string) => {
    toast.success(
        <div className="flex items-center">
            <span className="mr-2">✓</span>
            <span>
                {role} {action} successfully!
            </span>
            <button
                onClick={() => toast.dismiss()}
                className="ml-4 px-2 py-1 text-xs rounded bg-white text-green-600 hover:bg-green-50"
            >
                Dismiss
            </button>
        </div>,
        {
            duration: 4000,
            position: 'top-right',
        }
    );
};

const showErrorToast = (action: 'add' | 'edit', role: string, error?: string) => {
    toast.error(
        <div className="flex items-center">
            <span className="mr-2">✕</span>
            <span>
                Failed to {action} {role.toLowerCase()}. {error || 'Please try again.'}
            </span>
            <button
                onClick={() => toast.dismiss()}
                className="ml-4 px-2 py-1 text-xs rounded bg-white text-red-600 hover:bg-red-50"
            >
                Dismiss
            </button>
        </div>,
        {
            duration: 5000,
            position: 'top-right',
        }
    );
};

const JUDGE_API_URL = "http://localhost:3001/api/v1/admin/users/judge";

const JudgeTable = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newJudge, setNewJudge] = useState({
        email: "",
        password: "",
        password_confirmation: "",
        profile: {
            first_name: "",
            last_name: "",
            cid_no: "",
            phone_number: ""
        },
        court_id: ""
    });
    const [editingJudge, setEditingJudge] = useState<Judge | null>(null);
    const { token } = useLoginStore();
    const queryClient = useQueryClient();

    // Fetch judges with React Query
    const { data: judgeData = [], isLoading } = useQuery<Judge[]>({
        queryKey: ['judges'],
        queryFn: async () => {
            if (!token) {
                throw new Error('No authentication token available');
            }

            const response = await fetch(JUDGE_API_URL, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(
                    errorData?.message ||
                    `Failed to fetch judges: ${response.status} ${response.statusText}`
                );
            }

            const result = await response.json();
            if (!result?.data) {
                throw new Error('Invalid response format from server');
            }

            return result.data.map((item: any) => ({
                id: item?.id ?? 0,
                email: item?.email ?? '',
                profile: {
                    first_name: item?.profile?.first_name ?? '',
                    last_name: item?.profile?.last_name ?? '',
                    cid_no: item?.profile?.cid_no ?? '',
                    phone_number: item?.profile?.phone_number ?? ''
                },
                court: {
                    id: item?.court?.id ?? 0,
                    name: item?.court?.name ?? ''
                }
            }));
        },
        staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
        gcTime: 30 * 60 * 1000, // Cache is kept for 30 minutes
    });

    // Add judge mutation
    const addJudgeMutation = useMutation({
        mutationFn: async (judgeData: typeof newJudge) => {

            const response = await fetch('http://localhost:3001/api/v1/admin/users', {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user: {
                        email: judgeData.email,
                        password: judgeData.password,
                        password_confirmation: judgeData.password_confirmation,
                        role: "Judge",
                        court_id: judgeData.court_id,
                        profile_attributes: {
                            first_name: judgeData.profile.first_name,
                            last_name: judgeData.profile.last_name,
                            cid_no: judgeData.profile.cid_no,
                            phone_number: judgeData.profile.phone_number
                        }
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add judge');
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['judges'] });
            setIsDialogOpen(false);
            resetForm();
            toast.success("Judge added successfully");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to add judge");
        }
    });

    // Edit judge mutation
    const editJudgeMutation = useMutation({
        mutationFn: async (judge: Judge) => {
            const response = await fetch(`${JUDGE_API_URL}/${judge.id}`, {
                method: "PUT",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user: {
                        email: judge.email,
                        court_id: judge.court.id.toString(),
                        profile_attributes: {
                            first_name: judge.profile.first_name,
                            last_name: judge.profile.last_name,
                            cid_no: judge.profile.cid_no,
                            phone_number: judge.profile.phone_number
                        }
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update judge');
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['judges'] });
            setIsDialogOpen(false);
            setEditingJudge(null);
            toast.success("Judge updated successfully");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to update judge");
        }
    });

    const handleAddJudge = async () => {
        if (newJudge.password !== newJudge.password_confirmation) {
            toast.error("Password and confirmation don't match");
            return;
        }

        addJudgeMutation.mutate(newJudge);
    };

    const handleEditJudge = async () => {
        if (!editingJudge?.id) return;
        editJudgeMutation.mutate(editingJudge);
    };

    const resetForm = () => {
        setNewJudge({
            email: "",
            password: "",
            password_confirmation: "",
            profile: {
                first_name: "",
                last_name: "",
                cid_no: "",
                phone_number: ""
            },
            court_id: ""
        });
    };

    const columns = useMemo<ColumnDef<Judge>[]>(() => [
        {
            accessorKey: "id",
            header: "ID",
            cell: ({ row }) => <span>{row.original?.id ?? '-'}</span>
        },
        {
            header: "First Name",
            cell: ({ row }) => <span>{row.original?.profile?.first_name ?? '-'}</span>
        },
        {
            header: "Last Name",
            cell: ({ row }) => <span>{row.original?.profile?.last_name ?? '-'}</span>
        },
        {
            header: "Email",
            cell: ({ row }) => <span>{row.original?.email ?? '-'}</span>
        },
        {
            header: "Court",
            cell: ({ row }) => <span>{row.original?.court?.name ?? '-'}</span>
        },
        {
            header: "Phone",
            cell: ({ row }) => <span>{row.original?.profile?.phone_number ?? '-'}</span>
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            setEditingJudge(row.original);
                            setIsDialogOpen(true);
                        }}
                        className="text-blue-500 hover:text-blue-700 p-1 rounded hover:bg-blue-50"
                        title="Edit"
                    >
                        <FaEdit />
                    </button>
                </div>
            ),
        },
    ], []);

    const table = useReactTable({
        data: judgeData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageIndex: 0,
                pageSize: 5,
            },
        },
    });

    if (isLoading) return (
        <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading judges...</span>
        </div>
    );

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Judge Management</h2>
                <Button onClick={() => {
                    setEditingJudge(null);
                    resetForm();
                    setIsDialogOpen(true);
                }}
                    className="bg-primary-normal hover:bg-primary-normal/90">
                    <FaPlus className="mr-2" /> Add Judge
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <TableHead key={header.id}>
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map(row => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No judges found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between py-4">
                <div className="text-sm text-muted-foreground">
                    Showing {table.getRowModel().rows.length} of {judgeData.length} judges
                </div>
                <div className="flex items-center justify-end space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <FaChevronLeft />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <FaChevronRight />
                    </Button>
                </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={(open) => {
                if (!open) {
                    setEditingJudge(null);
                    resetForm();
                }
                setIsDialogOpen(open);
            }}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>
                            {editingJudge ? "Edit Judge" : "Create New Judge"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="email" className="text-right">
                                Email*
                            </label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={editingJudge ? editingJudge.email : newJudge.email}
                                onChange={(e) => editingJudge
                                    ? setEditingJudge({ ...editingJudge, email: e.target.value })
                                    : setNewJudge({ ...newJudge, email: e.target.value })
                                }
                                className="col-span-3"
                                placeholder="Enter email"
                                required
                            />
                        </div>

                        {!editingJudge && (
                            <>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <label htmlFor="password" className="text-right">
                                        Password*
                                    </label>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={newJudge.password}
                                        onChange={(e) => setNewJudge({ ...newJudge, password: e.target.value })}
                                        className="col-span-3"
                                        placeholder="Enter password"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <label htmlFor="password_confirmation" className="text-right">
                                        Confirm Password*
                                    </label>
                                    <Input
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        type="password"
                                        value={newJudge.password_confirmation}
                                        onChange={(e) => setNewJudge({ ...newJudge, password_confirmation: e.target.value })}
                                        className="col-span-3"
                                        placeholder="Confirm password"
                                        required
                                    />
                                </div>
                            </>
                        )}

                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="first_name" className="text-right">
                                First Name*
                            </label>
                            <Input
                                id="first_name"
                                name="first_name"
                                value={editingJudge ? editingJudge.profile.first_name : newJudge.profile.first_name}
                                onChange={(e) => editingJudge
                                    ? setEditingJudge({
                                        ...editingJudge,
                                        profile: { ...editingJudge.profile, first_name: e.target.value }
                                    })
                                    : setNewJudge({
                                        ...newJudge,
                                        profile: { ...newJudge.profile, first_name: e.target.value }
                                    })
                                }
                                className="col-span-3"
                                placeholder="Enter first name"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="last_name" className="text-right">
                                Last Name
                            </label>
                            <Input
                                id="last_name"
                                name="last_name"
                                value={editingJudge ? editingJudge.profile.last_name : newJudge.profile.last_name}
                                onChange={(e) => editingJudge
                                    ? setEditingJudge({
                                        ...editingJudge,
                                        profile: { ...editingJudge.profile, last_name: e.target.value }
                                    })
                                    : setNewJudge({
                                        ...newJudge,
                                        profile: { ...newJudge.profile, last_name: e.target.value }
                                    })
                                }
                                className="col-span-3"
                                placeholder="Enter last name"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="cid_no" className="text-right">
                                CID Number
                            </label>
                            <Input
                                id="cid_no"
                                name="cid_no"
                                value={editingJudge ? editingJudge.profile.cid_no : newJudge.profile.cid_no}
                                onChange={(e) => editingJudge
                                    ? setEditingJudge({
                                        ...editingJudge,
                                        profile: { ...editingJudge.profile, cid_no: e.target.value }
                                    })
                                    : setNewJudge({
                                        ...newJudge,
                                        profile: { ...newJudge.profile, cid_no: e.target.value }
                                    })
                                }
                                className="col-span-3"
                                placeholder="Enter CID number"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="phone_number" className="text-right">
                                Phone Number
                            </label>
                            <Input
                                id="phone_number"
                                name="phone_number"
                                value={editingJudge ? editingJudge.profile.phone_number : newJudge.profile.phone_number}
                                onChange={(e) => editingJudge
                                    ? setEditingJudge({
                                        ...editingJudge,
                                        profile: { ...editingJudge.profile, phone_number: e.target.value }
                                    })
                                    : setNewJudge({
                                        ...newJudge,
                                        profile: { ...newJudge.profile, phone_number: e.target.value }
                                    })
                                }
                                className="col-span-3"
                                placeholder="Enter phone number"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="court_id" className="text-right">
                                Court ID*
                            </label>
                            <Input
                                id="court_id"
                                name="court_id"
                                value={editingJudge ? editingJudge.court.id.toString() : newJudge.court_id}
                                onChange={(e) => editingJudge
                                    ? setEditingJudge({
                                        ...editingJudge,
                                        court: { ...editingJudge.court, id: parseInt(e.target.value) || 0 }
                                    })
                                    : setNewJudge({
                                        ...newJudge,
                                        court_id: e.target.value
                                    })
                                }
                                className="col-span-3"
                                placeholder="Enter court ID"
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsDialogOpen(false);
                                setEditingJudge(null);
                                resetForm();
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={editingJudge ? handleEditJudge : handleAddJudge}
                            disabled={isSubmitting}
                        >
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {editingJudge ? "Save Changes" : "Create Judge"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default JudgeTable;