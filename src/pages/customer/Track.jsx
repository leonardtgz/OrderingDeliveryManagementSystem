import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Header from "../../components/Header/Header";
import CustomerNavbar from "../../components/customer/CustomerNavbar";

import snazzyImage from "../../assets/images/snazzy-image (1).png";

import { getCurrentOrder, getOrders } from "../../utils/orderStorage";

const customer = {
  name: "Maria Santos",
  contactNumber: "0917-555-0192",
  address: [
    "Block 4, Lot 12, Phase 2",
    "Sunnyvale Subdivision",
    "Brgy. San Jose, Antipolo",
  ],
};

function BackArrowIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.86875 6.75L7.06875 10.95L6 12L0 6L6 0L7.06875 1.05L2.86875 5.25H12V6.75H2.86875Z"
        fill="currentColor"
      />
    </svg>
  );
}

function WaterDropIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2C12 2 5 10 5 15.5C5 19.6421 8.13401 22 12 22C15.866 22 19 19.6421 19 15.5C19 10 12 2 12 2Z"
        fill="currentColor"
      />
      <path
        d="M8.5 16.5C8.5 18.1569 9.84315 19.5 11.5 19.5"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PurifiedWaterIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7 3H17V19C17 20.6569 15.6569 22 14 22H10C8.34315 22 7 20.6569 7 19V3Z"
        fill="currentColor"
      />
      <path
        d="M9.5 3V1.5H14.5V3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M9 14C10.2 13.2 11.2 13.2 12 14C12.8 14.8 13.8 14.8 15 14"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DeliveryWaterIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M3 6H14V17H3V6Z" fill="currentColor" />
      <path d="M14 10H18L21 13V17H14V10Z" fill="currentColor" />
      <circle cx="7" cy="19" r="2" fill="currentColor" />
      <circle cx="18" cy="19" r="2" fill="currentColor" />
      <path
        d="M6 9C6 9 8 11 8 12.5C8 13.3284 7.32843 14 6.5 14C5.67157 14 5 13.3284 5 12.5C5 11 6 9 6 9Z"
        fill="white"
      />
    </svg>
  );
}

function DeliveredWaterIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2C12 2 5 10 5 15.5C5 19.6421 8.13401 22 12 22C15.866 22 19 19.6421 19 15.5C19 10 12 2 12 2Z"
        fill="currentColor"
      />
      <path
        d="M8.5 15.5L10.5 17.5L15.5 12.5"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StepIcon({ status, index }) {
  const icons = [
    WaterDropIcon,
    PurifiedWaterIcon,
    DeliveryWaterIcon,
    DeliveredWaterIcon,
  ];

  const Icon = icons[index];

  return (
    <div
      className={`
        flex h-12 w-12 shrink-0 items-center justify-center rounded-full
        sm:h-14 sm:w-14
        ${
          status === "upcoming"
            ? "border-4 border-border-light bg-background-accent"
            : status === "done"
              ? "border-4 border-background-accent bg-primary-light"
              : "border-2 border-primary-background bg-background-accent"
        }
      `}
    >
      <Icon
        className={`
          h-5 w-5 sm:h-6 sm:w-6
          ${
            status === "upcoming"
              ? "text-border-light"
              : status === "done"
                ? "text-white"
                : "text-primary-background"
          }
        `}
      />
    </div>
  );
}

function StepLabel({ step }) {
  return (
    <div className="flex flex-col items-center gap-0.5 text-center">
      <span
        className={`
          text-[10px] font-bold uppercase tracking-[0.4px] sm:text-[11px]
          ${
            step.status === "current"
              ? "text-text-accent"
              : "text-text-primary"
          }
        `}
      >
        {step.label}
      </span>

      <span
        className={`
          text-xs sm:text-sm
          ${
            step.status === "upcoming"
              ? "font-normal text-text-secondary"
              : "font-bold"
          }
          ${
            step.status === "done" || step.status === "current"
              ? "text-text-accent"
              : ""
          }
        `}
      >
        {step.time}
      </span>
    </div>
  );
}

function LinearTracker({ steps }) {
  return (
    <div className="flex flex-col gap-5 py-3 sm:gap-6 sm:py-4">
      <div className="hidden sm:flex sm:items-start">
        {steps.map((step, index) => (
          <div
            key={step.label}
            className="flex flex-1 flex-col items-center gap-2"
          >
            <div className="flex w-full items-center">
              <div
                className={`
                  h-0.5 flex-1
                  ${
                    index === 0
                      ? "invisible"
                      : steps[index - 1].status !== "upcoming"
                        ? "bg-primary-light"
                        : "bg-border-light"
                  }
                `}
              />

              <StepIcon status={step.status} index={index} />

              <div
                className={`
                  h-0.5 flex-1
                  ${
                    index === steps.length - 1
                      ? "invisible"
                      : step.status !== "upcoming"
                        ? "bg-primary-light"
                        : "bg-border-light"
                  }
                `}
              />
            </div>

            <StepLabel step={step} />
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:hidden">
        {steps.map((step, index) => (
          <div key={step.label} className="flex gap-3">
            <div className="flex flex-col items-center">
              <StepIcon status={step.status} index={index} />

              {index < steps.length - 1 && (
                <div
                  className={`
                    my-1 w-0.5 flex-1
                    ${
                      step.status !== "upcoming"
                        ? "bg-primary-light"
                        : "bg-border-light"
                    }
                  `}
                />
              )}
            </div>

            <div className="flex flex-col items-start gap-0.5 pb-5 pt-1 text-left">
              <span
                className={`
                  text-[10px] font-bold uppercase tracking-[0.4px]
                  ${
                    step.status === "current"
                      ? "text-text-accent"
                      : "text-text-primary"
                  }
                `}
              >
                {step.label}
              </span>

              <span
                className={`
                  text-xs
                  ${
                    step.status === "upcoming"
                      ? "font-normal text-text-secondary"
                      : "font-bold"
                  }
                  ${
                    step.status === "done" ||
                    step.status === "current"
                      ? "text-text-accent"
                      : ""
                  }
                `}
              >
                {step.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DetailField({ label, children }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-bold uppercase tracking-[0.4px] text-text-secondary sm:text-xs">
        {label}
      </span>

      <div className="text-sm text-text-primary sm:text-base">
        {children}
      </div>
    </div>
  );
}

function GoogleLocationMap({ deliveryTime }) {
  return (
    <div className="overflow-hidden rounded border border-border-light bg-white">
      <div className="relative w-full">
        <img
          src={snazzyImage}
          alt="Delivery location"
          className="block h-[220px] w-full object-cover sm:h-[260px]"
        />

        <div className="absolute bottom-3 right-3 rounded-md bg-white px-3 py-2 shadow-md">
          <p className="text-[9px] font-bold uppercase tracking-wide text-text-secondary">
            Estimated arrival
          </p>

          <p className="text-xs font-bold text-text-primary sm:text-sm">
            {deliveryTime || "6:00 PM - 9:00 PM"}
          </p>
        </div>
      </div>
    </div>
  );
}

/*
 * Find the newest version of the SAME order.
 *
 * Router state is used only as a reference.
 * The actual displayed order always comes from goldenpr_orders.
 */
const findLatestTrackedOrder = (referenceOrder) => {
  if (!referenceOrder) {
    return null;
  }

  const orders = getOrders();

  if (!Array.isArray(orders)) {
    return null;
  }

  const referenceId = referenceOrder.id;
  const referenceOrderNumber =
    referenceOrder.orderNumber;

  const matchingOrders = orders.filter(
    (storedOrder) => {
      const sameId =
        referenceId != null &&
        storedOrder.id != null &&
        String(storedOrder.id) ===
          String(referenceId);

      const sameOrderNumber =
        referenceOrderNumber != null &&
        storedOrder.orderNumber != null &&
        String(storedOrder.orderNumber) ===
          String(referenceOrderNumber);

      return sameId || sameOrderNumber;
    },
  );

  if (matchingOrders.length === 0) {
    return null;
  }

  /*
   * If duplicates somehow exist, use the most recently
   * updated version of this exact order.
   */
  return [...matchingOrders].sort(
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
  )[0];
};

function Track() {
  const navigate = useNavigate();
  const location = useLocation();

  /*
   * Keep only the identity of the order being tracked.
   * Do NOT use the router order object as the source of truth.
   */
  const [trackedOrderReference] =
    useState(() => {
      return (
        location.state?.order ||
        getCurrentOrder()
      );
    });

  const [order, setOrder] =
    useState(null);

  /*
   * Load the latest version of the SAME order.
   */
  const loadTrackedOrder = () => {
    const latestOrder =
      findLatestTrackedOrder(
        trackedOrderReference,
      );

    setOrder(latestOrder);
  };

  useEffect(() => {
    loadTrackedOrder();

    const handleOrderUpdate = () => {
      loadTrackedOrder();
    };

    /*
     * Same-tab updates.
     */
    window.addEventListener(
      "orderUpdated",
      handleOrderUpdate,
    );

    window.addEventListener(
      "ordersUpdated",
      handleOrderUpdate,
    );

    /*
     * Cross-tab updates.
     */
    window.addEventListener(
      "storage",
      handleOrderUpdate,
    );

    /*
     * Fallback synchronization.
     * This ensures Track catches an Admin update
     * even if an event is missed.
     */
    const interval = setInterval(
      loadTrackedOrder,
      1000,
    );

    return () => {
      window.removeEventListener(
        "orderUpdated",
        handleOrderUpdate,
      );

      window.removeEventListener(
        "ordersUpdated",
        handleOrderUpdate,
      );

      window.removeEventListener(
        "storage",
        handleOrderUpdate,
      );

      clearInterval(interval);
    };
  }, [trackedOrderReference]);

  const normalizedOrder = useMemo(() => {
    if (!order) {
      return null;
    }

    const products =
      Array.isArray(order.products)
        ? order.products.map(
            (product) => {
              const quantity =
                Number(
                  product.quantity,
                ) || 0;

              const price =
                Number(
                  product.price,
                ) || 0;

              return {
                ...product,
                quantity,
                price,
                total:
                  quantity * price,
              };
            },
          )
        : [];

    /*
     * Use the actual stored subtotal when available.
     * Otherwise calculate it from products.
     */
    const calculatedSubtotal =
      products.reduce(
        (sum, product) =>
          sum +
          Number(
            product.total || 0,
          ),
        0,
      );

    const subtotal =
      order.subtotal != null
        ? Number(order.subtotal)
        : calculatedSubtotal;

    const deliveryFee =
      order.deliveryFee != null
        ? Number(order.deliveryFee)
        : 20;

    /*
     * Prefer the stored total from the order.
     * This keeps Track consistent with Order Summary.
     */
    const total =
      order.total != null
        ? Number(order.total)
        : subtotal + deliveryFee;

    return {
      ...order,
      products,
      subtotal,
      deliveryFee,
      total,
    };
  }, [order]);

  const currentStatus = String(
    normalizedOrder?.status ||
      "Pending",
  )
    .trim()
    .toLowerCase();

  const isDelivered =
    currentStatus === "delivered" ||
    currentStatus === "completed";

  const isCancelled =
    currentStatus === "cancelled" ||
    currentStatus === "canceled";

  const getSteps = () => {
    /*
     * DELIVERY FINISHED
     *
     * Everything is completed.
     */
    if (isDelivered) {
      return [
        {
          label: "Pending",
          time: "Completed",
          status: "done",
        },
        {
          label: "Purifying",
          time: "Completed",
          status: "done",
        },
        {
          label: "Out for Delivery",
          time: "Completed",
          status: "done",
        },
        {
          label: "Delivered",
          time:
            normalizedOrder?.deliveryTime ||
            "Completed",
          status: "done",
        },
      ];
    }

    /*
     * CANCELLED
     */
    if (isCancelled) {
      return [
        {
          label: "Pending",
          time: "Cancelled",
          status: "done",
        },
        {
          label: "Purifying",
          time: "--:--",
          status: "upcoming",
        },
        {
          label: "Out for Delivery",
          time: "--:--",
          status: "upcoming",
        },
        {
          label: "Delivered",
          time: "--:--",
          status: "upcoming",
        },
      ];
    }

    /*
     * OUT FOR DELIVERY
     */
    if (
      currentStatus === "out for delivery" ||
      currentStatus === "in transit" ||
      currentStatus === "delivery"
    ) {
      return [
        {
          label: "Pending",
          time: "Completed",
          status: "done",
        },
        {
          label: "Purifying",
          time: "Completed",
          status: "done",
        },
        {
          label: "Out for Delivery",
          time:
            normalizedOrder?.deliveryTime ||
            "In Transit",
          status: "current",
        },
        {
          label: "Delivered",
          time: "--:--",
          status: "upcoming",
        },
      ];
    }

    /*
     * CONFIRMED / PURIFYING
     */
    if (
      currentStatus === "confirmed" ||
      currentStatus === "purifying" ||
      currentStatus === "processing"
    ) {
      return [
        {
          label: "Pending",
          time: "Completed",
          status: "done",
        },
        {
          label: "Purifying",
          time: "Preparing",
          status: "current",
        },
        {
          label: "Out for Delivery",
          time: "--:--",
          status: "upcoming",
        },
        {
          label: "Delivered",
          time: "--:--",
          status: "upcoming",
        },
      ];
    }

    /*
     * PENDING
     */
    return [
      {
        label: "Pending",
        time: "Order Received",
        status: "current",
      },
      {
        label: "Purifying",
        time: "--:--",
        status: "upcoming",
      },
      {
        label: "Out for Delivery",
        time: "--:--",
        status: "upcoming",
      },
      {
        label: "Delivered",
        time: "--:--",
        status: "upcoming",
      },
    ];
  };

  const steps = getSteps();

  const handleBackToOrders = () => {
    navigate("/customer/orders");
  };

  if (!normalizedOrder) {
    return (
      <div className="flex min-h-screen flex-col bg-background-main">
        <div className="w-full shrink-0">
          <Header />
        </div>

        <main className="flex flex-1 items-center justify-center bg-background-card px-4 pb-[120px]">
          <div className="w-full max-w-md rounded-lg border border-border-light bg-background-accent p-8 text-center">
            <h1 className="text-lg font-bold text-text-primary">
              No Order to Track
            </h1>

            <p className="mt-2 text-sm text-text-secondary">
              Place an order first to view its tracking information.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/customer/products",
                )
              }
              className="mt-5 rounded-md bg-primary-background px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-primary-foreground"
            >
              Browse Products
            </button>
          </div>
        </main>

        <div className="fixed bottom-0 left-0 z-50 w-full">
          <CustomerNavbar activeTab="track" />
        </div>
      </div>
    );
  }

  const deliveryAddress =
    Array.isArray(
      normalizedOrder.deliveryAddressLines,
    )
      ? normalizedOrder.deliveryAddressLines
      : Array.isArray(
          normalizedOrder.deliveryAddress,
        )
        ? normalizedOrder.deliveryAddress
        : customer.address;

  const deliveryTime =
    normalizedOrder.deliveryTime ||
    "--:--";

  const deliverySchedule =
    normalizedOrder.deliverySchedule ||
    `${normalizedOrder.deliveryDate || "Today"}, ${deliveryTime}`;

  return (
    <div className="flex min-h-screen flex-col bg-background-main">
      <div className="w-full shrink-0">
        <Header />
      </div>

      <main className="flex-1 overflow-y-auto bg-background-card pb-[120px]">
        <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-6 p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-xl font-bold tracking-[-0.2px] text-text-primary sm:text-2xl sm:tracking-[-0.32px]">
              Order Tracking
            </h1>

            <button
              type="button"
              onClick={
                handleBackToOrders
              }
              className="flex min-h-10 w-fit items-center gap-1 rounded border border-border-light bg-background-main px-3 py-2.5 text-[10px] font-bold tracking-[0.4px] text-text-primary transition-colors hover:bg-background-accent sm:min-h-12 sm:px-4 sm:py-3.5 sm:text-xs sm:tracking-[0.6px]"
            >
              <BackArrowIcon className="h-3 w-3" />
              BACK TO ORDERS
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <section className="flex flex-col gap-6 rounded border border-border-light bg-background-accent p-4 sm:gap-8 sm:p-6 lg:col-span-2">
              <div className="flex flex-col gap-3 border-b border-border-light pb-4 sm:flex-row sm:items-center sm:justify-between">
                <DetailField label="Order Number">
                  <span className="text-base font-semibold sm:text-lg">
                    #
                    {String(
                      normalizedOrder.orderNumber ||
                        normalizedOrder.id ||
                        "",
                    ).replace(/^#/, "")}
                  </span>
                </DetailField>

                <div className="sm:text-right">
                  <DetailField label="Expected Delivery">
                    <span className="text-sm font-bold sm:text-base">
                      {deliverySchedule}
                    </span>
                  </DetailField>
                </div>
              </div>

              <LinearTracker
                steps={steps}
              />

              <div className="border-t border-border-light pt-5">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-text-primary sm:text-lg">
                      Delivery Location
                    </h2>

                    <p className="mt-1 text-xs text-text-secondary sm:text-sm">
                      {isDelivered
                        ? "Your order has been delivered."
                        : isCancelled
                          ? "This order has been cancelled."
                          : "Your order is being prepared for delivery."}
                    </p>
                  </div>

                  {!isDelivered &&
                    !isCancelled && (
                      <span className="rounded-full bg-background-accent px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-text-accent sm:text-xs">
                        LIVE
                      </span>
                    )}
                </div>

                <GoogleLocationMap
                  deliveryTime={
                    isDelivered
                      ? normalizedOrder.deliveryTime ||
                        "Delivered"
                      : deliveryTime
                  }
                />
              </div>
            </section>

            <section className="flex flex-col gap-5 lg:col-span-1">
              <div className="flex flex-col gap-4 rounded border border-border-light bg-background-accent p-4">
                <h2 className="border-b border-border-light pb-2 text-base font-semibold text-text-primary sm:text-lg">
                  Delivery Details
                </h2>

                <DetailField label="Customer">
                  <div className="flex flex-col gap-1">
                    <span>
                      {normalizedOrder.customerName ||
                        customer.name}
                    </span>

                    <span className="text-xs text-text-secondary sm:text-sm">
                      {normalizedOrder.contactNumber ||
                        customer.contactNumber}
                    </span>
                  </div>
                </DetailField>

                <DetailField label="Address">
                  <div className="flex flex-col text-sm sm:text-base">
                    {deliveryAddress.map(
                      (line, index) => (
                        <span
                          key={`${line}-${index}`}
                        >
                          {line}
                        </span>
                      ),
                    )}
                  </div>
                </DetailField>
              </div>

              <div className="flex flex-col gap-4 rounded border border-border-light bg-background-accent p-4">
                <h2 className="border-b border-border-light pb-2 text-base font-semibold text-text-primary sm:text-lg">
                  Order Summary
                </h2>

                {normalizedOrder.products.map(
                  (product) => (
                    <div
                      key={
                        product.id ||
                        product.name
                      }
                      className="flex items-start justify-between gap-4 border-b border-border-light py-2"
                    >
                      <div className="flex min-w-0 flex-col">
                        <span className="text-sm text-text-primary sm:text-base">
                          {product.name}
                        </span>

                        <span className="text-[10px] text-text-secondary sm:text-xs">
                          Qty:{" "}
                          {product.quantity}
                        </span>
                      </div>

                      <span className="shrink-0 text-[11px] font-bold text-text-primary sm:text-xs">
                        PHP{" "}
                        {Number(
                          product.total ||
                            0,
                        ).toFixed(2)}
                      </span>
                    </div>
                  ),
                )}

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-text-secondary">
                    Subtotal
                  </span>

                  <span className="text-xs font-semibold text-text-primary">
                    PHP{" "}
                    {normalizedOrder.subtotal.toFixed(
                      2,
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-secondary">
                    Delivery Fee
                  </span>

                  <span className="text-xs font-semibold text-text-primary">
                    PHP{" "}
                    {normalizedOrder.deliveryFee.toFixed(
                      2,
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-border-light pt-2">
                  <span className="text-base font-semibold text-text-primary sm:text-lg">
                    Total
                  </span>

                  <span className="text-base font-semibold text-text-primary sm:text-lg">
                    PHP{" "}
                    {normalizedOrder.total.toFixed(
                      2,
                    )}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-4 rounded border border-border-light bg-background-accent p-4">
                <h2 className="border-b border-border-light pb-2 text-base font-semibold text-text-primary sm:text-lg">
                  Order Information
                </h2>

                <DetailField label="Status">
                  <span className="font-semibold text-text-accent">
                    {normalizedOrder.status ||
                      "Pending"}
                  </span>
                </DetailField>

                {normalizedOrder.notes && (
                  <DetailField label="Notes">
                    <span>
                      {normalizedOrder.notes}
                    </span>
                  </DetailField>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 z-50 w-full">
        <CustomerNavbar activeTab="track" />
      </div>
    </div>
  );
}

export default Track;