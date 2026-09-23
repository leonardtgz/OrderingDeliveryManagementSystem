import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Header from "../../components/Header/Header";
import CustomerNavbar from "../../components/customer/CustomerNavbar";

import {
  getCurrentOrder,
  saveCurrentOrder,
} from "../../utils/orderStorage";

const TIME_SLOTS = [
  "9:00 AM - 12:00 PM",
  "12:00 PM - 3:00 PM",
  "3:00 PM - 6:00 PM",
  "6:00 PM - 9:00 PM",
];

const CUSTOMER = {
  fullName: "Maria Santos",
  contactNumber: "0917-555-0192",
  deliveryAddress: [
    "Block 4, Lot 12, Phase 2",
    "Sunnyvale Subdivision",
    "Brgy. San Jose, Antipolo",
  ],
};

function EditOrder() {
  const navigate = useNavigate();
  const location = useLocation();

  const existingOrder =
    location.state?.order || getCurrentOrder();

  const products = Array.isArray(existingOrder?.products)
    ? existingOrder.products
    : [];

  const [contactNumber, setContactNumber] = useState(
    existingOrder?.contactNumber || CUSTOMER.contactNumber,
  );

  const [deliveryDate, setDeliveryDate] = useState(
    existingOrder?.deliveryDate || "",
  );

  const [deliveryTime, setDeliveryTime] = useState(
    existingOrder?.deliveryTime || "",
  );

  const [notes, setNotes] = useState(
    existingOrder?.notes || "",
  );

  // ============================================================
  // CALCULATE ORDER TOTALS
  // ============================================================

  const subtotal = products.reduce(
    (sum, product) =>
      sum +
      Number(product.price || 0) *
        Number(product.quantity || 0),
    0,
  );

  const deliveryFee = existingOrder?.deliveryFee ?? 20;

  const total = subtotal + deliveryFee;

  // ============================================================
  // CONTINUE TO ORDER SUMMARY
  // ============================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    const orderData = {
      ...existingOrder,

      id:
        existingOrder?.id ||
        `ORD-${Date.now()}`,

      customerName:
        existingOrder?.customerName ||
        CUSTOMER.fullName,

      contactNumber,

      products,

      deliveryAddress:
        existingOrder?.deliveryAddress ||
        CUSTOMER.deliveryAddress.join(", "),

      deliveryAddressLines:
        existingOrder?.deliveryAddressLines ||
        CUSTOMER.deliveryAddress,

      deliveryDate,

      deliveryTime,

      deliverySchedule: deliveryDate
        ? `${deliveryDate}, ${deliveryTime}`
        : `Today, ${deliveryTime}`,

      notes,

      subtotal,
      deliveryFee,
      total,

      status:
        existingOrder?.status ||
        "Pending",
    };

    saveCurrentOrder(orderData);

    navigate("/customer/order-summary", {
      state: {
        order: orderData,
      },
    });
  };

  const handleBack = () => {
    navigate("/customer/products");
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background-main">
      <div className="w-full shrink-0">
        <Header />
      </div>

      <main className="flex w-full flex-1 overflow-y-auto pb-24">
        <div className="mx-auto flex w-full max-w-[560px] flex-1 flex-col px-4 py-5 sm:px-6 sm:py-7">

          <div className="mb-5">
            <h1 className="text-[23px] font-bold leading-[120%] tracking-[-0.02em] text-text-accent sm:text-[26px]">
              Edit Order
            </h1>

            <p className="mt-1 text-xs leading-5 text-text-secondary sm:text-sm">
              Update your delivery information before continuing.
            </p>
          </div>

          {/* =====================================================
              SELECTED PRODUCTS
          ====================================================== */}

          <section className="mb-5 rounded-lg border border-border-light bg-background-card p-4 shadow-card sm:p-5">
            <div className="mb-4">
              <h2 className="text-xs font-bold uppercase tracking-[0.6px] text-text-accent">
                Selected Products
              </h2>
            </div>

            <div className="flex flex-col">
              {products.length === 0 ? (
                <p className="text-sm text-text-secondary">
                  No products selected.
                </p>
              ) : (
                products.map((product, index) => (
                  <div
                    key={product.id || index}
                    className={`flex items-center justify-between gap-4 py-3 ${
                      index < products.length - 1
                        ? "border-b border-border-light"
                        : ""
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="break-words text-sm font-semibold text-text-primary">
                        {product.name}
                      </p>

                      <p className="mt-1 text-xs text-text-secondary">
                        Quantity: {product.quantity}
                      </p>

                      <p className="text-xs text-text-secondary">
                        ₱{Number(product.price).toFixed(2)} each
                      </p>
                    </div>

                    <span className="shrink-0 text-sm font-bold text-text-primary">
                      ₱
                      {(
                        Number(product.price || 0) *
                        Number(product.quantity || 0)
                      ).toFixed(2)}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border-light pt-4">
              <span className="text-sm font-semibold text-text-primary">
                Subtotal
              </span>

              <span className="text-sm font-bold text-text-accent">
                ₱{subtotal.toFixed(2)}
              </span>
            </div>
          </section>

          {/* =====================================================
              CUSTOMER INFORMATION
          ====================================================== */}

          <form
            onSubmit={handleSubmit}
            className="flex w-full flex-col gap-5"
          >
            <section className="rounded-lg border border-border-light bg-background-card p-4 shadow-card sm:p-5">
              <div className="mb-4">
                <h2 className="text-xs font-bold uppercase tracking-[0.6px] text-text-accent">
                  Customer Information
                </h2>
              </div>

              <div className="flex flex-col gap-4">

                {/* Full Name */}

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="fullName"
                    className="text-[10px] font-bold uppercase tracking-[0.6px] text-text-primary"
                  >
                    Full Name
                  </label>

                  <input
                    id="fullName"
                    type="text"
                    value={
                      existingOrder?.customerName ||
                      CUSTOMER.fullName
                    }
                    readOnly
                    className="h-10 w-full rounded-md border border-border-light bg-background-main px-3 text-sm text-text-secondary outline-none"
                  />
                </div>

                {/* Delivery Address */}

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="deliveryAddress"
                    className="text-[10px] font-bold uppercase tracking-[0.6px] text-text-primary"
                  >
                    Delivery Address
                  </label>

                  <textarea
                    id="deliveryAddress"
                    value={(
                      existingOrder?.deliveryAddressLines ||
                      CUSTOMER.deliveryAddress
                    ).join("\n")}
                    readOnly
                    rows={3}
                    className="w-full resize-none rounded-md border border-border-light bg-background-main px-3 py-2 text-sm leading-5 text-text-secondary outline-none"
                  />
                </div>

                {/* Contact Number */}

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="contactNumber"
                    className="text-[10px] font-bold uppercase tracking-[0.6px] text-text-primary"
                  >
                    Contact Number
                  </label>

                  <input
                    id="contactNumber"
                    type="tel"
                    value={contactNumber}
                    onChange={(e) =>
                      setContactNumber(e.target.value)
                    }
                    className="h-10 w-full rounded-md border border-border-light bg-background-card px-3 text-sm text-text-primary outline-none transition-colors focus:border-primary-background"
                  />
                </div>
              </div>
            </section>

            {/* =====================================================
                DELIVERY
            ====================================================== */}

            <section className="rounded-lg border border-border-light bg-background-lightBlue p-4 sm:p-5">
              <div className="mb-4">
                <h2 className="text-xs font-bold uppercase tracking-[0.6px] text-text-accent">
                  Preferred Delivery
                </h2>

                <p className="mt-0.5 text-[10px] leading-4 text-text-secondary">
                  Choose when you would like your order delivered.
                </p>
              </div>

              <div className="flex w-full flex-col gap-4 sm:flex-row">

                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <label
                    htmlFor="deliveryDate"
                    className="text-[10px] font-bold uppercase tracking-[0.6px] text-text-primary"
                  >
                    Preferred Delivery Date
                  </label>

                  <input
                    id="deliveryDate"
                    type="date"
                    value={deliveryDate}
                    onChange={(e) =>
                      setDeliveryDate(e.target.value)
                    }
                    className="h-10 w-full rounded-md border border-border-light bg-background-card px-3 text-sm text-text-primary outline-none transition-colors focus:border-primary-background"
                  />
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <label
                    htmlFor="deliveryTime"
                    className="text-[10px] font-bold uppercase tracking-[0.6px] text-text-primary"
                  >
                    Preferred Delivery Time
                  </label>

                  <select
                    id="deliveryTime"
                    value={deliveryTime}
                    onChange={(e) =>
                      setDeliveryTime(e.target.value)
                    }
                    className="h-10 w-full rounded-md border border-border-light bg-background-card px-3 text-sm text-text-primary outline-none transition-colors focus:border-primary-background"
                  >
                    <option value="" disabled>
                      Select Time
                    </option>

                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* =====================================================
                NOTES
            ====================================================== */}

            <section className="rounded-lg border border-border-light bg-background-card p-4 shadow-card sm:p-5">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="notes"
                  className="text-[10px] font-bold uppercase tracking-[0.6px] text-text-primary"
                >
                  Additional Notes
                </label>

                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) =>
                    setNotes(e.target.value)
                  }
                  placeholder="e.g. Leave with guard, near the gate..."
                  rows={3}
                  className="w-full resize-none rounded-md border border-border-light bg-background-card px-3 py-2 text-sm leading-5 text-text-primary outline-none transition-colors placeholder:text-text-secondary focus:border-primary-background"
                />
              </div>
            </section>

            {/* =====================================================
                TOTAL
            ====================================================== */}

            <section className="rounded-lg border border-border-light bg-background-card p-4 shadow-card sm:p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-text-primary">
                  Total
                </span>

                <span className="text-lg font-bold text-text-accent">
                  ₱{total.toFixed(2)}
                </span>
              </div>
            </section>

            {/* =====================================================
                BUTTONS
            ====================================================== */}

            <div className="flex w-full flex-col gap-3 pt-1 sm:flex-row sm:justify-end sm:gap-3">
              <button
                type="button"
                onClick={handleBack}
                className="flex h-11 w-full items-center justify-center rounded-lg border-2 border-primary-light bg-background-card px-4 text-xs font-bold uppercase tracking-[0.6px] text-primary-light shadow-card transition-colors hover:bg-primary-light hover:text-primary-foreground sm:h-11 sm:w-auto sm:min-w-[150px] sm:px-6"
              >
                Back
              </button>

              <button
                type="submit"
                disabled={products.length === 0}
                className="flex h-11 w-full items-center justify-center rounded-lg bg-button-background px-4 text-xs font-bold uppercase tracking-[0.6px] text-button-text shadow-card transition-colors hover:bg-button-hover disabled:cursor-not-allowed disabled:opacity-50 sm:h-11 sm:w-auto sm:min-w-[170px] sm:px-6"
              >
                Continue
              </button>
            </div>
          </form>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 z-50 w-full">
        <CustomerNavbar />
      </div>
    </div>
  );
}

export default EditOrder;