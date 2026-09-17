import React, { useEffect, useMemo, useState } from "react";
import {
  CalendarCheck,
  Check,
  ChevronDown,
  Clock3,
  MapPin,
  RefreshCw,
} from "lucide-react";

import AdminSidebar from "../../components/admin/AdminSidebar";
import Header from "../../components/Header/Header";

import {
  getOrders,
  updateOrder,
} from "../../utils/orderStorage";

const statusOptions = [
  "PENDING",
  "CONFIRMED",
  "OUT FOR DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

function convertOrderStatusToDeliveryStatus(status) {
  const normalizedStatus = String(
    status || "Pending",
  )
    .trim()
    .toLowerCase();

  if (normalizedStatus === "pending") {
    return "PENDING";
  }

  if (normalizedStatus === "processing") {
    return "PENDING";
  }

  if (normalizedStatus === "purifying") {
    return "CONFIRMED";
  }

  if (normalizedStatus === "confirmed") {
    return "CONFIRMED";
  }

  if (
    normalizedStatus === "out for delivery" ||
    normalizedStatus === "out_for_delivery" ||
    normalizedStatus === "out-for-delivery"
  ) {
    return "OUT FOR DELIVERY";
  }

  if (
    normalizedStatus === "delivered" ||
    normalizedStatus === "completed"
  ) {
    return "DELIVERED";
  }

  if (
    normalizedStatus === "cancelled" ||
    normalizedStatus === "canceled"
  ) {
    return "CANCELLED";
  }

  return "PENDING";
}

function convertDeliveryStatusToOrderStatus(status) {
  const statusMap = {
    PENDING: "Pending",
    CONFIRMED: "Confirmed",
    "OUT FOR DELIVERY": "Out for Delivery",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
  };

  return statusMap[status] || "Pending";
}

function getDeliveryAddress(order) {
  if (
    Array.isArray(order?.deliveryAddressLines) &&
    order.deliveryAddressLines.length > 0
  ) {
    return order.deliveryAddressLines.join(", ");
  }

  if (
    Array.isArray(order?.deliveryAddress) &&
    order.deliveryAddress.length > 0
  ) {
    return order.deliveryAddress.join(", ");
  }

  if (order?.deliveryAddress) {
    return String(order.deliveryAddress);
  }

  return "No address provided";
}

function getDeliveryDate(order) {
  return (
    order?.deliverySchedule ||
    order?.deliveryTime ||
    order?.deliveryDate ||
    "Not scheduled"
  );
}

function DeliveryCard({
  delivery,
  onUpdateStatus,
}) {
  const [showStatus, setShowStatus] =
    useState(false);

  const isDelivered =
    delivery.status === "DELIVERED";

  const isCancelled =
    delivery.status === "CANCELLED";

  return (
    <div className="w-full max-w-[720px] rounded-xl border border-[#A8DCE8] bg-[#BFEAF5] px-6 py-5 shadow-sm">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-[1fr_1fr_230px] md:items-center">
        <div className="min-w-0">
          <p className="text-[13px] font-medium uppercase tracking-[0.4px] text-[#42778A]">
            Customer
          </p>

          <p className="mt-1 text-[18px] font-bold leading-6 text-[#123047]">
            {delivery.customer}
          </p>

          <div className="mt-2 flex items-start gap-1.5">
            <MapPin
              size={15}
              strokeWidth={1.8}
              className="mt-0.5 shrink-0 text-[#42778A]"
            />

            <span className="text-[14px] leading-5 text-[#42778A]">
              {delivery.address}
            </span>
          </div>
        </div>

        <div className="min-w-0">
          <p className="text-[13px] font-medium uppercase tracking-[0.4px] text-[#42778A]">
            Order Info
          </p>

          <p className="mt-1 text-[18px] font-medium leading-6 text-[#123047]">
            {delivery.orderNumber}
          </p>

          <div className="mt-2 flex items-start gap-1.5">
            <Clock3
              size={15}
              strokeWidth={1.8}
              className="mt-0.5 shrink-0 text-[#42778A]"
            />

            <span className="text-[14px] leading-5 text-[#42778A]">
              {delivery.date}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-stretch gap-3 md:items-end">
          <div className="relative flex justify-end">
            <button
              type="button"
              onClick={() =>
                setShowStatus(
                  (value) => !value,
                )
              }
              className={`flex min-h-[30px] items-center gap-2 rounded-full border px-3 py-1 text-[13px] font-semibold tracking-[0.3px] transition ${
                delivery.status ===
                "OUT FOR DELIVERY"
                  ? "border-[#123047] bg-[#123047] text-white"
                  : delivery.status ===
                      "DELIVERED"
                    ? "border-green-700 bg-green-700 text-white"
                    : delivery.status ===
                        "CANCELLED"
                      ? "border-red-600 bg-red-600 text-white"
                      : delivery.status ===
                          "CONFIRMED"
                        ? "border-[#08779D] bg-[#08779D] text-white"
                        : "border-[#123047] bg-transparent text-[#123047]"
              }`}
            >
              {delivery.status}

              <ChevronDown
                size={13}
                strokeWidth={2}
              />
            </button>

            {showStatus && (
              <div className="absolute right-0 top-9 z-50 w-[180px] overflow-hidden rounded-lg border border-[#C5D8DE] bg-white shadow-lg">
                {statusOptions.map(
                  (option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        onUpdateStatus(
                          delivery.orderNumber,
                          option,
                        );

                        setShowStatus(false);
                      }}
                      className={`block w-full px-3 py-2 text-left text-xs font-medium transition hover:bg-[#BFEAF5] ${
                        option ===
                        delivery.status
                          ? "bg-[#EEF8FB] font-bold text-[#08779D]"
                          : "text-[#123047]"
                      }`}
                    >
                      {option}
                    </button>
                  ),
                )}
              </div>
            )}
          </div>

          {!isDelivered &&
            !isCancelled && (
              <button
                type="button"
                onClick={() => {
                  const nextStatus =
                    delivery.status ===
                      "PENDING" ||
                    delivery.status ===
                      "CONFIRMED"
                      ? "OUT FOR DELIVERY"
                      : "DELIVERED";

                  onUpdateStatus(
                    delivery.orderNumber,
                    nextStatus,
                  );
                }}
                className="flex h-[48px] items-center justify-center gap-2 rounded-lg bg-[#08779D] px-5 text-[13px] font-bold uppercase tracking-[0.3px] text-white shadow-sm transition hover:bg-[#066985]"
              >
                <RefreshCw
                  size={17}
                  strokeWidth={2}
                />

                Update Status
              </button>
            )}
        </div>
      </div>
    </div>
  );
}

function Deliveries() {
  const [activeTab, setActiveTab] =
    useState("active");

  const [
    scheduledToday,
    setScheduledToday,
  ] = useState(false);

  const [deliveries, setDeliveries] =
    useState([]);

  const loadDeliveries = () => {
    const savedOrders = getOrders();

    const savedDeliveries =
      savedOrders.map((order) => ({
        id: `DEL-${
          order?.orderNumber ||
          order?.id
        }`,

        customer:
          order?.customerName ||
          order?.customer ||
          "Unknown Customer",

        address:
          getDeliveryAddress(order),

        orderNumber:
          order?.orderNumber ||
          order?.id,

        date:
          getDeliveryDate(order),

        status:
          convertOrderStatusToDeliveryStatus(
            order?.status,
          ),
      }));

    setDeliveries(savedDeliveries);
  };

  useEffect(() => {
    loadDeliveries();

    const handleOrderUpdate = () => {
      loadDeliveries();
    };

    window.addEventListener(
      "storage",
      handleOrderUpdate,
    );

    window.addEventListener(
      "orderUpdated",
      handleOrderUpdate,
    );

    window.addEventListener(
      "ordersUpdated",
      handleOrderUpdate,
    );

    const interval = setInterval(
      () => {
        loadDeliveries();
      },
      1000,
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleOrderUpdate,
      );

      window.removeEventListener(
        "orderUpdated",
        handleOrderUpdate,
      );

      window.removeEventListener(
        "ordersUpdated",
        handleOrderUpdate,
      );

      clearInterval(interval);
    };
  }, []);

  const handleUpdateStatus = (
    orderNumber,
    newStatus,
  ) => {
    const orderStatus =
      convertDeliveryStatusToOrderStatus(
        newStatus,
      );

    /*
     * Update the original order.
     * This keeps the customer and admin
     * pages synchronized.
     */
    updateOrder(orderNumber, {
      status: orderStatus,
    });

    /*
     * Immediately update this screen.
     */
    setDeliveries(
      (currentDeliveries) =>
        currentDeliveries.map(
          (delivery) =>
            String(
              delivery.orderNumber,
            ) ===
            String(orderNumber)
              ? {
                  ...delivery,
                  status: newStatus,
                }
              : delivery,
        ),
    );
  };

  /*
   * ACTIVE
   *
   * Only orders that are currently
   * being processed or delivered.
   *
   * Cancelled orders are excluded.
   */
  const activeDeliveries = useMemo(
    () =>
      deliveries.filter(
        (delivery) =>
          delivery.status !==
            "DELIVERED" &&
          delivery.status !==
            "CANCELLED",
      ),
    [deliveries],
  );

  /*
   * HISTORY
   *
   * IMPORTANT:
   * History ONLY contains delivered orders.
   *
   * Cancelled orders do NOT appear here.
   */
  const completedDeliveries =
    useMemo(
      () =>
        deliveries.filter(
          (delivery) =>
            delivery.status ===
            "DELIVERED",
        ),
      [deliveries],
    );

  const filteredDeliveries =
    activeTab === "active"
      ? activeDeliveries
      : completedDeliveries;

  /*
   * Scheduled Today filter.
   */
  const displayedDeliveries =
    scheduledToday
      ? filteredDeliveries.filter(
          (delivery) => {
            const dateText =
              String(
                delivery.date || "",
              ).toLowerCase();

            const todayText =
              new Date()
                .toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                  },
                )
                .toLowerCase();

            return (
              dateText.includes(
                "today",
              ) ||
              dateText.includes(
                todayText,
              )
            );
          },
        )
      : filteredDeliveries;

  return (
    <div className="flex min-h-screen bg-background-main">
      <AdminSidebar />

      <div className="min-w-0 flex-1">
        <Header />

        <main className="min-h-[calc(100vh-74px)] bg-background-main">
          <div className="px-6 py-7 sm:px-8 lg:px-12">
            <div className="flex flex-col gap-5 border-b border-[#C7D4D9] pb-6 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <h1 className="text-[30px] font-bold leading-[1.2] tracking-[-0.6px] text-[#123047] sm:text-[34px]">
                  Delivery Management
                </h1>

                <p className="mt-1 text-[15px] leading-6 text-[#456474]">
                  Logistics and routing
                  overview.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex h-[38px] items-center rounded-lg border border-[#C8D8DF] bg-[#EEF5FF] p-1">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveTab(
                        "active",
                      )
                    }
                    className={`h-[30px] min-w-[96px] rounded-md px-4 text-[13px] font-bold uppercase tracking-[0.3px] transition ${
                      activeTab ===
                      "active"
                        ? "bg-[#08779D] text-white shadow-sm"
                        : "text-[#123047]"
                    }`}
                  >
                    Active
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveTab(
                        "history",
                      )
                    }
                    className={`h-[30px] min-w-[96px] rounded-md px-4 text-[13px] font-medium uppercase tracking-[0.3px] transition ${
                      activeTab ===
                      "history"
                        ? "bg-[#08779D] text-white shadow-sm"
                        : "text-[#123047]"
                    }`}
                  >
                    History
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setScheduledToday(
                      (value) => !value,
                    )
                  }
                  className="flex h-[38px] items-center gap-2 rounded-lg border border-[#C8D8DF] bg-[#F5F8FC] px-3 text-[13px] font-bold uppercase tracking-[0.25px] text-[#123047] transition hover:bg-[#EEF5FF]"
                >
                  <span
                    className={`flex h-[19px] w-[19px] items-center justify-center rounded-[4px] ${
                      scheduledToday
                        ? "bg-[#08779D] text-white"
                        : "border border-[#8299A5] bg-white"
                    }`}
                  >
                    {scheduledToday && (
                      <Check
                        size={13}
                        strokeWidth={3}
                      />
                    )}
                  </span>

                  Scheduled for Today
                </button>
              </div>
            </div>

            <div className="mt-12 flex flex-col gap-6">
              {displayedDeliveries.length >
              0 ? (
                displayedDeliveries.map(
                  (delivery) => (
                    <DeliveryCard
                      key={
                        delivery.orderNumber
                      }
                      delivery={
                        delivery
                      }
                      onUpdateStatus={
                        handleUpdateStatus
                      }
                    />
                  ),
                )
              ) : (
                <div className="w-full max-w-[720px] rounded-xl border border-[#C8D8DF] bg-white px-6 py-10 text-center">
                  <CalendarCheck
                    size={32}
                    className="mx-auto text-[#08779D]"
                  />

                  <p className="mt-3 text-sm font-semibold text-[#123047]">
                    No deliveries
                    found.
                  </p>

                  <p className="mt-1 text-xs text-[#456474]">
                    Customer orders will
                    automatically appear
                    here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Deliveries;