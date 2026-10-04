import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MapPin, Plus, ChevronDown } from "lucide-react";

import Header from "../../components/Header/Header";
import CustomerNavbar from "../../components/customer/CustomerNavbar";
import OrderStepper from "../../components/customer/OrderStepper";

import {
  getCurrentOrder,
  saveCurrentOrder,
} from "../../utils/orderStorage";

import {
  getProfile,
  formatAddress,
} from "../../utils/profileStorage";

function getTodayDate() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function DeliveryDetails() {
  const navigate = useNavigate();
  const location = useLocation();

  const existingOrder =
    location.state?.order || getCurrentOrder() || {};

  const todayDate = getTodayDate();

  const [profile, setProfile] = useState(() => getProfile());

  const [fullName, setFullName] = useState(
    existingOrder.customerName || profile.fullName || "Maria Santos",
  );

  const [phoneNumber, setPhoneNumber] = useState(
    existingOrder.contactNumber || profile.phoneNumber || "0917-555-0192",
  );

  const [selectedAddressId, setSelectedAddressId] = useState(
    existingOrder.deliveryAddressId || "",
  );

  // Intentionally empty.
  // The customer must choose a delivery date.
  const [deliveryDate, setDeliveryDate] = useState("");

  // Intentionally empty.
  // The customer must choose a delivery time.
  const [deliveryTime, setDeliveryTime] = useState("");

  const [notes, setNotes] = useState(existingOrder.notes || "");

  const loadProfile = useCallback(() => {
    const savedProfile = getProfile();

    setProfile(savedProfile);

    setFullName((current) =>
      current || savedProfile.fullName || "Maria Santos",
    );

    setPhoneNumber((current) =>
      current || savedProfile.phoneNumber || "0917-555-0192",
    );

    setSelectedAddressId((current) => {
      const savedAddresses = Array.isArray(savedProfile.addresses)
        ? savedProfile.addresses
        : [];

      if (
        current &&
        savedAddresses.some(
          (address) => String(address.id) === String(current),
        )
      ) {
        return current;
      }

      if (
        existingOrder.deliveryAddressId &&
        savedAddresses.some(
          (address) =>
            String(address.id) ===
            String(existingOrder.deliveryAddressId),
        )
      ) {
        return existingOrder.deliveryAddressId;
      }

      const defaultAddress =
        savedAddresses.find((address) => address.isDefault) ||
        savedAddresses[0];

      return defaultAddress?.id || "";
    });
  }, [existingOrder.deliveryAddressId]);

  useEffect(() => {
    loadProfile();

    window.addEventListener("profileUpdated", loadProfile);

    return () => {
      window.removeEventListener("profileUpdated", loadProfile);
    };
  }, [loadProfile]);

  const addresses = Array.isArray(profile.addresses)
    ? profile.addresses
    : [];

  const selectedAddress = addresses.find(
    (address) => String(address.id) === String(selectedAddressId),
  );

  const products = Array.isArray(existingOrder.products)
    ? existingOrder.products
    : [];

  const subtotal = products.reduce(
    (sum, product) =>
      sum +
      Number(product.price || 0) * Number(product.quantity || 0),
    0,
  );

  const deliveryFee = existingOrder.deliveryFee ?? 20;
  const total = subtotal + deliveryFee;

  const buildOrder = () => {
    const formattedAddress = selectedAddress
      ? formatAddress(selectedAddress)
      : "";

    const addressLines = formattedAddress
      ? [formattedAddress]
      : [];

    return {
      ...existingOrder,
      customerName: fullName.trim(),
      contactNumber: phoneNumber.trim(),

      deliveryAddressId: selectedAddress?.id || "",
      deliveryAddressLabel: selectedAddress?.label || "",
      deliveryAddress: formattedAddress,
      deliveryAddressLines: addressLines,

      region: selectedAddress?.region || "",
      province: selectedAddress?.province || "",
      city: selectedAddress?.city || "",
      barangay: selectedAddress?.barangay || "",
      postalCode: selectedAddress?.postalCode || "",
      streetAddress: selectedAddress?.streetAddress || "",

      deliveryDate,
      deliveryTime,
      deliverySchedule:
        deliveryDate && deliveryTime
          ? `${deliveryDate}, ${deliveryTime}`
          : "",
      notes,

      subtotal,
      deliveryFee,
      total,
      updatedAt: new Date().toISOString(),
    };
  };

  const handleNext = () => {
    if (!fullName.trim() || !phoneNumber.trim()) {
      window.alert("Please enter your full name and phone number.");
      return;
    }

    if (!selectedAddress) {
      window.alert("Please select a saved delivery address.");
      return;
    }

    if (!deliveryDate) {
      window.alert("Please select a delivery date.");
      return;
    }

    if (!deliveryTime) {
      window.alert("Please select a delivery time.");
      return;
    }

    const order = buildOrder();

    saveCurrentOrder(order);

    navigate("/customer/order-summary", {
      state: { order },
    });
  };

  const handleBack = () => {
    const order = buildOrder();

    saveCurrentOrder(order);

    navigate("/customer/edit-order", {
      state: { order },
    });
  };

  const handleAddAddress = () => {
    const order = buildOrder();

    saveCurrentOrder(order);

    navigate("/customer/edit-profile?addAddress=1", {
      state: {
        returnTo: "/customer/delivery-details",
        order,
      },
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background-main">
      <Header />

      <OrderStepper currentStep={2} />

      <main className="flex-1 bg-background-main px-4 pb-10 pt-6 sm:px-6 md:px-10">
        <div className="mx-auto flex w-full max-w-[760px] flex-col gap-6">
          <div>
            <h1 className="text-2xl font-bold leading-8 text-text-primary sm:text-3xl">
              Delivery Details
            </h1>

            <p className="mt-1 text-sm leading-6 text-text-secondary">
              Confirm your contact details, choose a saved address, and set
              your delivery preferences.
            </p>
          </div>

          <section className="rounded-xl border border-border-light bg-background-card p-5 shadow-card sm:p-6">
            <div className="mb-5">
              <h2 className="text-sm font-bold uppercase tracking-[0.6px] text-text-accent">
                Customer Information
              </h2>

              <p className="mt-1 text-xs leading-5 text-text-secondary">
                Confirm your contact details before placing your order.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label
                  htmlFor="fullName"
                  className="text-[10px] font-bold uppercase tracking-[0.6px] text-text-primary"
                >
                  Full Name
                </label>

                <input
                  id="fullName"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className="h-11 w-full rounded-md border border-border-light bg-background-card px-3 text-sm text-text-primary outline-none focus:border-primary-background"
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label
                  htmlFor="phoneNumber"
                  className="text-[10px] font-bold uppercase tracking-[0.6px] text-text-primary"
                >
                  Phone Number
                </label>

                <input
                  id="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={(event) => setPhoneNumber(event.target.value)}
                  className="h-11 w-full rounded-md border border-border-light bg-background-card px-3 text-sm text-text-primary outline-none focus:border-primary-background"
                />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-border-light bg-background-card p-5 shadow-card sm:p-6">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-[0.6px] text-text-accent">
                  Delivery Address
                </h2>

                <p className="mt-1 text-xs leading-5 text-text-secondary">
                  Choose from the addresses saved in your Profile.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddAddress}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-primary-background px-3 py-2 text-xs font-bold uppercase tracking-[0.4px] text-primary-background transition-colors hover:bg-background-accent"
              >
                <Plus size={16} />
                Add Address
              </button>
            </div>

            {addresses.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border-light p-5 text-center">
                <MapPin
                  size={25}
                  className="mx-auto mb-2 text-text-secondary"
                />

                <p className="text-sm font-semibold text-text-primary">
                  No saved addresses yet
                </p>

                <p className="mt-1 text-xs leading-5 text-text-secondary">
                  Add an address to your Profile before continuing.
                </p>

                <button
                  type="button"
                  onClick={handleAddAddress}
                  className="mt-4 rounded-lg bg-button-background px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-white hover:bg-button-hover"
                >
                  Add Delivery Address
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {addresses.map((address) => {
                  const isSelected =
                    String(selectedAddressId) === String(address.id);

                  return (
                    <label
                      key={address.id}
                      className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
                        isSelected
                          ? "border-primary-background bg-background-accent"
                          : "border-border-light hover:bg-background-accent/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="deliveryAddress"
                        checked={isSelected}
                        onChange={() => setSelectedAddressId(address.id)}
                        className="mt-1 accent-primary-background"
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-bold text-text-primary">
                            {address.label || "Address"}
                          </span>

                          {address.isDefault && (
                            <span className="rounded-full bg-white px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-text-accent">
                              Default
                            </span>
                          )}
                        </div>

                        <p className="mt-1 break-words text-xs leading-5 text-text-secondary">
                          {formatAddress(address)}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}

            {selectedAddress && (
              <p className="mt-4 text-xs leading-5 text-text-secondary">
                Selected address:{" "}
                <span className="font-semibold text-text-primary">
                  {selectedAddress.label || "Address"}
                </span>
              </p>
            )}
          </section>

          <section className="rounded-xl border border-border-light bg-background-card p-5 shadow-card sm:p-6">
            <h2 className="mb-5 text-sm font-bold uppercase tracking-[0.6px] text-text-accent">
              Preferred Delivery Schedule
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="deliveryDate"
                  className="text-[10px] font-bold uppercase tracking-[0.6px] text-text-primary"
                >
                  Preferred Delivery Date
                </label>

                <input
                  id="deliveryDate"
                  type="date"
                  required
                  min={todayDate}
                  value={deliveryDate}
                  onChange={(event) => {
                    const selectedDate = event.target.value;

                    setDeliveryDate(
                      selectedDate < todayDate ? todayDate : selectedDate,
                    );
                  }}
                  className="h-11 w-full rounded-md border border-border-light bg-background-card px-3 text-sm text-text-primary outline-none focus:border-primary-background"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="deliveryTime"
                  className="text-[10px] font-bold uppercase tracking-[0.6px] text-text-primary"
                >
                  Preferred Delivery Time
                </label>

                <div className="relative w-full">
                  <select
                    id="deliveryTime"
                    required
                    value={deliveryTime}
                    onChange={(event) => setDeliveryTime(event.target.value)}
                    className="h-11 w-full appearance-none rounded-md border border-border-light bg-background-card px-3 pr-12 text-sm text-text-primary outline-none focus:border-primary-background"
                  >
                    <option value="" disabled>
                      Select a time
                    </option>

                    <option value="09:00">9:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="13:00">1:00 PM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="15:00">3:00 PM</option>
                    <option value="16:00">4:00 PM</option>
                    <option value="17:00">5:00 PM</option>
                  </select>

                  <ChevronDown
                    size={18}
                    strokeWidth={2}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-border-light bg-background-card p-5 shadow-card sm:p-6">
            <label
              htmlFor="notes"
              className="mb-2 block text-[10px] font-bold uppercase tracking-[0.6px] text-text-primary"
            >
              Additional Notes
            </label>

            <textarea
              id="notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="e.g. Leave with guard, near the gate..."
              rows={5}
              className="w-full resize-none rounded-md border border-border-light bg-background-card px-3 py-2 text-sm leading-5 text-text-primary outline-none placeholder:text-text-secondary focus:border-primary-background"
            />
          </section>

          <section className="rounded-xl border border-border-light bg-background-card p-5 shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-text-primary">
                Total
              </span>

              <span className="text-xl font-bold text-text-accent">
                ₱{total.toFixed(2)}
              </span>
            </div>
          </section>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleBack}
              className="h-11 w-full rounded-lg border-2 border-primary-light bg-background-card px-6 text-xs font-bold uppercase tracking-[0.6px] text-primary-light transition-colors hover:bg-primary-light hover:text-white sm:w-auto sm:min-w-[150px]"
            >
              Back
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={
                !selectedAddress ||
                !deliveryDate ||
                !deliveryTime
              }
              className="h-11 w-full rounded-lg bg-button-background px-6 text-xs font-bold uppercase tracking-[0.6px] text-white shadow-sm transition-colors hover:bg-button-hover disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-[180px]"
            >
              Next
            </button>
          </div>
        </div>
      </main>

      <CustomerNavbar />
    </div>
  );
}

export default DeliveryDetails;