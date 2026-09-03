import React from "react";

const StatisticsGrid = () => {
  const stats = [
    {
      id: 1,
      title: "PENDING ORDERS",
      value: "5",
      label: "[PENDING]",
      bgColor: "bg-background-lightBlue",
    },
    {
      id: 2,
      title: "FOR DELIVERY",
      value: "4",
      label: "[OUT FOR\nDELIVERY]",
      bgColor: "bg-background-lightBlue",
    },
    {
      id: 3,
      title: "TOTAL ORDERS",
      value: "20",
      label: null,
      bgColor: "bg-background-lightBlue",
    },
    {
      id: 4,
      title: "COMPLETED",
      value: "398",
      label: "[DELIVERED]",
      bgColor: "bg-background-lightBlue",
    },
    {
      id: 5,
      title: "TOTAL CUSTOMERS",
      value: "5",
      label: null,
      bgColor: "bg-background-lightBlue",
    },
  ];

  return (
    <section className="flex flex-col gap-3xl sm:gap-4xl lg:gap-6">
      {/* First Row - 3 Cards */}
      <div className="grid grid-cols-1 gap-3xl sm:grid-cols-2 lg:grid-cols-3">
        {stats.slice(0, 3).map((stat) => (
          <div
            key={stat.id}
            className={`${stat.bgColor} rounded-md border border-border-secondary p-6 shadow-card sm:p-8 lg:p-10xl`}
          >
            <div className="flex flex-col gap-sm">
              <h3 className="text-xs font-semibold uppercase leading-xs text-text-secondary">
                {stat.title}
              </h3>

              <div className="mt-2xl flex items-end gap-xl">
                <span className="text-[30px] font-bold leading-[37px] text-text-secondary sm:text-[40px] sm:leading-[49px] lg:text-xl lg:leading-3xl">
                  {stat.value}
                </span>

                {stat.label && (
                  <span className="mb-lg whitespace-pre-line text-xs font-semibold leading-xs text-text-brand">
                    {stat.label}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Second Row - 2 Cards */}
      <div className="grid grid-cols-1 gap-3xl sm:grid-cols-2 lg:w-2/3">
        {stats.slice(3, 5).map((stat) => (
          <div
            key={stat.id}
            className={`${stat.bgColor} rounded-md border border-border-secondary p-6 shadow-card sm:p-8 lg:p-10xl`}
          >
            <div className="flex flex-col gap-sm">
              <h3 className="text-xs font-semibold uppercase leading-xs text-text-secondary">
                {stat.title}
              </h3>

              <div className="mt-2xl flex items-end gap-xl">
                <span className="text-[30px] font-bold leading-[37px] text-text-secondary sm:text-[40px] sm:leading-[49px] lg:text-xl lg:leading-3xl">
                  {stat.value}
                </span>

                {stat.label && (
                  <span className="mb-lg text-xs font-semibold leading-xs text-text-brand">
                    {stat.label}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatisticsGrid;