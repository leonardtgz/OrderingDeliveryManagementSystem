import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import Header from "../../components/Header/Header";

const customers = [
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
];

export default function Customers() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return customers;
    }

    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.contact.toLowerCase().includes(query) ||
        customer.address.toLowerCase().includes(query),
    );
  }, [search]);

  return (
    <div className="flex min-h-screen w-full bg-background-main">
      <AdminSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />

        <main className="min-w-0 flex-1 overflow-y-auto">
          <div className="flex w-full flex-col items-start gap-8 p-6 lg:p-12">
            {/* Page Header */}
            <div className="flex w-full flex-col items-start gap-4 self-stretch pb-3 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="text-2xl font-bold leading-10 tracking-[-0.32px] text-text-primary lg:text-[32px]">
                Customer Management
              </h2>

              <button
                type="button"
                onClick={() => navigate("/admin/customers/new")}
                className="flex h-12 items-center gap-2 rounded-lg bg-button-background px-6 text-sm font-semibold uppercase tracking-[0.7px] text-white shadow-sm transition-colors hover:bg-button-hover"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="shrink-0"
                >
                  <path
                    d="M6 8H0V6H6V0H8V6H14V8H8V14H6V8Z"
                    fill="currentColor"
                  />
                </svg>

                <span>New Customer</span>
              </button>
            </div>

            {/* Search Section */}
            <div className="flex w-full flex-col items-start gap-6 self-stretch rounded-lg bg-background-accent p-6">
              <div className="relative w-full max-w-[880px]">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
                >
                  <path
                    d="M16.6 18L10.3 11.7C9.8 12.1 9.225 12.4167 8.575 12.65C7.925 12.8833 7.23333 13 6.5 13C4.68333 13 3.14583 12.3708 1.8875 11.1125C0.629167 9.85417 0 8.31667 0 6.5C0 4.68333 0.629167 3.14583 1.8875 1.8875C3.14583 0.629167 4.68333 0 6.5 0C8.31667 0 9.85417 0.629167 11.1125 1.8875C12.3708 3.14583 13 4.68333 13 6.5C13 7.23333 12.8833 7.925 12.65 8.575C12.4167 9.225 12.1 9.8 11.7 10.3L18 16.6L16.6 18ZM6.5 11C7.75 11 8.8125 10.5625 9.6875 9.6875C10.5625 8.8125 11 7.75 11 6.5C11 5.25 10.5625 4.1875 9.6875 3.3125C8.8125 2.4375 7.75 2 6.5 2C5.25 2 4.1875 2.4375 3.3125 3.3125C2.4375 4.1875 2 5.25 2 6.5C2 7.75 2.4375 8.8125 3.3125 9.6875 4.1875 10.5625 5.25 11 6.5 11Z"
                    fill="#2CA6D8"
                  />
                </svg>

                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search customers..."
                  className="h-12 w-full rounded-lg border border-border-secondary bg-white pl-10 pr-4 text-base text-text-primary placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Customer Table */}
            <div className="flex w-full flex-1 flex-col items-start self-stretch overflow-hidden rounded-lg border border-card-border bg-card-background">
              <div className="w-full overflow-x-auto">
                <table className="w-full min-w-[800px] border-collapse">
                  <thead>
                    <tr className="border-b border-border-light bg-background-accent">
                      <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-[0.7px] text-text-primary">
                        Name
                      </th>

                      <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-[0.7px] text-text-primary">
                        Contact Number
                      </th>

                      <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-[0.7px] text-text-primary">
                        Email
                      </th>

                      <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-[0.7px] text-text-primary">
                        Address
                      </th>

                      <th className="px-4 py-4 text-center text-sm font-semibold uppercase tracking-[0.7px] text-text-primary">
                        # Orders
                      </th>

                      <th className="px-4 py-4 text-right text-sm font-semibold uppercase tracking-[0.7px] text-text-primary">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="bg-card-background">
                    {filteredCustomers.map((customer, index) => (
                      <tr
                        key={customer.id}
                        className={
                          index > 0 ? "border-t border-border-light" : ""
                        }
                      >
                        <td className="px-4 py-8 text-base font-bold text-text-primary">
                          {customer.name}
                        </td>

                        <td className="px-4 py-8 text-base text-text-primary">
                          {customer.contact}
                        </td>

                        <td className="px-4 py-8 text-base text-text-secondary">
                          {customer.email}
                        </td>

                        <td className="px-4 py-8 text-base text-text-primary">
                          {customer.address}
                        </td>

                        <td className="px-4 py-8 text-center text-base font-bold text-text-primary">
                          {customer.orders}
                        </td>

                        <td className="px-4 py-8 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/admin/customers/${customer.id}`)
                            }
                            className="rounded-lg px-3 py-2 text-sm font-semibold uppercase tracking-[0.7px] text-text-accent transition-colors hover:bg-background-accent"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}

                    {filteredCustomers.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-4 py-12 text-center text-base text-text-secondary"
                        >
                          No customers found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Footer */}
              <div className="flex w-full flex-col items-center gap-3 border-t border-border-light bg-background-accent p-4 sm:flex-row sm:justify-between">
                <span className="text-base text-text-primary">
                  Showing{" "}
                  {filteredCustomers.length > 0
                    ? `1-${filteredCustomers.length}`
                    : "0"}{" "}
                  of {customers.length} customers
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled
                    aria-label="Previous page"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-border-secondary bg-white opacity-50"
                  >
                    <svg
                      width="8"
                      height="12"
                      viewBox="0 0 8 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 12L0 6L6 0L7.4 1.4L2.8 6L7.4 10.6L6 12Z"
                        fill="#123047"
                      />
                    </svg>
                  </button>

                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-button-background bg-button-background text-base font-bold text-white"
                  >
                    1
                  </button>

                  <button
                    type="button"
                    disabled
                    aria-label="Next page"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-border-secondary bg-white opacity-50"
                  >
                    <svg
                      width="8"
                      height="12"
                      viewBox="0 0 8 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.6 6L0 1.4L1.4 0L7.4 6L1.4 10.6L0 12L4.6 6Z"
                        fill="#123047"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}