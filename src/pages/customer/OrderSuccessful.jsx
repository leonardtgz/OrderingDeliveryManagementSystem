import React from "react";
import { Link, useLocation } from "react-router-dom";
import Header from "../../components/Header/Header";
import CustomerNavbar from "../../components/customer/CustomerNavbar";

function CheckIcon() {
  return (
    <svg
      width="42"
      height="42"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-text-accent"
    >
      <circle
        cx="24"
        cy="24"
        r="21"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        d="M14 24L21 31L34 17"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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

function OrderSuccessful() {
  const location = useLocation();

  const order = location.state?.order || {};

  const orderNumber =
    order.orderNumber || order.id || "#ORD-99382";

  const products = order.products || [
    {
      id: "round-purified-water",
      name: "Round Purified Water",
      quantity: 2,
      price: 80.0,
    },
    {
      id: "slim-purified-water",
      name: "Slim Purified Water",
      quantity: 1,
      price: 250.0,
    },
  ];

  const deliveryAddress =
    order.deliveryAddress ||
    "123 Sample St, Brgy. San Antonio, Pasig City";

  const deliverySchedule =
    order.deliverySchedule ||
    "Today, 2:00 PM - 4:00 PM";

  const total =
    order.total ??
    products.reduce((sum, product) => {
      const price = Number(product.price || 0);
      const quantity = Number(product.quantity || 1);

      return sum + price * quantity;
    }, 0);

  return (
    <div className="flex min-h-screen flex-col bg-background-main">
      {/* Header */}
      <div className="w-full shrink-0">
        <Header />
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background-main px-4 pb-[150px] pt-6 sm:px-6 sm:pt-8 md:px-10">
        <div className="mx-auto flex w-full max-w-[700px] flex-col items-center">
          {/* Success Icon */}
          <div className="flex h-[76px] w-[76px] items-center justify-center rounded-full bg-background-lightBlue shadow-sm">
            <CheckIcon />
          </div>

          {/* Success Message */}
          <div className="mt-4 text-center">
            <h1 className="text-2xl font-bold leading-tight tracking-[-0.02em] text-text-primary sm:text-3xl">
              Order Successful
            </h1>

            <p className="mt-1.5 text-xs leading-5 text-text-secondary sm:text-sm">
              Your order has been placed successfully.
            </p>
          </div>

          {/* Order Card */}
          <section className="mt-6 w-full overflow-hidden rounded-xl border border-border-secondary bg-background-card shadow-card">
            {/* Order Number */}
            <div className="flex items-center justify-between gap-4 bg-background-lightBlue px-4 py-3 sm:px-5">
              <div className="flex min-w-0 flex-col">
                <span className="text-[10px] font-bold uppercase tracking-[0.6px] text-text-secondary">
                  Order Number
                </span>

                <span className="mt-0.5 text-sm font-bold text-text-primary">
                  {orderNumber}
                </span>
              </div>

              <div className="flex h-7 shrink-0 items-center rounded-full bg-background-card px-2.5">
                <span className="text-[9px] font-bold uppercase tracking-[0.5px] text-text-accent">
                  Confirmed
                </span>
              </div>
            </div>

            {/* Order Summary */}
            <div className="px-4 py-4 sm:px-5 sm:py-5">
              <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.6px] text-text-accent">
                Order Summary
              </h2>

              <div className="flex flex-col">
                {products.map((product, index) => {
                  const quantity = Number(product.quantity || 1);
                  const price = Number(product.price || 0);

                  const itemTotal =
                    product.total !== undefined
                      ? Number(product.total)
                      : price * quantity;

                  return (
                    <div
                      key={product.id || index}
                      className={`flex items-start justify-between gap-4 py-2.5 ${
                        index < products.length - 1
                          ? "border-b border-border-light"
                          : ""
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="break-words text-sm font-semibold leading-5 text-text-primary">
                          {product.name}
                        </p>

                        <p className="mt-0.5 text-xs text-text-secondary">
                          Quantity: {quantity}
                        </p>
                      </div>

                      <span className="shrink-0 whitespace-nowrap text-sm font-bold text-text-primary">
                        ₱{itemTotal.toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Delivery Information */}
            <div className="border-t border-border-light bg-background-main px-4 py-4 sm:px-5 sm:py-5">
              <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.6px] text-text-accent">
                Delivery Information
              </h2>

              <div className="flex flex-col">
                {/* Address */}
                <div className="flex items-start gap-3 py-2">
                  <AddressIcon />

                  <div className="min-w-0 flex-1">
                    <span className="block text-[10px] font-bold uppercase tracking-[0.5px] text-text-secondary">
                      Address
                    </span>

                    <span className="mt-1 block break-words text-sm leading-5 text-text-primary">
                      {deliveryAddress}
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div className="my-2 h-px w-full bg-border-light" />

                {/* Date & Time */}
                <div className="flex items-start gap-3 py-2">
                  <DateTimeIcon />

                  <div className="min-w-0 flex-1">
                    <span className="block text-[10px] font-bold uppercase tracking-[0.5px] text-text-secondary">
                      Date &amp; Time
                    </span>

                    <span className="mt-1 block text-sm leading-5 text-text-primary">
                      {deliverySchedule}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between gap-4 border-t border-border-light px-4 py-4 sm:px-5">
              <span className="text-xs font-bold uppercase tracking-[0.6px] text-text-secondary">
                Total
              </span>

              <span className="text-lg font-bold text-text-accent sm:text-xl">
                ₱{Number(total).toFixed(2)}
              </span>
            </div>
          </section>

          {/* Actions */}
          <div className="mt-5 flex w-full flex-col gap-2.5 sm:flex-row">
            {/* Track Order - Same background, white text */}
            <Link
              to="/customer/orders"
              className="flex min-h-10 flex-1 items-center justify-center rounded-lg bg-primary-background px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.6px] !text-white shadow-sm transition-all hover:opacity-90"
            >
              Track Order
            </Link>

            {/* Back to Home - White background */}
            <Link
              to="/customer/home"
              className="flex min-h-10 flex-1 items-center justify-center rounded-lg border border-primary-light bg-background-card px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.6px] text-primary-light transition-all hover:bg-background-lightBlue"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>

      {/* Customer Navbar */}
      <div className="fixed bottom-0 left-0 z-50 w-full">
        <CustomerNavbar />
      </div>
    </div>
  );
}

export default OrderSuccessful;