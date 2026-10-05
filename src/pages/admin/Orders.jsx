import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { createPortal } from "react-dom";

import {
  useSearchParams,
  useNavigate,
} from "react-router-dom";

import {
  ArrowUpDown,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ListFilter,
  MoreVertical,
  Pencil,
  Search,
  SlidersHorizontal,
  Trash2,
  X,
} from "lucide-react";

import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminFooter from "../../components/admin/AdminFooter";
import Header from "../../components/Header/Header";

import {
  getOrders,
  updateOrder,
} from "../../utils/orderStorage";

const ORDERS_KEY = "goldenpr_orders";

const statusOptions = [
  "Pending",
  "Processing",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

function normalizeStatus(status) {
  const value = String(
    status || "Pending",
  )
    .trim()
    .toLowerCase();

  if (
    value === "confirmed" ||
    value === "purifying" ||
    value === "processing"
  ) {
    return "Processing";
  }

  if (
    value === "completed" ||
    value === "delivered"
  ) {
    return "Delivered";
  }

  if (
    value === "out for delivery" ||
    value === "out_for_delivery" ||
    value === "out-for-delivery"
  ) {
    return "Out for Delivery";
  }

  if (
    value === "cancelled" ||
    value === "canceled"
  ) {
    return "Cancelled";
  }

  return "Pending";
}

function getStatusBadgeClass(status) {
  switch (normalizeStatus(status)) {
    case "Processing":
      return "border border-blue-200 bg-blue-100 text-blue-800";

    case "Out for Delivery":
      return "border border-cyan-200 bg-cyan-100 text-cyan-800";

    case "Delivered":
      return "border border-green-200 bg-green-100 text-green-800";

    case "Cancelled":
      return "border border-red-200 bg-red-100 text-red-800";

    case "Pending":
    default:
      return "border border-amber-200 bg-amber-100 text-amber-800";
  }
}

function getOrderProductName(order) {
  if (
    Array.isArray(order?.products) &&
    order.products.length > 0
  ) {
    return order.products
      .map(
        (product) =>
          product?.name || "Product",
      )
      .join(" + ");
  }

  return (
    order?.product ||
    "Water Order"
  );
}

function getOrderQuantity(order) {
  if (
    Array.isArray(order?.products) &&
    order.products.length > 0
  ) {
    return order.products.reduce(
      (total, product) =>
        total +
        Number(
          product?.quantity ??
            product?.qty ??
            0,
        ),
      0,
    );
  }

  return Number(
    order?.qty ??
      order?.quantity ??
      0,
  );
}

/*
 * Delivery dates are always displayed as YYYY-MM-DD.
 * This also handles static/legacy dates stored in
 * deliverySchedule or deliveryDate.
 */
function getDeliveryDate(order) {
  const value =
    order?.deliveryDate ||
    order?.deliverySchedule ||
    "";

  if (!value) {
    return "Not scheduled";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1,
  ).padStart(2, "0");

  const day = String(
    date.getDate(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getOrderTotal(order) {
  const directTotal =
    order?.total ??
    order?.totalAmount ??
    order?.grandTotal ??
    order?.amount;

  if (
    directTotal !== undefined &&
    directTotal !== null &&
    directTotal !== ""
  ) {
    const numericTotal =
      Number(directTotal);

    if (
      Number.isFinite(
        numericTotal,
      )
    ) {
      return numericTotal;
    }
  }

  if (
    Array.isArray(order?.products) &&
    order.products.length > 0
  ) {
    return order.products.reduce(
      (total, product) => {
        const quantity =
          Number(
            product?.quantity ??
              product?.qty ??
              0,
          );

        const price =
          Number(
            product?.price ??
              product?.unitPrice ??
              0,
          );

        return (
          total +
          quantity * price
        );
      },
      0,
    );
  }

  const quantity =
    Number(
      order?.qty ??
        order?.quantity ??
        0,
    );

  const price =
    Number(
      order?.price ??
        order?.unitPrice ??
        0,
    );

  return quantity * price;
}

function formatCurrency(amount) {
  return `₱${Number(
    amount || 0,
  ).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function getPaymentStatus(order) {
  const paymentValue =
    order?.paymentStatus ??
    order?.paid ??
    order?.isPaid ??
    order?.payment?.status;

  if (
    paymentValue === true ||
    String(
      paymentValue || "",
    )
      .trim()
      .toLowerCase() ===
      "paid"
  ) {
    return "Paid";
  }

  if (
    String(
      paymentValue || "",
    )
      .trim()
      .toLowerCase() ===
    "yes"
  ) {
    return "Paid";
  }

  return "Unpaid";
}

function getDeliveryDateObject(order) {
  const value =
    order?.deliveryDate ||
    order?.deliverySchedule;

  if (!value) {
    return null;
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return null;
  }

  return date;
}

function getOrderDate(order) {
  const value =
    order?.createdAt ||
    order?.updatedAt;

  if (!value) {
    return new Date(0);
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return new Date(0);
  }

  return date;
}

/*
 * Returns the identifier that should be used by the table.
 *
 * Normally this is the orderNumber.
 * If several saved orders accidentally have the same
 * orderNumber, the unique database/state id is used instead.
 *
 * This prevents multiple rows from sharing the same
 * action-menu state and React key.
 */
function getUniqueOrderId(
  order,
  allOrders = [],
) {
  const orderNumber = String(
    order?.orderNumber || "",
  ).trim();

  if (orderNumber) {
    const matchingOrders =
      allOrders.filter(
        (existingOrder) =>
          String(
            existingOrder?.orderNumber ||
              "",
          ).trim() === orderNumber,
      );

    if (matchingOrders.length <= 1) {
      return orderNumber;
    }
  }

  const uniqueId = String(
    order?.id || "",
  ).trim();

  if (uniqueId) {
    return uniqueId;
  }

  return orderNumber || "N/A";
}

function Orders() {
  const navigate =
    useNavigate();

  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  const [orders, setOrders] =
    useState([]);

  const [
    searchTerm,
    setSearchTerm,
  ] = useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("All");

  const [
    paymentFilter,
    setPaymentFilter,
  ] = useState("All");

  const [
    deliveryFilter,
    setDeliveryFilter,
  ] = useState("All");

  const [
    customStartDate,
    setCustomStartDate,
  ] = useState("");

  const [
    customEndDate,
    setCustomEndDate,
  ] = useState("");

  const [
    sortOption,
    setSortOption,
  ] = useState("date-newest");

  const [
    showFilters,
    setShowFilters,
  ] = useState(false);

  const [
    showSort,
    setShowSort,
  ] = useState(false);

  const [
    openActionId,
    setOpenActionId,
  ] = useState(null);

  const [
    actionMenuPosition,
    setActionMenuPosition,
  ] = useState(null);

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const [
    highlightedOrderId,
    setHighlightedOrderId,
  ] = useState(null);

  const ordersPerPage = 10;

  // ==========================================================
  // LOAD ORDERS
  // ==========================================================

  const loadOrders = () => {
    const savedOrders =
      getOrders();

    setOrders(
      Array.isArray(savedOrders)
        ? savedOrders
        : [],
    );
  };

  // ==========================================================
  // ORDER LISTENERS
  // ==========================================================

  useEffect(() => {
    loadOrders();

    const handleOrderUpdate =
      () => {
        loadOrders();
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

    const interval =
      setInterval(() => {
        loadOrders();
      }, 1000);

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

      clearInterval(
        interval,
      );
    };
  }, []);

  // ==========================================================
  // CLOSE ACTION MENU WHEN CLICKING OUTSIDE
  // ==========================================================

  useEffect(() => {
    const handleDocumentMouseDown = (
      event,
    ) => {
      const target =
        event.target;

      if (
        target instanceof Element &&
        (
          target.closest(
            "[data-order-action-button]",
          ) ||
          target.closest(
            "[data-order-action-portal]",
          )
        )
      ) {
        return;
      }

      setOpenActionId(null);
      setActionMenuPosition(null);
    };

    document.addEventListener(
      "mousedown",
      handleDocumentMouseDown,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleDocumentMouseDown,
      );
    };
  }, []);

  useEffect(() => {
    if (!openActionId) {
      setActionMenuPosition(null);
      return undefined;
    }

    const updateActionMenuPosition =
      () => {
        const button =
          document.querySelector(
            `[data-order-action-button="${CSS.escape(
              String(openActionId),
            )}"]`,
          );

        if (!button) {
          return;
        }

        const rect =
          button.getBoundingClientRect();

        const menuWidth = 155;
        const menuHeight = 100;
        const gap = 4;
        const padding = 8;

        let left =
          rect.right -
          menuWidth;

        left = Math.max(
          padding,
          Math.min(
            left,
            window.innerWidth -
              menuWidth -
              padding,
          ),
        );

        let top =
          rect.bottom + gap;

        if (
          top + menuHeight >
          window.innerHeight -
            padding
        ) {
          top =
            rect.top -
            menuHeight -
            gap;
        }

        top = Math.max(
          padding,
          Math.min(
            top,
            window.innerHeight -
              menuHeight -
              padding,
          ),
        );

        setActionMenuPosition({
          top,
          left,
        });
      };

    updateActionMenuPosition();

    window.addEventListener(
      "resize",
      updateActionMenuPosition,
    );

    window.addEventListener(
      "scroll",
      updateActionMenuPosition,
      true,
    );

    return () => {
      window.removeEventListener(
        "resize",
        updateActionMenuPosition,
      );

      window.removeEventListener(
        "scroll",
        updateActionMenuPosition,
        true,
      );
    };
  }, [openActionId]);

  // ==========================================================
  // GET HIGHLIGHTED ORDER
  // ==========================================================

  useEffect(() => {
    const orderToHighlight =
      searchParams.get(
        "highlight",
      );

    if (!orderToHighlight) {
      return;
    }

    setHighlightedOrderId(
      orderToHighlight,
    );

    setSearchTerm("");
    setStatusFilter("All");
    setPaymentFilter("All");
    setDeliveryFilter("All");
    setCustomStartDate("");
    setCustomEndDate("");
    setCurrentPage(1);
  }, [searchParams]);

  // ==========================================================
  // FILTER + SORT ORDERS
  // ==========================================================

  const filteredOrders =
    useMemo(() => {
      const search =
        searchTerm
          .toLowerCase()
          .trim();

      const today =
        new Date();

      today.setHours(
        0,
        0,
        0,
        0,
      );

      return orders
        .filter((order) => {
          const orderId =
            String(
              order?.orderNumber ||
                order?.id ||
                "",
            ).toLowerCase();

          const customerName =
            String(
              order?.customerName ||
                order?.customer ||
                "",
            ).toLowerCase();

          const product =
            getOrderProductName(
              order,
            ).toLowerCase();

          const matchesSearch =
            !search ||
            orderId.includes(
              search,
            ) ||
            customerName.includes(
              search,
            ) ||
            product.includes(
              search,
            );

          const orderStatus =
            normalizeStatus(
              order?.status,
            );

          const matchesStatus =
            statusFilter === "All" ||
            orderStatus ===
              statusFilter;

          const paymentStatus =
            getPaymentStatus(
              order,
            );

          const matchesPayment =
            paymentFilter === "All" ||
            paymentStatus ===
              paymentFilter;

          let matchesDeliveryDate =
            true;

          const deliveryDate =
            getDeliveryDateObject(
              order,
            );

          if (
            deliveryFilter ===
            "Today"
          ) {
            if (!deliveryDate) {
              matchesDeliveryDate =
                false;
            } else {
              deliveryDate.setHours(
                0,
                0,
                0,
                0,
              );

              matchesDeliveryDate =
                deliveryDate.getTime() ===
                today.getTime();
            }
          }

          if (
            deliveryFilter ===
            "Custom"
          ) {
            if (!deliveryDate) {
              matchesDeliveryDate =
                false;
            } else {
              const orderDate =
                new Date(
                  deliveryDate,
                );

              orderDate.setHours(
                0,
                0,
                0,
                0,
              );

              if (
                customStartDate
              ) {
                const start =
                  new Date(
                    `${customStartDate}T00:00:00`,
                  );

                if (
                  orderDate <
                  start
                ) {
                  matchesDeliveryDate =
                    false;
                }
              }

              if (
                customEndDate
              ) {
                const end =
                  new Date(
                    `${customEndDate}T23:59:59`,
                  );

                if (
                  orderDate >
                  end
                ) {
                  matchesDeliveryDate =
                    false;
                }
              }
            }
          }

          return (
            matchesSearch &&
            matchesStatus &&
            matchesPayment &&
            matchesDeliveryDate
          );
        })
        .sort((a, b) => {
          if (
            sortOption ===
            "date-oldest"
          ) {
            return (
              getOrderDate(a) -
              getOrderDate(b)
            );
          }

          if (
            sortOption ===
            "total-highest"
          ) {
            return (
              getOrderTotal(b) -
              getOrderTotal(a)
            );
          }

          if (
            sortOption ===
            "total-lowest"
          ) {
            return (
              getOrderTotal(a) -
              getOrderTotal(b)
            );
          }

          if (
            sortOption ===
            "order-asc"
          ) {
            return String(
              getUniqueOrderId(
                a,
                orders,
              ),
            ).localeCompare(
              String(
                getUniqueOrderId(
                  b,
                  orders,
                ),
              ),
              undefined,
              {
                numeric: true,
                sensitivity:
                  "base",
              },
            );
          }

          if (
            sortOption ===
            "order-desc"
          ) {
            return String(
              getUniqueOrderId(
                b,
                orders,
              ),
            ).localeCompare(
              String(
                getUniqueOrderId(
                  a,
                  orders,
                ),
              ),
              undefined,
              {
                numeric: true,
                sensitivity:
                  "base",
              },
            );
          }

          return (
            getOrderDate(b) -
            getOrderDate(a)
          );
        });
    }, [
      orders,
      searchTerm,
      statusFilter,
      paymentFilter,
      deliveryFilter,
      customStartDate,
      customEndDate,
      sortOption,
    ]);

  // ==========================================================
  // TOTAL PAGES
  // ==========================================================

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredOrders.length /
          ordersPerPage,
      ),
    );

  const safePage =
    Math.min(
      currentPage,
      totalPages,
    );

  // ==========================================================
  // DISPLAYED ORDERS
  // ==========================================================

  const displayedOrders =
    filteredOrders.slice(
      (safePage - 1) *
        ordersPerPage,
      safePage *
        ordersPerPage,
    );

  // ==========================================================
  // AUTOMATICALLY MOVE TO PAGE
  // CONTAINING HIGHLIGHTED ORDER
  // ==========================================================

  useEffect(() => {
    if (
      !highlightedOrderId ||
      filteredOrders.length ===
        0
    ) {
      return;
    }

    const highlightedIndex =
      filteredOrders.findIndex(
        (order) => {
          const orderId =
            getUniqueOrderId(
              order,
              orders,
            );

          return (
            String(orderId) ===
            String(
              highlightedOrderId,
            )
          );
        },
      );

    if (
      highlightedIndex === -1
    ) {
      return;
    }

    const page =
      Math.floor(
        highlightedIndex /
          ordersPerPage,
      ) + 1;

    if (
      currentPage !== page
    ) {
      setCurrentPage(page);
    }
  }, [
    highlightedOrderId,
    filteredOrders,
    currentPage,
    orders,
  ]);

  // ==========================================================
  // SCROLL TO HIGHLIGHTED ORDER
  // ==========================================================

  useEffect(() => {
    if (
      !highlightedOrderId ||
      displayedOrders.length ===
        0
    ) {
      return;
    }

    const timer =
      window.setTimeout(
        () => {
          const element =
            document.getElementById(
              `order-row-${CSS.escape(
                String(
                  highlightedOrderId,
                ),
              )}`,
            );

          if (element) {
            element.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        },
        150,
      );

    return () => {
      window.clearTimeout(
        timer,
      );
    };
  }, [
    highlightedOrderId,
    displayedOrders,
  ]);

  // ==========================================================
  // REMOVE HIGHLIGHT
  // ==========================================================

  useEffect(() => {
    if (!highlightedOrderId) {
      return;
    }

    const timer =
      window.setTimeout(
        () => {
          setHighlightedOrderId(
            null,
          );

          setSearchParams(
            {},
            {
              replace: true,
            },
          );
        },
        4000,
      );

    return () => {
      window.clearTimeout(
        timer,
      );
    };
  }, [
    highlightedOrderId,
    setSearchParams,
  ]);

  // ==========================================================
  // SEARCH
  // ==========================================================

  const handleSearch = (
    event,
  ) => {
    setSearchTerm(
      event.target.value,
    );

    setCurrentPage(1);
  };

  // ==========================================================
  // FILTERS
  // ==========================================================

  const resetFilters = () => {
    setStatusFilter("All");
    setPaymentFilter("All");
    setDeliveryFilter("All");
    setCustomStartDate("");
    setCustomEndDate("");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    statusFilter !== "All" ||
    paymentFilter !== "All" ||
    deliveryFilter !== "All" ||
    customStartDate ||
    customEndDate;

  // ==========================================================
  // ACTIONS
  // ==========================================================

  const handleEditOrder = (
    order,
  ) => {
    /*
     * Use the actual saved order number when available.
     * If the order number is duplicated, use the unique
     * state/database id so the correct row is edited.
     */
    const orderNumber =
      String(
        order?.orderNumber || "",
      ).trim();

    const duplicateOrderNumber =
      orderNumber &&
      orders.filter(
        (existingOrder) =>
          String(
            existingOrder?.orderNumber ||
              "",
          ).trim() ===
          orderNumber,
      ).length > 1;

    const orderId =
      duplicateOrderNumber
        ? order?.id ||
          orderNumber
        : orderNumber ||
          order?.id;

    setOpenActionId(null);
    setActionMenuPosition(null);

    /*
     * Encode the identifier so characters such as #,
     * spaces, or other URL-sensitive characters cannot
     * break the admin edit route.
     */
    navigate(
      `/admin/orders/edit/${encodeURIComponent(
        String(orderId),
      )}`,
    );
  };

  const handleDeleteOrder = (
    order,
  ) => {
    const orderNumber =
      String(
        order?.orderNumber || "",
      ).trim();

    const duplicateOrderNumber =
      orderNumber &&
      orders.filter(
        (existingOrder) =>
          String(
            existingOrder?.orderNumber ||
              "",
          ).trim() ===
          orderNumber,
      ).length > 1;

    const orderId =
      duplicateOrderNumber
        ? order?.id ||
          orderNumber
        : orderNumber ||
          order?.id;

    setOpenActionId(null);
    setActionMenuPosition(null);

    const confirmed =
      window.confirm(
        `Are you sure you want to delete order ${orderId}?`,
      );

    if (!confirmed) {
      return;
    }

    try {
      const savedOrders =
        getOrders();

      const updatedOrders =
        savedOrders.filter(
          (existingOrder) => {
            /*
             * When the orderNumber is unique,
             * remove by orderNumber.
             *
             * When duplicate orderNumbers exist,
             * remove only the matching unique id.
             */
            if (
              duplicateOrderNumber
            ) {
              return (
                String(
                  existingOrder?.id ||
                    "",
                ) !==
                String(
                  order?.id ||
                    "",
                )
              );
            }

            const existingId =
              existingOrder?.orderNumber ||
              existingOrder?.id;

            return (
              String(existingId) !==
              String(orderId)
            );
          },
        );

      localStorage.setItem(
        ORDERS_KEY,
        JSON.stringify(
          updatedOrders,
        ),
      );

      window.dispatchEvent(
        new Event("ordersUpdated"),
      );

      window.dispatchEvent(
        new Event("orderUpdated"),
      );

      setOrders(
        updatedOrders,
      );

      if (
        displayedOrders.length ===
          1 &&
        safePage > 1
      ) {
        setCurrentPage(
          safePage - 1,
        );
      }
    } catch (error) {
      console.error(
        "Failed to delete order:",
        error,
      );
    }
  };

  // ==========================================================
  // PAGINATION
  // ==========================================================

  const handlePreviousPage =
    () => {
      setCurrentPage((page) =>
        Math.max(
          1,
          page - 1,
        ),
      );
    };

  const handleNextPage = () => {
    setCurrentPage((page) =>
      Math.min(
        totalPages,
        page + 1,
      ),
    );
  };

  const firstItem =
    filteredOrders.length ===
    0
      ? 0
      : (safePage - 1) *
          ordersPerPage +
        1;

  const lastItem =
    Math.min(
      safePage *
        ordersPerPage,
      filteredOrders.length,
    );

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="flex min-h-screen w-full bg-slate-50">
      <AdminSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="w-full shrink-0">
          <Header />
        </div>

        <main className="min-w-0 flex-1 overflow-y-auto bg-slate-50">
          <div className="mx-auto w-full max-w-[1400px] p-4 pb-16 sm:p-6 sm:pb-16">

            {/* Page Header */}
            <div className="flex flex-col gap-1">
              <h1 className="text-[30px] font-bold leading-[1.2] tracking-[-0.02em] text-text-primary sm:text-[34px]">
                Order Management
              </h1>

              <p className="text-sm leading-6 text-text-primary">
                Manage and track customer
                water delivery orders.
              </p>

              <p className="text-sm leading-6 text-text-secondary">
                New customer orders will
                appear here automatically.
              </p>
            </div>

            {/* Toolbar */}
            <div className="mt-7 flex flex-col gap-3 border-b border-[#BFEAF5] pb-5 lg:flex-row lg:items-center lg:justify-between">

              {/* Search */}
              <div className="relative w-full lg:max-w-[360px]">
                <Search
                  size={17}
                  strokeWidth={2}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7890A0]"
                />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={
                    handleSearch
                  }
                  placeholder="Search orders..."
                  className="h-[42px] w-full rounded-lg border border-[#D5E8EE] bg-white pl-10 pr-4 text-sm text-text-primary outline-none transition focus:border-[#08779D] focus:ring-2 focus:ring-[#D5F1F8]"
                />
              </div>

              {/* Filters + Sort */}
              <div className="flex flex-wrap items-center gap-2">

                {/* Filters */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setShowFilters(
                        (value) =>
                          !value,
                      );
                      setShowSort(false);
                    }}
                    className={`flex h-[42px] items-center gap-2 rounded-lg border px-4 text-sm font-semibold transition ${
                      hasActiveFilters
                        ? "border-[#08779D] bg-[#EAF7FA] text-[#08779D]"
                        : "border-[#D5E8EE] bg-white text-[#123047] hover:border-[#08779D]"
                    }`}
                  >
                    <SlidersHorizontal
                      size={16}
                      strokeWidth={2}
                    />

                    <span>
                      Filters
                    </span>

                    {hasActiveFilters && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#08779D] px-1.5 text-[10px] font-bold text-white">
                        {[
                          statusFilter !==
                            "All",
                          paymentFilter !==
                            "All",
                          deliveryFilter !==
                            "All",
                        ].filter(
                          Boolean,
                        ).length}
                      </span>
                    )}

                    <ChevronDown
                      size={15}
                      className={`transition-transform ${
                        showFilters
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </button>

                  {showFilters && (
                    <div className="absolute right-0 top-full z-[100] mt-2 w-[290px] rounded-xl border border-[#D5E8EE] bg-white p-4 shadow-[0_12px_35px_rgba(0,0,0,0.12)]">

                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-sm font-bold text-[#123047]">
                          Filters
                        </h3>

                        <button
                          type="button"
                          onClick={() =>
                            setShowFilters(
                              false,
                            )
                          }
                          className="text-[#7890A0] transition hover:text-[#08779D]"
                          aria-label="Close filters"
                        >
                          <X
                            size={17}
                          />
                        </button>
                      </div>

                      {/* Status */}
                      <div className="mb-4">
                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.5px] text-[#7890A0]">
                          Status
                        </label>

                        <div className="relative">
                          <select
                            value={
                              statusFilter
                            }
                            onChange={(
                              event,
                            ) => {
                              setStatusFilter(
                                event
                                  .target
                                  .value,
                              );

                              setCurrentPage(
                                1,
                              );
                            }}
                            className="h-10 w-full appearance-none rounded-lg border border-[#D5E8EE] bg-white px-3 pr-9 text-sm text-[#123047] outline-none focus:border-[#08779D]"
                          >
                            <option value="All">
                              All Statuses
                            </option>

                            {statusOptions.map(
                              (
                                status,
                              ) => (
                                <option
                                  key={
                                    status
                                  }
                                  value={
                                    status
                                  }
                                >
                                  {
                                    status
                                  }
                                </option>
                              ),
                            )}
                          </select>

                          <ChevronDown
                            size={15}
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#7890A0]"
                          />
                        </div>
                      </div>

                      {/* Payment */}
                      <div className="mb-4">
                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.5px] text-[#7890A0]">
                          Payment Status
                        </label>

                        <div className="relative">
                          <select
                            value={
                              paymentFilter
                            }
                            onChange={(
                              event,
                            ) => {
                              setPaymentFilter(
                                event
                                  .target
                                  .value,
                              );

                              setCurrentPage(
                                1,
                              );
                            }}
                            className="h-10 w-full appearance-none rounded-lg border border-[#D5E8EE] bg-white px-3 pr-9 text-sm text-[#123047] outline-none focus:border-[#08779D]"
                          >
                            <option value="All">
                              All Payments
                            </option>

                            <option value="Paid">
                              Paid
                            </option>

                            <option value="Unpaid">
                              Unpaid
                            </option>
                          </select>

                          <ChevronDown
                            size={15}
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#7890A0]"
                          />
                        </div>
                      </div>

                      {/* Delivery Date */}
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.5px] text-[#7890A0]">
                          Delivery Date
                        </label>

                        <div className="relative">
                          <select
                            value={
                              deliveryFilter
                            }
                            onChange={(
                              event,
                            ) => {
                              setDeliveryFilter(
                                event
                                  .target
                                  .value,
                              );

                              setCurrentPage(
                                1,
                              );

                              if (
                                event
                                  .target
                                  .value !==
                                "Custom"
                              ) {
                                setCustomStartDate(
                                  "",
                                );

                                setCustomEndDate(
                                  "",
                                );
                              }
                            }}
                            className="h-10 w-full appearance-none rounded-lg border border-[#D5E8EE] bg-white px-3 pr-9 text-sm text-[#123047] outline-none focus:border-[#08779D]"
                          >
                            <option value="All">
                              All Dates
                            </option>

                            <option value="Today">
                              Today
                            </option>

                            <option value="Custom">
                              Custom Range
                            </option>
                          </select>

                          <ChevronDown
                            size={15}
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#7890A0]"
                          />
                        </div>
                      </div>

                      {deliveryFilter ===
                        "Custom" && (
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          <div>
                            <label className="mb-1 block text-[11px] font-semibold text-[#7890A0]">
                              From
                            </label>

                            <input
                              type="date"
                              value={
                                customStartDate
                              }
                              onChange={(
                                event,
                              ) => {
                                setCustomStartDate(
                                  event
                                    .target
                                    .value,
                                );

                                setCurrentPage(
                                  1,
                                );
                              }}
                              className="h-9 w-full rounded-lg border border-[#D5E8EE] px-2 text-xs text-[#123047] outline-none focus:border-[#08779D]"
                            />
                          </div>

                          <div>
                            <label className="mb-1 block text-[11px] font-semibold text-[#7890A0]">
                              To
                            </label>

                            <input
                              type="date"
                              value={
                                customEndDate
                              }
                              onChange={(
                                event,
                              ) => {
                                setCustomEndDate(
                                  event
                                    .target
                                    .value,
                                );

                                setCurrentPage(
                                  1,
                                );
                              }}
                              className="h-9 w-full rounded-lg border border-[#D5E8EE] px-2 text-xs text-[#123047] outline-none focus:border-[#08779D]"
                            />
                          </div>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={
                          resetFilters
                        }
                        className="mt-4 w-full rounded-lg bg-[#EAF7FA] py-2 text-xs font-semibold text-[#08779D] transition hover:bg-[#D5F1F8]"
                      >
                        Clear Filters
                      </button>
                    </div>
                  )}
                </div>

                {/* Sort */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSort(
                        (value) =>
                          !value,
                      );

                      setShowFilters(
                        false,
                      );
                    }}
                    className="flex h-[42px] items-center gap-2 rounded-lg border border-[#D5E8EE] bg-white px-4 text-sm font-semibold text-[#123047] transition hover:border-[#08779D]"
                  >
                    <ArrowUpDown
                      size={16}
                      strokeWidth={2}
                    />

                    <span>
                      Sort
                    </span>

                    <ChevronDown
                      size={15}
                      className={`transition-transform ${
                        showSort
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </button>

                  {showSort && (
                    <div className="absolute right-0 top-full z-[100] mt-2 w-[235px] rounded-xl border border-[#D5E8EE] bg-white p-2 shadow-[0_12px_35px_rgba(0,0,0,0.12)]">

                      <p className="px-3 pb-2 pt-2 text-[11px] font-bold uppercase tracking-[0.6px] text-[#7890A0]">
                        Sort Orders
                      </p>

                      {[
                        [
                          "date-newest",
                          "Date: Newest to Oldest",
                        ],
                        [
                          "date-oldest",
                          "Date: Oldest to Newest",
                        ],
                        [
                          "total-highest",
                          "Total: Highest to Lowest",
                        ],
                        [
                          "total-lowest",
                          "Total: Lowest to Highest",
                        ],
                        [
                          "order-asc",
                          "Order #: A–Z / 0–9",
                        ],
                        [
                          "order-desc",
                          "Order #: Z–A / 9–0",
                        ],
                      ].map(
                        ([
                          value,
                          label,
                        ]) => (
                          <button
                            key={
                              value
                            }
                            type="button"
                            onClick={() => {
                              setSortOption(
                                value,
                              );

                              setCurrentPage(
                                1,
                              );

                              setShowSort(
                                false,
                              );
                            }}
                            className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition ${
                              sortOption ===
                              value
                                ? "bg-[#EAF7FA] font-semibold text-[#08779D]"
                                : "text-[#123047] hover:bg-[#F5FAFC]"
                            }`}
                          >
                            <span>
                              {
                                label
                              }
                            </span>

                            {sortOption ===
                              value && (
                              <Check
                                size={
                                  15
                                }
                              />
                            )}
                          </button>
                        ),
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Table */}
            <section className="mt-6 w-full overflow-hidden rounded-xl border border-[#DCE9ED] bg-white shadow-[0_4px_18px_rgba(8,119,157,0.05)]">
              <div className="w-full overflow-x-auto">
                <table className="w-full min-w-[1200px] border-collapse">
                  <thead>
                    <tr className="border-b border-[#DCE9ED] bg-[#EAF7FA]">
                      <th className="h-[48px] px-5 text-left text-[11px] font-bold uppercase tracking-[0.55px] text-[#496777]">
                        Order #
                      </th>

                      <th className="h-[48px] px-5 text-left text-[11px] font-bold uppercase tracking-[0.55px] text-[#496777]">
                        Customer Name
                      </th>

                      <th className="h-[48px] px-5 text-left text-[11px] font-bold uppercase tracking-[0.55px] text-[#496777]">
                        Product
                      </th>

                      <th className="h-[48px] px-5 text-center text-[11px] font-bold uppercase tracking-[0.55px] text-[#496777]">
                        Qty
                      </th>

                      <th className="h-[48px] px-5 text-left text-[11px] font-bold uppercase tracking-[0.55px] text-[#496777]">
                        Delivery Date
                      </th>

                      <th className="h-[48px] px-5 text-right text-[11px] font-bold uppercase tracking-[0.55px] text-[#496777]">
                        Total
                      </th>

                      <th className="h-[48px] px-5 text-center text-[11px] font-bold uppercase tracking-[0.55px] text-[#496777]">
                        Paid
                      </th>

                      <th className="h-[48px] px-5 text-center text-[11px] font-bold uppercase tracking-[0.55px] text-[#496777]">
                        Status
                      </th>

                      <th className="h-[48px] w-[70px] px-3 text-center text-[11px] font-bold uppercase tracking-[0.55px] text-[#496777]">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {displayedOrders.length >
                    0 ? (
                      displayedOrders.map(
                        (
                          order,
                        ) => {
                          /*
                           * IMPORTANT:
                           * This identifier is now guaranteed to be
                           * unique for the rendered row.
                           */
                          const orderId =
                            getUniqueOrderId(
                              order,
                              orders,
                            );

                          const isHighlighted =
                            String(
                              orderId,
                            ) ===
                            String(
                              highlightedOrderId,
                            );

                          const status =
                            normalizeStatus(
                              order?.status,
                            );

                          const paymentStatus =
                            getPaymentStatus(
                              order,
                            );

                          const actionId =
                            String(
                              orderId,
                            );

                          return (
                            <tr
                              key={
                                actionId
                              }
                              id={`order-row-${CSS.escape(
                                actionId,
                              )}`}
                              className={`border-t border-[#EDF3F5] bg-white transition-colors hover:bg-[#F8FCFD] ${
                                isHighlighted
                                  ? "animate-order-highlight relative"
                                  : ""
                              }`}
                            >
                              {/* Order # */}
                              <td
                                className={`h-[72px] px-5 text-left text-sm font-bold text-[#123047] ${
                                  isHighlighted
                                    ? "border-l-4 border-[#08779D]"
                                    : ""
                                }`}
                              >
                                #{orderId}
                              </td>

                              {/* Customer */}
                              <td className="h-[72px] max-w-[180px] px-5 text-left text-sm text-[#123047]">
                                <span className="block truncate">
                                  {order?.customerName ||
                                    order?.customer ||
                                    "Unknown Customer"}
                                </span>
                              </td>

                              {/* Product */}
                              <td className="h-[72px] max-w-[220px] px-5 text-left text-sm text-[#123047]">
                                <span className="block truncate">
                                  {getOrderProductName(
                                    order,
                                  )}
                                </span>
                              </td>

                              {/* Quantity */}
                              <td className="h-[72px] px-5 text-center text-sm font-medium text-[#123047]">
                                {getOrderQuantity(
                                  order,
                                )}
                              </td>

                              {/* Delivery Date */}
                              <td className="h-[72px] whitespace-nowrap px-5 text-left text-sm text-[#496777]">
                                <div className="flex items-center gap-2">
                                  <CalendarDays
                                    size={
                                      15
                                    }
                                    className="shrink-0 text-[#08779D]"
                                  />

                                  <span>
                                    {getDeliveryDate(
                                      order,
                                    )}
                                  </span>
                                </div>
                              </td>

                              {/* Total */}
                              <td className="h-[72px] whitespace-nowrap px-5 text-right text-sm font-semibold text-[#123047]">
                                {formatCurrency(
                                  getOrderTotal(
                                    order,
                                  ),
                                )}
                              </td>

                              {/* Paid */}
                              <td className="h-[72px] px-5 text-center">
                                <span
                                  className={`inline-flex min-w-[48px] items-center justify-center rounded-md px-2.5 py-1 text-xs font-semibold ${
                                    paymentStatus ===
                                    "Paid"
                                      ? "border border-green-100 bg-green-50 text-green-700"
                                      : "border border-red-100 bg-red-50 text-red-600"
                                  }`}
                                >
                                  {paymentStatus ===
                                  "Paid"
                                    ? "Yes"
                                    : "No"}
                                </span>
                              </td>

                              {/* Status */}
                              <td className="h-[72px] px-5 text-center">
                                <span
                                  className={`inline-flex whitespace-nowrap rounded-md px-3 py-1 text-xs font-semibold ${getStatusBadgeClass(
                                    status,
                                  )}`}
                                >
                                  {
                                    status
                                  }
                                </span>
                              </td>

                              {/* Action */}
                              <td className="relative h-[72px] px-3 text-center">
                                <button
                                  type="button"
                                  data-order-action-button={
                                    actionId
                                  }
                                  onMouseDown={(
                                    event,
                                  ) => {
                                    event.stopPropagation();
                                  }}
                                  onClick={(
                                    event,
                                  ) => {
                                    event.stopPropagation();

                                    if (
                                      openActionId ===
                                      actionId
                                    ) {
                                      setOpenActionId(
                                        null,
                                      );
                                      setActionMenuPosition(
                                        null,
                                      );
                                      return;
                                    }

                                    const rect =
                                      event.currentTarget.getBoundingClientRect();

                                    const menuWidth = 155;
                                    const menuHeight = 100;
                                    const gap = 4;
                                    const padding = 8;

                                    let left =
                                      rect.right -
                                      menuWidth;

                                    left = Math.max(
                                      padding,
                                      Math.min(
                                        left,
                                        window.innerWidth -
                                          menuWidth -
                                          padding,
                                      ),
                                    );

                                    let top =
                                      rect.bottom +
                                      gap;

                                    if (
                                      top +
                                        menuHeight >
                                      window.innerHeight -
                                        padding
                                    ) {
                                      top =
                                        rect.top -
                                        menuHeight -
                                        gap;
                                    }

                                    top = Math.max(
                                      padding,
                                      Math.min(
                                        top,
                                        window.innerHeight -
                                          menuHeight -
                                          padding,
                                      ),
                                    );

                                    setActionMenuPosition(
                                      {
                                        top,
                                        left,
                                      },
                                    );

                                    setOpenActionId(
                                      actionId,
                                    );
                                  }}
                                  aria-label={`Actions for order ${orderId}`}
                                  aria-expanded={
                                    openActionId ===
                                    actionId
                                  }
                                  className="flex h-9 w-9 items-center justify-center rounded-lg text-[#7890A0] transition hover:bg-[#EAF7FA] hover:text-[#08779D]"
                                >
                                  <MoreVertical
                                    size={
                                      18
                                    }
                                  />
                                </button>
                              </td>
                            </tr>
                          );
                        },
                      )
                    ) : (
                      <tr>
                        <td
                          colSpan="9"
                          className="h-[170px] px-6 text-center text-sm text-text-secondary"
                        >
                          No orders found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex min-h-[72px] flex-col justify-between gap-4 border-t border-[#DCE9ED] bg-[#F8FCFD] px-5 py-4 sm:flex-row sm:items-center">
                <span className="text-sm text-[#496777]">
                  Showing{" "}
                  {firstItem}-
                  {lastItem} of{" "}
                  {
                    filteredOrders.length
                  }{" "}
                  orders
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={
                      handlePreviousPage
                    }
                    disabled={
                      safePage ===
                      1
                    }
                    aria-label="Previous page"
                    className="flex h-9 w-9 items-center justify-center rounded-md border border-[#D5E8EE] bg-white text-[#7890A0] transition hover:border-[#08779D] hover:text-[#08779D] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft
                      size={17}
                    />
                  </button>

                  <button
                    type="button"
                    className="flex h-9 min-w-9 items-center justify-center rounded-md border border-[#08779D] bg-[#08779D] px-2 text-sm font-semibold text-white"
                  >
                    {safePage}
                  </button>

                  <button
                    type="button"
                    onClick={
                      handleNextPage
                    }
                    disabled={
                      safePage ===
                      totalPages
                    }
                    aria-label="Next page"
                    className="flex h-9 w-9 items-center justify-center rounded-md border border-[#D5E8EE] bg-white text-[#123047] transition hover:border-[#08779D] hover:text-[#08779D] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronRight
                      size={17}
                    />
                  </button>
                </div>
              </div>
            </section>
          </div>

          {openActionId &&
            actionMenuPosition &&
            createPortal(
              (() => {
                const order =
                  orders.find(
                    (item) =>
                      getUniqueOrderId(
                        item,
                        orders,
                      ) ===
                      String(
                        openActionId,
                      ),
                  );

                if (!order) {
                  return null;
                }

                return (
                  <div
                    data-order-action-portal
                    data-order-action-menu
                    onMouseDown={(
                      event,
                    ) =>
                      event.stopPropagation()
                    }
                    style={{
                      position:
                        "fixed",
                      top: actionMenuPosition.top,
                      left: actionMenuPosition.left,
                      width: 155,
                      zIndex: 99999,
                    }}
                    className="overflow-hidden rounded-lg border border-[#DCE9ED] bg-white p-1.5 text-left shadow-[0_10px_30px_rgba(0,0,0,0.12)]"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        handleEditOrder(
                          order,
                        )
                      }
                      className="flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium text-[#123047] transition hover:bg-[#EAF7FA] hover:text-[#08779D]"
                    >
                      <Pencil
                        size={15}
                      />

                      <span>
                        Edit Order
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteOrder(
                          order,
                        )
                      }
                      className="flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2
                        size={15}
                      />

                      <span>
                        Delete
                      </span>
                    </button>
                  </div>
                );
              })(),
              document.body,
            )}
        </main>

        <AdminFooter />
      </div>
    </div>
  );
}

export default Orders;