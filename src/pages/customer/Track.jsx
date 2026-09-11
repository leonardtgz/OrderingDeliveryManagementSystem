import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../components/Header/Header";
import CustomerNavbar from "../../components/customer/CustomerNavbar";

const steps = [
  { label: "Pending", time: "09:00 AM", status: "done" },
  { label: "Purifying", time: "09:45 AM", status: "done" },
  { label: "Out for Delivery", time: "1:15 PM", status: "current" },
  { label: "Delivered", time: "--:--", status: "upcoming" },
];

const recentHistory = [
  { id: "#ORD-881-02A", date: "Oct 12, 2023", status: "DELIVERED" },
  { id: "#ORD-775-01B", date: "Sep 28, 2023", status: "DELIVERED" },
];

const olderHistory = [
  { id: "#ORD-662-09C", date: "Sep 14, 2023", status: "DELIVERED" },
  { id: "#ORD-540-07D", date: "Aug 30, 2023", status: "DELIVERED" },
  { id: "#ORD-411-05E", date: "Aug 16, 2023", status: "DELIVERED" },
];

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

function LinearTracker() {
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
                    step.status === "done" || step.status === "current"
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

      <div className="text-sm text-text-primary sm:text-base">{children}</div>
    </div>
  );
}

function OrderHistoryRow({ order }) {
  return (
    <div className="flex items-center justify-between border-b border-dashed border-border-light py-1">
      <div className="flex min-w-0 flex-col">
        <span className="text-[11px] font-bold tracking-[0.4px] text-text-primary sm:text-xs">
          {order.id}
        </span>

        <span className="text-xs text-text-secondary sm:text-sm">
          {order.date}
        </span>
      </div>

      <span className="shrink-0 rounded bg-background-accent px-2 py-1 text-[10px] text-text-primary sm:text-xs">
        {order.status}
      </span>
    </div>
  );
}

function Track() {
  const navigate = useNavigate();
  const [showAllHistory, setShowAllHistory] = useState(false);

  const handleBackToOrders = () => {
    navigate("/customer/orders");
  };

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
              onClick={handleBackToOrders}
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
                    #ORD-992-04X
                  </span>
                </DetailField>

                <div className="sm:text-right">
                  <DetailField label="Expected Delivery">
                    <span className="text-sm font-bold sm:text-base">
                      Today, 2:30 PM
                    </span>
                  </DetailField>
                </div>
              </div>

              <LinearTracker />
            </section>

            <section className="flex flex-col gap-5 lg:col-span-1">
              <div className="flex flex-col gap-4 rounded border border-border-light bg-background-accent p-4">
                <h2 className="border-b border-border-light pb-2 text-base font-semibold text-text-primary sm:text-lg">
                  Delivery Details
                </h2>

                <DetailField label="Customer">
                  <div className="flex flex-col gap-1">
                    <span>Maria Santos</span>
                    <span className="text-xs text-text-secondary sm:text-sm">
                      0917-555-0192
                    </span>
                  </div>
                </DetailField>

                <DetailField label="Address">
                  <div className="flex flex-col text-sm sm:text-base">
                    <span>Block 4, Lot 12, Phase 2</span>
                    <span>Sunnyvale Subdivision</span>
                    <span>Brgy. San Jose, Antipolo</span>
                  </div>
                </DetailField>
              </div>

              <div className="flex flex-col gap-4 rounded border border-border-light bg-background-accent p-4">
                <h2 className="border-b border-border-light pb-2 text-base font-semibold text-text-primary sm:text-lg">
                  Order Summary
                </h2>

                <div className="flex items-start justify-between border-b border-border-light py-1">
                  <div className="flex min-w-0 flex-col">
                    <span className="text-sm text-text-primary sm:text-base">
                      Slim/Round Refill
                    </span>

                    <span className="text-[10px] text-text-secondary sm:text-xs">
                      Service: Refill Only
                    </span>

                    <span className="text-xs text-text-secondary sm:text-sm">
                      Qty: 4
                    </span>
                  </div>

                  <span className="shrink-0 text-[11px] font-bold text-text-primary sm:text-xs">
                    ₱180.00
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-base font-semibold text-text-primary sm:text-lg">
                    Total
                  </span>

                  <span className="text-base font-semibold text-text-primary sm:text-lg">
                    ₱180.00
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-4 rounded border border-border-light bg-background-accent p-4">
                <h2 className="border-b border-border-light pb-2 text-base font-semibold text-text-primary sm:text-lg">
                  Order History
                </h2>

                <div className="flex flex-col gap-2">
                  {recentHistory.map((order) => (
                    <OrderHistoryRow key={order.id} order={order} />
                  ))}

                  {showAllHistory &&
                    olderHistory.map((order) => (
                      <OrderHistoryRow key={order.id} order={order} />
                    ))}

                  {!showAllHistory && (
                    <button
                      type="button"
                      onClick={() => setShowAllHistory(true)}
                      className="pt-2 text-center text-[10px] font-bold tracking-[0.4px] text-text-accent transition-opacity hover:opacity-70 sm:text-xs sm:tracking-[0.6px]"
                    >
                      VIEW ALL PREVIOUS ORDERS
                    </button>
                  )}
                </div>
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