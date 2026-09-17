import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  CheckCircle2,
  CalendarDays,
  MapPin,
} from "lucide-react";

import Header from "../../components/Header/Header";
import CustomerNavbar from "../../components/customer/CustomerNavbar";

import { getCurrentOrder } from "../../utils/orderStorage";

const DEFAULT_CUSTOMER = {
  fullName: "Maria Santos",
  contactNumber: "0917-555-0192",
  deliveryAddress: [
    "Block 4, Lot 12, Phase 2",
    "Sunnyvale Subdivision",
    "Brgy. San Jose, Antipolo",
  ],
};

function OrderSuccessful() {
  const location = useLocation();

  const order =
    location.state?.order ||
    getCurrentOrder() ||
    {};

  // ============================================================
  // CUSTOMER
  // ============================================================

  const customerName =
    order.customerName ||
    DEFAULT_CUSTOMER.fullName;

  const contactNumber =
    order.contactNumber ||
    DEFAULT_CUSTOMER.contactNumber;

  // ============================================================
  // ORDER NUMBER
  // ============================================================

  const orderNumber =
    order.orderNumber ||
    order.id ||
    "#ORD-99382";

  // ============================================================
  // PRODUCTS
  // ============================================================

  const products = Array.isArray(order.products)
    ? order.products
    : [];

  // ============================================================
  // ADDRESS
  // ============================================================

  const deliveryAddress =
    order.deliveryAddressLines ||
    DEFAULT_CUSTOMER.deliveryAddress;

  const formattedAddress = Array.isArray(
    deliveryAddress,
  )
    ? deliveryAddress
    : [deliveryAddress];

  // ============================================================
  // DELIVERY
  // ============================================================

  const deliverySchedule =
    order.deliverySchedule ||
    "Today";

  // ============================================================
  // TOTAL
  // ============================================================

  const subtotal = products.reduce(
    (sum, product) =>
      sum +
      Number(product.price || 0) *
        Number(product.quantity || 0),
    0,
  );

  const deliveryFee =
    order.deliveryFee ?? 20;

  const total =
    order.total ??
    subtotal + deliveryFee;

  return (
    <div className="flex min-h-screen flex-col bg-background-main">
      <div className="w-full shrink-0">
        <Header />
      </div>

      <main className="flex-1 overflow-y-auto bg-background-main px-4 pb-[150px] pt-6 sm:px-6 sm:pt-8 md:px-10">
        <div className="mx-auto flex w-full max-w-[700px] flex-col items-center">

          {/* =====================================================
              SUCCESS ICON
          ====================================================== */}

          <div className="flex h-[76px] w-[76px] items-center justify-center rounded-full bg-background-lightBlue shadow-sm">
            <CheckCircle2 className="h-11 w-11 text-text-accent" />
          </div>

          {/* =====================================================
              SUCCESS MESSAGE
          ====================================================== */}

          <div className="mt-4 text-center">
            <h1 className="text-2xl font-bold leading-tight tracking-[-0.02em] text-text-primary sm:text-3xl">
              Order Successful
            </h1>

            <p className="mt-1.5 text-xs leading-5 text-text-secondary sm:text-sm">
              Your order has been placed successfully.
            </p>
          </div>

          {/* =====================================================
              ORDER CARD
          ====================================================== */}

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

            {/* =================================================
                CUSTOMER INFORMATION
            ================================================== */}

            <div className="border-b border-border-light px-4 py-4 sm:px-5">
              <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.6px] text-text-accent">
                Customer Information
              </h2>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs text-text-secondary">
                    Name
                  </span>

                  <span className="text-sm font-semibold text-text-primary">
                    {customerName}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs text-text-secondary">
                    Contact
                  </span>

                  <span className="text-sm font-semibold text-text-primary">
                    {contactNumber}
                  </span>
                </div>
              </div>
            </div>

            {/* =================================================
                ORDER SUMMARY
            ================================================== */}

            <div className="px-4 py-4 sm:px-5 sm:py-5">
              <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.6px] text-text-accent">
                Order Summary
              </h2>

              <div className="flex flex-col">
                {products.length === 0 ? (
                  <p className="text-sm text-text-secondary">
                    No products selected.
                  </p>
                ) : (
                  products.map((product, index) => {
                    const quantity =
                      Number(product.quantity) || 0;

                    const price =
                      Number(product.price) || 0;

                    const itemTotal =
                      quantity * price;

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

                          <p className="text-xs text-text-secondary">
                            ₱{price.toFixed(2)} each
                          </p>
                        </div>

                        <span className="shrink-0 whitespace-nowrap text-sm font-bold text-text-primary">
                          ₱{itemTotal.toFixed(2)}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* =================================================
                DELIVERY INFORMATION
            ================================================== */}

            <div className="border-t border-border-light bg-background-main px-4 py-4 sm:px-5 sm:py-5">
              <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.6px] text-text-accent">
                Delivery Information
              </h2>

              <div className="flex flex-col">

                {/* Address */}

                <div className="flex items-start gap-3 py-2">
                  <MapPin className="mt-0.5 h-[19px] w-[19px] shrink-0 text-text-accent" />

                  <div className="min-w-0 flex-1">
                    <span className="block text-[10px] font-bold uppercase tracking-[0.5px] text-text-secondary">
                      Delivery Address
                    </span>

                    <div className="mt-1 flex flex-col text-sm leading-5 text-text-primary">
                      {formattedAddress.map(
                        (line, index) => (
                          <span
                            key={`${line}-${index}`}
                          >
                            {line}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                </div>

                <div className="my-2 h-px w-full bg-border-light" />

                {/* Date & Time */}

                <div className="flex items-start gap-3 py-2">
                  <CalendarDays className="mt-0.5 h-[19px] w-[19px] shrink-0 text-text-accent" />

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

            {/* =================================================
                TOTAL
            ================================================== */}

            <div className="border-t border-border-light px-4 py-4 sm:px-5">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-bold uppercase tracking-[0.6px] text-text-secondary">
                  Subtotal
                </span>

                <span className="text-sm font-semibold text-text-primary">
                  ₱{subtotal.toFixed(2)}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between gap-4">
                <span className="text-xs font-bold uppercase tracking-[0.6px] text-text-secondary">
                  Delivery Fee
                </span>

                <span className="text-sm font-semibold text-text-primary">
                  ₱{deliveryFee.toFixed(2)}
                </span>
              </div>

              <div className="my-3 h-px w-full bg-border-light" />

              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-bold uppercase tracking-[0.6px] text-text-secondary">
                  Total
                </span>

                <span className="text-lg font-bold text-text-accent sm:text-xl">
                  ₱{Number(total).toFixed(2)}
                </span>
              </div>
            </div>
          </section>

          {/* =====================================================
              ACTIONS
          ====================================================== */}

          <div className="mt-5 flex w-full flex-col gap-2.5 sm:flex-row">
            <Link
              to="/customer/track"
              className="flex min-h-10 flex-1 items-center justify-center rounded-lg bg-primary-background px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.6px] !text-white shadow-sm transition-all hover:opacity-90"
            >
              Track Order
            </Link>

            <Link
              to="/customer/home"
              className="flex min-h-10 flex-1 items-center justify-center rounded-lg border border-primary-light bg-background-card px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.6px] text-primary-light transition-all hover:bg-background-lightBlue"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 z-50 w-full">
        <CustomerNavbar />
      </div>
    </div>
  );
}

export default OrderSuccessful;