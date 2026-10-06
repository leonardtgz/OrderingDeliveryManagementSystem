import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  ArrowUpDown,
  ChevronDown,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import Header from "../../components/Header/Header";
import CustomerNavbar from "../../components/customer/CustomerNavbar";
import CustomerFooter from "../../components/customer/CustomerFooter";

import roundPurifiedWater from "../../assets/images/round-purified-water.png";
import slimPurifiedWater from "../../assets/images/slim-purified-water.png";
import bottle500ml from "../../assets/images/500ml-bottle.png";

import { getOrders } from "../../utils/orderStorage";

const customer = {
  name: "Maria Santos",
  contactNumber: "0917-555-0192",
  address: [
    "Block 4, Lot 12, Phase 2",
    "Sunnyvale Subdivision",
    "Brgy. San Jose, Antipolo",
  ],
};

const getProductImage = (productName = "") => {
  const name = String(productName).toLowerCase();

  if (
    name.includes("500ml") ||
    name.includes("bottle")
  ) {
    return bottle500ml;
  }

  if (name.includes("slim")) {
    return slimPurifiedWater;
  }

  return roundPurifiedWater;
};

const formatPrice = (value) => {
  return `₱${Number(value || 0).toFixed(2)}`;
};

const getOrderTitle = (order) => {
  const products = Array.isArray(order.products)
    ? order.products
    : [];

  if (products.length === 0) {
    return "Order";
  }

  return products.map((product) => {
    const quantity = Number(
      product.quantity || 0
    );

    return {
      quantity,
      name:
        product.name ||
        "Water product",
    };
  });
};

const getTotalQuantity = (order) => {
  if (Array.isArray(order.products)) {
    return order.products.reduce(
      (sum, product) =>
        sum +
        Number(product.quantity || 0),
      0
    );
  }

  return Number(order.qty || 0);
};

const formatTime12Hour = (time) => {
  if (!time) {
    return "";
  }

  const [hours, minutes] =
    String(time).split(":");

  const hour = Number(hours);

  if (
    Number.isNaN(hour) ||
    minutes === undefined
  ) {
    return time;
  }

  const period =
    hour >= 12 ? "PM" : "AM";

  const displayHour =
    hour % 12 || 12;

  return `${displayHour}:${minutes} ${period}`;
};

const getOrderDate = (order) => {
  if (order.deliverySchedule) {
    return order.deliverySchedule;
  }

  if (
    order.deliveryDate &&
    order.deliveryTime
  ) {
    return `${order.deliveryDate}, ${formatTime12Hour(
      order.deliveryTime
    )}`;
  }

  if (order.deliveryDate) {
    return order.deliveryDate;
  }

  return "Today";
};

const getOrderTimestamp = (order) => {
  const value =
    order?.updatedAt ||
    order?.createdAt ||
    order?.deliveryDate ||
    0;

  const timestamp =
    new Date(value).getTime();

  return Number.isNaN(timestamp)
    ? 0
    : timestamp;
};

const getStatusStyle = (status) => {
  const normalizedStatus = String(
    status || "Pending"
  )
    .trim()
    .toLowerCase();

  if (
    normalizedStatus === "delivered" ||
    normalizedStatus === "completed"
  ) {
    return "border border-green-200 bg-green-100 text-green-800";
  }

  if (
    normalizedStatus === "cancelled" ||
    normalizedStatus === "canceled"
  ) {
    return "border border-red-200 bg-red-100 text-red-800";
  }

  if (
    normalizedStatus === "out for delivery" ||
    normalizedStatus === "in transit" ||
    normalizedStatus === "on the way"
  ) {
    return "border border-cyan-200 bg-cyan-100 text-cyan-800";
  }

  if (
    normalizedStatus === "processing" ||
    normalizedStatus === "purifying" ||
    normalizedStatus === "confirmed"
  ) {
    return "border border-blue-200 bg-blue-100 text-blue-800";
  }

  return "border border-amber-200 bg-amber-100 text-amber-800";
};

const normalizeStatus = (status) => {
  const normalized = String(
    status || "Pending"
  )
    .trim()
    .toLowerCase();

  if (
    normalized === "completed" ||
    normalized === "delivered"
  ) {
    return "Delivered";
  }

  if (
    normalized === "cancelled" ||
    normalized === "canceled"
  ) {
    return "Cancelled";
  }

  if (
    normalized === "out for delivery" ||
    normalized === "in transit" ||
    normalized === "on the way"
  ) {
    return "Out for Delivery";
  }

  if (
    normalized === "processing" ||
    normalized === "purifying" ||
    normalized === "confirmed"
  ) {
    return "Processing";
  }

  return "Pending";
};

const isFinalStatus = (status) => {
  const normalized = String(
    status || ""
  )
    .trim()
    .toLowerCase();

  return [
    "delivered",
    "completed",
    "cancelled",
    "canceled",
    "failed",
  ].includes(normalized);
};

const getDateOnly = (order) => {
  const rawDate =
    order?.deliveryDate ||
    order?.deliverySchedule;

  if (!rawDate) {
    return null;
  }

  const date = new Date(rawDate);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
};

const isSameDay = (
  firstDate,
  secondDate
) => {
  return (
    firstDate.getFullYear() ===
      secondDate.getFullYear() &&
    firstDate.getMonth() ===
      secondDate.getMonth() &&
    firstDate.getDate() ===
      secondDate.getDate()
  );
};

const isTomorrow = (date) => {
  if (!date) {
    return false;
  }

  const tomorrow = new Date();

  tomorrow.setDate(
    tomorrow.getDate() + 1
  );

  return isSameDay(
    date,
    tomorrow
  );
};

const isThisWeek = (date) => {
  if (!date) {
    return false;
  }

  const today = new Date();

  const startOfWeek =
    new Date(today);

  startOfWeek.setDate(
    today.getDate() -
      today.getDay()
  );

  startOfWeek.setHours(
    0,
    0,
    0,
    0
  );

  const endOfWeek =
    new Date(startOfWeek);

  endOfWeek.setDate(
    startOfWeek.getDate() + 7
  );

  return (
    date >= startOfWeek &&
    date < endOfWeek
  );
};

const formatDateForInput = (date) => {
  if (!date) {
    return "";
  }

  const parsedDate =
    new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return "";
  }

  const year =
    parsedDate.getFullYear();

  const month = String(
    parsedDate.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    parsedDate.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const isCustomDateMatch = (
  order,
  selectedDate
) => {
  if (!selectedDate) {
    return false;
  }

  const orderDate =
    getDateOnly(order);

  if (!orderDate) {
    return false;
  }

  return (
    formatDateForInput(
      orderDate
    ) === selectedDate
  );
};

function HistoryCard({
  order,
  onTrack,
  onViewDetails,
}) {
  const products = Array.isArray(
    order.products
  )
    ? order.products
    : [];

  const firstProduct =
    products[0];

  const title =
    getOrderTitle(order);

  const totalQuantity =
    getTotalQuantity(order);

  const image =
    getProductImage(
      firstProduct?.name ||
        order.product ||
        ""
    );

  const status =
    order.status || "Pending";

  const total = Number(
    order.total || 0
  );

  const orderNumber = String(
    order.orderNumber ||
      order.id ||
      ""
  ).replace(/^#+/, "");

  return (
    <div className="group flex w-full flex-col gap-4 rounded-xl border border-stone-200 bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md sm:p-5 md:flex-row md:items-center md:justify-between">
      <div className="flex min-w-0 w-full items-center gap-4 md:w-auto">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-stone-200 bg-stone-50 p-1.5">
          <img
            src={image}
            alt={
              Array.isArray(title)
                ? title
                    .map(
                      (product) =>
                        product.name
                    )
                    .join(", ")
                : title
            }
            className="h-12 w-11 object-contain transition-transform duration-200 group-hover:scale-105"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.6px] text-stone-500">
            ORDER #{orderNumber}
          </span>

          <div className="flex flex-col gap-1.5">
            {Array.isArray(title) &&
            title.length > 0 ? (
              title.map(
                (
                  product,
                  index
                ) => (
                  <div
                    key={`${product.name}-${index}`}
                    className="flex min-h-5 w-full min-w-0 items-center justify-between gap-3"
                  >
                    <span className="min-w-0 flex-1 break-words text-sm font-bold leading-5 text-stone-800 sm:text-base">
                      {product.name}
                    </span>

                    <span className="inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-stone-100 px-1.5 text-[10px] font-bold leading-none text-stone-600">
                      {product.quantity}
                    </span>
                  </div>
                )
              )
            ) : (
              <div className="flex min-h-5 w-full min-w-0 items-center justify-between gap-3">
                <span className="min-w-0 flex-1 break-words text-sm font-bold leading-5 text-stone-800 sm:text-base">
                  Order
                </span>
              </div>
            )}
          </div>

          <div className="mt-1.5 flex flex-wrap gap-2">
            <span className="inline-flex w-fit items-center rounded-full border border-[#A8DCE8] bg-[#E8F8FC] px-2.5 py-1 text-[10px] font-semibold text-[#006994]">
              {totalQuantity} Item
              {totalQuantity !== 1
                ? "s"
                : ""}
            </span>

            <span className="inline-flex w-fit items-center rounded-full border border-[#A8DCE8] bg-[#E8F8FC] px-2.5 py-1 text-[10px] font-semibold text-[#006994]">
              Refill Service
            </span>
          </div>

          <span className="mt-1 text-xs text-stone-500">
            {getOrderDate(order)}
          </span>
        </div>
      </div>

      {/* Right-side information and actions */}
      <div className="flex w-full flex-col gap-4 border-t border-stone-200 pt-4 sm:pt-5 md:w-[300px] md:shrink-0 md:border-0 md:pt-0">
        {/* Stable two-column layout for Total and Status */}
        <div className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-start gap-6">
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.6px] text-stone-500">
              Total
            </span>

            <span className="whitespace-nowrap text-sm font-bold leading-5 text-stone-800">
              {formatPrice(total)}
            </span>
          </div>

          <div className="flex min-w-[110px] flex-col items-end gap-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.6px] text-stone-500">
              Status
            </span>

            <span
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[10px] font-bold tracking-[0.5px] ${getStatusStyle(
                status
              )}`}
            >
              {normalizeStatus(
                status
              )}
            </span>
          </div>
        </div>

        {/* Actions remain in their own stable row */}
        <div className="flex w-full flex-wrap gap-2 md:justify-end">
          <button
            type="button"
            onClick={onViewDetails}
            className="min-h-9 rounded-md border border-[#A8DCE8] bg-[#E8F8FC] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.6px] text-[#006994] transition-colors hover:border-[#08779D] hover:bg-[#C8EDF5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#40BFD8] focus-visible:ring-offset-2 sm:px-4"
          >
            View Details
          </button>

          {!isFinalStatus(
            status
          ) && (
            <button
              type="button"
              onClick={onTrack}
              className="min-h-9 rounded-md border border-[#08779D] bg-[#08779D] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.6px] text-white shadow-sm transition-colors hover:border-[#006994] hover:bg-[#006994] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#40BFD8] focus-visible:ring-offset-2 sm:px-4"
            >
              Track Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Orders() {
  const navigate =
    useNavigate();

  const [savedOrders, setSavedOrders] =
    useState([]);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [dateFilter, setDateFilter] =
    useState("All");

  const [customDate, setCustomDate] =
    useState("");

  const [sortOption, setSortOption] =
    useState("newest");

  const [showFilters, setShowFilters] =
    useState(false);

  const [showSort, setShowSort] =
    useState(false);

  const filterRef =
    useRef(null);

  const filterButtonRef =
    useRef(null);

  const sortRef =
    useRef(null);

  const [filterMenuPosition, setFilterMenuPosition] =
    useState({
      top: 0,
      right: 0,
      maxHeight: undefined,
    });

  const loadOrders = () => {
    const orders = getOrders();

    setSavedOrders(
      Array.isArray(orders)
        ? [...orders]
        : []
    );
  };

  useEffect(() => {
    loadOrders();

    const handleOrdersUpdated =
      () => {
        loadOrders();
      };

    window.addEventListener(
      "storage",
      handleOrdersUpdated
    );

    window.addEventListener(
      "orderUpdated",
      handleOrdersUpdated
    );

    window.addEventListener(
      "ordersUpdated",
      handleOrdersUpdated
    );

    const interval =
      setInterval(
        loadOrders,
        1000
      );

    return () => {
      window.removeEventListener(
        "storage",
        handleOrdersUpdated
      );

      window.removeEventListener(
        "orderUpdated",
        handleOrdersUpdated
      );

      window.removeEventListener(
        "ordersUpdated",
        handleOrdersUpdated
      );

      clearInterval(interval);
    };
  }, []);

  /*
   * Keep the Filters popup attached to the viewport instead of the
   * scrolling <main> container. This prevents it from being clipped
   * by overflow boundaries or the fixed footer/navbar.
   */
  useEffect(() => {
    if (!showFilters) {
      return undefined;
    }

    const updateFilterMenuPosition =
      () => {
        if (!filterButtonRef.current) {
          return;
        }

        const buttonRect =
          filterButtonRef.current.getBoundingClientRect();

        const menuWidth = 289;
        const viewportPadding = 12;
        const menuGap = 8;
        const estimatedMenuHeight =
          330;

        const spaceBelow =
          window.innerHeight -
          buttonRect.bottom -
          viewportPadding;

        const spaceAbove =
          buttonRect.top -
          viewportPadding;

        const shouldOpenAbove =
          spaceBelow <
            estimatedMenuHeight &&
          spaceAbove >
            spaceBelow;

        const top = shouldOpenAbove
          ? Math.max(
              viewportPadding,
              buttonRect.top -
                Math.min(
                  estimatedMenuHeight,
                  spaceAbove
                ) -
                menuGap
            )
          : buttonRect.bottom +
            menuGap;

        const right = Math.max(
          viewportPadding,
          window.innerWidth -
            buttonRect.right
        );

        const maxHeight =
          Math.max(
            180,
            shouldOpenAbove
              ? spaceAbove - menuGap
              : spaceBelow - menuGap
          );

        setFilterMenuPosition({
          top,
          right: Math.min(
            right,
            window.innerWidth -
              menuWidth -
              viewportPadding
          ),
          maxHeight,
        });
      };

    updateFilterMenuPosition();

    window.addEventListener(
      "resize",
      updateFilterMenuPosition
    );

    window.addEventListener(
      "scroll",
      updateFilterMenuPosition,
      true
    );

    return () => {
      window.removeEventListener(
        "resize",
        updateFilterMenuPosition
      );

      window.removeEventListener(
        "scroll",
        updateFilterMenuPosition,
        true
      );
    };
  }, [showFilters]);

  useEffect(() => {
    const handleClickOutside =
      (event) => {
        if (
          filterRef.current &&
          !filterRef.current.contains(
            event.target
          )
        ) {
          setShowFilters(false);
        }

        if (
          sortRef.current &&
          !sortRef.current.contains(
            event.target
          )
        ) {
          setShowSort(false);
        }
      };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const customerOrders =
    useMemo(() => {
      return savedOrders.filter(
        (order) => {
          if (
            !order.customerName
          ) {
            return true;
          }

          return (
            String(
              order.customerName
            )
              .trim()
              .toLowerCase() ===
            customer.name
              .trim()
              .toLowerCase()
          );
        }
      );
    }, [savedOrders]);

  const filteredOrders =
    useMemo(() => {
      const search =
        searchTerm
          .trim()
          .toLowerCase();

      const filtered =
        customerOrders.filter(
          (order) => {
            const orderNumber =
              String(
                order.orderNumber ||
                  order.id ||
                  ""
              ).toLowerCase();

            const products =
              Array.isArray(
                order.products
              )
                ? order.products
                    .map(
                      (product) =>
                        `${product.quantity || 0}x ${
                          product.name ||
                          ""
                        }`
                    )
                    .join(" ")
                    .toLowerCase()
                : String(
                    order.product ||
                      ""
                  ).toLowerCase();

            const status =
              normalizeStatus(
                order.status
              );

            const deliveryDate =
              getDateOnly(order);

            const matchesSearch =
              !search ||
              orderNumber.includes(
                search
              ) ||
              products.includes(
                search
              ) ||
              String(
                order.deliveryDate ||
                  order.deliverySchedule ||
                  ""
              )
                .toLowerCase()
                .includes(search);

            const matchesStatus =
              statusFilter ===
                "All" ||
              status ===
                statusFilter;

            let matchesDate = true;

            if (
              dateFilter !==
              "All"
            ) {
              if (
                dateFilter ===
                "Custom Date"
              ) {
                matchesDate =
                  isCustomDateMatch(
                    order,
                    customDate
                  );
              } else if (
                !deliveryDate
              ) {
                matchesDate =
                  false;
              } else if (
                dateFilter ===
                "Today"
              ) {
                matchesDate =
                  isSameDay(
                    deliveryDate,
                    new Date()
                  );
              } else if (
                dateFilter ===
                "Tomorrow"
              ) {
                matchesDate =
                  isTomorrow(
                    deliveryDate
                  );
              } else if (
                dateFilter ===
                "This Week"
              ) {
                matchesDate =
                  isThisWeek(
                    deliveryDate
                  );
              }
            }

            return (
              matchesSearch &&
              matchesStatus &&
              matchesDate
            );
          }
        );

      return filtered.sort(
        (a, b) => {
          if (
            sortOption ===
            "oldest"
          ) {
            return (
              getOrderTimestamp(a) -
              getOrderTimestamp(b)
            );
          }

          if (
            sortOption ===
            "total-high"
          ) {
            return (
              Number(
                b.total || 0
              ) -
              Number(
                a.total || 0
              )
            );
          }

          if (
            sortOption ===
            "total-low"
          ) {
            return (
              Number(
                a.total || 0
              ) -
              Number(
                b.total || 0
              )
            );
          }

          return (
            getOrderTimestamp(b) -
            getOrderTimestamp(a)
          );
        }
      );
    }, [
      customerOrders,
      searchTerm,
      statusFilter,
      dateFilter,
      customDate,
      sortOption,
    ]);

  const handleTrackOrder = (
    order
  ) => {
    navigate(
      "/customer/track",
      {
        state: {
          order,
        },
      }
    );
  };

  const handleViewDetails = (
    order
  ) => {
    navigate(
      "/customer/order-details",
      {
        state: {
          order,
        },
      }
    );
  };

  const handleClearFilters =
    () => {
      setStatusFilter("All");
      setDateFilter("All");
      setCustomDate("");
    };

  const hasActiveFilters =
    statusFilter !== "All" ||
    dateFilter !== "All" ||
    (dateFilter ===
      "Custom Date" &&
      customDate !== "");

  return (
    <div className="flex min-h-screen flex-col bg-stone-50">
      <div className="w-full shrink-0">
        <Header />
      </div>

      <main className="flex-1 overflow-y-auto bg-stone-50 pb-[120px]">
        <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-7 px-4 py-6 sm:px-6 sm:py-8 md:px-8">
          <div className="flex flex-col gap-2">
            <h1 className="break-words text-[24px] font-bold leading-[120%] tracking-[-0.02em] text-stone-800 sm:text-[28px] md:text-[30px]">
              Transaction &amp; Delivery History
            </h1>

            <p className="text-xs leading-[1.5] text-stone-600 sm:text-sm">
              Review your past orders and confirmed delivery arrivals.
            </p>

            <div className="mt-1 flex flex-col gap-1 text-xs text-stone-600 sm:text-sm">
              <span>
                <span className="font-semibold text-stone-800">
                  {customer.name}
                </span>
                {" · "}
                {customer.contactNumber}
              </span>

              <span>
                {customer.address[0]},{" "}
                {customer.address[1]},{" "}
                {customer.address[2]}
              </span>
            </div>
          </div>

          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <h2 className="text-base font-bold leading-5 text-stone-800 sm:text-lg sm:leading-6">
                Order History
              </h2>

              <span className="text-[10px] font-semibold uppercase tracking-[0.5px] text-stone-500">
                {filteredOrders.length}{" "}
                Orders
              </span>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:max-w-[280px]">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
                />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(
                      event.target.value
                    )
                  }
                  placeholder="Search orders..."
                  className="h-10 w-full rounded-lg border border-stone-200 bg-white pl-9 pr-3 text-sm text-stone-700 outline-none transition-colors placeholder:text-stone-400 focus:border-[#8FC9DC]"
                />
              </div>

              <div className="flex items-center gap-2">
                {/* FILTERS */}
                <div
                  ref={filterRef}
                  className="relative"
                >
                  <button
                    ref={
                      filterButtonRef
                    }
                    type="button"
                    onClick={() => {
                      setShowFilters(
                        (current) =>
                          !current
                      );
                      setShowSort(false);
                    }}
                    className={`flex h-10 items-center gap-2 rounded-lg border px-3.5 text-sm font-semibold transition-colors ${
                      hasActiveFilters
                        ? "border-[#B8DDE9] bg-[#F4FBFD] text-[#1687B8]"
                        : "border-stone-200 bg-white text-stone-700 hover:bg-stone-50"
                    }`}
                  >
                    <SlidersHorizontal
                      size={16}
                      strokeWidth={1.8}
                    />

                    <span>
                      Filters
                    </span>

                    <ChevronDown
                      size={15}
                      strokeWidth={1.8}
                      className={`transition-transform ${
                        showFilters
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </button>

                  {showFilters && (
                    <div
                      className="fixed z-[9999] w-[289px] overflow-y-auto rounded-xl border border-[#D9E8EF] bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.10)]"
                      style={{
                        top: `${filterMenuPosition.top}px`,
                        right: `${filterMenuPosition.right}px`,
                        maxHeight: `${filterMenuPosition.maxHeight || 500}px`,
                      }}
                    >
                      {/* FILTER HEADER */}
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-base font-semibold text-slate-700">
                          Filters
                        </h3>

                        <button
                          type="button"
                          onClick={() =>
                            setShowFilters(
                              false
                            )
                          }
                          className="flex h-6 w-6 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                        >
                          <X
                            size={18}
                            strokeWidth={
                              1.8
                            }
                          />
                        </button>
                      </div>

                      {/* STATUS */}
                      <div className="mb-4">
                        <label className="mb-1.5 block text-sm font-semibold tracking-wide text-slate-500">
                          STATUS
                        </label>

                        <div className="relative">
                          <select
                            value={
                              statusFilter ===
                              "All"
                                ? "all"
                                : statusFilter
                            }
                            onChange={(
                              event
                            ) => {
                              const value =
                                event
                                  .target
                                  .value;

                              setStatusFilter(
                                value ===
                                  "all"
                                  ? "All"
                                  : value
                              );
                            }}
                            className="h-10 w-full appearance-none rounded-lg border border-[#D9E8EF] bg-white px-3 pr-9 text-sm text-slate-700 outline-none transition-colors focus:border-[#8FC9DC]"
                          >
                            <option value="all">
                              All Statuses
                            </option>

                            <option value="Pending">
                              Pending
                            </option>

                            <option value="Processing">
                              Processing
                            </option>

                            <option value="Out for Delivery">
                              Out for Delivery
                            </option>

                            <option value="Delivered">
                              Delivered
                            </option>

                            <option value="Cancelled">
                              Cancelled
                            </option>
                          </select>

                          <ChevronDown
                            size={16}
                            strokeWidth={
                              1.8
                            }
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                          />
                        </div>
                      </div>

                      {/* DELIVERY DATE */}
                      <div className="mb-4">
                        <label className="mb-1.5 block text-sm font-semibold tracking-wide text-slate-500">
                          DELIVERY DATE
                        </label>

                        <div className="relative">
                          <select
                            value={
                              dateFilter ===
                              "All"
                                ? "all"
                                : dateFilter
                            }
                            onChange={(
                              event
                            ) => {
                              const value =
                                event
                                  .target
                                  .value;

                              setDateFilter(
                                value ===
                                  "all"
                                  ? "All"
                                  : value
                              );

                              if (
                                value !==
                                "Custom Date"
                              ) {
                                setCustomDate(
                                  ""
                                );
                              }
                            }}
                            className="h-10 w-full appearance-none rounded-lg border border-[#D9E8EF] bg-white px-3 pr-9 text-sm text-slate-700 outline-none transition-colors focus:border-[#8FC9DC]"
                          >
                            <option value="all">
                              All Dates
                            </option>

                            <option value="Today">
                              Today
                            </option>

                            <option value="Tomorrow">
                              Tomorrow
                            </option>

                            <option value="This Week">
                              This Week
                            </option>

                            <option value="Custom Date">
                              Custom Date
                            </option>
                          </select>

                          <ChevronDown
                            size={16}
                            strokeWidth={
                              1.8
                            }
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                          />
                        </div>

                        {dateFilter ===
                          "Custom Date" && (
                          <div className="mt-2">
                            <input
                              type="date"
                              value={
                                customDate
                              }
                              onChange={(
                                event
                              ) =>
                                setCustomDate(
                                  event
                                    .target
                                    .value
                                )
                              }
                              className="h-10 w-full rounded-lg border border-[#D9E8EF] bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#8FC9DC]"
                            />
                          </div>
                        )}
                      </div>

                      {/* CLEAR FILTERS */}
                      <button
                        type="button"
                        onClick={
                          handleClearFilters
                        }
                        className="h-9 w-full rounded-lg bg-[#E7F6FA] text-sm font-semibold text-[#1597C0] transition-colors hover:bg-[#D9F0F6]"
                      >
                        Clear Filters
                      </button>
                    </div>
                  )}
                </div>

                {/* SORT */}
                <div
                  ref={sortRef}
                  className="relative"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setShowSort(
                        (current) =>
                          !current
                      );
                      setShowFilters(false);
                    }}
                    className="flex h-10 items-center gap-2 rounded-lg border border-stone-200 bg-white px-3.5 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-50"
                  >
                    <ArrowUpDown
                      size={16}
                      strokeWidth={1.8}
                    />

                    <span>
                      Sort
                    </span>

                    <ChevronDown
                      size={15}
                      strokeWidth={1.8}
                      className={`transition-transform ${
                        showSort
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </button>

                  {showSort && (
                    <div className="absolute right-0 top-full z-50 mt-2 min-w-[180px] rounded-xl border border-stone-200 bg-white p-1.5 shadow-lg">
                      <button
                        type="button"
                        onClick={() => {
                          setSortOption(
                            "newest"
                          );
                          setShowSort(false);
                        }}
                        className={`flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                          sortOption ===
                          "newest"
                            ? "bg-[#E8F7FC] font-semibold text-[#1687B8]"
                            : "text-stone-600 hover:bg-stone-50"
                        }`}
                      >
                        Newest to Oldest
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSortOption(
                            "oldest"
                          );
                          setShowSort(false);
                        }}
                        className={`flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                          sortOption ===
                          "oldest"
                            ? "bg-[#E8F7FC] font-semibold text-[#1687B8]"
                            : "text-stone-600 hover:bg-stone-50"
                        }`}
                      >
                        Oldest to Newest
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSortOption(
                            "total-high"
                          );
                          setShowSort(false);
                        }}
                        className={`flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                          sortOption ===
                          "total-high"
                            ? "bg-[#E8F7FC] font-semibold text-[#1687B8]"
                            : "text-stone-600 hover:bg-stone-50"
                        }`}
                      >
                        Highest Total
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSortOption(
                            "total-low"
                          );
                          setShowSort(false);
                        }}
                        className={`flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                          sortOption ===
                          "total-low"
                            ? "bg-[#E8F7FC] font-semibold text-[#1687B8]"
                            : "text-stone-600 hover:bg-stone-50"
                        }`}
                      >
                        Lowest Total
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ORDER LIST */}
            {filteredOrders.length ===
            0 ? (
              <div className="w-full rounded-xl border border-stone-200 bg-white p-8 text-center">
                <p className="text-sm font-semibold text-stone-800">
                  No orders found
                </p>

                <p className="mt-1 text-xs text-stone-500">
                  Try changing your search or filters.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filteredOrders.map(
                  (order) => (
                    <HistoryCard
                      key={
                        order.id ||
                        order.orderNumber
                      }
                      order={order}
                      onTrack={() =>
                        handleTrackOrder(
                          order
                        )
                      }
                      onViewDetails={() =>
                        handleViewDetails(
                          order
                        )
                      }
                    />
                  )
                )}
              </div>
            )}
          </section>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 z-50 w-full">
        <CustomerNavbar activeTab="orders" />
      </div>

      <CustomerFooter />
    </div>
  );
}

export default Orders;