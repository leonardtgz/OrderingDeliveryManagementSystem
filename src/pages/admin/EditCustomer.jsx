import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  ChevronDown,
  Save,
  X,
} from "lucide-react";

import AdminSidebar from "../../components/admin/AdminSidebar";
import Header from "../../components/Header/Header";

const CUSTOMERS_KEY = "adminCustomers";
const CUSTOMER_TOAST_KEY = "adminCustomerToast";

const REGIONS = ["Central Luzon"];

const PROVINCES_BY_REGION = {
  "Central Luzon": ["Bulacan"],
};

const CITIES_BY_PROVINCE = {
  Bulacan: [
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
  ],
};

const BARANGAYS_BY_MUNICIPALITY = {
  "San Rafael": [],
  Angat: [],
  Balagtas: [],
  Baliwag: [],
  Bocaue: [],
  Bulakan: [],
  Bustos: [],
  Calumpit: [],
  "Doña Remedios Trinidad": [],
  Guiguinto: [],
  Hagonoy: [],
  Malolos: [],
  Marilao: [],
  Meycauayan: [],
  Norzagaray: [],
  Obando: [],
  Pandi: [],
  Paombong: [],
  Plaridel: [],
};

const SelectField = ({
  id,
  name,
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
}) => {
  return (
    <div className="relative">
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`h-12 w-full appearance-none rounded-lg border border-border-secondary bg-white pl-3 pr-12 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${
          disabled
            ? "cursor-not-allowed bg-gray-100 text-text-secondary"
            : ""
        }`}
      >
        <option value="" disabled>
          {placeholder}
        </option>

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
  );
};

export default function EditCustomer() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [customer, setCustomer] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    region: "",
    province: "",
    city: "",
    barangay: "",
    postalCode: "",
    streetAddress: "",
  });

  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const savedCustomers =
      localStorage.getItem(CUSTOMERS_KEY);

    if (!savedCustomers) {
      navigate("/admin/customers");
      return;
    }

    try {
      const parsedCustomers = JSON.parse(savedCustomers);

      if (!Array.isArray(parsedCustomers)) {
        navigate("/admin/customers");
        return;
      }

      const foundCustomer = parsedCustomers.find(
        (item) =>
          String(item.id) === String(id),
      );

      if (!foundCustomer) {
        navigate("/admin/customers");
        return;
      }

      setCustomer(foundCustomer);

      setFormData({
        name: foundCustomer.name || "",
        contact: foundCustomer.contact || "",
        email: foundCustomer.email || "",
        region: foundCustomer.region || "",
        province: foundCustomer.province || "",
        city:
          foundCustomer.city ||
          foundCustomer.cityMunicipality ||
          "",
        barangay: foundCustomer.barangay || "",
        postalCode: foundCustomer.postalCode || "",
        streetAddress:
          foundCustomer.streetAddress ||
          "",
      });
    } catch {
      navigate("/admin/customers");
    }
  }, [id, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleRegionChange = (event) => {
    const value = event.target.value;

    setFormData((current) => ({
      ...current,
      region: value,
      province: "",
      city: "",
      barangay: "",
    }));
  };

  const handleProvinceChange = (event) => {
    const value = event.target.value;

    setFormData((current) => ({
      ...current,
      province: value,
      city: "",
      barangay: "",
    }));
  };

  const handleCityChange = (event) => {
    const value = event.target.value;

    setFormData((current) => ({
      ...current,
      city: value,
      barangay: "",
    }));
  };

  const provinces =
    PROVINCES_BY_REGION[formData.region] || [];

  const cities =
    CITIES_BY_PROVINCE[formData.province] || [];

  const barangays =
    BARANGAYS_BY_MUNICIPALITY[formData.city] || [];

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.contact.trim() ||
      !formData.email.trim() ||
      !formData.region.trim() ||
      !formData.province.trim() ||
      !formData.city.trim() ||
      !formData.barangay.trim() ||
      !formData.postalCode.trim() ||
      !formData.streetAddress.trim()
    ) {
      window.alert(
        "Please complete all customer information.",
      );

      return;
    }

    setShowWarning(true);
  };

  const handleConfirmUpdate = () => {
    const savedCustomers =
      localStorage.getItem(CUSTOMERS_KEY);

    if (!savedCustomers) {
      window.alert(
        "Customer information could not be found.",
      );

      return;
    }

    try {
      const parsedCustomers = JSON.parse(savedCustomers);

      if (!Array.isArray(parsedCustomers)) {
        window.alert(
          "Customer information could not be loaded.",
        );

        return;
      }

      const updatedCustomers = parsedCustomers.map(
        (item) => {
          if (String(item.id) !== String(id)) {
            return item;
          }

          const formattedAddress = [
            formData.streetAddress.trim(),
            formData.barangay.trim(),
            formData.city.trim(),
            formData.province.trim(),
            formData.region.trim(),
            formData.postalCode.trim(),
          ]
            .filter(Boolean)
            .join(", ");

          return {
            ...item,
            name: formData.name.trim(),
            contact: formData.contact.trim(),
            email: formData.email.trim(),

            // Keep the address fields consistent
            // with the customer-side address form.
            region: formData.region.trim(),
            province: formData.province.trim(),
            city: formData.city.trim(),
            barangay: formData.barangay.trim(),
            postalCode: formData.postalCode.trim(),
            streetAddress:
              formData.streetAddress.trim(),

            // Keep the combined address for
            // compatibility with existing customer data.
            address: formattedAddress,

            // Keep existing order count.
            orders: item.orders || 0,
          };
        },
      );

      localStorage.setItem(
        CUSTOMERS_KEY,
        JSON.stringify(updatedCustomers),
      );

      // Tell Customers.jsx that a customer was updated.
      window.dispatchEvent(
        new Event("customerUpdated"),
      );

      // Show success toast on the Customers page.
      localStorage.setItem(
        CUSTOMER_TOAST_KEY,
        "Customer updated successfully.",
      );

      setShowWarning(false);

      navigate("/admin/customers");
    } catch {
      window.alert(
        "Unable to update customer information.",
      );
    }
  };

  const handleCancelWarning = () => {
    setShowWarning(false);
  };

  const handleBack = () => {
    navigate("/admin/customers");
  };

  if (!customer) {
    return null;
  }

  return (
    <div className="flex min-h-screen w-full bg-background-main">
      <AdminSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />

        <main className="min-w-0 flex-1 overflow-y-auto">
          <div className="flex w-full flex-col items-start p-6 lg:p-12">

            {/* Back Button */}
            <button
              type="button"
              onClick={handleBack}
              className="mb-6 flex items-center gap-2 text-sm font-semibold text-text-accent transition-opacity hover:opacity-70"
            >
              <ArrowLeft size={18} />
              Back to Customers
            </button>

            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold tracking-[-0.32px] text-text-primary lg:text-[32px]">
                Edit Customer
              </h1>

              <p className="mt-1 text-sm text-text-secondary">
                Update the customer's information below.
              </p>
            </div>

            {/* Form Card */}
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-[850px] rounded-xl border border-card-border bg-card-background p-6 shadow-sm lg:p-8"
            >

              {/* Customer */}
              <div className="mb-8 rounded-lg bg-background-accent p-4">
                <p className="text-xs font-bold uppercase tracking-[0.6px] text-text-secondary">
                  Customer
                </p>

                <p className="mt-1 text-base font-semibold text-text-primary">
                  {customer.name}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                {/* Full Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-text-primary"
                  >
                    Full Name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    className="h-12 w-full rounded-lg border border-border-secondary bg-white px-4 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Contact */}
                <div>
                  <label
                    htmlFor="contact"
                    className="mb-2 block text-sm font-semibold text-text-primary"
                  >
                    Contact Number
                  </label>

                  <input
                    id="contact"
                    name="contact"
                    type="text"
                    value={formData.contact}
                    onChange={handleChange}
                    placeholder="Enter contact number"
                    className="h-12 w-full rounded-lg border border-border-secondary bg-white px-4 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Email */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-text-primary"
                  >
                    Email Address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    className="h-12 w-full rounded-lg border border-border-secondary bg-white px-4 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="mb-3 block text-sm font-semibold text-text-primary">
                    Address
                  </label>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                    {/* Region */}
                    <div>
                      <label
                        htmlFor="region"
                        className="mb-2 block text-xs font-semibold text-text-secondary"
                      >
                        Region
                      </label>

                      <SelectField
                        id="region"
                        name="region"
                        value={formData.region}
                        onChange={handleRegionChange}
                        options={REGIONS}
                        placeholder="Select region"
                      />
                    </div>

                    {/* Province */}
                    <div>
                      <label
                        htmlFor="province"
                        className="mb-2 block text-xs font-semibold text-text-secondary"
                      >
                        Province
                      </label>

                      <SelectField
                        id="province"
                        name="province"
                        value={formData.province}
                        onChange={handleProvinceChange}
                        options={provinces}
                        placeholder="Select province"
                        disabled={!formData.region}
                      />
                    </div>

                    {/* City / Municipality */}
                    <div>
                      <label
                        htmlFor="city"
                        className="mb-2 block whitespace-nowrap text-xs font-semibold text-text-secondary"
                      >
                        City / Municipality
                      </label>

                      <SelectField
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleCityChange}
                        options={cities}
                        placeholder="Select city / municipality"
                        disabled={!formData.province}
                      />
                    </div>

                    {/* Barangay */}
                    <div>
                      <label
                        htmlFor="barangay"
                        className="mb-2 block text-xs font-semibold text-text-secondary"
                      >
                        Barangay
                      </label>

                      {barangays.length > 0 ? (
                        <SelectField
                          id="barangay"
                          name="barangay"
                          value={formData.barangay}
                          onChange={handleChange}
                          options={barangays}
                          placeholder="Select barangay"
                          disabled={!formData.city}
                        />
                      ) : (
                        <input
                          id="barangay"
                          name="barangay"
                          type="text"
                          value={formData.barangay}
                          onChange={handleChange}
                          placeholder="Enter barangay"
                          className="h-12 w-full rounded-lg border border-border-secondary bg-white px-4 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                      )}
                    </div>

                    {/* Postal Code */}
                    <div>
                      <label
                        htmlFor="postalCode"
                        className="mb-2 block text-xs font-semibold text-text-secondary"
                      >
                        Postal Code
                      </label>

                      <input
                        id="postalCode"
                        name="postalCode"
                        type="text"
                        value={formData.postalCode}
                        onChange={handleChange}
                        placeholder="Enter postal code"
                        className="h-12 w-full rounded-lg border border-border-secondary bg-white px-4 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>

                    {/* Street Address */}
                    <div>
                      <label
                        htmlFor="streetAddress"
                        className="mb-2 block whitespace-nowrap text-xs font-semibold text-text-secondary"
                      >
                        Street Address
                      </label>

                      <input
                        id="streetAddress"
                        name="streetAddress"
                        type="text"
                        value={formData.streetAddress}
                        onChange={handleChange}
                        placeholder="House / Building No. & Street"
                        className="h-12 w-full rounded-lg border border-border-secondary bg-white px-4 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>

                  </div>
                </div>

              </div>

              {/* Buttons */}
              <div className="mt-8 flex flex-col-reverse gap-3 border-t border-border-light pt-6 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={handleBack}
                  className="h-12 rounded-lg border border-border-secondary bg-white px-6 text-sm font-semibold uppercase tracking-[0.6px] text-text-primary transition-colors hover:bg-background-accent"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex h-12 items-center justify-center gap-2 rounded-lg bg-button-background px-6 text-sm font-semibold uppercase tracking-[0.6px] text-white shadow-sm transition-colors hover:bg-button-hover"
                >
                  <Save size={17} />
                  Save Changes
                </button>

              </div>
            </form>
          </div>
        </main>
      </div>

      {/* Confirm Changes Modal */}
      {showWarning && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-[500px] rounded-xl bg-white shadow-2xl">

            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-border-light px-6 py-5">

              <div className="flex items-start gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFF4D6] text-[#C58A00]">
                  <AlertTriangle size={20} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-text-primary">
                    Confirm Changes
                  </h2>

                  <p className="mt-1 text-sm text-text-secondary">
                    Please review the changes before saving.
                  </p>
                </div>

              </div>

              <button
                type="button"
                onClick={handleCancelWarning}
                className="rounded-lg p-1 text-text-secondary transition-colors hover:bg-background-accent"
                aria-label="Close"
              >
                <X size={20} />
              </button>

            </div>

            {/* Modal Content */}
            <div className="px-6 py-6">

              <p className="mb-4 text-sm leading-6 text-text-primary">
                You are about to update the information
                for{" "}
                <span className="font-bold">
                  {customer.name}
                </span>
                .
              </p>

              <div className="space-y-4 rounded-lg bg-background-accent p-4">

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.5px] text-text-secondary">
                    Full Name
                  </p>

                  <p className="mt-1 text-sm text-text-primary">
                    {formData.name}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.5px] text-text-secondary">
                    Contact Number
                  </p>

                  <p className="mt-1 text-sm text-text-primary">
                    {formData.contact}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.5px] text-text-secondary">
                    Email Address
                  </p>

                  <p className="mt-1 break-all text-sm text-text-primary">
                    {formData.email}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.5px] text-text-secondary">
                    Address
                  </p>

                  <p className="mt-1 text-sm leading-5 text-text-primary">
                    {[
                      formData.streetAddress,
                      formData.barangay,
                      formData.city,
                      formData.province,
                      formData.region,
                      formData.postalCode,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>

              </div>

              <p className="mt-4 text-xs leading-5 text-text-secondary">
                These changes will be saved to the customer's
                record.
              </p>

            </div>

            {/* Modal Footer */}
            <div className="flex flex-col-reverse gap-3 border-t border-border-light px-6 py-5 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={handleCancelWarning}
                className="h-11 rounded-lg border border-border-secondary bg-white px-5 text-sm font-semibold text-text-primary transition-colors hover:bg-background-accent"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmUpdate}
                className="flex h-11 items-center justify-center gap-2 rounded-lg bg-button-background px-5 text-sm font-semibold text-white transition-colors hover:bg-button-hover"
              >
                <Save size={16} />
                Confirm Changes
              </button>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}