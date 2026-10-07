import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import Header from "../../components/Header/Header";
import AdminFooter from "../../components/admin/AdminFooter";
import { getOrders } from "../../utils/orderStorage";

const defaultCustomers = [
  {
    id: "1",
    name: "John Doe",
    contact: "0917-123-4567",
    email: "john.doe@email.com",
    address: "123 Mabini St., Brgy. San Lorenzo, Makati",
    orders: 24,
    status: "Active",
  },
  {
    id: "2",
    name: "Jane Smith",
    contact: "0920-987-6543",
    email: "j.smith@email.com",
    address: "Unit 4B, The Residences, BGC, Taguig",
    orders: 8,
    status: "Active",
  },
  {
    id: "3",
    name: "Maria Santos",
    contact: "0917-555-0192",
    email: "maria.santos@email.com",
    address:
      "Block 4, Lot 12, Phase 2, Sunnyvale Subdivision, Brgy. San Jose, Antipolo",
    orders: 2,
    status: "Active",
  },
];

const orderHistory = {
  "1": [
    {
      id: "TRX-8921",
      date: "Oct 24, 2023",
      items: "2x Round Gallon",
      amount: "PHP 80.00",
      status: "COMPLETED",
    },
    {
      id: "TRX-8915",
      date: "Oct 18, 2023",
      items: "1x Slim Gallon",
      amount: "PHP 50.00",
      status: "COMPLETED",
    },
  ],
  "2": [
    {
      id: "TRX-7854",
      date: "Oct 20, 2023",
      items: "3x Round Gallon",
      amount: "PHP 120.00",
      status: "COMPLETED",
    },
  ],
  "3": [
    {
      id: "ORD-2023-104",
      date: "Oct 24, 2023",
      items: "5x 5-Gallon Round Refill",
      amount: "PHP 150.00",
      status: "PROCESSING",
    },
    {
      id: "ORD-2023-098",
      date: "Oct 18, 2023",
      items: "2x Slim Gallon Refill",
      amount: "PHP 100.00",
      status: "COMPLETED",
    },
  ],
};

const normalizeOrderStatus = (status) => {
  const normalized = String(status || "")
    .trim()
    .toLowerCase();

  if (normalized === "pending") {
    return "Pending";
  }

  if (
    normalized === "processing" ||
    normalized === "confirmed" ||
    normalized === "purifying"
  ) {
    return "Processing";
  }

  if (
    normalized === "out for delivery" ||
    normalized === "in transit" ||
    normalized === "delivery"
  ) {
    return "Out for Delivery";
  }

  if (
    normalized === "delivered" ||
    normalized === "completed"
  ) {
    return "Delivered";
  }

  if (
    normalized === "cancelled" ||
    normalized === "canceled"
  ) {
    return "Cancelled";
  }

  return String(status || "");
};

const getOrderStatusClass = (status) => {
  const normalizedStatus = normalizeOrderStatus(status);

  switch (normalizedStatus) {
    case "Pending":
      return "border border-amber-200 bg-amber-100 text-amber-800";

    case "Processing":
      return "border border-blue-200 bg-blue-100 text-blue-800";

    case "Out for Delivery":
      return "border border-cyan-200 bg-cyan-100 text-cyan-800";

    case "Delivered":
      return "border border-green-200 bg-green-100 text-green-800";

    case "Cancelled":
      return "border border-red-200 bg-red-100 text-red-800";

    default:
      return "border border-gray-200 bg-gray-100 text-gray-700";
  }
};

const getCustomerStatusClass = (status) => {
  const normalizedStatus = String(status || "")
    .trim()
    .toLowerCase();

  if (
    normalizedStatus === "inactive" ||
    normalizedStatus === "cancelled" ||
    normalizedStatus === "canceled"
  ) {
    return "border border-red-200 bg-red-100 text-red-800";
  }

  return "border border-green-200 bg-green-100 text-green-800";
};

/*
 * Builds the address fields shown in View Customer Details.
 *
 * This supports both:
 * 1. The structured address saved by Edit Profile.
 * 2. Older customer records that only contain `address`.
 */
const getAddressFields = (customer) => {
  const hasSeparateAddress =
    customer.addressLabel ||
    customer.region ||
    customer.province ||
    customer.city ||
    customer.barangay ||
    customer.postalCode ||
    customer.streetAddress;

  if (hasSeparateAddress) {
    return {
      addressLabel: customer.addressLabel || "",
      region: customer.region || "",
      province: customer.province || "",
      city: customer.city || "",
      barangay: customer.barangay || "",
      postalCode: customer.postalCode || "",
      streetAddress: customer.streetAddress || "",
    };
  }

  const addressParts = String(customer.address || "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  let streetAddress = "";
  let barangay = "";
  let city = "";
  let province = "";

  if (addressParts.length > 0) {
    streetAddress = addressParts[0];
  }

  const barangayIndex = addressParts.findIndex(
    (part) =>
      part.toLowerCase().startsWith("brgy.") ||
      part.toLowerCase().startsWith("barangay"),
  );

  if (barangayIndex !== -1) {
    barangay = addressParts[barangayIndex];

    if (barangayIndex + 1 < addressParts.length) {
      city = addressParts[barangayIndex + 1];
    }

    if (barangayIndex + 2 < addressParts.length) {
      province = addressParts[barangayIndex + 2];
    }
  } else if (addressParts.length > 1) {
    city = addressParts[addressParts.length - 1];
  }

  return {
    addressLabel: "",
    region: "",
    province,
    city,
    barangay,
    postalCode: "",
    streetAddress,
  };
};

const getOrderItems = (order) => {
  if (
    Array.isArray(order?.products) &&
    order.products.length > 0
  ) {
    return order.products.map((product) => ({
      name: product.name || "Water product",
      quantity: Number(product.quantity || 0),
    }));
  }

  const rawItems = String(order?.items || "").trim();

  if (!rawItems) {
    const fallbackProduct = String(
      order?.product || "",
    ).trim();

    if (fallbackProduct) {
      return [
        {
          name: fallbackProduct,
          quantity: Number(order?.qty || 1),
        },
      ];
    }

    return [];
  }

  return rawItems
    .split(/\s*\+\s*|\n|,/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      const quantityMatch = item.match(
        /^(\d+)\s*x\s*(.+)$/i,
      );

      if (quantityMatch) {
        return {
          name: quantityMatch[2].trim(),
          quantity: Number(quantityMatch[1]),
        };
      }

      return {
        name: item,
        quantity: 1,
      };
    });
};

const convertLiveOrderToHistory = (order) => {
  const orderId = String(
    order?.orderNumber ||
      order?.id ||
      "",
  ).replace(/^#+/, "");

  const deliveryDate =
    order?.deliveryDate ||
    order?.deliverySchedule ||
    order?.createdAt ||
    "";

  let formattedDate = deliveryDate;

  if (deliveryDate) {
    const parsedDate = new Date(deliveryDate);

    if (!Number.isNaN(parsedDate.getTime())) {
      formattedDate = parsedDate.toLocaleDateString(
        "en-US",
        {
          month: "short",
          day: "numeric",
          year: "numeric",
        },
      );
    }
  }

  const amount = Number(order?.total || 0);

  return {
    id: orderId || `ORDER-${Date.now()}`,
    date: formattedDate || "Today",
    items: "",
    amount: `PHP ${amount.toFixed(2)}`,
    status: order?.status || "Pending",
    products: Array.isArray(order?.products)
      ? order.products
      : [],
    originalOrder: order,
  };
};

/*
 * IMPORTANT:
 * Edit Profile uses profileStorage.
 *
 * This converts the saved customer profile into the same
 * structure used by the admin Customers and View Customer
 * Details pages.
 */
const getProfileCustomerData = () => {
  try {
    const rawProfile =
      localStorage.getItem("customerProfile");

    if (!rawProfile) {
      return null;
    }

    const profile = JSON.parse(rawProfile);

    if (!profile || typeof profile !== "object") {
      return null;
    }

    const firstAddress =
      Array.isArray(profile.addresses) &&
      profile.addresses.length > 0
        ? profile.addresses[0]
        : {};

    const fullName =
      profile.fullName ||
      profile.name ||
      "";

    const phoneNumber =
      profile.phoneNumber ||
      profile.contact ||
      profile.contactNumber ||
      "";

    const email =
      profile.email ||
      "";

    const addressLabel =
      firstAddress.label ||
      firstAddress.addressLabel ||
      "";

    const region =
      firstAddress.region ||
      "";

    const province =
      firstAddress.province ||
      "";

    const city =
      firstAddress.city ||
      firstAddress.municipality ||
      "";

    const barangay =
      firstAddress.barangay ||
      "";

    const postalCode =
      firstAddress.postalCode ||
      firstAddress.zipCode ||
      "";

    const streetAddress =
      firstAddress.streetAddress ||
      firstAddress.address ||
      firstAddress.street ||
      "";

    const addressParts = [
      streetAddress,
      barangay,
      city,
      province,
      region,
      postalCode,
    ].filter(Boolean);

    return {
      name: fullName,
      contact: phoneNumber,
      email,
      address: addressParts.join(", "),
      addressLabel,
      region,
      province,
      city,
      barangay,
      postalCode,
      streetAddress,
    };
  } catch {
    return null;
  }
};

function ViewCustomer() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [customers, setCustomers] = useState([]);
  const [savedOrders, setSavedOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  /*
   * Load customers.
   *
   * The important addition here is that the saved customer
   * profile is merged into the admin customer record.
   * This makes View Customer Details immediately reflect
   * changes made through Edit Profile.
   */
  useEffect(() => {
    const loadCustomers = () => {
      let storedCustomers = [];

      const savedCustomers =
        localStorage.getItem("adminCustomers");

      if (savedCustomers) {
        try {
          const parsedCustomers =
            JSON.parse(savedCustomers);

          if (Array.isArray(parsedCustomers)) {
            storedCustomers = parsedCustomers;
          }
        } catch {
          storedCustomers = [];
        }
      }

      if (storedCustomers.length === 0) {
        storedCustomers = defaultCustomers;
      }

      const profileData =
        getProfileCustomerData();

      if (profileData) {
        storedCustomers = storedCustomers.map(
          (customer) => {
            const isMaria =
              String(customer.id) === "3" ||
              String(customer.name || "")
                .trim()
                .toLowerCase() ===
                "maria santos";

            if (!isMaria) {
              return customer;
            }

            return {
              ...customer,
              ...profileData,
              id: customer.id,
              orders: customer.orders,
              status:
                customer.status ||
                profileData.status ||
                "Active",
            };
          },
        );

        /*
         * Keep adminCustomers synchronized as well.
         * This means Customers.jsx and ViewCustomer.jsx
         * read the same updated customer information.
         */
        localStorage.setItem(
          "adminCustomers",
          JSON.stringify(storedCustomers),
        );
      }

      setCustomers(storedCustomers);
    };

    loadCustomers();

    const handleCustomersUpdated = () => {
      loadCustomers();
    };

    window.addEventListener(
      "storage",
      handleCustomersUpdated,
    );

    window.addEventListener(
      "customerUpdated",
      handleCustomersUpdated,
    );

    window.addEventListener(
      "customersUpdated",
      handleCustomersUpdated,
    );

    const interval = setInterval(
      loadCustomers,
      1000,
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleCustomersUpdated,
      );

      window.removeEventListener(
        "customerUpdated",
        handleCustomersUpdated,
      );

      window.removeEventListener(
        "customersUpdated",
        handleCustomersUpdated,
      );

      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const loadOrders = () => {
      const orders = getOrders();

      setSavedOrders(
        Array.isArray(orders)
          ? [...orders]
          : [],
      );
    };

    loadOrders();

    const handleOrdersUpdated = () => {
      loadOrders();
    };

    window.addEventListener(
      "storage",
      handleOrdersUpdated,
    );

    window.addEventListener(
      "orderUpdated",
      handleOrdersUpdated,
    );

    window.addEventListener(
      "ordersUpdated",
      handleOrdersUpdated,
    );

    const interval = setInterval(
      loadOrders,
      1000,
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleOrdersUpdated,
      );

      window.removeEventListener(
        "orderUpdated",
        handleOrdersUpdated,
      );

      window.removeEventListener(
        "ordersUpdated",
        handleOrdersUpdated,
      );

      clearInterval(interval);
    };
  }, []);

  const customer = useMemo(() => {
    return customers.find(
      (item) =>
        String(item.id) === String(id),
    );
  }, [customers, id]);

  const customerOrders = useMemo(() => {
    if (!customer) {
      return [];
    }

    const existingHistory =
      orderHistory[String(id)] || [];

    const customerName = String(
      customer.name || "",
    )
      .trim()
      .toLowerCase();

    const customerContact = String(
      customer.contact ||
        customer.contactNumber ||
        "",
    ).replace(/\D/g, "");

    const liveCustomerOrders =
      savedOrders
        .filter((order) => {
          const orderCustomerName =
            String(
              order.customerName ||
                order.customer ||
                "",
            )
              .trim()
              .toLowerCase();

          const orderContact = String(
            order.contactNumber ||
              order.customerContact ||
              order.contact ||
              "",
          ).replace(/\D/g, "");

          const matchesName =
            customerName &&
            orderCustomerName &&
            orderCustomerName ===
              customerName;

          const matchesContact =
            customerContact &&
            orderContact &&
            orderContact ===
              customerContact;

          return (
            matchesName ||
            matchesContact
          );
        })
        .map(convertLiveOrderToHistory);

    const combinedOrders = [
      ...existingHistory,
      ...liveCustomerOrders,
    ];

    const uniqueOrders = [];
    const seenOrderIds = new Set();

    combinedOrders.forEach((order) => {
      const orderId = String(
        order.id || "",
      )
        .trim()
        .toLowerCase();

      if (
        orderId &&
        seenOrderIds.has(orderId)
      ) {
        return;
      }

      if (orderId) {
        seenOrderIds.add(orderId);
      }

      uniqueOrders.push(order);
    });

    return uniqueOrders;
  }, [
    customer,
    id,
    savedOrders,
  ]);

  useEffect(() => {
    const totalPages = Math.max(
      1,
      Math.ceil(
        customerOrders.length /
          itemsPerPage,
      ),
    );

    setCurrentPage((page) =>
      Math.min(page, totalPages),
    );
  }, [customerOrders.length]);

  const paginatedOrders = useMemo(() => {
    const startIndex =
      (currentPage - 1) *
      itemsPerPage;

    return customerOrders.slice(
      startIndex,
      startIndex + itemsPerPage,
    );
  }, [
    customerOrders,
    currentPage,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      customerOrders.length /
        itemsPerPage,
    ),
  );

  const showingStart =
    customerOrders.length === 0
      ? 0
      : (currentPage - 1) *
          itemsPerPage +
        1;

  const showingEnd = Math.min(
    currentPage * itemsPerPage,
    customerOrders.length,
  );

  const totalCustomerOrders =
    customerOrders.length > 0
      ? customerOrders.length
      : Number(customer?.orders || 0);

  const addressFields = useMemo(() => {
    if (!customer) {
      return null;
    }

    return getAddressFields(customer);
  }, [customer]);

  const handleBack = () => {
    navigate("/admin/customers");
  };

  if (!customer) {
    return (
      <div className="flex min-h-screen w-full bg-background-main">
        <AdminSidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <Header />

          <main className="min-w-0 flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-[1100px] px-5 py-8 pb-16 sm:px-7 sm:pb-16">
              <button
                type="button"
                onClick={handleBack}
                className="mb-5 text-sm font-semibold text-text-accent hover:underline"
              >
                ← Back to Customers
              </button>

              <div className="rounded-xl border border-card-border bg-card-background p-10 text-center shadow-card">
                <h1 className="text-xl font-bold text-text-primary">
                  Customer Not Found
                </h1>

                <p className="mt-2 text-sm text-text-secondary">
                  The customer you are looking for does not exist.
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const completedOrders =
    customerOrders.filter(
      (order) =>
        normalizeOrderStatus(
          order.status,
        ) === "Delivered",
    ).length;

  return (
    <div className="flex min-h-screen w-full bg-background-main">
      <AdminSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />

        <main className="min-w-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1100px] px-5 py-8 pb-16 sm:px-7 sm:pb-16">

            <div className="mb-7">
              <button
                type="button"
                onClick={handleBack}
                className="mb-4 text-sm font-semibold text-text-accent transition-colors hover:text-text-primary hover:underline"
              >
                ← Back to Customers
              </button>

              <div className="flex flex-col gap-4 rounded-xl border border-card-border bg-card-background p-6 shadow-card sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-[0.7px] text-text-secondary">
                    Customer
                  </p>

                  <h1 className="break-words text-2xl font-bold leading-8 tracking-[-0.25px] text-text-primary sm:text-3xl sm:leading-10">
                    Customer Details
                  </h1>

                  <p className="mt-1 text-sm text-text-secondary">
                    View customer information and order history
                  </p>
                </div>

                <span
                  className={`inline-flex w-fit shrink-0 items-center rounded-full px-4 py-2 text-xs font-semibold ${getCustomerStatusClass(
                    customer.status,
                  )}`}
                >
                  {customer.status || "Active"}
                </span>
              </div>
            </div>

            <section className="mb-6 w-full rounded-xl border border-card-border bg-card-background shadow-card">
              <div className="border-b border-border-light px-6 py-5">
                <h2 className="text-base font-bold text-text-primary">
                  Customer Information
                </h2>

                <p className="mt-1 text-xs text-text-secondary">
                  Personal and contact information for this customer
                </p>
              </div>

              <div className="p-6">
                <div className="grid w-full grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">

                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-[0.7px] text-text-secondary">
                      Full Name
                    </p>

                    <p className="break-words text-base font-bold text-text-primary">
                      {customer.name}
                    </p>
                  </div>

                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-[0.7px] text-text-secondary">
                      Contact Number
                    </p>

                    <p className="break-words text-base text-text-primary">
                      {customer.contact}
                    </p>
                  </div>

                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-[0.7px] text-text-secondary">
                      Email Address
                    </p>

                    <p className="break-words text-base text-text-primary">
                      {customer.email}
                    </p>
                  </div>

                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-[0.7px] text-text-secondary">
                      Total Orders
                    </p>

                    <p className="text-base font-bold text-text-primary">
                      {totalCustomerOrders}
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <div className="mb-4 border-t border-border-light pt-6">
                      <p className="text-sm font-bold text-text-primary">
                        Address
                      </p>

                      <p className="mt-1 text-xs text-text-secondary">
                        Customer delivery address
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">

                      {addressFields.addressLabel && (
                        <div>
                          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.7px] text-text-secondary">
                            Address Label
                          </p>

                          <p className="break-words text-base text-text-primary">
                            {addressFields.addressLabel}
                          </p>
                        </div>
                      )}

                      {addressFields.region && (
                        <div>
                          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.7px] text-text-secondary">
                            Region
                          </p>

                          <p className="break-words text-base text-text-primary">
                            {addressFields.region}
                          </p>
                        </div>
                      )}

                      {addressFields.province && (
                        <div>
                          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.7px] text-text-secondary">
                            Province
                          </p>

                          <p className="break-words text-base text-text-primary">
                            {addressFields.province}
                          </p>
                        </div>
                      )}

                      {addressFields.city && (
                        <div>
                          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.7px] text-text-secondary">
                            City / Municipality
                          </p>

                          <p className="break-words text-base text-text-primary">
                            {addressFields.city}
                          </p>
                        </div>
                      )}

                      {addressFields.barangay && (
                        <div>
                          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.7px] text-text-secondary">
                            Barangay
                          </p>

                          <p className="break-words text-base text-text-primary">
                            {addressFields.barangay}
                          </p>
                        </div>
                      )}

                      {addressFields.postalCode && (
                        <div>
                          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.7px] text-text-secondary">
                            Postal Code
                          </p>

                          <p className="break-words text-base text-text-primary">
                            {addressFields.postalCode}
                          </p>
                        </div>
                      )}

                      {addressFields.streetAddress && (
                        <div className="sm:col-span-2">
                          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.7px] text-text-secondary">
                            Street Name / Building / House No.
                          </p>

                          <p className="break-words text-base leading-7 text-text-primary">
                            {addressFields.streetAddress}
                          </p>
                        </div>
                      )}

                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-6 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-6 py-5">
                <h2 className="text-base font-semibold text-slate-800">
                  Order Summary
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Overview of this customer's order activity
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 bg-slate-50/60 p-5 sm:grid-cols-3 sm:p-6">

                <div className="rounded-lg border border-slate-200 bg-white p-5 transition-shadow hover:shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.7px] text-slate-500">
                    Total Orders
                  </p>

                  <p className="mt-3 text-2xl font-bold leading-none text-slate-900">
                    {totalCustomerOrders}
                  </p>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-5 transition-shadow hover:shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.7px] text-slate-500">
                    Delivered
                  </p>

                  <p className="mt-3 text-2xl font-bold leading-none text-slate-900">
                    {completedOrders}
                  </p>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-5 transition-shadow hover:shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.7px] text-slate-500">
                    Customer Status
                  </p>

                  <p className="mt-3 text-base font-semibold text-slate-800">
                    {customer.status || "Active"}
                  </p>
                </div>

              </div>
            </section>

            <section className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-6 py-5">
                <h2 className="text-base font-semibold text-slate-800">
                  Recent Order History
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Recent transactions and delivery status
                </p>
              </div>

              <div className="w-full overflow-x-auto">
                {customerOrders.length > 0 ? (
                  <table className="w-full min-w-[700px] border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.7px] text-slate-600">
                          Order
                        </th>

                        <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.7px] text-slate-600">
                          Date
                        </th>

                        <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.7px] text-slate-600">
                          Items
                        </th>

                        <th className="px-5 py-4 text-right text-[11px] font-semibold uppercase tracking-[0.7px] text-slate-600">
                          Amount
                        </th>

                        <th className="px-5 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.7px] text-slate-600">
                          Status
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {paginatedOrders.map(
                        (order, index) => {
                          const orderItems =
                            getOrderItems(order);

                          return (
                            <tr
                              key={`${order.id}-${index}`}
                              className="bg-white transition-colors hover:bg-slate-50/70"
                            >
                              <td className="whitespace-nowrap px-5 py-5 align-top text-sm font-semibold text-slate-800">
                                #{order.id}
                              </td>

                              <td className="whitespace-nowrap px-5 py-5 align-top text-sm text-slate-600">
                                {order.date}
                              </td>

                              <td className="px-5 py-5 align-top">
                                <div className="flex min-w-[240px] flex-col gap-2">
                                  {orderItems.length > 0 ? (
                                    orderItems.map(
                                      (
                                        item,
                                        itemIndex,
                                      ) => (
                                        <div
                                          key={`${item.name}-${itemIndex}`}
                                          className="flex min-h-6 w-full items-center justify-between gap-4"
                                        >
                                          <span className="min-w-0 flex-1 break-words text-sm leading-5 text-slate-700">
                                            {item.name}
                                          </span>

                                          <span className="inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 px-1.5 text-[10px] font-semibold leading-none text-slate-600">
                                            {item.quantity}
                                          </span>
                                        </div>
                                      ),
                                    )
                                  ) : (
                                    <span className="text-sm text-slate-500">
                                      No items available
                                    </span>
                                  )}
                                </div>
                              </td>

                              <td className="whitespace-nowrap px-5 py-5 text-right align-top text-sm font-semibold text-slate-800">
                                {order.amount}
                              </td>

                              <td className="whitespace-nowrap px-5 py-5 text-center align-top">
                                <span
                                  className={`inline-flex items-center justify-center rounded-full px-3 py-1.5 text-xs font-medium ${getOrderStatusClass(
                                    order.status,
                                  )}`}
                                >
                                  {normalizeOrderStatus(
                                    order.status,
                                  )}
                                </span>
                              </td>
                            </tr>
                          );
                        },
                      )}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-8 text-center text-sm text-slate-500">
                    No order history available for this customer.
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-4 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                  <span>
                    Showing{" "}
                    <span className="font-semibold text-slate-700">
                      {showingStart}-{showingEnd}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-slate-700">
                      {customerOrders.length}
                    </span>{" "}
                    items
                  </span>

                  <span className="hidden text-slate-300 sm:inline">
                    |
                  </span>

                  <span className="font-medium text-slate-500">
                    10 per page
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    aria-label="Previous page"
                    disabled={currentPage === 1}
                    onClick={() =>
                      setCurrentPage((page) =>
                        Math.max(1, page - 1),
                      )
                    }
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full text-lg font-medium text-slate-400 transition-colors hover:bg-white hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    ‹
                  </button>

                  {Array.from(
                    {
                      length: totalPages,
                    },
                    (_, index) =>
                      index + 1,
                  ).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() =>
                        setCurrentPage(page)
                      }
                      className={`inline-flex h-9 min-w-9 items-center justify-center rounded-full px-3 text-sm font-semibold transition-colors ${
                        currentPage === page
                          ? "bg-[#08779D] text-white shadow-sm"
                          : "text-slate-500 hover:bg-white hover:text-slate-800"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    type="button"
                    aria-label="Next page"
                    disabled={
                      currentPage === totalPages
                    }
                    onClick={() =>
                      setCurrentPage((page) =>
                        Math.min(
                          totalPages,
                          page + 1,
                        ),
                      )
                    }
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full text-lg font-medium text-slate-400 transition-colors hover:bg-white hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    ›
                  </button>
                </div>
              </div>
            </section>
          </div>
        </main>

        <AdminFooter />
      </div>
    </div>
  );
}

export default ViewCustomer;