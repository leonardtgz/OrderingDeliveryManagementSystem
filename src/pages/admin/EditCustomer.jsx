import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  Save,
  X,
} from "lucide-react";

import AdminSidebar from "../../components/admin/AdminSidebar";
import Header from "../../components/Header/Header";

export default function EditCustomer() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [customer, setCustomer] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    address: "",
  });

  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const savedCustomers =
      localStorage.getItem("adminCustomers");

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
        address: foundCustomer.address || "",
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

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.contact.trim() ||
      !formData.email.trim() ||
      !formData.address.trim()
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
      localStorage.getItem("adminCustomers");

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

          return {
            ...item,
            name: formData.name.trim(),
            contact: formData.contact.trim(),
            email: formData.email.trim(),
            address: formData.address.trim(),

            // Keep existing order count.
            orders: item.orders || 0,
          };
        },
      );

      localStorage.setItem(
        "adminCustomers",
        JSON.stringify(updatedCustomers),
      );

      // Tell Customers.jsx that a customer was updated.
      window.dispatchEvent(
        new Event("customerUpdated"),
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
                  <label
                    htmlFor="address"
                    className="mb-2 block text-sm font-semibold text-text-primary"
                  >
                    Address
                  </label>

                  <textarea
                    id="address"
                    name="address"
                    rows={4}
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter complete address"
                    className="w-full resize-none rounded-lg border border-border-secondary bg-white px-4 py-3 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
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
                    {formData.address}
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