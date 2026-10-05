import React from "react";
import { Link } from "react-router-dom";

const adminLinks = [
  { label: "Dashboard", to: "/admin/dashboard" },
  { label: "Products", to: "/admin/products" },
  { label: "Customers", to: "/admin/customers" },
  { label: "Orders", to: "/admin/orders" },
  { label: "Deliveries", to: "/admin/deliveries" },
];

function AdminFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border-light bg-white text-text-primary">
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-5 px-5 py-5 sm:px-6 md:grid-cols-3 md:gap-8 md:py-6">
        {/* Brand */}
        <div className="flex min-w-0 flex-col gap-2">
          <div>
            <h2 className="text-base font-extrabold tracking-tight">
              GoldenPR
            </h2>

            <p className="text-[11px] text-text-secondary">
              Administration Portal
            </p>
          </div>

          <p className="min-w-[250px] text-xs leading-5 text-text-secondary">
            Manage products, monitor customer orders, and maintain daily
            water-delivery operations from one place.
          </p>
        </div>

        {/* Admin navigation */}
        <div>
          <h3 className="mb-2 text-[10px] font-bold uppercase tracking-[1px] text-text-primary">
            System Navigation
          </h3>

          <nav className="grid grid-cols-2 gap-x-4 gap-y-2">
            {adminLinks.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className="w-fit text-xs text-text-secondary transition-colors hover:text-[#08779D] hover:underline"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Administrative notice */}
        <div>
          <h3 className="mb-2 text-[10px] font-bold uppercase tracking-[1px] text-text-primary">
            Administrative Access
          </h3>

          <p className="text-xs leading-5 text-text-secondary">
            Use authorized accounts when accessing customer orders, product
            information, and administrative functions.
          </p>

          <div className="mt-3 rounded-md bg-[#F0F9FC] p-2.5">
            <p className="text-[11px] font-semibold text-[#08779D]">
              Authorized personnel only
            </p>

            <p className="mt-1 text-[11px] leading-4 text-text-secondary">
              Follow your assigned access permissions when managing system
              records.
            </p>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-border-light bg-[#F6F9FC]">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-1.5 px-5 py-3 text-[10px] text-text-secondary sm:px-6 md:flex-row md:items-center md:justify-between">
          <p>© {currentYear} GoldenPR. All rights reserved.</p>

          <p>System Administration and Operations</p>
        </div>
      </div>
    </footer>
  );
}

export default AdminFooter;