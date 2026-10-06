import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import lightBlueIcon from "../../assets/images/img_icon_light_blue_900.svg";

import icon from "../../assets/images/img_icon.svg";

import roundPurifiedWaterImage from "../../assets/images/round-purified-water.png";

import slimPurifiedWaterImage from "../../assets/images/slim-purified-water.png";

import bottleImage from "../../assets/images/500ml-bottle.png";

import Header from "../../components/Header/Header";

import CustomerNavbar from "../../components/customer/CustomerNavbar";

import CustomerFooter from "../../components/customer/CustomerFooter";

import { getOrders } from "../../utils/orderStorage";

const customer = {
  name: "Maria Santos",
  contactNumber: "0917-555-0192",
  zone: "Sector 4",
};

const products = [
  {
    id: 1,
    name: "Round Gallon Refill",
    price: "PHP 25.00",
    image: roundPurifiedWaterImage,
    isRefill: true,
  },
  {
    id: 2,
    name: "Slim Gallon Refill",
    price: "PHP 25.00",
    image: slimPurifiedWaterImage,
    isRefill: true,
  },
  {
    id: 3,
    name: "500ml Bottle (Case of 24)",
    price: "PHP 240.00",
    image: bottleImage,
    isRefill: false,
  },
];

const getOrderTitle = (order) => {
  if (Array.isArray(order.products) && order.products.length > 0) {
    return order.products.map((product) => ({
      quantity: Number(product.quantity || 0),
      name: product.name || "Water product",
    }));
  }

  return [
    {
      quantity: Number(order.qty || 0),
      name: order.title || "Order",
    },
  ];
};

const getTotalQuantity = (order) => {
  if (Array.isArray(order.products)) {
    return order.products.reduce(
      (sum, product) => sum + Number(product.quantity || 0),
      0,
    );
  }

  return Number(order.qty || 0);
};

const getOrderDate = (order) => {
  if (order.createdAt) {
    const date = new Date(order.createdAt);

    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString("en-PH", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  }

  if (order.deliveryDate) {
    return order.deliveryDate;
  }

  if (order.deliverySchedule) {
    return order.deliverySchedule;
  }

  return "Today";
};

const getOrderNumber = (order) => {
  return order.orderNumber || order.id || "Unknown";
};

const normalizeStatus = (status) => {
  return String(status || "pending")
    .trim()
    .toLowerCase();
};

const getStatusType = (status) => {
  const normalized = String(status || "pending")
    .trim()
    .toLowerCase();

  if (
    normalized.includes("cancel") ||
    normalized.includes("failed") ||
    normalized.includes("rejected")
  ) {
    return "cancelled";
  }

  if (
    normalized.includes("delivered") ||
    normalized.includes("completed")
  ) {
    return "delivered";
  }

  if (
    normalized.includes("out for delivery") ||
    normalized.includes("in transit") ||
    normalized.includes("on the way")
  ) {
    return "delivery";
  }

  if (
    normalized.includes("processing") ||
    normalized.includes("purifying") ||
    normalized.includes("confirmed")
  ) {
    return "processing";
  }

  return "pending";
};

const formatStatusLabel = (status) => {
  const type = getStatusType(status);

  const labels = {
    pending: "Pending",
    processing: "Processing",
    delivery: "Out for Delivery",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };

  return labels[type] || "Pending";
};

const isCompletedStatus = (status) => {
  const type = getStatusType(status);
  return type === "delivered" || type === "cancelled";
};

const isActiveStatus = (status) => {
  return !isCompletedStatus(status);
};

const getStatusBadgeClass = (status) => {
  const type = getStatusType(status);

  const classes = {
    pending: "border border-amber-200 bg-amber-100 text-amber-800",
    processing: "border border-blue-200 bg-blue-100 text-blue-800",
    delivery: "border border-cyan-200 bg-cyan-100 text-cyan-800",
    delivered: "border border-green-200 bg-green-100 text-green-800",
    cancelled: "border border-red-200 bg-red-100 text-red-800",
  };

  return classes[type];
};

const getStatusSteps = (status) => {
  const type = getStatusType(status);

  let currentStep = 0;

  if (type === "processing") {
    currentStep = 1;
  } else if (type === "delivery") {
    currentStep = 2;
  } else if (type === "delivered") {
    currentStep = 3;
  }

  const steps = [
    {
      label: "Pending",
      value: currentStep === 0 ? "Current" : "Completed",
      state: currentStep === 0 ? "current" : "completed",
    },
    {
      label: "Processing",
      value:
        currentStep === 1
          ? "Current"
          : currentStep > 1
            ? "Completed"
            : "Pending",
      state:
        currentStep === 1
          ? "current"
          : currentStep > 1
            ? "completed"
            : "upcoming",
    },
    {
      label: "Out for Delivery",
      value:
        currentStep === 2
          ? "In Transit"
          : currentStep > 2
            ? "Completed"
            : "Pending",
      state:
        currentStep === 2
          ? "current"
          : currentStep > 2
            ? "completed"
            : "upcoming",
    },
    {
      label: "Delivered",
      value: currentStep === 3 ? "Completed" : "Pending",
      state: currentStep === 3 ? "completed" : "upcoming",
    },
  ];

  if (type === "cancelled") {
    return steps.map((step) => ({
      ...step,
      value:
        step.label === "Pending" ? "Cancelled" : "Not applicable",
      state:
        step.label === "Pending" ? "cancelled" : "upcoming",
    }));
  }

  return steps;
};

const getStepClass = (state) => {
  const classes = {
    current: "border border-blue-200 bg-blue-100 text-blue-800",
    completed: "border border-green-200 bg-green-100 text-green-800",
    upcoming: "border border-gray-200 bg-gray-100 text-gray-500",
    cancelled: "border border-red-200 bg-red-100 text-red-800",
  };

  return classes[state] || classes.upcoming;
};

const getEstimatedTime = (order) => {
  const type = getStatusType(order?.status);

  if (type === "delivered") {
    return "Delivered";
  }

  if (type === "cancelled") {
    return "Cancelled";
  }

  const time =
    order?.deliveryTime ||
    order?.deliverySchedule ||
    "";

  if (time) {
    const [hours, minutes] = String(time).split(":");
    const hour = Number(hours);

    if (!Number.isNaN(hour) && minutes !== undefined) {
      const period = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 || 12;

      return `${displayHour}:${minutes} ${period}`;
    }

    return time;
  }

  return "Delivery pending";
};

const sortOrdersNewestFirst = (orders) => {
  return [...orders].sort((a, b) => {
    const dateA = new Date(
      a.updatedAt || a.createdAt || 0,
    ).getTime();

    const dateB = new Date(
      b.updatedAt || b.createdAt || 0,
    ).getTime();

    return dateB - dateA;
  });
};

function Home() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("home");
  const [customerOrders, setCustomerOrders] = useState([]);

  const loadOrders = () => {
    const orders = getOrders();

    if (!Array.isArray(orders)) {
      setCustomerOrders([]);
      return;
    }

    const filteredOrders = orders.filter((order) => {
      if (!order.customerName) {
        return true;
      }

      return (
        String(order.customerName).trim().toLowerCase() ===
        customer.name.trim().toLowerCase()
      );
    });

    setCustomerOrders(sortOrdersNewestFirst(filteredOrders));
  };

  useEffect(() => {
    loadOrders();

    const handleOrdersUpdated = () => {
      loadOrders();
    };

    window.addEventListener("storage", handleOrdersUpdated);
    window.addEventListener("orderUpdated", handleOrdersUpdated);
    window.addEventListener("ordersUpdated", handleOrdersUpdated);

    const interval = setInterval(loadOrders, 1000);

    return () => {
      window.removeEventListener("storage", handleOrdersUpdated);
      window.removeEventListener("orderUpdated", handleOrdersUpdated);
      window.removeEventListener("ordersUpdated", handleOrdersUpdated);
      clearInterval(interval);
    };
  }, []);

  const currentOrder =
    customerOrders.find(
      (order) => isActiveStatus(order.status),
    ) || null;

  const orderHistory = customerOrders.slice(0, 3);

  // Clicking a product now opens Products.jsx and places
  // that product directly into its Review Order section.
  const handleProductClick = (product) => {
    navigate("/customer/products", {
      state: {
        reviewProduct: {
          ...product,
          quantity: 1,
        },
      },
    });
  };

  const handleTrackOrder = () => {
    if (!currentOrder) {
      navigate("/customer/orders");
      return;
    }

    navigate("/customer/track", {
      state: {
        order: currentOrder,
      },
    });
  };

  const handleRecentHistory = () => {
    navigate("/customer/orders");
  };

  const currentStatus = currentOrder?.status || "No active order";

  const currentTitle = currentOrder
    ? getOrderTitle(currentOrder)
    : "No active order";

  const currentOrderNumber = currentOrder
    ? getOrderNumber(currentOrder)
    : "";

  const currentSteps = currentOrder
    ? getStatusSteps(currentOrder.status)
    : [];

  const handleNavigate = (tab) => {
    setActiveTab(tab);

    const routes = {
      home: "/customer/home",
      products: "/customer/products",
      orders: "/customer/orders",
      track: "/customer/track",
      profile: "/customer/profile",
    };

    if (routes[tab]) {
      navigate(routes[tab]);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background-main">
      <Header />

      <main className="w-full flex-1 px-4 py-6 sm:px-6 md:px-8 lg:px-10">
        {/* Greeting */}
        <section className="mb-8 w-full">
          <h2 className="text-2xl font-bold text-text-primary">
            Hello, {customer.name}
          </h2>

          <p className="mt-1 text-sm text-text-secondary">
            Your designated zone: {customer.zone}
          </p>

          <button
            type="button"
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-button-background px-4 py-3 text-sm font-bold text-button-text transition hover:opacity-90"
            onClick={() => navigate("/customer/products")}
          >
            <img
              src={icon}
              alt=""
              className="h-4 w-4 object-contain"
            />

            <span>NEW ORDER</span>
          </button>
        </section>

        {/* Current Order Status */}
        <section className="mb-8 w-full">
          <button
            type="button"
            onClick={handleTrackOrder}
            className="mb-3 flex w-full items-center justify-between text-left"
          >
            <h3 className="text-xs font-bold uppercase tracking-wide text-text-primary">
              Current Order Status
            </h3>

            {currentOrder && (
              <span className="text-xs font-bold text-text-accent hover:underline">
                VIEW TRACKING
              </span>
            )}
          </button>

          {currentOrder ? (
            <button
              type="button"
              onClick={handleTrackOrder}
              className="w-full cursor-pointer rounded-md border border-[#D7EEF5] bg-white p-4 text-left shadow-[0_4px_14px_rgba(15,23,42,0.12)] transition-shadow duration-200 hover:border-[#9DDCED] hover:shadow-[0_6px_18px_rgba(15,23,42,0.16)]"
            >
              <div className="mb-5 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="break-words text-sm font-bold">
                    Order {currentOrderNumber}
                  </h4>

                  <div className="mt-1 flex flex-col gap-0.5">
                    {Array.isArray(currentTitle) ? (
                      currentTitle.map((product, index) => (
                        <p
                          key={`${product.name}-${index}`}
                          className="break-words text-xs text-text-secondary"
                        >
                          {product.quantity}x {product.name}
                        </p>
                      ))
                    ) : (
                      <p className="break-words text-xs text-text-secondary">
                        {currentTitle}
                      </p>
                    )}
                  </div>

                  <div className="mt-2">
                    <span className="text-xs font-semibold text-text-primary">
                      Status:{" "}
                    </span>

                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${getStatusBadgeClass(
                        currentStatus,
                      )}`}
                    >
                      {formatStatusLabel(currentStatus)}
                    </span>
                  </div>
                </div>

                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${getStatusBadgeClass(
                    currentStatus,
                  )}`}
                >
                  {getEstimatedTime(currentOrder)}
                </span>
              </div>

              <div className="space-y-2">
                {currentSteps.map((step) => (
                  <div
                    key={step.label}
                    className={`flex items-center justify-between rounded-md p-3 ${getStepClass(
                      step.state,
                    )}`}
                  >
                    <span className="text-xs font-bold uppercase">
                      {step.label}
                    </span>

                    <span className="text-xs font-semibold">
                      {step.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-center">
                <span className="text-xs font-bold uppercase tracking-wide text-text-accent">
                  Tap to Track Order
                </span>
              </div>
            </button>
          ) : (
            <div className="w-full rounded-md border border-[#D7EEF5] bg-white p-6 text-center shadow-[0_4px_14px_rgba(15,23,42,0.12)]">
              <h4 className="text-sm font-bold text-text-primary">
                No Active Order
              </h4>

              <p className="mt-1 text-xs text-text-secondary">
                Your current order status will appear here after you place an
                order.
              </p>

              <button
                type="button"
                onClick={() => navigate("/customer/products")}
                className="mt-4 rounded-md bg-primary-background px-4 py-2 text-xs font-bold uppercase text-primary-foreground"
              >
                Place an Order
              </button>
            </div>
          )}
        </section>

        {/* Available Products */}
        <section className="mb-8 w-full">
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-text-primary">
            Available Products
          </h3>

          <div className="mb-4 w-full rounded-md bg-background-accent p-3 text-xs font-bold">
            Note: Gallon products are for refills only.
          </div>

          <div className="flex w-full gap-5 overflow-x-auto px-1 pb-4 pt-1">
            {products.map((product) => (
              <div
                key={product.id}
                role="button"
                tabIndex={0}
                onClick={() => handleProductClick(product)}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" ||
                    event.key === " "
                  ) {
                    event.preventDefault();
                    handleProductClick(product);
                  }
                }}
                className="group w-64 flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-[#D7EEF5] bg-white shadow-[0_6px_20px_rgba(8,119,157,0.08)] transition-all duration-200 hover:-translate-y-1 hover:border-[#9DDCED] hover:shadow-[0_10px_28px_rgba(8,119,157,0.14)] focus:outline-none focus:ring-2 focus:ring-[#2CA6D8]/40"
              >
                {/* Product Image */}
                <div className="relative h-52 w-full overflow-hidden bg-gradient-to-b from-[#EAF9FD] to-[#D9F2F8]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(44,166,216,0.16),transparent_45%)]" />

                  {product.isRefill === true && (
                    <div className="absolute left-3 top-3 z-10 rounded-full border border-white/80 bg-white/85 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[#168DBA] shadow-sm backdrop-blur-sm">
                      Refill
                    </div>
                  )}

                  <img
                    src={product.image}
                    alt={product.name}
                    className="relative z-[1] h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                  />
                </div>

                {/* Product Information */}
                <div className="px-4 pb-4 pt-4">
                  <h4 className="min-h-[40px] text-sm font-bold leading-5 text-slate-800">
                    {product.name}
                  </h4>

                  <div className="mt-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                      Price
                    </p>

                    <p className="mt-0.5 text-base font-extrabold text-[#168DBA]">
                      {product.price}
                    </p>
                  </div>
                </div>

                {/* Add Button */}
                <div className="border-t border-[#E5F2F6] bg-[#F8FCFD] px-4 py-3">
                  <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#E8F7FC] py-2.5 text-xs font-bold uppercase tracking-wide text-[#168DBA] transition-all group-hover:bg-[#2CA6D8] group-hover:text-white">
                    <img
                      src={lightBlueIcon}
                      alt=""
                      className="h-3.5 w-3.5 object-contain transition-all group-hover:brightness-0 group-hover:invert"
                    />

                    <span>Add Product</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent History */}
        <section className="mb-24 w-full">
          <button
            type="button"
            onClick={handleRecentHistory}
            className="mb-3 flex w-full items-center justify-between text-left"
          >
            <h3 className="text-xs font-bold uppercase tracking-wide text-text-primary">
              Recent History
            </h3>

            <span className="text-xs font-bold text-text-accent hover:underline">
              VIEW ALL
            </span>
          </button>

          {orderHistory.length === 0 ? (
            <div className="w-full rounded-md border border-[#D7EEF5] bg-white p-6 text-center shadow-[0_4px_14px_rgba(15,23,42,0.12)]">
              <p className="text-sm font-bold text-text-primary">
                No orders yet
              </p>

              <p className="mt-1 text-xs text-text-secondary">
                Your recent orders will appear here.
              </p>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleRecentHistory}
              className="w-full cursor-pointer overflow-hidden rounded-md border border-[#D7EEF5] bg-white text-left shadow-[0_4px_14px_rgba(15,23,42,0.12)] transition-shadow duration-200 hover:border-[#9DDCED] hover:shadow-[0_6px_18px_rgba(15,23,42,0.16)]"
            >
              {orderHistory.map((order, index) => {
                const title = getOrderTitle(order);
                const quantity = getTotalQuantity(order);
                const total = Number(order.total || 0);
                const status = order.status || "Pending";

                return (
                  <div
                    key={
                      order.id ||
                      order.orderNumber ||
                      `${index}-${status}`
                    }
                    className={`flex items-center justify-between gap-4 p-4 ${
                      index !== orderHistory.length - 1
                        ? "border-b border-border-light"
                        : ""
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-bold">
                        {getOrderDate(order)}
                      </p>

                      <div className="mt-1 flex flex-col gap-0.5">
                        <p className="break-words text-xs text-text-secondary">
                          {quantity} Item{quantity !== 1 ? "s" : ""}
                        </p>

                        {Array.isArray(title) ? (
                          title.map((product, productIndex) => (
                            <p
                              key={`${product.name}-${productIndex}`}
                              className="break-words text-xs text-text-secondary"
                            >
                              {product.quantity}x {product.name}
                            </p>
                          ))
                        ) : (
                          <p className="break-words text-xs text-text-secondary">
                            {title}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-sm font-bold">
                        PHP {total.toFixed(2)}
                      </p>

                      <span
                        className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${getStatusBadgeClass(
                          status,
                        )}`}
                      >
                        {formatStatusLabel(status)}
                      </span>
                    </div>
                  </div>
                );
              })}

              <div className="border-t border-border-light p-3 text-center">
                <span className="text-xs font-bold uppercase tracking-wide text-text-accent">
                  Tap to View All Orders
                </span>
              </div>
            </button>
          )}
        </section>
      </main>

      <CustomerNavbar
        activeTab={activeTab}
        onNavigate={handleNavigate}
      />

      <CustomerFooter />
    </div>
  );
}

export default Home;