/** @format */

"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function Page() {
  const [selectedBench, setSelectedBench] = useState("bench1");
  const [selectedClerk, setSelectedClerk] = useState("ugyen");
  const [selectedDate, setSelectedDate] = useState("");

  const handleAssign = () => {
    alert("Assigned successfully!");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Dialog Trigger Button */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="mb-4">
            Open Dialog
          </Button>
        </DialogTrigger>

        {/* Dialog Content */}
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Bench</DialogTitle>
          </DialogHeader>

          <form>
            {/* Bench Radio Group */}
            <div className="mb-4">
              <label
                htmlFor="bench"
                className="block text-sm font-medium text-gray-700">
                Select Bench
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="bench1"
                    name="bench"
                    value="bench1"
                    checked={selectedBench === "bench1"}
                    onChange={() => setSelectedBench("bench1")}
                    className="h-4 w-4 text-primary-normal border-gray-300 focus:ring-primary-normal"
                  />
                  <label htmlFor="bench1" className="ml-2 text-sm">
                    Bench 1
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="bench2"
                    name="bench"
                    value="bench2"
                    checked={selectedBench === "bench2"}
                    onChange={() => setSelectedBench("bench2")}
                    className="h-4 w-4 text-primary-normal border-gray-300 focus:ring-primary-normal"
                  />
                  <label htmlFor="bench2" className="ml-2 text-sm">
                    Bench 2
                  </label>
                </div>
              </div>
            </div>

            {/* Date Picker */}
            <div className="mb-4">
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700">
                Select Date
              </label>
              <input
                type="date"
                id="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* Clerk Select Dropdown */}
            <div className="mb-4">
              <label
                htmlFor="clerk"
                className="block text-sm font-medium text-gray-700">
                Select Clerk
              </label>
              <select
                id="clerk"
                value={selectedClerk}
                onChange={(e) => setSelectedClerk(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                <option value="ugyen">Ugyen</option>
                <option value="pema">Pema</option>
                <option value="tashi">Tashi</option>
              </select>
            </div>

            {/* Assign Button */}
            <div className="mb-4 flex justify-end">
              <button
                type="button"
                onClick={handleAssign}
                className="py-1 px-4 bg-primary-normal text-white font-medium rounded-md text-sm">
                Assign
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
