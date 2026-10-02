import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";

import Header from "../../components/Header/Header";
import CustomerNavbar from "../../components/customer/CustomerNavbar";
import CustomerFooter from "../../components/customer/CustomerFooter";
import OrderStepper from "../../components/customer/OrderStepper";

import {
  getCurrentOrder,
  saveCurrentOrder,
} from "../../utils/orderStorage";

const BULACAN_BARANGAYS = [
  "Caingin",
  "Capihan",
  "Coral na Bato",
  "Cruz na Daan",
  "Dagat-dagatan",
  "Diliman I",
  "Diliman II",
  "Lico",
  "Maasim",
  "Maguinao",
  "Mabalas-balas",
  "Maronquillo",
  "Pantubig",
  "Pasong Bangkal",
  "Pasong Callos",
  "Pasong Intsik",
  "Pinacpinacan",
  "Poblacion",
  "Pulong Bayabas",
  "Sampaloc",
  "San Agustin",
  "San Roque",
  "Talacsan",
  "Tambubong",
  "Tukod",
  "Ulingao",
];

const BULACAN_MUNICIPALITIES = [
  "San Rafael",
  "Angat",
  "Balagtas",
  "Baliwag",
  "Bocaue",
  "Bulakan",
  "Bustos",
  "Calumpit",
  "Doña Remedios Trinidad",
  "Guiguinto",
  "Hagonoy",
  "Malolos",
  "Marilao",
  "Meycauayan",
  "Norzagaray",
  "Obando",
  "Pandi",
  "Paombong",
  "Plaridel",
  "Pulilan",
  "San Ildefonso",
  "San Jose del Monte",
  "San Miguel",
  "Santa Maria",
];

const BARANGAYS_BY_MUNICIPALITY = {
  "San Rafael": BULACAN_BARANGAYS,
  Angat: ["Banaban", "Baybay", "Marungko", "Poblacion"],
  Balagtas: ["Borol 1st", "Borol 2nd", "Longos", "Poblacion"],
  Baliwag: ["Bagong Nayon", "Poblacion", "Sabang", "San Jose"],
  Bocaue: ["Batia", "Lolomboy", "Poblacion", "Taal"],
  Bulakan: ["Bagumbayan", "Matungao", "Poblacion", "San Nicolas"],
  Bustos: ["Bonga Menor", "Bonga Mayor", "Poblacion", "Tibagan"],
  Calumpit: ["Balite", "Gatbuca", "Poblacion", "San Jose"],
  "Doña Remedios Trinidad": ["Camachin", "Kabayo", "Poblacion", "Talbak"],
  Guiguinto: ["Cutcut", "Ilang-Ilang", "Poblacion", "Tabe"],
  Hagonoy: ["Abulalas", "Iba", "Poblacion", "San Agustin"],
  Malolos: ["Anilao", "Atlag", "Bulihan", "Poblacion"],
  Marilao: ["Ibayo", "Lambakin", "Poblacion", "Prenza"],
  Meycauayan: ["Bahay Pare", "Calvario", "Poblacion", "Saluysoy"],
  Norzagaray: ["Bigte", "Matictic", "Poblacion", "San Mateo"],
  Obando: ["Binuangan", "Paco", "Poblacion", "Salambao"],
  Pandi: ["Bagbaguin", "Bunsuran", "Poblacion", "Siling Bata"],
  Paombong: ["Binakod", "Poblacion", "San Isidro", "San Roque"],
  Plaridel: ["Agnaya", "Banga I", "Poblacion", "Tabang"],
  Pulilan: ["Dampol", "Longos", "Poblacion", "Tibag"],
  "San Ildefonso": ["Akle", "Anyatam", "Poblacion", "Upig"],
  "San Jose del Monte": ["Citrus", "Graceville", "Poblacion", "Tungkong Mangga"],
  "San Miguel": ["Bagong Silang", "Poblacion", "San Juan", "Tartaro"],
  "Santa Maria": ["Bagbaguin", "Catmon", "Poblacion", "Pulong Buhangin"],
};

function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function TextField({ id, label, value, onChange, type = "text" }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-[10px] font-bold uppercase tracking-[0.6px] text-text-primary"
      >
        {label}
      </label>

      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-md border border-border-light bg-background-card px-3 text-sm text-text-primary outline-none focus:border-primary-background"
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-bold uppercase tracking-[0.6px] text-text-primary">
        {label}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-full appearance-none rounded-md border border-border-light bg-background-card pl-3 pr-12 text-sm text-text-primary outline-none focus:border-primary-background"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <ChevronDown
          size={16}
          strokeWidth={2}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary"
        />
      </div>
    </div>
  );
}

function DeliveryDetails() {
  const navigate = useNavigate();
  const location = useLocation();

  const existingOrder =
    location.state?.order || getCurrentOrder() || {};

  const todayDate = getTodayDate();

  const [fullName, setFullName] = useState(
    existingOrder.customerName || "Maria Santos",
  );

  const [phoneNumber, setPhoneNumber] = useState(
    existingOrder.contactNumber || "0917-555-0192",
  );

  const [region, setRegion] = useState(
    existingOrder.region || "Central Luzon",
  );

  const [province, setProvince] = useState(
    existingOrder.province || "Bulacan",
  );

  const [city, setCity] = useState(
    existingOrder.city || "San Rafael",
  );

  const [barangay, setBarangay] = useState(
    existingOrder.barangay || "Poblacion",
  );

  const [postalCode, setPostalCode] = useState(
    existingOrder.postalCode || "3008",
  );

  const [streetAddress, setStreetAddress] = useState(
    existingOrder.streetAddress || "",
  );

  const [deliveryDate, setDeliveryDate] = useState(
    existingOrder.deliveryDate || todayDate,
  );

  const [deliveryTime, setDeliveryTime] = useState(
    existingOrder.deliveryTime || "09:00",
  );

  const [notes, setNotes] = useState(existingOrder.notes || "");

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

  const handleNext = () => {
    if (!fullName.trim() || !phoneNumber.trim()) {
      window.alert("Please enter your full name and phone number.");
      return;
    }

    if (!deliveryDate || !deliveryTime) {
      window.alert("Please select a delivery date and time.");
      return;
    }

    const addressLines = [
      streetAddress,
      `Barangay ${barangay}, ${city}`,
      `${province}, ${region} ${postalCode}`,
    ].filter(Boolean);

    const order = {
      ...existingOrder,
      customerName: fullName.trim(),
      contactNumber: phoneNumber.trim(),
      region,
      province,
      city,
      barangay,
      postalCode,
      streetAddress,
      deliveryAddress: addressLines.join(", "),
      deliveryAddressLines: addressLines,
      deliveryDate,
      deliveryTime,
      deliverySchedule: `${deliveryDate} ${deliveryTime}`,
      notes,
      subtotal,
      deliveryFee,
      total,
      updatedAt: new Date().toISOString(),
    };

    saveCurrentOrder(order);

    navigate("/customer/order-summary", {
      state: { order },
    });
  };

  const handleBack = () => {
    const order = {
      ...existingOrder,
      customerName: fullName,
      contactNumber: phoneNumber,
      region,
      province,
      city,
      barangay,
      postalCode,
      streetAddress,
      deliveryDate,
      deliveryTime,
      notes,
      subtotal,
      deliveryFee,
      total,
    };

    saveCurrentOrder(order);

    navigate("/customer/edit-order", {
      state: { order },
    });
  };

  const availableBarangays =
    BARANGAYS_BY_MUNICIPALITY[city] || BULACAN_BARANGAYS;

  return (
    <div className="flex min-h-screen flex-col bg-background-main">
      <Header />

      <OrderStepper currentStep={2} />

      <main className="flex-1 bg-background-main px-4 pb-24 pt-6 sm:px-6 sm:pb-28 md:px-10 md:pb-32">
        <div className="mx-auto flex w-full max-w-[760px] flex-col gap-6">
          <div>
            <h1 className="text-2xl font-bold leading-8 text-text-primary sm:text-3xl">
              Delivery Details
            </h1>

            <p className="mt-1 text-sm leading-6 text-text-secondary">
              Enter your customer information and delivery preferences.
            </p>
          </div>

          <section className="rounded-xl border border-border-light bg-background-card p-5 shadow-card sm:p-6">
            <div className="mb-5">
              <h2 className="text-sm font-bold uppercase tracking-[0.6px] text-text-accent">
                Customer Information
              </h2>

              <p className="mt-1 text-xs leading-5 text-text-secondary">
                Confirm your contact details and delivery address.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <TextField
                  id="fullName"
                  label="Full Name"
                  value={fullName}
                  onChange={setFullName}
                />
              </div>

              <div className="sm:col-span-2">
                <TextField
                  id="phoneNumber"
                  label="Phone Number"
                  type="tel"
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                />
              </div>

              <SelectField
                label="Region"
                value={region}
                onChange={setRegion}
                options={["Central Luzon"]}
              />

              <SelectField
                label="Province"
                value={province}
                onChange={setProvince}
                options={["Bulacan"]}
              />

              <SelectField
                label="City / Municipality"
                value={city}
                onChange={(value) => {
                  setCity(value);
                  const nextBarangays =
                    BARANGAYS_BY_MUNICIPALITY[value] || [];
                  setBarangay(nextBarangays[0] || "");
                  setPostalCode(value === "San Rafael" ? "3008" : "");
                }}
                options={BULACAN_MUNICIPALITIES}
              />

              <SelectField
                label="Barangay"
                value={barangay}
                onChange={setBarangay}
                options={availableBarangays}
              />

              <TextField
                id="postalCode"
                label="Postal Code"
                value={postalCode}
                onChange={setPostalCode}
              />

              <div className="sm:col-span-2">
                <TextField
                  id="streetAddress"
                  label="Street Name / Building / House No."
                  value={streetAddress}
                  onChange={setStreetAddress}
                />
              </div>
            </div>
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

                <div className="relative">
                  <select
                    id="deliveryTime"
                    value={deliveryTime}
                    onChange={(event) => setDeliveryTime(event.target.value)}
                    className="h-11 w-full appearance-none rounded-md border border-border-light bg-background-card pl-3 pr-12 text-sm text-text-primary outline-none focus:border-primary-background"
                  >
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
                    size={16}
                    strokeWidth={2}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary"
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
              className="h-11 w-full rounded-lg bg-button-background px-6 text-xs font-bold uppercase tracking-[0.6px] text-white shadow-sm transition-colors hover:bg-button-hover sm:w-auto sm:min-w-[180px]"
            >
              Next
            </button>
          </div>
        </div>
      </main>

      <CustomerNavbar />
      <CustomerFooter />
    </div>
  );
}

export default DeliveryDetails;