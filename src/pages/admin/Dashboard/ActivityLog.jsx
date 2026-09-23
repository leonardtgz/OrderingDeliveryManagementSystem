import React, { useEffect, useState } from "react";
import { Activity, Clock, User } from "lucide-react";

import { getActivityLogs } from "../../../utils/ActLog";

const fakeActivityLogs = [
  {
    id: "fake-1",
    role: "Customer",
    userName: "Maria Santos",
    action: "Placed a new water delivery order #ORD-992-04X",
    timestamp: "2026-09-19T11:45:00",
  },
  {
    id: "fake-2",
    role: "Admin",
    userName: "Admin User",
    action: "Updated order #ORD-992-04X status to Out for Delivery",
    timestamp: "2026-09-19T11:30:00",
  },
  {
    id: "fake-3",
    role: "Customer",
    userName: "Juan Dela Cruz",
    action: "Updated delivery address",
    timestamp: "2026-09-19T10:52:00",
  },
  {
    id: "fake-4",
    role: "Admin",
    userName: "Admin User",
    action: "Added a new product: 500ml Bottle (Case of 24)",
    timestamp: "2026-09-19T10:20:00",
  },
  {
    id: "fake-5",
    role: "Customer",
    userName: "Angela Reyes",
    action: "Cancelled order #ORD-775-01B",
    timestamp: "2026-09-19T09:48:00",
  },
  {
    id: "fake-6",
    role: "Admin",
    userName: "Admin User",
    action: "Updated product inventory",
    timestamp: "2026-09-19T09:25:00",
  },
  {
    id: "fake-7",
    role: "Customer",
    userName: "Carlos Mendoza",
    action: "Submitted a support request",
    timestamp: "2026-09-19T08:55:00",
  },
  {
    id: "fake-8",
    role: "Admin",
    userName: "Admin User",
    action: "Marked order #ORD-662-09C as Delivered",
    timestamp: "2026-09-19T08:30:00",
  },
];

const ActivityLog = () => {
  const [logs, setLogs] = useState([]);

  const loadLogs = () => {
    const savedLogs = getActivityLogs();

    if (savedLogs.length > 0) {
      setLogs(savedLogs);
    } else {
      setLogs(fakeActivityLogs);
    }
  };

  useEffect(() => {
    loadLogs();

    const handleActivityUpdate = () => {
      loadLogs();
    };

    const handleStorage = (event) => {
      if (event.key === "goldenpr_activity_log") {
        loadLogs();
      }
    };

    window.addEventListener(
      "activityLogUpdated",
      handleActivityUpdate
    );

    window.addEventListener(
      "storage",
      handleStorage
    );

    return () => {
      window.removeEventListener(
        "activityLogUpdated",
        handleActivityUpdate
      );

      window.removeEventListener(
        "storage",
        handleStorage
      );
    };
  }, []);

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);

    return date.toLocaleString("en-PH", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <section className="flex w-full flex-col rounded-lg border border-border-light bg-background-card">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between border-b border-border-light px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-bg-light-blue text-primary-background">
            <Activity className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-base font-bold text-text-primary sm:text-lg">
              Activity Log
            </h2>

            <p className="text-xs text-text-secondary sm:text-sm">
              Recent customer and admin activities
            </p>
          </div>
        </div>
      </div>

      {/* ================= ACTIVITY LIST ================= */}
      <div className="max-h-[420px] overflow-y-auto">
        {logs.map((log) => (
          <div
            key={log.id}
            className="flex items-start gap-4 border-b border-border-light px-5 py-4 last:border-b-0 sm:px-6"
          >
            {/* USER ICON */}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-background-main text-text-secondary">
              <User className="h-4 w-4" />
            </div>

            {/* ACTIVITY INFORMATION */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold text-text-primary">
                  {log.userName}
                </span>

                <span className="rounded bg-bg-light-blue px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-background">
                  {log.role}
                </span>
              </div>

              <p className="mt-1 text-sm text-text-secondary">
                {log.action}
              </p>

              <div className="mt-2 flex items-center gap-1.5 text-xs text-text-secondary">
                <Clock className="h-3.5 w-3.5" />

                <span>
                  {formatDateTime(log.timestamp)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ActivityLog;