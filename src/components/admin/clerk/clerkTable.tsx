/** @format */

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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { useLoginStore } from "@/app/hooks/useLoginStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

interface Clerk {
  id: number;
  email: string;
  profile: Profile;
  court: Court;
}

const CLERK_API_URL = "http://localhost:3001/api/v1/admin/users/clerk";
const COURTS_API_URL = "http://localhost:3001/api/v1/admin/courts";

const ClerkTable = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newClerk, setNewClerk] = useState({
    email: "",
    password: "",
    password_confirmation: "",
    profile: {
      first_name: "",
      last_name: "",
      cid_no: "",
      phone_number: "",
    },
    court_id: "",
  });
  const [editingClerk, setEditingClerk] = useState<Clerk | null>(null);
  const { token } = useLoginStore();
  const queryClient = useQueryClient();

  // Delete clerk mutation
  const deleteClerkMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`${CLERK_API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete clerk");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clerks"] });
      toast.success("Clerk deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete clerk");
    },
  });

  // Fetch courts with React Query
  const { data: courts = [] } = useQuery<Court[]>({
    queryKey: ["courts"],
    queryFn: async () => {
      const response = await fetch(COURTS_API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch courts");
      }

      const result = await response.json();
      return result.data || [];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  // Fetch clerks with React Query
  const { data: clerkData = [], isLoading } = useQuery<Clerk[]>({
    queryKey: ["clerks"],
    queryFn: async () => {
      if (!token) {
        throw new Error("No authentication token available");
      }

      const response = await fetch(CLERK_API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message ||
            `Failed to fetch clerks: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();
      if (!result?.data) {
        throw new Error("Invalid response format from server");
      }

      return result.data.map((item: any) => ({
        id: item?.id ?? 0,
        email: item?.email ?? "",
        profile: {
          first_name: item?.profile?.first_name ?? "",
          last_name: item?.profile?.last_name ?? "",
          cid_no: item?.profile?.cid_no ?? "",
          phone_number: item?.profile?.phone_number ?? "",
        },
        court: {
          id: item?.court?.id ?? 0,
          name: item?.court?.name ?? "",
        },
      }));
    },
    staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Cache is kept for 30 minutes
  });

  // Add clerk mutation
  const addClerkMutation = useMutation({
    mutationFn: async (clerkData: typeof newClerk) => {
      const response = await fetch("http://localhost:3001/api/v1/admin/users", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: {
            email: clerkData.email,
            password: clerkData.password,
            password_confirmation: clerkData.password_confirmation,
            role: "Clerk",
            court_id: clerkData.court_id,
            profile_attributes: {
              first_name: clerkData.profile.first_name,
              last_name: clerkData.profile.last_name,
              cid_no: clerkData.profile.cid_no,
              phone_number: clerkData.profile.phone_number,
            },
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add clerk");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clerks"] });
      setIsDialogOpen(false);
      resetForm();
      toast.success("Clerk added successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add clerk");
    },
  });

  // Edit clerk mutation
  const editClerkMutation = useMutation({
    mutationFn: async (clerk: Clerk) => {
      const response = await fetch(
        `http://localhost:3001/api/v1/admin/users/${clerk.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user: {
              email: clerk.email,
              court_id: clerk.court.id.toString(),
              profile_attributes: {
                first_name: clerk.profile.first_name,
                last_name: clerk.profile.last_name,
                cid_no: clerk.profile.cid_no,
                phone_number: clerk.profile.phone_number,
              },
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update clerk");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clerks"] });
      setIsDialogOpen(false);
      setEditingClerk(null);
      toast.success("Clerk updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update clerk");
    },
  });

  const handleAddClerk = async () => {
    if (newClerk.password !== newClerk.password_confirmation) {
      toast.error("Password and confirmation don't match");
      return;
    }

    addClerkMutation.mutate(newClerk);
  };

  const handleEditClerk = async () => {
    if (!editingClerk?.id) return;
    editClerkMutation.mutate(editingClerk);
  };

  const handleDeleteClerk = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this clerk?")) {
      deleteClerkMutation.mutate(id);
    }
  };

  const resetForm = () => {
    setNewClerk({
      email: "",
      password: "",
      password_confirmation: "",
      profile: {
        first_name: "",
        last_name: "",
        cid_no: "",
        phone_number: "",
      },
      court_id: "",
    });
  };

  const columns = useMemo<ColumnDef<Clerk>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => <span>{row.original?.id ?? "-"}</span>,
      },
      {
        header: "First Name",
        cell: ({ row }) => (
          <span>{row.original?.profile?.first_name ?? "-"}</span>
        ),
      },
      {
        header: "Last Name",
        cell: ({ row }) => (
          <span>{row.original?.profile?.last_name ?? "-"}</span>
        ),
      },
      {
        header: "Email",
        cell: ({ row }) => <span>{row.original?.email ?? "-"}</span>,
      },
      {
        header: "Court",
        cell: ({ row }) => <span>{row.original?.court?.name ?? "-"}</span>,
      },
      {
        header: "Phone",
        cell: ({ row }) => (
          <span>{row.original?.profile?.phone_number ?? "-"}</span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              onClick={() => {
                setEditingClerk(row.original);
                setIsDialogOpen(true);
              }}
              className="text-blue-500 hover:text-blue-700 p-1 rounded hover:bg-blue-50"
              title="Edit">
              <FaEdit />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: clerkData,
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

  if (isLoading)
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading clerks...</span>
      </div>
    );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Clerk Management</h2>
        <Button
          onClick={() => {
            setEditingClerk(null);
            resetForm();
            setIsDialogOpen(true);
          }}
          className="bg-primary-normal hover:bg-primary-normal/90">
          <FaPlus className="mr-2" /> Add Clerk
        </Button>
      </div>

      <div className="rounded-lg border shadow-md bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-primary-normal text-white">
                {headerGroup.headers.map((header) => (
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
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-b hover:bg-gray-50 transition-colors">
                  {row.getVisibleCells().map((cell) => (
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
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-gray-500">
                  No clerks found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between py-4 px-2">
        <div className="text-sm text-gray-600">
          Showing {table.getRowModel().rows.length} of {clerkData.length} clerks
        </div>
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="border-gray-300 hover:bg-gray-50">
            <FaChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="border-gray-300 hover:bg-gray-50">
            <FaChevronRight />
          </Button>
        </div>
      </div>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setEditingClerk(null);
            resetForm();
          }
          setIsDialogOpen(open);
        }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingClerk ? "Edit Clerk" : "Create New Clerk"}
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
                value={editingClerk ? editingClerk.email : newClerk.email}
                onChange={(e) =>
                  editingClerk
                    ? setEditingClerk({
                        ...editingClerk,
                        email: e.target.value,
                      })
                    : setNewClerk({ ...newClerk, email: e.target.value })
                }
                className="col-span-3"
                placeholder="Enter email"
                required
              />
            </div>

            {!editingClerk && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="password" className="text-right">
                    Password*
                  </label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={newClerk.password}
                    onChange={(e) =>
                      setNewClerk({ ...newClerk, password: e.target.value })
                    }
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
                    value={newClerk.password_confirmation}
                    onChange={(e) =>
                      setNewClerk({
                        ...newClerk,
                        password_confirmation: e.target.value,
                      })
                    }
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
                value={
                  editingClerk
                    ? editingClerk.profile.first_name
                    : newClerk.profile.first_name
                }
                onChange={(e) =>
                  editingClerk
                    ? setEditingClerk({
                        ...editingClerk,
                        profile: {
                          ...editingClerk.profile,
                          first_name: e.target.value,
                        },
                      })
                    : setNewClerk({
                        ...newClerk,
                        profile: {
                          ...newClerk.profile,
                          first_name: e.target.value,
                        },
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
                value={
                  editingClerk
                    ? editingClerk.profile.last_name
                    : newClerk.profile.last_name
                }
                onChange={(e) =>
                  editingClerk
                    ? setEditingClerk({
                        ...editingClerk,
                        profile: {
                          ...editingClerk.profile,
                          last_name: e.target.value,
                        },
                      })
                    : setNewClerk({
                        ...newClerk,
                        profile: {
                          ...newClerk.profile,
                          last_name: e.target.value,
                        },
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
                value={
                  editingClerk
                    ? editingClerk.profile.cid_no
                    : newClerk.profile.cid_no
                }
                onChange={(e) =>
                  editingClerk
                    ? setEditingClerk({
                        ...editingClerk,
                        profile: {
                          ...editingClerk.profile,
                          cid_no: e.target.value,
                        },
                      })
                    : setNewClerk({
                        ...newClerk,
                        profile: {
                          ...newClerk.profile,
                          cid_no: e.target.value,
                        },
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
                value={
                  editingClerk
                    ? editingClerk.profile.phone_number
                    : newClerk.profile.phone_number
                }
                onChange={(e) =>
                  editingClerk
                    ? setEditingClerk({
                        ...editingClerk,
                        profile: {
                          ...editingClerk.profile,
                          phone_number: e.target.value,
                        },
                      })
                    : setNewClerk({
                        ...newClerk,
                        profile: {
                          ...newClerk.profile,
                          phone_number: e.target.value,
                        },
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
                  value={
                    editingClerk
                      ? editingClerk.court.id.toString()
                      : newClerk.court_id
                  }
                  onValueChange={(value) =>
                    editingClerk
                      ? setEditingClerk({
                          ...editingClerk,
                          court: { ...editingClerk.court, id: parseInt(value) },
                        })
                      : setNewClerk({
                          ...newClerk,
                          court_id: value,
                        })
                  }>
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
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false);
                setEditingClerk(null);
                resetForm();
              }}>
              Cancel
            </Button>
            <Button
              className="bg-primary-normal text-white hover:bg-primary-light"
              onClick={editingClerk ? handleEditClerk : handleAddClerk}
              disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {editingClerk ? "Save Changes" : "Create Clerk"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClerkTable;
