import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock3,
  Eye,
  MoreVertical,
  Package,
  Search,
  SlidersHorizontal,
  Trash2,
  X,
} from "lucide-react";

import AdminSidebar from "../../components/admin/AdminSidebar";
import Header from "../../components/Header/Header";
import AdminFooter from "../../components/admin/AdminFooter";

import {
  getOrders,
  updateOrder,
} from "../../utils/orderStorage";

const ORDERS_PER_PAGE = 10;

const STATUS_OPTIONS = [
  "Pending",
  "Processing",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

const TABS = [
  {
    key: "all",
    label: "All Orders",
  },
  {
    key: "active",
    label: "Active Queue",
  },
  {
    key: "delivery",
    label: "Out for Delivery",
  },
  {
    key: "history",
    label: "History / Completed",
  },
];

const normalizeStatus = (status) => {
  const value = String(status || "")
    .trim()
    .toLowerCase();

  if (
    value === "out for delivery" ||
    value === "out_for_delivery" ||
    value === "in transit" ||
    value === "in_transit"
  ) {
    return "Out for Delivery";
  }

  if (
    value === "processing" ||
    value === "process"
  ) {
    return "Processing";
  }

  if (value === "pending") {
    return "Pending";
  }

  if (
    value === "delivered" ||
    value === "complete" ||
    value === "completed"
  ) {
    return "Delivered";
  }

  if (
    value === "cancelled" ||
    value === "canceled"
  ) {
    return "Cancelled";
  }

  return status || "Pending";
};

const getStatusStyle = (status) => {
  const normalized = normalizeStatus(status);

  switch (normalized) {
    case "Pending":
      return "bg-amber-100 text-amber-800 border border-amber-200";

    case "Processing":
      return "bg-blue-100 text-blue-800 border border-blue-200";

    case "Out for Delivery":
      return "bg-cyan-100 text-cyan-800 border border-cyan-200";

    case "Delivered":
      return "bg-green-100 text-green-800 border border-green-200";

    case "Cancelled":
      return "bg-red-100 text-red-800 border border-red-200";

    default:
      return "bg-gray-100 text-gray-700 border border-gray-200";
  }
};

const getCustomerName = (order) => {
  return (
    order?.customerName ||
    order?.customer?.name ||
    order?.customer?.fullName ||
    order?.name ||
    order?.customer ||
    "Unknown Customer"
  );
};

const getOrderNumber = (order) => {
  const raw =
    order?.orderNumber ||
    order?.orderId ||
    order?.id ||
    order?.reference ||
    "";

  const value = String(raw);

  if (value.startsWith("#ORD-")) {
    return value;
  }

  if (value.startsWith("ORD-")) {
    return `#${value}`;
  }

  const numericMatch = value.match(/\d+/);

  if (numericMatch) {
    return `#ORD-${numericMatch[0]}`;
  }

  return `#ORD-${value || "1000"}`;
};

const getProducts = (order) => {
  const products =
    order?.products ||
    order?.items ||
    order?.orderItems ||
    [];

  if (Array.isArray(products)) {
    return products;
  }

  if (
    products &&
    typeof products === "object"
  ) {
    return Object.values(products);
  }

  return [];
};

const getProductName = (product) => {
  if (typeof product === "string") {
    return product;
  }

  return (
    product?.name ||
    product?.productName ||
    product?.title ||
    product?.product?.name ||
    "Product"
  );
};

const getQuantity = (product) => {
  if (typeof product === "string") {
    return 1;
  }

  const quantity =
    product?.quantity ??
    product?.qty ??
    product?.count ??
    product?.productQuantity ??
    1;

  const parsed = Number(quantity);

  return Number.isFinite(parsed) && parsed > 0
    ? parsed
    : 1;
};

const getCompactProducts = (order) => {
  const products = getProducts(order);

  if (!products.length) {
    return [];
  }

  return products.map((product) => ({
    name: getProductName(product),
    quantity: getQuantity(product),
  }));
};

const getProductSummary = (order) => {
  const products = getProducts(order);

  if (!products.length) {
    return "No items";
  }

  return products
    .map((product) => {
      const quantity = getQuantity(product);
      const name = getProductName(product);

      return `${quantity}x ${name}`;
    })
    .join(", ");
};

const getOrderTotal = (order) => {
  const total =
    order?.total ??
    order?.orderTotal ??
    order?.grandTotal ??
    order?.amount ??
    order?.price ??
    0;

  const numericTotal = Number(total);

  return Number.isFinite(numericTotal)
    ? numericTotal
    : 0;
};

const formatCurrency = (value) => {
  return `₱${Number(value || 0).toLocaleString(
    "en-PH",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )}`;
};

const getDeliveryDate = (order) => {
  return (
    order?.deliveryDate ||
    order?.scheduledDate ||
    order?.date ||
    order?.delivery?.date ||
    ""
  );
};

const getDeliveryTime = (order) => {
  const time =
    order?.deliveryTime ||
    order?.timeSlot ||
    order?.deliverySlot ||
    order?.scheduledTime ||
    order?.delivery?.time ||
    "";

  if (!time) {
    return "";
  }

  const [hours, minutes] = String(time).split(":");
  const hour = Number(hours);

  if (
    Number.isNaN(hour) ||
    minutes === undefined
  ) {
    return time;
  }

  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;

  return `${displayHour}:${minutes} ${period}`;
};

const getAddress = (order) => {
  return (
    order?.address ||
    order?.deliveryAddress ||
    order?.shippingAddress ||
    order?.customer?.address ||
    ""
  );
};

const getContactNumber = (order) => {
  return (
    order?.contactNumber ||
    order?.phone ||
    order?.phoneNumber ||
    order?.mobile ||
    order?.customer?.phone ||
    order?.customer?.contactNumber ||
    ""
  );
};

const getCreatedDate = (order) => {
  return (
    order?.createdAt ||
    order?.createdDate ||
    order?.dateCreated ||
    order?.orderDate ||
    order?.date ||
    ""
  );
};

const getPaymentStatus = (order) => {
  return (
    order?.paymentStatus ||
    order?.payment?.status ||
    order?.payment_status ||
    "Pending"
  );
};

const formatDate = (value) => {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString(
    "en-PH",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
};

const getSortTimestamp = (order) => {
  const value = getCreatedDate(order);

  if (!value) {
    return 0;
  }

  const timestamp = new Date(value).getTime();

  return Number.isNaN(timestamp)
    ? 0
    : timestamp;
};

const getPaymentStyle = (status) => {
  const normalized = String(status || "")
    .trim()
    .toLowerCase();

  if (
    normalized === "paid" ||
    normalized === "completed" ||
    normalized === "complete"
  ) {
    return "bg-emerald-50 text-emerald-700 border border-emerald-200";
  }

  if (
    normalized === "unpaid" ||
    normalized === "pending" ||
    normalized === "failed"
  ) {
    return "bg-red-50 text-red-700 border border-red-200";
  }

  return "bg-gray-50 text-gray-600 border border-gray-200";
};

const OrderStatusBadge = ({ status }) => {
  const normalizedStatus =
    normalizeStatus(status);

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ${getStatusStyle(
        normalizedStatus
      )}`}
    >
      {normalizedStatus}
    </span>
  );
};

const PaymentBadge = ({ status }) => {
  const normalized = String(status || "")
    .trim()
    .toLowerCase();

  const isPaid = ["paid", "completed", "complete"].includes(
    normalized
  );

  const displayStatus = isPaid ? "Paid" : "Unpaid";

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ${getPaymentStyle(
        displayStatus
      )}`}
    >
      {displayStatus}
    </span>
  );
};

const Orders = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [orders, setOrders] = useState([]);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [activeTab, setActiveTab] =
    useState("all");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [deliveryDateFilter, setDeliveryDateFilter] =
    useState("All Dates");

  const [customerFilter, setCustomerFilter] =
    useState("All Customers");

  const [sortOption, setSortOption] =
    useState("newest");

  const [filterOpen, setFilterOpen] =
    useState(false);

  const [sortOpen, setSortOpen] =
    useState(false);

  const [statusDropdownOpen, setStatusDropdownOpen] =
    useState(false);

  const [deliveryDateDropdownOpen, setDeliveryDateDropdownOpen] =
    useState(false);

  const [customerDropdownOpen, setCustomerDropdownOpen] =
    useState(false);

  const [currentPage, setCurrentPage] =
    useState(1);

  const [openStatusId, setOpenStatusId] =
    useState(null);

  const [openActionId, setOpenActionId] =
    useState(null);

  const [actionMenuPosition, setActionMenuPosition] =
    useState(null);

  const filterRef = useRef(null);
  const sortRef = useRef(null);

  const loadOrders = () => {
    const storedOrders = getOrders();

    if (Array.isArray(storedOrders)) {
      setOrders(storedOrders);
    } else {
      setOrders([]);
    }
  };

  useEffect(() => {
    loadOrders();

    const handleStorage = () => {
      loadOrders();
    };

    const handleOrdersUpdated = () => {
      loadOrders();
    };

    const handleOrderUpdated = () => {
      loadOrders();
    };

    window.addEventListener(
      "storage",
      handleStorage
    );

    window.addEventListener(
      "ordersUpdated",
      handleOrdersUpdated
    );

    window.addEventListener(
      "orderUpdated",
      handleOrderUpdated
    );

    const interval = window.setInterval(
      loadOrders,
      1000
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorage
      );

      window.removeEventListener(
        "ordersUpdated",
        handleOrdersUpdated
      );

      window.removeEventListener(
        "orderUpdated",
        handleOrderUpdated
      );

      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const tab = searchParams.get("tab");

    if (
      tab === "all" ||
      tab === "active" ||
      tab === "delivery" ||
      tab === "history"
    ) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target)
      ) {
        setFilterOpen(false);
        setStatusDropdownOpen(false);
        setDeliveryDateDropdownOpen(false);
      }

      if (
        sortRef.current &&
        !sortRef.current.contains(event.target)
      ) {
        setSortOpen(false);
        setCustomerDropdownOpen(false);
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

  useEffect(() => {
    const closeMenus = () => {
      setOpenActionId(null);
      setActionMenuPosition(null);
    };

    window.addEventListener(
      "resize",
      closeMenus
    );

    window.addEventListener(
      "scroll",
      closeMenus,
      true
    );

    return () => {
      window.removeEventListener(
        "resize",
        closeMenus
      );

      window.removeEventListener(
        "scroll",
        closeMenus,
        true
      );
    };
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    activeTab,
    statusFilter,
    deliveryDateFilter,
    customerFilter,
    searchTerm,
    sortOption,
  ]);

  const visibleOrders = useMemo(() => {
    return orders.filter(
      (order) => order?.deleted !== true
    );
  }, [orders]);

  const customerOptions = useMemo(() => {
    const names = visibleOrders
      .map((order) => getCustomerName(order))
      .filter(Boolean);

    return [
      "All Customers",
      ...Array.from(new Set(names)),
    ];
  }, [visibleOrders]);

  const counts = useMemo(() => {
    const normalizedOrders =
      visibleOrders.map((order) => ({
        ...order,
        normalizedStatus:
          normalizeStatus(order.status),
      }));

    return {
      all: normalizedOrders.length,

      active:
        normalizedOrders.filter(
          (order) =>
            order.normalizedStatus !==
              "Delivered" &&
            order.normalizedStatus !==
              "Cancelled"
        ).length,

      delivery:
        normalizedOrders.filter(
          (order) =>
            order.normalizedStatus ===
            "Out for Delivery"
        ).length,

      history:
        normalizedOrders.filter(
          (order) =>
            order.normalizedStatus ===
              "Delivered" ||
            order.normalizedStatus ===
              "Cancelled"
        ).length,
    };
  }, [visibleOrders]);

  const filteredOrders = useMemo(() => {
    const search =
      searchTerm.trim().toLowerCase();

    const filtered = visibleOrders.filter(
      (order) => {
        const status =
          normalizeStatus(order.status);

        if (activeTab === "active") {
          if (
            status === "Delivered" ||
            status === "Cancelled"
          ) {
            return false;
          }
        }

        if (activeTab === "delivery") {
          if (
            status !== "Out for Delivery"
          ) {
            return false;
          }
        }

        if (activeTab === "history") {
          if (
            status !== "Delivered" &&
            status !== "Cancelled"
          ) {
            return false;
          }
        }

        if (
          statusFilter !== "All" &&
          status !==
            normalizeStatus(statusFilter)
        ) {
          return false;
        }

        if (
          customerFilter !== "All Customers" &&
          getCustomerName(order) !==
            customerFilter
        ) {
          return false;
        }

        if (
          deliveryDateFilter !==
          "All Dates"
        ) {
          const rawDate =
            getDeliveryDate(order);

          if (!rawDate) {
            return false;
          }

          const deliveryDate =
            new Date(rawDate);

          if (
            Number.isNaN(
              deliveryDate.getTime()
            )
          ) {
            return false;
          }

          const now = new Date();

          const today = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
          );

          const targetDate = new Date(
            deliveryDate.getFullYear(),
            deliveryDate.getMonth(),
            deliveryDate.getDate()
          );

          const difference =
            Math.round(
              (targetDate - today) /
                (1000 * 60 * 60 * 24)
            );

          if (
            deliveryDateFilter ===
              "Today" &&
            difference !== 0
          ) {
            return false;
          }

          if (
            deliveryDateFilter ===
              "Tomorrow" &&
            difference !== 1
          ) {
            return false;
          }

          if (
            deliveryDateFilter ===
              "This Week" &&
            (difference < 0 ||
              difference > 6)
          ) {
            return false;
          }
        }

        if (!search) {
          return true;
        }

        const searchableText = [
          getOrderNumber(order),
          getCustomerName(order),
          getContactNumber(order),
          getAddress(order),
          getDeliveryDate(order),
          getDeliveryTime(order),
          getProductSummary(order),
          status,
          getPaymentStatus(order),
        ]
          .join(" ")
          .toLowerCase();

        return searchableText.includes(
          search
        );
      }
    );

    return filtered.sort((a, b) => {
      switch (sortOption) {
        case "oldest":
          return (
            getSortTimestamp(a) -
            getSortTimestamp(b)
          );

        case "order-asc":
          return getOrderNumber(
            a
          ).localeCompare(
            getOrderNumber(b)
          );

        case "order-desc":
          return getOrderNumber(
            b
          ).localeCompare(
            getOrderNumber(a)
          );

        case "newest":
        default:
          return (
            getSortTimestamp(b) -
            getSortTimestamp(a)
          );
      }
    });
  }, [
    visibleOrders,
    activeTab,
    statusFilter,
    deliveryDateFilter,
    customerFilter,
    searchTerm,
    sortOption,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredOrders.length /
        ORDERS_PER_PAGE
    )
  );

  const paginatedOrders = useMemo(() => {
    const startIndex =
      (currentPage - 1) *
      ORDERS_PER_PAGE;

    return filteredOrders.slice(
      startIndex,
      startIndex + ORDERS_PER_PAGE
    );
  }, [
    filteredOrders,
    currentPage,
  ]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [
    currentPage,
    totalPages,
  ]);

  const handleStatusUpdate = (
    order,
    newStatus
  ) => {
    const orderId =
      order?.id ||
      order?.orderId ||
      order?.orderNumber;

    if (!orderId) {
      return;
    }

    updateOrder(orderId, {
      status: newStatus,
      updatedAt:
        new Date().toISOString(),
    });

    setOpenStatusId(null);
    loadOrders();
  };

  const handleViewDeliveryDetails = (
    order
  ) => {
    setOpenActionId(null);
    setActionMenuPosition(null);

    navigate(
      "/admin/delivery-details",
      {
        state: {
          order,
        },
      }
    );
  };

  /*
   * Edit Order navigation:
   * Use the selected order's id in the URL
   * and also pass the complete order through
   * React Router state for EditOrder.jsx.
   */
  const handleEditOrder = (order) => {
    if (!order) {
      return;
    }

    const orderId = order?.id;

    if (!orderId) {
      console.error(
        "Cannot edit order: missing order id.",
        order
      );
      return;
    }

    setOpenActionId(null);
    setActionMenuPosition(null);
    setOpenStatusId(null);

    navigate(
      `/admin/orders/edit/${encodeURIComponent(
        String(orderId)
      )}`,
      {
        state: {
          order: {
            ...order,
          },
        },
        replace: false,
      }
    );
  };

  const handleDeleteOrder = (
    order
  ) => {
    setOpenActionId(null);
    setActionMenuPosition(null);

    const orderNumber =
      getOrderNumber(order);

    const customerName =
      getCustomerName(order);

    const confirmed =
      window.confirm(
        `Are you sure you want to delete ${orderNumber} for ${customerName}? This action cannot be undone.`
      );

    if (!confirmed) {
      return;
    }

    const orderId =
      order?.id ||
      order?.orderId ||
      order?.orderNumber;

    if (!orderId) {
      return;
    }

    updateOrder(orderId, {
      status: "Cancelled",
      deleted: true,
      deletedAt:
        new Date().toISOString(),
      updatedAt:
        new Date().toISOString(),
    });

    loadOrders();
  };

  const handleActionMenuToggle = (
    event,
    orderKey
  ) => {
    event.stopPropagation();

    setOpenStatusId(null);

    if (openActionId === orderKey) {
      setOpenActionId(null);
      setActionMenuPosition(null);
      return;
    }

    const buttonRect =
      event.currentTarget.getBoundingClientRect();

    const menuWidth = 224;
    const menuHeight = 160;
    const spacing = 8;

    let left =
      buttonRect.right -
      menuWidth;

    let top =
      buttonRect.bottom +
      spacing;

    if (left < 12) {
      left = 12;
    }

    if (
      left + menuWidth >
      window.innerWidth - 12
    ) {
      left =
        window.innerWidth -
        menuWidth -
        12;
    }

    if (
      top + menuHeight >
      window.innerHeight - 12
    ) {
      top =
        buttonRect.top -
        menuHeight -
        spacing;
    }

    if (top < 12) {
      top = 12;
    }

    setActionMenuPosition({
      top,
      left,
    });

    setOpenActionId(orderKey);
  };

  const clearFilters = () => {
    setStatusFilter("All");
    setDeliveryDateFilter("All Dates");
    setCustomerFilter("All Customers");

    setStatusDropdownOpen(false);
    setDeliveryDateDropdownOpen(false);
    setCustomerDropdownOpen(false);
  };

  const getSortLabel = () => {
    switch (sortOption) {
      case "oldest":
        return "Date: Oldest to Newest";

      case "order-asc":
        return "Order #: A-Z / 0-9";

      case "order-desc":
        return "Order #: Z-A / 9-0";

      case "newest":
      default:
        return "Date: Newest to Oldest";
    }
  };

  const getPaginationNumbers = () => {
    if (totalPages <= 5) {
      return Array.from(
        {
          length: totalPages,
        },
        (_, index) => index + 1
      );
    }

    if (currentPage <= 3) {
      return [
        1,
        2,
        3,
        4,
        "...",
        totalPages,
      ];
    }

    if (
      currentPage >=
      totalPages - 2
    ) {
      return [
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  const hasActiveFilters =
    statusFilter !== "All" ||
    deliveryDateFilter !==
      "All Dates" ||
    customerFilter !==
      "All Customers";

  return (
    <div className="min-h-screen bg-[#F6F8FA] text-gray-900">
      <div className="fixed inset-y-0 left-0 z-40 w-64">
        <AdminSidebar />
      </div>

      <div className="ml-64 flex min-h-screen min-w-0 flex-col">
        <div className="shrink-0">
          <Header />
        </div>

        <main className="flex-1 px-7 py-7">
          <div className="mb-7 flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                Orders & Deliveries
              </h1>

              <p className="mt-1.5 text-sm text-gray-500">
                Manage customer orders,
                fulfillment, and delivery
                schedules.
              </p>
            </div>

            <div className="flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 shadow-sm">
              <Package className="h-4 w-4 text-gray-500" />

              <span className="text-sm font-medium text-gray-600">
                {counts.all} total orders
              </span>
            </div>
          </div>

          <div className="mb-5 border-b border-gray-200">
            <div className="flex items-center gap-8">
              {TABS.map((tab) => {
                const isActive =
                  activeTab === tab.key;

                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab.key);
                      setOpenActionId(null);
                      setActionMenuPosition(null);
                      setOpenStatusId(null);
                    }}
                    className={`flex items-center gap-2 border-b-2 px-2 pb-3.5 pt-1 text-sm font-semibold transition ${
                      isActive
                        ? "border-[#2CA6D8] text-[#1687B8]"
                        : "border-transparent text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    <span>
                      {tab.label}
                    </span>

                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        isActive
                          ? "bg-[#E8F7FC] text-[#1687B8]"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {counts[tab.key]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(
                      event.target.value
                    )
                  }
                  placeholder="Search orders..."
                  className="h-10 w-[288px] rounded-lg border border-gray-200 bg-white pl-9 pr-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#2CA6D8] focus:ring-2 focus:ring-[#2CA6D8]/10"
                />
              </div>

              {/* FILTERS */}
              <div
                ref={filterRef}
                className="relative"
              >
                <button
                  type="button"
                  onClick={() => {
                    setFilterOpen(
                      (open) => !open
                    );
                    setSortOpen(false);
                    setCustomerDropdownOpen(false);
                  }}
                  className={`flex h-10 items-center gap-2 rounded-lg border px-3.5 text-sm font-semibold transition ${
                    hasActiveFilters
                      ? "border-[#CFEAF4] bg-[#E8F7FC] text-[#1687B8]"
                      : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <SlidersHorizontal className="h-4 w-4" />

                  <span>Filters</span>

                  {filterOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>

                {filterOpen && (
                  <div className="absolute right-0 top-[48px] z-[500] w-[290px] rounded-xl border border-gray-200 bg-white p-4 shadow-xl">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-base font-bold text-gray-800">
                        Filters
                      </h3>

                      <button
                        type="button"
                        onClick={() => {
                          setFilterOpen(false);
                          setStatusDropdownOpen(false);
                          setDeliveryDateDropdownOpen(false);
                        }}
                        className="rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      {/* STATUS */}
                      <div className="relative">
                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#7890A3]">
                          Status
                        </label>

                        <button
                          type="button"
                          onClick={() => {
                            setStatusDropdownOpen(
                              (open) => !open
                            );
                            setDeliveryDateDropdownOpen(
                              false
                            );
                          }}
                          className="flex h-10 w-full items-center justify-between rounded-lg border border-[#D6E5EC] bg-white px-3 text-sm text-gray-700 transition hover:border-[#B8D7E4]"
                        >
                          <span>
                            {statusFilter ===
                            "All"
                              ? "All Statuses"
                              : statusFilter}
                          </span>

                          <ChevronDown className="h-4 w-4 text-[#7890A3]" />
                        </button>

                        {statusDropdownOpen && (
                          <div className="absolute left-0 right-0 top-[68px] z-[600] rounded-lg border border-gray-200 bg-white p-1.5 shadow-lg">
                            {[
                              "All",
                              ...STATUS_OPTIONS,
                            ].map(
                              (option) => {
                                const selected =
                                  statusFilter ===
                                  option;

                                return (
                                  <button
                                    key={option}
                                    type="button"
                                    onClick={() => {
                                      setStatusFilter(
                                        option
                                      );
                                      setStatusDropdownOpen(
                                        false
                                      );
                                    }}
                                    className={`flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-sm transition ${
                                      selected
                                        ? "bg-[#E8F7FC] font-semibold text-[#1687B8]"
                                        : "text-gray-600 hover:bg-gray-50"
                                    }`}
                                  >
                                    <span>
                                      {option ===
                                      "All"
                                        ? "All Statuses"
                                        : option}
                                    </span>

                                    {selected && (
                                      <Check className="h-4 w-4" />
                                    )}
                                  </button>
                                );
                              }
                            )}
                          </div>
                        )}
                      </div>

                      {/* DELIVERY DATE */}
                      <div className="relative">
                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#7890A3]">
                          Delivery Date
                        </label>

                        <button
                          type="button"
                          onClick={() => {
                            setDeliveryDateDropdownOpen(
                              (open) => !open
                            );
                            setStatusDropdownOpen(
                              false
                            );
                          }}
                          className="flex h-10 w-full items-center justify-between rounded-lg border border-[#D6E5EC] bg-white px-3 text-sm text-gray-700 transition hover:border-[#B8D7E4]"
                        >
                          <span>
                            {deliveryDateFilter}
                          </span>

                          <ChevronDown className="h-4 w-4 text-[#7890A3]" />
                        </button>

                        {deliveryDateDropdownOpen && (
                          <div className="absolute left-0 right-0 top-[68px] z-[600] rounded-lg border border-gray-200 bg-white p-1.5 shadow-lg">
                            {[
                              "All Dates",
                              "Today",
                              "Tomorrow",
                              "This Week",
                            ].map(
                              (option) => {
                                const selected =
                                  deliveryDateFilter ===
                                  option;

                                return (
                                  <button
                                    key={option}
                                    type="button"
                                    onClick={() => {
                                      setDeliveryDateFilter(
                                        option
                                      );
                                      setDeliveryDateDropdownOpen(
                                        false
                                      );
                                    }}
                                    className={`flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-sm transition ${
                                      selected
                                        ? "bg-[#E8F7FC] font-semibold text-[#1687B8]"
                                        : "text-gray-600 hover:bg-gray-50"
                                    }`}
                                  >
                                    <span>
                                      {option}
                                    </span>

                                    {selected && (
                                      <Check className="h-4 w-4" />
                                    )}
                                  </button>
                                );
                              }
                            )}
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={clearFilters}
                        className="flex h-10 w-full items-center justify-center rounded-lg bg-[#E8F7FC] text-sm font-semibold text-[#1687B8] transition hover:bg-[#DDF3FA]"
                      >
                        Clear Filters
                      </button>
                    </div>
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
                    setSortOpen(
                      (open) => !open
                    );
                    setFilterOpen(false);
                    setStatusDropdownOpen(false);
                    setDeliveryDateDropdownOpen(false);
                  }}
                  className="flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  <SlidersHorizontal className="h-4 w-4" />

                  <span>Sort</span>

                  {sortOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>

                {sortOpen && (
                  <div className="absolute right-0 top-[48px] z-[500] w-[280px] rounded-xl border border-gray-200 bg-white p-4 shadow-xl">
                    <div className="mb-3">
                      <h3 className="text-xs font-bold uppercase tracking-wide text-[#91A4B8]">
                        Sort Orders
                      </h3>
                    </div>

                    <div className="space-y-1">
                      {[
                        {
                          value: "newest",
                          label: "Date: Newest to Oldest",
                        },
                        {
                          value: "oldest",
                          label: "Date: Oldest to Newest",
                        },
                        {
                          value: "order-asc",
                          label: "Order #: A-Z / 0-9",
                        },
                        {
                          value: "order-desc",
                          label: "Order #: Z-A / 9-0",
                        },
                      ].map(
                        (option) => {
                          const selected =
                            sortOption ===
                            option.value;

                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => {
                                setSortOption(
                                  option.value
                                );
                              }}
                              className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition ${
                                selected
                                  ? "bg-[#E8F7FC] font-semibold text-[#1687B8]"
                                  : "text-[#506176] hover:bg-gray-50"
                              }`}
                            >
                              <span>
                                {option.label}
                              </span>

                              {selected && (
                                <Check className="h-4 w-4" />
                              )}
                            </button>
                          );
                        }
                      )}
                    </div>

                    <div className="my-3 border-t border-gray-100" />

                    <div className="relative">
                      <div className="mb-2 text-xs font-bold uppercase tracking-wide text-[#91A4B8]">
                        From
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setCustomerDropdownOpen(
                            (open) => !open
                          )
                        }
                        className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm text-[#506176] transition hover:bg-gray-50"
                      >
                        <span>
                          {customerFilter}
                        </span>

                        <ChevronDown className="h-4 w-4 text-[#7890A3]" />
                      </button>

                      {customerDropdownOpen && (
                        <div className="absolute left-0 right-0 top-[66px] z-[600] max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1.5 shadow-lg">
                          {customerOptions.map(
                            (customer) => {
                              const selected =
                                customerFilter ===
                                customer;

                              return (
                                <button
                                  key={customer}
                                  type="button"
                                  onClick={() => {
                                    setCustomerFilter(
                                      customer
                                    );
                                    setCustomerDropdownOpen(
                                      false
                                    );
                                  }}
                                  className={`flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-sm transition ${
                                    selected
                                      ? "bg-[#E8F7FC] font-semibold text-[#1687B8]"
                                      : "text-gray-600 hover:bg-gray-50"
                                  }`}
                                >
                                  <span>
                                    {customer}
                                  </span>

                                  {selected && (
                                    <Check className="h-4 w-4" />
                                  )}
                                </button>
                              );
                            }
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="text-sm font-medium text-gray-500">
              {filteredOrders.length}{" "}
              {filteredOrders.length ===
              1
                ? "order"
                : "orders"}
            </div>
          </div>

          <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full table-fixed border-collapse">
              <colgroup>
                <col className="w-[18%]" />
                <col className="w-[19%]" />
                <col className="w-[17%]" />
                <col className="w-[10%]" />
                <col className="w-[10%]" />
                <col className="w-[18%]" />
                <col className="w-[8%]" />
              </colgroup>

              <thead>
                <tr className="border-b border-blue-100 bg-blue-50">
                  <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.8px] text-slate-600">
                    Order / Customer
                  </th>

                  <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.8px] text-slate-600">
                    Items
                  </th>

                  <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.8px] text-slate-600">
                    Delivery Schedule
                  </th>

                  <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.8px] text-slate-600">
                    Total
                  </th>

                  <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.8px] text-slate-600">
                    Payment
                  </th>

                  <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.8px] text-slate-600">
                    Fulfillment Status
                  </th>

                  <th className="px-5 py-3.5 text-center text-[11px] font-bold uppercase tracking-[0.8px] text-slate-600">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {paginatedOrders.length ===
                0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-14 text-center"
                    >
                      <div className="flex flex-col items-center">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                          <Package className="h-6 w-6 text-gray-400" />
                        </div>

                        <p className="text-sm font-semibold text-gray-700">
                          No orders found
                        </p>

                        <p className="mt-1 text-sm text-gray-400">
                          Try adjusting your
                          search or filters.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedOrders.map(
                    (order, index) => {
                      const orderKey =
                        order?.id ||
                        order?.orderId ||
                        order?.orderNumber ||
                        `order-${index}`;

                      const compactProducts =
                        getCompactProducts(
                          order
                        );

                      const status =
                        normalizeStatus(
                          order.status
                        );

                      const paymentStatus =
                        getPaymentStatus(
                          order
                        );

                      const deliveryDate =
                        getDeliveryDate(
                          order
                        );

                      const deliveryTime =
                        getDeliveryTime(
                          order
                        );

                      const isStatusOpen =
                        openStatusId ===
                        orderKey;

                      return (
                        <tr
                          key={orderKey}
                          className="border-b border-slate-100 bg-white transition-colors last:border-b-0 hover:bg-slate-50/60"
                        >
                          <td className="px-5 py-4 align-middle">
                            <div className="min-w-0">
                              <div className="truncate text-sm font-bold text-gray-900">
                                {getOrderNumber(
                                  order
                                )}
                              </div>

                              <div className="mt-1 truncate text-sm font-medium text-gray-700">
                                {getCustomerName(
                                  order
                                )}
                              </div>

                              {getContactNumber(
                                order
                              ) && (
                                <div className="mt-0.5 truncate text-xs text-gray-400">
                                  {getContactNumber(
                                    order
                                  )}
                                </div>
                              )}
                            </div>
                          </td>

                          <td className="px-5 py-4 align-middle">
                            <div className="min-w-0 space-y-1">
                              {compactProducts.length ===
                              0 ? (
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
                                      className="flex min-w-0 items-center gap-1.5"
                                    >
                                      <span
                                        title={
                                          product.name
                                        }
                                        className="min-w-0 flex-1 truncate text-xs font-medium leading-5 text-gray-700"
                                      >
                                        {
                                          product.name
                                        }
                                      </span>

                                      <span className="inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-gray-100 px-1.5 text-[10px] font-bold leading-none text-gray-600">
                                        {
                                          product.quantity
                                        }
                                      </span>
                                    </div>
                                  )
                                )
                              )}
                            </div>
                          </td>

                          <td className="px-5 py-4 align-middle">
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 whitespace-nowrap text-sm font-medium text-gray-700">
                                <CalendarDays className="h-3.5 w-3.5 shrink-0 text-gray-400" />

                                <span className="truncate">
                                  {formatDate(
                                    deliveryDate
                                  )}
                                </span>
                              </div>

                              <div className="mt-1.5 flex items-center gap-1.5 whitespace-nowrap text-xs text-gray-500">
                                <Clock3 className="h-3.5 w-3.5 shrink-0 text-gray-400" />

                                <span className="truncate">
                                  {deliveryTime ||
                                    "Time not set"}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4 align-middle">
                            <span className="whitespace-nowrap text-sm font-bold text-gray-900">
                              {formatCurrency(
                                getOrderTotal(
                                  order
                                )
                              )}
                            </span>
                          </td>

                          <td className="px-5 py-4 align-middle">
                            <PaymentBadge
                              status={
                                paymentStatus
                              }
                            />
                          </td>

                          <td className="px-5 py-4 align-middle">
                            <div className="relative w-fit">
                              <button
                                type="button"
                                onClick={() => {
                                  setOpenActionId(
                                    null
                                  );

                                  setActionMenuPosition(
                                    null
                                  );

                                  setOpenStatusId(
                                    isStatusOpen
                                      ? null
                                      : orderKey
                                  );
                                }}
                                className="flex max-w-full items-center gap-1.5"
                              >
                                <OrderStatusBadge
                                  status={
                                    status
                                  }
                                />

                                <ChevronDown
                                  className={`h-3.5 w-3.5 shrink-0 text-gray-400 transition-transform ${
                                    isStatusOpen
                                      ? "rotate-180"
                                      : ""
                                  }`}
                                />
                              </button>

                              {isStatusOpen && (
                                <div className="absolute left-0 top-full z-[100] mt-2 w-48 rounded-lg border border-gray-200 bg-white p-1.5 shadow-xl">
                                  {STATUS_OPTIONS.map(
                                    (
                                      statusOption
                                    ) => (
                                      <button
                                        key={
                                          statusOption
                                        }
                                        type="button"
                                        onClick={() =>
                                          handleStatusUpdate(
                                            order,
                                            statusOption
                                          )
                                        }
                                        className={`flex w-full items-center rounded-md px-3 py-2 text-left text-sm transition ${
                                          normalizeStatus(
                                            statusOption
                                          ) ===
                                          status
                                            ? "bg-gray-100 font-semibold text-gray-900"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                        }`}
                                      >
                                        {
                                          statusOption
                                        }
                                      </button>
                                    )
                                  )}
                                </div>
                              )}
                            </div>
                          </td>

                          <td className="px-5 py-4 text-center align-middle">
                            <button
                              type="button"
                              aria-label={`Actions for ${getOrderNumber(
                                order
                              )}`}
                              onClick={(
                                event
                              ) =>
                                handleActionMenuToggle(
                                  event,
                                  orderKey
                                )
                              }
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
                            >
                              <MoreVertical className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      );
                    }
                  )
                )}
              </tbody>
            </table>

            {filteredOrders.length >
              0 && (
              <div className="flex flex-col gap-4 border-t border-slate-100 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-text-secondary">
                  Showing{" "}
                  <span className="font-semibold text-text-primary">
                    {(currentPage - 1) *
                      ORDERS_PER_PAGE +
                      1}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-text-primary">
                    {Math.min(
                      currentPage *
                        ORDERS_PER_PAGE,
                      filteredOrders.length
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-text-primary">
                    {
                      filteredOrders.length
                    }
                  </span>{" "}
                  orders
                </p>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={
                      currentPage === 1
                    }
                    onClick={() =>
                      setCurrentPage(
                        (page) =>
                          Math.max(
                            1,
                            page - 1
                          )
                      )
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  {getPaginationNumbers().map(
                    (
                      page,
                      index
                    ) => {
                      if (
                        page ===
                        "..."
                      ) {
                        return (
                          <span
                            key={`ellipsis-${index}`}
                            className="flex h-8 w-8 items-center justify-center text-sm text-gray-400"
                          >
                            ...
                          </span>
                        );
                      }

                      const isCurrent =
                        page ===
                        currentPage;

                      return (
                        <button
                          key={page}
                          type="button"
                          onClick={() =>
                            setCurrentPage(
                              page
                            )
                          }
                          className={`flex h-8 min-w-8 items-center justify-center rounded-md border px-2 text-sm font-semibold transition-colors ${
                            isCurrent
                              ? "border-button-background bg-button-background text-white"
                              : "border-slate-200 bg-white text-text-primary hover:bg-slate-50"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    }
                  )}

                  <button
                    type="button"
                    disabled={
                      currentPage ===
                      totalPages
                    }
                    onClick={() =>
                      setCurrentPage(
                        (page) =>
                          Math.min(
                            totalPages,
                            page + 1
                          )
                      )
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>

        <AdminFooter />
      </div>

      {openActionId &&
        actionMenuPosition &&
        createPortal(
          <div
            className="fixed z-[99999] w-56 overflow-hidden rounded-xl border border-gray-200 bg-white text-left shadow-2xl"
            style={{
              top: `${actionMenuPosition.top}px`,
              left: `${actionMenuPosition.left}px`,
            }}
          >
            {(() => {
              const selectedOrder =
                paginatedOrders.find(
                  (order, index) => {
                    const key =
                      order?.id ||
                      order?.orderId ||
                      order?.orderNumber ||
                      `order-${index}`;

                    return (
                      key ===
                      openActionId
                    );
                  }
                );

              if (!selectedOrder) {
                return null;
              }

              return (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      handleViewDeliveryDetails(
                        selectedOrder
                      )
                    }
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    <Eye className="h-4 w-4 text-gray-500" />

                    <span>
                      View delivery details
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleEditOrder(
                        selectedOrder
                      )
                    }
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    <Package className="h-4 w-4 text-gray-500" />

                    <span>
                      Edit order
                    </span>
                  </button>

                  <div className="mx-3 border-t border-gray-100" />

                  <button
                    type="button"
                    onClick={() =>
                      handleDeleteOrder(
                        selectedOrder
                      )
                    }
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />

                    <span>
                      Delete order
                    </span>
                  </button>
                </>
              );
            })()}
          </div>,
          document.body
        )}
    </div>
  );
};

export default Orders;