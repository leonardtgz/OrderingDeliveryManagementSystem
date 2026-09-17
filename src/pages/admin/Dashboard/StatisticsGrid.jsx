import React, { useEffect, useState } from "react";

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
    normalized === "pending" ||
    normalized === "processing"
  ) {
    return "PENDING";
  }

  if (
    normalized === "confirmed" ||
    normalized === "purifying"
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

  return "PENDING";
};

const StatisticsGrid = () => {
  const [stats, setStats] = useState({
    pending: 0,
    forDelivery: 0,
    totalOrders: 0,
    completed: 0,
    totalCustomers: 0,
  });

  const loadStatistics = () => {
    const orders = getOrders();

    const pending = orders.filter(
      (order) =>
        normalizeStatus(order.status) === "PENDING"
    ).length;

    const forDelivery = orders.filter(
      (order) =>
        normalizeStatus(order.status) ===
        "OUT FOR DELIVERY"
    ).length;

    const completed = orders.filter(
      (order) =>
        normalizeStatus(order.status) === "DELIVERED"
    ).length;

    const customerNames = new Set();

    orders.forEach((order) => {
      const customerName =
        order.customerName ||
        order.customer?.name;

      if (customerName) {
        customerNames.add(
          String(customerName).trim()
        );
      }
    });

    setStats({
      pending,
      forDelivery,
      totalOrders: orders.length,
      completed,
      totalCustomers: customerNames.size,
    });
  };

  useEffect(() => {
    loadStatistics();

    const handleOrdersUpdated = () => {
      loadStatistics();
    };

    const handleStorage = (event) => {
      if (event.key === ORDERS_KEY) {
        loadStatistics();
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

    // Keeps the dashboard synchronized
    // even if another page changes the data.
    const interval = setInterval(() => {
      loadStatistics();
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

  const statCards = [
    {
      id: 1,
      title: "PENDING ORDERS",
      value: stats.pending,
      label: "[PENDING]",
      bgColor: "bg-background-lightBlue",
    },
    {
      id: 2,
      title: "FOR DELIVERY",
      value: stats.forDelivery,
      label: "[OUT FOR\nDELIVERY]",
      bgColor: "bg-background-lightBlue",
    },
    {
      id: 3,
      title: "TOTAL ORDERS",
      value: stats.totalOrders,
      label: null,
      bgColor: "bg-background-lightBlue",
    },
    {
      id: 4,
      title: "COMPLETED",
      value: stats.completed,
      label: "[DELIVERED]",
      bgColor: "bg-background-lightBlue",
    },
    {
      id: 5,
      title: "TOTAL CUSTOMERS",
      value: stats.totalCustomers,
      label: null,
      bgColor: "bg-background-lightBlue",
    },
  ];

  return (
    <section className="flex flex-col gap-3xl sm:gap-4xl lg:gap-6">

      {/* First Row - 3 Cards */}
      <div className="grid grid-cols-1 gap-3xl sm:grid-cols-2 lg:grid-cols-3">
        {statCards.slice(0, 3).map((stat) => (
          <div
            key={stat.id}
            className={`${stat.bgColor} rounded-md border border-border-secondary p-6 shadow-card sm:p-8 lg:p-10xl`}
          >
            <div className="flex flex-col gap-sm">
              <h3 className="text-xs font-semibold uppercase leading-xs text-text-secondary">
                {stat.title}
              </h3>

              <div className="mt-2xl flex items-end gap-xl">
                <span className="text-[30px] font-bold leading-[37px] text-text-secondary sm:text-[40px] sm:leading-[49px] lg:text-xl lg:leading-3xl">
                  {stat.value}
                </span>

                {stat.label && (
                  <span className="mb-lg whitespace-pre-line text-xs font-semibold leading-xs text-text-brand">
                    {stat.label}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Second Row - 2 Cards */}
      <div className="grid grid-cols-1 gap-3xl sm:grid-cols-2 lg:w-2/3">
        {statCards.slice(3, 5).map((stat) => (
          <div
            key={stat.id}
            className={`${stat.bgColor} rounded-md border border-border-secondary p-6 shadow-card sm:p-8 lg:p-10xl`}
          >
            <div className="flex flex-col gap-sm">
              <h3 className="text-xs font-semibold uppercase leading-xs text-text-secondary">
                {stat.title}
              </h3>

              <div className="mt-2xl flex items-end gap-xl">
                <span className="text-[30px] font-bold leading-[37px] text-text-secondary sm:text-[40px] sm:leading-[49px] lg:text-xl lg:leading-3xl">
                  {stat.value}
                </span>

                {stat.label && (
                  <span className="mb-lg text-xs font-semibold leading-xs text-text-brand">
                    {stat.label}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};

export default StatisticsGrid;