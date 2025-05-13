/** @format */

"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { useLoginStore } from "@/app/hooks/useLoginStore"; // 👈 your Zustand store

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Share2 } from "lucide-react";

const FormSchema = z
  .object({
    message: z.string().nonempty("Please enter a message."),
    orderType: z.string().nonempty("Please enter the order type."),
    sendToOption: z.enum(["court", "user"]),
    court: z.string().optional(),
    user: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.sendToOption === "court") return !!data.court;
      if (data.sendToOption === "user") return !!data.user;
      return false;
    },
    {
      message: "Please fill in the selected option.",
      path: ["court"],
    }
  );

interface SendToModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSend: (data: {
    court?: string;
    user?: string;
    message: string;
    orderType: string;
  }) => void;
}

export const SendToModal = ({
  open,
  onOpenChange,
  onSend,
}: SendToModalProps) => {
  const [sendToOption, setSendToOption] = useState<"court" | "user">("court");
  const [courtOptions, setCourtOptions] = useState<
    { id: number; name: string }[]
  >([]);
  const token = useLoginStore((state) => state.token);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      message: "",
      orderType: "",
      sendToOption: "court",
      court: "",
      user: "",
    },
  });

  const host = window.location.hostname;

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const res = await axios.get(`http://${host}:3001/api/v1/courts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const courts = res.data?.data || [];
        const simplified = courts.map((court: any) => ({
          id: court.id,
          name: court.name,
        }));
        setCourtOptions(simplified);
        console.log("✅ Courts fetched:", simplified);
      } catch (error) {
        console.error("❌ Failed to fetch courts", error);
        toast.error("Failed to fetch courts");
      }
    };

    if (token) fetchCourts();
  }, [token]);

  const handleSubmit = (data: z.infer<typeof FormSchema>) => {
    onSend({
      message: data.message,
      orderType: data.orderType,
      court: sendToOption === "court" ? data.court : undefined,
      user: sendToOption === "user" ? data.user : undefined,
    });
    onOpenChange(false);
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
          <DialogTitle>Send Court Order</DialogTitle>
        </DialogHeader>
        <Card className="p-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter message" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="orderType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order Type</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter order type" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sendToOption"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Send To</FormLabel>
                    <div className="flex gap-4 mt-1">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          value="court"
                          checked={sendToOption === "court"}
                          onChange={() => {
                            field.onChange("court");
                            setSendToOption("court");
                          }}
                        />{" "}
                        Court
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          value="user"
                          checked={sendToOption === "user"}
                          onChange={() => {
                            field.onChange("user");
                            setSendToOption("user");
                          }}
                        />{" "}
                        User
                      </label>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {sendToOption === "court" && (
                <FormField
                  control={form.control}
                  name="court"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Court</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="form-select h-10 px-3 border rounded-md">
                          <option value="">Select a court</option>
                          {courtOptions.map((court) => (
                            <option key={court.id} value={court.id.toString()}>
                              {court.name}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {sendToOption === "user" && (
                <FormField
                  control={form.control}
                  name="user"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter user ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="flex justify-between mt-4 gap-5">
                <Button
                  type="submit"
                  className="bg-primary-normal w-1/2 py-3 text-lg">
                  Send
                </Button>
                <Button
                  type="button"
                  className="bg-red-500 w-1/2 py-3 text-lg"
                  onClick={() => onOpenChange(false)}>
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
