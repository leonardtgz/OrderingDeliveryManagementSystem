import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

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
  },
  {
    id: "2",
    name: "Jane Smith",
    contact: "0920-987-6543",
    email: "j.smith@email.com",
    address: "Unit 4B, The Residences, BGC, Taguig",
    orders: 8,
  },
  {
    id: "3",
    name: "Maria Santos",
    contact: "0917-555-0192",
    email: "maria.santos@email.com",
    address:
      "Block 4, Lot 12, Phase 2, Sunnyvale Subdivision, Brgy. San Jose, Antipolo",
    orders: 2,
  },
];

export default function Customers() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState([]);

  const [customerToDelete, setCustomerToDelete] =
    useState(null);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  // Load customers
  useEffect(() => {
    const savedCustomers =
      localStorage.getItem("adminCustomers");

    if (savedCustomers) {
      try {
        const parsedCustomers = JSON.parse(savedCustomers);

        if (Array.isArray(parsedCustomers)) {
          setCustomers(parsedCustomers);
          return;
        }
      } catch {
        // Ignore invalid localStorage data
      }
    }

    setCustomers(defaultCustomers);

    localStorage.setItem(
      "adminCustomers",
      JSON.stringify(defaultCustomers),
    );
  }, []);

  // Listen for customer changes
  useEffect(() => {
    const handleCustomerUpdate = () => {
      const savedCustomers =
        localStorage.getItem("adminCustomers");

      if (!savedCustomers) {
        return;
      }

      try {
        const parsedCustomers = JSON.parse(savedCustomers);

        if (Array.isArray(parsedCustomers)) {
          setCustomers(parsedCustomers);
        }
      } catch {
        // Ignore invalid localStorage data
      }
    };

    // Updates from another browser tab/window
    window.addEventListener(
      "storage",
      handleCustomerUpdate,
    );

    // Updates from the same tab
    window.addEventListener(
      "customerUpdated",
      handleCustomerUpdate,
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleCustomerUpdate,
      );

      window.removeEventListener(
        "customerUpdated",
        handleCustomerUpdate,
      );
    };
  }, []);

  // Search
  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return customers;
    }

    return customers.filter((customer) => {
      const name = String(
        customer.name || "",
      ).toLowerCase();

      const email = String(
        customer.email || "",
      ).toLowerCase();

      const contact = String(
        customer.contact || "",
      ).toLowerCase();

      const address = String(
        customer.address || "",
      ).toLowerCase();

      return (
        name.includes(query) ||
        email.includes(query) ||
        contact.includes(query) ||
        address.includes(query)
      );
    });
  }, [search, customers]);

  // Edit customer
  const handleEdit = (customer) => {
    navigate(
      `/admin/customers/${customer.id}/edit`,
    );
  };

  // Delete customer
  const handleDeleteClick = (customer) => {
    const orderCount = Number(
      customer.orders || 0,
    );

    if (orderCount > 0) {
      window.alert(
        "This customer cannot be deleted because they have existing orders.",
      );

      return;
    }

    setCustomerToDelete(customer);
    setShowDeleteModal(true);
  };

  // Confirm delete
  const handleConfirmDelete = () => {
    if (!customerToDelete) {
      return;
    }

    const updatedCustomers = customers.filter(
      (customer) =>
        String(customer.id) !==
        String(customerToDelete.id),
    );

    setCustomers(updatedCustomers);

    localStorage.setItem(
      "adminCustomers",
      JSON.stringify(updatedCustomers),
    );

    // Notify other components/pages
    window.dispatchEvent(
      new Event("customerUpdated"),
    );

    setCustomerToDelete(null);
    setShowDeleteModal(false);
  };

  // Cancel delete
  const handleCancelDelete = () => {
    setCustomerToDelete(null);
    setShowDeleteModal(false);
  };

  return (
    <div className="flex min-h-screen w-full bg-background-main">
      <AdminSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />

        <main className="min-w-0 flex-1 overflow-y-auto">
          <div className="flex w-full flex-col items-start gap-8 p-6 lg:p-12">

            {/* Page Header */}
            <div className="flex w-full flex-col items-start gap-4 self-stretch pb-3 sm:flex-row sm:items-end sm:justify-between">

              <div>
                <h2 className="text-2xl font-bold leading-10 tracking-[-0.32px] text-text-primary lg:text-[32px]">
                  Customer Management
                </h2>

                <p className="mt-1 text-sm text-text-secondary">
                  Manage customer information and accounts.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate("/admin/customers/new")
                }
                className="flex h-12 items-center gap-2 rounded-lg bg-button-background px-6 text-sm font-semibold uppercase tracking-[0.7px] text-white shadow-sm transition-colors hover:bg-button-hover"
              >
                <Plus size={18} />
                <span>New Customer</span>
              </button>

            </div>

            {/* Search */}
            <div className="w-full">
              <div className="relative w-full max-w-[500px]">

                <Search
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search customers..."
                  className="h-12 w-full rounded-lg border border-border-secondary bg-white pl-11 pr-10 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-text-secondary hover:bg-background-accent"
                    aria-label="Clear search"
                  >
                    <X size={17} />
                  </button>
                )}

              </div>
            </div>

            {/* Customer Table */}
            <div className="w-full overflow-hidden rounded-xl border border-card-border bg-card-background">

              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] border-collapse">

                  <thead>
                    <tr className="border-b border-border-light bg-background-accent">

                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.7px] text-text-secondary">
                        Customer
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.7px] text-text-secondary">
                        Contact
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.7px] text-text-secondary">
                        Email
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.7px] text-text-secondary">
                        Address
                      </th>

                      <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-[0.7px] text-text-secondary">
                        Orders
                      </th>

                      <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-[0.7px] text-text-secondary">
                        Actions
                      </th>

                    </tr>
                  </thead>

                  <tbody>

                    {filteredCustomers.length > 0 ? (
                      filteredCustomers.map(
                        (customer) => (
                          <tr
                            key={customer.id}
                            className="border-b border-border-light last:border-b-0 hover:bg-background-accent/50"
                          >

                            {/* Customer */}
                            <td className="px-6 py-5">
                              <div className="font-semibold text-text-primary">
                                {customer.name}
                              </div>
                            </td>

                            {/* Contact */}
                            <td className="px-6 py-5 text-sm text-text-primary">
                              {customer.contact}
                            </td>

                            {/* Email */}
                            <td className="px-6 py-5 text-sm text-text-primary">
                              {customer.email}
                            </td>

                            {/* Address */}
                            <td className="max-w-[280px] px-6 py-5 text-sm leading-5 text-text-secondary">
                              {customer.address}
                            </td>

                            {/* Orders */}
                            <td className="px-6 py-5 text-center">
                              <span className="inline-flex min-w-[40px] items-center justify-center rounded-full bg-background-lightBlue px-3 py-1 text-sm font-semibold text-text-accent">
                                {customer.orders || 0}
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="px-6 py-5">

                              <div className="flex items-center justify-center gap-2">

                                {/* View Details */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    navigate(
                                      `/admin/customers/${customer.id}`,
                                    )
                                  }
                                  className="rounded-lg px-3 py-2 text-sm font-semibold text-text-accent transition-colors hover:bg-background-lightBlue"
                                >
                                  View Details
                                </button>

                                {/* Edit */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleEdit(
                                      customer,
                                    )
                                  }
                                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-text-accent transition-colors hover:bg-background-lightBlue"
                                >
                                  <Pencil size={15} />
                                  Edit
                                </button>

                                {/* Delete */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDeleteClick(
                                      customer,
                                    )
                                  }
                                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                                >
                                  <Trash2 size={15} />
                                  Delete
                                </button>

                              </div>

                            </td>

                          </tr>
                        ),
                      )
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 py-12 text-center"
                        >
                          <div className="text-sm font-semibold text-text-primary">
                            No customers found
                          </div>

                          <p className="mt-1 text-sm text-text-secondary">
                            Try adjusting your search.
                          </p>
                        </td>
                      </tr>
                    )}

                  </tbody>

                </table>
              </div>

              {/* Table Footer */}
              <div className="flex items-center justify-between border-t border-border-light px-6 py-4">
                <p className="text-sm text-text-secondary">
                  Showing{" "}
                  <span className="font-semibold text-text-primary">
                    {filteredCustomers.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-text-primary">
                    {customers.length}
                  </span>{" "}
                  customers
                </p>
              </div>

            </div>
          </div>
        </main>
      </div>

      {/* Delete Warning Modal */}
      {showDeleteModal && customerToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-[460px] rounded-xl bg-white shadow-2xl">

            {/* Modal Header */}
            <div className="flex items-start justify-between px-6 pt-6">

              <div className="flex items-start gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                  <AlertTriangle size={20} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-text-primary">
                    Delete Customer
                  </h2>

                  <p className="mt-1 text-sm text-text-secondary">
                    This action cannot be undone.
                  </p>
                </div>

              </div>

              <button
                type="button"
                onClick={handleCancelDelete}
                className="rounded-lg p-1 text-text-secondary hover:bg-background-accent"
                aria-label="Close"
              >
                <X size={20} />
              </button>

            </div>

            {/* Modal Content */}
            <div className="px-6 py-6">

              <p className="text-sm leading-6 text-text-primary">
                Are you sure you want to delete{" "}
                <span className="font-bold">
                  {customerToDelete.name}
                </span>
                ?
              </p>

              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">

                <div className="flex gap-3">

                  <Trash2
                    size={18}
                    className="mt-0.5 shrink-0 text-red-600"
                  />

                  <p className="text-sm leading-5 text-red-700">
                    This customer will be permanently
                    removed from the customer management
                    list.
                  </p>

                </div>

              </div>

            </div>

            {/* Modal Footer */}
            <div className="flex flex-col-reverse gap-3 border-t border-border-light px-6 py-5 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={handleCancelDelete}
                className="h-11 rounded-lg border border-border-secondary bg-white px-5 text-sm font-semibold text-text-primary hover:bg-background-accent"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex h-11 items-center justify-center gap-2 rounded-lg bg-red-600 px-5 text-sm font-semibold text-white hover:bg-red-700"
              >
                <Trash2 size={16} />
                Delete Customer
              </button>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}