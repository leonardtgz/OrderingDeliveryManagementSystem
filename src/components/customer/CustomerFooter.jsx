import React from "react";
import { Link, useNavigate } from "react-router-dom";

import { getOrders } from "../../utils/orderStorage";

const customerLinks = [
  { label: "Home", to: "/customer/home" },
  { label: "Products", to: "/customer/products" },
  { label: "My Orders", to: "/customer/orders" },
  { label: "Track Delivery", to: "/customer/track" },
  { label: "My Profile", to: "/customer/profile" },
];

function CustomerFooter() {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  const handleTrackDelivery = (event) => {
    event.preventDefault();

    const orders = getOrders();

    // Only consider orders that still need tracking.
    const trackableStatuses = [
      "pending",
      "confirmed",
      "processing",
      "preparing",
      "out for delivery",
      "in transit",
    ];

    const trackableOrders = orders.filter((order) => {
      const status = String(order.status || "")
        .trim()
        .toLowerCase();

      return (
        trackableStatuses.includes(status) &&
        order.status !== "Cancelled"
      );
    });

    // Open the most recently updated or created trackable order.
    const latestOrder = trackableOrders.sort((a, b) => {
      const dateA = new Date(
        a.updatedAt || a.createdAt || 0,
      ).getTime();

      const dateB = new Date(
        b.updatedAt || b.createdAt || 0,
      ).getTime();

      return dateB - dateA;
    })[0];

    if (latestOrder) {
      navigate("/customer/track", {
        state: { order: latestOrder },
      });
    } else {
      // If there is no active order, show the customer's order list.
      navigate("/customer/orders");
    }
  };

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
              Water Delivery Service
            </p>
          </div>

          <p className="min-w-[250px] text-xs leading-5 text-text-secondary">
            Your convenient way to order purified water refills and bottled
            water for home or business delivery.
          </p>
        </div>

        {/* Customer navigation */}
        <div>
          <h3 className="mb-2 text-[10px] font-bold uppercase tracking-[1px] text-text-primary">
            Customer Links
          </h3>

          <nav className="grid grid-cols-2 gap-x-4 gap-y-2">
            {customerLinks.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                onClick={
                  label === "Track Delivery"
                    ? handleTrackDelivery
                    : undefined
                }
                className="w-fit text-xs text-text-secondary transition-colors hover:text-[#08779D] hover:underline"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Support information */}
        <div>
          <h3 className="mb-2 text-[10px] font-bold uppercase tracking-[1px] text-text-primary">
            Need Assistance?
          </h3>

          <p className="text-xs leading-5 text-text-secondary">
            Need help with an order, delivery schedule, or product selection?
            Contact your water station directly for assistance.
          </p>

          <div className="mt-3 rounded-md bg-[#F0F9FC] p-2.5">
            <p className="text-[11px] font-semibold text-[#08779D]">
              Order with confidence
            </p>

            <p className="mt-1 text-[11px] leading-4 text-text-secondary">
              Review your order details before confirming your delivery.
            </p>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-border-light bg-[#F6F9FC]">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-1.5 px-5 py-3 text-[10px] text-text-secondary sm:px-6 md:flex-row md:items-center md:justify-between">
          <p>© {currentYear} GoldenPR. All rights reserved.</p>

          <p>Customer Ordering and Water Delivery System</p>
        </div>
      </div>
    </footer>
  );
}

export default CustomerFooter;