import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
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
  return (
    order.customerName ||
    order.customer?.name ||
    "Customer"
  );
}

function getOrderNumber(order) {
  return order.orderNumber || order.id || "N/A";
}

function formatOrderNumber(order) {
  const orderNumber = String(getOrderNumber(order));
  return `#${orderNumber.replace(/^#+/, "")}`;
}

function getOrderQuantity(order) {
  if (!Array.isArray(order.products)) {
    return 0;
  }

  return order.products.reduce((total, product) => {
    return (
      total +
      Number(product.quantity || product.qty || 0)
    );
  }, 0);
}

function getCompactProducts(order) {
  if (!Array.isArray(order.products)) {
    return [];
  }

  return order.products
    .map((product) => ({
      name:
        product.name ||
        product.productName ||
        product.title ||
        "Unnamed Product",
      quantity: Number(
        product.quantity || product.qty || 0
      ),
    }))
    .filter((product) => product.name);
}

function getPaidStatus(order) {
  const paymentStatus =
    order.paymentStatus ||
    order.payment?.status ||
    order.payment?.paymentStatus ||
    "";

  const normalizedPaymentStatus = String(paymentStatus)
    .trim()
    .toLowerCase();

  if (
    order.isPaid === true ||
    order.paid === true ||
    ["paid", "completed", "complete"].includes(
      normalizedPaymentStatus
    )
  ) {
    return "Paid";
  }

  return "Unpaid";
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

const formatDeliveryTime = (order) => {
  if (order.deliveryTime) {
    const [hours, minutes] = String(
      order.deliveryTime
    ).split(":");

    const hour = Number(hours);

    if (!Number.isNaN(hour) && minutes !== undefined) {
      const period = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 || 12;

      return `${displayHour}:${minutes} ${period}`;
    }

    return order.deliveryTime;
  }

  const dateValue =
    order.updatedAt ||
    order.createdAt;

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
    hour12: true,
  });
};

const STATUS_CONFIG = {
  PENDING: {
    label: "Pending",
    badge:
      "bg-amber-100 text-amber-800 border border-amber-200",
    soft: "bg-amber-50",
    icon: "bg-amber-50 text-amber-600",
  },

  PROCESSING: {
    label: "Processing",
    badge:
      "bg-blue-100 text-blue-800 border border-blue-200",
    soft: "bg-blue-50",
    icon: "bg-blue-50 text-blue-600",
  },

  "OUT FOR DELIVERY": {
    label: "Out for Delivery",
    badge:
      "bg-cyan-100 text-cyan-800 border border-cyan-200",
    soft: "bg-cyan-50",
    icon: "bg-cyan-50 text-cyan-600",
  },

  DELIVERED: {
    label: "Delivered",
    badge:
      "bg-green-100 text-green-800 border border-green-200",
    soft: "bg-green-50",
    icon: "bg-green-50 text-green-600",
  },

  CANCELLED: {
    label: "Cancelled",
    badge:
      "bg-red-100 text-red-800 border border-red-200",
    soft: "bg-red-50",
    icon: "bg-red-50 text-red-600",
  },
};

function getStatusStyle(status) {
  return (
    STATUS_CONFIG[status] ||
    STATUS_CONFIG.PENDING
  );
}

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
      normalizeStatus(order.status) ===
      "OUT FOR DELIVERY"
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
      icon: Truck,
    },
    {
      title: "Out for Delivery",
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
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
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
            className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition-colors hover:border-cyan-200"
          >
            <div
              className={`absolute -right-10 -top-10 h-24 w-24 rounded-full opacity-60 blur-2xl ${styles.soft}`}
            />

            <div className="relative">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.8px] text-slate-400">
                    {stat.title}
                  </p>

                  <p className="mt-2 text-[27px] font-bold leading-none tracking-tight text-slate-800">
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

function RecentOrders({
  orders,
  onOpenOrders,
}) {
  const navigate = useNavigate();

  const activeOrders = [...orders]
    .filter((order) => {
      const status = normalizeStatus(order.status);

      return [
        "PENDING",
        "PROCESSING",
        "OUT FOR DELIVERY",
      ].includes(status);
    })
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
    <section className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* HEADER */}
      <div className="border-b border-blue-100 bg-blue-50 px-4 py-4 sm:px-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
              <Package className="h-4 w-4 text-cyan-600" />
            </div>

            <div className="min-w-0">
              <h3 className="text-sm font-bold text-slate-800">
                New Orders & Active Queue
              </h3>

              <p className="mt-0.5 text-[10px] text-slate-400">
                Orders currently requiring processing or dispatch
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenOrders}
            className="group flex w-full items-center justify-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-2 text-[9px] font-bold uppercase tracking-[0.6px] text-slate-500 transition-colors hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700 sm:w-auto sm:shrink-0"
          >
            View All
            <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>

      {/* MOBILE ORDERS */}
      <div className="block divide-y divide-slate-100 lg:hidden">
        {activeOrders.length > 0 ? (
          activeOrders.map((order) => {
            const status =
              normalizeStatus(order.status);

            const styles =
              getStatusStyle(status);

            const compactProducts =
              getCompactProducts(order);

            const paidStatus =
              getPaidStatus(order);

            const orderKey =
              order.id ||
              order.orderNumber ||
              "order";

            return (
              <button
                key={orderKey}
                type="button"
                onClick={() =>
                  handleOrderClick(order)
                }
                className="block w-full text-left transition-colors hover:bg-slate-50/60 active:bg-slate-50"
              >
                <div className="p-4 sm:p-5">
                  {/* Order Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-[0.6px] text-slate-400">
                        Order
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-700">
                        {formatOrderNumber(order)}
                      </p>
                    </div>

                    <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-slate-400" />
                  </div>

                  {/* Customer */}
                  <div className="mt-4">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.5px] text-slate-400">
                      Customer
                    </p>

                    <p className="mt-1 break-words text-sm font-semibold text-slate-700">
                      {getCustomerName(order)}
                    </p>
                  </div>

                  {/* Items */}
                  <div className="mt-4 rounded-lg bg-slate-50 p-3">
                    <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.5px] text-slate-400">
                      Items
                    </p>

                    {compactProducts.length === 0 ? (
                      <span className="text-xs text-slate-400">
                        No items
                      </span>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {compactProducts.map(
                          (
                            product,
                            productIndex
                          ) => (
                            <div
                              key={`${orderKey}-product-${productIndex}`}
                              className="flex min-w-0 items-start justify-between gap-3"
                            >
                              <span
                                title={product.name}
                                className="min-w-0 flex-1 break-words text-xs font-medium leading-5 text-slate-600"
                              >
                                {product.name}
                              </span>

                              <span className="inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-white px-1.5 text-[10px] font-bold leading-none text-slate-600 shadow-sm">
                                {product.quantity}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>

                  {/* Order Information */}
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {/* Delivery Date */}
                    <div className="min-w-0">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.5px] text-slate-400">
                        Delivery Date
                      </p>

                      <p className="mt-1 break-words text-xs font-medium text-slate-600">
                        {formatDeliveryDate(order)}
                      </p>
                    </div>

                    {/* Total */}
                    <div className="min-w-0">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.5px] text-slate-400">
                        Total
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-700">
                        {getAmount(order)}
                      </p>
                    </div>

                    {/* Payment */}
                    <div className="min-w-0">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.5px] text-slate-400">
                        Payment
                      </p>

                      <span
                        className={`mt-1 inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                          paidStatus === "Paid"
                            ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border border-red-200 bg-red-50 text-red-700"
                        }`}
                      >
                        {paidStatus}
                      </span>
                    </div>

                    {/* Status */}
                    <div className="min-w-0">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.5px] text-slate-400">
                        Status
                      </p>

                      <span
                        className={`mt-1 inline-flex max-w-full items-center rounded-full px-2.5 py-1 text-[10px] font-semibold ${styles.badge}`}
                      >
                        {styles.label}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })
        ) : (
          <div className="px-5 py-12 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-cyan-50">
              <Package className="h-4 w-4 text-cyan-600" />
            </div>

            <p className="mt-3 text-xs font-semibold text-slate-600">
              No active orders
            </p>

            <p className="mt-1 text-[10px] text-slate-400">
              Pending and active deliveries will appear here.
            </p>
          </div>
        )}
      </div>

      {/* DESKTOP ORDERS TABLE */}
      <div className="hidden w-full overflow-x-auto lg:block">
        <table className="w-full table-fixed border-collapse">
          <colgroup>
            <col className="w-[11%]" />
            <col className="w-[15%]" />
            <col className="w-[23%]" />
            <col className="w-[13%]" />
            <col className="w-[11%]" />
            <col className="w-[10%]" />
            <col className="w-[11%]" />
            <col className="w-[6%]" />
          </colgroup>

          <thead>
            <tr className="border-b border-blue-100 bg-blue-50">
              <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.8px] text-slate-600">
                Order #
              </th>

              <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.8px] text-slate-600">
                Customer Name
              </th>

              <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.8px] text-slate-600">
                Items
              </th>

              <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.8px] text-slate-600">
                Delivery Date
              </th>

              <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.8px] text-slate-600">
                Total
              </th>

              <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.8px] text-slate-600">
                Payment
              </th>

              <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.8px] text-slate-600">
                Status
              </th>

              <th className="px-5 py-3.5 text-center text-[11px] font-bold uppercase tracking-[0.8px] text-slate-600">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {activeOrders.length > 0 ? (
              activeOrders.map((order) => {
                const status =
                  normalizeStatus(order.status);

                const styles =
                  getStatusStyle(status);

                const compactProducts =
                  getCompactProducts(order);

                const paidStatus =
                  getPaidStatus(order);

                const orderKey =
                  order.id ||
                  order.orderNumber ||
                  "order";

                return (
                  <tr
                    key={orderKey}
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
                    className="cursor-pointer border-b border-slate-100 bg-white transition-colors last:border-b-0 hover:bg-slate-50/60"
                  >
                    <td className="whitespace-nowrap px-5 py-4 text-xs font-bold text-slate-700">
                      {formatOrderNumber(order)}
                    </td>

                    <td className="px-5 py-4 text-xs font-medium text-slate-600">
                      <span className="block truncate">
                        {getCustomerName(order)}
                      </span>
                    </td>

                    <td className="px-5 py-4 align-middle">
                      <div className="flex min-w-0 flex-col gap-1.5">
                        {compactProducts.length === 0 ? (
                          <span className="text-xs text-gray-400">
                            No items
                          </span>
                        ) : (
                          compactProducts.map(
                            (
                              product,
                              productIndex
                            ) => (
                              <div
                                key={`${orderKey}-product-${productIndex}`}
                                className="flex min-h-6 w-full min-w-0 items-center justify-between gap-3"
                              >
                                <span
                                  title={product.name}
                                  className="min-w-0 flex-1 truncate text-xs font-medium leading-5 text-gray-700"
                                >
                                  {product.name}
                                </span>

                                <span className="inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-gray-100 px-1.5 text-[10px] font-bold leading-none text-gray-600">
                                  {product.quantity}
                                </span>
                              </div>
                            )
                          )
                        )}
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-xs text-slate-600">
                      {formatDeliveryDate(order)}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-xs font-bold text-slate-700">
                      {getAmount(order)}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                          paidStatus === "Paid"
                            ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border border-red-200 bg-red-50 text-red-700"
                        }`}
                      >
                        {paidStatus}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${styles.badge}`}
                      >
                        {styles.label}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-center">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleOrderClick(order);
                        }}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50"
                        aria-label={`View order ${formatOrderNumber(
                          order
                        )}`}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="px-5 py-12 text-center"
                >
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-cyan-50">
                    <Package className="h-4 w-4 text-cyan-600" />
                  </div>

                  <p className="mt-3 text-xs font-semibold text-slate-600">
                    No active orders
                  </p>

                  <p className="mt-1 text-[10px] text-slate-400">
                    Pending and active deliveries will appear here.
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

function DeliverySchedule({
  orders,
  onOpenDeliveries,
}) {
  const navigate = useNavigate();

  const deliveries = [...orders]
    .filter(
      (order) =>
        normalizeStatus(order.status) ===
        "DELIVERED"
    )
    .sort(
      (a, b) =>
        getOrderTimestamp(b) -
        getOrderTimestamp(a)
    )
    .slice(0, 3);

  const handleDeliveryClick = (order) => {
    const orderId =
      order.orderNumber || order.id;

    if (!orderId) {
      return;
    }

    navigate(
      `/admin/orders?tab=history&highlight=${encodeURIComponent(
        orderId
      )}`
    );
  };

  return (
    <section className="w-full">
      {/* RECENT DELIVERIES HEADER */}
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-50">
            <Truck className="h-4 w-4 text-green-600" />
          </div>

          <div className="min-w-0">
            <h3 className="text-base font-bold text-slate-800">
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

      {/* RECENT DELIVERY CARDS */}
      {deliveries.length > 0 ? (
        <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 xl:grid-cols-3">
          {deliveries.map((order) => {
            const compactProducts =
              getCompactProducts(order);

            const total = Number(
              order.total ?? order.subtotal ?? 0
            );

            const deliveryDate =
              formatDeliveryDate(order);

            const deliveryTime =
              formatDeliveryTime(order);

            const orderKey =
              order.id ||
              order.orderNumber ||
              "delivery";

            const displayOrderNumber =
              formatOrderNumber(order);

            return (
              <div
                key={orderKey}
                role="button"
                tabIndex={0}
                onClick={() =>
                  handleDeliveryClick(order)
                }
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" ||
                    event.key === " "
                  ) {
                    event.preventDefault();
                    handleDeliveryClick(order);
                  }
                }}
                aria-label={`View order ${displayOrderNumber}`}
                className="flex h-full min-h-full cursor-pointer flex-col rounded-xl border border-slate-200 bg-white p-5 transition-all hover:border-green-200 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-green-200"
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="min-w-0 text-[10px] font-bold tracking-[0.4px] text-slate-400">
                    {displayOrderNumber}
                  </p>

                  <div className="flex shrink-0 items-center gap-2">
                    {deliveryTime && (
                      <span className="rounded-full bg-slate-50 px-2.5 py-1.5 text-[9px] font-semibold text-slate-500">
                        {deliveryTime}
                      </span>
                    )}

                    <span className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-2.5 py-1.5 text-[9px] font-bold tracking-[0.3px] text-green-700">
                      Delivered
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex-1">
                  <p className="text-sm font-bold text-slate-700">
                    {getCustomerName(order)}
                  </p>

                  <div className="mt-3 flex flex-col gap-2">
                    {compactProducts.length > 0 ? (
                      compactProducts.map(
                        (
                          product,
                          productIndex
                        ) => (
                          <div
                            key={`${orderKey}-product-${productIndex}`}
                            className="flex min-w-0 items-center justify-between gap-4"
                          >
                            <span
                              title={product.name}
                              className="min-w-0 flex-1 truncate text-xs font-medium leading-5 text-slate-600"
                            >
                              {product.name}
                            </span>

                            <span className="inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 px-1.5 text-[10px] font-bold leading-none text-slate-600">
                              {product.quantity}
                            </span>
                          </div>
                        )
                      )
                    ) : (
                      <span className="text-xs text-slate-400">
                        No items
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-5 flex shrink-0 items-end justify-between gap-4 border-t border-slate-100 pt-4">
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.5px] text-slate-400">
                      Total
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-700">
                      ₱{total.toFixed(2)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.5px] text-slate-400">
                      Delivery Date
                    </p>

                    <p className="mt-1 text-xs font-medium text-slate-600">
                      {deliveryDate}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-10 text-center">
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

        <div className="flex-1 overflow-y-auto bg-slate-50 px-4 py-6 pb-12 sm:px-6 sm:py-7 sm:pb-14 lg:px-8 lg:pb-16">
          <div className="mx-auto w-full max-w-[1440px]">
            <div className="flex flex-col gap-6">
              {/* HEADER */}
              <section className="flex flex-col justify-between gap-4 rounded-xl border border-cyan-100 bg-gradient-to-r from-white via-white to-cyan-50/70 px-5 py-5 shadow-sm sm:flex-row sm:items-center">
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

              {/* PRIMARY METRICS */}
              <StatisticsGrid orders={orders} />

              {/* NEW ORDERS / ACTIVE QUEUE */}
              <RecentOrders
                orders={orders}
                onOpenOrders={() =>
                  navigate("/admin/orders")
                }
              />

              {/* EXTRA SPACE BEFORE RECENT DELIVERIES */}
              <div className="pt-4">
                {/* RECENT DELIVERIES */}
                <DeliverySchedule
                  orders={orders}
                  onOpenDeliveries={() =>
                    navigate(
                      "/admin/orders?tab=history"
                    )
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <AdminFooter />
      </div>
    </main>
  );
}

export default Dashboard;