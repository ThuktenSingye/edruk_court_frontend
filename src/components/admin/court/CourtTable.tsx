/** @format */

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { FaEdit, FaPlus, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useLoginStore } from "@/app/hooks/useLoginStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";

interface ParentCourt {
  id: number | null;
  name: string | null;
  type: string | null;
}

interface Court {
  id: number;
  name: string;
  email: string;
  contact_no: string;
  subdomain: string;
  domain: string;
  court_type: string;
  parent_court: ParentCourt;
}

type CourtTypes = {
  [key: string]: number;
};

const COURT_API_URL = "http://localhost:3001/api/v1/admin/courts";
const COURT_TYPES_API_URL =
  "http://localhost:3001/api/v1/admin/courts/court_types";

const ParentCourtSelect = ({
  courtType,
  courts,
  value,
  onChange,
}: {
  courtType: string;
  courts: Court[];
  value: ParentCourt | null;
  onChange: (parentCourt: ParentCourt | null) => void;
}) => {
  const [filteredCourts, setFilteredCourts] = useState<Court[]>([]);

  useEffect(() => {
    let parentType: string | null = null;

    switch (courtType.toLowerCase()) {
      case "dzongkhag":
        parentType = "high";
        break;
      case "high":
        parentType = "supreme";
        break;
      case "dungkhag":
      case "drungkhag":
        parentType = "dzongkhag";
        break;
      case "bench":
        parentType = "dungkhag";
        break;
      default:
        parentType = null;
    }

    if (parentType) {
      const filtered = courts.filter(
        (court) => court.court_type.toLowerCase() === parentType
      );
      setFilteredCourts(filtered);
    } else {
      setFilteredCourts([]);
    }
  }, [courtType, courts]);

  const handleChange = (id: string) => {
    const selectedCourt = filteredCourts.find(
      (court) => court.id === parseInt(id)
    );
    onChange(
      selectedCourt
        ? {
            id: selectedCourt.id,
            name: selectedCourt.name,
            type: selectedCourt.court_type,
          }
        : null
    );
  };

  if (!filteredCourts.length) {
    return (
      <div className="text-sm text-gray-500">No parent court required</div>
    );
  }

  return (
    <Select value={value?.id?.toString() || ""} onValueChange={handleChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select parent court" />
      </SelectTrigger>
      <SelectContent>
        {filteredCourts.map((court) => (
          <SelectItem key={court.id} value={court.id.toString()}>
            {court.name} ({court.court_type})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

const CourtTable = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newCourt, setNewCourt] = useState<Omit<Court, "id">>({
    name: "",
    email: "",
    contact_no: "",
    subdomain: "",
    domain: "",
    court_type: "",
    parent_court: {
      id: null,
      name: null,
      type: null,
    },
  });
  const [editingCourt, setEditingCourt] = useState<Court | null>(null);
  const { token } = useLoginStore();
  const queryClient = useQueryClient();

  // Fetch courts with React Query
  const { data: courtData = [], isLoading } = useQuery<Court[]>({
    queryKey: ["courts"],
    queryFn: async () => {
      if (!token) {
        throw new Error("No authentication token available");
      }

      const response = await fetch(COURT_API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message ||
            `Failed to fetch courts: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();
      return result.data || [];
    },
    staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Cache is kept for 30 minutes
  });

  // Fetch court types with React Query
  const { data: courtTypes = {} } = useQuery<CourtTypes>({
    queryKey: ["courtTypes"],
    queryFn: async () => {
      if (!token) {
        throw new Error("No authentication token available");
      }

      const response = await fetch(COURT_TYPES_API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message ||
            `Failed to fetch court types: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();
      return result.data || {};
    },
    staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Cache is kept for 30 minutes
  });

  // Add court mutation
  const addCourtMutation = useMutation({
    mutationFn: async (courtData: Omit<Court, "id">) => {
      const response = await fetch(COURT_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          court: {
            name: courtData.name,
            court_type: courtData.court_type.toLowerCase(),
            email: courtData.email,
            contact_no: courtData.contact_no,
            subdomain: courtData.subdomain,
            domain: courtData.domain,
            parent_court_id: courtData.parent_court.id,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add court");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courts"] });
      setIsDialogOpen(false);
      resetForm();
      console.log("toast!");
      toast.success("Court added successfully", { duration: 5000 });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add court", { duration: 5000 });
    },
  });

  // Edit court mutation
  const editCourtMutation = useMutation({
    mutationFn: async (court: Court) => {
      const response = await fetch(`${COURT_API_URL}/${court.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          court: {
            name: court.name,
            court_type: court.court_type.toLowerCase(),
            email: court.email,
            contact_no: court.contact_no,
            subdomain: court.subdomain,
            domain: court.domain,
            parent_court_id: court.parent_court.id,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update court");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courts"] });
      setIsDialogOpen(false);
      setEditingCourt(null);
      toast.success("Court updated successfully", { duration: 5000 });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update court", {
        duration: 5000,
      });
    },
  });

  // Remove delete mutation
  const deleteCourtMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`${COURT_API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete court");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courts"] });
      toast.success("Court deleted successfully", { duration: 5000 });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete court", {
        duration: 5000,
      });
    },
  });

  const handleAddCourt = async () => {
    addCourtMutation.mutate(newCourt);
  };

  const handleEditCourt = async () => {
    if (!editingCourt) return;
    editCourtMutation.mutate(editingCourt);
  };

  const handleDeleteCourt = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this court?")) {
      deleteCourtMutation.mutate(id);
    }
  };

  const resetForm = () => {
    setNewCourt({
      name: "",
      email: "",
      contact_no: "",
      subdomain: "",
      domain: "",
      court_type: "",
      parent_court: { id: null, name: null, type: null },
    });
  };

  const columns = useMemo<ColumnDef<Court>[]>(
    () => [
      { accessorKey: "id", header: "ID" },
      { accessorKey: "name", header: "Court Name" },
      {
        accessorKey: "court_type",
        header: "Court Type",
        cell: ({ row }) => {
          const type = row.original.court_type;
          const colorMap: Record<string, string> = {
            supreme: "bg-blue-100 text-blue-800",
            high: "bg-green-100 text-green-800",
            dungkhag: "bg-purple-100 text-purple-800",
            dzongkhag: "bg-orange-100 text-orange-800",
            bench: "bg-yellow-100 text-yellow-800",
          };
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                colorMap[type] || "bg-gray-100"
              }`}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </span>
          );
        },
      },
      {
        id: "parent_court",
        header: "Parent Court",
        cell: ({ row }) => (
          <span>{row.original.parent_court?.name || "None"}</span>
        ),
      },
      { accessorKey: "contact_no", header: "Contact Number" },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "subdomain", header: "Subdomain" },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              onClick={() => {
                setEditingCourt(row.original);
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
    data: courtData,
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading courts...</span>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Court Management</h2>
        <Button
          onClick={() => {
            setEditingCourt(null);
            resetForm();
            setIsDialogOpen(true);
          }}
          className="bg-primary-normal hover:bg-primary-normal/90">
          <FaPlus className="mr-2" /> Add Court
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
                  No courts found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between py-4 px-2">
        <div className="text-sm text-gray-600">
          Showing {table.getRowModel().rows.length} of {courtData.length} courts
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCourt ? "Edit Court" : "Add Court"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Name"
              value={editingCourt?.name ?? newCourt.name}
              onChange={(e) =>
                editingCourt
                  ? setEditingCourt({ ...editingCourt, name: e.target.value })
                  : setNewCourt({ ...newCourt, name: e.target.value })
              }
            />
            <Input
              placeholder="Email"
              value={editingCourt?.email ?? newCourt.email}
              onChange={(e) =>
                editingCourt
                  ? setEditingCourt({ ...editingCourt, email: e.target.value })
                  : setNewCourt({ ...newCourt, email: e.target.value })
              }
            />
            <Input
              placeholder="Contact Number"
              value={editingCourt?.contact_no ?? newCourt.contact_no}
              onChange={(e) =>
                editingCourt
                  ? setEditingCourt({
                      ...editingCourt,
                      contact_no: e.target.value,
                    })
                  : setNewCourt({ ...newCourt, contact_no: e.target.value })
              }
            />
            <Input
              placeholder="Subdomain"
              value={editingCourt?.subdomain ?? newCourt.subdomain}
              onChange={(e) =>
                editingCourt
                  ? setEditingCourt({
                      ...editingCourt,
                      subdomain: e.target.value,
                    })
                  : setNewCourt({ ...newCourt, subdomain: e.target.value })
              }
            />
            <Input
              placeholder="Domain"
              value={editingCourt?.domain ?? newCourt.domain}
              onChange={(e) =>
                editingCourt
                  ? setEditingCourt({ ...editingCourt, domain: e.target.value })
                  : setNewCourt({ ...newCourt, domain: e.target.value })
              }
            />
            <Select
              value={editingCourt?.court_type ?? newCourt.court_type}
              onValueChange={(value) => {
                if (editingCourt) {
                  setEditingCourt({
                    ...editingCourt,
                    court_type: value,
                    parent_court: { id: null, name: null, type: null },
                  });
                } else {
                  setNewCourt({
                    ...newCourt,
                    court_type: value,
                    parent_court: { id: null, name: null, type: null },
                  });
                }
              }}>
              <SelectTrigger>
                <SelectValue placeholder="Select Court Type" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(courtTypes).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <ParentCourtSelect
              courtType={editingCourt?.court_type ?? newCourt.court_type}
              courts={courtData}
              value={editingCourt?.parent_court ?? newCourt.parent_court}
              onChange={(parentCourt) => {
                if (editingCourt) {
                  setEditingCourt({
                    ...editingCourt,
                    parent_court: parentCourt || {
                      id: null,
                      name: null,
                      type: null,
                    },
                  });
                } else {
                  setNewCourt({
                    ...newCourt,
                    parent_court: parentCourt || {
                      id: null,
                      name: null,
                      type: null,
                    },
                  });
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button
              className="bg-primary-normal text-white"
              onClick={editingCourt ? handleEditCourt : handleAddCourt}
              disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {editingCourt ? "Update Court" : "Add Court"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default CourtTable;
