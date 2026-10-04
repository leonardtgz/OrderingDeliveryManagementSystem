
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, Clock, User } from "lucide-react";

import AdminSidebar from "../../components/admin/AdminSidebar";
import Header from "../../components/Header/Header";
import { getActivityLogs } from "../../utils/ActLog";
import AdminFooter from "../../components/admin/AdminFooter";

const ORDERS_KEY = "goldenpr_orders";
const ACTIVITY_KEY = "goldenpr_activity_log";

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

function getOrders() {
  try {
    const savedOrders = localStorage.getItem(ORDERS_KEY);
    const orders = savedOrders ? JSON.parse(savedOrders) : [];

    return Array.isArray(orders) ? orders : [];
  } catch (error) {
    console.error("Failed to load orders:", error);
    return [];
  }
}

function normalizeStatus(status) {
  const normalized = String(status || "").trim().toLowerCase();

  if (["pending", "processing"].includes(normalized)) {
    return "PENDING";
  }

  if (["confirmed", "purifying"].includes(normalized)) {
    return "CONFIRMED";
  }

  if (
    ["out for delivery", "in transit", "delivery"].includes(normalized)
  ) {
    return "OUT FOR DELIVERY";
  }

  if (["delivered", "completed"].includes(normalized)) {
    return "DELIVERED";
  }

  if (["cancelled", "canceled"].includes(normalized)) {
    return "CANCELLED";
  }

  return String(status || "PENDING").toUpperCase();
}

function getCustomerName(order) {
  return order.customerName || order.customer?.name || "Customer";
}

function getOrderNumber(order) {
  return order.orderNumber || order.id || "N/A";
}

function getOrderQuantity(order) {
  if (!Array.isArray(order.products)) {
    return 0;
  }

  return order.products.reduce((total, product) => {
    return total + Number(product.quantity || product.qty || 0);
  }, 0);
}

function getFiveGallonQuantity(order) {
  if (!Array.isArray(order.products)) {
    return 0;
  }

  return order.products.reduce((total, product) => {
    const productName = String(
      product.name || product.productName || ""
    ).toLowerCase();

    const isFiveGallon =
      productName.includes("5 gallon") ||
      productName.includes("5-gallon") ||
      productName.includes("round refill") ||
      productName.includes("slim gallon") ||
      productName.includes("slim refill");

    if (!isFiveGallon) {
      return total;
    }

    return total + Number(product.quantity || product.qty || 0);
  }, 0);
}

function getAmount(order) {
  const amount = Number(order.total ?? order.subtotal ?? 0);
  return `₱ ${amount.toFixed(2)}`;
}

function getOrderTimestamp(order) {
  const timestamp = order.updatedAt || order.createdAt;

  if (!timestamp) {
    return 0;
  }

  const parsed = new Date(timestamp).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
}

function formatDateTime(timestamp) {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDeliveryDate(order) {
  const dateValue =
    order.deliveryDate || order.updatedAt || order.createdAt;

  if (!dateValue) {
    return "Recent";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return String(dateValue);
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDeliveryTime(order) {
  if (order.deliveryTime) {
    return order.deliveryTime;
  }

  const dateValue = order.updatedAt || order.createdAt;

  if (!dateValue) {
    return "";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function getStatusStyle(status) {
  switch (status) {
    case "DELIVERED":
      return "bg-green-100 text-green-800";
    case "OUT FOR DELIVERY":
      return "bg-blue-100 text-blue-800";
    case "CONFIRMED":
      return "bg-cyan-100 text-cyan-800";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    case "PENDING":
    default:
      return "bg-amber-100 text-amber-800";
  }
}

function loadActivityLogs() {
  try {
    const savedLogs = getActivityLogs();

    if (Array.isArray(savedLogs) && savedLogs.length > 0) {
      return savedLogs;
    }

    return fakeActivityLogs;
  } catch (error) {
    console.error("Failed to load activity logs:", error);
    return fakeActivityLogs;
  }
}

function StatisticsGrid({ orders }) {
  const pending = orders.filter(
    (order) => normalizeStatus(order.status) === "PENDING"
  ).length;

  const forDelivery = orders.filter(
    (order) => normalizeStatus(order.status) === "OUT FOR DELIVERY"
  ).length;

  const completed = orders.filter(
    (order) => normalizeStatus(order.status) === "DELIVERED"
  ).length;

  const customerNames = new Set(
    orders
      .map((order) => getCustomerName(order).trim().toLowerCase())
      .filter((name) => name && name !== "customer")
  );

  const stats = [
    { title: "PENDING ORDERS", value: pending, label: "[PENDING]" },
    {
      title: "FOR DELIVERY",
      value: forDelivery,
      label: "[OUT FOR DELIVERY]",
    },
    { title: "TOTAL ORDERS", value: orders.length },
    { title: "COMPLETED", value: completed, label: "[DELIVERED]" },
    { title: "TOTAL CUSTOMERS", value: customerNames.size },
  ];

  return (
    <section className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.slice(0, 3).map((stat) => (
          <div
            key={stat.title}
            className="rounded-md border border-border-light bg-background-lightBlue p-6 shadow-sm sm:p-8"
          >
            <h3 className="text-xs font-semibold uppercase text-text-secondary">
              {stat.title}
            </h3>

            <div className="mt-4 flex flex-wrap items-end gap-3">
              <span className="text-3xl font-bold text-text-secondary sm:text-4xl">
                {stat.value}
              </span>

              {stat.label && (
                <span className="mb-1 text-xs font-semibold text-text-brand">
                  {stat.label}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:w-2/3">
        {stats.slice(3).map((stat) => (
          <div
            key={stat.title}
            className="rounded-md border border-border-light bg-background-lightBlue p-6 shadow-sm sm:p-8"
          >
            <h3 className="text-xs font-semibold uppercase text-text-secondary">
              {stat.title}
            </h3>

            <div className="mt-4 flex flex-wrap items-end gap-3">
              <span className="text-3xl font-bold text-text-secondary sm:text-4xl">
                {stat.value}
              </span>

              {stat.label && (
                <span className="mb-1 text-xs font-semibold text-text-brand">
                  {stat.label}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function RecentOrders({ orders, onOpenOrders }) {
  const navigate = useNavigate();

  const recentOrders = [...orders]
    .sort((a, b) => getOrderTimestamp(b) - getOrderTimestamp(a))
    .slice(0, 5);

  function handleOrderClick(order) {
    const orderId = order.orderNumber || order.id;

    if (!orderId) {
      return;
    }

    navigate(
      `/admin/orders?highlight=${encodeURIComponent(orderId)}`
    );
  }

  return (
    <section className="min-w-0 flex-1 rounded-md border border-border-light bg-background-card shadow-sm">
      <div className="flex flex-col items-start justify-between gap-4 border-b border-border-light px-4 py-6 sm:flex-row sm:items-center sm:px-6">
        <h3 className="text-lg font-semibold text-text-secondary">
          Recent Orders
        </h3>

        <button
          type="button"
          onClick={onOpenOrders}
          className="rounded border border-primary-background px-4 py-2 text-xs font-semibold uppercase text-text-brand transition-colors hover:bg-primary-background hover:text-white"
        >
          View All
        </button>
      </div>

      <div className="overflow-x-auto p-3 sm:p-4">
        <table className="w-full min-w-[600px]">
          <thead className="border-b border-border-light bg-background-main">
            <tr>
              {["ORDER ID", "CUSTOMER", "QTY", "STATUS", "AMOUNT"].map(
                (heading) => (
                  <th
                    key={heading}
                    className="px-3 py-4 text-left text-xs font-semibold uppercase text-text-secondary"
                  >
                    {heading}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody>
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => {
                const status = normalizeStatus(order.status);

                return (
                  <tr
                    key={order.id || order.orderNumber}
                    onClick={() => handleOrderClick(order)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        handleOrderClick(order);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    className="cursor-pointer border-b border-border-light transition-colors hover:bg-secondary-light"
                  >
                    <td className="px-3 py-5 text-sm text-text-primary">
                      {getOrderNumber(order)}
                    </td>

                    <td className="whitespace-nowrap px-3 py-5 text-sm text-text-primary">
                      {getCustomerName(order)}
                    </td>

                    <td className="px-3 py-5 text-sm text-text-primary">
                      {getFiveGallonQuantity(order) || getOrderQuantity(order)}
                    </td>

                    <td className="px-3 py-5">
                      <span
                        className={`inline-block whitespace-nowrap rounded px-2 py-1 text-xs font-semibold ${getStatusStyle(
                          status
                        )}`}
                      >
                        {status}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-3 py-5 text-sm text-text-primary">
                      {getAmount(order)}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="px-3 py-10 text-center">
                  <p className="text-sm font-semibold text-text-secondary">
                    No recent orders
                  </p>
                  <p className="mt-1 text-xs text-text-accent">
                    New customer orders will appear here.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function DeliverySchedule({ orders, onOpenDeliveries }) {
  const deliveries = [...orders]
    .filter((order) => normalizeStatus(order.status) === "DELIVERED")
    .sort((a, b) => getOrderTimestamp(b) - getOrderTimestamp(a))
    .slice(0, 3);

  return (
    <section className="flex w-full flex-col rounded-md border border-border-light bg-background-card shadow-sm lg:w-1/3">
      <div className="border-b border-border-light px-4 py-6 sm:px-6">
        <h3 className="text-lg font-semibold text-text-secondary">
          Recent Deliveries
        </h3>

        <p className="mt-2 text-sm text-text-accent">
          Latest completed orders
        </p>

        <button
          type="button"
          onClick={onOpenDeliveries}
          className="mt-3 text-left text-xs font-semibold uppercase text-text-brand hover:underline"
        >
          View Delivery History
        </button>
      </div>

      <div className="flex-1 p-4 sm:p-6">
        <div className="flex flex-col gap-4">
          {deliveries.length > 0 ? (
            deliveries.map((order) => {
              const quantity = getOrderQuantity(order);
              const total = Number(order.total || 0);

              return (
                <div
                  key={order.id || order.orderNumber}
                  className="rounded border-l-4 border-primary-background bg-background-lightBlue p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <span className="block text-xs font-semibold text-text-secondary">
                        {getOrderNumber(order)}
                      </span>

                      <span className="mt-1 block truncate text-sm font-semibold text-text-primary">
                        {getCustomerName(order)}
                      </span>
                    </div>

                    <span className="shrink-0 text-right text-sm text-text-accent">
                      {formatDeliveryTime(order)}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-text-secondary">
                    Delivered: {formatDeliveryDate(order)}
                  </p>

                  <div className="mt-2 flex items-center justify-between gap-2">
                    <p className="text-sm text-text-accent">
                      {quantity > 0 ? `${quantity} items` : "Delivery completed"}
                    </p>

                    <span className="rounded bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                      DELIVERED
                    </span>
                  </div>

                  {total > 0 && (
                    <p className="mt-2 text-xs font-semibold text-text-secondary">
                      Total: ₱{total.toFixed(2)}
                    </p>
                  )}
                </div>
              );
            })
          ) : (
            <div className="py-10 text-center">
              <p className="text-sm font-semibold text-text-secondary">
                No recent deliveries
              </p>
              <p className="mt-1 text-xs text-text-accent">
                Completed deliveries will appear here.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-border-light p-4 sm:p-6">
        <button
          type="button"
          onClick={onOpenDeliveries}
          className="w-full rounded bg-primary-background px-4 py-3 text-xs font-semibold uppercase text-white transition-colors hover:opacity-90"
        >
          Go to Deliveries
        </button>
      </div>
    </section>
  );
}

function ActivityLog() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const refreshLogs = () => {
      setLogs(loadActivityLogs());
    };

    refreshLogs();

    const handleStorage = (event) => {
      if (event.key === ACTIVITY_KEY) {
        refreshLogs();
      }
    };

    window.addEventListener("activityLogUpdated", refreshLogs);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("activityLogUpdated", refreshLogs);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return (
    <section className="flex w-full flex-col rounded-lg border border-border-light bg-background-card">
      <div className="flex items-center gap-3 border-b border-border-light px-5 py-4 sm:px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-background-lightBlue text-primary-background">
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

      <div className="max-h-[420px] overflow-y-auto">
        {logs.length > 0 ? (
          logs.map((log, index) => (
            <div
              key={log.id || `${log.timestamp}-${index}`}
              className="flex items-start gap-4 border-b border-border-light px-5 py-4 last:border-b-0 sm:px-6"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-background-main text-text-secondary">
                <User className="h-4 w-4" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-text-primary">
                    {log.userName || log.user || "User"}
                  </span>

                  <span className="rounded bg-background-lightBlue px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-background">
                    {log.role || "User"}
                  </span>
                </div>

                <p className="mt-1 text-sm text-text-secondary">
                  {log.action || log.activity || "Activity recorded"}
                </p>

                <div className="mt-2 flex items-center gap-1.5 text-xs text-text-secondary">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{formatDateTime(log.timestamp || log.createdAt)}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="px-5 py-10 text-center text-sm text-text-secondary">
            No activities recorded yet.
          </p>
        )}
      </div>
    </section>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadOrders = () => {
      setOrders(getOrders());
    };

    loadOrders();

    const handleStorage = (event) => {
      if (event.key === ORDERS_KEY) {
        loadOrders();
      }
    };

    window.addEventListener("orderUpdated", loadOrders);
    window.addEventListener("ordersUpdated", loadOrders);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("orderUpdated", loadOrders);
      window.removeEventListener("ordersUpdated", loadOrders);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return (
    <main className="flex min-h-screen w-full bg-background-main">
      <AdminSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />

        <div className="flex-1 overflow-y-auto bg-background-main px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
          <div className="mx-auto w-full max-w-[1440px]">
            <div className="flex flex-col gap-6 sm:gap-8 lg:gap-10">
              <section>
                <h2 className="text-xl font-bold text-text-secondary sm:text-2xl">
                  Dashboard Overview
                </h2>

                <p className="mt-1 text-sm text-text-accent">
                  Real-time metrics for Golden-PR operations.
                </p>
              </section>

              <StatisticsGrid orders={orders} />

              <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
                <RecentOrders
                  orders={orders}
                  onOpenOrders={() => navigate("/admin/orders")}
                />

                <DeliverySchedule
                  orders={orders}
                  onOpenDeliveries={() => navigate("/admin/deliveries")}
                />
              </div>

              <ActivityLog />
            </div>
          </div>
        </div>
        <AdminFooter />
      </div>
    </main>
  );
}

export default Dashboard;