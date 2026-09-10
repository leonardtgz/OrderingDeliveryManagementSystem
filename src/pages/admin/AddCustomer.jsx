import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import AdminSidebar from "../../components/admin/AdminSidebar";
import Header from "../../components/Header/Header";

function AddCustomer() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const newCustomer = {
      id: crypto.randomUUID(),
      name,
      contact,
      email,
      address,
      orders: 0,
    };

    const savedCustomers = localStorage.getItem("adminCustomers");

    let customers = [];

    if (savedCustomers) {
      try {
        customers = JSON.parse(savedCustomers);
      } catch {
        customers = [];
      }
    }

    localStorage.setItem(
      "adminCustomers",
      JSON.stringify([...customers, newCustomer])
    );

    navigate("/admin/customers");
  };

  const handleCancel = () => {
    navigate("/admin/customers");
  };

  return (
    <div className="flex min-h-screen w-full bg-background-main">
      {/* Existing Admin Sidebar */}
      <AdminSidebar />

      {/* Main Application Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Existing Header */}
        <Header />

        <main className="min-w-0 flex-1 overflow-y-auto">
          <div className="w-full px-6 py-8 lg:px-12">
            {/* Page Header */}
            <div className="mb-6">
              <button
                type="button"
                onClick={handleCancel}
                className="mb-1 block text-sm font-semibold uppercase tracking-[0.7px] text-text-accent hover:underline"
              >
                ← Back to Customers
              </button>

              <h1 className="text-3xl font-bold leading-10 tracking-[-0.32px] text-text-primary">
                Add Customer
              </h1>
            </div>

            {/* Add Customer Form */}
            <form
              onSubmit={handleSubmit}
              className="block w-full max-w-[650px] rounded-xl border border-card-border bg-card-background p-7 shadow-card"
            >
              <div className="flex w-full flex-col gap-5">
                {/* Customer Name */}
                <div className="flex w-full flex-col gap-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-semibold text-text-primary"
                  >
                    Customer Name
                  </label>

                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="e.g. John Doe"
                    required
                    className="box-border w-full rounded-lg border border-border-secondary bg-background-card px-3 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Contact Number */}
                <div className="flex w-full flex-col gap-2">
                  <label
                    htmlFor="contact"
                    className="text-sm font-semibold text-text-primary"
                  >
                    Contact Number
                  </label>

                  <input
                    id="contact"
                    type="tel"
                    value={contact}
                    onChange={(event) => setContact(event.target.value)}
                    placeholder="e.g. 0917-123-4567"
                    required
                    className="box-border w-full rounded-lg border border-border-secondary bg-background-card px-3 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Email */}
                <div className="flex w-full flex-col gap-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-semibold text-text-primary"
                  >
                    Email Address
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="e.g. john.doe@email.com"
                    required
                    className="box-border w-full rounded-lg border border-border-secondary bg-background-card px-3 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Address */}
                <div className="flex w-full flex-col gap-2">
                  <label
                    htmlFor="address"
                    className="text-sm font-semibold text-text-primary"
                  >
                    Address
                  </label>

                  <textarea
                    id="address"
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    placeholder="e.g. 123 Mabini St., Brgy. San Lorenzo, Makati"
                    required
                    rows={3}
                    className="box-border w-full resize-none rounded-lg border border-border-secondary bg-background-card px-3 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Buttons */}
                <div className="flex w-full items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="rounded-lg border border-border-secondary px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.7px] text-text-accent transition-colors hover:bg-background-accent"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="rounded-lg bg-button-background px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.7px] text-white shadow-sm transition-colors hover:bg-button-hover"
                  >
                    Save Customer
                  </button>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AddCustomer;