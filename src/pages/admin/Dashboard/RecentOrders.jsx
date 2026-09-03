import React from "react";

const RecentOrders = () => {
  const orders = [
    {
      id: "#ORD-092",
      customer: "Maria Santos",
      quantity: 3,
      status: "[PENDING]",
      amount: "₱ 150",
      statusBg: "bg-background-lighterBlue",
    },
    {
      id: "#ORD-091",
      customer: "Juan Dela Cruz",
      quantity: 5,
      status: "[PURIFYING]",
      amount: "₱ 250",
      statusBg: "bg-background-lighterBlue",
    },
    {
      id: "#ORD-090",
      customer: "Leni Robredo",
      quantity: 2,
      status: "[OUT FOR DELIVERY]",
      amount: "₱ 100",
      statusBg: "bg-background-lighterBlue",
    },
    {
      id: "#ORD-089",
      customer: "Bongbong Marcos",
      quantity: 10,
      status: "[DELIVERED]",
      amount: "₱ 500",
      statusBg: "bg-background-lighterBlue",
    },
  ];

  return (
    <section className="flex-1 rounded-md border border-card-border bg-card-background shadow-card">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 border-b border-border-light px-4 py-6 sm:flex-row sm:items-center sm:px-6 sm:py-8 lg:px-10xl lg:py-10xl">
        <h3 className="text-[18px] font-semibold leading-[23px] text-text-secondary sm:text-[20px] sm:leading-[25px] lg:text-md lg:leading-lg">
          Recent Orders
        </h3>

        <button
          type="button"
          className="rounded-sm border border-primary-background px-xl py-xl text-xs font-semibold uppercase leading-xs text-text-brand transition-colors duration-200 hover:bg-primary-background hover:text-primary-foreground"
        >
          VIEW ALL
        </button>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto px-xl py-xl sm:px-4 lg:px-xl">
        <table className="w-full min-w-[600px]">
          <thead className="border-b border-border-light bg-background-main">
            <tr>
              <th className="px-3 py-4 text-left sm:px-4 lg:px-3xl">
                <span className="text-xs font-semibold uppercase leading-sm text-text-secondary">
                  ORDER ID
                </span>
              </th>

              <th className="px-3 py-4 text-left sm:px-4 lg:px-3xl">
                <span className="text-xs font-semibold uppercase leading-xs text-text-secondary">
                  CUSTOMER
                </span>
              </th>

              <th className="px-3 py-3 text-left sm:px-4 lg:px-3xl">
                <span className="text-xs font-semibold uppercase leading-sm text-text-secondary">
                  QTY (5 GAL)
                </span>
              </th>

              <th className="px-3 py-4 text-left sm:px-4 lg:px-3xl">
                <span className="text-xs font-semibold uppercase leading-xs text-text-secondary">
                  STATUS
                </span>
              </th>

              <th className="px-3 py-4 text-left sm:px-4 lg:px-3xl">
                <span className="text-xs font-semibold uppercase leading-xs text-text-secondary">
                  AMOUNT
                </span>
              </th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-border-light transition-colors duration-150 hover:bg-secondary-light"
              >
                <td className="px-3 py-3 sm:px-4 lg:px-3xl">
                  <span className="whitespace-pre-line text-sm font-normal leading-md text-primary-dark">
                    {order.id.replace("-", "-\n")}
                  </span>
                </td>

                <td className="px-3 py-3 sm:px-4 lg:px-3xl">
                  <span className="whitespace-pre-line text-sm font-normal leading-md text-primary-dark">
                    {order.customer.includes(" ")
                      ? order.customer.replace(" ", "\n")
                      : order.customer}
                  </span>
                </td>

                <td className="px-3 py-3 sm:px-4 lg:px-3xl">
                  <span className="text-sm font-normal leading-sm text-primary-dark">
                    {order.quantity}
                  </span>
                </td>

                <td className="px-3 py-3 sm:px-4 lg:px-3xl">
                  <span
                    className={`inline-block rounded-sm px-xl py-[2px] ${order.statusBg} whitespace-pre-line text-xs font-semibold leading-xs text-text-secondary`}
                  >
                    {order.status}
                  </span>
                </td>

                <td className="px-3 py-3 sm:px-4 lg:px-3xl">
                  <span className="text-sm font-normal leading-sm text-primary-dark">
                    {order.amount}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default RecentOrders;