import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Header from "../../components/Header/Header";
import CustomerNavbar from "../../components/customer/CustomerNavbar";

import containerIcon from "../../assets/images/img_container.svg";

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

const defaultOrder = {
  id: "ORD-2023-104",
  title: "5x 5-Gallon Round Refill",
  tag: "Refill Service",
  date: "Oct 24, 2023",
  total: "PHP 150.00",
  status: "Processing",
  statusType: "active",
  image: containerIcon,
  address: "123 Sample St, Brgy. San Antonio, Pasig City",
  deliveryDate: "Today",
  deliveryTime: "2:00 PM - 4:00 PM",
  paymentMethod: "Cash on Delivery",
};

function OrderDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  const order = location.state?.order || defaultOrder;

  const handleBack = () => {
    navigate("/customer/orders");
  };

  const handleTrackOrder = () => {
    navigate("/customer/track", {
      state: { order },
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background-main">
      {/* Existing System Header */}
      <div className="w-full shrink-0">
        <Header />
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background-card pb-[120px]">
        <div className="mx-auto flex w-full max-w-[900px] flex-col gap-5 px-4 py-5 sm:px-6 sm:py-7">
          {/* Page Header */}
          <div className="flex flex-col gap-1">
            <h1 className="text-[24px] font-bold leading-[120%] tracking-[-0.02em] text-text-accent sm:text-[28px]">
              Order Details
            </h1>

            <p className="text-xs leading-[1.5] text-text-secondary sm:text-sm">
              View the details of your order and delivery information.
            </p>
          </div>

          {/* Order Information */}
          <section className="overflow-hidden rounded-lg bg-background-accent shadow-[0px_1px_2px_#0000000c]">
            {/* Order Header */}
            <div className="flex flex-col gap-2 border-b border-border-light px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <div className="flex min-w-0 flex-col gap-0.5">
                <span className="text-[10px] font-bold uppercase tracking-[0.6px] text-text-secondary">
                  ORDER NUMBER
                </span>

                <span className="text-sm font-bold text-text-primary sm:text-base">
                  {order.id}
                </span>
              </div>

              <span
                className={`w-fit rounded-sm px-2 py-1 text-[10px] font-bold uppercase tracking-[0.6px] ${
                  order.statusType === "active"
                    ? "bg-primary-background text-primary-foreground"
                    : "bg-background-overlay-dark text-text-primary"
                }`}
              >
                {order.status}
              </span>
            </div>

            {/* Product */}
            <div className="flex items-center gap-3 border-b border-border-light px-4 py-4 sm:px-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md bg-background-card">
                <img
                  src={order.image}
                  alt={order.title}
                  className="h-11 w-9 object-contain"
                />
              </div>

              <div className="min-w-0 flex-1">
                <span className="text-sm font-bold leading-5 text-text-primary sm:text-base">
                  {order.title}
                </span>

                <div className="mt-1">
                  <span className="inline-flex items-center rounded-sm bg-primary-lighter px-2 py-0.5 text-[10px] font-medium text-text-accent">
                    {order.tag}
                  </span>
                </div>

                <span className="mt-1 block text-xs text-text-secondary">
                  Ordered {order.date}
                </span>
              </div>
            </div>

            {/* Delivery Details */}
            <div className="flex flex-col gap-4 px-4 py-4 sm:px-5">
              {/* Address */}
              <div className="flex items-start gap-3">
                <AddressIcon />

                <div className="min-w-0 flex-1">
                  <span className="block text-[10px] font-bold uppercase tracking-[0.6px] text-text-secondary">
                    DELIVERY ADDRESS
                  </span>

                  <span className="mt-1 block break-words text-sm leading-5 text-text-primary">
                    {order.address}
                  </span>
                </div>
              </div>

              <div className="h-px w-full bg-border-light" />

              {/* Date & Time */}
              <div className="flex items-start gap-3">
                <DateTimeIcon />

                <div className="min-w-0 flex-1">
                  <span className="block text-[10px] font-bold uppercase tracking-[0.6px] text-text-secondary">
                    DELIVERY DATE &amp; TIME
                  </span>

                  <span className="mt-1 block text-sm leading-5 text-text-primary">
                    {order.deliveryDate}, {order.deliveryTime}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Payment Summary */}
          <section className="flex flex-col gap-3 rounded-lg bg-background-accent p-4 shadow-[0px_1px_2px_#0000000c] sm:p-5">
            <h2 className="text-xs font-bold uppercase tracking-[0.6px] text-text-accent">
              Payment Summary
            </h2>

            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-text-secondary">
                Order Total
              </span>

              <span className="text-sm font-bold text-text-primary">
                {order.total}
              </span>
            </div>

            <div className="h-px w-full bg-border-light" />

            <div className="flex items-center justify-between gap-3">
              <span className="text-base font-bold text-text-accent">
                Total
              </span>

              <span className="text-lg font-bold text-text-accent sm:text-xl">
                {order.total}
              </span>
            </div>

            <div className="flex justify-end">
              <span className="text-xs text-text-secondary">
                Payment Method: {order.paymentMethod}
              </span>
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pb-3 pt-1 sm:flex-row sm:justify-center">
            {/* Back to Orders */}
            <button
              type="button"
              onClick={handleBack}
              className="flex min-h-11 flex-1 items-center justify-center rounded-lg border-2 border-primary-light bg-background-card px-3 text-xs font-bold uppercase tracking-[0.05em] text-primary-light transition-colors hover:bg-primary-light hover:text-primary-foreground"
            >
              Back to Orders
            </button>

            {/* Track Order */}
            <button
              type="button"
              onClick={handleTrackOrder}
              className="flex min-h-11 flex-1 items-center justify-center rounded-lg bg-primary-background px-3 text-xs font-bold uppercase tracking-[0.05em] text-primary-foreground shadow-[0px_1px_2px_#0000000c] transition-colors hover:opacity-90"
            >
              Track Order
            </button>
          </div>
        </div>
      </main>

      {/* Existing System Customer Navbar */}
      <div className="fixed bottom-0 left-0 z-50 w-full">
        <CustomerNavbar />
      </div>
    </div>
  );
}

export default OrderDetails;