import React, { useEffect, useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Package,
  Truck,
  Users,
} from "lucide-react";

import AdminSidebar from "../../components/admin/AdminSidebar";
import Header from "../../components/Header/Header";
import AdminFooter from "../../components/admin/AdminFooter";

const ORDERS_KEY = "goldenpr_orders";

/* ============================================================
   ORDER STORAGE
============================================================ */

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

/* ============================================================
   STATUS HELPERS
============================================================ */

function normalizeStatus(status) {
  const normalized = String(status || "")
    .trim()
    .toLowerCase();

  if (normalized === "pending") {
    return "PENDING";
  }

  if (
    ["processing", "confirmed", "purifying"].includes(
      normalized
    )
  ) {
    return "PROCESSING";
  }

  if (
    ["out for delivery", "in transit", "delivery"].includes(
      normalized
    )
  ) {
    return "OUT FOR DELIVERY";
  }

  if (["delivered", "completed"].includes(normalized)) {
    return "DELIVERED";
  }

  if (["cancelled", "canceled"].includes(normalized)) {
    return "CANCELLED";
  }

  return "PENDING";
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

/* ============================================================
   NEW ORDERS TABLE HELPERS
============================================================ */

function getProductName(order) {
  if (!Array.isArray(order.products) || order.products.length === 0) {
    return "Unpaid";
  }

  const productNames = order.products
    .map(
      (product) =>
        product.name ||
        product.productName ||
        product.title ||
        ""
    )
    .filter(Boolean);

  if (productNames.length === 0) {
    return "—";
  }

  if (productNames.length === 1) {
    return productNames[0];
  }

  return `${productNames[0]} + ${productNames.length - 1} more`;
}

function getPaidStatus(order) {
  const paymentStatus =
    order.paymentStatus ||
    order.payment?.status ||
    order.payment?.paymentStatus ||
    "";

  if (
    order.isPaid === true ||
    order.paid === true ||
    String(paymentStatus).trim().toLowerCase() === "paid"
  ) {
    return "Paid";
  }

  if (
    order.isPaid === false ||
    order.paid === false ||
    ["unpaid", "pending", "unpaid"].includes(
      String(paymentStatus).trim().toLowerCase()
    )
  ) {
    return "Unpaid";
  }

  return "—";
}

function getAmount(order) {
  const amount = Number(
    order.total ?? order.subtotal ?? 0
  );

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

function formatDeliveryDate(order) {
  const dateValue =
    order.deliveryDate ||
    order.updatedAt ||
    order.createdAt;

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

  const dateValue =
    order.updatedAt || order.createdAt;

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

/* ============================================================
   SYSTEM STATUS COLORS
============================================================ */

const STATUS_CONFIG = {
  PENDING: {
    label: "Pending",
    badge: "border-amber-200 bg-amber-50 text-amber-700",
    soft: "bg-amber-50",
    icon: "bg-amber-50 text-amber-600",
    dot: "#f59e0b",
  },

  PROCESSING: {
    label: "Processing",
    badge: "border-blue-200 bg-blue-50 text-blue-700",
    soft: "bg-blue-50",
    icon: "bg-blue-50 text-blue-600",
    dot: "#3b82f6",
  },

  "OUT FOR DELIVERY": {
    label: "Out for Delivery",
    badge: "border-cyan-200 bg-cyan-50 text-cyan-700",
    soft: "bg-cyan-50",
    icon: "bg-cyan-50 text-cyan-600",
    dot: "#06b6d4",
  },

  DELIVERED: {
    label: "Delivered",
    badge: "border-green-200 bg-green-50 text-green-700",
    soft: "bg-green-50",
    icon: "bg-green-50 text-green-600",
    dot: "#22c55e",
  },

  CANCELLED: {
    label: "Cancelled",
    badge: "border-red-200 bg-red-50 text-red-700",
    soft: "bg-red-50",
    icon: "bg-red-50 text-red-600",
    dot: "#ef4444",
  },
};

function getStatusStyle(status) {
  return (
    STATUS_CONFIG[status] ||
    STATUS_CONFIG.PENDING
  );
}

/* ============================================================
   STATISTICS CARDS
============================================================ */

function StatisticsGrid({ orders }) {
  const pending = orders.filter(
    (order) =>
      normalizeStatus(order.status) === "PENDING"
  ).length;

  const processing = orders.filter(
    (order) =>
      normalizeStatus(order.status) === "PROCESSING"
  ).length;

  const forDelivery = orders.filter(
    (order) =>
      normalizeStatus(order.status) === "OUT FOR DELIVERY"
  ).length;

  const delivered = orders.filter(
    (order) =>
      normalizeStatus(order.status) === "DELIVERED"
  ).length;

  const customerNames = new Set(
    orders
      .map((order) =>
        getCustomerName(order)
          .trim()
          .toLowerCase()
      )
      .filter(
        (name) =>
          name && name !== "customer"
      )
  );

  const stats = [
    {
      title: "Pending Orders",
      value: pending,
      status: "PENDING",
      icon: Clock3,
    },
    {
      title: "Processing",
      value: processing,
      status: "PROCESSING",
      icon: Package,
    },
    {
      title: "For Delivery",
      value: forDelivery,
      status: "OUT FOR DELIVERY",
      icon: Truck,
    },
    {
      title: "Delivered",
      value: delivered,
      status: "DELIVERED",
      icon: CheckCircle2,
    },
    {
      title: "Total Customers",
      value: customerNames.size,
      status: null,
      icon: Users,
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat) => {
        const styles = stat.status
          ? getStatusStyle(stat.status)
          : {
              soft: "bg-cyan-50",
              icon: "bg-cyan-50 text-cyan-600",
            };

        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white px-4 py-4 shadow-[0_4px_20px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-[0_8px_28px_rgba(6,182,212,0.10)]"
          >
            <div
              className={`absolute -right-10 -top-10 h-24 w-24 rounded-full opacity-60 blur-2xl ${styles.soft}`}
            />

            <div className="relative">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.9px] text-slate-400">
                    {stat.title}
                  </p>

                  <p className="mt-2.5 text-[27px] font-bold leading-none tracking-tight text-slate-800">
                    {stat.value}
                  </p>
                </div>

                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${styles.icon}`}
                >
                  <Icon className="h-[17px] w-[17px]" />
                </div>
              </div>

              <div className="mt-4 h-1 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full w-2/5 rounded-full ${
                    stat.status === "PENDING"
                      ? "bg-amber-400"
                      : stat.status === "PROCESSING"
                      ? "bg-blue-500"
                      : stat.status === "OUT FOR DELIVERY"
                      ? "bg-cyan-500"
                      : stat.status === "DELIVERED"
                      ? "bg-green-500"
                      : stat.status === "CANCELLED"
                      ? "bg-red-500"
                      : "bg-cyan-500"
                  }`}
                />
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}

/* ============================================================
   NEW ORDERS
============================================================ */

function RecentOrders({
  orders,
  onOpenOrders,
}) {
  const navigate = useNavigate();

  const newOrders = [...orders]
    .sort(
      (a, b) =>
        getOrderTimestamp(b) -
        getOrderTimestamp(a)
    )
    .slice(0, 5);

  function handleOrderClick(order) {
    const orderId =
      order.orderNumber || order.id;

    if (!orderId) {
      return;
    }

    navigate(
      `/admin/orders?highlight=${encodeURIComponent(
        orderId
      )}`
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_4px_22px_rgba(15,23,42,0.04)]">
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-50">
              <Package className="h-3.5 w-3.5 text-cyan-600" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-800">
                New Orders
              </h3>

              <p className="mt-0.5 text-[10px] text-slate-400">
                Latest customer orders
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenOrders}
          className="group flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.6px] text-slate-500 transition-all hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
        >
          View All

          <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px]">
          <thead className="bg-slate-50/70">
            <tr>
              {[
                "Order #",
                "Customer Name",
                "Product",
                "Qty",
                "Delivery Date",
                "Total",
                "Paid",
                "Status",
                "Action",
              ].map((heading) => (
                <th
                  key={heading}
                  className="whitespace-nowrap border-b border-slate-100 px-5 py-3 text-left text-[9px] font-bold uppercase tracking-[0.8px] text-slate-400"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {newOrders.length > 0 ? (
              newOrders.map((order) => {
                const status =
                  normalizeStatus(order.status);

                const styles =
                  getStatusStyle(status);

                const productName =
                  getProductName(order);

                const quantity =
                  getFiveGallonQuantity(order) ||
                  getOrderQuantity(order);

                const paidStatus =
                  getPaidStatus(order);

                return (
                  <tr
                    key={
                      order.id ||
                      order.orderNumber
                    }
                    onClick={() =>
                      handleOrderClick(order)
                    }
                    onKeyDown={(event) => {
                      if (
                        event.key === "Enter" ||
                        event.key === " "
                      ) {
                        event.preventDefault();
                        handleOrderClick(order);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    className="cursor-pointer border-b border-slate-100 transition-colors last:border-b-0 hover:bg-cyan-50/30"
                  >
                    {/* ORDER # */}
                    <td className="whitespace-nowrap px-5 py-3.5 text-[11px] font-bold text-slate-700">
                      {getOrderNumber(order)}
                    </td>

                    {/* CUSTOMER NAME */}
                    <td className="max-w-[190px] truncate px-5 py-3.5 text-[11px] text-slate-600">
                      {getCustomerName(order)}
                    </td>

                    {/* PRODUCT */}
                    <td className="max-w-[210px] truncate px-5 py-3.5 text-[11px] font-medium text-slate-600">
                      {productName}
                    </td>

                    {/* QTY */}
                    <td className="whitespace-nowrap px-5 py-3.5 text-[11px] font-medium text-slate-600">
                      {quantity}
                    </td>

                    {/* DELIVERY DATE */}
                    <td className="whitespace-nowrap px-5 py-3.5 text-[11px] text-slate-600">
                      {formatDeliveryDate(order)}
                    </td>

                    {/* TOTAL */}
                    <td className="whitespace-nowrap px-5 py-3.5 text-[11px] font-bold text-slate-700">
                      {getAmount(order)}
                    </td>

                    {/* PAID */}
                    <td className="whitespace-nowrap px-5 py-3.5">
                      {paidStatus === "Paid" ? (
                        <span className="inline-flex whitespace-nowrap rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.4px] text-green-700">
                          Paid
                        </span>
                      ) : paidStatus === "Unpaid" ? (
                        <span className="inline-flex whitespace-nowrap rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.4px] text-amber-700">
                          Unpaid
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium text-slate-400">
                          —
                        </span>
                      )}
                    </td>

                    {/* STATUS */}
                    <td className="whitespace-nowrap px-5 py-3.5">
                      <span
                        className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.4px] ${styles.badge}`}
                      >
                        {styles.label}
                      </span>
                    </td>

                    {/* ACTION */}
                    <td className="whitespace-nowrap px-5 py-3.5">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleOrderClick(order);
                        }}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition-all hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-600"
                        aria-label={`View order ${getOrderNumber(
                          order
                        )}`}
                      >
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={9}
                  className="px-5 py-12 text-center"
                >
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-cyan-50">
                    <Package className="h-4 w-4 text-cyan-600" />
                  </div>

                  <p className="mt-3 text-xs font-semibold text-slate-600">
                    No new orders
                  </p>

                  <p className="mt-1 text-[10px] text-slate-400">
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

/* ============================================================
   RECENT DELIVERIES
============================================================ */

function DeliverySchedule({
  orders,
  onOpenDeliveries,
}) {
  const deliveries = [...orders]
    .filter(
      (order) =>
        normalizeStatus(order.status) === "DELIVERED"
    )
    .sort(
      (a, b) =>
        getOrderTimestamp(b) -
        getOrderTimestamp(a)
    )
    .slice(0, 3);

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_4px_22px_rgba(15,23,42,0.04)]">
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-50">
            <Truck className="h-3.5 w-3.5 text-green-600" />
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-800">
              Recent Deliveries
            </h3>

            <p className="mt-0.5 text-[10px] text-slate-400">
              Latest completed orders
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenDeliveries}
          className="group flex shrink-0 items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.6px] text-cyan-600 transition-colors hover:text-cyan-700"
        >
          View All

          <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      <div className="p-5">
        {deliveries.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {deliveries.map((order) => {
              const quantity =
                getOrderQuantity(order);

              const total = Number(
                order.total || 0
              );

              return (
                <div
                  key={
                    order.id ||
                    order.orderNumber
                  }
                  className="group rounded-xl border border-slate-200 bg-slate-50/50 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-white hover:shadow-[0_6px_20px_rgba(6,182,212,0.08)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <span className="block truncate text-[9px] font-bold uppercase tracking-[0.6px] text-slate-400">
                        {getOrderNumber(order)}
                      </span>

                      <span className="mt-1.5 block truncate text-xs font-semibold text-slate-700">
                        {getCustomerName(order)}
                      </span>
                    </div>

                    <span className="shrink-0 rounded-md bg-white px-2 py-1 text-[9px] font-medium text-slate-400">
                      {formatDeliveryTime(order)}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-slate-400">
                      {formatDeliveryDate(order)}
                    </span>

                    <span className="rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.4px] text-green-700">
                      Delivered
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3">
                    <span className="text-[10px] text-slate-400">
                      {quantity > 0
                        ? `${quantity} items`
                        : "Delivery completed"}
                    </span>

                    {total > 0 && (
                      <span className="text-[10px] font-bold text-slate-700">
                        ₱{total.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-8 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </div>

            <p className="mt-3 text-xs font-semibold text-slate-600">
              No recent deliveries
            </p>

            <p className="mt-1 text-[10px] text-slate-400">
              Completed deliveries will appear here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

/* ============================================================
   PIE CHART HELPERS
============================================================ */

function polarToCartesian(
  centerX,
  centerY,
  radius,
  angleInDegrees
) {
  const angleInRadians =
    ((angleInDegrees - 90) * Math.PI) / 180;

  return {
    x:
      centerX +
      radius * Math.cos(angleInRadians),

    y:
      centerY +
      radius * Math.sin(angleInRadians),
  };
}

function describePieSlice(
  centerX,
  centerY,
  radius,
  startAngle,
  endAngle
) {
  const start = polarToCartesian(
    centerX,
    centerY,
    radius,
    endAngle
  );

  const end = polarToCartesian(
    centerX,
    centerY,
    radius,
    startAngle
  );

  const largeArcFlag =
    endAngle - startAngle <= 180
      ? "0"
      : "1";

  return [
    `M ${centerX} ${centerY}`,
    `L ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
    "Z",
  ].join(" ");
}

/* ============================================================
   ORDER STATUS OVERVIEW
============================================================ */

function OrderStatusOverview({ orders }) {
  const statuses = [
    "PENDING",
    "PROCESSING",
    "OUT FOR DELIVERY",
    "DELIVERED",
    "CANCELLED",
  ];

  const data = statuses.map((status) => ({
    status,
    count: orders.filter(
      (order) =>
        normalizeStatus(order.status) === status
    ).length,
  }));

  const total = data.reduce(
    (sum, item) => sum + item.count,
    0
  );

  let accumulatedAngle = 0;

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_4px_22px_rgba(15,23,42,0.04)]">
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-50">
            <Package className="h-3.5 w-3.5 text-cyan-600" />
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-800">
              Order Status Overview
            </h3>

            <p className="mt-0.5 text-[10px] text-slate-400">
              Current distribution of all orders
            </p>
          </div>
        </div>

        <div className="rounded-lg bg-cyan-50 px-3 py-2 text-right">
          <p className="text-[8px] font-bold uppercase tracking-[0.7px] text-cyan-600">
            Total Orders
          </p>

          <p className="mt-0.5 text-base font-bold leading-none text-cyan-800">
            {total}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 items-center gap-7 p-5 sm:grid-cols-[230px_1fr] lg:grid-cols-[260px_1fr]">
        <div className="relative mx-auto flex h-[210px] w-[210px] items-center justify-center">
          {total > 0 ? (
            <>
              <svg
                viewBox="0 0 190 190"
                className="h-full w-full"
              >
                {data.map((item) => {
                  if (item.count === 0) {
                    return null;
                  }

                  const percentage =
                    item.count / total;

                  const startAngle =
                    accumulatedAngle;

                  const endAngle =
                    accumulatedAngle +
                    percentage * 360;

                  accumulatedAngle = endAngle;

                  return (
                    <path
                      key={item.status}
                      d={describePieSlice(
                        95,
                        95,
                        78,
                        startAngle,
                        endAngle
                      )}
                      fill={
                        getStatusStyle(
                          item.status
                        ).dot
                      }
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="transition-opacity duration-200 hover:opacity-80"
                    />
                  );
                })}
              </svg>

              <div className="absolute flex h-[88px] w-[88px] flex-col items-center justify-center rounded-full bg-white shadow-[0_2px_12px_rgba(15,23,42,0.06)]">
                <span className="text-[8px] font-bold uppercase tracking-[0.7px] text-slate-400">
                  Total
                </span>

                <span className="mt-1 text-2xl font-bold leading-none text-slate-800">
                  {total}
                </span>

                <span className="mt-1 text-[9px] text-slate-400">
                  Orders
                </span>
              </div>
            </>
          ) : (
            <div className="flex h-[170px] w-[170px] items-center justify-center rounded-full border-[22px] border-slate-100">
              <div className="text-center">
                <span className="block text-2xl font-bold text-slate-700">
                  0
                </span>

                <span className="text-[9px] text-slate-400">
                  Orders
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {data.map((item) => {
            const styles =
              getStatusStyle(item.status);

            const percentage =
              total > 0
                ? Math.round(
                    (item.count / total) * 100
                  )
                : 0;

            return (
              <div
                key={item.status}
                className="group flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-3 transition-all hover:border-cyan-200 hover:bg-cyan-50/40"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{
                      backgroundColor:
                        styles.dot,
                    }}
                  />

                  <span className="truncate text-[11px] font-semibold text-slate-700">
                    {styles.label}
                  </span>
                </div>

                <div className="flex shrink-0 items-center gap-2.5">
                  <span className="text-xs font-bold text-slate-700">
                    {item.count}
                  </span>

                  <span className="min-w-[34px] text-right text-[9px] font-medium text-slate-400">
                    {percentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   DASHBOARD SUMMARY
============================================================ */

function DashboardSummary({ orders }) {
  const summary = useMemo(() => {
    const active = orders.filter((order) => {
      const status =
        normalizeStatus(order.status);

      return (
        status !== "DELIVERED" &&
        status !== "CANCELLED"
      );
    }).length;

    const delivered = orders.filter(
      (order) =>
        normalizeStatus(order.status) ===
        "DELIVERED"
    ).length;

    const cancelled = orders.filter(
      (order) =>
        normalizeStatus(order.status) ===
        "CANCELLED"
    ).length;

    return {
      active,
      delivered,
      cancelled,
    };
  }, [orders]);

  const items = [
    {
      label: "Active Orders",
      value: summary.active,
      icon: Package,
      className: "bg-cyan-50 text-cyan-600",
    },
    {
      label: "Delivered",
      value: summary.delivered,
      icon: CheckCircle2,
      className: "bg-green-50 text-green-600",
    },
    {
      label: "Cancelled",
      value: summary.cancelled,
      icon: AlertCircle,
      className: "bg-red-50 text-red-600",
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.label}
            className="group flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white px-4 py-3.5 shadow-[0_4px_18px_rgba(15,23,42,0.03)] transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-[0_7px_24px_rgba(6,182,212,0.07)]"
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl ${item.className}`}
              >
                <Icon className="h-4 w-4" />
              </div>

              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.7px] text-slate-400">
                  {item.label}
                </p>

                <p className="mt-1 text-lg font-bold leading-none text-slate-800">
                  {item.value}
                </p>
              </div>
            </div>

            <ChevronRight className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-cyan-500" />
          </div>
        );
      })}
    </section>
  );
}

/* ============================================================
   DASHBOARD
============================================================ */

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

    window.addEventListener(
      "orderUpdated",
      loadOrders
    );

    window.addEventListener(
      "ordersUpdated",
      loadOrders
    );

    window.addEventListener(
      "storage",
      handleStorage
    );

    return () => {
      window.removeEventListener(
        "orderUpdated",
        loadOrders
      );

      window.removeEventListener(
        "ordersUpdated",
        loadOrders
      );

      window.removeEventListener(
        "storage",
        handleStorage
      );
    };
  }, []);

  return (
    <main className="flex min-h-screen w-full bg-slate-50">
      <AdminSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />

        <div className="flex-1 overflow-y-auto bg-slate-50 px-4 py-5 pb-10 sm:px-6 sm:py-6 sm:pb-12 lg:px-8 lg:pb-14">
          <div className="mx-auto w-full max-w-[1440px]">
            <div className="flex flex-col gap-5">

              {/* ==================================================
                  HEADER
              ================================================== */}

              <section className="flex flex-col justify-between gap-4 rounded-2xl border border-cyan-100 bg-gradient-to-r from-white via-white to-cyan-50/70 px-5 py-5 shadow-[0_4px_20px_rgba(6,182,212,0.05)] sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-cyan-500 shadow-[0_0_0_4px_rgba(6,182,212,0.10)]" />

                    <span className="text-[9px] font-bold uppercase tracking-[1px] text-cyan-600">
                      Admin Overview
                    </span>
                  </div>

                  <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-800">
                    Dashboard
                  </h2>

                  <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                    Overview of your Golden-PR operations and orders.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="hidden h-10 w-px bg-cyan-100 sm:block" />

                  <div className="rounded-xl border border-cyan-100 bg-white px-4 py-2.5 shadow-sm">
                    <p className="text-[8px] font-bold uppercase tracking-[0.8px] text-slate-400">
                      Total Orders
                    </p>

                    <p className="mt-1 text-lg font-bold leading-none text-cyan-700">
                      {orders.length}
                    </p>
                  </div>
                </div>
              </section>

              {/* ==================================================
                  STAT CARDS
              ================================================== */}

              <StatisticsGrid orders={orders} />

              {/* ==================================================
                  NEW ORDERS
              ================================================== */}

              <RecentOrders
                orders={orders}
                onOpenOrders={() =>
                  navigate("/admin/orders")
                }
              />

              {/* ==================================================
                  RECENT DELIVERIES
              ================================================== */}

              <DeliverySchedule
                orders={orders}
                onOpenDeliveries={() =>
                  navigate("/admin/deliveries")
                }
              />

              {/* ==================================================
                  STATUS CHART
              ================================================== */}

              <OrderStatusOverview
                orders={orders}
              />

              {/* ==================================================
                  QUICK SUMMARY
              ================================================== */}

              <DashboardSummary
                orders={orders}
              />

            </div>
          </div>
        </div>

        <AdminFooter />
      </div>
    </main>
  );
}

export default Dashboard;