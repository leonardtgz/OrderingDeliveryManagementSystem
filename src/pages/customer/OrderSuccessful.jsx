import React from "react";
import { Link, useLocation } from "react-router-dom";
import Header from "../../components/Header/Header";
import CustomerNavbar from "../../components/customer/CustomerNavbar";

function CheckIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="24"
        cy="24"
        r="22"
        stroke="currentColor"
        strokeWidth="3"
        className="text-text-accent"
      />
      <path
        d="M14 24L21 31L34 17"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-text-accent"
      />
    </svg>
  );
}

function AddressIcon() {
  return (
    <svg
      width="16"
      height="20"
      viewBox="0 0 16 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mt-0.5 shrink-0 text-text-accent"
    >
      <path
        d="M8 0C3.582 0 0 3.582 0 8C0 13.5 8 24 8 24C8 24 16 13.5 16 8C16 3.582 12.418 0 8 0ZM8 11.5C6.067 11.5 4.5 9.933 4.5 8C4.5 6.067 6.067 4.5 8 4.5C9.933 4.5 11.5 6.067 11.5 8C11.5 9.933 9.933 11.5 8 11.5Z"
        fill="currentColor"
      />
      <circle
        cx="8"
        cy="8"
        r="2"
        fill="currentColor"
      />
    </svg>
  );
}

function DateTimeIcon() {
  return (
    <svg
      width="18"
      height="20"
      viewBox="0 0 18 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mt-0.5 shrink-0 text-text-accent"
    >
      <path
        d="M2 24C1.45 24 0.979167 23.8042 0.5875 23.4125C0.195833 23.0208 0 22.55 0 22V8C0 7.45 0.195833 6.97917 0.5875 6.5875C0.979167 6.19583 1.45 6 2 6H3V4H5V6H13V4H15V6H16C16.55 6 17.0208 6.19583 17.4125 6.5875C17.8042 6.97917 18 7.45 18 8V22C18 22.55 17.8042 23.0208 17.4125 23.4125 17.0208 23.8042 16.55 24 16 24H2ZM2 22H16V12H2V22ZM2 10H16V8H2V10Z"
        fill="currentColor"
      />
    </svg>
  );
}

function OrderSuccessful() {
  const location = useLocation();

  const order = location.state?.order || {};

  const orderNumber =
    order.orderNumber || order.id || "#ORD-99382";

  const products = order.products || [];

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
      <main className="flex-1 bg-background-main px-4 py-6 pb-[150px] sm:px-6 md:px-10">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center">

          {/* Success Icon */}
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#BFEAF5]">
            <CheckIcon />
          </div>

          {/* Title */}
          <div className="mt-5 text-center">
            <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">
              Order Successful
            </h1>

            <p className="mt-2 text-sm text-text-secondary sm:text-base">
              Your order has been placed successfully.
            </p>
          </div>

          {/* Order Summary Card */}
          <section className="mt-8 w-full max-w-[600px] overflow-hidden rounded-xl border border-border-primary bg-[#BFEAF5] shadow-sm">

            {/* Order Number */}
            <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
              <span className="text-xs font-bold uppercase tracking-[0.6px] text-text-secondary">
                Order Number
              </span>

              <span className="text-sm font-bold text-text-primary sm:text-base">
                {orderNumber}
              </span>
            </div>

            {/* Divider */}
            <div className="mx-5 h-px bg-gray-400 sm:mx-6" />

            {/* Order Summary */}
            <div className="px-5 py-5 sm:px-6">
              <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.6px] text-text-secondary">
                Order Summary
              </h2>

              {products.length > 0 ? (
                <div className="flex flex-col gap-4">
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
                        className="flex items-start justify-between gap-6"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="break-words text-sm font-semibold leading-5 text-text-primary">
                            {product.name}
                          </p>

                          <p className="mt-1 text-xs text-text-secondary">
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
              ) : (
                <p className="text-sm text-text-secondary">
                  Your order details are being processed.
                </p>
              )}
            </div>

            {/* Divider */}
            <div className="mx-5 h-px bg-gray-400 sm:mx-6" />

            {/* Delivery Information */}
            <div className="flex flex-col gap-4 px-5 py-5 sm:px-6">

              {/* Address */}
              <div className="flex items-start gap-3">
                <AddressIcon />

                <div className="min-w-0 flex-1">
                  <span className="block text-xs font-bold uppercase tracking-[0.6px] text-text-secondary">
                    Address
                  </span>

                  <span className="mt-1 block break-words text-sm leading-5 text-text-primary">
                    {deliveryAddress}
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px w-full bg-gray-400" />

              {/* Date & Time */}
              <div className="flex items-start gap-3">
                <DateTimeIcon />

                <div className="min-w-0 flex-1">
                  <span className="block text-xs font-bold uppercase tracking-[0.6px] text-text-secondary">
                    Date &amp; Time
                  </span>

                  <span className="mt-1 block text-sm leading-5 text-text-primary">
                    {deliverySchedule}
                  </span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="mx-5 h-px bg-gray-400 sm:mx-6" />

            {/* Total */}
            <div className="flex items-center justify-between gap-4 px-5 py-5 sm:px-6">
              <span className="text-sm font-bold uppercase tracking-[0.6px] text-text-primary">
                Total
              </span>

              <span className="text-xl font-bold text-text-primary">
                ₱{Number(total).toFixed(2)}
              </span>
            </div>
          </section>

          {/* Actions */}
          <div className="mt-6 flex w-full max-w-[600px] flex-col gap-3 sm:flex-row">

            {/* Track Order */}
            <Link
              to="/customer/orders"
              className="flex min-h-11 flex-1 items-center justify-center rounded-lg bg-[#238FA3] px-6 py-3 text-xs font-bold uppercase tracking-[0.6px] !text-white shadow-sm transition hover:bg-[#1D7D8F]"
            >
              Track Order
            </Link>

            {/* Back to Home */}
            <Link
              to="/customer/home"
              className="flex min-h-11 flex-1 items-center justify-center rounded-lg border border-border-secondary bg-background-card px-6 py-3 text-xs font-bold uppercase tracking-[0.6px] text-text-accent transition hover:bg-background-lightBlue"
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