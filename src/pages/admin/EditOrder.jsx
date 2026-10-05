import React, {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  AlertTriangle,
  ArrowLeft,
  ChevronDown,
  Save,
  X,
} from "lucide-react";

import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminFooter from "../../components/admin/AdminFooter";
import Header from "../../components/Header/Header";

import {
  getOrders,
  updateOrder,
} from "../../utils/orderStorage";

const ORDERS_KEY = "goldenpr_orders";

const ORDER_TOAST_KEY =
  "adminOrderToast";

const statusOptions = [
  "Pending",
  "Processing",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

function normalizeStatus(status) {
  const value = String(
    status || "Pending",
  )
    .trim()
    .toLowerCase();

  if (
    value === "confirmed" ||
    value === "purifying" ||
    value === "processing"
  ) {
    return "Processing";
  }

  if (
    value === "completed" ||
    value === "delivered"
  ) {
    return "Delivered";
  }

  if (
    value === "out for delivery" ||
    value === "out_for_delivery" ||
    value === "out-for-delivery"
  ) {
    return "Out for Delivery";
  }

  if (
    value === "cancelled" ||
    value === "canceled"
  ) {
    return "Cancelled";
  }

  return "Pending";
}

function getOrderProductName(order) {
  if (
    Array.isArray(order?.products) &&
    order.products.length > 0
  ) {
    return order.products
      .map(
        (product) =>
          product?.name ||
          "Product",
      )
      .join(" + ");
  }

  return (
    order?.product ||
    "Water Order"
  );
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
          product?.quantity ??
            product?.qty ??
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

function getOrderTotal(order) {
  const directTotal =
    order?.total ??
    order?.totalAmount ??
    order?.grandTotal ??
    order?.amount;

  if (
    directTotal !== undefined &&
    directTotal !== null &&
    directTotal !== ""
  ) {
    const numericTotal =
      Number(directTotal);

    if (
      Number.isFinite(
        numericTotal,
      )
    ) {
      return numericTotal;
    }
  }

  if (
    Array.isArray(order?.products) &&
    order.products.length > 0
  ) {
    return order.products.reduce(
      (total, product) => {
        const quantity =
          Number(
            product?.quantity ??
              product?.qty ??
              0,
          );

        const price =
          Number(
            product?.price ??
              product?.unitPrice ??
              0,
          );

        return (
          total +
          quantity * price
        );
      },
      0,
    );
  }

  const quantity =
    Number(
      order?.qty ??
        order?.quantity ??
        0,
    );

  const price =
    Number(
      order?.price ??
        order?.unitPrice ??
        0,
    );

  return quantity * price;
}

function getPaymentStatus(order) {
  const paymentValue =
    order?.paymentStatus ??
    order?.paid ??
    order?.isPaid ??
    order?.payment?.status;

  if (
    paymentValue === true ||
    String(
      paymentValue || "",
    )
      .trim()
      .toLowerCase() === "paid" ||
    String(
      paymentValue || "",
    )
      .trim()
      .toLowerCase() === "yes"
  ) {
    return "Paid";
  }

  return "Unpaid";
}

function getDeliveryDateValue(order) {
  const value =
    order?.deliveryDate ||
    order?.deliverySchedule ||
    "";

  if (!value) {
    return "";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "";
  }

  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1,
    ).padStart(2, "0");

  const day =
    String(
      date.getDate(),
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function SelectField({
  label,
  value,
  onChange,
  options,
  name,
}) {
  return (
    <div className="w-full">
      <label className="mb-2 block text-sm font-semibold text-text-primary">
        {label}
      </label>

      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="h-11 w-full appearance-none rounded-lg border border-[#C8E7F0] bg-white px-3 pr-10 text-sm text-text-primary outline-none transition focus:border-[#08779D] focus:ring-2 focus:ring-[#D5F1F8]"
        >
          {options.map(
            (option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ),
          )}
        </select>

        <ChevronDown
          size={17}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#7890A0]"
        />
      </div>
    </div>
  );
}

function EditOrder() {
  const navigate =
    useNavigate();

  /*
   * IMPORTANT:
   * The route is /admin/orders/edit/:id,
   * so we must read "id" here.
   */
  const { id } =
    useParams();

  const [order, setOrder] =
    useState(null);

  const [formData, setFormData] =
    useState({
      customerName: "",
      product: "",
      quantity: "",
      deliveryDate: "",
      total: "",
      paymentStatus: "Unpaid",
      status: "Pending",
    });

  const [
    showWarning,
    setShowWarning,
  ] = useState(false);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(true);

  /*
   * Find the order using either:
   * 1. orderNumber
   * 2. unique order id
   *
   * This allows every row in the Admin Orders
   * table to open correctly.
   */
  useEffect(() => {
    const savedOrders =
      getOrders();

    const routeId =
      String(id || "").trim();

    const foundOrder =
      Array.isArray(savedOrders)
        ? savedOrders.find((item) => {
            const currentOrderNumber =
              String(
                item?.orderNumber || "",
              ).trim();

            const currentId =
              String(
                item?.id || "",
              ).trim();

            return (
              currentOrderNumber ===
                routeId ||
              currentId === routeId
            );
          })
        : null;

    if (!foundOrder) {
      setOrder(null);
      setLoading(false);
      return;
    }

    setOrder(foundOrder);

    setFormData({
      customerName:
        foundOrder?.customerName ||
        foundOrder?.customer ||
        "",

      product:
        getOrderProductName(
          foundOrder,
        ),

      quantity:
        getOrderQuantity(
          foundOrder,
        ),

      deliveryDate:
        getDeliveryDateValue(
          foundOrder,
        ),

      total:
        getOrderTotal(
          foundOrder,
        ),

      paymentStatus:
        getPaymentStatus(
          foundOrder,
        ),

      status:
        normalizeStatus(
          foundOrder?.status,
        ),
    });

    setLoading(false);
  }, [id]);

  const handleChange = (
    event,
  ) => {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (current) => ({
        ...current,
        [name]: value,
      }),
    );
  };

  const handleSubmit = (
    event,
  ) => {
    event.preventDefault();

    if (!order) {
      return;
    }

    setShowWarning(true);
  };

  const handleConfirmSave =
    () => {
      if (!order || saving) {
        return;
      }

      setSaving(true);

      try {
        const numericQuantity =
          Number(
            formData.quantity || 0,
          );

        const numericTotal =
          Number(
            formData.total || 0,
          );

        const isPaid =
          formData.paymentStatus ===
          "Paid";

        /*
         * Preserve the original order identity.
         */
        const orderIdentifier =
          order?.orderNumber ||
          order?.id;

        /*
         * Keep the products array synchronized
         * with the edited product and quantity.
         */
        const updatedProducts =
          Array.isArray(
            order?.products,
          ) &&
          order.products.length > 0
            ? order.products.map(
                (product, index) => {
                  if (index !== 0) {
                    return product;
                  }

                  return {
                    ...product,
                    name:
                      formData.product.trim(),
                    quantity:
                      numericQuantity,
                    qty:
                      numericQuantity,
                  };
                },
              )
            : order?.products;

        /*
         * Build the complete updated order
         * while preserving all existing fields.
         */
        const updatedOrder = {
          ...order,

          /*
           * ORIGINAL IDENTITY
           */
          id: order?.id,

          orderNumber:
            order?.orderNumber,

          /*
           * CUSTOMER
           */
          customerName:
            formData.customerName.trim(),

          customer:
            formData.customerName.trim(),

          /*
           * PRODUCT
           */
          product:
            formData.product.trim(),

          /*
           * QUANTITY
           */
          quantity:
            numericQuantity,

          qty:
            numericQuantity,

          products:
            updatedProducts,

          /*
           * DELIVERY
           */
          deliveryDate:
            formData.deliveryDate,

          deliverySchedule:
            formData.deliveryDate,

          /*
           * TOTAL
           */
          total:
            numericTotal,

          totalAmount:
            numericTotal,

          grandTotal:
            numericTotal,

          amount:
            numericTotal,

          /*
           * PAYMENT
           */
          paymentStatus:
            formData.paymentStatus,

          paid:
            isPaid,

          isPaid:
            isPaid,

          payment: {
            ...(order?.payment || {}),
            status:
              formData.paymentStatus,
          },

          /*
           * ORDER STATUS
           */
          status:
            formData.status,

          /*
           * TIMESTAMP
           */
          updatedAt:
            new Date().toISOString(),
        };

        /*
         * ------------------------------------------------
         * SAVE DIRECTLY TO THE ORDERS STORAGE
         * ------------------------------------------------
         *
         * This matches BOTH the unique id and
         * orderNumber so an order can always be
         * updated, even if its order number is being
         * used by the Admin Orders table.
         */
        const currentOrders =
          getOrders();

        const updatedOrders =
          Array.isArray(
            currentOrders,
          )
            ? currentOrders.map(
                (existingOrder) => {
                  const existingId =
                    String(
                      existingOrder?.id ||
                        "",
                    ).trim();

                  const existingOrderNumber =
                    String(
                      existingOrder?.orderNumber ||
                        "",
                    ).trim();

                  const originalId =
                    String(
                      order?.id ||
                        "",
                    ).trim();

                  const originalOrderNumber =
                    String(
                      order?.orderNumber ||
                        "",
                    ).trim();

                  const matches =
                    (originalId &&
                      existingId ===
                        originalId) ||
                    (originalOrderNumber &&
                      existingOrderNumber ===
                        originalOrderNumber);

                  return matches
                    ? updatedOrder
                    : existingOrder;
                },
              )
            : [];

        /*
         * Make sure the order was actually found
         * before replacing the stored data.
         */
        const orderWasUpdated =
          updatedOrders.some(
            (existingOrder) => {
              const existingId =
                String(
                  existingOrder?.id ||
                    "",
                ).trim();

              const updatedId =
                String(
                  updatedOrder?.id ||
                    "",
                ).trim();

              const existingOrderNumber =
                String(
                  existingOrder?.orderNumber ||
                    "",
                ).trim();

              const updatedOrderNumber =
                String(
                  updatedOrder?.orderNumber ||
                    "",
                ).trim();

              return (
                (updatedId &&
                  existingId ===
                    updatedId) ||
                (updatedOrderNumber &&
                  existingOrderNumber ===
                    updatedOrderNumber)
              );
            },
          );

        if (!orderWasUpdated) {
          throw new Error(
            "The order could not be found in storage.",
          );
        }

        /*
         * Save the updated order list.
         */
        localStorage.setItem(
          ORDERS_KEY,
          JSON.stringify(
            updatedOrders,
          ),
        );

        /*
         * Also run the existing storage helper
         * so any existing order-storage behavior
         * remains compatible.
         */
        try {
          updateOrder(
            orderIdentifier,
            {
              ...updatedOrder,
            },
          );
        } catch (storageError) {
          /*
           * The direct localStorage update above
           * is already complete. This prevents a
           * storage helper mismatch from cancelling
           * an otherwise successful edit.
           */
          console.warn(
            "updateOrder helper warning:",
            storageError,
          );
        }

        /*
         * Keep local state synchronized.
         */
        setOrder(
          updatedOrder,
        );

        /*
         * Notify the Admin Orders table and
         * other pages immediately.
         */
        window.dispatchEvent(
          new Event(
            "orderUpdated",
          ),
        );

        window.dispatchEvent(
          new Event(
            "ordersUpdated",
          ),
        );

        /*
         * Show success toast on Admin Orders.
         */
        localStorage.setItem(
          ORDER_TOAST_KEY,
          "Order updated successfully.",
        );

        setShowWarning(false);
        setSaving(false);

        /*
         * Return to Admin Orders and highlight
         * the exact order that was edited.
         */
        navigate(
          `/admin/orders?highlight=${encodeURIComponent(
            orderIdentifier,
          )}`,
        );
      } catch (error) {
        console.error(
          "Failed to update order:",
          error,
        );

        setSaving(false);
        setShowWarning(false);
      }
    };

  if (loading) {
    return (
      <div className="flex min-h-screen w-full bg-white">
        <AdminSidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <Header />

          <main className="flex flex-1 items-center justify-center bg-white">
            <span className="text-sm text-text-secondary">
              Loading order...
            </span>
          </main>

          <AdminFooter />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-screen w-full bg-white">
        <AdminSidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <Header />

          <main className="flex flex-1 items-center justify-center bg-white">
            <div className="text-center">
              <h1 className="text-xl font-bold text-text-primary">
                Order not found
              </h1>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/admin/orders",
                  )
                }
                className="mt-4 rounded-lg bg-[#08779D] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#066783]"
              >
                Back to Orders
              </button>
            </div>
          </main>

          <AdminFooter />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-white">
      <AdminSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />

        <main className="min-w-0 flex-1 overflow-y-auto bg-white">
          <div className="mx-auto w-full max-w-[900px] px-5 py-7 pb-20 sm:px-7 sm:py-8 sm:pb-20 lg:px-9 lg:pb-20">
            {/* HEADER */}
            <div className="mb-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/admin/orders",
                  )
                }
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#D5E8EE] bg-white text-[#496777] transition hover:border-[#08779D] hover:text-[#08779D]"
                aria-label="Back to orders"
              >
                <ArrowLeft
                  size={18}
                />
              </button>

              <div>
                <h1 className="text-[28px] font-bold leading-tight tracking-[-0.02em] text-text-primary">
                  Edit Order
                </h1>

                <p className="mt-1 text-sm text-text-secondary">
                  Order #
                  {order?.orderNumber ||
                    order?.id}
                </p>
              </div>
            </div>

            {/* FORM */}
            <form
              onSubmit={
                handleSubmit
              }
              className="overflow-hidden rounded-xl border border-[#DCE9ED] bg-white shadow-[0_4px_18px_rgba(8,119,157,0.05)]"
            >
              <div className="border-b border-[#DCE9ED] bg-[#EAF7FA] px-5 py-4 sm:px-6">
                <h2 className="text-base font-bold text-[#123047]">
                  Order Information
                </h2>

                <p className="mt-1 text-sm text-[#496777]">
                  Update the order details below.
                </p>
              </div>

              <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
                {/* CUSTOMER */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-text-primary">
                    Customer Name
                  </label>

                  <input
                    type="text"
                    name="customerName"
                    value={
                      formData.customerName
                    }
                    onChange={
                      handleChange
                    }
                    className="h-11 w-full rounded-lg border border-[#C8E7F0] bg-white px-3 text-sm text-text-primary outline-none transition focus:border-[#08779D] focus:ring-2 focus:ring-[#D5F1F8]"
                  />
                </div>

                {/* PRODUCT */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-text-primary">
                    Product
                  </label>

                  <input
                    type="text"
                    name="product"
                    value={
                      formData.product
                    }
                    onChange={
                      handleChange
                    }
                    className="h-11 w-full rounded-lg border border-[#C8E7F0] bg-white px-3 text-sm text-text-primary outline-none transition focus:border-[#08779D] focus:ring-2 focus:ring-[#D5F1F8]"
                  />
                </div>

                {/* QUANTITY */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-text-primary">
                    Quantity
                  </label>

                  <input
                    type="number"
                    min="0"
                    name="quantity"
                    value={
                      formData.quantity
                    }
                    onChange={
                      handleChange
                    }
                    className="h-11 w-full rounded-lg border border-[#C8E7F0] bg-white px-3 text-sm text-text-primary outline-none transition focus:border-[#08779D] focus:ring-2 focus:ring-[#D5F1F8]"
                  />
                </div>

                {/* DELIVERY DATE */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-text-primary">
                    Delivery Date
                  </label>

                  <input
                    type="date"
                    name="deliveryDate"
                    value={
                      formData.deliveryDate
                    }
                    onChange={
                      handleChange
                    }
                    className="h-11 w-full rounded-lg border border-[#C8E7F0] bg-white px-3 text-sm text-text-primary outline-none transition focus:border-[#08779D] focus:ring-2 focus:ring-[#D5F1F8]"
                  />
                </div>

                {/* TOTAL */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-text-primary">
                    Total
                  </label>

                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#7890A0]">
                      ₱
                    </span>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      name="total"
                      value={
                        formData.total
                      }
                      onChange={
                        handleChange
                      }
                      className="h-11 w-full rounded-lg border border-[#C8E7F0] bg-white pl-8 pr-3 text-sm text-text-primary outline-none transition focus:border-[#08779D] focus:ring-2 focus:ring-[#D5F1F8]"
                    />
                  </div>
                </div>

                {/* PAYMENT */}
                <SelectField
                  label="Payment Status"
                  name="paymentStatus"
                  value={
                    formData.paymentStatus
                  }
                  onChange={
                    handleChange
                  }
                  options={[
                    {
                      value: "Paid",
                      label: "Paid",
                    },
                    {
                      value: "Unpaid",
                      label: "Unpaid",
                    },
                  ]}
                />

                {/* STATUS */}
                <SelectField
                  label="Order Status"
                  name="status"
                  value={
                    formData.status
                  }
                  onChange={
                    handleChange
                  }
                  options={statusOptions.map(
                    (status) => ({
                      value:
                        status,
                      label:
                        status,
                    }),
                  )}
                />
              </div>

              {/* BUTTONS */}
              <div className="flex flex-col-reverse gap-3 border-t border-[#DCE9ED] bg-[#F8FCFD] px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      "/admin/orders",
                    )
                  }
                  className="flex h-11 items-center justify-center gap-2 rounded-lg border border-[#C8E7F0] bg-white px-5 text-sm font-semibold text-[#496777] transition hover:border-[#08779D] hover:text-[#08779D]"
                >
                  <X size={16} />
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[#08779D] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#066783]"
                >
                  <Save size={16} />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </main>

        <AdminFooter />
      </div>

      {/* EDIT CONFIRMATION MODAL */}
      {showWarning && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/25 px-4">
          <div className="w-full max-w-[420px] rounded-xl border border-[#C8E7F0] bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.18)]">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EAF7FA] text-[#08779D]">
                <AlertTriangle
                  size={21}
                />
              </div>

              <div>
                <h2 className="text-base font-bold text-[#123047]">
                  Save Order Changes?
                </h2>

                <p className="mt-1.5 text-sm leading-5 text-[#496777]">
                  Are you sure you want to save
                  these changes to this order?
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() =>
                  setShowWarning(
                    false,
                  )
                }
                disabled={saving}
                className="rounded-lg border border-[#C8E7F0] bg-white px-4 py-2.5 text-sm font-semibold text-[#496777] transition hover:bg-[#F8FCFD] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  handleConfirmSave
                }
                disabled={saving}
                className="rounded-lg bg-[#08779D] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#066783] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditOrder;