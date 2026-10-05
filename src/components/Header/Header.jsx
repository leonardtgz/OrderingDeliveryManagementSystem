import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserRound, Bell, LogOut } from "lucide-react";

import userIcon from "../../assets/images/img_user_light_blue_900.svg";
import goldenPRLogo from "../../assets/images/goldenpr-logo.png";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showToast, setShowToast] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const toastTimeoutRef = useRef(null);
  const profileMenuRef = useRef(null);

  const isCustomer = location.pathname.startsWith("/customer");
  const isAdmin = location.pathname.startsWith("/admin");

  const customerNavigationItems = [
    { id: "products", label: "Products", path: "/customer/products" },
    { id: "orders", label: "Order", path: "/customer/orders" },
  ];

  useEffect(() => {
    const showUpdateToast = () => {
      setShowToast(false);

      window.clearTimeout(toastTimeoutRef.current);

      requestAnimationFrame(() => {
        setShowToast(true);

        toastTimeoutRef.current = window.setTimeout(() => {
          setShowToast(false);
        }, 3000);
      });
    };

    window.addEventListener("orderUpdated", showUpdateToast);
    window.addEventListener("ordersUpdated", showUpdateToast);

    const handleStorageUpdate = (event) => {
      if (event.key === "goldenpr_orders") {
        showUpdateToast();
      }
    };

    window.addEventListener("storage", handleStorageUpdate);

    return () => {
      window.removeEventListener("orderUpdated", showUpdateToast);
      window.removeEventListener("ordersUpdated", showUpdateToast);
      window.removeEventListener("storage", handleStorageUpdate);
      window.clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleProfileClick = () => {
    setShowProfileMenu((current) => !current);
  };

  const handleMenuNavigation = (path) => {
    setShowProfileMenu(false);
    navigate(path);
  };

  const handleLogout = () => {
    setShowProfileMenu(false);
    navigate("/login");
  };

  const handleLogoClick = () => {
    if (isCustomer) {
      navigate("/customer/home");
    } else if (isAdmin) {
      navigate("/admin/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      <header className="sticky top-0 z-[100] flex h-16 w-full items-center border-b border-border-light bg-background-card px-3 shadow-sm sm:px-6 md:px-10">
        {/* Logo anchored to the far left */}
        <button
          type="button"
          onClick={handleLogoClick}
          aria-label="GoldenPR home"
          className="flex shrink-0 items-center gap-1.5 sm:gap-2"
        >
          <img
            src={goldenPRLogo}
            alt="GoldenPR"
            className="h-7 w-auto object-contain sm:h-9"
          />

          <span className="text-base font-bold tracking-tight text-[#08779D] sm:text-lg">
            GoldenPR
          </span>
        </button>

        {/* Navigation and profile grouped at the far right */}
        <div className="ml-auto flex min-w-0 items-center justify-end gap-2 sm:gap-6 md:gap-8">
          {isCustomer && (
            <nav
              className="flex min-w-0 items-center justify-end gap-2 sm:gap-7 md:gap-9"
              aria-label="Customer navigation"
            >
              {customerNavigationItems.map((item) => {
                const isActive = location.pathname === item.path;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => navigate(item.path)}
                    aria-current={isActive ? "page" : undefined}
                    className="group relative flex h-12 shrink-0 items-center px-1 text-xs font-semibold text-text-primary transition-colors duration-200 hover:text-[#08779D] sm:text-sm"
                  >
                    {item.label}

                    <span
                      className={`absolute bottom-0 left-0 h-[4px] rounded-full bg-[#08779D] transition-all duration-300 ease-out ${
                        isActive
                          ? "w-full"
                          : "w-0 group-hover:w-full"
                      }`}
                    />
                  </button>
                );
              })}
            </nav>
          )}

          {/* Profile Dropdown — no chevron */}
          <div
            className="relative flex shrink-0 items-center"
            ref={profileMenuRef}
          >
            <button
              type="button"
              onClick={handleProfileClick}
              aria-label="Open profile menu"
              aria-haspopup="menu"
              aria-expanded={showProfileMenu}
              className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-200 hover:bg-background-accent sm:h-11 sm:w-11 ${
                showProfileMenu ? "bg-background-accent" : ""
              }`}
            >
              <img
                src={userIcon}
                alt=""
                className="h-4 w-4 object-contain sm:h-5 sm:w-5"
              />
            </button>

            {showProfileMenu && (
              <div
                role="menu"
                aria-label="Profile menu"
                className="absolute right-0 top-full z-[150] mt-2 w-52 origin-top-right overflow-hidden rounded-xl border border-border-light bg-white p-1.5 shadow-[0_12px_35px_rgba(0,0,0,0.14)]"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={() =>
                    handleMenuNavigation(
                      isAdmin
                        ? "/admin/profile"
                        : "/customer/profile"
                    )
                  }
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium text-text-primary transition-all duration-200 hover:bg-[#EAF6FA] hover:pl-4 hover:text-[#08779D]"
                >
                  <UserRound
                    size={17}
                    className="shrink-0 text-text-secondary"
                  />
                  <span>Profile</span>
                </button>

                <button
                  type="button"
                  role="menuitem"
                  onClick={() =>
                    handleMenuNavigation(
                      isAdmin
                        ? "/admin/notifications"
                        : "/customer/notifications"
                    )
                  }
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium text-text-primary transition-all duration-200 hover:bg-[#EAF6FA] hover:pl-4 hover:text-[#08779D]"
                >
                  <Bell
                    size={17}
                    className="shrink-0 text-text-secondary"
                  />
                  <span>Notification</span>
                </button>

                <div className="my-1 border-t border-border-light" />

                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium text-red-600 transition-all duration-200 hover:bg-red-50 hover:pl-4 hover:text-red-700"
                >
                  <LogOut size={17} className="shrink-0" />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Order Update Toast */}
      <div
        className={`pointer-events-none fixed right-4 top-5 z-[200] flex min-w-[230px] items-center gap-3 rounded-lg border border-[#A8DCE8] bg-white px-4 py-3 shadow-lg transition-all duration-300 sm:right-6 ${
          showToast
            ? "translate-x-0 opacity-100"
            : "translate-x-8 opacity-0"
        }`}
        role="status"
        aria-live="polite"
      >
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#08779D] text-white">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
          >
            <path
              d="M5 12.5L9.5 17L19 7.5"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>

        <div className="flex flex-col">
          <span className="text-xs font-bold text-text-primary sm:text-sm">
            Order Updated
          </span>

          <span className="text-[11px] text-text-secondary sm:text-xs">
            Your order information has been updated.
          </span>
        </div>
      </div>
    </>
  );
}

export default Header;