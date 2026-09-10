import React from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../components/Header/Header";
import CustomerNavbar from "../../components/customer/CustomerNavbar";

import roundPurifiedWater from "../../assets/images/round-purified-water.png";
import slimPurifiedWater from "../../assets/images/slim-purified-water.png";
import bottle500ml from "../../assets/images/500ml-bottle.png";

const orderHistory = [
  {
    id: "ORD-2023-104",
    title: "5x 5-Gallon Round Refill",
    tag: "Refill Service",
    date: "Oct 24, 2023",
    total: "PHP 150.00",
    status: "Processing",
    statusType: "active",
    image: roundPurifiedWater,
    buttons: ["View Details", "Track Order"],
  },
  {
    id: "ORD-2023-098",
    title: "2x Slim Gallon Refill",
    tag: "Refill Service",
    date: "Oct 18, 2023",
    total: "PHP 100.00",
    status: "Completed",
    statusType: "completed",
    image: slimPurifiedWater,
    buttons: ["View Details"],
  },
];

const deliveryHistory = [
  {
    id: "DEL-2023-089",
    title: "2x 5-Gallon Slim Refill",
    tag: "Delivered",
    date: "Sep 15, 2023",
    location: "Home Office",
    status: "Delivered",
    statusType: "completed",
    image: slimPurifiedWater,
    buttons: [],
  },
  {
    id: "DEL-2023-081",
    title: "1x 500ml Bottle Case",
    tag: "Delivered",
    date: "Sep 08, 2023",
    location: "Home Address",
    status: "Delivered",
    statusType: "completed",
    image: bottle500ml,
    buttons: [],
  },
];

function HistoryCard({
  id,
  title,
  tag,
  date,
  secondaryLabel,
  secondaryValue,
  status,
  statusType,
  image,
  buttons,
  onTrack,
  onViewDetails,
}) {
  const handleButtonClick = (button) => {
    if (button === "Track Order") {
      onTrack();
      return;
    }

    if (button === "View Details") {
      onViewDetails();
    }
  };

  return (
    <div className="flex w-full flex-col gap-4 rounded-md bg-background-accent p-3 shadow-[0px_1px_2px_#0000000c] sm:p-4 md:flex-row md:items-center md:justify-between">
      {/* Product Information */}
      <div className="flex min-w-0 w-full items-start gap-3 sm:items-center md:w-auto">
        {/* Product Picture */}
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md bg-background-card p-1">
          <img
            src={image}
            alt={title}
            className="h-11 w-10 object-contain sm:h-12 sm:w-11"
          />
        </div>

        {/* Details */}
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="pb-1 text-[10px] font-bold uppercase tracking-[0.6px] text-text-secondary">
            {id}
          </span>

          <span className="break-words text-sm font-bold leading-5 text-text-primary sm:text-base sm:leading-6">
            {title}
          </span>

          <div className="mt-1">
            <span className="inline-flex w-fit items-center rounded-sm bg-primary-lighter px-2 py-1 text-[10px] font-medium text-text-accent">
              {tag}
            </span>
          </div>

          <span className="mt-1 text-xs text-text-secondary">
            {date}
          </span>
        </div>
      </div>

      {/* Right Side Information */}
      <div className="flex w-full flex-col gap-3 border-t border-primary-lighter pt-3 sm:border-0 sm:pt-0 md:w-auto md:items-end">
        {/* Total / Location + Status */}
        <div className="flex w-full items-start justify-between gap-4 sm:justify-end sm:gap-6">
          {/* Total / Location */}
          <div className="flex min-w-0 flex-1 flex-col sm:flex-none">
            <span className="text-[10px] font-bold uppercase tracking-[0.6px] text-text-secondary">
              {secondaryLabel}
            </span>

            <span className="break-words text-sm font-bold leading-5 text-text-primary sm:text-base sm:leading-6">
              {secondaryValue}
            </span>
          </div>

          {/* Status */}
          <div className="flex shrink-0 flex-col items-end">
            <span className="pb-1 text-[10px] font-bold uppercase tracking-[0.6px] text-text-secondary">
              STATUS
            </span>

            <span
              className={`whitespace-nowrap rounded-sm px-2 py-1 text-[10px] font-bold uppercase tracking-[0.6px] ${
                statusType === "active"
                  ? "bg-primary-background text-primary-foreground"
                  : "bg-background-overlay-dark text-text-primary"
              }`}
            >
              {status}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        {buttons.length > 0 && (
          <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:justify-end">
            {buttons.map((button) => {
              const isFilled = button === "Track Order";

              return (
                <button
                  key={button}
                  type="button"
                  onClick={() => handleButtonClick(button)}
                  className={`min-h-9 rounded-md px-3 py-2 text-[10px] font-bold uppercase tracking-[0.6px] transition-colors sm:min-h-10 sm:px-4 ${
                    isFilled
                      ? "bg-primary-background text-primary-foreground shadow-[0px_1px_2px_#0000000c] hover:opacity-90"
                      : "border border-primary-light bg-transparent text-primary-light hover:bg-primary-light hover:text-primary-foreground"
                  }`}
                >
                  {button}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Orders() {
  const navigate = useNavigate();

  const handleTrackOrder = () => {
    navigate("/customer/track");
  };

  const handleViewDetails = (order) => {
    navigate("/customer/order-details", {
      state: {
        order,
      },
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background-main">
      {/* Existing System Header */}
      <div className="w-full shrink-0">
        <Header />
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background-card pb-[120px]">
        <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-6 px-4 py-5 sm:px-6 sm:py-7 md:px-8">
          {/* Page Title */}
          <div className="flex flex-col gap-1">
            <h1 className="break-words text-[24px] font-bold leading-[120%] tracking-[-0.02em] text-text-accent sm:text-[28px] md:text-[30px]">
              Transaction &amp; Delivery History
            </h1>

            <p className="text-xs leading-[1.5] text-text-secondary sm:text-sm">
              Review your past orders and confirmed delivery arrivals.
            </p>
          </div>

          {/* Order History */}
          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-bold leading-6 text-text-primary sm:text-xl sm:leading-7">
              Order History
            </h2>

            <div className="flex flex-col gap-3">
              {orderHistory.map((order) => (
                <HistoryCard
                  key={order.id}
                  id={`ORDER #${order.id}`}
                  title={order.title}
                  tag={order.tag}
                  date={order.date}
                  secondaryLabel="Total"
                  secondaryValue={order.total}
                  status={order.status}
                  statusType={order.statusType}
                  image={order.image}
                  buttons={order.buttons}
                  onTrack={handleTrackOrder}
                  onViewDetails={() => handleViewDetails(order)}
                />
              ))}
            </div>
          </section>

          {/* Delivery History */}
          <section className="flex flex-col gap-3 pt-4">
            <h2 className="text-lg font-bold leading-6 text-text-primary sm:text-xl sm:leading-7">
              Delivery History
            </h2>

            <div className="flex flex-col gap-3">
              {deliveryHistory.map((delivery) => (
                <HistoryCard
                  key={delivery.id}
                  id={`DELIVERY #${delivery.id}`}
                  title={delivery.title}
                  tag={delivery.tag}
                  date={delivery.date}
                  secondaryLabel="Location"
                  secondaryValue={delivery.location}
                  status={delivery.status}
                  statusType={delivery.statusType}
                  image={delivery.image}
                  buttons={delivery.buttons}
                  onTrack={handleTrackOrder}
                  onViewDetails={() => {}}
                />
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Existing System Customer Navbar */}
      <div className="fixed bottom-0 left-0 z-50 w-full">
        <CustomerNavbar />
      </div>
    </div>
  );
}

export default Orders;