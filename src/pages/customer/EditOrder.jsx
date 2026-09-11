import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import CustomerNavbar from "../../components/customer/CustomerNavbar";

const TIME_SLOTS = [
  "9:00 AM - 12:00 PM",
  "12:00 PM - 3:00 PM",
  "3:00 PM - 6:00 PM",
  "6:00 PM - 9:00 PM",
];

function EditOrder() {
  const navigate = useNavigate();

  const [contactNumber, setContactNumber] = useState("09123456789");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log({
      contactNumber,
      deliveryDate,
      deliveryTime,
      notes,
    });

    navigate("/customer/order-summary");
  };

  const handleBack = () => {
    navigate("/customer/products");
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background-main">
      {/* Header */}
      <div className="w-full shrink-0">
        <Header />
      </div>

      {/* Main Content */}
      <main className="flex w-full flex-1 overflow-y-auto pb-24">
        <div className="mx-auto flex w-full max-w-[560px] flex-1 flex-col px-4 py-5 sm:px-6 sm:py-7">
          {/* Page Header */}
          <div className="mb-5">
            <h1 className="text-[23px] font-bold leading-[120%] tracking-[-0.02em] text-text-accent sm:text-[26px]">
              Edit Order
            </h1>

            <p className="mt-1 text-xs leading-5 text-text-secondary sm:text-sm">
              Update your delivery information before continuing.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex w-full flex-col gap-5"
          >
            {/* Customer Information */}
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
                    value="Juan Dela Cruz"
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
                    value="123 Main St, Brgy. San Jose, Anytown City, Province"
                    readOnly
                    rows={2}
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
                    onChange={(e) => setContactNumber(e.target.value)}
                    className="h-10 w-full rounded-md border border-border-light bg-background-card px-3 text-sm text-text-primary outline-none transition-colors focus:border-primary-background"
                  />
                </div>
              </div>
            </section>

            {/* Preferred Delivery */}
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
                {/* Preferred Delivery Date */}
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
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="h-10 w-full rounded-md border border-border-light bg-background-card px-3 text-sm text-text-primary outline-none transition-colors focus:border-primary-background"
                  />
                </div>

                {/* Preferred Delivery Time */}
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
                    onChange={(e) => setDeliveryTime(e.target.value)}
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

            {/* Additional Notes */}
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
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Leave with guard, near the gate..."
                  rows={3}
                  className="w-full resize-none rounded-md border border-border-light bg-background-card px-3 py-2 text-sm leading-5 text-text-primary outline-none transition-colors placeholder:text-text-secondary focus:border-primary-background"
                />
              </div>
            </section>

            {/* Action Buttons */}
            <div className="flex w-full flex-col gap-2.5 pt-1 sm:flex-row">
              <button
                type="button"
                onClick={handleBack}
                className="flex h-10 flex-1 items-center justify-center rounded-lg border-2 border-primary-light bg-background-card px-3 text-xs font-bold uppercase tracking-[0.6px] text-primary-light shadow-card transition-colors hover:bg-primary-light hover:text-primary-foreground"
              >
                Back
              </button>

              <button
                type="submit"
                className="flex h-10 flex-1 items-center justify-center rounded-lg bg-button-background px-3 text-xs font-bold uppercase tracking-[0.6px] text-button-text shadow-card transition-colors hover:bg-button-hover"
              >
                Continue
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Customer Navbar */}
      <div className="w-full shrink-0">
        <CustomerNavbar />
      </div>
    </div>
  );
}

export default EditOrder;