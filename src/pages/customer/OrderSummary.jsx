import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  MapPin,
  Pencil,
} from "lucide-react";

import Header from "../../components/Header/Header";
import CustomerNavbar from "../../components/customer/CustomerNavbar";
import CustomerFooter from "../../components/customer/CustomerFooter";
import OrderStepper from "../../components/customer/OrderStepper";

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

  const editedOrder =
    location.state?.order ||
    getCurrentOrder() ||
    {};

  const customerName =
    editedOrder.customerName ||
    DEFAULT_CUSTOMER.fullName;

  const contactNumber =
    editedOrder.contactNumber ||
    DEFAULT_CUSTOMER.contactNumber;

  const products = Array.isArray(
    editedOrder.products,
  )
    ? editedOrder.products
    : [];

  const formattedAddress =
    Array.isArray(
      editedOrder.deliveryAddressLines,
    )
      ? editedOrder.deliveryAddressLines
      : DEFAULT_CUSTOMER.deliveryAddress;

  const deliveryDate =
    editedOrder.deliveryDate || "";

  const notes =
    editedOrder.notes || "";

  const subtotal = products.reduce(
    (sum, product) =>
      sum +
      Number(product.price || 0) *
        Number(product.quantity || 0),
    0,
  );

  const deliveryFee =
    editedOrder.deliveryFee ?? 20;

  const total = subtotal + deliveryFee;

  const deliverySchedule =
    editedOrder.deliverySchedule ||
    deliveryDate ||
    "Today";

  const buildOrderData = () => {
    return {
      ...editedOrder,

      customerName,

      contactNumber,

      products: products.map(
        (product) => ({
          ...product,
          quantity: Number(
            product.quantity,
          ),
          price: Number(
            product.price,
          ),
          total:
            Number(product.quantity) *
            Number(product.price),
        }),
      ),

      deliveryAddress:
        formattedAddress.join(", "),

      deliveryAddressLines:
        formattedAddress,

      deliveryDate,

      deliverySchedule,

      notes,

      subtotal,

      deliveryFee,

      total,

      updatedAt:
        new Date().toISOString(),
    };
  };

  // Edit selected products
  const handleEditOrder = () => {
    const order =
      buildOrderData();

    saveCurrentOrder(order);

    navigate("/customer/edit-order", {
      state: {
        order,
      },
    });
  };

  // Edit delivery details
  const handleEditDeliveryDetails = () => {
    const order =
      buildOrderData();

    saveCurrentOrder(order);

    navigate("/customer/delivery-details", {
      state: {
        order,
      },
    });
  };

  const handleConfirmOrder = () => {
    if (products.length === 0) {
      return;
    }

    const order = {
      ...buildOrderData(),

      status: "Pending",

      createdAt:
        editedOrder.createdAt ||
        new Date().toISOString(),

      updatedAt:
        new Date().toISOString(),
    };

    /*
     * addOrder() creates a NEW unique ID
     * and NEW unique order number.
     *
     * We use the returned order so the
     * success page, Orders page, Details
     * page, Track page, and Deliveries
     * page all reference the same newly
     * created order.
     */
    const savedOrder = addOrder(order);

    saveCurrentOrder(savedOrder);

    navigate(
      "/customer/order-successful",
      {
        state: {
          order: savedOrder,
        },
      },
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-background-main">
      <Header />

      <OrderStepper currentStep={3} />

      <main className="flex-1 bg-background-main px-4 pb-24 pt-6 sm:px-6 sm:pb-28 md:px-10 md:pb-32">
        <div className="mx-auto flex w-full max-w-[700px] flex-col gap-5">
          <div>
            <h1 className="text-2xl font-bold leading-8 text-text-primary sm:text-3xl">
              Summary Order
            </h1>

            <p className="mt-1 text-sm leading-6 text-text-secondary">
              Review everything before confirming your order.
            </p>
          </div>

          {/* CUSTOMER INFORMATION */}
          <section className="overflow-hidden rounded-xl border border-border-light bg-background-card shadow-card">
            <div className="flex items-center justify-between border-b border-border-light bg-background-accent px-5 py-4">
              <h2 className="text-sm font-bold uppercase tracking-[0.6px] text-text-accent">
                Customer Information
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-[0.6px] text-text-secondary">
                  Full Name
                </span>

                <span className="mt-1 block text-sm font-semibold text-text-primary">
                  {customerName}
                </span>
              </div>

              <div>
                <span className="block text-[10px] font-bold uppercase tracking-[0.6px] text-text-secondary">
                  Phone Number
                </span>

                <span className="mt-1 block text-sm font-semibold text-text-primary">
                  {contactNumber}
                </span>
              </div>
            </div>
          </section>

          {/* PRODUCTS */}
          <section className="overflow-hidden rounded-xl border border-border-light bg-background-card shadow-card">
            <div className="flex items-center justify-between border-b border-border-light bg-background-accent px-5 py-4">
              <h2 className="text-sm font-bold uppercase tracking-[0.6px] text-text-accent">
                Selected Products
              </h2>

              <button
                type="button"
                onClick={handleEditOrder}
                aria-label="Edit selected products"
                className="flex h-9 w-9 items-center justify-center rounded-md text-text-accent transition-colors hover:bg-background-main"
              >
                <Pencil className="h-4 w-4" />
              </button>
            </div>

            <div>
              {products.map(
                (product, index) => (
                  <div
                    key={
                      product.id ||
                      index
                    }
                    className="flex items-center justify-between gap-4 border-b border-border-light px-5 py-4"
                  >
                    <div className="min-w-0">
                      <p className="break-words text-sm font-bold leading-6 text-text-primary">
                        {product.name}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-text-secondary">
                        Quantity:{" "}
                        {product.quantity}
                      </p>

                      <p className="text-xs leading-5 text-text-secondary">
                        ₱
                        {Number(
                          product.price,
                        ).toFixed(
                          2,
                        )}{" "}
                        each
                      </p>
                    </div>

                    <span className="shrink-0 text-sm font-bold text-text-primary">
                      ₱
                      {(
                        Number(
                          product.price,
                        ) *
                        Number(
                          product.quantity,
                        )
                      ).toFixed(2)}
                    </span>
                  </div>
                ),
              )}
            </div>
          </section>

          {/* DELIVERY DETAILS */}
          <section className="overflow-hidden rounded-xl border border-border-light bg-background-card shadow-card">
            <div className="flex items-center justify-between border-b border-border-light bg-background-accent px-5 py-4">
              <h2 className="text-sm font-bold uppercase tracking-[0.6px] text-text-accent">
                Delivery Details
              </h2>

              <button
                type="button"
                onClick={handleEditDeliveryDetails}
                aria-label="Edit delivery details"
                className="flex h-9 w-9 items-center justify-center rounded-md text-text-accent transition-colors hover:bg-background-main"
              >
                <Pencil className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-col gap-5 p-5">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-text-accent" />

                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-[0.6px] text-text-secondary">
                    Address
                  </span>

                  <div className="mt-1 flex flex-col text-sm leading-6 text-text-primary">
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

              <div className="h-px bg-border-light" />

              <div className="flex items-start gap-3">
                <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-text-accent" />

                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-[0.6px] text-text-secondary">
                    Preferred Delivery Date
                  </span>

                  <span className="mt-1 block text-sm leading-6 text-text-primary">
                    {deliverySchedule}
                  </span>
                </div>
              </div>

              {notes && (
                <>
                  <div className="h-px bg-border-light" />

                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-[0.6px] text-text-secondary">
                      Additional Notes
                    </span>

                    <p className="mt-1 text-sm leading-6 text-text-primary">
                      {notes}
                    </p>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* TOTAL */}
          <section className="rounded-xl border border-border-light bg-background-card p-5 shadow-card">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">
                  Subtotal
                </span>

                <span className="text-sm font-semibold text-text-primary">
                  ₱{subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">
                  Delivery Fee
                </span>

                <span className="text-sm font-semibold text-text-primary">
                  ₱{deliveryFee.toFixed(2)}
                </span>
              </div>

              <div className="h-px bg-border-light" />

              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-text-primary">
                  Total
                </span>

                <span className="text-lg font-bold text-text-accent">
                  ₱{total.toFixed(2)}
                </span>
              </div>
            </div>
          </section>

          {/* BUTTONS */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleEditOrder}
              className="h-11 w-full rounded-lg border-2 border-primary-light bg-background-card px-6 text-xs font-bold uppercase tracking-[0.6px] text-primary-light transition-colors hover:bg-primary-light hover:text-white sm:w-auto sm:min-w-[160px]"
            >
              Edit Order
            </button>

            <button
              type="button"
              onClick={handleConfirmOrder}
              disabled={
                products.length === 0
              }
              className="h-11 w-full rounded-lg bg-button-background px-6 text-xs font-bold uppercase tracking-[0.6px] text-white shadow-sm transition-colors hover:bg-button-hover disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-[180px]"
            >
              Confirm Order
            </button>
          </div>
        </div>
      </main>

      <CustomerNavbar />
      <CustomerFooter />
    </div>
  );
}

export default OrderSummary;