import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

const ORDERS_KEY = "goldenpr_orders";

const getOrders = () => {
  try {
    const savedOrders = localStorage.getItem(ORDERS_KEY);

    if (!savedOrders) {
      return [];
    }

    const orders = JSON.parse(savedOrders);

    return Array.isArray(orders) ? orders : [];
  } catch (error) {
    console.error("Failed to load orders:", error);
    return [];
  }
};

const isDelivered = (status) => {
  const normalizedStatus = String(status || "")
    .trim()
    .toLowerCase();

  return (
    normalizedStatus === "delivered" ||
    normalizedStatus === "completed"
  );
};

const formatDeliveryDate = (order) => {
  const dateValue =
    order.deliveryDate ||
    order.createdAt ||
    order.updatedAt;

  if (!dateValue) {
    return "Recent";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return String(dateValue);
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatDeliveryTime = (order) => {
  if (order.deliveryTime) {
    return order.deliveryTime;
  }

  const dateValue =
    order.updatedAt || order.createdAt;

  if (!dateValue) {
    return "";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};

const getCustomerName = (order) => {
  return (
    order.customerName ||
    order.customer?.name ||
    "Customer"
  );
};

const getOrderNumber = (order) => {
  return (
    order.orderNumber ||
    order.id ||
    "Order"
  );
};

const getOrderQuantity = (order) => {
  if (!Array.isArray(order.products)) {
    return 0;
  }

  return order.products.reduce(
    (total, product) =>
      total +
      Number(
        product.quantity ||
          product.qty ||
          0
      ),
    0
  );
};

const DeliverySchedule = () => {
  const navigate = useNavigate();

  const [recentDeliveries, setRecentDeliveries] =
    useState([]);

  const loadRecentDeliveries = () => {
    const orders = getOrders();

    const deliveredOrders = orders
      .filter((order) =>
        isDelivered(order.status)
      )
      .sort((a, b) => {
        const dateA = new Date(
          a.updatedAt ||
            a.createdAt ||
            0
        ).getTime();

        const dateB = new Date(
          b.updatedAt ||
            b.createdAt ||
            0
        ).getTime();

        return dateB - dateA;
      })
      .slice(0, 3);

    setRecentDeliveries(deliveredOrders);
  };

  useEffect(() => {
    loadRecentDeliveries();

    const handleOrdersUpdated = () => {
      loadRecentDeliveries();
    };

    const handleStorage = (event) => {
      if (event.key === ORDERS_KEY) {
        loadRecentDeliveries();
      }
    };

    window.addEventListener(
      "orderUpdated",
      handleOrdersUpdated
    );

    window.addEventListener(
      "ordersUpdated",
      handleOrdersUpdated
    );

    window.addEventListener(
      "storage",
      handleStorage
    );

    const interval = setInterval(() => {
      loadRecentDeliveries();
    }, 1000);

    return () => {
      window.removeEventListener(
        "orderUpdated",
        handleOrdersUpdated
      );

      window.removeEventListener(
        "ordersUpdated",
        handleOrdersUpdated
      );

      window.removeEventListener(
        "storage",
        handleStorage
      );

      clearInterval(interval);
    };
  }, []);

  return (
    <section className="flex w-full flex-col rounded-md border border-card-border bg-card-background shadow-card lg:w-1/3">

      {/* Header */}
      <div className="border-b border-border-light px-4 py-6 sm:px-6 sm:py-8 lg:px-10xl lg:py-10xl">
        <div className="flex flex-col gap-xs">
          <h3 className="whitespace-pre-line text-[18px] font-semibold leading-[23px] text-text-secondary sm:text-[20px] sm:leading-[25px] lg:text-md lg:leading-xl">
            Recent Deliveries
          </h3>

          <p className="mt-md text-sm font-normal leading-sm text-text-accent">
            Latest completed orders
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/admin/deliveries")
            }
            className="mt-md text-left text-xs font-semibold uppercase leading-sm text-text-brand hover:underline"
          >
            VIEW DELIVERY HISTORY
          </button>
        </div>
      </div>

      {/* Recent Deliveries List */}
      <div className="flex-1 overflow-y-auto px-4 py-xl sm:px-6 lg:px-9xl">
        <div className="flex flex-col gap-3xl">

          {recentDeliveries.length > 0 ? (
            recentDeliveries.map((order) => {
              const quantity =
                getOrderQuantity(order);

              const total =
                Number(order.total || 0);

              return (
                <div
                  key={
                    order.id ||
                    order.orderNumber
                  }
                  className="rounded-tr-sm rounded-br-sm border-l-medium border-primary-background bg-background-lightBlue p-xl"
                >
                  <div className="flex flex-col gap-xs">

                    {/* Order + Time */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <span className="block text-xs font-semibold leading-sm text-text-secondary">
                          {getOrderNumber(order)}
                        </span>

                        <span className="mt-1 block truncate text-sm font-semibold text-text-primary">
                          {getCustomerName(order)}
                        </span>
                      </div>

                      <span className="ml-2 shrink-0 whitespace-pre-line text-right text-sm font-normal leading-md text-text-accent">
                        {formatDeliveryTime(order)}
                      </span>
                    </div>

                    {/* Date */}
                    <p className="mt-xs text-sm font-normal leading-sm text-text-secondary">
                      Delivered:{" "}
                      {formatDeliveryDate(order)}
                    </p>

                    {/* Order Details */}
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-normal leading-md text-text-accent">
                        {quantity > 0
                          ? `${quantity} items`
                          : "Delivery completed"}
                      </p>

                      <span className="shrink-0 rounded-sm bg-background-card px-2 py-1 text-[10px] font-semibold uppercase text-text-primary">
                        DELIVERED
                      </span>
                    </div>

                    {/* Total */}
                    {total > 0 && (
                      <p className="text-xs font-semibold text-text-secondary">
                        Total: ₱
                        {total.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <p className="text-sm font-semibold text-text-secondary">
                No recent deliveries
              </p>

              <p className="mt-1 text-xs text-text-accent">
                Completed deliveries will appear here.
              </p>
            </div>
          )}

        </div>
      </div>

      {/* Footer Button */}
      <div className="border-t border-border-light px-4 py-6 sm:px-6 sm:py-8 lg:px-10xl lg:py-10xl">
        <button
          type="button"
          onClick={() =>
            navigate("/admin/deliveries")
          }
          className="w-full rounded-sm bg-primary-background px-xl py-xl text-center text-xs font-semibold uppercase leading-sm text-primary-foreground transition-colors duration-200 hover:bg-primary-light"
        >
          GO TO DELIVERY
        </button>
      </div>
    </section>
  );
};

export default DeliverySchedule;