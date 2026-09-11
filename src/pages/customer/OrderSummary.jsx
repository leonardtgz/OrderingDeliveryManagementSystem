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
      <div className="w-full shrink-0">
        <Header />
      </div>

      {/* Main Content */}
      <main className="flex flex-1 overflow-y-auto pb-28">
        <div className="mx-auto flex w-full max-w-[650px] flex-1 flex-col gap-5 px-4 py-5 sm:px-6 sm:py-7">
          {/* Page Title */}
          <div className="flex flex-col gap-1">
            <h1 className="text-[23px] font-bold leading-[120%] tracking-[-0.02em] text-text-accent sm:text-[26px]">
              Order Summary
            </h1>

            <p className="text-xs leading-5 text-text-secondary sm:text-sm">
              Review your order before confirming.
            </p>
          </div>

          {/* Selected Products */}
          <section className="overflow-hidden rounded-lg border border-border-light bg-background-card shadow-card">
            <div className="border-b border-border-light bg-background-lightBlue px-4 py-3 sm:px-5">
              <h2 className="text-xs font-bold uppercase tracking-[0.6px] text-text-accent">
                Selected Products
              </h2>
            </div>

            <div className="bg-background-card">
              {items.map((item, index) => (
                <div
                  key={item.name}
                  className={`flex items-center justify-between gap-4 px-4 py-3.5 sm:px-5 ${
                    index < items.length - 1
                      ? "border-b border-border-light"
                      : ""
                  }`}
                >
                  <div className="flex min-w-0 flex-col">
                    <span className="break-words text-sm font-bold leading-5 text-text-primary">
                      {item.name}
                    </span>

                    <span className="mt-1 text-xs leading-5 text-text-secondary">
                      Quantity: {item.qty}
                    </span>
                  </div>

                  <span className="shrink-0 text-sm font-semibold text-text-primary">
                    PHP {(item.price * item.qty).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Delivery Details */}
          <section className="overflow-hidden rounded-lg border border-border-light bg-background-card shadow-card">
            <div className="flex items-center justify-between border-b border-border-light bg-background-lightBlue px-4 py-3 sm:px-5">
              <h2 className="text-xs font-bold uppercase tracking-[0.6px] text-text-accent">
                Delivery Details
              </h2>

              <button
                type="button"
                onClick={handleEditOrder}
                aria-label="Edit delivery details"
                className="flex h-8 w-8 items-center justify-center rounded-md text-text-accent transition-colors hover:bg-background-card"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 16H3.425L13.2 6.225L11.775 4.8L2 14.575V16ZM0 18V13.75L13.2 0.575C13.4 0.391667 13.6208 0.25 13.8625 0.15C14.1042 0.05 14.3583 0 14.625 0C14.8917 0 15.15 0.05 15.4 0.15C15.65 0.25 15.8667 0.4 16.05 0.6L17.425 2C17.625 2.18333 17.7708 2.4 17.8625 2.65C17.7708 2.9 18 3.15 18 3.4C18 3.66667 17.9542 3.92083 17.8625 4.1625C17.7708 4.40417 17.625 4.625 17.425 4.825L4.25 18H0ZM16 3.4L14.6 2L16 3.4ZM12.475 5.525L11.775 4.8L13.2 6.225L12.475 5.525Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>

            <div className="flex flex-col gap-4 bg-background-card p-4 sm:p-5">
              {/* Address */}
              <div className="flex items-start gap-3">
                <AddressIcon />

                <div className="min-w-0 flex-1">
                  <span className="block text-[10px] font-bold uppercase tracking-[0.6px] text-text-secondary">
                    Address
                  </span>

                  <span className="mt-1 block break-words text-sm leading-5 text-text-primary">
                    123 Sample St, Brgy. San Antonio, Pasig City
                  </span>
                </div>
              </div>

              <div className="h-px w-full bg-border-light" />

              {/* Date & Time */}
              <div className="flex items-start gap-3">
                <DateTimeIcon />

                <div className="min-w-0 flex-1">
                  <span className="block text-[10px] font-bold uppercase tracking-[0.6px] text-text-secondary">
                    Date &amp; Time
                  </span>

                  <span className="mt-1 block text-sm leading-5 text-text-primary">
                    Today, 2:00 PM - 4:00 PM
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Order Total */}
          <section className="rounded-lg border border-border-light bg-background-card p-4 shadow-card sm:p-5">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-text-secondary">
                  Subtotal
                </span>

                <span className="text-sm font-semibold text-text-primary">
                  PHP {subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-text-secondary">
                  Delivery Fee
                </span>

                <span className="text-sm font-semibold text-text-primary">
                  PHP {deliveryFee.toFixed(2)}
                </span>
              </div>

              <div className="my-1 h-px w-full bg-border-light" />

              <div className="flex items-center justify-between gap-3">
                <span className="text-base font-bold text-text-primary">
                  Total
                </span>

                <span className="text-xl font-bold text-text-accent">
                  PHP {total.toFixed(2)}
                </span>
              </div>
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex w-full flex-col gap-2.5 pt-1 sm:flex-row">
            <button
              type="button"
              onClick={handleEditOrder}
              className="flex h-10 flex-1 items-center justify-center rounded-lg border-2 border-primary-light bg-background-card px-3 text-xs font-bold uppercase tracking-[0.6px] text-primary-light transition-colors hover:bg-primary-light hover:text-primary-foreground"
            >
              Edit Order
            </button>

            <button
              type="button"
              onClick={handleConfirmOrder}
              className="flex h-10 flex-1 items-center justify-center rounded-lg bg-button-background px-3 text-xs font-bold uppercase tracking-[0.6px] text-button-text shadow-card transition-colors hover:bg-button-hover"
            >
              Confirm Order
            </button>
          </div>
        </div>
      </main>

      {/* Customer Navbar */}
      <div className="w-full shrink-0">
        <CustomerNavbar />
      </div>
    </div>
  );
}

export default OrderSummary;