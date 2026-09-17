import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import lightBlueIcon from "../../assets/images/img_icon_light_blue_900.svg";
import icon from "../../assets/images/img_icon.svg";

import roundPurifiedWaterImage from "../../assets/images/round-purified-water.png";
import slimPurifiedWaterImage from "../../assets/images/slim-purified-water.png";
import bottleImage from "../../assets/images/500ml-bottle.png";

import Header from "../../components/Header/Header";
import CustomerNavbar from "../../components/customer/CustomerNavbar";

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
  },
  {
    id: 2,
    name: "Slim Gallon Refill",
    price: "PHP 25.00",
    image: slimPurifiedWaterImage,
  },
  {
    id: 3,
    name: "500ml Bottle (Case of 24)",
    price: "PHP 240.00",
    image: bottleImage,
  },
];

const getProductImage = (productName = "") => {
  const name = String(productName).toLowerCase();

  if (
    name.includes("500ml") ||
    name.includes("bottle")
  ) {
    return bottleImage;
  }

  if (name.includes("slim")) {
    return slimPurifiedWaterImage;
  }

  return roundPurifiedWaterImage;
};

const getOrderTitle = (order) => {
  if (
    Array.isArray(order.products) &&
    order.products.length > 0
  ) {
    return order.products
      .map((product) => {
        const quantity = Number(
          product.quantity || 0,
        );

        return `${quantity}x ${product.name}`;
      })
      .join(" + ");
  }

  return order.title || "Order";
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
  if (order.createdAt) {
    const date = new Date(order.createdAt);

    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString(
        "en-PH",
        {
          year: "numeric",
          month: "short",
          day: "numeric",
        },
      );
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

const getDeliveryTime = (order) => {
  if (order.deliveryTime) {
    return order.deliveryTime;
  }

  if (order.deliverySchedule) {
    return order.deliverySchedule;
  }

  return "Delivery time not specified";
};

const getOrderNumber = (order) => {
  return (
    order.orderNumber ||
    order.id ||
    "Unknown"
  );
};

const normalizeStatus = (status) => {
  return String(status || "")
    .trim()
    .toLowerCase();
};

const isCompletedStatus = (status) => {
  const normalized = normalizeStatus(status);

  return (
    normalized === "delivered" ||
    normalized === "completed" ||
    normalized === "cancelled" ||
    normalized === "canceled"
  );
};

const isActiveStatus = (status) => {
  return !isCompletedStatus(status);
};

const getStatusSteps = (status) => {
  const normalized = normalizeStatus(status);

  let currentStep = 0;

  if (
    normalized.includes("out for delivery") ||
    normalized.includes("delivery") ||
    normalized.includes("in transit")
  ) {
    currentStep = 2;
  } else if (
    normalized.includes("purifying") ||
    normalized.includes("confirmed")
  ) {
    currentStep = 1;
  } else if (
    normalized.includes("delivered") ||
    normalized.includes("completed")
  ) {
    currentStep = 3;
  } else {
    currentStep = 0;
  }

  return [
    {
      label: "Pending",
      value:
        currentStep >= 0
          ? currentStep === 0
            ? "Current"
            : "Confirmed"
          : "Pending",
      active: currentStep === 0,
    },
    {
      label: "Purifying",
      value:
        currentStep >= 1
          ? currentStep === 1
            ? "Current"
            : "Completed"
          : "Pending",
      active: currentStep === 1,
    },
    {
      label: "Out for Delivery",
      value:
        currentStep >= 2
          ? currentStep === 2
            ? "In Transit"
            : "Completed"
          : "Pending",
      active: currentStep === 2,
    },
    {
      label: "Delivered",
      value:
        currentStep >= 3
          ? "Completed"
          : "Pending",
      active: currentStep === 3,
    },
  ];
};

const getEstimatedTime = (order) => {
  const status = normalizeStatus(
    order?.status,
  );

  if (
    status.includes("delivered") ||
    status.includes("completed")
  ) {
    return "Delivered";
  }

  if (
    order?.deliveryTime
  ) {
    return order.deliveryTime;
  }

  if (
    order?.deliverySchedule
  ) {
    return order.deliverySchedule;
  }

  return "Delivery pending";
};

const sortOrdersNewestFirst = (orders) => {
  return [...orders].sort(
    (a, b) => {
      const dateA = new Date(
        a.updatedAt ||
          a.createdAt ||
          0,
      ).getTime();

      const dateB = new Date(
        b.updatedAt ||
          b.createdAt ||
          0,
      ).getTime();

      return dateB - dateA;
    },
  );
};

function Home() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] =
    useState("home");

  const [customerOrders, setCustomerOrders] =
    useState([]);

  const loadOrders = () => {
    const orders = getOrders();

    if (!Array.isArray(orders)) {
      setCustomerOrders([]);
      return;
    }

    const filteredOrders =
      orders.filter((order) => {
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
      });

    setCustomerOrders(
      sortOrdersNewestFirst(
        filteredOrders,
      ),
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

  /*
   * The newest non-completed order is the
   * customer's current order.
   */
  const currentOrder =
    customerOrders.find(
      (order) =>
        isActiveStatus(
          order.status,
        ),
    ) || null;

  /*
   * Most recently updated/created orders.
   */
  const orderHistory =
    customerOrders.slice(0, 3);

  const handleProductClick = () => {
    navigate(
      "/customer/products",
    );
  };

  const handleTrackOrder = () => {
    if (!currentOrder) {
      navigate(
        "/customer/orders",
      );
      return;
    }

    navigate(
      "/customer/track",
      {
        state: {
          order: currentOrder,
        },
      },
    );
  };

  const handleRecentHistory =
    () => {
      navigate(
        "/customer/orders",
      );
    };

  const currentStatus =
    currentOrder?.status ||
    "No active order";

  const currentTitle =
    currentOrder
      ? getOrderTitle(
          currentOrder,
        )
      : "No active order";

  const currentOrderNumber =
    currentOrder
      ? getOrderNumber(
          currentOrder,
        )
      : "";

  const currentSteps =
    currentOrder
      ? getStatusSteps(
          currentOrder.status,
        )
      : [];

  return (
    <div className="min-h-screen w-full bg-background-main text-text-primary">
      <Header />

      <main className="w-full px-4 py-6 sm:px-6 md:px-8 lg:px-10">

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
            onClick={
              handleProductClick
            }
          >
            <img
              src={icon}
              alt=""
              className="h-4 w-4 object-contain"
            />

            <span>
              NEW ORDER
            </span>
          </button>
        </section>

        {/* Current Order Status */}
        <section className="mb-8 w-full">

          <button
            type="button"
            onClick={
              handleTrackOrder
            }
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
              onClick={
                handleTrackOrder
              }
              className="w-full cursor-pointer rounded-md bg-background-accent p-4 text-left transition-transform hover:scale-[1.01]"
            >

              <div className="mb-5 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="break-words text-sm font-bold">
                    Order #
                    {
                      currentOrderNumber
                    }
                  </h4>

                  <p className="mt-1 break-words text-xs text-text-secondary">
                    {currentTitle}
                  </p>

                  <p className="mt-1 text-xs font-semibold text-text-accent">
                    Status:{" "}
                    {currentStatus}
                  </p>
                </div>

                <span className="shrink-0 rounded-md bg-white/50 px-3 py-1 text-xs">
                  {
                    getEstimatedTime(
                      currentOrder,
                    )
                  }
                </span>
              </div>

              <div className="space-y-2">
                {currentSteps.map(
                  (step) => (
                    <div
                      key={
                        step.label
                      }
                      className={`flex items-center justify-between rounded-md p-3 ${
                        step.active
                          ? "bg-primary-background text-primary-foreground"
                          : "bg-white/40"
                      }`}
                    >
                      <span className="text-xs font-bold uppercase">
                        {
                          step.label
                        }
                      </span>

                      <span
                        className={`text-xs ${
                          step.active
                            ? ""
                            : "text-text-secondary"
                        }`}
                      >
                        {
                          step.value
                        }
                      </span>
                    </div>
                  ),
                )}
              </div>

              <div className="mt-4 text-center">
                <span className="text-xs font-bold uppercase tracking-wide text-text-accent">
                  Tap to Track Order
                </span>
              </div>
            </button>
          ) : (
            <div className="w-full rounded-md bg-background-accent p-6 text-center">
              <h4 className="text-sm font-bold text-text-primary">
                No Active Order
              </h4>

              <p className="mt-1 text-xs text-text-secondary">
                Your current order status will appear here after you place an order.
              </p>

              <button
                type="button"
                onClick={
                  handleProductClick
                }
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
            Note: All products are for refills only.
          </div>

          <div className="flex w-full gap-4 overflow-x-auto px-1 pb-3 pt-1">
            {products.map(
              (product) => (
                <div
                  key={
                    product.id
                  }
                  role="button"
                  tabIndex={0}
                  onClick={
                    handleProductClick
                  }
                  onKeyDown={(
                    e,
                  ) => {
                    if (
                      e.key ===
                        "Enter" ||
                      e.key ===
                        " "
                    ) {
                      e.preventDefault();

                      handleProductClick();
                    }
                  }}
                  className="w-64 flex-shrink-0 cursor-pointer overflow-hidden rounded-md bg-background-accent transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary"
                  style={{
                    boxShadow:
                      "0 4px 12px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <div className="h-56 w-full overflow-hidden bg-white/30">
                    <img
                      src={
                        product.image
                      }
                      alt={
                        product.name
                      }
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="p-4">
                    <h4 className="text-sm font-bold">
                      {
                        product.name
                      }
                    </h4>

                    <p className="mt-1 text-xs font-bold text-text-accent">
                      {
                        product.price
                      }
                    </p>
                  </div>

                  <div className="flex w-full items-center justify-center gap-2 bg-white py-3 text-xs font-bold uppercase text-text-accent">
                    <img
                      src={
                        lightBlueIcon
                      }
                      alt=""
                      className="h-3 w-3 object-contain"
                    />

                    <span>
                      ADD
                    </span>
                  </div>
                </div>
              ),
            )}
          </div>
        </section>

        {/* Recent History */}
        <section className="mb-24 w-full">

          <button
            type="button"
            onClick={
              handleRecentHistory
            }
            className="mb-3 flex w-full items-center justify-between text-left"
          >
            <h3 className="text-xs font-bold uppercase tracking-wide text-text-primary">
              Recent History
            </h3>

            <span className="text-xs font-bold text-text-accent hover:underline">
              VIEW ALL
            </span>
          </button>

          {orderHistory.length ===
          0 ? (
            <div className="w-full rounded-md bg-background-accent p-6 text-center">
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
              onClick={
                handleRecentHistory
              }
              className="w-full cursor-pointer overflow-hidden rounded-md bg-background-accent text-left transition-transform hover:scale-[1.01]"
            >
              {orderHistory.map(
                (
                  order,
                  index,
                ) => {
                  const title =
                    getOrderTitle(
                      order,
                    );

                  const quantity =
                    getTotalQuantity(
                      order,
                    );

                  const total =
                    Number(
                      order.total ||
                        0,
                    );

                  const status =
                    order.status ||
                    "Pending";

                  return (
                    <div
                      key={
                        order.id ||
                        order.orderNumber
                      }
                      className={`flex items-center justify-between gap-4 p-4 ${
                        index !==
                        orderHistory.length -
                          1
                          ? "border-b border-border-light"
                          : ""
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-bold">
                          {
                            getOrderDate(
                              order,
                            )
                          }
                        </p>

                        <p className="mt-1 break-words text-xs text-text-secondary">
                          {
                            quantity
                          }{" "}
                          Item
                          {quantity !==
                          1
                            ? "s"
                            : ""}{" "}
                          ·{" "}
                          {title}
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-sm font-bold">
                          PHP{" "}
                          {total.toFixed(
                            2,
                          )}
                        </p>

                        <p className="mt-1 text-xs font-bold uppercase text-text-accent">
                          {
                            status
                          }
                        </p>
                      </div>
                    </div>
                  );
                },
              )}

              <div className="border-t border-border-light p-3 text-center">
                <span className="text-xs font-bold uppercase tracking-wide text-text-accent">
                  Tap to View All Orders
                </span>
              </div>
            </button>
          )}
        </section>
      </main>

      {/* Customer Navbar */}
      <CustomerNavbar
        activeTab={
          activeTab
        }
        onNavigate={(
          tab,
        ) => {
          setActiveTab(
            tab,
          );

          if (
            tab ===
            "products"
          ) {
            navigate(
              "/customer/products",
            );
          }

          if (
            tab ===
            "orders"
          ) {
            navigate(
              "/customer/orders",
            );
          }

          if (
            tab ===
            "track"
          ) {
            navigate(
              "/customer/track",
            );
          }

          if (
            tab ===
            "profile"
          ) {
            navigate(
              "/customer/profile",
            );
          }

          if (
            tab ===
            "home"
          ) {
            navigate(
              "/customer/home",
            );
          }
        }}
      />
    </div>
  );
}

export default Home;