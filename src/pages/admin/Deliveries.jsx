import React, { useEffect, useMemo, useState } from "react";

import {
  CalendarCheck,
  CalendarDays,
  ChevronDown,
  Clock3,
  MapPin,
  RefreshCw,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import AdminSidebar from "../../components/admin/AdminSidebar";
import Header from "../../components/Header/Header";
import AdminFooter from "../../components/admin/AdminFooter";

import {
  getOrders,
  updateOrder,
} from "../../utils/orderStorage";

const statusOptions = [
  "PENDING",
  "PROCESSING",
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
    .replace(/[\_\-]+/g, " ")
    .replace(/\s+/g, " ");
}

function convertOrderStatusToDeliveryStatus(status) {
  const normalizedStatus = normalizeStatus(status);

  if (normalizedStatus === "pending") {
    return "PENDING";
  }

  if (
    normalizedStatus === "processing" ||
    normalizedStatus === "confirmed" ||
    normalizedStatus === "purifying"
  ) {
    return "PROCESSING";
  }

  if (
    normalizedStatus === "out for delivery" ||
    normalizedStatus === "in transit" ||
    normalizedStatus === "on the way"
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
    PROCESSING: "Processing",
    "OUT FOR DELIVERY": "Out for Delivery",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
  };

  return statusMap[status] || "Pending";
}

// ============================================================
// CONTACT NUMBER HELPER
// ============================================================

function getContactNumber(order) {
  return (
    order?.contactNumber ||
    order?.phoneNumber ||
    order?.customerPhone ||
    order?.phone ||
    order?.contact ||
    order?.mobileNumber ||
    order?.mobile ||
    "Not provided"
  );
}

// ============================================================
// DATE HELPERS
// ============================================================

function getRawDeliveryDate(order) {
  return (
    order?.deliveryDate ||
    order?.deliverySchedule ||
    order?.deliveryTime ||
    ""
  );
}

function getDateOnly(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getDeliveryDate(order) {
  const rawDate = getRawDeliveryDate(order);

  if (!rawDate) {
    return "Not scheduled";
  }

  const formattedDate = getDateOnly(rawDate);

  return formattedDate || String(rawDate);
}

function getDeliveryTimeSlot(order) {
  return (
    order?.deliveryTimeSlot ||
    order?.timeSlot ||
    order?.preferredDeliveryTime ||
    order?.deliveryScheduleTime ||
    order?.deliveryTime ||
    "Not specified"
  );
}

function getTimestamp(order) {
  const value =
    order?.deliveryDate ||
    order?.deliverySchedule ||
    order?.createdAt ||
    order?.updatedAt ||
    "";

  if (!value) {
    return 0;
  }

  const timestamp = new Date(value).getTime();

  return Number.isNaN(timestamp) ? 0 : timestamp;
}

// ============================================================
// ADDRESS HELPERS
// ============================================================

function getAddressFields(order) {
  const address = order?.deliveryAddress;

  const source =
    address &&
    typeof address === "object" &&
    !Array.isArray(address)
      ? address
      : {};

  const lines = Array.isArray(order?.deliveryAddressLines)
    ? order.deliveryAddressLines
    : Array.isArray(address)
      ? address
      : [];

  const getLine = (index) => {
    const value = lines[index];

    return value ? String(value).trim() : "";
  };

  return {
    streetAddress:
      order?.streetAddress ||
      source.streetAddress ||
      source.street ||
      source.streetName ||
      source.addressLine1 ||
      source.address ||
      getLine(0) ||
      "Not provided",

    barangay:
      order?.barangay ||
      source.barangay ||
      source.barangayName ||
      source.village ||
      getLine(1) ||
      "Not provided",

    city:
      order?.city ||
      source.city ||
      source.municipality ||
      source.town ||
      getLine(2) ||
      "Not provided",

    province:
      order?.province ||
      source.province ||
      source.state ||
      getLine(3) ||
      "Not provided",

    region:
      order?.region ||
      source.region ||
      getLine(4) ||
      "Not provided",

    postalCode:
      order?.postalCode ||
      source.postalCode ||
      source.zipCode ||
      source.zip ||
      getLine(5) ||
      "Not provided",
  };
}

function getDeliveryAddress(order) {
  const fields = getAddressFields(order);

  return [
    fields.streetAddress,
    fields.barangay,
    fields.city,
    fields.province,
    fields.region,
    fields.postalCode,
  ]
    .filter(
      (value) =>
        value &&
        value !== "Not provided",
    )
    .join(", ");
}

// ============================================================
// STATUS STYLING
// ============================================================

function getStatusConfig(status) {
  const configs = {
    PENDING: {
      label: "Pending",
      badge:
        "border-amber-200 bg-amber-100 text-amber-800",
      dot: "bg-amber-500",
    },

    PROCESSING: {
      label: "Processing",
      badge:
        "border-blue-200 bg-blue-100 text-blue-800",
      dot: "bg-blue-500",
    },

    "OUT FOR DELIVERY": {
      label: "Out for Delivery",
      badge:
        "border-cyan-200 bg-cyan-100 text-cyan-800",
      dot: "bg-cyan-500",
    },

    DELIVERED: {
      label: "Delivered",
      badge:
        "border-green-200 bg-green-100 text-green-800",
      dot: "bg-green-500",
    },

    CANCELLED: {
      label: "Cancelled",
      badge:
        "border-red-200 bg-red-100 text-red-800",
      dot: "bg-red-500",
    },
  };

  return (
    configs[status] || {
      label: status,
      badge:
        "border-slate-200 bg-slate-100 text-slate-700",
      dot: "bg-slate-400",
    }
  );
}

// ============================================================
// ADDRESS FIELD
// ============================================================

function AddressField({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-slate-400">
        {label}
      </p>

      <p className="mt-0.5 break-words text-xs leading-5 text-slate-700">
        {value}
      </p>
    </div>
  );
}

// ============================================================
// DELIVERY CARD
// ============================================================

function DeliveryCard({
  delivery,
  onUpdateStatus,
  isHistory,
}) {
  const [showStatus, setShowStatus] =
    useState(false);

  const [selectedStatus, setSelectedStatus] =
    useState(delivery.status);

  useEffect(() => {
    setSelectedStatus(delivery.status);
  }, [delivery.status]);

  const isCompleted =
    delivery.status === "DELIVERED";

  const isCancelled =
    delivery.status === "CANCELLED";

  const hasStatusChange =
    selectedStatus !== delivery.status;

  const selectedStatusConfig =
    getStatusConfig(selectedStatus);

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
    <div className="w-full rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="px-5 py-5 sm:px-6 sm:py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)_220px]">

          {/* CUSTOMER + ADDRESS */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700">
                <MapPin
                  size={16}
                  strokeWidth={2}
                />
              </div>

              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">
                Customer
              </p>
            </div>

            <p className="mt-3 break-words text-lg font-bold leading-6 text-slate-900">
              {delivery.customer}
            </p>

            {/* CONTACT NUMBER */}
            <p className="mt-1.5 text-sm font-medium text-slate-500">
              {delivery.contactNumber}
            </p>

            <div className="mt-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">
                Delivery Address
              </p>

              <div className="mt-2 grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
                <AddressField
                  label="Street Address"
                  value={
                    delivery.addressFields.streetAddress
                  }
                />

                <AddressField
                  label="Barangay"
                  value={
                    delivery.addressFields.barangay
                  }
                />

                <AddressField
                  label="City / Municipality"
                  value={
                    delivery.addressFields.city
                  }
                />

                <AddressField
                  label="Province"
                  value={
                    delivery.addressFields.province
                  }
                />

                <AddressField
                  label="Region"
                  value={
                    delivery.addressFields.region
                  }
                />

                <AddressField
                  label="Postal Code"
                  value={
                    delivery.addressFields.postalCode
                  }
                />
              </div>
            </div>
          </div>

          {/* DISPATCH INFORMATION */}
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">
              Dispatch Information
            </p>

            <div className="mt-3 space-y-4">

              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-slate-400">
                  Order Number
                </p>

                <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                  {delivery.orderNumber}
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <CalendarDays
                    size={16}
                    strokeWidth={2}
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-slate-400">
                    Scheduled Date
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {delivery.date}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700">
                  <Clock3
                    size={16}
                    strokeWidth={2}
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-slate-400">
                    Scheduled Time Slot
                  </p>

                  <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                    {delivery.timeSlot}
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* FULFILLMENT STATUS */}
          <div className="flex min-w-0 flex-col justify-start gap-2 lg:items-end">
            <div className="w-full">
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500 lg:text-right">
                Fulfillment Status
              </p>

              {isHistory ? (
                <div
                  className={`mt-2 flex min-h-[42px] w-full items-center justify-between gap-3 rounded-lg border px-3.5 py-2 text-left text-xs font-bold ${selectedStatusConfig.badge}`}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span
                      className={`h-2 w-2 shrink-0 rounded-full ${selectedStatusConfig.dot}`}
                    />

                    <span className="truncate">
                      {
                        selectedStatusConfig.label
                      }
                    </span>
                  </span>
                </div>
              ) : (
                <div className="relative mt-2 w-full">
                  <button
                    type="button"
                    onClick={() =>
                      setShowStatus(
                        (value) => !value,
                      )
                    }
                    className={`flex min-h-[42px] w-full items-center justify-between gap-3 rounded-lg border px-3.5 py-2 text-left text-xs font-bold transition hover:shadow-sm ${selectedStatusConfig.badge}`}
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <span
                        className={`h-2 w-2 shrink-0 rounded-full ${selectedStatusConfig.dot}`}
                      />

                      <span className="truncate">
                        {
                          selectedStatusConfig.label
                        }
                      </span>
                    </span>

                    <ChevronDown
                      size={15}
                      strokeWidth={2}
                      className="shrink-0"
                    />
                  </button>

                  {showStatus && (
                    <div className="absolute left-0 right-0 top-[46px] z-50 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl">
                      {statusOptions.map(
                        (option) => {
                          const config =
                            getStatusConfig(
                              option,
                            );

                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() =>
                                handleStatusSelection(
                                  option,
                                )
                              }
                              className={`flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-xs font-semibold transition hover:bg-slate-50 ${
                                option ===
                                selectedStatus
                                  ? "bg-slate-50"
                                  : ""
                              }`}
                            >
                              <span
                                className={`h-2 w-2 shrink-0 rounded-full ${config.dot}`}
                              />

                              <span
                                className={
                                  option ===
                                  selectedStatus
                                    ? "text-slate-900"
                                    : "text-slate-600"
                                }
                              >
                                {
                                  config.label
                                }
                              </span>
                            </button>
                          );
                        },
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {!isHistory &&
              !isCompleted &&
              !isCancelled && (
                <button
                  type="button"
                  onClick={handleUpdateStatus}
                  disabled={!hasStatusChange}
                  className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#08779D] px-4 text-xs font-bold uppercase tracking-[0.04em] text-white shadow-sm transition hover:bg-[#066985] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <RefreshCw
                    size={15}
                    strokeWidth={2}
                  />

                  Update Status
                </button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ORDERS-STYLE HISTORY SORT MENU
// ============================================================

function HistorySortMenu({
  sortOption,
  setSortOption,
  customerFilter,
  setCustomerFilter,
  customers,
}) {
  const [open, setOpen] =
    useState(false);

  const sortOptions = [
    {
      value: "date-desc",
      label: "Date: Newest to Oldest",
    },
    {
      value: "date-asc",
      label: "Date: Oldest to Newest",
    },
    {
      value: "order-asc",
      label: "Order #: A–Z / 0–9",
    },
    {
      value: "order-desc",
      label: "Order #: Z–A / 9–0",
    },
  ];

  const selectedSort =
    sortOptions.find(
      (option) =>
        option.value === sortOption,
    ) || sortOptions[0];

  const selectedCustomerLabel =
    customerFilter === "all"
      ? "All Customers"
      : customerFilter;

  const handleSortSelect = (
    value,
  ) => {
    setSortOption(value);
  };

  const handleCustomerSelect = (
    value,
  ) => {
    setCustomerFilter(value);
  };

  return (
    <div className="relative shrink-0">
      {/* SORT BUTTON */}
      <button
        type="button"
        onClick={() =>
          setOpen((value) => !value)
        }
        className={`flex h-10 items-center gap-2 rounded-lg px-3.5 text-sm font-semibold transition ${
          open
            ? "bg-slate-100 text-slate-900"
            : "bg-white text-slate-700 hover:bg-slate-50"
        }`}
      >
        <SlidersHorizontal
          size={16}
          strokeWidth={2}
          className="text-slate-600"
        />

        <span>Sort</span>

        <ChevronDown
          size={15}
          strokeWidth={2}
          className={`ml-0.5 text-slate-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <>
          {/* BACKDROP */}
          <button
            type="button"
            aria-label="Close sort menu"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() =>
              setOpen(false)
            }
          />

          {/* DROPDOWN */}
          <div className="absolute right-0 top-[46px] z-50 w-[280px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">

            {/* SORT HEADING */}
            <div className="px-5 pb-2 pt-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">
                Sort Orders
              </p>
            </div>

            {/* SORT OPTIONS */}
            <div className="px-2 pb-2">
              {sortOptions.map(
                (option) => {
                  const isSelected =
                    sortOption ===
                    option.value;

                  return (
                    <button
                      key={
                        option.value
                      }
                      type="button"
                      onClick={() =>
                        handleSortSelect(
                          option.value,
                        )
                      }
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition ${
                        isSelected
                          ? "bg-[#E8F7FB] font-semibold text-[#08779D]"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span>
                        {option.label}
                      </span>

                      {isSelected && (
                        <span className="ml-3 text-[#08779D]">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                },
              )}
            </div>

            {/* DIVIDER */}
            <div className="mx-4 border-t border-slate-100" />

            {/* FROM FILTER */}
            <div className="px-5 pb-2 pt-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">
                From
              </p>
            </div>

            <div className="max-h-[230px] overflow-y-auto px-2 pb-3">

              {/* ALL CUSTOMERS */}
              <button
                type="button"
                onClick={() =>
                  handleCustomerSelect(
                    "all",
                  )
                }
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition ${
                  customerFilter ===
                  "all"
                    ? "bg-[#E8F7FB] font-semibold text-[#08779D]"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span>
                  All Customers
                </span>

                {customerFilter ===
                  "all" && (
                  <span className="ml-3 text-[#08779D]">
                    ✓
                  </span>
                )}
              </button>

              {/* CUSTOMER LIST */}
              {customers.map(
                (customer) => {
                  const isSelected =
                    customerFilter ===
                    customer;

                  return (
                    <button
                      key={customer}
                      type="button"
                      onClick={() =>
                        handleCustomerSelect(
                          customer,
                        )
                      }
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition ${
                        isSelected
                          ? "bg-[#E8F7FB] font-semibold text-[#08779D]"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span className="truncate pr-3">
                        {customer}
                      </span>

                      {isSelected && (
                        <span className="ml-3 shrink-0 text-[#08779D]">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                },
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ============================================================
// MAIN DELIVERIES PAGE
// ============================================================

function Deliveries() {
  const [activeTab, setActiveTab] =
    useState("active");

  const [sortOption, setSortOption] =
    useState("date-desc");

  const [customerFilter, setCustomerFilter] =
    useState("all");

  const [searchQuery, setSearchQuery] =
    useState("");

  const [deliveries, setDeliveries] =
    useState([]);

  // ==========================================================
  // LOAD DELIVERIES
  // ==========================================================

  const loadDeliveries = () => {
    const savedOrders = getOrders();

    if (!Array.isArray(savedOrders)) {
      setDeliveries([]);
      return;
    }

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

    const savedDeliveries =
      uniqueOrders.map((order) => {
        const addressFields =
          getAddressFields(order);

        return {
          id: `DEL-${
            order?.orderNumber ||
            order?.id
          }`,

          customer:
            order?.customerName ||
            order?.customer ||
            "Unknown Customer",

          contactNumber:
            getContactNumber(order),

          address:
            getDeliveryAddress(order),

          addressFields,

          orderNumber:
            order?.orderNumber ||
            order?.id,

          date:
            getDeliveryDate(order),

          timeSlot:
            getDeliveryTimeSlot(order),

          timestamp:
            getTimestamp(order),

          status:
            convertOrderStatusToDeliveryStatus(
              order?.status,
            ),
        };
      });

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
    const orderStatus =
      convertDeliveryStatusToOrderStatus(
        newStatus,
      );

    updateOrder(orderNumber, {
      status: orderStatus,
    });

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
  // ACTIVE DELIVERIES
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
  // HISTORY DELIVERIES
  // ==========================================================

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
  // DYNAMIC CUSTOMER LIST
  // ==========================================================

  const allCustomers =
    useMemo(() => {
      const uniqueCustomers =
        new Set();

      deliveries.forEach(
        (delivery) => {
          const customer =
            String(
              delivery.customer ||
                "",
            ).trim();

          if (customer) {
            uniqueCustomers.add(
              customer,
            );
          }
        },
      );

      return Array.from(
        uniqueCustomers,
      ).sort((a, b) =>
        a.localeCompare(b),
      );
    }, [deliveries]);

  // ==========================================================
  // FILTER + SORT DELIVERIES
  // ==========================================================

  const filteredDeliveries =
    useMemo(() => {
      let filtered =
        activeTab === "active"
          ? [...activeDeliveries]
          : [...historyDeliveries];

      // ------------------------------------------------------
      // SEARCH
      // ------------------------------------------------------

      const normalizedSearch =
        String(searchQuery || "")
          .trim()
          .toLowerCase();

      if (normalizedSearch) {
        filtered =
          filtered.filter(
            (delivery) => {
              const searchableText = [
                delivery.customer,
                delivery.contactNumber,
                delivery.orderNumber,
                delivery.date,
                delivery.timeSlot,
                delivery.address,
                delivery.addressFields
                  ?.streetAddress,
                delivery.addressFields
                  ?.barangay,
                delivery.addressFields
                  ?.city,
                delivery.addressFields
                  ?.province,
                delivery.addressFields
                  ?.region,
                delivery.addressFields
                  ?.postalCode,
              ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

              return searchableText.includes(
                normalizedSearch,
              );
            },
          );
      }

      // ------------------------------------------------------
      // CUSTOMER FILTER
      // ------------------------------------------------------

      if (
        customerFilter !==
        "all"
      ) {
        filtered =
          filtered.filter(
            (delivery) =>
              String(
                delivery.customer ||
                  "",
              ).toLowerCase() ===
              String(
                customerFilter,
              ).toLowerCase(),
          );
      }

      // ------------------------------------------------------
      // SORT
      // ------------------------------------------------------

      filtered.sort((a, b) => {
        if (
          sortOption ===
          "date-asc"
        ) {
          return (
            (a.timestamp || 0) -
            (b.timestamp || 0)
          );
        }

        if (
          sortOption ===
          "order-asc"
        ) {
          return String(
            a.orderNumber || "",
          ).localeCompare(
            String(
              b.orderNumber || "",
            ),
            undefined,
            {
              numeric: true,
              sensitivity: "base",
            },
          );
        }

        if (
          sortOption ===
          "order-desc"
        ) {
          return String(
            b.orderNumber || "",
          ).localeCompare(
            String(
              a.orderNumber || "",
            ),
            undefined,
            {
              numeric: true,
              sensitivity: "base",
            },
          );
        }

        return (
          (b.timestamp || 0) -
          (a.timestamp || 0)
        );
      });

      return filtered;
    }, [
      activeTab,
      activeDeliveries,
      historyDeliveries,
      sortOption,
      customerFilter,
      searchQuery,
    ]);

  // ==========================================================
  // CURRENT DISPLAYED DELIVERIES
  // ==========================================================

  const displayedDeliveries =
    filteredDeliveries;

  // ==========================================================
  // SORT LABEL
  // ==========================================================

  const getSortLabel = () => {
    const labels = {
      "date-desc":
        "Date: Newest to Oldest",

      "date-asc":
        "Date: Oldest to Newest",

      "order-asc":
        "Order #: A–Z / 0–9",

      "order-desc":
        "Order #: Z–A / 9–0",
    };

    return (
      labels[sortOption] ||
      labels["date-desc"]
    );
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />

      <div className="min-w-0 flex-1">
        <Header />

        <main className="min-h-[calc(100vh-74px)] bg-slate-50 pb-16">
          <div className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6 sm:py-7 lg:px-8 lg:py-8">

            {/* HEADER */}
            <div className="border-b border-slate-200 pb-5">
              <div className="flex flex-col gap-5">

                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[28px]">
                    Delivery Management
                  </h1>

                  <p className="mt-1 text-sm text-slate-500">
                    Dispatch, scheduling, and
                    fulfillment tracking.
                  </p>
                </div>

                {/* ACTIVE / HISTORY */}
                <div className="flex h-10 w-full items-center rounded-lg border border-slate-200 bg-white p-1 shadow-sm sm:w-fit">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveTab(
                        "active",
                      )
                    }
                    className={`h-8 flex-1 rounded-md px-4 text-xs font-bold uppercase tracking-[0.03em] transition sm:min-w-[92px] ${
                      activeTab ===
                      "active"
                        ? "bg-[#08779D] text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-50"
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
                    className={`h-8 flex-1 rounded-md px-4 text-xs font-bold uppercase tracking-[0.03em] transition sm:min-w-[92px] ${
                      activeTab ===
                      "history"
                        ? "bg-[#08779D] text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    History
                  </button>
                </div>

                {/* SEARCH + SORT */}
                <div className="flex w-full items-center gap-3">
                  {/* SEARCH */}
                  <div className="relative min-w-0 flex-1">
                    <Search
                      size={17}
                      strokeWidth={2}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(event) =>
                        setSearchQuery(
                          event.target.value,
                        )
                      }
                      placeholder="Search deliveries..."
                      className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#08779D] focus:ring-2 focus:ring-[#08779D]/10"
                    />
                  </div>

                  {/* SORT */}
                  <HistorySortMenu
                    sortOption={
                      sortOption
                    }
                    setSortOption={
                      setSortOption
                    }
                    customerFilter={
                      customerFilter
                    }
                    setCustomerFilter={
                      setCustomerFilter
                    }
                    customers={
                      allCustomers
                    }
                  />
                </div>
              </div>

              {/* FILTER SUMMARY */}
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500">
                <span>
                  <span className="font-semibold text-slate-700">
                    {
                      displayedDeliveries.length
                    }
                  </span>{" "}
                  deliveries shown
                </span>

                <span className="hidden h-3 w-px bg-slate-300 sm:block" />

                <span>
                  View:{" "}
                  <span className="font-semibold text-slate-700">
                    {activeTab ===
                    "active"
                      ? "Active"
                      : "History"}
                  </span>
                </span>

                <span className="hidden h-3 w-px bg-slate-300 sm:block" />

                <span>
                  Sort:{" "}
                  <span className="font-semibold text-slate-700">
                    {getSortLabel()}
                  </span>
                </span>

                {customerFilter !==
                  "all" && (
                  <>
                    <span className="hidden h-3 w-px bg-slate-300 sm:block" />

                    <span>
                      From:{" "}
                      <span className="font-semibold text-slate-700">
                        {
                          customerFilter
                        }
                      </span>
                    </span>
                  </>
                )}

                {searchQuery.trim() && (
                  <>
                    <span className="hidden h-3 w-px bg-slate-300 sm:block" />

                    <span>
                      Search:{" "}
                      <span className="font-semibold text-slate-700">
                        {searchQuery}
                      </span>
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* DELIVERY LIST */}
            <div className="mt-6 flex w-full flex-col gap-4 sm:mt-7">
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
                      isHistory={
                        activeTab ===
                        "history"
                      }
                    />
                  ),
                )
              ) : (
                <div className="w-full rounded-xl border border-slate-200 bg-white px-5 py-12 text-center shadow-sm">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-cyan-50 text-[#08779D]">
                    <CalendarCheck
                      size={24}
                      strokeWidth={1.8}
                    />
                  </div>

                  <p className="mt-4 text-sm font-semibold text-slate-800">
                    No deliveries found.
                  </p>

                  <p className="mx-auto mt-1 w-full max-w-xl text-xs leading-5 text-slate-500">
                    Deliveries matching the selected logistics view will appear here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>

        <AdminFooter />
      </div>
    </div>
  );
}

export default Deliveries;