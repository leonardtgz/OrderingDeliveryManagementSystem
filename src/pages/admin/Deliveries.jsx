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

// ============================================================
// STATUS HELPERS
// ============================================================

function normalizeStatus(status) {
  return String(status || "")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");
}

function convertOrderStatusToDeliveryStatus(status) {
  const normalizedStatus = normalizeStatus(status);

  if (
    normalizedStatus === "" ||
    normalizedStatus === "pending" ||
    normalizedStatus === "processing"
  ) {
    return "PENDING";
  }

  if (
    normalizedStatus === "confirmed" ||
    normalizedStatus === "purifying"
  ) {
    return "CONFIRMED";
  }

  if (
    normalizedStatus === "out for delivery" ||
    normalizedStatus === "in transit"
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

// ============================================================
// DELIVERY DATA HELPERS
// ============================================================

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

// ============================================================
// DELIVERY CARD
// ============================================================

function DeliveryCard({
  delivery,
  onUpdateStatus,
}) {
  const [showStatus, setShowStatus] = useState(false);

  /*
   * This is only the status selected in the dropdown.
   *
   * Selecting a status DOES NOT immediately update the order.
   * The order is only changed when Update Status is clicked.
   */
  const [selectedStatus, setSelectedStatus] =
    useState(delivery.status);

  useEffect(() => {
    setSelectedStatus(delivery.status);
  }, [delivery.status]);

  const isDelivered =
    delivery.status === "DELIVERED";

  const isCancelled =
    delivery.status === "CANCELLED";

  const hasStatusChange =
    selectedStatus !== delivery.status;

  const handleStatusSelection = (status) => {
    setSelectedStatus(status);
    setShowStatus(false);
  };

  const handleUpdateStatus = () => {
    if (!hasStatusChange) {
      return;
    }

    onUpdateStatus(
      delivery.orderNumber,
      selectedStatus,
    );
  };

  return (
    <div className="w-full max-w-[720px] rounded-xl border border-[#A8DCE8] bg-[#BFEAF5] px-4 py-4 shadow-sm sm:px-6 sm:py-5">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-[1fr_1fr_230px] md:items-center">

        {/* ====================================================
            CUSTOMER
        ===================================================== */}

        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-[0.4px] text-[#42778A] sm:text-[13px]">
            Customer
          </p>

          <p className="mt-1 break-words text-base font-bold leading-6 text-[#123047] sm:text-[18px]">
            {delivery.customer}
          </p>

          <div className="mt-2 flex items-start gap-1.5">
            <MapPin
              size={15}
              strokeWidth={1.8}
              className="mt-0.5 shrink-0 text-[#42778A]"
            />

            <span className="break-words text-xs leading-5 text-[#42778A] sm:text-[14px]">
              {delivery.address}
            </span>
          </div>
        </div>

        {/* ====================================================
            ORDER INFO
        ===================================================== */}

        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-[0.4px] text-[#42778A] sm:text-[13px]">
            Order Info
          </p>

          <p className="mt-1 break-words text-base font-medium leading-6 text-[#123047] sm:text-[18px]">
            {delivery.orderNumber}
          </p>

          <div className="mt-2 flex items-start gap-1.5">
            <Clock3
              size={15}
              strokeWidth={1.8}
              className="mt-0.5 shrink-0 text-[#42778A]"
            />

            <span className="break-words text-xs leading-5 text-[#42778A] sm:text-[14px]">
              {delivery.date}
            </span>
          </div>
        </div>

        {/* ====================================================
            STATUS
        ===================================================== */}

        <div className="flex flex-col items-stretch gap-3 md:items-end">

          {/* STATUS DROPDOWN */}

          <div className="relative flex w-full justify-start md:justify-end">
            <button
              type="button"
              onClick={() =>
                setShowStatus(
                  (value) => !value,
                )
              }
              className={`flex min-h-[36px] w-full items-center justify-between gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold tracking-[0.3px] transition sm:min-h-[30px] sm:w-auto sm:py-1 sm:text-[13px] ${
                selectedStatus ===
                "OUT FOR DELIVERY"
                  ? "border-[#123047] bg-[#123047] text-white"
                  : selectedStatus ===
                      "DELIVERED"
                    ? "border-green-700 bg-green-700 text-white"
                    : selectedStatus ===
                        "CANCELLED"
                      ? "border-red-600 bg-red-600 text-white"
                      : selectedStatus ===
                          "CONFIRMED"
                        ? "border-[#08779D] bg-[#08779D] text-white"
                        : "border-[#123047] bg-transparent text-[#123047]"
              }`}
            >
              <span>
                {selectedStatus}
              </span>

              <ChevronDown
                size={13}
                strokeWidth={2}
              />
            </button>

            {showStatus && (
              <div className="absolute left-0 top-11 z-50 w-full overflow-hidden rounded-lg border border-[#C5D8DE] bg-white shadow-lg sm:left-auto sm:right-0 sm:top-9 sm:w-[180px]">
                {statusOptions.map(
                  (option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() =>
                        handleStatusSelection(
                          option,
                        )
                      }
                      className={`block w-full px-3 py-2.5 text-left text-xs font-medium transition hover:bg-[#BFEAF5] ${
                        option ===
                        selectedStatus
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

          {/* ==================================================
              UPDATE STATUS BUTTON
          =================================================== */}

          {!isDelivered &&
            !isCancelled && (
              <button
                type="button"
                onClick={handleUpdateStatus}
                disabled={!hasStatusChange}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#08779D] px-4 text-xs font-bold uppercase tracking-[0.3px] text-white shadow-sm transition hover:bg-[#066985] disabled:cursor-not-allowed disabled:opacity-50 sm:h-[48px] sm:w-auto sm:min-w-[180px] sm:px-5 sm:text-[13px]"
              >
                <RefreshCw
                  size={16}
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

// ============================================================
// MAIN DELIVERIES PAGE
// ============================================================

function Deliveries() {
  const [activeTab, setActiveTab] =
    useState("active");

  const [
    scheduledToday,
    setScheduledToday,
  ] = useState(false);

  const [deliveries, setDeliveries] =
    useState([]);

  // ==========================================================
  // LOAD DELIVERIES
  // ==========================================================

  const loadDeliveries = () => {
    const savedOrders = getOrders();

    /*
     * IMPORTANT:
     * Build one delivery card per order.
     *
     * This prevents duplicate cards from appearing when
     * the same order is encountered more than once.
     */
    const uniqueOrders = [];
    const seenOrders = new Set();

    savedOrders.forEach((order) => {
      const orderNumber =
        order?.orderNumber ||
        order?.id;

      if (!orderNumber) {
        return;
      }

      const normalizedOrderNumber =
        String(orderNumber)
          .trim()
          .toLowerCase();

      if (
        seenOrders.has(
          normalizedOrderNumber,
        )
      ) {
        return;
      }

      seenOrders.add(
        normalizedOrderNumber,
      );

      uniqueOrders.push(order);
    });

    /*
     * Convert each order into one clean delivery card.
     *
     * All variations of:
     * - out_for_delivery
     * - out-for-delivery
     * - Out for Delivery
     * - In Transit
     *
     * become exactly:
     * OUT FOR DELIVERY
     */
    const savedDeliveries =
      uniqueOrders.map((order) => ({
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

    setDeliveries(
      savedDeliveries,
    );
  };

  // ==========================================================
  // LISTEN FOR ORDER CHANGES
  // ==========================================================

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

    /*
     * Keep the admin delivery screen synchronized
     * with customer/admin order changes.
     */
    const interval = setInterval(
      loadDeliveries,
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

  // ==========================================================
  // UPDATE STATUS
  // ==========================================================

  const handleUpdateStatus = (
    orderNumber,
    newStatus,
  ) => {
    /*
     * The status comes directly from the
     * dropdown selection.
     *
     * There is NO automatic status progression.
     */
    const orderStatus =
      convertDeliveryStatusToOrderStatus(
        newStatus,
      );

    updateOrder(orderNumber, {
      status: orderStatus,
    });

    /*
     * Immediately update the current screen.
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

  // ==========================================================
  // ACTIVE
  // ==========================================================

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

  // ==========================================================
  // HISTORY
  // ==========================================================

  /*
   * History contains BOTH:
   *
   * DELIVERED
   * CANCELLED
   *
   * Cancelled orders do not disappear.
   */
  const historyDeliveries =
    useMemo(
      () =>
        deliveries.filter(
          (delivery) =>
            delivery.status ===
              "DELIVERED" ||
            delivery.status ===
              "CANCELLED",
        ),
      [deliveries],
    );

  // ==========================================================
  // ACTIVE / HISTORY TAB
  // ==========================================================

  const filteredDeliveries =
    activeTab === "active"
      ? activeDeliveries
      : historyDeliveries;

  // ==========================================================
  // SCHEDULED TODAY
  // ==========================================================

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

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="flex min-h-screen bg-background-main">
      <AdminSidebar />

      <div className="min-w-0 flex-1">
        <Header />

        <main className="min-h-[calc(100vh-74px)] bg-background-main">
          <div className="px-4 py-6 sm:px-8 sm:py-7 lg:px-12">

            {/* ==================================================
                HEADER
            =================================================== */}

            <div className="flex flex-col gap-5 border-b border-[#C7D4D9] pb-6 xl:flex-row xl:items-start xl:justify-between">

              <div>
                <h1 className="text-[26px] font-bold leading-[1.2] tracking-[-0.6px] text-[#123047] sm:text-[30px] lg:text-[34px]">
                  Delivery Management
                </h1>

                <p className="mt-1 text-sm leading-6 text-[#456474] sm:text-[15px]">
                  Logistics and routing
                  overview.
                </p>
              </div>

              {/* ==================================================
                  FILTERS
              =================================================== */}

              <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center xl:w-auto">

                {/* ACTIVE / HISTORY */}

                <div className="flex h-[40px] w-full items-center rounded-lg border border-[#C8D8DF] bg-[#EEF5FF] p-1 sm:w-auto">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveTab(
                        "active",
                      )
                    }
                    className={`h-[32px] flex-1 rounded-md px-4 text-xs font-bold uppercase tracking-[0.3px] transition sm:min-w-[96px] ${
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
                    className={`h-[32px] flex-1 rounded-md px-4 text-xs font-medium uppercase tracking-[0.3px] transition sm:min-w-[96px] ${
                      activeTab ===
                      "history"
                        ? "bg-[#08779D] text-white shadow-sm"
                        : "text-[#123047]"
                    }`}
                  >
                    History
                  </button>
                </div>

                {/* SCHEDULED TODAY */}

                <button
                  type="button"
                  onClick={() =>
                    setScheduledToday(
                      (value) => !value,
                    )
                  }
                  className="flex h-[40px] w-full items-center justify-center gap-2 rounded-lg border border-[#C8D8DF] bg-[#F5F8FC] px-3 text-xs font-bold uppercase tracking-[0.25px] text-[#123047] transition hover:bg-[#EEF5FF] sm:w-auto"
                >
                  <span
                    className={`flex h-[19px] w-[19px] shrink-0 items-center justify-center rounded-[4px] ${
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

            {/* ==================================================
                DELIVERY CARDS
            =================================================== */}

            <div className="mt-8 flex flex-col gap-5 sm:mt-12 sm:gap-6">
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
                <div className="w-full max-w-[720px] rounded-xl border border-[#C8D8DF] bg-white px-4 py-10 text-center sm:px-6">
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