"use client";

import React, { useEffect, useState, useMemo } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

interface Registrar {
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

const showErrorToast = (action: 'add' | 'edit' | 'fetch', role: string, error?: string) => {
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

const REGISTRAR_API_URL = "http://localhost:3001/api/v1/admin/users/registrar";
const COURTS_API_URL = "http://localhost:3001/api/v1/admin/courts";

const RegistrarTable = () => {
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [newRegistrar, setNewRegistrar] = React.useState({
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
    const [validationErrors, setValidationErrors] = React.useState<Record<string, string>>({});
    const [editingRegistrar, setEditingRegistrar] = React.useState<Registrar | null>(null);
    const { token } = useLoginStore();
    const queryClient = useQueryClient();

    // Fetch registrars with React Query
    const { data: registrarData = [], isLoading } = useQuery<Registrar[]>({
        queryKey: ['registrars'],
        queryFn: async () => {
            const response = await fetch(REGISTRAR_API_URL, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch registrars');
            }

            const result = await response.json();
            return result?.data?.map((item: any) => ({
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
            })) || [];
        },
        staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
        gcTime: 30 * 60 * 1000, // Cache is kept for 30 minutes
    });

    // Fetch courts with React Query
    const { data: courts = [] } = useQuery<Court[]>({
        queryKey: ['courts'],
        queryFn: async () => {
            const response = await fetch(COURTS_API_URL, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch courts');
            }

            const result = await response.json();
            return result.data || [];
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
    });

    // Add registrar mutation
    const addRegistrarMutation = useMutation({
        mutationFn: async (data: typeof newRegistrar) => {
            const response = await fetch('http://localhost:3001/api/v1/admin/users', {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user: {
                        email: data.email,
                        password: data.password,
                        password_confirmation: data.password_confirmation,
                        role: "Registrar",
                        court_id: data.court_id,
                        profile_attributes: {
                            first_name: data.profile.first_name,
                            last_name: data.profile.last_name,
                            cid_no: data.profile.cid_no,
                            phone_number: data.profile.phone_number
                        }
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.errors?.email?.[0] ||
                    errorData.errors?.court_id?.[0] ||
                    errorData.message ||
                    'Failed to add registrar');
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['registrars'] });
            setIsDialogOpen(false);
            resetForm();
            showSuccessToast('added', 'Registrar');
        },
        onError: (error: Error) => {
            showErrorToast('add', 'Registrar', error.message);
        }
    });

    // Edit registrar mutation
    const editRegistrarMutation = useMutation({
        mutationFn: async (data: { id: number; registrar: Registrar }) => {
            const response = await fetch(`${REGISTRAR_API_URL}/${data.id}`, {
                method: "PUT",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user: {
                        email: data.registrar.email,
                        court_id: data.registrar.court.id.toString(),
                        profile_attributes: {
                            first_name: data.registrar.profile.first_name,
                            last_name: data.registrar.profile.last_name,
                            cid_no: data.registrar.profile.cid_no,
                            phone_number: data.registrar.profile.phone_number
                        }
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.errors?.email?.[0] ||
                    errorData.errors?.court_id?.[0] ||
                    errorData.message ||
                    'Failed to update registrar');
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['registrars'] });
            setIsDialogOpen(false);
            setEditingRegistrar(null);
            showSuccessToast('edited', 'Registrar');
        },
        onError: (error: Error) => {
            showErrorToast('edit', 'Registrar', error.message);
        }
    });

    // Remove delete mutation
    const deleteRegistrarMutation = useMutation({
        mutationFn: async (id: number) => {
            const response = await fetch(`${REGISTRAR_API_URL}/${id}`, {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete registrar');
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['registrars'] });
            toast.success("Registrar deleted successfully");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to delete registrar");
        }
    });

    const validateForm = (isEdit: boolean = false) => {
        const errors: Record<string, string> = {};

        // Email validation
        if (!newRegistrar.email && !editingRegistrar?.email) {
            errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editingRegistrar?.email || newRegistrar.email)) {
            errors.email = 'Please enter a valid email address';
        } else if (!isEdit && registrarData.some(r => r.email === (editingRegistrar?.email || newRegistrar.email))) {
            errors.email = 'Email already exists';
        }

        // Password validation (only for new registrars)
        if (!isEdit) {
            if (!newRegistrar.password) {
                errors.password = 'Password is required';
            } else if (newRegistrar.password.length < 8) {
                errors.password = 'Password must be at least 8 characters';
            }

            if (newRegistrar.password !== newRegistrar.password_confirmation) {
                errors.password_confirmation = 'Passwords do not match';
            }
        }

        // Profile validation
        if (!newRegistrar.profile.first_name && !editingRegistrar?.profile.first_name) {
            errors.first_name = 'First name is required';
        }

        // Court validation
        if (!newRegistrar.court_id && !editingRegistrar?.court.id) {
            errors.court_id = 'Court is required';
        } else if (courts.length > 0 && !courts.some(c => c.id.toString() === (editingRegistrar?.court.id.toString() || newRegistrar.court_id))) {
            errors.court_id = 'Selected court does not exist';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleAddRegistrar = async () => {
        if (!validateForm()) return;
        addRegistrarMutation.mutate(newRegistrar);
    };

    const handleEditRegistrar = async () => {
        if (!editingRegistrar?.id) return;
        if (!validateForm(true)) return;
        editRegistrarMutation.mutate({ id: editingRegistrar.id, registrar: editingRegistrar });
    };

    const handleDeleteRegistrar = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this registrar?')) {
            deleteRegistrarMutation.mutate(id);
        }
    };

    const resetForm = () => {
        setNewRegistrar({
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
        setValidationErrors({});
    };

    const columns = useMemo<ColumnDef<Registrar>[]>(() => [
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
                            setEditingRegistrar(row.original);
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
        data: registrarData,
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
            <span className="ml-2">Loading registrars...</span>
        </div>
    );

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Registrar Management</h2>
                <Button onClick={() => {
                    setEditingRegistrar(null);
                    resetForm();
                    setIsDialogOpen(true);
                }}
                    className="bg-primary-normal hover:bg-primary-normal/90">
                    <FaPlus className="mr-2" /> Add Registrar
                </Button>
            </div>

            <div className="rounded-lg border shadow-md bg-white">
                <Table>
                    <TableHeader className="bg-primary-normal text-white">
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id} className="border-b hover:bg-gray-50">
                                {headerGroup.headers.map(header => (
                                    <TableHead key={header.id} className="font-semibold py-4">
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
                                    className="border-b hover:bg-gray-50 transition-colors"
                                >
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell key={cell.id} className="py-4">
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
                                <TableCell colSpan={columns.length} className="h-24 text-center text-gray-500">
                                    No registrars found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between py-4 px-2">
                <div className="text-sm text-gray-600">
                    Showing {table.getRowModel().rows.length} of {registrarData.length} registrars
                </div>
                <div className="flex items-center justify-end space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="border-gray-300 hover:bg-gray-50"
                    >
                        <FaChevronLeft />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="border-gray-300 hover:bg-gray-50"
                    >
                        <FaChevronRight />
                    </Button>
                </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={(open) => {
                if (!open) {
                    setEditingRegistrar(null);
                    resetForm();
                }
                setIsDialogOpen(open);
            }}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>
                            {editingRegistrar ? "Edit Registrar" : "Create New Registrar"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="email" className="text-right">
                                Email*
                            </label>
                            <div className="col-span-3 flex flex-col">
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={editingRegistrar ? editingRegistrar.email : newRegistrar.email}
                                    onChange={(e) => editingRegistrar
                                        ? setEditingRegistrar({ ...editingRegistrar, email: e.target.value })
                                        : setNewRegistrar({ ...newRegistrar, email: e.target.value })
                                    }
                                    placeholder="Enter email"
                                    required
                                />
                                {validationErrors.email && (
                                    <span className="text-red-500 text-xs mt-1">{validationErrors.email}</span>
                                )}
                            </div>
                        </div>

                        {!editingRegistrar && (
                            <>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <label htmlFor="password" className="text-right">
                                        Password*
                                    </label>
                                    <div className="col-span-3 flex flex-col">
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            value={newRegistrar.password}
                                            onChange={(e) => setNewRegistrar({ ...newRegistrar, password: e.target.value })}
                                            placeholder="Enter password (min 8 characters)"
                                            required
                                        />
                                        {validationErrors.password && (
                                            <span className="text-red-500 text-xs mt-1">{validationErrors.password}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <label htmlFor="password_confirmation" className="text-right">
                                        Confirm Password*
                                    </label>
                                    <div className="col-span-3 flex flex-col">
                                        <Input
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            type="password"
                                            value={newRegistrar.password_confirmation}
                                            onChange={(e) => setNewRegistrar({ ...newRegistrar, password_confirmation: e.target.value })}
                                            placeholder="Confirm password"
                                            required
                                        />
                                        {validationErrors.password_confirmation && (
                                            <span className="text-red-500 text-xs mt-1">{validationErrors.password_confirmation}</span>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="first_name" className="text-right">
                                First Name*
                            </label>
                            <div className="col-span-3 flex flex-col">
                                <Input
                                    id="first_name"
                                    name="first_name"
                                    value={editingRegistrar ? editingRegistrar.profile.first_name : newRegistrar.profile.first_name}
                                    onChange={(e) => editingRegistrar
                                        ? setEditingRegistrar({
                                            ...editingRegistrar,
                                            profile: { ...editingRegistrar.profile, first_name: e.target.value }
                                        })
                                        : setNewRegistrar({
                                            ...newRegistrar,
                                            profile: { ...newRegistrar.profile, first_name: e.target.value }
                                        })
                                    }
                                    placeholder="Enter first name"
                                    required
                                />
                                {validationErrors.first_name && (
                                    <span className="text-red-500 text-xs mt-1">{validationErrors.first_name}</span>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="last_name" className="text-right">
                                Last Name
                            </label>
                            <Input
                                id="last_name"
                                name="last_name"
                                value={editingRegistrar ? editingRegistrar.profile.last_name : newRegistrar.profile.last_name}
                                onChange={(e) => editingRegistrar
                                    ? setEditingRegistrar({
                                        ...editingRegistrar,
                                        profile: { ...editingRegistrar.profile, last_name: e.target.value }
                                    })
                                    : setNewRegistrar({
                                        ...newRegistrar,
                                        profile: { ...newRegistrar.profile, last_name: e.target.value }
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
                                value={editingRegistrar ? editingRegistrar.profile.cid_no : newRegistrar.profile.cid_no}
                                onChange={(e) => editingRegistrar
                                    ? setEditingRegistrar({
                                        ...editingRegistrar,
                                        profile: { ...editingRegistrar.profile, cid_no: e.target.value }
                                    })
                                    : setNewRegistrar({
                                        ...newRegistrar,
                                        profile: { ...newRegistrar.profile, cid_no: e.target.value }
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
                                value={editingRegistrar ? editingRegistrar.profile.phone_number : newRegistrar.profile.phone_number}
                                onChange={(e) => editingRegistrar
                                    ? setEditingRegistrar({
                                        ...editingRegistrar,
                                        profile: { ...editingRegistrar.profile, phone_number: e.target.value }
                                    })
                                    : setNewRegistrar({
                                        ...newRegistrar,
                                        profile: { ...newRegistrar.profile, phone_number: e.target.value }
                                    })
                                }
                                className="col-span-3"
                                placeholder="Enter phone number"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="court_id" className="text-right">
                                Court*
                            </label>
                            <div className="col-span-3 flex flex-col">
                                <Select
                                    value={editingRegistrar ? editingRegistrar.court.id.toString() : newRegistrar.court_id}
                                    onValueChange={(value) => editingRegistrar
                                        ? setEditingRegistrar({
                                            ...editingRegistrar,
                                            court: { ...editingRegistrar.court, id: parseInt(value) }
                                        })
                                        : setNewRegistrar({
                                            ...newRegistrar,
                                            court_id: value
                                        })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a court" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {courts.map((court) => (
                                            <SelectItem key={court.id} value={court.id.toString()}>
                                                {court.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {validationErrors.court_id && (
                                    <span className="text-red-500 text-xs mt-1">{validationErrors.court_id}</span>
                                )}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsDialogOpen(false);
                                setEditingRegistrar(null);
                                resetForm();
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={editingRegistrar ? handleEditRegistrar : handleAddRegistrar}
                            disabled={isSubmitting}
                        >
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {editingRegistrar ? "Save Changes" : "Create Registrar"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default RegistrarTable;