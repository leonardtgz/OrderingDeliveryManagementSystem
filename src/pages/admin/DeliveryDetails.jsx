import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Clock3,
  MapPin,
  Package,
  Phone,
  Truck,
  User,
} from "lucide-react";

import AdminSidebar from "../../components/admin/AdminSidebar";
import Header from "../../components/Header/Header";
import AdminFooter from "../../components/admin/AdminFooter";

import { getOrders } from "../../utils/orderStorage";

function normalizeStatus(status) {
  const value = String(status || "Pending")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");

  if (["confirmed", "purifying", "processing"].includes(value)) {
    return "Processing";
  }

  if (
    ["out for delivery", "in transit", "on the way", "delivery"].includes(
      value
    )
  ) {
    return "Out for Delivery";
  }

  if (["delivered", "completed"].includes(value)) {
    return "Delivered";
  }

  if (["cancelled", "canceled"].includes(value)) {
    return "Cancelled";
  }

  return "Pending";
}

function getStatusStyle(status) {
  const styles = {
    Pending:
      "bg-amber-100 text-amber-800 border border-amber-200",

    Processing:
      "bg-blue-100 text-blue-800 border border-blue-200",

    "Out for Delivery":
      "bg-cyan-100 text-cyan-800 border border-cyan-200",

    Delivered:
      "bg-green-100 text-green-800 border border-green-200",

    Cancelled:
      "bg-red-100 text-red-800 border border-red-200",
  };

  return styles[normalizeStatus(status)];
}

function getCustomerName(order) {
  return (
    order?.customerName ||
    order?.customer ||
    order?.fullName ||
    "Unknown Customer"
  );
}

function getOrderNumber(order) {
  return String(order?.orderNumber || order?.id || "N/A");
}

function getContactNumber(order) {
  return (
    order?.contactNumber ||
    order?.phoneNumber ||
    order?.customerPhone ||
    order?.phone ||
    order?.contact ||
    order?.mobileNumber ||
    order?.mobile ||
    "Not provided"
  );
}

function getDeliveryDate(order) {
  const value =
    order?.deliveryDate ||
    order?.deliverySchedule ||
    order?.deliveryTime;

  if (!value) return "Not scheduled";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("en-PH", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function getDeliveryTime(order) {
  const time =
    order?.deliveryTimeSlot ||
    order?.timeSlot ||
    order?.preferredDeliveryTime ||
    order?.deliveryScheduleTime ||
    order?.deliveryTime ||
    "";

  if (!time) {
    return "Not specified";
  }

  const [hours, minutes] = String(time).split(":");
  const hour = Number(hours);

  if (
    Number.isNaN(hour) ||
    minutes === undefined
  ) {
    return time;
  }

  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;

  return `${displayHour}:${minutes} ${period}`;
}

/* 
 * Get the customer's address as separate fields.
 * This supports both object-based addresses and individual
 * address fields that may already exist on the order.
 */
function getAddressFields(order) {
  const address = order?.deliveryAddress;

  if (address && typeof address === "object" && !Array.isArray(address)) {
    return {
      houseUnit:
        address.houseUnit ||
        address.houseNumber ||
        address.unitNumber ||
        address.unit ||
        address.houseNo ||
        address.houseNumberUnit ||
        "",

      street:
        address.street ||
        address.streetName ||
        address.streetAddress ||
        address.addressLine1 ||
        "",

      barangay:
        address.barangay ||
        address.brgy ||
        "",

      city:
        address.city ||
        address.municipality ||
        "",

      province:
        address.province ||
        "",

      region:
        address.region ||
        "",

      postalCode:
        address.postalCode ||
        address.zipCode ||
        address.zip ||
        "",
    };
  }

  return {
    houseUnit:
      order?.houseUnit ||
      order?.houseNumber ||
      order?.unitNumber ||
      order?.unit ||
      order?.houseNo ||
      "",

    street:
      order?.street ||
      order?.streetName ||
      order?.streetAddress ||
      order?.addressLine1 ||
      "",

    barangay:
      order?.barangay ||
      order?.brgy ||
      "",

    city:
      order?.city ||
      order?.municipality ||
      "",

    province:
      order?.province ||
      "",

    region:
      order?.region ||
      "",

    postalCode:
      order?.postalCode ||
      order?.zipCode ||
      order?.zip ||
      "",
  };
}

function getProducts(order) {
  if (Array.isArray(order?.products) && order.products.length > 0) {
    return order.products;
  }

  return [
    {
      name: order?.product || order?.title || "Water Order",
      quantity: Number(order?.quantity ?? order?.qty ?? 1),
      price: Number(order?.price ?? 0),
    },
  ];
}

function getOrderTotal(order) {
  const directTotal =
    order?.total ??
    order?.totalAmount ??
    order?.grandTotal ??
    order?.amount;

  if (
    directTotal !== undefined &&
    directTotal !== null &&
    directTotal !== ""
  ) {
    const amount = Number(directTotal);

    if (Number.isFinite(amount)) {
      return amount;
    }
  }

  return getProducts(order).reduce((total, product) => {
    const quantity = Number(
      product?.quantity ?? product?.qty ?? 0
    );

    const price = Number(
      product?.price ?? product?.unitPrice ?? 0
    );

    return total + quantity * price;
  }, 0);
}

function formatCurrency(amount) {
  return `₱${Number(amount || 0).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function getPaymentStatus(order) {
  const value =
    order?.paymentStatus ??
    order?.paid ??
    order?.isPaid ??
    order?.payment?.status;

  if (
    value === true ||
    ["paid", "yes"].includes(
      String(value || "").trim().toLowerCase()
    )
  ) {
    return "Paid";
  }

  return "Unpaid";
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-[#08779D]">
        <Icon size={17} />
      </div>

      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-medium text-slate-700">
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );
}

function AddressField({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3">
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-medium text-slate-700">
        {value || "Not provided"}
      </p>
    </div>
  );
}

function StatusTimeline({ status }) {
  const currentStatus = normalizeStatus(status);

  const steps = [
    "Pending",
    "Processing",
    "Out for Delivery",
    "Delivered",
  ];

  const currentIndex = steps.indexOf(currentStatus);

  return (
    <div className="mt-6">
      {steps.map((step, index) => {
        const completed =
          currentStatus !== "Cancelled" &&
          currentIndex >= index;

        const active =
          currentStatus !== "Cancelled" &&
          currentIndex === index;

        return (
          <div key={step} className="flex">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full border-2 ${
                  completed
                    ? getStatusStyle(step)
                    : "border-slate-200 bg-white text-slate-300"
                }`}
              >
                {completed ? (
                  <Check size={17} strokeWidth={2.5} />
                ) : (
                  <span className="h-2 w-2 rounded-full bg-current" />
                )}
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`min-h-[42px] w-0.5 ${
                    currentStatus !== "Cancelled" &&
                    currentIndex > index
                      ? "bg-[#08779D]"
                      : "bg-slate-200"
                  }`}
                />
              )}
            </div>

            <div className="pb-6 pl-4">
              <div className="flex items-center gap-2">
                <p
                  className={`text-sm font-semibold ${
                    active
                      ? normalizeStatus(step) === "Pending"
                        ? "text-amber-800"
                        : normalizeStatus(step) === "Processing"
                        ? "text-blue-800"
                        : normalizeStatus(step) ===
                          "Out for Delivery"
                        ? "text-cyan-800"
                        : "text-green-800"
                      : completed
                      ? "text-slate-700"
                      : "text-slate-400"
                  }`}
                >
                  {step}
                </p>

                {active && (
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${getStatusStyle(
                      step
                    )}`}
                  >
                    Current
                  </span>
                )}
              </div>

              {active && (
                <p className="mt-1 text-xs text-slate-500">
                  Current delivery status
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DeliveryDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  const [order, setOrder] = useState(location.state?.order || null);

  useEffect(() => {
    if (!order) return;

    const orderNumber = order.orderNumber || order.id;

    const refreshOrder = () => {
      const orders = getOrders();

      const latest = orders.find(
        (item) =>
          String(item.orderNumber || item.id) ===
          String(orderNumber)
      );

      if (latest) {
        setOrder(latest);
      }
    };

    refreshOrder();

    window.addEventListener("storage", refreshOrder);
    window.addEventListener("orderUpdated", refreshOrder);
    window.addEventListener("ordersUpdated", refreshOrder);

    return () => {
      window.removeEventListener("storage", refreshOrder);
      window.removeEventListener("orderUpdated", refreshOrder);
      window.removeEventListener("ordersUpdated", refreshOrder);
    };
  }, [order]);

  const handleBackToOrders = () => {
    window.location.href = "/admin/orders";
    };

  if (!order) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <AdminSidebar />

        <div className="min-w-0 flex-1">
          <Header />

          <main className="min-h-[calc(100vh-74px)] bg-slate-50">
            <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8">
              <button
                type="button"
                onClick={handleBackToOrders}
                className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#08779D] hover:underline"
              >
                <ArrowLeft size={17} />
                Back to Orders
              </button>

              <div className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
                <Package
                  size={32}
                  className="mx-auto text-slate-300"
                />

                <h2 className="mt-4 text-lg font-bold text-slate-800">
                  Delivery details unavailable
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  No order was selected for this delivery.
                </p>
              </div>
            </div>
          </main>

          <AdminFooter />
        </div>
      </div>
    );
  }

  const status = normalizeStatus(order.status);
  const addressFields = getAddressFields(order);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />

      <div className="min-w-0 flex-1">
        <Header />

        <main className="min-h-[calc(100vh-74px)] bg-slate-50 pb-12">
          <div className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {/* Back */}
            <button
              type="button"
              onClick={handleBackToOrders}
              className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#08779D] transition hover:underline"
            >
              <ArrowLeft size={17} />
              Back to Orders
            </button>

            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[28px]">
                    Delivery Details
                  </h1>

                  <span
                    className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyle(
                      status
                    )}`}
                  >
                    {status}
                  </span>
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  Order #{getOrderNumber(order)}
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <Truck
                  size={19}
                  className="text-[#08779D]"
                />

                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                    Delivery Status
                  </p>

                  <p className="text-sm font-bold text-slate-800">
                    {status}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
              {/* LEFT */}
              <div className="space-y-6">
                {/* Customer */}
                <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-50 text-[#08779D]">
                      <User size={19} />
                    </div>

                    <div>
                      <h2 className="font-bold text-slate-900">
                        Customer Information
                      </h2>

                      <p className="text-xs text-slate-500">
                        Customer receiving this delivery
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <InfoRow
                      icon={User}
                      label="Customer Name"
                      value={getCustomerName(order)}
                    />

                    <InfoRow
                      icon={Phone}
                      label="Contact Number"
                      value={getContactNumber(order)}
                    />
                  </div>
                </section>

                {/* Delivery */}
                <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-50 text-[#08779D]">
                      <MapPin size={19} />
                    </div>

                    <div>
                      <h2 className="font-bold text-slate-900">
                        Delivery Information
                      </h2>

                      <p className="text-xs text-slate-500">
                        Where and when the order will be delivered
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <InfoRow
                      icon={CalendarDays}
                      label="Delivery Date"
                      value={getDeliveryDate(order)}
                    />

                    <InfoRow
                      icon={Clock3}
                      label="Delivery Time"
                      value={getDeliveryTime(order)}
                    />
                  </div>

                  {/* Delivery Address */}
                  <div className="mt-5 border-t border-slate-100 pt-5">
                    <div className="mb-4 flex items-center gap-2">
                      <MapPin
                        size={17}
                        className="text-[#08779D]"
                      />

                      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                        Delivery Address
                      </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <AddressField
                        label="House / Unit No."
                        value={addressFields.houseUnit}
                      />

                      <AddressField
                        label="Street"
                        value={addressFields.street}
                      />

                      <AddressField
                        label="Barangay"
                        value={addressFields.barangay}
                      />

                      <AddressField
                        label="City / Municipality"
                        value={addressFields.city}
                      />

                      <AddressField
                        label="Province"
                        value={addressFields.province}
                      />

                      <AddressField
                        label="Region"
                        value={addressFields.region}
                      />

                      <AddressField
                        label="Postal Code / ZIP Code"
                        value={addressFields.postalCode}
                      />
                    </div>
                  </div>
                </section>

                {/* Products */}
                <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-50 text-[#08779D]">
                      <Package size={19} />
                    </div>

                    <div>
                      <h2 className="font-bold text-slate-900">
                        Order Items
                      </h2>

                      <p className="text-xs text-slate-500">
                        Products included in this delivery
                      </p>
                    </div>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {getProducts(order).map((product, index) => {
                      const quantity = Number(
                        product?.quantity ??
                          product?.qty ??
                          0
                      );

                      const price = Number(
                        product?.price ??
                          product?.unitPrice ??
                          0
                      );

                      return (
                        <div
                          key={`${product?.name || "product"}-${index}`}
                          className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                              <Package size={17} />
                            </div>

                            <div className="min-w-0">
                              <p className="break-words text-sm font-semibold text-slate-800">
                                {product?.name || "Water Order"}
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                Quantity: {quantity}
                              </p>
                            </div>
                          </div>

                          <p className="whitespace-nowrap text-sm font-bold text-slate-800">
                            {formatCurrency(price * quantity)}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4">
                    <span className="text-sm font-semibold text-slate-600">
                      Order Total
                    </span>

                    <span className="text-lg font-bold text-[#08779D]">
                      {formatCurrency(getOrderTotal(order))}
                    </span>
                  </div>
                </section>
              </div>

              {/* RIGHT */}
              <div className="space-y-6">
                {/* Timeline */}
                <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div>
                    <h2 className="font-bold text-slate-900">
                      Delivery Progress
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      Current order lifecycle
                    </p>
                  </div>

                  {status === "Cancelled" ? (
                    <div className="mt-6 rounded-lg border border-red-200 bg-red-100 p-4">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex rounded-full border border-red-200 bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-800">
                          Cancelled
                        </span>
                      </div>

                      <p className="mt-2 text-xs leading-5 text-red-700">
                        This order has been cancelled and is no longer
                        active for delivery.
                      </p>
                    </div>
                  ) : (
                    <StatusTimeline status={status} />
                  )}
                </section>

                {/* Payment */}
                <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="font-bold text-slate-900">
                    Order Summary
                  </h2>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm text-slate-500">
                        Order Number
                      </span>

                      <span className="text-sm font-semibold text-slate-800">
                        {getOrderNumber(order)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm text-slate-500">
                        Payment
                      </span>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          getPaymentStatus(order) === "Paid"
                            ? "bg-green-50 text-green-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {getPaymentStatus(order)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-3">
                      <span className="text-sm font-semibold text-slate-600">
                        Total
                      </span>

                      <span className="text-base font-bold text-slate-900">
                        {formatCurrency(getOrderTotal(order))}
                      </span>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </main>

        <AdminFooter />
      </div>
    </div>
  );
}

export default DeliveryDetails;