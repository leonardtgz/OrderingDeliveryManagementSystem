import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AdminSidebar from "../../components/admin/AdminSidebar";
import Header from "../../components/Header/Header";

const defaultCustomers = [
  {
    id: "1",
    name: "John Doe",
    contact: "0917-123-4567",
    email: "john.doe@email.com",
    address: "123 Mabini St., Brgy. San Lorenzo, Makati",
    orders: 24,
    status: "Active",
  },
  {
    id: "2",
    name: "Jane Smith",
    contact: "0920-987-6543",
    email: "j.smith@email.com",
    address: "Unit 4B, The Residences, BGC, Taguig",
    orders: 8,
    status: "Active",
  },
  {
    id: "3",
    name: "Maria Santos",
    contact: "0917-555-0192",
    email: "maria.santos@email.com",
    address:
      "Block 4, Lot 12, Phase 2, Sunnyvale Subdivision, Brgy. San Jose, Antipolo",
    orders: 2,
    status: "Active",
  },
];

const orderHistory = {
  "1": [
    {
      id: "TRX-8921",
      date: "Oct 24, 2023",
      items: "2x Round Gallon",
      amount: "PHP 80.00",
      status: "COMPLETED",
    },
    {
      id: "TRX-8915",
      date: "Oct 18, 2023",
      items: "1x Slim Gallon",
      amount: "PHP 50.00",
      status: "COMPLETED",
    },
  ],

  "2": [
    {
      id: "TRX-7854",
      date: "Oct 20, 2023",
      items: "3x Round Gallon",
      amount: "PHP 120.00",
      status: "COMPLETED",
    },
  ],

  "3": [
    {
      id: "ORD-2023-104",
      date: "Oct 24, 2023",
      items: "5x 5-Gallon Round Refill",
      amount: "PHP 150.00",
      status: "PROCESSING",
    },
    {
      id: "ORD-2023-098",
      date: "Oct 18, 2023",
      items: "2x Slim Gallon Refill",
      amount: "PHP 100.00",
      status: "COMPLETED",
    },
  ],
};

function ViewCustomer() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [customers, setCustomers] = useState([]);

  // Load customers from localStorage
  useEffect(() => {
    const savedCustomers = localStorage.getItem("adminCustomers");

    if (savedCustomers) {
      try {
        const parsedCustomers = JSON.parse(savedCustomers);

        if (Array.isArray(parsedCustomers)) {
          setCustomers(parsedCustomers);
          return;
        }
      } catch {
        // Use default customers if localStorage data is invalid
      }
    }

    // If there are no saved customers yet, use the default customers
    setCustomers(defaultCustomers);
  }, []);

  // Find the selected customer using the URL id
  const customer = useMemo(() => {
    return customers.find((item) => String(item.id) === String(id));
  }, [customers, id]);

  // Get existing order history for default customers
  const existingOrderHistory = orderHistory[String(id)] || [];

  // For newly added customers, there will normally be no history yet
  const customerOrders = existingOrderHistory;

  const handleBack = () => {
    navigate("/admin/customers");
  };

  if (!customer) {
    return (
      <div className="flex min-h-screen w-full bg-background-main">
        <AdminSidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <Header />

          <main className="min-w-0 flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-[1100px] px-5 py-8 sm:px-7">
              <button
                type="button"
                onClick={handleBack}
                className="mb-5 text-sm font-semibold uppercase tracking-[0.7px] text-text-accent hover:underline"
              >
                ← Back to Customers
              </button>

              <div className="rounded-xl border border-card-border bg-card-background p-10 text-center shadow-card">
                <h1 className="text-xl font-bold text-text-primary">
                  Customer Not Found
                </h1>

                <p className="mt-2 text-sm text-text-secondary">
                  The customer you are looking for does not exist.
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const completedOrders = customerOrders.filter(
    (order) => order.status === "COMPLETED",
  ).length;

  return (
    <div className="flex min-h-screen w-full bg-background-main">
      <AdminSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />

        <main className="min-w-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1100px] px-5 py-8 sm:px-7">
            {/* Page Header */}
            <div className="mb-6">
              <button
                type="button"
                onClick={handleBack}
                className="mb-3 text-sm font-semibold uppercase tracking-[0.7px] text-text-accent hover:underline"
              >
                ← Back to Customers
              </button>

              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h1 className="text-3xl font-bold leading-10 tracking-[-0.32px] text-text-primary">
                    Customer Details
                  </h1>

                  <p className="mt-1 text-sm text-text-secondary">
                    View customer information and order history
                  </p>
                </div>

                <span className="rounded-full border border-secondary-medium bg-background-lightBlue px-4 py-2 text-xs font-semibold uppercase tracking-[0.7px] text-text-secondary">
                  {customer.status || "Active"}
                </span>
              </div>
            </div>

            {/* Customer Information */}
            <section className="mb-6 w-full rounded-xl border border-card-border bg-card-background p-6 shadow-card">
              <h2 className="mb-5 text-sm font-bold uppercase tracking-[0.7px] text-text-primary">
                Customer Information
              </h2>

              <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Customer Name */}
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-[0.7px] text-text-secondary">
                    Full Name
                  </p>

                  <p className="text-base font-bold text-text-primary">
                    {customer.name}
                  </p>
                </div>

                {/* Contact */}
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-[0.7px] text-text-secondary">
                    Contact Number
                  </p>

                  <p className="text-base text-text-primary">
                    {customer.contact}
                  </p>
                </div>

                {/* Email */}
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-[0.7px] text-text-secondary">
                    Email Address
                  </p>

                  <p className="text-base text-text-primary">
                    {customer.email}
                  </p>
                </div>

                {/* Orders */}
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-[0.7px] text-text-secondary">
                    Total Orders
                  </p>

                  <p className="text-base font-bold text-text-primary">
                    {customer.orders || 0}
                  </p>
                </div>

                {/* Address */}
                <div className="sm:col-span-2">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-[0.7px] text-text-secondary">
                    Address
                  </p>

                  <p className="text-base leading-7 text-text-primary">
                    {customer.address}
                  </p>
                </div>
              </div>
            </section>

            {/* Order Summary */}
            <section className="mb-6 w-full rounded-xl border border-card-border bg-card-background p-6 shadow-card">
              <h2 className="mb-5 text-sm font-bold uppercase tracking-[0.7px] text-text-primary">
                Order Summary
              </h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {/* Total Orders */}
                <div className="rounded-lg bg-background-accent p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.7px] text-text-secondary">
                    Total Orders
                  </p>

                  <p className="mt-2 text-2xl font-bold text-text-primary">
                    {customer.orders || 0}
                  </p>
                </div>

                {/* Completed */}
                <div className="rounded-lg bg-background-accent p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.7px] text-text-secondary">
                    Completed
                  </p>

                  <p className="mt-2 text-2xl font-bold text-text-primary">
                    {completedOrders}
                  </p>
                </div>

                {/* Customer Status */}
                <div className="rounded-lg bg-background-accent p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.7px] text-text-secondary">
                    Customer Status
                  </p>

                  <p className="mt-2 text-base font-bold text-text-accent">
                    {customer.status || "Active"}
                  </p>
                </div>
              </div>
            </section>

            {/* Order History */}
            <section className="w-full overflow-hidden rounded-xl border border-card-border bg-card-background shadow-card">
              <div className="border-b border-border-light px-6 py-5">
                <h2 className="text-sm font-bold uppercase tracking-[0.7px] text-text-primary">
                  Recent Order History
                </h2>
              </div>

              <div className="w-full overflow-x-auto">
                {customerOrders.length > 0 ? (
                  <table className="w-full min-w-[650px] border-collapse">
                    <thead>
                      <tr className="border-b border-table-border bg-background-accent">
                        <th className="p-5 text-left text-xs font-semibold uppercase tracking-[0.7px] text-text-secondary">
                          Order
                        </th>

                        <th className="p-5 text-left text-xs font-semibold uppercase tracking-[0.7px] text-text-secondary">
                          Date
                        </th>

                        <th className="p-5 text-left text-xs font-semibold uppercase tracking-[0.7px] text-text-secondary">
                          Items
                        </th>

                        <th className="p-5 text-right text-xs font-semibold uppercase tracking-[0.7px] text-text-secondary">
                          Amount
                        </th>

                        <th className="p-5 text-center text-xs font-semibold uppercase tracking-[0.7px] text-text-secondary">
                          Status
                        </th>
                      </tr>
                    </thead>

                    <tbody className="bg-card-background">
                      {customerOrders.map((order, index) => (
                        <tr
                          key={order.id}
                          className={
                            index > 0
                              ? "border-t border-table-border"
                              : ""
                          }
                        >
                          <td className="p-5 text-sm font-bold text-text-primary">
                            #{order.id}
                          </td>

                          <td className="p-5 text-sm text-text-primary">
                            {order.date}
                          </td>

                          <td className="p-5 text-sm text-text-secondary">
                            {order.items}
                          </td>

                          <td className="p-5 text-right text-sm font-semibold text-text-primary">
                            {order.amount}
                          </td>

                          <td className="p-5 text-center">
                            <span
                              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.7px] ${
                                order.status === "PROCESSING"
                                  ? "border-secondary-medium bg-background-lightBlue text-text-accent"
                                  : "border-secondary-medium bg-background-lightBlue text-text-secondary"
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-8 text-center text-sm text-text-secondary">
                    No order history available for this customer.
                  </div>
                )}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ViewCustomer;