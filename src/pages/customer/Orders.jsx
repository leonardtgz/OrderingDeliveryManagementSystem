
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
      (sum, product) => sum + Number(product.quantity || 0),
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

const getStatusStyle = (status) => {
  const normalizedStatus = String(status || "Pending")
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

function HistoryCard({ order, onTrack, onViewDetails }) {
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

  const normalizedStatus = String(status).trim().toLowerCase();

  const isFinalStatus = [
    "delivered",
    "cancelled",
    "canceled",
    "failed",
  ].includes(normalizedStatus);

  return (
    <div className="group flex w-full flex-col gap-4 rounded-xl border border-stone-200 bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md sm:p-5 md:flex-row md:items-center md:justify-between">
      <div className="flex min-w-0 w-full items-center gap-4 md:w-auto">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-stone-200 bg-stone-50 p-1.5">
          <img
            src={image}
            alt={title}
            className="h-12 w-11 object-contain transition-transform duration-200 group-hover:scale-105"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <span className="mb-1 text-[10px] font-bold uppercase tracking-[0.6px] text-stone-500">
            ORDER #{order.orderNumber || order.id}
          </span>

          <span className="break-words text-sm font-bold leading-6 text-stone-800 sm:text-base">
            {title}
          </span>

          <div className="mt-2 flex flex-wrap gap-2">
            <span className="inline-flex w-fit items-center rounded-full border border-[#A8DCE8] bg-[#E8F8FC] px-2.5 py-1 text-[10px] font-semibold text-[#006994]">
              {totalQuantity} Item{totalQuantity !== 1 ? "s" : ""}
            </span>

            <span className="inline-flex w-fit items-center rounded-full border border-[#A8DCE8] bg-[#E8F8FC] px-2.5 py-1 text-[10px] font-semibold text-[#006994]">
              Refill Service
            </span>
          </div>

          <span className="mt-2 text-xs text-stone-500">
            {getOrderDate(order)}
          </span>
        </div>
      </div>

      <div className="flex w-full flex-col gap-3 border-t border-stone-200 pt-3 sm:pt-4 md:w-auto md:items-end md:border-0 md:pt-0">
        <div className="flex w-full items-start justify-between gap-6 md:w-auto md:justify-end">
          <div className="flex min-w-0 flex-1 flex-col md:min-w-[120px] md:flex-none">
            <span className="text-[10px] font-bold uppercase tracking-[0.6px] text-stone-500">
              Total
            </span>

            <span className="mt-1 break-words text-sm font-bold leading-5 text-stone-800">
              {formatPrice(total)}
            </span>
          </div>

          <div className="flex shrink-0 flex-col items-end">
            <span className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.6px] text-stone-500">
              Status
            </span>

            <span
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.5px] ${getStatusStyle(
                status,
              )}`}
            >
              {status}
            </span>
          </div>
        </div>

        <div className="flex w-full flex-wrap gap-2 md:w-auto md:justify-end">
          <button
            type="button"
            onClick={onViewDetails}
            className="min-h-9 rounded-md border border-[#A8DCE8] bg-[#E8F8FC] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.6px] text-[#006994] transition-colors hover:border-[#08779D] hover:bg-[#C8EDF5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#40BFD8] focus-visible:ring-offset-2 sm:px-4"
          >
            View Details
          </button>

          {!isFinalStatus && (
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
  const navigate = useNavigate();
  const [savedOrders, setSavedOrders] = useState([]);

  const loadOrders = () => {
    const orders = getOrders();

    setSavedOrders(Array.isArray(orders) ? [...orders] : []);
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

  const customerOrders = savedOrders.filter((order) => {
    if (!order.customerName) {
      return true;
    }

    return (
      String(order.customerName).trim().toLowerCase() ===
      customer.name.trim().toLowerCase()
    );
  });

  const handleTrackOrder = (order) => {
    navigate("/customer/track", {
      state: { order },
    });
  };

  const handleViewDetails = (order) => {
    navigate("/customer/order-details", {
      state: { order },
    });
  };

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
                {customer.address[0]}, {customer.address[1]},{" "}
                {customer.address[2]}
              </span>
            </div>
          </div>

          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <h2 className="text-base font-bold leading-5 text-stone-800 sm:text-lg sm:leading-6">
                Order History
              </h2>

              <span className="text-[10px] font-semibold uppercase tracking-[0.5px] text-stone-500">
                {customerOrders.length} Orders
              </span>
            </div>

            {customerOrders.length === 0 ? (
              <div className="rounded-xl border border-stone-200 bg-white p-8 text-center">
                <p className="text-sm font-semibold text-stone-800">
                  No orders yet
                </p>

                <p className="mt-1 text-xs text-stone-500">
                  Your orders will appear here after you place an order.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {customerOrders.map((order) => (
                  <HistoryCard
                    key={order.id || order.orderNumber}
                    order={order}
                    onTrack={() => handleTrackOrder(order)}
                    onViewDetails={() => handleViewDetails(order)}
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
      <CustomerFooter />
    </div>
  );
}

export default Orders;