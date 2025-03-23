"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Share2 } from "lucide-react";
import { useState } from "react";

// Options Data
const courts = [
    { label: "Phuntsholing Court", value: "court1" },
    { label: "Nganglam Dungkhag", value: "court2" },
];

const users = [
    { label: "User 1", value: "user1" },
    { label: "User 2", value: "user2" },
];

// Form Schema
const FormSchema = z.object({
    court: z.string().nonempty("Please select a court."),
    user: z.string().nonempty("Please select a user."),
});

interface SendToModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSend: (data: { court: string; user: string }) => void;
}

export const SendToModal = ({ open, onOpenChange, onSend }: SendToModalProps) => {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: { court: "", user: "" },
    });

    const handleSubmit = (data: z.infer<typeof FormSchema>) => {
        onSend(data);
        onOpenChange(false); // Close the modal
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button className="text-white bg-primary-normal flex items-center gap-2 px-4 py-2">
                    <Share2 className="h-5 w-5" />
                    <span>Send to</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Select Court and User</DialogTitle>
                </DialogHeader>
                <Card className="p-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                            {/* Court Selection Dropdown */}
                            <FormField
                                control={form.control}
                                name="court"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Court</FormLabel>
                                        <FormControl>
                                            <select
                                                {...field}
                                                className="form-select h-10 px-3 border rounded-md"
                                            >
                                                <option value="">Select a court</option>
                                                {courts.map((court) => (
                                                    <option key={court.value} value={court.value}>
                                                        {court.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* User Selection Dropdown */}
                            <FormField
                                control={form.control}
                                name="user"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>User</FormLabel>
                                        <FormControl>
                                            <select
                                                {...field}
                                                className="form-select h-10 px-3 border rounded-md"
                                            >
                                                <option value="">Select a user</option>
                                                {users.map((user) => (
                                                    <option key={user.value} value={user.value}>
                                                        {user.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Send and Cancel Buttons */}
                            <div className="flex justify-between mt-4 gap-5">
                                <Button type="submit" className="bg-primary-normal w-1/2 py-3 text-lg">
                                    Send
                                </Button>
                                <Button
                                    type="button"
                                    className="bg-red-500 w-1/2 py-3 text-lg"
                                    onClick={() => onOpenChange(false)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </Form>
                </Card>
            </DialogContent>
        </Dialog>
    );
};

