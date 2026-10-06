import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  CheckCircle2,
  Truck,
  Clock,
  XCircle,
} from "lucide-react";

import userIcon from "../../assets/images/img_user_light_blue_900.svg";
import goldenPRLogo from "../../assets/images/goldenpr-logo.png";
import { getOrders } from "../../utils/orderStorage";

function getNotificationForOrder(order, isCustomer) {
  const status = String(order.status || "").toLowerCase();

  let title = "Order Update";
  let message = isCustomer
    ? "Your order has been updated."
    : "An order has been updated.";
  let Icon = Bell;

  const orderNumber = order.orderNumber || order.id || "Unknown Order";
  const customerName = order.customerName || "Customer";

  if (status.includes("pending") || status.includes("processing")) {
    if (isCustomer) {
      title = "Order Received";
      message = `Your order ${orderNumber} has been received and is being processed.`;
    } else {
      title = "New / Pending Order";
      message = `${orderNumber} from ${customerName} is pending and requires processing.`;
    }

    Icon = Clock;
  } else if (
    status.includes("purifying") ||
    status.includes("confirmed")
  ) {
    title = "Order Confirmed";

    if (isCustomer) {
      message = `Your order ${orderNumber} has been confirmed and is being prepared.`;
    } else {
      message = `${orderNumber} from ${customerName} has been confirmed and is being prepared.`;
    }

    Icon = CheckCircle2;
  } else if (
    status.includes("out for delivery") ||
    status.includes("delivery")
  ) {
    title = "Out for Delivery";

    if (isCustomer) {
      message = `Your order ${orderNumber} is now out for delivery.`;
    } else {
      message = `${orderNumber} for ${customerName} is currently out for delivery.`;
    }

    Icon = Truck;
  } else if (
    status.includes("delivered") ||
    status.includes("completed")
  ) {
    title = "Order Delivered";

    if (isCustomer) {
      message = `Your order ${orderNumber} has been delivered.`;
    } else {
      message = `${orderNumber} for ${customerName} has been delivered successfully.`;
    }

    Icon = CheckCircle2;
  } else if (
    status.includes("cancelled") ||
    status.includes("canceled")
  ) {
    title = "Order Cancelled";

    if (isCustomer) {
      message = `Your order ${orderNumber} has been cancelled.`;
    } else {
      message = `${orderNumber} for ${customerName} has been cancelled.`;
    }

    Icon = XCircle;
  }

  return {
    id: `${order.id || order.orderNumber}-${order.status}-${order.updatedAt || order.createdAt || ""}`,
    title,
    message,
    date: order.updatedAt || order.createdAt,
    Icon,
    orderId: order.id || null,
    orderNumber: order.orderNumber || order.id || null,
  };
}

function formatNotificationDate(date) {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toLocaleString("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showToast, setShowToast] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPreviousNotifications, setShowPreviousNotifications] =
    useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotificationIds, setUnreadNotificationIds] = useState([]);

  const toastTimeoutRef = useRef(null);
  const notificationRef = useRef(null);

  const isCustomer = location.pathname.startsWith("/customer");
  const isAdmin = location.pathname.startsWith("/admin");

  const notificationStorageKey = isCustomer
    ? "goldenpr_customer_read_notifications"
    : "goldenpr_admin_read_notifications";

  const customerNavigationItems = [
    {
      id: "products",
      label: "Products",
      path: "/customer/products",
    },
    {
      id: "orders",
      label: "Order",
      path: "/customer/orders",
    },
  ];

  const loadNotifications = () => {
    const orders = getOrders();

    const orderNotifications = orders
      .filter(
        (order) =>
          order && (order.id || order.orderNumber)
      )
      .map((order) =>
        getNotificationForOrder(order, isCustomer)
      )
      .sort((a, b) => {
        return (
          new Date(b.date || 0) -
          new Date(a.date || 0)
        );
      });

    setNotifications(orderNotifications);

    let readNotificationIds = [];

    try {
      const storedReadNotifications =
        window.localStorage.getItem(
          notificationStorageKey
        );

      if (storedReadNotifications) {
        const parsed = JSON.parse(
          storedReadNotifications
        );

        if (Array.isArray(parsed)) {
          readNotificationIds = parsed;
        }
      }
    } catch {
      readNotificationIds = [];
    }

    const unreadIds = orderNotifications
      .filter(
        (notification) =>
          !readNotificationIds.includes(
            notification.id
          )
      )
      .map((notification) => notification.id);

    setUnreadNotificationIds(unreadIds);
  };

  useEffect(() => {
    loadNotifications();

    const handleOrderUpdate = () => {
      loadNotifications();
    };

    window.addEventListener(
      "ordersUpdated",
      handleOrderUpdate
    );

    window.addEventListener(
      "orderUpdated",
      handleOrderUpdate
    );

    window.addEventListener(
      "storage",
      handleOrderUpdate
    );

    const interval = setInterval(
      loadNotifications,
      1000
    );

    return () => {
      window.removeEventListener(
        "ordersUpdated",
        handleOrderUpdate
      );

      window.removeEventListener(
        "orderUpdated",
        handleOrderUpdate
      );

      window.removeEventListener(
        "storage",
        handleOrderUpdate
      );

      clearInterval(interval);
    };
  }, [isCustomer, notificationStorageKey]);

  useEffect(() => {
    const showUpdateToast = () => {
      setShowToast(false);

      window.clearTimeout(toastTimeoutRef.current);

      requestAnimationFrame(() => {
        setShowToast(true);

        toastTimeoutRef.current =
          window.setTimeout(() => {
            setShowToast(false);
          }, 3000);
      });
    };

    window.addEventListener(
      "orderUpdated",
      showUpdateToast
    );

    window.addEventListener(
      "ordersUpdated",
      showUpdateToast
    );

    const handleStorageUpdate = (event) => {
      if (event.key === "goldenpr_orders") {
        showUpdateToast();
      }
    };

    window.addEventListener(
      "storage",
      handleStorageUpdate
    );

    return () => {
      window.removeEventListener(
        "orderUpdated",
        showUpdateToast
      );

      window.removeEventListener(
        "ordersUpdated",
        showUpdateToast
      );

      window.removeEventListener(
        "storage",
        handleStorageUpdate
      );

      window.clearTimeout(
        toastTimeoutRef.current
      );
    };
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(
          event.target
        )
      ) {
        setShowNotifications(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setShowNotifications(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );

      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  const markNotificationsAsRead = () => {
    const currentNotificationIds =
      notifications.map(
        (notification) => notification.id
      );

    try {
      window.localStorage.setItem(
        notificationStorageKey,
        JSON.stringify(currentNotificationIds)
      );
    } catch {
      // Ignore localStorage errors.
    }

    setUnreadNotificationIds([]);
  };

  const handleNotificationClick = () => {
    const willOpen = !showNotifications;

    setShowNotifications(willOpen);

    if (willOpen) {
      markNotificationsAsRead();
    }
  };

  const handleSpecificNotificationClick = (
    notification
  ) => {
    setShowNotifications(false);

    if (isAdmin) {
      navigate("/admin/orders", {
        state: {
          notificationOrder:
            notification.orderId ||
            notification.orderNumber,
        },
      });
    } else if (isCustomer) {
      navigate("/customer/orders", {
        state: {
          notificationOrder:
            notification.orderId ||
            notification.orderNumber,
        },
      });
    }
  };

  const handleProfileClick = () => {
    if (isAdmin) {
      navigate("/admin/profile");
    } else if (isCustomer) {
      navigate("/customer/profile");
    }
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

  const visibleNotificationCount =
    showPreviousNotifications
      ? notifications.length
      : 5;

  const visibleNotifications =
    notifications.slice(
      0,
      visibleNotificationCount
    );

  const hasPreviousNotifications =
    notifications.length > 5;

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
        <div
          className={`ml-auto flex min-w-0 items-center justify-end ${
            isCustomer
              ? "gap-4 sm:gap-7 md:gap-9"
              : "gap-1"
          }`}
        >
          {isCustomer && (
            <nav
              className="flex min-w-0 items-center gap-4 sm:gap-7 md:gap-9"
              aria-label="Customer navigation"
            >
              {customerNavigationItems.map(
                (item) => {
                  const isActive =
                    location.pathname ===
                    item.path;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        navigate(item.path)
                      }
                      aria-current={
                        isActive
                          ? "page"
                          : undefined
                      }
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
                }
              )}
            </nav>
          )}

          {/* Notification + Profile tightly grouped */}
          <div className="flex shrink-0 items-center gap-1">
            {/* Notification Bell */}
            <div
              className="relative flex shrink-0 items-center"
              ref={notificationRef}
            >
              <button
                type="button"
                onClick={
                  handleNotificationClick
                }
                aria-label="Notifications"
                aria-expanded={
                  showNotifications
                }
                className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-200 hover:bg-background-accent ${
                  showNotifications
                    ? "bg-background-accent"
                    : ""
                }`}
              >
                <Bell
                  size={24}
                  strokeWidth={2.5}
                  className="text-[#08779D]"
                />

                {/* Red badge ONLY when there are unread/new notifications */}
                {unreadNotificationIds.length >
                  0 && (
                  <span className="absolute right-0 top-0 flex h-[17px] min-w-[17px] items-center justify-center rounded-full border-2 border-white bg-red-500 px-1 text-[8px] font-bold leading-none text-white">
                    {unreadNotificationIds.length >
                    9
                      ? "9+"
                      : unreadNotificationIds.length}
                  </span>
                )}
              </button>

              {/* Compact Notification Popup */}
              {showNotifications && (
                <div className="fixed right-3 top-[68px] z-[300] w-[calc(100vw-24px)] max-w-[370px] overflow-hidden rounded-xl border border-border-light bg-white shadow-[0_10px_30px_rgba(0,0,0,0.16)] sm:right-6 sm:top-[72px]">
                  {/* Header */}
                  <div className="border-b border-slate-100 px-4 pb-2.5 pt-3.5">
                    <h2 className="text-base font-bold text-slate-900">
                      Notifications
                    </h2>
                  </div>

                  {/* Notification List */}
                  <div className="max-h-[350px] overflow-y-auto py-0.5">
                    {visibleNotifications.length ===
                    0 ? (
                      <div className="flex flex-col items-center justify-center px-5 py-10 text-center">
                        <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF6FA]">
                          <Bell
                            size={20}
                            className="text-[#08779D]"
                          />
                        </span>

                        <p className="text-sm font-semibold text-slate-800">
                          No notifications
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          There are no order updates
                          yet.
                        </p>
                      </div>
                    ) : (
                      visibleNotifications.map(
                        (notification) => {
                          const Icon =
                            notification.Icon;

                          return (
                            <button
                              key={notification.id}
                              type="button"
                              onClick={() =>
                                handleSpecificNotificationClick(
                                  notification
                                )
                              }
                              className="flex w-full items-start gap-2.5 px-3.5 py-2.5 text-left transition-colors duration-150 hover:bg-slate-50 sm:px-4"
                            >
                              {/* Notification Icon */}
                              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EAF6FA]">
                                <Icon
                                  size={17}
                                  className="text-[#08779D]"
                                  strokeWidth={2}
                                />
                              </span>

                              {/* Notification Content */}
                              <span className="min-w-0 flex-1">
                                <span className="flex items-start justify-between gap-2">
                                  <span className="text-sm font-bold leading-5 text-slate-900">
                                    {
                                      notification.title
                                    }
                                  </span>
                                </span>

                                <span className="mt-0.5 block text-xs leading-5 text-slate-500">
                                  {
                                    notification.message
                                  }
                                </span>

                                <span className="mt-1 block text-[11px] font-medium text-slate-400">
                                  {formatNotificationDate(
                                    notification.date
                                  )}
                                </span>
                              </span>
                            </button>
                          );
                        }
                      )
                    )}
                  </div>

                  {/* Previous Notifications */}
                  {hasPreviousNotifications && (
                    <div className="border-t border-slate-100 px-3.5 py-2.5 sm:px-4">
                      <button
                        type="button"
                        onClick={() =>
                          setShowPreviousNotifications(
                            (current) =>
                              !current
                          )
                        }
                        className="w-full rounded-lg px-3 py-2 text-center text-sm font-semibold text-[#08779D] transition-colors duration-200 hover:bg-[#EAF6FA]"
                      >
                        {showPreviousNotifications
                          ? "Show fewer notifications"
                          : "See previous notifications"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Profile Icon */}
            <button
              type="button"
              onClick={handleProfileClick}
              aria-label="Open profile"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors duration-200 hover:bg-background-accent"
            >
              <img
                src={userIcon}
                alt=""
                className="h-6 w-6 object-contain"
              />
            </button>
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