import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  LogOut,
  X,
} from "lucide-react";

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] =
    useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <rect
            x="3"
            y="3"
            width="7"
            height="7"
            strokeWidth="2"
          />
          <rect
            x="14"
            y="3"
            width="7"
            height="7"
            strokeWidth="2"
          />
          <rect
            x="3"
            y="14"
            width="7"
            height="7"
            strokeWidth="2"
          />
          <rect
            x="14"
            y="14"
            width="7"
            height="7"
            strokeWidth="2"
          />
        </svg>
      ),
    },
    {
      id: "products",
      label: "Products",
      href: "/admin/products",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 7h16M6 7v13h12V7M9 7V4h6v3"
          />
          <path
            strokeLinecap="round"
            strokeWidth="2"
            d="M9 11h6"
          />
        </svg>
      ),
    },
    {
      id: "customers",
      label: "Customers",
      href: "/admin/customers",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"
          />
          <circle
            cx="9"
            cy="7"
            r="4"
            strokeWidth="2"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
          />
        </svg>
      ),
    },
    {
      id: "orders",
      label: "Orders & Deliveries",
      href: "/admin/orders",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <rect
            x="4"
            y="3"
            width="16"
            height="18"
            rx="2"
            strokeWidth="2"
          />
          <path
            strokeLinecap="round"
            strokeWidth="2"
            d="M8 7h8M8 11h8M8 15h5"
          />
        </svg>
      ),
    },
  ];

  const handleNavigation = (href) => {
    setIsOpen(false);
    navigate(href);
  };

  const handleLogout = () => {
    setShowLogoutModal(false);
    setIsOpen(false);
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Sidebar Toggle */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle admin sidebar"
        className="fixed left-3 top-20 z-[60] rounded-sm bg-primary-background p-2 text-primary-foreground shadow-lg transition-colors hover:bg-primary-light sm:left-4 lg:hidden"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-primary-dark bg-opacity-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-[55] h-screen w-[min(18rem,85vw)]
          border-r border-border-light
          bg-background-main
          transition-transform duration-300 ease-in-out
          lg:sticky lg:z-auto lg:w-64
          lg:translate-x-0
          ${
            isOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        <div className="flex h-full min-h-0 flex-col">
          {/* Sidebar Header */}
          <div className="flex h-20 shrink-0 items-center border-b border-border-light px-5">
            <h1
              className="text-base font-bold leading-lg text-text-secondary"
              style={{ fontSize: "18px" }}
            >
              Admin Panel
            </h1>
          </div>

          {/* Navigation */}
          <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-5">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const isActive =
                  location.pathname === item.href;

                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() =>
                        handleNavigation(item.href)
                      }
                      className={`
                        flex min-h-12 w-full items-center gap-3
                        rounded-md px-4 py-3
                        text-left text-sm font-semibold
                        transition-colors duration-200
                        ${
                          isActive
                            ? "bg-primary-background !text-white"
                            : "text-primary-light hover:bg-secondary-light"
                        }
                      `}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout */}
          <div className="shrink-0 border-t border-border-light p-3">
            <button
              type="button"
              className="flex min-h-12 w-full items-center gap-3 rounded-md px-4 py-3 text-sm font-semibold text-text-light transition-colors duration-200 hover:bg-secondary-light"
              onClick={() =>
                setShowLogoutModal(true)
              }
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Logout Warning Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/25 px-4">
          <div className="w-full max-w-[420px] overflow-hidden rounded-xl border border-red-200 bg-background-card shadow-2xl">
            {/* Modal Body */}
            <div className="px-5 pb-7 pt-8 text-center sm:px-9 sm:pt-9">
              {/* Red Warning Icon */}
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold text-text-primary sm:text-2xl">
                Logout Confirmation
              </h2>

              {/* Message */}
              <p className="mx-auto mt-3 max-w-[320px] text-sm leading-6 text-text-secondary">
                Are you sure you want to log out of your
                admin account?
              </p>
            </div>

            {/* Modal Buttons */}
            <div className="flex flex-col-reverse gap-2 border-t border-red-100 bg-background-main px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:gap-3 sm:px-8">
              {/* Cancel */}
              <button
                type="button"
                onClick={() =>
                  setShowLogoutModal(false)
                }
                className="flex min-h-10 w-full items-center justify-center gap-2 rounded-full border border-border-secondary bg-transparent px-5 text-[11px] font-bold uppercase tracking-[0.5px] text-text-secondary transition-colors hover:bg-background-accent hover:text-text-primary sm:w-auto"
              >
                <X className="h-4 w-4" />
                CANCEL
              </button>

              {/* Confirm Logout */}
              <button
                type="button"
                onClick={handleLogout}
                className="flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-red-600 px-5 text-[11px] font-bold uppercase tracking-[0.5px] text-white shadow-sm transition-colors hover:bg-red-700 sm:w-auto"
              >
                <LogOut className="h-4 w-4" />
                LOG OUT
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;