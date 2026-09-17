import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  MapPin,
  Pencil,
} from "lucide-react";

import Header from "../../components/Header/Header";
import CustomerNavbar from "../../components/customer/CustomerNavbar";

import {
  addOrder,
  getCurrentOrder,
  saveCurrentOrder,
} from "../../utils/orderStorage";

const DEFAULT_CUSTOMER = {
  fullName: "Maria Santos",
  contactNumber: "0917-555-0192",
  deliveryAddress: [
    "Block 4, Lot 12, Phase 2",
    "Sunnyvale Subdivision",
    "Brgy. San Jose, Antipolo",
  ],
};

function OrderSummary() {
  const navigate = useNavigate();
  const location = useLocation();

  const storedOrder = getCurrentOrder();

  const editedOrder =
    location.state?.order ||
    storedOrder ||
    {};

  // ============================================================
  // CUSTOMER
  // ============================================================

  const customerName =
    editedOrder.customerName ||
    DEFAULT_CUSTOMER.fullName;

  const contactNumber =
    editedOrder.contactNumber ||
    DEFAULT_CUSTOMER.contactNumber;

  // ============================================================
  // PRODUCTS
  // ============================================================

  const products = Array.isArray(
    editedOrder.products,
  )
    ? editedOrder.products
    : [];

  // ============================================================
  // ADDRESS
  // ============================================================

  const formattedAddress =
    Array.isArray(
      editedOrder.deliveryAddressLines,
    )
      ? editedOrder.deliveryAddressLines
      : Array.isArray(editedOrder.deliveryAddress)
        ? editedOrder.deliveryAddress
        : DEFAULT_CUSTOMER.deliveryAddress;

  // ============================================================
  // DELIVERY
  // ============================================================

  const deliveryDate =
    editedOrder.deliveryDate || "";

  const deliveryTime =
    editedOrder.deliveryTime || "";

  const deliverySchedule =
    editedOrder.deliverySchedule ||
    (deliveryDate
      ? `${deliveryDate}, ${deliveryTime}`
      : `Today, ${deliveryTime}`);

  // ============================================================
  // TOTALS
  // ============================================================

  const subtotal = products.reduce(
    (sum, product) =>
      sum +
      Number(product.price || 0) *
        Number(product.quantity || 0),
    0,
  );

  const deliveryFee =
    editedOrder.deliveryFee ?? 20;

  const total =
    subtotal + deliveryFee;

  // ============================================================
  // CREATE UPDATED ORDER
  // ============================================================

  const buildOrderData = () => {
    return {
      ...editedOrder,

      id:
        editedOrder.id ||
        `ORD-${Date.now()}`,

      customerName,

      contactNumber,

      // IMPORTANT:
      // Keep the exact product selection.
      products: products.map((product) => ({
        ...product,
        quantity: Number(product.quantity),
        price: Number(product.price),
        total:
          Number(product.quantity) *
          Number(product.price),
      })),

      product: products
        .map((product) => product.name)
        .join(", "),

      qty: products.reduce(
        (sum, product) =>
          sum +
          Number(product.quantity || 0),
        0,
      ),

      deliveryAddress:
        formattedAddress.join(", "),

      deliveryAddressLines:
        formattedAddress,

      deliveryDate:
        deliveryDate || "Today",

      deliveryTime,

      deliverySchedule,

      notes:
        editedOrder.notes || "",

      subtotal,

      deliveryFee,

      total,

      status:
        editedOrder.status ||
        "Pending",
    };
  };

  // ============================================================
  // EDIT ORDER
  // ============================================================

  const handleEditOrder = () => {
    const orderData = buildOrderData();

    saveCurrentOrder(orderData);

    navigate("/customer/edit-order", {
      state: {
        order: orderData,
      },
    });
  };

  // ============================================================
  // CONFIRM ORDER
  // ============================================================

  const handleConfirmOrder = () => {
    if (products.length === 0) {
      return;
    }

    const newOrder = {
      ...buildOrderData(),

      status: "Pending",

      createdAt:
        editedOrder.createdAt ||
        new Date().toISOString(),

      updatedAt:
        new Date().toISOString(),
    };

    // Save current order.
    saveCurrentOrder(newOrder);

    // Save to shared order list.
    addOrder(newOrder);

    navigate("/customer/order-successful", {
      state: {
        order: newOrder,
      },
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background-main">
      <div className="w-full shrink-0">
        <Header />
      </div>

      <main className="flex flex-1 overflow-y-auto pb-28">
        <div className="mx-auto flex w-full max-w-[650px] flex-1 flex-col gap-5 px-4 py-5 sm:px-6 sm:py-7">

          {/* =====================================================
              HEADER
          ====================================================== */}

          <div className="flex flex-col gap-1">
            <h1 className="text-[23px] font-bold leading-[120%] tracking-[-0.02em] text-text-accent sm:text-[26px]">
              Order Summary
            </h1>

            <p className="text-xs leading-5 text-text-secondary sm:text-sm">
              Review your order before confirming.
            </p>
          </div>

          {/* =====================================================
              CUSTOMER INFORMATION
          ====================================================== */}

          <section className="overflow-hidden rounded-lg border border-border-light bg-background-card shadow-card">
            <div className="border-b border-border-light bg-background-lightBlue px-4 py-3 sm:px-5">
              <h2 className="text-xs font-bold uppercase tracking-[0.6px] text-text-accent">
                Customer Information
              </h2>
            </div>

            <div className="flex flex-col gap-4 p-4 sm:p-5">
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-[0.6px] text-text-secondary">
                  Full Name
                </span>

                <span className="mt-1 block text-sm font-semibold text-text-primary">
                  {customerName}
                </span>
              </div>

              <div className="h-px w-full bg-border-light" />

              <div>
                <span className="block text-[10px] font-bold uppercase tracking-[0.6px] text-text-secondary">
                  Contact Number
                </span>

                <span className="mt-1 block text-sm font-semibold text-text-primary">
                  {contactNumber}
                </span>
              </div>
            </div>
          </section>

          {/* =====================================================
              SELECTED PRODUCTS
          ====================================================== */}

          <section className="overflow-hidden rounded-lg border border-border-light bg-background-card shadow-card">
            <div className="border-b border-border-light bg-background-lightBlue px-4 py-3 sm:px-5">
              <h2 className="text-xs font-bold uppercase tracking-[0.6px] text-text-accent">
                Selected Products
              </h2>
            </div>

            <div className="bg-background-card">
              {products.length === 0 ? (
                <div className="px-4 py-5 text-sm text-text-secondary sm:px-5">
                  No products selected.
                </div>
              ) : (
                products.map((item, index) => {
                  const quantity =
                    Number(item.quantity) || 0;

                  const price =
                    Number(item.price) || 0;

                  const itemTotal =
                    quantity * price;

                  return (
                    <div
                      key={item.id || item.name}
                      className={`flex items-center justify-between gap-4 px-4 py-3.5 sm:px-5 ${
                        index < products.length - 1
                          ? "border-b border-border-light"
                          : ""
                      }`}
                    >
                      <div className="flex min-w-0 flex-col">
                        <span className="break-words text-sm font-bold leading-5 text-text-primary">
                          {item.name}
                        </span>

                        <span className="mt-1 text-xs leading-5 text-text-secondary">
                          Quantity: {quantity}
                        </span>

                        <span className="text-xs leading-5 text-text-secondary">
                          ₱{price.toFixed(2)} each
                        </span>
                      </div>

                      <span className="shrink-0 text-sm font-semibold text-text-primary">
                        ₱{itemTotal.toFixed(2)}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* =====================================================
              DELIVERY DETAILS
          ====================================================== */}

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
                <Pencil className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-col gap-4 bg-background-card p-4 sm:p-5">

              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-[19px] w-[19px] shrink-0 text-text-accent" />

                <div className="min-w-0 flex-1">
                  <span className="block text-[10px] font-bold uppercase tracking-[0.6px] text-text-secondary">
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

              <div className="h-px w-full bg-border-light" />

              <div className="flex items-start gap-3">
                <CalendarDays className="mt-0.5 h-[19px] w-[19px] shrink-0 text-text-accent" />

                <div className="min-w-0 flex-1">
                  <span className="block text-[10px] font-bold uppercase tracking-[0.6px] text-text-secondary">
                    Date &amp; Time
                  </span>

                  <span className="mt-1 block text-sm leading-5 text-text-primary">
                    {deliverySchedule}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* =====================================================
              TOTAL
          ====================================================== */}

          <section className="rounded-lg border border-border-light bg-background-card p-4 shadow-card sm:p-5">
            <div className="flex flex-col gap-3">

              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-text-secondary">
                  Subtotal
                </span>

                <span className="text-sm font-semibold text-text-primary">
                  ₱{subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-text-secondary">
                  Delivery Fee
                </span>

                <span className="text-sm font-semibold text-text-primary">
                  ₱{deliveryFee.toFixed(2)}
                </span>
              </div>

              <div className="my-1 h-px w-full bg-border-light" />

              <div className="flex items-center justify-between gap-3">
                <span className="text-base font-bold text-text-primary">
                  Total
                </span>

                <span className="text-xl font-bold text-text-accent">
                  ₱{total.toFixed(2)}
                </span>
              </div>
            </div>
          </section>

          {/* =====================================================
              BUTTONS
          ====================================================== */}

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
              disabled={products.length === 0}
              className="flex h-10 flex-1 items-center justify-center rounded-lg bg-button-background px-3 text-xs font-bold uppercase tracking-[0.6px] text-button-text shadow-card transition-colors hover:bg-button-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              Confirm Order
            </button>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 z-50 w-full">
        <CustomerNavbar />
      </div>
    </div>
  );
}

export default OrderSummary;