import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Header from "../../components/Header/Header";
import CustomerNavbar from "../../components/customer/CustomerNavbar";
import CustomerFooter from "../../components/customer/CustomerFooter";
import snazzyImage from "../../assets/images/snazzy-image (1).png";

import { getCurrentOrder, getOrders } from "../../utils/orderStorage";

const customer = {
  name: "Maria Santos",
  contactNumber: "0917-555-0192",
  address: [
    "Block 4, Lot 12, Phase 2",
    "Sunnyvale Subdivision",
    "Brgy. San Jose, Antipolo",
  ],
};

function WaterDropIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 2C12 2 5 10 5 15.5C5 19.6421 8.13401 22 12 22C15.866 22 19 19.6421 19 15.5C19 10 12 2 12 2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function PurifiedWaterIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M7 3H17V19C17 20.6569 15.6569 22 14 22H10C8.34315 22 7 20.6569 7 19V3Z"
        fill="currentColor"
      />
      <path
        d="M9.5 3V1.5H14.5V3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M9 14C10.2 13.2 11.2 13.2 12 14C12.8 14.8 13.8 14.8 15 14"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DeliveryWaterIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M3 6H14V17H3V6Z" fill="currentColor" />
      <path d="M14 10H18L21 13V17H14V10Z" fill="currentColor" />
      <circle cx="7" cy="19" r="2" fill="currentColor" />
      <circle cx="18" cy="19" r="2" fill="currentColor" />
      <path
        d="M6 9C6 9 8 11 8 12.5C8 13.3284 7.32843 14 6.5 14C5.67157 14 5 13.3284 5 12.5C5 11 6 9 6 9Z"
        fill="white"
      />
    </svg>
  );
}

function DeliveredWaterIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 2C12 2 5 10 5 15.5C5 19.6421 8.13401 22 12 22C15.866 22 19 19.6421 19 15.5C19 10 12 2 12 2Z"
        fill="currentColor"
      />
      <path
        d="M8.5 15.5L10.5 17.5L15.5 12.5"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BackArrowIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M19 12H5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M11 18L5 12L11 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StepIcon({ status, index }) {
  const icons = [
    WaterDropIcon,
    PurifiedWaterIcon,
    DeliveryWaterIcon,
    DeliveredWaterIcon,
  ];

  const Icon = icons[index];

  const styles = {
    done: "border border-emerald-200 bg-emerald-600 text-white",
    current: "border-2 border-blue-600 bg-blue-50 text-blue-700",
    upcoming: "border border-slate-200 bg-slate-100 text-slate-400",
  };

  return (
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full sm:h-11 sm:w-11 ${
        styles[status] || styles.upcoming
      }`}
    >
      <Icon className="h-5 w-5 sm:h-5 sm:w-5" />
    </div>
  );
}

function StepLabel({ step }) {
  const labelColor =
    step.status === "current"
      ? "text-blue-700"
      : step.status === "done"
        ? "text-slate-800"
        : "text-slate-500";

  const timeColor =
    step.status === "current"
      ? "text-blue-700"
      : step.status === "done"
        ? "text-emerald-700"
        : "text-slate-400";

  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <span
        className={`text-[10px] font-bold uppercase tracking-wide sm:text-xs ${labelColor}`}
      >
        {step.label}
      </span>

      <span className={`text-xs sm:text-xs ${timeColor}`}>
        {step.time}
      </span>
    </div>
  );
}

function LinearTracker({ steps }) {
  return (
    <div className="py-1">
      {/* Desktop timeline */}
      <div className="hidden sm:block">
        <div className="flex items-start">
          {steps.map((step, index) => (
            <div
              key={step.label}
              className="flex min-w-0 flex-1 flex-col items-center gap-2"
            >
              <div className="flex w-full items-center">
                <div
                  className={`h-0.5 flex-1 ${
                    index === 0
                      ? "invisible"
                      : steps[index - 1].status === "done"
                        ? "bg-emerald-300"
                        : "bg-slate-200"
                  }`}
                />

                <StepIcon status={step.status} index={index} />

                <div
                  className={`h-0.5 flex-1 ${
                    index === steps.length - 1
                      ? "invisible"
                      : step.status === "done"
                        ? "bg-emerald-300"
                        : "bg-slate-200"
                  }`}
                />
              </div>

              <StepLabel step={step} />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile timeline */}
      <div className="sm:hidden">
        {steps.map((step, index) => (
          <div key={step.label} className="flex gap-3">
            <div className="flex w-10 shrink-0 flex-col items-center">
              <StepIcon status={step.status} index={index} />

              {index < steps.length - 1 && (
                <div
                  className={`my-1 min-h-6 w-0.5 flex-1 ${
                    step.status === "done"
                      ? "bg-emerald-300"
                      : "bg-slate-200"
                  }`}
                />
              )}
            </div>

            <div className="flex flex-1 flex-col gap-1 pb-5 pt-1">
              <span
                className={`text-xs font-bold uppercase tracking-wide ${
                  step.status === "current"
                    ? "text-blue-700"
                    : step.status === "done"
                      ? "text-slate-800"
                      : "text-slate-500"
                }`}
              >
                {step.label}
              </span>

              <span
                className={`text-xs ${
                  step.status === "current"
                    ? "text-blue-700"
                    : step.status === "done"
                      ? "text-emerald-700"
                      : "text-slate-400"
                }`}
              >
                {step.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DetailField({ label, children }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">
        {label}
      </span>

      <div className="break-words text-sm leading-5 text-slate-800">
        {children}
      </div>
    </div>
  );
}

function GoogleLocationMap({ deliveryTime }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="relative w-full">
        <img
          src={snazzyImage}
          alt="Delivery location map"
          className="block h-[190px] w-full object-cover sm:h-[220px]"
        />

        <div className="absolute bottom-3 right-3 max-w-[85%] rounded-lg border border-slate-200 bg-white px-3 py-2.5 shadow-lg">
          <p className="text-[9px] font-bold uppercase tracking-wide text-slate-500">
            Estimated arrival
          </p>

          <p className="mt-0.5 text-sm font-bold text-slate-900">
            {deliveryTime || "To be confirmed"}
          </p>
        </div>
      </div>
    </div>
  );
}

function findLatestTrackedOrder(referenceOrder) {
  if (!referenceOrder) {
    return null;
  }

  const orders = getOrders();

  if (!Array.isArray(orders)) {
    return null;
  }

  const referenceId = referenceOrder.id;
  const referenceOrderNumber = referenceOrder.orderNumber;

  const matchingOrders = orders.filter((storedOrder) => {
    const sameId =
      referenceId != null &&
      storedOrder.id != null &&
      String(storedOrder.id) === String(referenceId);

    const sameOrderNumber =
      referenceOrderNumber != null &&
      storedOrder.orderNumber != null &&
      String(storedOrder.orderNumber) === String(referenceOrderNumber);

    return sameId || sameOrderNumber;
  });

  if (matchingOrders.length === 0) {
    return null;
  }

  return [...matchingOrders].sort((a, b) => {
    const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
    const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();

    return dateB - dateA;
  })[0];
}

function Track() {
  const navigate = useNavigate();
  const location = useLocation();

  const [trackedOrderReference] = useState(
    () => location.state?.order || getCurrentOrder(),
  );

  const [order, setOrder] = useState(null);

  const loadTrackedOrder = useCallback(() => {
    const latestOrder = findLatestTrackedOrder(trackedOrderReference);
    setOrder(latestOrder);
  }, [trackedOrderReference]);

  useEffect(() => {
    loadTrackedOrder();

    const handleOrderUpdate = () => {
      loadTrackedOrder();
    };

    window.addEventListener("orderUpdated", handleOrderUpdate);
    window.addEventListener("ordersUpdated", handleOrderUpdate);
    window.addEventListener("storage", handleOrderUpdate);

    const interval = window.setInterval(loadTrackedOrder, 1000);

    return () => {
      window.removeEventListener("orderUpdated", handleOrderUpdate);
      window.removeEventListener("ordersUpdated", handleOrderUpdate);
      window.removeEventListener("storage", handleOrderUpdate);
      window.clearInterval(interval);
    };
  }, [loadTrackedOrder]);

  const normalizedOrder = useMemo(() => {
    if (!order) {
      return null;
    }

    const products = Array.isArray(order.products)
      ? order.products.map((product) => {
          const quantity = Number(product.quantity) || 0;
          const price = Number(product.price) || 0;

          return {
            ...product,
            quantity,
            price,
            total: quantity * price,
          };
        })
      : [];

    const calculatedSubtotal = products.reduce(
      (sum, product) => sum + Number(product.total || 0),
      0,
    );

    const subtotal =
      order.subtotal != null
        ? Number(order.subtotal)
        : calculatedSubtotal;

    const deliveryFee =
      order.deliveryFee != null
        ? Number(order.deliveryFee)
        : 20;

    const total =
      order.total != null
        ? Number(order.total)
        : subtotal + deliveryFee;

    return {
      ...order,
      products,
      subtotal,
      deliveryFee,
      total,
    };
  }, [order]);

  const currentStatus = String(normalizedOrder?.status || "Pending")
    .trim()
    .toLowerCase();

  const isDelivered =
    currentStatus === "delivered" || currentStatus === "completed";

  const isCancelled =
    currentStatus === "cancelled" || currentStatus === "canceled";

  const steps = useMemo(() => {
    if (isDelivered) {
      return [
        { label: "Pending", time: "Completed", status: "done" },
        { label: "Purifying", time: "Completed", status: "done" },
        {
          label: "Out for Delivery",
          time: "Completed",
          status: "done",
        },
        {
          label: "Delivered",
          time: normalizedOrder?.deliveryTime || "Completed",
          status: "done",
        },
      ];
    }

    if (isCancelled) {
      return [
        { label: "Pending", time: "Cancelled", status: "done" },
        {
          label: "Purifying",
          time: "--:--",
          status: "upcoming",
        },
        {
          label: "Out for Delivery",
          time: "--:--",
          status: "upcoming",
        },
        {
          label: "Delivered",
          time: "--:--",
          status: "upcoming",
        },
      ];
    }

    if (
      currentStatus === "out for delivery" ||
      currentStatus === "in transit" ||
      currentStatus === "delivery"
    ) {
      return [
        { label: "Pending", time: "Completed", status: "done" },
        { label: "Purifying", time: "Completed", status: "done" },
        {
          label: "Out for Delivery",
          time: normalizedOrder?.deliveryTime || "In Transit",
          status: "current",
        },
        {
          label: "Delivered",
          time: "--:--",
          status: "upcoming",
        },
      ];
    }

    if (
      currentStatus === "confirmed" ||
      currentStatus === "purifying" ||
      currentStatus === "processing"
    ) {
      return [
        { label: "Pending", time: "Completed", status: "done" },
        {
          label: "Purifying",
          time: "Preparing",
          status: "current",
        },
        {
          label: "Out for Delivery",
          time: "--:--",
          status: "upcoming",
        },
        {
          label: "Delivered",
          time: "--:--",
          status: "upcoming",
        },
      ];
    }

    return [
      {
        label: "Pending",
        time: "Order Received",
        status: "current",
      },
      {
        label: "Purifying",
        time: "--:--",
        status: "upcoming",
      },
      {
        label: "Out for Delivery",
        time: "--:--",
        status: "upcoming",
      },
      {
        label: "Delivered",
        time: "--:--",
        status: "upcoming",
      },
    ];
  }, [
    currentStatus,
    isCancelled,
    isDelivered,
    normalizedOrder,
  ]);

  const handleBackToOrders = () => {
    navigate("/customer/orders");
  };

  if (!normalizedOrder) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <div className="w-full shrink-0">
          <Header />
        </div>

        <main className="flex flex-1 items-center justify-center px-4 pb-[120px]">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-7 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <WaterDropIcon className="h-7 w-7" />
            </div>

            <h1 className="mt-4 text-xl font-bold text-slate-900">
              No Order to Track
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Place an order first to view its tracking information.
            </p>

            <button
              type="button"
              onClick={() => navigate("/customer/products")}
              className="mt-5 inline-flex min-h-10 items-center justify-center rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Browse Products
            </button>
          </div>
        </main>

        <div className="fixed bottom-0 left-0 z-50 w-full">
          <CustomerNavbar activeTab="track" />
        </div>
      </div>
    );
  }

  const deliveryAddress = Array.isArray(
    normalizedOrder.deliveryAddressLines,
  )
    ? normalizedOrder.deliveryAddressLines
    : Array.isArray(normalizedOrder.deliveryAddress)
      ? normalizedOrder.deliveryAddress
      : typeof normalizedOrder.deliveryAddress === "string" &&
          normalizedOrder.deliveryAddress.trim()
        ? [normalizedOrder.deliveryAddress]
        : customer.address;

  const deliveryTime =
    normalizedOrder.deliveryTime || "--:--";

  const deliverySchedule =
    normalizedOrder.deliverySchedule ||
    `${normalizedOrder.deliveryDate || "Today"}, ${deliveryTime}`;

  const hasStructuredAddress = [
    normalizedOrder.streetAddress,
    normalizedOrder.barangay,
    normalizedOrder.city,
    normalizedOrder.province,
    normalizedOrder.region,
    normalizedOrder.postalCode,
  ].some(
    (value) =>
      value !== undefined &&
      value !== null &&
      String(value).trim() !== "",
  );

  /*
   * Status badge colors match the rest of the system:
   * Pending          = Amber
   * Processing       = Blue
   * Out for Delivery = Cyan
   * Delivered        = Green
   * Cancelled        = Red
   */
  const getStatusBadge = () => {
    if (isDelivered) {
      return {
        badge:
          "border-green-200 bg-green-100 text-green-800",
        dot: "bg-green-600",
        label: "DELIVERED",
      };
    }

    if (isCancelled) {
      return {
        badge:
          "border-red-200 bg-red-100 text-red-800",
        dot: "bg-red-600",
        label: "CANCELLED",
      };
    }

    if (
      currentStatus === "out for delivery" ||
      currentStatus === "in transit" ||
      currentStatus === "delivery"
    ) {
      return {
        badge:
          "border-cyan-200 bg-cyan-100 text-cyan-800",
        dot: "bg-cyan-600",
        label: "OUT FOR DELIVERY",
      };
    }

    if (
      currentStatus === "processing" ||
      currentStatus === "confirmed" ||
      currentStatus === "purifying"
    ) {
      return {
        badge:
          "border-blue-200 bg-blue-100 text-blue-800",
        dot: "bg-blue-600",
        label: "PROCESSING",
      };
    }

    return {
      badge:
        "border-amber-200 bg-amber-100 text-amber-800",
      dot: "bg-amber-600",
      label: "PENDING",
    };
  };

  const statusBadge = getStatusBadge();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <div className="w-full shrink-0">
        <Header />
      </div>

      <main className="flex-1 overflow-y-auto pb-[120px]">
        <div className="mx-auto flex w-full max-w-[1160px] flex-col gap-5 p-4 sm:gap-6 sm:p-5 lg:p-6">
          {/* Page heading */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Customer account
              </p>

              <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                Order Tracking
              </h1>

              <p className="mt-1 text-sm text-slate-600">
                Follow your order from preparation to delivery.
              </p>
            </div>

            <button
              type="button"
              onClick={handleBackToOrders}
              className="inline-flex min-h-9 w-fit items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold tracking-wide text-slate-700 shadow-sm transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:text-sm"
            >
              <BackArrowIcon className="h-3 w-3" />
              BACK TO ORDERS
            </button>
          </div>

          {/* Main content grid */}
          <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-3">
            {/* Tracking and map */}
            <section className="flex min-w-0 flex-col gap-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 lg:col-span-2">
              {/* Order overview */}
              <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Order Number
                  </p>

                  <p className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">
                    #
                    {String(
                      normalizedOrder.orderNumber ||
                        normalizedOrder.id ||
                        "",
                    ).replace(/^#/, "")}
                  </p>
                </div>

                <div className="sm:text-right">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Expected Delivery
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-900 sm:text-base">
                    {deliverySchedule}
                  </p>
                </div>
              </div>

              {/* Current status */}
              <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3.5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Current order status
                  </p>

                  <p className="mt-1 text-base font-bold capitalize text-slate-900">
                    {normalizedOrder.status || "Pending"}
                  </p>
                </div>

                <span
                  className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-bold ${statusBadge.badge}`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${statusBadge.dot}`}
                  />

                  {statusBadge.label}
                </span>
              </div>

              {/* Timeline */}
              <div>
                <div className="mb-3">
                  <h2 className="text-base font-bold text-slate-900">
                    Delivery Progress
                  </h2>

                  <p className="mt-1 text-sm text-slate-600">
                    {isDelivered
                      ? "Your order has been delivered."
                      : isCancelled
                        ? "This order has been cancelled."
                        : "Here are the steps in your order's journey."}
                  </p>
                </div>

                <LinearTracker steps={steps} />
              </div>

              {/* Delivery location */}
              <div className="border-t border-slate-200 pt-4">
                <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Delivery Location
                    </h2>

                    <p className="mt-1 text-sm leading-5 text-slate-600">
                      {isDelivered
                        ? "Your order has arrived at its destination."
                        : isCancelled
                          ? "Tracking is unavailable for a cancelled order."
                          : "Your delivery details are shown below."}
                    </p>
                  </div>

                  {!isDelivered && !isCancelled && (
                    <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold tracking-wide text-emerald-700 sm:text-xs">
                      <span className="h-2 w-2 rounded-full bg-emerald-600" />
                      TRACKING
                    </span>
                  )}
                </div>

                <GoogleLocationMap
                  deliveryTime={
                    isDelivered
                      ? normalizedOrder.deliveryTime || "Delivered"
                      : deliveryTime
                  }
                />
              </div>
            </section>

            {/* Order details sidebar */}
            <section className="flex min-w-0 flex-col gap-4">
              {/* Delivery details */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-4 border-b border-slate-200 pb-2.5">
                  <h2 className="text-base font-bold text-slate-900">
                    Delivery Details
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Recipient and destination
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  {/* Customer */}
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-slate-500">
                      Customer
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {normalizedOrder.customerName ||
                        customer.name}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500">
                      {normalizedOrder.contactNumber ||
                        customer.contactNumber}
                    </p>
                  </div>

                  {/* Location */}
                  <div className="rounded-xl bg-slate-100 p-2.5">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-slate-500">
                        Location
                      </p>

                      <span className="rounded-full bg-white px-2 py-1 text-[8px] font-bold uppercase tracking-wide text-slate-400">
                        Delivery Address
                      </span>
                    </div>

                    {hasStructuredAddress ? (
                      <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-1">
                        <div className="rounded-lg border border-slate-200 bg-white px-2.5 py-2">
                          <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                            Street Address
                          </p>

                          <p className="mt-0.5 break-words text-xs font-semibold leading-4 text-slate-800">
                            {normalizedOrder.streetAddress || "—"}
                          </p>
                        </div>

                        <div className="rounded-lg border border-slate-200 bg-white px-2.5 py-2">
                          <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                            Barangay
                          </p>

                          <p className="mt-0.5 break-words text-xs font-semibold leading-4 text-slate-800">
                            {normalizedOrder.barangay || "—"}
                          </p>
                        </div>

                        <div className="rounded-lg border border-slate-200 bg-white px-2.5 py-2">
                          <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                            City / Municipality
                          </p>

                          <p className="mt-0.5 break-words text-xs font-semibold leading-4 text-slate-800">
                            {normalizedOrder.city || "—"}
                          </p>
                        </div>

                        <div className="rounded-lg border border-slate-200 bg-white px-2.5 py-2">
                          <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                            Province
                          </p>

                          <p className="mt-0.5 break-words text-xs font-semibold leading-4 text-slate-800">
                            {normalizedOrder.province || "—"}
                          </p>
                        </div>

                        <div className="rounded-lg border border-slate-200 bg-white px-2.5 py-2">
                          <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                            Region
                          </p>

                          <p className="mt-0.5 break-words text-xs font-semibold leading-4 text-slate-800">
                            {normalizedOrder.region || "—"}
                          </p>
                        </div>

                        <div className="rounded-lg border border-slate-200 bg-white px-2.5 py-2">
                          <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                            Postal Code
                          </p>

                          <p className="mt-0.5 break-words text-xs font-semibold leading-4 text-slate-800">
                            {normalizedOrder.postalCode || "—"}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-lg border border-slate-200 bg-white px-2.5 py-2">
                        <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                          Address
                        </p>

                        <div className="mt-0.5 flex flex-col text-xs font-semibold leading-4 text-slate-800">
                          {deliveryAddress.map((line, index) => (
                            <span key={`${line}-${index}`}>
                              {line}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Order summary */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-3 border-b border-slate-200 pb-2.5">
                  <h2 className="text-base font-bold text-slate-900">
                    Order Summary
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Items included in this order
                  </p>
                </div>

                {normalizedOrder.products.length > 0 ? (
                  <div className="flex flex-col">
                    {normalizedOrder.products.map(
                      (product, index) => (
                        <div
                          key={
                            product.id ||
                            `${product.name}-${index}`
                          }
                          className="flex items-start justify-between gap-3 border-b border-slate-100 py-2.5 last:border-b-0"
                        >
                          <div className="min-w-0">
                            <p className="break-words text-sm font-medium text-slate-800">
                              {product.name || "Water product"}
                            </p>

                            <p className="mt-0.5 text-xs text-slate-500">
                              Qty: {product.quantity}
                            </p>
                          </div>

                          <span className="shrink-0 text-sm font-semibold text-slate-800">
                            PHP{" "}
                            {Number(product.total || 0).toFixed(
                              2,
                            )}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                ) : (
                  <p className="py-2.5 text-sm text-slate-500">
                    No product details are available for this
                    order.
                  </p>
                )}

                <div className="mt-2.5 flex flex-col gap-2.5 border-t border-slate-200 pt-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-slate-600">
                      Subtotal
                    </span>

                    <span className="text-sm font-medium text-slate-800">
                      PHP {normalizedOrder.subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-slate-600">
                      Delivery Fee
                    </span>

                    <span className="text-sm font-medium text-slate-800">
                      PHP{" "}
                      {normalizedOrder.deliveryFee.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-2.5">
                    <span className="text-sm font-bold text-slate-900">
                      Total
                    </span>

                    <span className="text-base font-bold text-slate-900">
                      PHP {normalizedOrder.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order information */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-3 border-b border-slate-200 pb-2.5">
                  <h2 className="text-base font-bold text-slate-900">
                    Order Information
                  </h2>
                </div>

                <div className="flex flex-col gap-3">
                  <DetailField label="Status">
                    <span
                      className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-semibold ${statusBadge.badge}`}
                    >
                      {normalizedOrder.status || "Pending"}
                    </span>
                  </DetailField>

                  {normalizedOrder.notes && (
                    <DetailField label="Notes">
                      <span className="whitespace-pre-wrap">
                        {normalizedOrder.notes}
                      </span>
                    </DetailField>
                  )}

                  <DetailField label="Date Ordered">
                    <span>
                      {normalizedOrder.createdAt
                        ? new Date(
                            normalizedOrder.createdAt,
                          ).toLocaleDateString("en-PH", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "Not available"}
                    </span>
                  </DetailField>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 z-50 w-full">
        <CustomerNavbar activeTab="track" />
      </div>

      <CustomerFooter />
    </div>
  );
}

export default Track;