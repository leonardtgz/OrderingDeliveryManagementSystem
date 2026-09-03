import React, { useState } from "react";

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("dashboard");

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
      label: "Orders",
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
    {
      id: "deliveries",
      label: "Deliveries",
      href: "/admin/deliveries",
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
            d="M3 6h11v11H3zM14 10h4l3 3v4h-7z"
          />
          <circle
            cx="7"
            cy="19"
            r="2"
            strokeWidth="2"
          />
          <circle
            cx="18"
            cy="19"
            r="2"
            strokeWidth="2"
          />
        </svg>
      ),
    },
  ];

  const handleNavigation = (item) => {
    setActiveMenu(item.id);
    setIsOpen(false);
  };

  return (
    <>
      {/* ================= MOBILE TOGGLE ================= */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle admin sidebar"
        className="fixed left-4 top-20 z-50 rounded-sm bg-primary-background p-2 text-primary-foreground shadow-lg transition-colors hover:bg-primary-light lg:hidden"
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

      {/* ================= MOBILE OVERLAY ================= */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-primary-dark bg-opacity-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`
          fixed left-0 top-0 z-50 h-screen w-64
          border-r border-border-light
          bg-background-main
          transition-transform duration-300 ease-in-out
          lg:sticky lg:z-auto
          lg:translate-x-0
          ${
            isOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        <div className="flex h-full flex-col">
          {/* ================= SIDEBAR TITLE ================= */}
          <div className="flex h-20 items-center border-b border-border-light px-5">
            <h1 className="text-base font-bold leading-lg text-text-secondary" style={{ fontSize: "18px" }}>
              Admin Panel
            </h1>
          </div>

          {/* ================= NAVIGATION ================= */}
          <nav className="flex-1 overflow-y-auto px-3 py-5">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    onClick={() => handleNavigation(item)}
                    className={`
                      flex w-full items-center gap-3
                      rounded-md px-4 py-3
                       text-sm font-semibold
                      transition-colors duration-200
                      ${
                        activeMenu === item.id
                          ? "bg-primary-background !text-white"
                          : "text-primary-light hover:bg-secondary-light"
                      }
                    `}
                  >
                    {item.icon}

                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* ================= LOGOUT ================= */}
          <div className="border-t border-border-light p-3">
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-md px-4 py-3 text-sm font-semibold text-text-light transition-colors duration-200 hover:bg-secondary-light"
              onClick={() => {
                // Add logout logic here later
              }}
            >
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
                  d="M10 17l5-5-5-5"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12H3M21 19V5a2 2 0 00-2-2h-6"
                />
              </svg>

              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;