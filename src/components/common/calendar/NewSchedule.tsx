/** @format */

"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { useLoginStore } from "@/app/hooks/useLoginStore";

interface Schedule {
  id: string;
  case_id: string;
  hearing_id: string;
  scheduled_date: string;
  schedule_status: string;
  case_title: string;
  case_number: string;
  hearing_type_name: string;
  scheduled_by?: {
    id: number;
    first_name: string;
    last_name: string;
  };
}

export default function NewSchedule() {
  const [pendingSchedules, setPendingSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<Record<string, boolean>>({});
  const token = useLoginStore().token;

  useEffect(() => {
    fetchPendingSchedules();
  }, []);

  const fetchPendingSchedules = async () => {
    try {
      setLoading(true);
      const host = window.location.hostname;
      const apiUrl = `http://${host}:3001/api/v1/hearing_schedules/pending`;

      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setPendingSchedules(data.data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch schedules"
      );
      console.error("Error fetching pending schedules:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveReject = async (
    schedule: Schedule,
    action: "approve" | "reject"
  ) => {
    try {
      const host = window.location.hostname;

      setProcessing((prev) => ({ ...prev, [schedule.id]: true }));

      const url = `http://${host}:3001/api/v1/cases/${schedule.case_id}/hearings/${schedule.hearing_id}/hearing_schedules/${schedule.id}`;

      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hearing_schedule: {
            schedule_status: action === "approve" ? "approved" : "rejected",
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} schedule`);
      }

      // Refresh the list after successful action
      await fetchPendingSchedules();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : `Failed to ${action} schedule`
      );
      console.error(`Error ${action}ing schedule:`, err);
    } finally {
      setProcessing((prev) => ({ ...prev, [schedule.id]: false }));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="w-full border rounded-xl p-4 shadow-md bg-white flex flex-col">
        <h3 className="font-bold text-primary-normal">Your Pending Approval</h3>
        <Card className="p-4">
          <div>Loading pending schedules...</div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full border rounded-xl my-10 p-4 shadow-md bg-white flex flex-col">
        <h3 className="font-bold text-primary-normal">Your Pending Approval</h3>
        <Card className="p-4 text-red-500 my-4">
          <div>Error: {error}</div>
          <Button onClick={fetchPendingSchedules} className="mt-2">
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full border rounded-xl p-4 shadow-md bg-white flex flex-col">
      <h3 className="font-bold text-primary-normal">Your Pending Approval</h3>
      <Card className="p-4">
        {pendingSchedules.length === 0 ? (
          <div className="text-gray-500">No pending schedules found</div>
        ) : (
          <div className="space-y-4">
            {pendingSchedules.map((schedule) => (
              <div key={schedule.id} className="border-b pb-4 last:border-b-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{schedule.case_title}</h4>
                    <p className="text-sm text-gray-600">
                      Case #: {schedule.case_number}
                    </p>
                    <p className="text-sm text-gray-600">
                      Hearing Type: {schedule.hearing_type_name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {formatDate(schedule.scheduled_date)}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {schedule.schedule_status.toLowerCase()}
                    </p>
                  </div>
                </div>
                {schedule.scheduled_by && (
                  <p className="text-xs mt-1">
                    Scheduled by: {schedule.scheduled_by.first_name}{" "}
                    {schedule.scheduled_by.last_name}
                  </p>
                )}
                <div className="flex justify-end space-x-2 mt-3">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleApproveReject(schedule, "reject")}
                    disabled={processing[schedule.id]}>
                    {processing[schedule.id] ? "Processing..." : "Reject"}
                  </Button>
                  <Button
                      className="bg-primary-normal text-white"
                    variant="default"
                    size="sm"
                    onClick={() => handleApproveReject(schedule, "approve")}
                    disabled={processing[schedule.id]}>
                    {processing[schedule.id] ? "Processing..." : "Approve"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
