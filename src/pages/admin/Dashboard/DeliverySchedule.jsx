import React from "react";

const DeliverySchedule = () => {
  const deliveryRoutes = [
    {
      id: 1,
      route: "Route A - North",
      time: "09:00 AM",
      driver: "Mark Reyes",
      stops: 8,
      gallons: 24,
    },
    {
      id: 2,
      route: "Route B - South",
      time: "01:00 PM",
      driver: "Leo Cruz",
      stops: 12,
      gallons: 35,
    },
  ];

  return (
    <section className="flex w-full flex-col rounded-md border border-card-border bg-card-background shadow-card lg:w-1/3">
      {/* Header */}
      <div className="border-b border-border-light px-4 py-6 sm:px-6 sm:py-8 lg:px-10xl lg:py-10xl">
        <div className="flex flex-col gap-xs">
          <h3 className="whitespace-pre-line text-[18px] font-semibold leading-[23px] text-text-secondary sm:text-[20px] sm:leading-[25px] lg:text-md lg:leading-xl">
            Delivery Schedule
          </h3>

          <p className="mt-md text-sm font-normal leading-sm text-text-accent">
            Today, Oct 26
          </p>

          <button
            type="button"
            className="mt-md text-left text-xs font-semibold uppercase leading-sm text-text-brand hover:underline"
          >
            VIEW DELIVERY HISTORY
          </button>
        </div>
      </div>

      {/* Routes List */}
      <div className="flex-1 overflow-y-auto px-4 py-xl sm:px-6 lg:px-9xl">
        <div className="flex flex-col gap-3xl">
          {deliveryRoutes.map((route) => (
            <div
              key={route.id}
              className="rounded-tr-sm rounded-br-sm border-l-medium border-primary-background bg-background-lightBlue p-xl"
            >
              <div className="flex flex-col gap-xs">
                {/* Route and Time */}
                <div className="flex items-start justify-between">
                  <span className="whitespace-pre-line text-xs font-semibold leading-sm text-text-secondary">
                    {route.route.replace(" - ", " -\n")}
                  </span>

                  <span className="ml-2 whitespace-pre-line text-right text-sm font-normal leading-md text-text-accent">
                    {route.time.replace(" ", "\n")}
                  </span>
                </div>

                {/* Driver Info */}
                <p className="mt-xs text-sm font-normal leading-sm text-text-secondary">
                  Driver: {route.driver}
                </p>

                {/* Stops and Gallons */}
                <p className="whitespace-pre-line text-sm font-normal leading-md text-text-accent">
                  {route.stops} stops • {route.gallons} Gallons
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Button */}
      <div className="border-t border-border-light px-4 py-6 sm:px-6 sm:py-8 lg:px-10xl lg:py-10xl">
        <button
          type="button"
          className="w-full rounded-sm bg-primary-background px-xl py-xl text-center text-xs font-semibold uppercase leading-sm text-primary-foreground transition-colors duration-200 hover:bg-primary-light"
        >
          GO TO DELIVERY
        </button>
      </div>
    </section>
  );
};

export default DeliverySchedule;