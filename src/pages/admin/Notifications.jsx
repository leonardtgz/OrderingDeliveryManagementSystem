import React, { useEffect, useState } from "react";
import {
  Bell,
  CheckCircle2,
  Truck,
  Clock,
  XCircle,
} from "lucide-react";

import Header from "../../components/Header/Header";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { getOrders } from "../../utils/orderStorage";

function getNotificationForOrder(order) {
  const status = String(order.status || "").toLowerCase();

  let title = "Order Update";
  let message = "An order has been updated.";
  let Icon = Bell;

  const orderNumber =
    order.orderNumber || order.id || "Unknown Order";

  const customerName =
    order.customerName || "Customer";

  if (
    status.includes("pending") ||
    status.includes("processing")
  ) {
    title = "New / Pending Order";

    message = `${orderNumber} from ${customerName} is pending and requires processing.`;

    Icon = Clock;
  } else if (
    status.includes("purifying") ||
    status.includes("confirmed")
  ) {
    title = "Order Confirmed";

    message = `${orderNumber} from ${customerName} has been confirmed and is being prepared.`;

    Icon = CheckCircle2;
  } else if (
    status.includes("out for delivery") ||
    status.includes("delivery")
  ) {
    title = "Out for Delivery";

    message = `${orderNumber} for ${customerName} is currently out for delivery.`;

    Icon = Truck;
  } else if (
    status.includes("delivered") ||
    status.includes("completed")
  ) {
    title = "Order Delivered";

    message = `${orderNumber} for ${customerName} has been delivered successfully.`;

    Icon = CheckCircle2;
  } else if (
    status.includes("cancelled") ||
    status.includes("canceled")
  ) {
    title = "Order Cancelled";

    message = `${orderNumber} for ${customerName} has been cancelled.`;

    Icon = XCircle;
  }

  return {
    id: `${order.id}-${order.status}`,
    title,
    message,
    date: order.updatedAt || order.createdAt,
    Icon,
  };
}

function formatDate(date) {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toLocaleString("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  const loadNotifications = () => {
    const orders = getOrders();

    const orderNotifications = orders
      .filter((order) => order && (order.id || order.orderNumber))
      .map(getNotificationForOrder)
      .sort((a, b) => {
        return new Date(b.date || 0) - new Date(a.date || 0);
      });

    setNotifications(orderNotifications);
  };

  useEffect(() => {
    loadNotifications();

    const handleOrderUpdate = () => {
      loadNotifications();
    };

    window.addEventListener(
      "ordersUpdated",
      handleOrderUpdate,
    );

    window.addEventListener(
      "orderUpdated",
      handleOrderUpdate,
    );

    window.addEventListener(
      "storage",
      handleOrderUpdate,
    );

    const interval = setInterval(
      loadNotifications,
      1000,
    );

    return () => {
      window.removeEventListener(
        "ordersUpdated",
        handleOrderUpdate,
      );

      window.removeEventListener(
        "orderUpdated",
        handleOrderUpdate,
      );

      window.removeEventListener(
        "storage",
        handleOrderUpdate,
      );

      clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-background-main">

      <AdminSidebar />

      <div className="flex min-h-screen flex-1 flex-col">
        <Header />

        <main className="flex-1 overflow-y-auto bg-background-card">
          <div className="mx-auto w-full max-w-[1100px] p-4 sm:p-6">

            <div className="mb-6">
              <h1 className="text-xl font-bold text-text-primary sm:text-2xl">
                Notifications
              </h1>

              <p className="mt-1 text-sm text-text-secondary">
                Monitor customer order updates.
              </p>
            </div>

            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded border border-border-light bg-background-accent px-6 py-12 text-center">
                <Bell className="mb-3 h-8 w-8 text-text-secondary" />

                <h2 className="text-base font-semibold text-text-primary">
                  No notifications
                </h2>

                <p className="mt-1 text-sm text-text-secondary">
                  There are no order updates yet.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {notifications.map((notification) => {
                  const Icon = notification.Icon;

                  return (
                    <div
                      key={notification.id}
                      className="flex gap-3 rounded border border-border-light bg-background-accent p-4"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-light">
                        <Icon className="h-5 w-5 text-white" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                          <h2 className="text-sm font-semibold text-text-primary sm:text-base">
                            {notification.title}
                          </h2>

                          <span className="text-[10px] text-text-secondary sm:text-xs">
                            {formatDate(notification.date)}
                          </span>
                        </div>

                        <p className="mt-1 text-xs leading-5 text-text-secondary sm:text-sm">
                          {notification.message}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}

export default Notifications;