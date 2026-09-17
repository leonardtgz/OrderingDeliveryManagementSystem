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

const normalizeStatus = (status) => {
  const normalized = String(status || "")
    .trim()
    .toLowerCase();

  if (
    normalized === "processing" ||
    normalized === "pending"
  ) {
    return "PENDING";
  }

  if (
    normalized === "purifying" ||
    normalized === "confirmed"
  ) {
    return "CONFIRMED";
  }

  if (
    normalized === "out for delivery" ||
    normalized === "in transit" ||
    normalized === "delivery"
  ) {
    return "OUT FOR DELIVERY";
  }

  if (
    normalized === "delivered" ||
    normalized === "completed"
  ) {
    return "DELIVERED";
  }

  if (
    normalized === "cancelled" ||
    normalized === "canceled"
  ) {
    return "CANCELLED";
  }

  return String(status || "PENDING")
    .toUpperCase();
};

const getCustomerName = (order) => {
  return (
    order.customerName ||
    order.customer?.name ||
    "Customer"
  );
};

const getOrderId = (order) => {
  return (
    order.orderNumber ||
    order.id ||
    "N/A"
  );
};

const getQuantity = (order) => {
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

const getFiveGallonQuantity = (order) => {
  if (!Array.isArray(order.products)) {
    return 0;
  }

  return order.products.reduce(
    (total, product) => {
      const productName = String(
        product.name ||
          product.productName ||
          ""
      ).toLowerCase();

      const isFiveGallon =
        productName.includes("5 gallon") ||
        productName.includes("5-gallon") ||
        productName.includes("round refill") ||
        productName.includes("slim gallon") ||
        productName.includes("slim refill");

      if (!isFiveGallon) {
        return total;
      }

      return (
        total +
        Number(
          product.quantity ||
            product.qty ||
            0
        )
      );
    },
    0
  );
};

const getAmount = (order) => {
  const amount = Number(
    order.total ??
      order.subtotal ??
      0
  );

  return `₱ ${amount.toFixed(2)}`;
};

const getStatusBackground = (status) => {
  switch (status) {
    case "DELIVERED":
      return "bg-background-lighterBlue";

    case "OUT FOR DELIVERY":
      return "bg-background-lighterBlue";

    case "CONFIRMED":
      return "bg-background-lighterBlue";

    case "CANCELLED":
      return "bg-background-lighterBlue";

    case "PENDING":
    default:
      return "bg-background-lighterBlue";
  }
};

const getOrderTimestamp = (order) => {
  const timestamp =
    order.updatedAt ||
    order.createdAt;

  if (!timestamp) {
    return 0;
  }

  const parsed = new Date(
    timestamp
  ).getTime();

  return Number.isNaN(parsed)
    ? 0
    : parsed;
};

const RecentOrders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);

  const loadRecentOrders = () => {
    const savedOrders = getOrders();

    const recentOrders = savedOrders
      .sort(
        (a, b) =>
          getOrderTimestamp(b) -
          getOrderTimestamp(a)
      )
      .slice(0, 5);

    setOrders(recentOrders);
  };

  useEffect(() => {
    loadRecentOrders();

    const handleOrdersUpdated = () => {
      loadRecentOrders();
    };

    const handleStorage = (event) => {
      if (event.key === ORDERS_KEY) {
        loadRecentOrders();
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

    // Additional safeguard for same-tab updates
    const interval = setInterval(() => {
      loadRecentOrders();
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
    <section className="flex-1 rounded-md border border-card-border bg-card-background shadow-card">

      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 border-b border-border-light px-4 py-6 sm:flex-row sm:items-center sm:px-6 sm:py-8 lg:px-10xl lg:py-10xl">
        <h3 className="text-[18px] font-semibold leading-[23px] text-text-secondary sm:text-[20px] sm:leading-[25px] lg:text-md lg:leading-lg">
          Recent Orders
        </h3>

        <button
          type="button"
          onClick={() =>
            navigate("/admin/orders")
          }
          className="rounded-sm border border-primary-background px-xl py-xl text-xs font-semibold uppercase leading-xs text-text-brand transition-colors duration-200 hover:bg-primary-background hover:text-primary-foreground"
        >
          VIEW ALL
        </button>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto px-xl py-xl sm:px-4 lg:px-xl">
        <table className="w-full min-w-[600px]">

          <thead className="border-b border-border-light bg-background-main">
            <tr>
              <th className="px-3 py-4 text-left sm:px-4 lg:px-3xl">
                <span className="text-xs font-semibold uppercase leading-sm text-text-secondary">
                  ORDER ID
                </span>
              </th>

              <th className="px-3 py-4 text-left sm:px-4 lg:px-3xl">
                <span className="text-xs font-semibold uppercase leading-xs text-text-secondary">
                  CUSTOMER
                </span>
              </th>

              <th className="px-3 py-3 text-left sm:px-4 lg:px-3xl">
                <span className="text-xs font-semibold uppercase leading-sm text-text-secondary">
                  QTY (5 GAL)
                </span>
              </th>

              <th className="px-3 py-4 text-left sm:px-4 lg:px-3xl">
                <span className="text-xs font-semibold uppercase leading-xs text-text-secondary">
                  STATUS
                </span>
              </th>

              <th className="px-3 py-4 text-left sm:px-4 lg:px-3xl">
                <span className="text-xs font-semibold uppercase leading-xs text-text-secondary">
                  AMOUNT
                </span>
              </th>
            </tr>
          </thead>

          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => {
                const status =
                  normalizeStatus(
                    order.status
                  );

                return (
                  <tr
                    key={
                      order.id ||
                      order.orderNumber
                    }
                    className="border-b border-border-light transition-colors duration-150 hover:bg-secondary-light"
                  >
                    {/* Order ID */}
                    <td className="px-3 py-5 sm:px-4 lg:px-3xl">
                      <span className="text-sm font-normal leading-md text-primary-dark">
                        {getOrderId(order)}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="px-3 py-5 sm:px-4 lg:px-3xl">
                      <span className="whitespace-nowrap text-sm font-normal leading-md text-primary-dark">
                        {getCustomerName(order)}
                      </span>
                    </td>

                    {/* Quantity */}
                    <td className="px-3 py-5 sm:px-4 lg:px-3xl">
                      <span className="text-sm font-normal leading-sm text-primary-dark">
                        {getFiveGallonQuantity(
                          order
                        ) ||
                          getQuantity(
                            order
                          )}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-3 py-5 sm:px-4 lg:px-3xl">
                      <span
                        className={`inline-block whitespace-pre-line rounded-sm px-xl py-[2px] ${getStatusBackground(
                          status
                        )} text-xs font-semibold leading-xs text-text-secondary`}
                      >
                        [{status}]
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="px-3 py-5 sm:px-4 lg:px-3xl">
                      <span className="text-sm font-normal leading-sm text-primary-dark">
                        {getAmount(order)}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="px-3 py-10 text-center sm:px-4 lg:px-3xl"
                >
                  <p className="text-sm font-semibold text-text-secondary">
                    No recent orders
                  </p>

                  <p className="mt-1 text-xs text-text-accent">
                    New customer orders will
                    appear here.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default RecentOrders;