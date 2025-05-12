/** @format */

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import axios from "axios";
import { useLoginStore } from "@/app/hooks/useLoginStore";
import toast from "react-hot-toast";
import { DateTimePicker } from "@/components/common/calendar/date-time-picker";

interface SchedulePostHearingProps {
  caseId: string;
  onClose: () => void;
  hearingTypes: { id: number; name: string }[];
  onScheduleSuccess: () => void;
}

const ScheduleHearingWithDetails: React.FC<SchedulePostHearingProps> = ({
  caseId,
  onClose,
  hearingTypes,
  onScheduleSuccess,
}) => {
  const [selectedHearingTypeId, setSelectedHearingTypeId] = useState<
    number | null
  >(null);
  const [scheduledDateTime, setScheduledDateTime] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSchedule = async () => {
    if (!selectedHearingTypeId || !scheduledDateTime) {
      toast.error("Please select a hearing type and date/time", {
        position: "top-center",
        style: {
          background: "#FFEBEE",
          color: "#B71C1C",
          fontWeight: "500",
        },
      });
      return;
    }

    const token = useLoginStore.getState().token;

    if (!token) {
      toast.error("Please log in to schedule a hearing", {
        position: "top-center",
        style: {
          background: "#FFEBEE",
          color: "#B71C1C",
          fontWeight: "500",
        },
      });
      return;
    }

    const payload = {
      hearing: {
        hearing_type_id: selectedHearingTypeId,
        hearing_schedules_attributes: [
          {
            scheduled_date: scheduledDateTime.toISOString(),
            schedule_status: "pending",
          },
        ],
      },
    };

    setIsSubmitting(true);

    try {
      const host = window.location.hostname;

      const response = await axios.post(
        `http://${host}:3001/api/v1/cases/${caseId}/hearings`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        toast.success("Hearing scheduled successfully!", {
          position: "top-center",
          duration: 3000,
          style: {
            background: "#E8F5E9",
            color: "#1B5E20",
            fontWeight: "500",
          },
        });

        onScheduleSuccess();
        onClose();
      }
    } catch (error: any) {
      console.error("Error scheduling hearing:", error);

      let errorMessage = "Failed to schedule hearing";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      toast.error(errorMessage, {
        position: "top-center",
        duration: 5000,
        style: {
          background: "#FFEBEE",
          color: "#B71C1C",
          fontWeight: "500",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md mx-4 border-2 border-green-100 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-green-800">
            Schedule Hearing
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isSubmitting}>
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hearing Type
            </label>
            <select
              className="border p-2 w-full"
              value={selectedHearingTypeId ?? ""}
              onChange={(e) =>
                setSelectedHearingTypeId(Number(e.target.value))
              }>
              <option value="">Select Hearing Type</option>
              {hearingTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date & Time
            </label>
            <DateTimePicker
              date={scheduledDateTime || undefined}
              onDateChange={(date) => setScheduledDateTime(date)}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            className="bg-green-700 hover:bg-green-800"
            onClick={handleSchedule}
            disabled={
              isSubmitting || !selectedHearingTypeId || !scheduledDateTime
            }>
            {isSubmitting ? "Scheduling..." : "Schedule Hearing"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleHearingWithDetails;
