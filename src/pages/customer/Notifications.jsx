import React, { useEffect, useState } from "react";
import {
  Bell,
  CheckCircle2,
  Truck,
  Clock,
  XCircle,
} from "lucide-react";

import Header from "../../components/Header/Header";
import CustomerNavbar from "../../components/customer/CustomerNavbar";
import { getOrders } from "../../utils/orderStorage";

function getNotificationForOrder(order) {
  const status = String(order.status || "").toLowerCase();

  let title = "Order Update";
  let message = "Your order has been updated.";
  let Icon = Bell;

  if (
    status.includes("pending") ||
    status.includes("processing")
  ) {
    title = "Order Received";
    message = `Your order ${order.orderNumber || order.id} has been received and is being processed.`;
    Icon = Clock;
  } else if (
    status.includes("purifying") ||
    status.includes("confirmed")
  ) {
    title = "Order Confirmed";
    message = `Your order ${order.orderNumber || order.id} has been confirmed and is being prepared.`;
    Icon = CheckCircle2;
  } else if (
    status.includes("out for delivery") ||
    status.includes("delivery")
  ) {
    title = "Out for Delivery";
    message = `Your order ${order.orderNumber || order.id} is now out for delivery.`;
    Icon = Truck;
  } else if (
    status.includes("delivered") ||
    status.includes("completed")
  ) {
    title = "Order Delivered";
    message = `Your order ${order.orderNumber || order.id} has been delivered.`;
    Icon = CheckCircle2;
  } else if (
    status.includes("cancelled") ||
    status.includes("canceled")
  ) {
    title = "Order Cancelled";
    message = `Your order ${order.orderNumber || order.id} has been cancelled.`;
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
    <div className="flex min-h-screen flex-col bg-background-main">
      <div className="w-full shrink-0">
        <Header />
      </div>

      <main className="flex-1 overflow-y-auto bg-background-card pb-[120px]">
        <div className="mx-auto w-full max-w-[1100px] p-4 sm:p-6">

          <div className="mb-6">
            <h1 className="text-xl font-bold text-text-primary sm:text-2xl">
              Notifications
            </h1>

            <p className="mt-1 text-sm text-text-secondary">
              Stay updated with your orders.
            </p>
          </div>

          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded border border-border-light bg-background-accent px-6 py-12 text-center">
              <Bell className="mb-3 h-8 w-8 text-text-secondary" />

              <h2 className="text-base font-semibold text-text-primary">
                No notifications
              </h2>

              <p className="mt-1 text-sm text-text-secondary">
                You don't have any order updates yet.
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

      <div className="fixed bottom-0 left-0 z-50 w-full">
        <CustomerNavbar activeTab="notifications" />
      </div>
    </div>
  );
}

export default Notifications;