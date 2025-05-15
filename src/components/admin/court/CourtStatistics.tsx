/** @format */

// components/admin/court/CourtStatistics.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Gavel,
  Scale,
  Landmark,
  Home,
  ClipboardList,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useLoginStore } from "@/app/hooks/useLoginStore";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

// Configuration matching your API response exactly
const COURT_CONFIG = {
  supreme_court: {
    icon: Landmark,
    color: "text-purple-500",
    label: "Supreme Court",
  },
  high_court: {
    icon: Scale,
    color: "text-blue-500",
    label: "High Court",
  },
  dzongkhag_court: {
    icon: Home,
    color: "text-green-500",
    label: "Dzongkhag Court",
  },
  dungkhag_court: {
    icon: Gavel,
    color: "text-amber-500",
    label: "Dungkhag Court",
  },
  bench: {
    icon: ClipboardList,
    color: "text-gray-500",
    label: "Bench Court",
  },
} as const;

type CourtType = keyof typeof COURT_CONFIG;

interface CourtStats {
  total: number;
  active: number;
  pending: number;
  closed: number;
}

const COURT_STATS_API_URL =
  "http://localhost:3001/api/v1/admin/courts/statistics";

const CourtStatistics = () => {
  const router = useRouter();
  const { token, logout } = useLoginStore();

  // Fetch court statistics with React Query
  const {
    data: stats,
    isLoading,
    error,
  } = useQuery<Record<CourtType, CourtStats>>({
    queryKey: ["courtStatistics"],
    queryFn: async () => {
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(COURT_STATS_API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (response.status === 401) {
        logout();
        router.push("/login");
        throw new Error("Session expired. Please login again.");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to fetch: ${response.status}`
        );
      }

      const data = await response.json();

      // Validate and transform the data
      const validatedData: Record<CourtType, CourtStats> = {} as Record<
        CourtType,
        CourtStats
      >;

      (Object.keys(COURT_CONFIG) as CourtType[]).forEach((courtType) => {
        if (data[courtType]) {
          validatedData[courtType] = {
            total: Number(data[courtType].total) || 0,
            active: Number(data[courtType].active) || 0,
            pending: Number(data[courtType].pending) || 0,
            closed: Number(data[courtType].closed) || 0,
          };
        } else {
          validatedData[courtType] = {
            total: 0,
            active: 0,
            pending: 0,
            closed: 0,
          };
        }
      });

      return validatedData;
    },
    staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Cache is kept for 30 minutes
    retry: 3, // Retry failed requests 3 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error instanceof Error && error.message.includes("Session expired")) {
    return (
      <div className="p-4">
        <div className="flex items-center gap-2 p-4 bg-yellow-50 rounded-lg text-yellow-600">
          <AlertCircle className="w-5 h-5" />
          <div>
            <p className="font-medium">Session Expired</p>
            <p className="text-sm">Redirecting to login...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="flex items-center gap-2 p-4 bg-red-50 rounded-lg text-red-600">
          <AlertCircle className="w-5 h-5" />
          <div>
            <p className="font-medium">Error</p>
            <p className="text-sm">{error.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-sm underline">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-4">
        <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-lg text-blue-600">
          <AlertCircle className="w-5 h-5" />
          <p>No statistics available</p>
          <button
            onClick={() => window.location.reload()}
            className="ml-2 text-sm underline">
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 p-4">
      {(Object.entries(stats) as [CourtType, CourtStats][]).map(
        ([courtType, courtStats]) => (
          <CourtCard key={courtType} courtType={courtType} stats={courtStats} />
        )
      )}
    </div>
  );
};

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 p-4">
      {Object.keys(COURT_CONFIG).map((_, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4 rounded-full" />
          </CardHeader>
          <CardContent>
            {["Total", "Active", "Pending", "Closed"].map((label) => (
              <div key={label} className="flex justify-between">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-6" />
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function CourtCard({
  courtType,
  stats,
}: {
  courtType: CourtType;
  stats: CourtStats;
}) {
  const { icon: Icon, color, label } = COURT_CONFIG[courtType];

  return (
    <Card className="hover:shadow-lg transition-shadow min-h-[200px] hover:border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        <Icon className={`h-5 w-5 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <StatItem label="Total" value={stats.total} />
          <StatItem label="Active" value={stats.active} />
          <StatItem label="Pending" value={stats.pending} />
          <StatItem label="Closed" value={stats.closed} />
        </div>
      </CardContent>
    </Card>
  );
}

function StatItem({ label, value = 0 }: { label: string; value?: number }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-medium text-right min-w-[2rem]">
        {value.toLocaleString()}
      </span>
    </div>
  );
}

export default CourtStatistics;
