import React, { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ListFilter,
  Search,
} from "lucide-react";

import AdminSidebar from "../../components/admin/AdminSidebar";
import Header from "../../components/Header/Header";

import {
  getOrders,
  updateOrder,
} from "../../utils/orderStorage";

const statusOptions = [
  "Pending",
  "Processing",
  "Confirmed",
  "Out for Delivery",
  "Completed",
  "Delivered",
  "Cancelled",
];

function getOrderProductName(order) {
  if (
    Array.isArray(order?.products) &&
    order.products.length > 0
  ) {
    return order.products
      .map((product) => product.name)
      .join(" + ");
  }

  return order?.product || "Water Order";
}

function getOrderQuantity(order) {
  if (
    Array.isArray(order?.products) &&
    order.products.length > 0
  ) {
    return order.products.reduce(
      (total, product) =>
        total +
        Number(
          product.quantity ??
            product.qty ??
            0,
        ),
      0,
    );
  }

  return Number(
    order?.qty ??
      order?.quantity ??
      0,
  );
}

function getDeliveryDate(order) {
  return (
    order?.deliverySchedule ||
    order?.deliveryDate ||
    "Not scheduled"
  );
}

function Orders() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const ordersPerPage = 3;

  const loadOrders = () => {
    const savedOrders = getOrders();

    setOrders(
      Array.isArray(savedOrders)
        ? savedOrders
        : [],
    );
  };

  useEffect(() => {
    loadOrders();

    const handleOrderUpdate = () => {
      loadOrders();
    };

    window.addEventListener(
      "storage",
      handleOrderUpdate,
    );

    window.addEventListener(
      "orderUpdated",
      handleOrderUpdate,
    );

    window.addEventListener(
      "ordersUpdated",
      handleOrderUpdate,
    );

    /*
     * Keeps the page synchronized even when
     * customer and admin pages are open in
     * the same browser session.
     */
    const interval = setInterval(() => {
      loadOrders();
    }, 1000);

    return () => {
      window.removeEventListener(
        "storage",
        handleOrderUpdate,
      );

      window.removeEventListener(
        "orderUpdated",
        handleOrderUpdate,
      );

      window.removeEventListener(
        "ordersUpdated",
        handleOrderUpdate,
      );

      clearInterval(interval);
    };
  }, []);

  const filteredOrders = useMemo(() => {
    const search = searchTerm
      .toLowerCase()
      .trim();

    return orders.filter((order) => {
      const orderId = String(
        order?.orderNumber ||
          order?.id ||
          "",
      ).toLowerCase();

      const customerName = String(
        order?.customerName ||
          order?.customer ||
          "",
      ).toLowerCase();

      const product = getOrderProductName(
        order,
      ).toLowerCase();

      const deliveryDate =
        getDeliveryDate(order).toLowerCase();

      const orderStatus = String(
        order?.status ||
          "Pending",
      ).trim();

      const matchesSearch =
        !search ||
        orderId.includes(search) ||
        customerName.includes(search) ||
        product.includes(search) ||
        deliveryDate.includes(search);

      const matchesStatus =
        statusFilter === "All" ||
        orderStatus === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    orders,
    searchTerm,
    statusFilter,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredOrders.length /
        ordersPerPage,
    ),
  );

  const safePage = Math.min(
    currentPage,
    totalPages,
  );

  const displayedOrders =
    filteredOrders.slice(
      (safePage - 1) *
        ordersPerPage,
      safePage * ordersPerPage,
    );

  const handleStatusChange = (
    orderId,
    newStatus,
  ) => {
    updateOrder(orderId, {
      status: newStatus,
    });

    /*
     * Update immediately in the current page.
     */
    setOrders((currentOrders) =>
      currentOrders.map((order) => {
        const currentId =
          order?.orderNumber ||
          order?.id;

        return String(currentId) ===
          String(orderId)
          ? {
              ...order,
              status: newStatus,
              updatedAt:
                new Date().toISOString(),
            }
          : order;
      }),
    );
  };

  const handleSearch = (event) => {
    setSearchTerm(
      event.target.value,
    );
    setCurrentPage(1);
  };

  const handleFilterChange = (
    event,
  ) => {
    setStatusFilter(
      event.target.value,
    );
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((page) =>
      Math.max(1, page - 1),
    );
  };

  const handleNextPage = () => {
    setCurrentPage((page) =>
      Math.min(
        totalPages,
        page + 1,
      ),
    );
  };

  const firstItem =
    filteredOrders.length === 0
      ? 0
      : (safePage - 1) *
          ordersPerPage +
        1;

  const lastItem = Math.min(
    safePage * ordersPerPage,
    filteredOrders.length,
  );

  return (
    <div className="flex min-h-screen w-full bg-white">
      <AdminSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="w-full shrink-0">
          <Header />
        </div>

        <main className="min-w-0 flex-1 overflow-y-auto bg-white">
          <div className="mx-auto w-full max-w-[1280px] px-5 py-7 sm:px-7 sm:py-8 lg:px-9">

            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <h1 className="text-[30px] font-bold leading-[1.2] tracking-[-0.02em] text-text-primary sm:text-[34px]">
                  Order Management
                </h1>

                <p className="text-sm leading-6 text-text-primary">
                  Manage and track customer
                  water delivery orders.
                </p>

                <p className="mt-1 text-sm leading-6 text-text-secondary">
                  New customer orders will
                  appear here automatically.
                </p>
              </div>

              <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">

                <div className="relative w-full sm:w-[255px]">
                  <Search
                    size={18}
                    strokeWidth={2}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
                  />

                  <input
                    type="text"
                    value={searchTerm}
                    onChange={
                      handleSearch
                    }
                    placeholder="Search orders..."
                    className="h-[54px] w-full rounded-none border border-[#C8E7F0] bg-white pl-11 pr-4 text-sm text-text-primary outline-none transition focus:border-[#00779B]"
                  />
                </div>

                <div className="relative w-full sm:w-auto">
                  <ListFilter
                    size={18}
                    strokeWidth={2}
                    className="pointer-events-none absolute left-5 top-1/2 z-10 -translate-y-1/2 text-white"
                  />

                  <select
                    value={statusFilter}
                    onChange={
                      handleFilterChange
                    }
                    className="h-[54px] w-full cursor-pointer appearance-none rounded-none border border-[#00779B] bg-[#00779B] pl-12 pr-11 text-sm font-semibold text-white outline-none sm:w-[110px]"
                  >
                    <option value="All">
                      Filter
                    </option>

                    {statusOptions.map(
                      (status) => (
                        <option
                          key={status}
                          value={status}
                          className="bg-white text-text-primary"
                        >
                          {status}
                        </option>
                      ),
                    )}
                  </select>

                  <ChevronDown
                    size={17}
                    strokeWidth={2}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 h-px w-full bg-[#BFEAF5]" />

            <section className="mt-12 w-full overflow-hidden rounded-[12px] border border-[#C8C8C8] bg-white">
              <div className="w-full overflow-x-auto">
                <table className="w-full min-w-[950px] border-collapse">
                  <thead>
                    <tr className="bg-[#D5F1F8]">
                      <th className="h-[48px] px-6 text-left text-[12px] font-bold uppercase tracking-[0.5px] text-[#123047]">
                        Order #
                      </th>

                      <th className="h-[48px] px-6 text-left text-[12px] font-bold uppercase tracking-[0.5px] text-[#123047]">
                        Customer Name
                      </th>

                      <th className="h-[48px] px-6 text-left text-[12px] font-bold uppercase tracking-[0.5px] text-[#123047]">
                        Product
                      </th>

                      <th className="h-[48px] px-6 text-center text-[12px] font-bold uppercase tracking-[0.5px] text-[#123047]">
                        Qty
                      </th>

                      <th className="h-[48px] px-6 text-left text-[12px] font-bold uppercase tracking-[0.5px] text-[#123047]">
                        Delivery Date
                      </th>

                      <th className="h-[48px] px-6 text-left text-[12px] font-bold uppercase tracking-[0.5px] text-[#123047]">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {displayedOrders.length >
                    0 ? (
                      displayedOrders.map(
                        (order) => {
                          const orderId =
                            order?.orderNumber ||
                            order?.id;

                          return (
                            <tr
                              key={orderId}
                              className="border-t border-[#C8E7F0] bg-white transition-colors hover:bg-[#F8FCFD]"
                            >
                              <td className="h-[86px] px-6 text-left text-[16px] font-bold text-[#123047]">
                                {orderId}
                              </td>

                              <td className="h-[86px] px-6 text-left text-[16px] text-[#123047]">
                                {order?.customerName ||
                                  order?.customer ||
                                  "Unknown Customer"}
                              </td>

                              <td className="h-[86px] px-6 text-left text-[16px] text-[#123047]">
                                {getOrderProductName(
                                  order,
                                )}
                              </td>

                              <td className="h-[86px] px-6 text-center text-[16px] text-[#123047]">
                                {getOrderQuantity(
                                  order,
                                )}
                              </td>

                              <td className="h-[86px] px-6 text-left text-[16px] text-[#123047]">
                                {getDeliveryDate(
                                  order,
                                )}
                              </td>

                              <td className="h-[86px] px-6">
                                <div className="relative w-[145px]">
                                  <select
                                    value={
                                      order?.status ||
                                      "Pending"
                                    }
                                    onChange={(
                                      event,
                                    ) =>
                                      handleStatusChange(
                                        orderId,
                                        event
                                          .target
                                          .value,
                                      )
                                    }
                                    className="h-[38px] w-full cursor-pointer appearance-none rounded-none border border-[#C8E7F0] bg-white px-3 pr-9 text-[14px] font-medium text-[#123047] outline-none transition focus:border-[#00779B]"
                                  >
                                    {statusOptions.map(
                                      (
                                        status,
                                      ) => (
                                        <option
                                          key={
                                            status
                                          }
                                          value={
                                            status
                                          }
                                        >
                                          {
                                            status
                                          }
                                        </option>
                                      ),
                                    )}
                                  </select>

                                  <ChevronDown
                                    size={
                                      15
                                    }
                                    strokeWidth={
                                      2
                                    }
                                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#7890A0]"
                                  />
                                </div>
                              </td>
                            </tr>
                          );
                        },
                      )
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          className="h-[150px] px-6 text-center text-sm text-text-secondary"
                        >
                          No orders found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex min-h-[82px] flex-col justify-between gap-4 border-t border-[#C8E7F0] bg-[#EAF4FF] px-6 py-4 sm:flex-row sm:items-center">
                <span className="text-[15px] text-[#123047]">
                  Showing {firstItem}-
                  {lastItem} of{" "}
                  {filteredOrders.length}{" "}
                  orders
                </span>

                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={
                      handlePreviousPage
                    }
                    disabled={
                      safePage === 1
                    }
                    aria-label="Previous page"
                    className="flex h-[34px] w-[34px] items-center justify-center border border-[#C8E7F0] bg-[#F5FAFF] text-[#7890A0] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ChevronLeft
                      size={18}
                      strokeWidth={2}
                    />
                  </button>

                  <button
                    type="button"
                    className="flex h-[34px] w-[34px] items-center justify-center border border-[#00779B] bg-[#00779B] text-sm font-semibold text-white"
                  >
                    {safePage}
                  </button>

                  <button
                    type="button"
                    onClick={
                      handleNextPage
                    }
                    disabled={
                      safePage ===
                      totalPages
                    }
                    aria-label="Next page"
                    className="flex h-[34px] w-[34px] items-center justify-center border border-[#C8E7F0] bg-[#F5FAFF] text-[#123047] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ChevronRight
                      size={18}
                      strokeWidth={2}
                    />
                  </button>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Orders;