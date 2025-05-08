/** @format */

"use client";

import { useLoginStore } from "@/app/hooks/useLoginStore";
import React, { useState } from "react";
// Make sure you have react-hot-toast installed: npm install react-hot-toast
// And have <Toaster /> configured in your layout/root component.
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

// Define the structure of the notification object passed from the parent
interface Notification {
  id: number;
  description: string;
  date: string;
  court_id: string | number;
  read_at: string | null;
  is_ws?: boolean;
}

// Update the props interface for NotificationItem
interface NotificationItemProps {
  notification: Notification;
  // isMarkingRead is no longer strictly needed by the child if hiding immediately,
  // but the parent might still use it. Let's keep it for now.
  isMarkingRead: boolean;
  // This function should handle the API call and return a Promise
  // that resolves on success and rejects on failure.
  onMarkAsRead: () => Promise<void>; // Expecting a promise
  openPDF: (fileName: string) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  isMarkingRead, // Kept prop, though local state primarily controls visibility now
  onMarkAsRead,
  openPDF,
}) => {
  // Local state to control immediate visibility
  const [isVisible, setIsVisible] = useState(true);

  // Determine if the notification was already read when first rendered
  // Note: This component won't re-render based on parent's read_at changes
  // after it's hidden locally, which is okay for this UX pattern.
  const initialIsRead = notification.read_at !== null;
  const router = useRouter();

  const handleViewMoreNotification = () => {
    router.push("/pages/users/calendar");
  };

  const handleMarkAsReadClick = async () => {
    // 1. Log to console immediately
    console.log(
      `POST request initiated for notification ID: ${notification.id}. Hiding item.`
    );

    // 2. Hide the component immediately (Optimistic UI)
    setIsVisible(false);

    try {
      // 3. Call the parent function to handle the API POST
      //    Await its success confirmation.
      await onMarkAsRead();

      // 4. Show success toast ONLY if the API call succeeds
      toast.success("Marked as read");

      // Note: The parent component is still responsible for removing/updating
      // the actual data in its state upon successful API response.
      // This local 'isVisible' state doesn't affect the parent's data array.
    } catch (error) {
      // 5. If the API call fails:
      console.error("Failed to mark notification as read via API:", error);
      toast.error("Failed to mark as read.");

      // Make the notification visible again so the user can retry
      setIsVisible(true);
    }
  };

  // If the component is marked as not visible, render nothing
  if (!isVisible) {
    return null;
  }

  // If the notification was already read initially, don't render it
  // (or render differently if needed, but current logic hides button)
  // This check prevents showing already-read items that might be in the parent list initially.
  if (initialIsRead) {
    // Optionally render something different for already-read items if they shouldn't be hidden entirely
    // For now, let's hide them like the button does below, returning null.
    // If you want to show read items differently, modify the JSX below instead.
    return null;
  }

  return (
    // Component is visible and wasn't initially read
    <div
      className={`w-full bg-white border border-gray-300 shadow-2xl rounded-lg p-4 md:p-8  transition-opacity duration-300`}>
      <div className="space-y-6 md:space-y-8">
        {/* Notification Details */}
        <div className="flex flex-col md:flex-row md:justify-between gap-6 md:gap-8">
          {/* Description */}
          <div className="flex flex-col w-full md:w-1/2 space-y-2 md:space-y-4">
            <input
              id={`description-${notification.id}`}
              value={notification.description}
              className="w-full p-2 md:p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              readOnly
            />
          </div>
          {/* Date and Court ID */}
          <div className="flex flex-col space-y-2 md:space-y-4 ">
            <div className="flex flex-row items-center gap-2">
              <label className="text-md font-medium">Date:</label>
              <p className="text-md text-error">{notification.date}</p>
            </div>
          </div>
        </div>

        {/* Mark as Read Button */}
        {/* Button is always shown initially since we filter out `initialIsRead` cases */}
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={handleMarkAsReadClick}
            // Disable button using parent's state if needed (e.g., prevent double clicks while parent is processing)
            // Alternatively, you could add local loading state triggered in handleMarkAsReadClick
            disabled={isMarkingRead}
            className="inlineflex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:pointer-events-none disabled:opacity-50 border bg-white shadow-sm hover:bg-neutral-100 text-green-700 border-green-700 px-6 h-9 py-2">
            {/* You might want a local loading state here instead of relying on parent's isMarkingRead if hiding immediately */}
            Mark as Read
          </button>

          <button
            onClick={handleViewMoreNotification}
            // Disable button using parent's state if needed (e.g., prevent double clicks while parent is processing)
            // Alternatively, you could add local loading state triggered in handleMarkAsReadClick
            className="inlineflex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:pointer-events-none disabled:opacity-50 border bg-white shadow-sm hover:bg-neutral-100 text-green-700 border-green-700 px-6 h-9 py-2">
            {/* You might want a local loading state here instead of relying on parent's isMarkingRead if hiding immediately */}
            View More
          </button>
        </div>
      </div>
    </div>
  );
};
