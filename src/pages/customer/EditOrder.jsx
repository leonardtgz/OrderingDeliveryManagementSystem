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
        <div className="mx-auto flex w-full max-w-[560px] flex-1 flex-col px-4 py-5 sm:px-6 sm:py-6">
          <form
            onSubmit={handleSubmit}
            className="flex w-full flex-col gap-6"
          >
            {/* Full Name */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="fullName"
                className="text-xs font-bold uppercase tracking-[0.6px] text-text-primary"
              >
                Full Name
              </label>

              <input
                id="fullName"
                type="text"
                value="Juan Dela Cruz"
                readOnly
                className="h-10 w-full rounded border border-border-light bg-background-card px-3 py-2 text-sm text-text-secondary outline-none"
              />
            </div>

            {/* Delivery Address */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="deliveryAddress"
                className="text-xs font-bold uppercase tracking-[0.6px] text-text-primary"
              >
                Delivery Address
              </label>

              <textarea
                id="deliveryAddress"
                value="123 Main St, Brgy. San Jose, Anytown City, Province"
                readOnly
                rows={2}
                className="w-full resize-none rounded border border-border-light bg-background-card px-3 py-2 text-sm leading-5 text-text-secondary outline-none"
              />
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-border-light" />

            {/* Contact Number */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="contactNumber"
                className="text-xs font-bold uppercase tracking-[0.6px] text-text-primary"
              >
                Contact Number
              </label>

              <input
                id="contactNumber"
                type="tel"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="h-10 w-full rounded border border-border-light bg-background-card px-3 py-2 text-sm text-text-primary outline-none transition focus:border-primary"
              />
            </div>

            {/* Preferred Delivery */}
            <div className="w-full rounded-lg bg-primary-lighter p-3">
              <div className="flex w-full flex-col gap-3 sm:flex-row sm:gap-3">
                {/* Preferred Delivery Date */}
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <label
                    htmlFor="deliveryDate"
                    className="text-xs font-bold uppercase tracking-[0.6px] text-text-primary"
                  >
                    Preferred Delivery Date
                  </label>

                  <input
                    id="deliveryDate"
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="h-10 w-full rounded border border-border-light bg-background-card px-3 py-2 text-sm text-text-primary outline-none transition focus:border-primary"
                  />
                </div>

                {/* Preferred Delivery Time */}
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <label
                    htmlFor="deliveryTime"
                    className="text-xs font-bold uppercase tracking-[0.6px] text-text-primary"
                  >
                    Preferred Delivery Time
                  </label>

                  <select
                    id="deliveryTime"
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                    className="h-10 w-full rounded border border-border-light bg-background-card px-3 py-2 text-sm text-text-primary outline-none transition focus:border-primary"
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
            </div>

            {/* Additional Notes */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="notes"
                className="text-xs font-bold uppercase tracking-[0.6px] text-text-primary"
              >
                Additional Notes
              </label>

              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Leave with guard, near the gate..."
                rows={3}
                className="w-full resize-none rounded border border-border-light bg-background-card px-3 py-2 text-sm leading-5 text-text-primary outline-none placeholder:text-text-secondary focus:border-primary"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex w-full flex-col gap-2.5 pt-0 sm:flex-row">
              {/* Back */}
              <button
                type="button"
                onClick={handleBack}
                className="flex h-10 flex-1 items-center justify-center rounded-lg border-2 border-[#238FA3] bg-background-card px-3 text-xs font-bold uppercase tracking-[0.6px] text-[#238FA3] shadow-md transition-all hover:bg-[#238FA3] hover:text-white hover:shadow-lg"
              >
                Back
              </button>

              {/* Continue */}
              <button
                type="submit"
                className="flex h-10 flex-1 items-center justify-center rounded-lg border-2 border-[#238FA3] bg-[#238FA3] px-3 text-xs font-bold uppercase tracking-[0.6px] text-white shadow-md transition-all hover:bg-[#1D7D8E] hover:border-[#1D7D8E]"
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