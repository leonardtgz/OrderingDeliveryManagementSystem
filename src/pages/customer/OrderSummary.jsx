import React from "react";

import { useNavigate } from "react-router-dom";

import Header from "../../components/Header/Header";

import CustomerNavbar from "../../components/customer/CustomerNavbar";

// Address / Location Icon
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

// Date & Time / Calendar Icon
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

const items = [
  {
    name: "Round Purified Water",
    qty: 2,
    price: 80.0,
  },
  {
    name: "Slim Purified Water",
    qty: 1,
    price: 250.0,
  },
];

function OrderSummary() {
  const navigate = useNavigate();

  const subtotal = items.reduce(
    (total, item) => total + item.qty * item.price,
    0
  );

  const deliveryFee = 20.0;
  const total = subtotal + deliveryFee;

  const handleEditOrder = () => {
    navigate("/customer/edit-order");
  };

  const handleConfirmOrder = () => {
    const order = {
      orderNumber: "#ORD-99382",
      products: items.map((item) => ({
        id: item.name,
        name: item.name,
        quantity: item.qty,
        price: item.price,
        total: item.qty * item.price,
      })),
      deliveryAddress:
        "123 Sample St, Brgy. San Antonio, Pasig City",
      deliverySchedule: "Today, 2:00 PM - 4:00 PM",
      total,
    };

    navigate("/customer/order-successful", {
      state: { order },
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background-main">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex flex-1 overflow-y-auto pb-28">
        <div className="mx-auto flex w-full max-w-[600px] flex-1 flex-col gap-5 px-4 py-6 sm:px-6 sm:py-8">
          {/* Page Title */}
          <div className="mb-1">
            <h1 className="text-[24px] font-bold leading-[120%] tracking-[-0.02em] text-text-accent sm:text-[26px]">
              Order Summary
            </h1>

            <p className="mt-1 text-sm text-text-secondary">
              Review your order before confirming.
            </p>
          </div>

          {/* Selected Products */}
          <section className="overflow-hidden rounded-xl border border-border-primary bg-white shadow-md">
            <div className="border-b border-border-primary bg-primary-lighter px-5 py-3">
              <h2 className="text-xs font-bold uppercase tracking-[0.05em] text-text-accent">
                Selected Products
              </h2>
            </div>

            <div className="bg-white">
              {items.map((item, index) => (
                <div
                  key={item.name}
                  className={`flex items-center justify-between gap-4 px-5 py-4 ${
                    index < items.length - 1
                      ? "border-b border-border-primary"
                      : ""
                  }`}
                >
                  <div className="flex min-w-0 flex-col">
                    <span className="text-sm font-bold leading-[140%] text-text-primary">
                      {item.name}
                    </span>

                    <span className="mt-1 text-xs leading-[140%] text-text-secondary">
                      Qty: {item.qty}
                    </span>
                  </div>

                  <span className="shrink-0 text-xs font-semibold leading-[140%] text-text-primary sm:text-sm">
                    PHP {(item.price * item.qty).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Delivery Details */}
          <section className="overflow-hidden rounded-xl border border-border-primary bg-white shadow-md">
            <div className="flex items-center justify-between border-b border-border-primary bg-primary-lighter px-5 py-3">
              <h2 className="text-xs font-bold uppercase tracking-[0.05em] text-text-accent">
                Delivery Details
              </h2>

              <button
                type="button"
                onClick={handleEditOrder}
                aria-label="Edit delivery details"
                className="rounded p-1 text-text-accent transition-opacity hover:opacity-70"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 16H3.425L13.2 6.225L11.775 4.8L2 14.575V16ZM0 18V13.75L13.2 0.575C13.4 0.391667 13.6208 0.25 13.8625 0.15C14.1042 0.05 14.3583 0 14.625 0C14.8917 0 15.15 0.05 15.4 0.15C15.65 0.25 15.8667 0.4 16.05 0.6L17.425 2C17.625 2.18333 17.7708 2.4 17.8625 2.65C17.9542 2.9 18 3.15 18 3.4C18 3.66667 17.9542 3.92083 17.8625 4.1625C17.7708 4.40417 17.625 4.625 17.425 4.825L4.25 18H0ZM16 3.4L14.6 2L16 3.4ZM12.475 5.525L11.775 4.8L13.2 6.225L12.475 5.525Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>

            <div className="flex flex-col gap-4 bg-white p-5">
              {/* Address */}
              <div className="flex items-start gap-3">
                <AddressIcon />

                <div className="min-w-0 flex-1">
                  <span className="block text-xs font-bold uppercase tracking-[0.05em] text-text-secondary">
                    Address
                  </span>

                  <span className="mt-1 block break-words text-sm leading-[140%] text-text-primary">
                    123 Sample St, Brgy. San Antonio, Pasig City
                  </span>
                </div>
              </div>

              <div className="h-px w-full bg-border-primary" />

              {/* Date & Time */}
              <div className="flex items-start gap-3">
                <DateTimeIcon />

                <div className="min-w-0 flex-1">
                  <span className="block text-xs font-bold uppercase tracking-[0.05em] text-text-secondary">
                    Date &amp; Time
                  </span>

                  <span className="mt-1 block text-sm leading-[140%] text-text-primary">
                    Today, 2:00 PM - 4:00 PM
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Payment Summary */}
          <section className="flex flex-col gap-3 rounded-xl border border-border-primary bg-white p-5 shadow-md">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-text-secondary">
                Subtotal
              </span>

              <span className="text-xs font-medium text-text-primary sm:text-sm">
                PHP {subtotal.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-bold text-text-secondary">
                Delivery Fee
              </span>

              <span className="text-xs font-medium text-text-primary sm:text-sm">
                PHP {deliveryFee.toFixed(2)}
              </span>
            </div>

            <div className="py-1">
              <div className="h-px w-full bg-border-primary" />
            </div>

            {/* Smaller Total */}
            <div className="flex items-center justify-between gap-3">
              <span className="text-base font-bold leading-[140%] text-text-accent sm:text-lg">
                Total
              </span>

              <span className="text-lg font-bold leading-[140%] text-text-accent sm:text-xl">
                PHP {total.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-end">
              <span className="text-xs text-text-secondary">
                Payment Method: Cash on Delivery
              </span>
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pb-3 pt-1 sm:flex-row sm:justify-center">
            {/* Edit Order */}
            <button
              type="button"
              onClick={handleEditOrder}
              className="flex min-h-11 flex-1 items-center justify-center rounded-lg border-2 border-[#238FA3] bg-white px-3 text-xs font-bold uppercase tracking-[0.05em] text-[#238FA3] shadow-md transition-all hover:bg-[#238FA3] hover:text-white hover:shadow-lg"
            >
              Edit Order
            </button>

            {/* Confirm Order */}
            <button
              type="button"
              onClick={handleConfirmOrder}
              className="flex min-h-11 flex-1 items-center justify-center rounded-lg border-2 border-[#238FA3] bg-[#238FA3] px-3 text-xs font-bold uppercase tracking-[0.05em] !text-white shadow-md transition-all hover:bg-[#1D7D8F] hover:border-[#1D7D8F] hover:shadow-lg"
            >
              Confirm Order
            </button>
          </div>
        </div>
      </main>

      {/* Customer Navbar */}
      <CustomerNavbar />
    </div>
  );
}

export default OrderSummary;