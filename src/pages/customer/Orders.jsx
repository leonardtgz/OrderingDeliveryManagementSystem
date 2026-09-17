import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../components/Header/Header";
import CustomerNavbar from "../../components/customer/CustomerNavbar";

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
  const name = productName.toLowerCase();

  if (name.includes("500ml") || name.includes("bottle")) {
    return bottle500ml;
  }

  if (name.includes("slim")) {
    return slimPurifiedWater;
  }

  return roundPurifiedWater;
};

const formatPrice = (value) => {
  return `PHP ${Number(value || 0).toFixed(2)}`;
};

const getOrderTitle = (order) => {
  const products = Array.isArray(order.products)
    ? order.products
    : [];

  if (products.length === 0) {
    return "Order";
  }

  return products
    .map((product) => {
      const quantity = Number(product.quantity || 0);

      return `${quantity}x ${product.name}`;
    })
    .join(" + ");
};

const getTotalQuantity = (order) => {
  if (Array.isArray(order.products)) {
    return order.products.reduce(
      (sum, product) =>
        sum + Number(product.quantity || 0),
      0,
    );
  }

  return Number(order.qty || 0);
};

const getOrderDate = (order) => {
  if (order.deliverySchedule) {
    return order.deliverySchedule;
  }

  if (order.deliveryDate && order.deliveryTime) {
    return `${order.deliveryDate}, ${order.deliveryTime}`;
  }

  if (order.deliveryDate) {
    return order.deliveryDate;
  }

  return "Today";
};

const getStatusType = (status) => {
  const normalizedStatus = String(status || "")
    .trim()
    .toLowerCase();

  if (
    normalizedStatus === "completed" ||
    normalizedStatus === "delivered"
  ) {
    return "completed";
  }

  return "active";
};

function HistoryCard({
  order,
  onTrack,
  onViewDetails,
}) {
  const products = Array.isArray(order.products)
    ? order.products
    : [];

  const firstProduct = products[0];

  const title = getOrderTitle(order);
  const totalQuantity = getTotalQuantity(order);

  const image = getProductImage(
    firstProduct?.name || order.product || "",
  );

  const status = order.status || "Pending";

  const total = Number(order.total || 0);

  const isCompleted =
    String(status).trim().toLowerCase() === "completed" ||
    String(status).trim().toLowerCase() === "delivered";

  return (
    <div className="group flex w-full flex-col gap-4 rounded-lg border border-border-light bg-background-accent p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-5 md:flex-row md:items-center md:justify-between">
      <div className="flex min-w-0 w-full items-center gap-4 md:w-auto">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border-light bg-background-card p-1.5">
          <img
            src={image}
            alt={title}
            className="h-12 w-11 object-contain transition-transform duration-200 group-hover:scale-105"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <span className="mb-0.5 text-[10px] font-bold uppercase tracking-[0.6px] text-text-secondary">
            ORDER #{order.orderNumber || order.id}
          </span>

          <span className="break-words text-sm font-bold leading-5 text-text-primary sm:text-base">
            {title}
          </span>

          <div className="mt-1.5 flex flex-wrap gap-2">
            <span className="inline-flex w-fit items-center rounded-full bg-background-lightBlue px-2.5 py-1 text-[10px] font-semibold text-text-accent">
              {totalQuantity} Item
              {totalQuantity !== 1 ? "s" : ""}
            </span>

            <span className="inline-flex w-fit items-center rounded-full bg-background-lightBlue px-2.5 py-1 text-[10px] font-semibold text-text-accent">
              Refill Service
            </span>
          </div>

          <span className="mt-1.5 text-xs text-text-secondary">
            {getOrderDate(order)}
          </span>
        </div>
      </div>

      <div className="flex w-full flex-col gap-3 border-t border-border-light pt-3 sm:pt-4 md:w-auto md:items-end md:border-0 md:pt-0">
        <div className="flex w-full items-start justify-between gap-6 md:w-auto md:justify-end">
          <div className="flex min-w-0 flex-1 flex-col md:min-w-[120px] md:flex-none">
            <span className="text-[10px] font-bold uppercase tracking-[0.6px] text-text-secondary">
              Total
            </span>

            <span className="mt-0.5 break-words text-sm font-bold leading-5 text-text-primary">
              {formatPrice(total)}
            </span>
          </div>

          <div className="flex shrink-0 flex-col items-end">
            <span className="mb-1 text-[10px] font-bold uppercase tracking-[0.6px] text-text-secondary">
              STATUS
            </span>

            <span
              className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.6px] ${
                getStatusType(status) === "active"
                  ? "bg-primary-background text-primary-foreground"
                  : "bg-background-lightBlue text-text-accent"
              }`}
            >
              {status}
            </span>
          </div>
        </div>

        <div className="flex w-full flex-wrap gap-2 md:w-auto md:justify-end">
          <button
            type="button"
            onClick={onViewDetails}
            className="min-h-9 rounded-md border border-primary-light bg-background-card px-3 py-2 text-[10px] font-bold uppercase tracking-[0.6px] text-primary-light transition-all duration-200 hover:bg-primary-light hover:text-primary-foreground sm:px-4"
          >
            View Details
          </button>

          {!isCompleted && (
            <button
              type="button"
              onClick={onTrack}
              className="min-h-9 rounded-md bg-primary-background px-3 py-2 text-[10px] font-bold uppercase tracking-[0.6px] text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary-dark sm:px-4"
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
  const navigate = useNavigate();

  const [savedOrders, setSavedOrders] = useState([]);

  const loadOrders = () => {
    const orders = getOrders();

    setSavedOrders(
      Array.isArray(orders)
        ? [...orders]
        : [],
    );
  };

  useEffect(() => {
    loadOrders();

    const handleOrdersUpdated = () => {
      loadOrders();
    };

    window.addEventListener(
      "storage",
      handleOrdersUpdated,
    );

    window.addEventListener(
      "orderUpdated",
      handleOrdersUpdated,
    );

    window.addEventListener(
      "ordersUpdated",
      handleOrdersUpdated,
    );

    // Extra protection when the admin page
    // is open separately in the same browser.
    const interval = setInterval(
      loadOrders,
      1000,
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleOrdersUpdated,
      );

      window.removeEventListener(
        "orderUpdated",
        handleOrdersUpdated,
      );

      window.removeEventListener(
        "ordersUpdated",
        handleOrdersUpdated,
      );

      clearInterval(interval);
    };
  }, []);

  const customerOrders = savedOrders.filter(
    (order) => {
      if (!order.customerName) {
        return true;
      }

      return (
        String(order.customerName)
          .trim()
          .toLowerCase() ===
        customer.name
          .trim()
          .toLowerCase()
      );
    },
  );

  const handleTrackOrder = (order) => {
    navigate("/customer/track", {
      state: {
        order,
      },
    });
  };

  const handleViewDetails = (order) => {
    navigate("/customer/order-details", {
      state: {
        order,
      },
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background-main">
      <div className="w-full shrink-0">
        <Header />
      </div>

      <main className="flex-1 overflow-y-auto bg-background-card pb-[120px]">
        <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-7 px-4 py-6 sm:px-6 sm:py-8 md:px-8">
          <div className="flex flex-col gap-2">
            <h1 className="break-words text-[24px] font-bold leading-[120%] tracking-[-0.02em] text-text-accent sm:text-[28px] md:text-[30px]">
              Transaction &amp; Delivery History
            </h1>

            <p className="text-xs leading-[1.5] text-text-secondary sm:text-sm">
              Review your past orders and confirmed delivery arrivals.
            </p>

            <div className="mt-1 flex flex-col gap-1 text-xs text-text-secondary sm:text-sm">
              <span>
                <span className="font-semibold text-text-primary">
                  {customer.name}
                </span>
                {" · "}
                {customer.contactNumber}
              </span>

              <span>
                {customer.address[0]}, {customer.address[1]},{" "}
                {customer.address[2]}
              </span>
            </div>
          </div>

          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-border-light pb-2">
              <h2 className="text-base font-bold leading-5 text-text-primary sm:text-lg sm:leading-6">
                Order History
              </h2>

              <span className="text-[10px] font-semibold uppercase tracking-[0.5px] text-text-secondary">
                {customerOrders.length} Orders
              </span>
            </div>

            {customerOrders.length === 0 ? (
              <div className="rounded-lg border border-border-light bg-background-accent p-8 text-center">
                <p className="text-sm font-semibold text-text-primary">
                  No orders yet
                </p>

                <p className="mt-1 text-xs text-text-secondary">
                  Your orders will appear here after you place an order.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {customerOrders.map((order) => (
                  <HistoryCard
                    key={order.id || order.orderNumber}
                    order={order}
                    onTrack={() =>
                      handleTrackOrder(order)
                    }
                    onViewDetails={() =>
                      handleViewDetails(order)
                    }
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 z-50 w-full">
        <CustomerNavbar activeTab="orders" />
      </div>
    </div>
  );
}

export default Orders;