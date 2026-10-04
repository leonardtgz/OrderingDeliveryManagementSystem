import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Header from "../../components/Header/Header";
import CustomerNavbar from "../../components/customer/CustomerNavbar";
import CustomerFooter from "../../components/customer/CustomerFooter";

import roundPurifiedWater from "../../assets/images/round-purified-water.png";
import slimPurifiedWater from "../../assets/images/slim-purified-water.png";
import bottle500ml from "../../assets/images/500ml-bottle.png";

import {
  getOrders,
  updateOrder,
} from "../../utils/orderStorage";

function AddressIcon() {
  return (
    <svg
      width="18"
      height="20"
      viewBox="0 0 18 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mt-0.5 shrink-0 text-text-accent"
    >
      <path
        d="M9 19C9 19 16 12.75 16 7.5C16 3.91 12.866 1 9 1C5.134 1 2 3.91 2 7.5C2 12.75 9 19 9 19Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="9"
        cy="7.5"
        r="2.5"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function DateTimeIcon() {
  return (
    <svg
      width="18"
      height="20"
      viewBox="0 0 18 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mt-0.5 shrink-0 text-text-accent"
    >
      <rect
        x="1"
        y="3"
        width="16"
        height="16"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M5 1V5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M13 1V5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M1 8H17"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M5 12H8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M5 15H8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

const getProductImage = (productName = "") => {
  const name = String(productName).toLowerCase();

  if (name.includes("500ml") || name.includes("bottle")) {
    return bottle500ml;
  }

  if (name.includes("slim")) {
    return slimPurifiedWater;
  }

  return roundPurifiedWater;
};

const getOrderTitle = (order) => {
  if (Array.isArray(order.products) && order.products.length > 0) {
    return order.products
      .map((product) => {
        const quantity = Number(product.quantity || 0);
        return `${quantity}x ${product.name}`;
      })
      .join(" + ");
  }

  return order.title || "Order";
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

  return "Today";
};

const getAddress = (order) => {
  if (order.deliveryAddress) {
    return order.deliveryAddress;
  }

  if (order.address) {
    return order.address;
  }

  return "No delivery address available";
};

const getDeliveryDate = (order) => {
  if (order.deliveryDate) {
    return order.deliveryDate;
  }

  if (order.deliverySchedule) {
    return order.deliverySchedule;
  }

  return "Today";
};

const getDeliveryTime = (order) => {
  if (order.deliveryTime) {
    return order.deliveryTime;
  }

  return "Not specified";
};

const getStatusStyle = (status) => {
  const normalizedStatus = String(status || "")
    .trim()
    .toLowerCase();

  if (
    normalizedStatus === "delivered" ||
    normalizedStatus === "completed"
  ) {
    return "bg-green-100 text-green-700";
  }

  if (
    normalizedStatus === "cancelled" ||
    normalizedStatus === "canceled"
  ) {
    return "bg-red-100 text-red-700";
  }

  if (
    normalizedStatus === "out for delivery" ||
    normalizedStatus === "in transit" ||
    normalizedStatus === "on the way"
  ) {
    return "bg-cyan-100 text-cyan-800";
  }

  if (
    normalizedStatus === "confirmed" ||
    normalizedStatus === "processing" ||
    normalizedStatus === "purifying"
  ) {
    return "bg-blue-100 text-blue-800";
  }

  if (normalizedStatus === "pending") {
    return "bg-amber-100 text-amber-800";
  }

  return "bg-gray-100 text-gray-700";
};

function OrderDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  // This is the EXACT order selected from the Orders page.
  const passedOrder = location.state?.order;

  const [order, setOrder] = useState(passedOrder || null);

  // Use the exact order passed through navigation.
  // Do NOT search getOrders() for another order because that can
  // cause the details page to display a different order.
  useEffect(() => {
    if (passedOrder) {
      setOrder(passedOrder);
    } else {
      setOrder(null);
    }
  }, [passedOrder]);

  const handleBack = () => {
    navigate("/customer/orders");
  };

  const handleTrackOrder = () => {
    if (!order) {
      return;
    }

    navigate("/customer/track", {
      state: { order },
    });
  };

  const handleCancelOrder = () => {
    if (!order) {
      return;
    }

    if (String(order.status || "").trim().toLowerCase() !== "pending") {
      window.alert("Only pending orders can be cancelled.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?",
    );

    if (!confirmed) {
      return;
    }

    const orderId = order.orderNumber || order.id;

    updateOrder(orderId, {
      status: "Cancelled",
    });

    setOrder((currentOrder) => ({
      ...currentOrder,
      status: "Cancelled",
    }));

    window.alert("Order cancelled successfully.");
  };

  if (!order) {
    return (
      <div className="flex min-h-screen flex-col bg-background-main">
        <div className="w-full shrink-0">
          <Header />
        </div>

        <main className="flex flex-1 items-center justify-center bg-background-card px-4 pb-[120px]">
          <div className="text-center">
            <h1 className="text-lg font-bold text-text-primary">
              Order Not Found
            </h1>

            <p className="mt-1 text-sm text-text-secondary">
              This order could not be found.
            </p>

            <button
              type="button"
              onClick={handleBack}
              className="mt-4 rounded-lg bg-primary-background px-4 py-2 text-xs font-bold uppercase text-primary-foreground"
            >
              Back to Orders
            </button>
          </div>
        </main>

        <div className="fixed bottom-0 left-0 z-50 w-full">
          <CustomerNavbar activeTab="orders" />
        </div>
      </div>
    );
  }

  const title = getOrderTitle(order);

  const status = order.status || "Pending";

  const image = getProductImage(
    order.products?.[0]?.name || order.product || title,
  );

  const total = Number(order.total || 0);

  const orderNumber =
    order.orderNumber || order.id || "Unknown";

  const deliveryAddress = getAddress(order);
  const deliveryDate = getDeliveryDate(order);
  const deliveryTime = getDeliveryTime(order);

  const isCompleted = ["delivered", "completed"].includes(
    String(status).trim().toLowerCase(),
  );

  const canCancel =
    String(status).trim().toLowerCase() === "pending";

  return (
    <div className="flex min-h-screen flex-col bg-background-main">
      <div className="w-full shrink-0">
        <Header />
      </div>

      <main className="flex-1 overflow-y-auto bg-background-card pb-[120px]">
        <div className="mx-auto flex w-full max-w-[900px] flex-col gap-5 px-4 py-5 sm:px-6 sm:py-7">
          <div className="flex flex-col gap-1">
            <h1 className="text-[24px] font-bold leading-[120%] tracking-[-0.02em] text-text-accent sm:text-[28px]">
              Order Details
            </h1>

            <p className="text-xs leading-[1.5] text-text-secondary sm:text-sm">
              View the details of your order and delivery information.
            </p>
          </div>

          {/* Order Information */}
          <section className="overflow-hidden rounded-lg border border-border-light bg-white shadow-sm">
            <div className="flex flex-col gap-2 border-b border-border-light px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <div className="flex min-w-0 flex-col gap-0.5">
                <span className="text-[10px] font-bold uppercase tracking-[0.6px] text-text-secondary">
                  Order Number
                </span>

                <span className="text-sm font-bold text-text-primary sm:text-base">
                  {orderNumber}
                </span>
              </div>

              <span
                className={`w-fit rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.6px] ${getStatusStyle(
                  status,
                )}`}
              >
                {status}
              </span>
            </div>

            {/* Product */}
            <div className="flex items-center gap-3 border-b border-border-light px-4 py-4 sm:px-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md bg-gray-50">
                <img
                  src={image}
                  alt={title}
                  className="h-11 w-9 object-contain"
                />
              </div>

              <div className="min-w-0 flex-1">
                <span className="block break-words text-sm font-bold leading-5 text-text-primary sm:text-base">
                  {title}
                </span>

                <div className="mt-1">
                  <span className="inline-flex items-center rounded-sm bg-sky-50 px-2 py-0.5 text-[10px] font-medium text-text-accent">
                    Refill Service
                  </span>
                </div>

                <span className="mt-1 block text-xs text-text-secondary">
                  Ordered {getOrderDate(order)}
                </span>
              </div>
            </div>

            {/* Delivery Details */}
            <div className="flex flex-col gap-4 px-4 py-4 sm:px-5">
              <div className="flex items-start gap-3">
                <AddressIcon />

                <div className="min-w-0 flex-1">
                  <span className="block text-[10px] font-bold uppercase tracking-[0.6px] text-text-secondary">
                    Delivery Address
                  </span>

                  <span className="mt-1 block break-words text-sm leading-5 text-text-primary">
                    {deliveryAddress}
                  </span>
                </div>
              </div>

              <div className="h-px w-full bg-border-light" />

              <div className="flex items-start gap-3">
                <DateTimeIcon />

                <div className="min-w-0 flex-1">
                  <span className="block text-[10px] font-bold uppercase tracking-[0.6px] text-text-secondary">
                    Delivery Date &amp; Time
                  </span>

                  <span className="mt-1 block text-sm leading-5 text-text-primary">
                    {deliveryDate}, {deliveryTime}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Payment Summary */}
          <section className="flex flex-col gap-3 rounded-lg border border-border-light bg-white p-4 shadow-sm sm:p-5">
            <h2 className="text-xs font-bold uppercase tracking-[0.6px] text-text-accent">
              Payment Summary
            </h2>

            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-text-secondary">
                Order Total
              </span>

              <span className="text-sm font-bold text-text-primary">
                PHP {total.toFixed(2)}
              </span>
            </div>

            <div className="h-px w-full bg-border-light" />

            <div className="flex items-center justify-between gap-3">
              <span className="text-base font-bold text-text-primary">
                Total
              </span>

              <span className="text-lg font-bold text-text-accent sm:text-xl">
                PHP {total.toFixed(2)}
              </span>
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pb-3 pt-1 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={handleBack}
              className="flex min-h-11 flex-1 items-center justify-center rounded-lg border border-border-light bg-white px-3 text-xs font-bold uppercase tracking-[0.05em] text-text-primary transition-colors hover:bg-gray-50"
            >
              Back to Orders
            </button>

            {canCancel && (
              <button
                type="button"
                onClick={handleCancelOrder}
                className="flex min-h-11 flex-1 items-center justify-center rounded-lg border border-red-200 bg-white px-3 text-xs font-bold uppercase tracking-[0.05em] text-red-600 transition-colors hover:bg-red-50"
              >
                Cancel Order
              </button>
            )}

            {!isCompleted && (
              <button
                type="button"
                onClick={handleTrackOrder}
                className="flex min-h-11 flex-1 items-center justify-center rounded-lg bg-primary-background px-3 text-xs font-bold uppercase tracking-[0.05em] text-primary-foreground shadow-sm transition-colors hover:opacity-90"
              >
                Track Order
              </button>
            )}
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 z-50 w-full">
        <CustomerNavbar activeTab="orders" />
      </div>

      <CustomerFooter />
    </div>
  );
}

export default OrderDetails;