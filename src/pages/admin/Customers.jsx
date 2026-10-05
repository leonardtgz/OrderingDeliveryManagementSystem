import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import Header from "../../components/Header/Header";
import AdminFooter from "../../components/admin/AdminFooter";

const CUSTOMER_TOAST_KEY = "adminCustomerToast";
const CUSTOMERS_PER_PAGE = 10;

const defaultCustomers = [
  {
    id: "1",
    name: "John Doe",
    contact: "0917-123-4567",
    email: "john.doe@email.com",
    address: "123 Mabini St., Brgy. San Lorenzo, Makati",
    orders: 24,
  },
  {
    id: "2",
    name: "Jane Smith",
    contact: "0920-987-6543",
    email: "j.smith@email.com",
    address: "Unit 4B, The Residences, BGC, Taguig",
    orders: 8,
  },
  {
    id: "3",
    name: "Maria Santos",
    contact: "0917-555-0192",
    email: "maria.santos@email.com",
    address:
      "Block 4, Lot 12, Phase 2, Sunnyvale Subdivision, Brgy. San Jose, Antipolo",
    orders: 2,
  },
];

const restoreMissingDefaultCustomers = (savedCustomers) => {
  const currentCustomers = Array.isArray(savedCustomers)
    ? [...savedCustomers]
    : [];

  const existingNames = new Set(
    currentCustomers.map((customer) =>
      String(customer?.name || "")
        .trim()
        .toLowerCase(),
    ),
  );

  let changed = false;

  defaultCustomers.forEach((defaultCustomer) => {
    const normalizedName = defaultCustomer.name
      .trim()
      .toLowerCase();

    if (!existingNames.has(normalizedName)) {
      currentCustomers.push(defaultCustomer);
      existingNames.add(normalizedName);
      changed = true;
    }
  });

  return {
    customers: currentCustomers,
    changed,
  };
};

export default function Customers() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState([]);
  const [sortOption, setSortOption] = useState("name-asc");
  const [showSort, setShowSort] = useState(false);
  const [openActionId, setOpenActionId] = useState(null);
  const [actionMenuPosition, setActionMenuPosition] =
    useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [customerToDelete, setCustomerToDelete] =
    useState(null);
  const [showDeleteModal, setShowDeleteModal] =
    useState(false);
  const [toast, setToast] = useState("");

  /* ---------------------------------------------
     LOAD CUSTOMERS
  --------------------------------------------- */
  useEffect(() => {
    const savedCustomers =
      localStorage.getItem("adminCustomers");

    if (savedCustomers) {
      try {
        const parsedCustomers =
          JSON.parse(savedCustomers);

        if (Array.isArray(parsedCustomers)) {
          const {
            customers: restoredCustomers,
            changed,
          } = restoreMissingDefaultCustomers(
            parsedCustomers,
          );

          setCustomers(restoredCustomers);

          if (changed) {
            localStorage.setItem(
              "adminCustomers",
              JSON.stringify(restoredCustomers),
            );
          }

          return;
        }
      } catch {
        // Ignore invalid localStorage data
      }
    }

    setCustomers(defaultCustomers);

    localStorage.setItem(
      "adminCustomers",
      JSON.stringify(defaultCustomers),
    );
  }, []);

  /* ---------------------------------------------
     CUSTOMER TOAST
  --------------------------------------------- */
  useEffect(() => {
    const savedToast =
      localStorage.getItem(CUSTOMER_TOAST_KEY);

    if (!savedToast) {
      return;
    }

    localStorage.removeItem(CUSTOMER_TOAST_KEY);
    setToast(savedToast);

    const timeoutId = setTimeout(() => {
      setToast("");
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  /* ---------------------------------------------
     LISTEN FOR CUSTOMER UPDATES
  --------------------------------------------- */
  useEffect(() => {
    const handleCustomerUpdate = () => {
      const savedCustomers =
        localStorage.getItem("adminCustomers");

      if (!savedCustomers) {
        return;
      }

      try {
        const parsedCustomers =
          JSON.parse(savedCustomers);

        if (Array.isArray(parsedCustomers)) {
          const {
            customers: restoredCustomers,
            changed,
          } = restoreMissingDefaultCustomers(
            parsedCustomers,
          );

          setCustomers(restoredCustomers);

          if (changed) {
            localStorage.setItem(
              "adminCustomers",
              JSON.stringify(restoredCustomers),
            );
          }
        }
      } catch {
        // Ignore invalid localStorage data
      }
    };

    window.addEventListener(
      "storage",
      handleCustomerUpdate,
    );

    window.addEventListener(
      "customerUpdated",
      handleCustomerUpdate,
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleCustomerUpdate,
      );

      window.removeEventListener(
        "customerUpdated",
        handleCustomerUpdate,
      );
    };
  }, []);

  /* ---------------------------------------------
     CLOSE MENUS WHEN CLICKING OUTSIDE
  --------------------------------------------- */
  useEffect(() => {
    const handleDocumentClick = (event) => {
      const target = event.target;

      if (
        !target.closest(
          "[data-customer-sort-menu]",
        )
      ) {
        setShowSort(false);
      }

      if (
        !target.closest(
          "[data-customer-action-button]",
        ) &&
        !target.closest(
          "[data-customer-action-portal]",
        )
      ) {
        setOpenActionId(null);
        setActionMenuPosition(null);
      }
    };

    document.addEventListener(
      "mousedown",
      handleDocumentClick,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleDocumentClick,
      );
    };
  }, []);

  /* ---------------------------------------------
     KEEP PORTAL MENU POSITIONED
  --------------------------------------------- */
  useEffect(() => {
    if (!openActionId) {
      return;
    }

    const updateMenuPosition = () => {
      const button = document.querySelector(
        `[data-customer-action-button="${openActionId}"]`,
      );

      if (!button) {
        return;
      }

      const rect = button.getBoundingClientRect();
      const menuWidth = 176;
      const menuHeight = 140;
      const spacing = 8;

      let left = rect.right - menuWidth;
      let top = rect.bottom + spacing;

      if (left < 8) {
        left = 8;
      }

      if (
        left + menuWidth >
        window.innerWidth - 8
      ) {
        left =
          window.innerWidth -
          menuWidth -
          8;
      }

      if (
        top + menuHeight >
        window.innerHeight - 8
      ) {
        top =
          rect.top -
          menuHeight -
          spacing;
      }

      if (top < 8) {
        top = 8;
      }

      setActionMenuPosition({
        top,
        left,
      });
    };

    updateMenuPosition();

    window.addEventListener(
      "resize",
      updateMenuPosition,
    );

    window.addEventListener(
      "scroll",
      updateMenuPosition,
      true,
    );

    return () => {
      window.removeEventListener(
        "resize",
        updateMenuPosition,
      );

      window.removeEventListener(
        "scroll",
        updateMenuPosition,
        true,
      );
    };
  }, [openActionId]);

  /* ---------------------------------------------
     SEARCH
  --------------------------------------------- */
  const filteredCustomers = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return customers;
    }

    return customers.filter((customer) => {
      const name = String(
        customer.name || "",
      ).toLowerCase();

      const email = String(
        customer.email || "",
      ).toLowerCase();

      const contact = String(
        customer.contact || "",
      ).toLowerCase();

      const address = String(
        customer.address || "",
      ).toLowerCase();

      return (
        name.includes(query) ||
        email.includes(query) ||
        contact.includes(query) ||
        address.includes(query)
      );
    });
  }, [search, customers]);

  /* ---------------------------------------------
     SORT
  --------------------------------------------- */
  const sortedCustomers = useMemo(() => {
    const sorted = [...filteredCustomers];

    switch (sortOption) {
      case "name-desc":
        return sorted.sort((a, b) =>
          String(b.name || "").localeCompare(
            String(a.name || ""),
          ),
        );

      case "orders-high":
        return sorted.sort(
          (a, b) =>
            Number(b.orders || 0) -
            Number(a.orders || 0),
        );

      case "orders-low":
        return sorted.sort(
          (a, b) =>
            Number(a.orders || 0) -
            Number(b.orders || 0),
        );

      case "name-asc":
      default:
        return sorted.sort((a, b) =>
          String(a.name || "").localeCompare(
            String(b.name || ""),
          ),
        );
    }
  }, [filteredCustomers, sortOption]);

  /* ---------------------------------------------
     PAGINATION
  --------------------------------------------- */
  const totalPages = Math.max(
    1,
    Math.ceil(
      sortedCustomers.length /
        CUSTOMERS_PER_PAGE,
    ),
  );

  const paginatedCustomers = useMemo(() => {
    const startIndex =
      (currentPage - 1) *
      CUSTOMERS_PER_PAGE;

    return sortedCustomers.slice(
      startIndex,
      startIndex + CUSTOMERS_PER_PAGE,
    );
  }, [sortedCustomers, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortOption]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const showingStart =
    sortedCustomers.length === 0
      ? 0
      : (currentPage - 1) *
          CUSTOMERS_PER_PAGE +
        1;

  const showingEnd = Math.min(
    currentPage * CUSTOMERS_PER_PAGE,
    sortedCustomers.length,
  );

  /* ---------------------------------------------
     VIEW CUSTOMER
  --------------------------------------------- */
  const handleViewDetails = (customer) => {
    setOpenActionId(null);
    setActionMenuPosition(null);

    navigate(
      `/admin/customers/${customer.id}`,
    );
  };

  /* ---------------------------------------------
     EDIT CUSTOMER
  --------------------------------------------- */
  const handleEdit = (customer) => {
    setOpenActionId(null);
    setActionMenuPosition(null);

    navigate(
      `/admin/customers/${customer.id}/edit`,
    );
  };

  /* ---------------------------------------------
     THREE-DOT MENU
  --------------------------------------------- */
  const handleActionMenu = (
    event,
    customerId,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    setShowSort(false);

    const id = String(customerId);

    if (openActionId === id) {
      setOpenActionId(null);
      setActionMenuPosition(null);
      return;
    }

    const rect =
      event.currentTarget.getBoundingClientRect();

    const menuWidth = 176;
    const menuHeight = 140;
    const spacing = 8;

    let left = rect.right - menuWidth;
    let top = rect.bottom + spacing;

    if (left < 8) {
      left = 8;
    }

    if (
      left + menuWidth >
      window.innerWidth - 8
    ) {
      left =
        window.innerWidth -
        menuWidth -
        8;
    }

    if (
      top + menuHeight >
      window.innerHeight - 8
    ) {
      top =
        rect.top -
        menuHeight -
        spacing;
    }

    if (top < 8) {
      top = 8;
    }

    setOpenActionId(id);

    setActionMenuPosition({
      top,
      left,
    });
  };

  /* ---------------------------------------------
     DELETE CUSTOMER
  --------------------------------------------- */
  const handleDeleteClick = (customer) => {
    setOpenActionId(null);
    setActionMenuPosition(null);

    const orderCount = Number(
      customer.orders || 0,
    );

    if (orderCount > 0) {
      window.alert(
        "This customer cannot be deleted because they have existing orders.",
      );
      return;
    }

    setCustomerToDelete(customer);
    setShowDeleteModal(true);
  };

  /* ---------------------------------------------
     CONFIRM DELETE
  --------------------------------------------- */
  const handleConfirmDelete = () => {
    if (!customerToDelete) {
      return;
    }

    const updatedCustomers =
      customers.filter(
        (customer) =>
          String(customer.id) !==
          String(customerToDelete.id),
      );

    setCustomers(updatedCustomers);

    localStorage.setItem(
      "adminCustomers",
      JSON.stringify(updatedCustomers),
    );

    window.dispatchEvent(
      new Event("customerUpdated"),
    );

    setCustomerToDelete(null);
    setShowDeleteModal(false);
  };

  /* ---------------------------------------------
     CANCEL DELETE
  --------------------------------------------- */
  const handleCancelDelete = () => {
    setCustomerToDelete(null);
    setShowDeleteModal(false);
  };

  /* ---------------------------------------------
     PORTAL ACTION MENU
  --------------------------------------------- */
  const actionMenu =
    openActionId &&
    actionMenuPosition &&
    typeof document !== "undefined"
      ? createPortal(
          <div
            data-customer-action-portal
            className="fixed z-[99999] w-44 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
            style={{
              top: `${actionMenuPosition.top}px`,
              left: `${actionMenuPosition.left}px`,
            }}
          >
            {(() => {
              const selectedCustomer =
                customers.find(
                  (customer) =>
                    String(customer.id) ===
                    String(openActionId),
                );

              if (!selectedCustomer) {
                return null;
              }

              return (
                <>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();

                      handleViewDetails(
                        selectedCustomer,
                      );
                    }}
                    className="flex w-full items-center px-4 py-2.5 text-left text-sm font-medium text-text-primary transition-colors hover:bg-slate-50"
                  >
                    View Details
                  </button>

                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();

                      handleEdit(
                        selectedCustomer,
                      );
                    }}
                    className="flex w-full items-center px-4 py-2.5 text-left text-sm font-medium text-text-primary transition-colors hover:bg-slate-50"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();

                      handleDeleteClick(
                        selectedCustomer,
                      );
                    }}
                    className="flex w-full items-center px-4 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                  >
                    Delete
                  </button>
                </>
              );
            })()}
          </div>,
          document.body,
        )
      : null;

  return (
    <div className="flex min-h-screen w-full bg-slate-50">
      <AdminSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />

        <main className="min-w-0 flex-1 overflow-y-auto">
          <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-5 py-7 pb-16 sm:px-7 sm:py-8 sm:pb-16 lg:px-8 lg:pb-16">
            {/* SUCCESS TOAST */}
            {toast && (
              <div className="fixed right-5 top-5 z-[200] flex items-center gap-3 rounded-lg border border-green-200 bg-white px-4 py-3 shadow-lg">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 12.5L9.5 17L19 7.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-green-600"
                    />
                  </svg>
                </div>

                <span className="text-sm font-semibold text-text-primary">
                  {toast}
                </span>
              </div>
            )}

            {/* PAGE HEADER */}
            <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-text-primary">
                  Customer Management
                </h2>

                <p className="mt-1 text-sm text-text-secondary">
                  Manage customer information and accounts.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/admin/customers/new",
                  )
                }
                className="flex h-11 items-center gap-2 rounded-lg bg-button-background px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-button-hover"
              >
                <Plus size={18} />
                <span>New Customer</span>
              </button>
            </div>

            {/* SEARCH + SORT */}
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative w-full max-w-[480px]">
                <Search
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value,
                    )
                  }
                  placeholder="Search customers..."
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-10 text-sm text-text-primary shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() =>
                      setSearch("")
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                    aria-label="Clear search"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* SORT */}
              <div
                className="relative"
                data-customer-sort-menu
              >
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();

                    setShowSort(
                      (current) =>
                        !current,
                    );

                    setOpenActionId(null);
                    setActionMenuPosition(
                      null,
                    );
                  }}
                  className="flex h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-text-primary shadow-sm transition-colors hover:bg-slate-50"
                >
                  <ArrowUpDown size={17} />

                  <span>Sort</span>

                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      showSort
                        ? "rotate-180"
                        : ""
                    }`}
                  />
                </button>

                {showSort && (
                  <div className="absolute left-0 top-full z-[9999] mt-2 w-48 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                    <button
                      type="button"
                      onClick={() => {
                        setSortOption(
                          "name-asc",
                        );
                        setShowSort(false);
                      }}
                      className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors ${
                        sortOption ===
                        "name-asc"
                          ? "bg-blue-50 font-semibold text-text-accent"
                          : "text-text-primary hover:bg-slate-50"
                      }`}
                    >
                      <span>Name A–Z</span>

                      {sortOption ===
                        "name-asc" && (
                        <span>✓</span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSortOption(
                          "name-desc",
                        );
                        setShowSort(false);
                      }}
                      className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors ${
                        sortOption ===
                        "name-desc"
                          ? "bg-blue-50 font-semibold text-text-accent"
                          : "text-text-primary hover:bg-slate-50"
                      }`}
                    >
                      <span>Name Z–A</span>

                      {sortOption ===
                        "name-desc" && (
                        <span>✓</span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSortOption(
                          "orders-high",
                        );
                        setShowSort(false);
                      }}
                      className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors ${
                        sortOption ===
                        "orders-high"
                          ? "bg-blue-50 font-semibold text-text-accent"
                          : "text-text-primary hover:bg-slate-50"
                      }`}
                    >
                      <span>
                        Orders High–Low
                      </span>

                      {sortOption ===
                        "orders-high" && (
                        <span>✓</span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSortOption(
                          "orders-low",
                        );
                        setShowSort(false);
                      }}
                      className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors ${
                        sortOption ===
                        "orders-low"
                          ? "bg-blue-50 font-semibold text-text-accent"
                          : "text-text-primary hover:bg-slate-50"
                      }`}
                    >
                      <span>
                        Orders Low–High
                      </span>

                      {sortOption ===
                        "orders-low" && (
                        <span>✓</span>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* CUSTOMER TABLE */}
            <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] border-collapse">
                  <thead>
                    <tr className="border-b border-blue-100 bg-blue-50">
                      <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.8px] text-slate-600">
                        Customer
                      </th>

                      <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.8px] text-slate-600">
                        Contact
                      </th>

                      <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.8px] text-slate-600">
                        Email
                      </th>

                      <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.8px] text-slate-600">
                        Address
                      </th>

                      <th className="px-5 py-3.5 text-center text-[11px] font-bold uppercase tracking-[0.8px] text-slate-600">
                        Orders
                      </th>

                      <th className="px-5 py-3.5 text-center text-[11px] font-bold uppercase tracking-[0.8px] text-slate-600">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedCustomers.length >
                    0 ? (
                      paginatedCustomers.map(
                        (customer) => (
                          <tr
                            key={customer.id}
                            className="border-b border-slate-100 bg-white transition-colors last:border-b-0 hover:bg-slate-50/60"
                          >
                            {/* CUSTOMER */}
                            <td className="px-5 py-4">
                              <div className="font-semibold text-text-primary">
                                {customer.name}
                              </div>
                            </td>

                            {/* CONTACT */}
                            <td className="px-5 py-4 text-sm text-text-primary">
                              {customer.contact}
                            </td>

                            {/* EMAIL */}
                            <td className="px-5 py-4 text-sm text-text-primary">
                              {customer.email}
                            </td>

                            {/* ADDRESS */}
                            <td className="max-w-[280px] px-5 py-4 text-sm leading-5 text-text-secondary">
                              {customer.address}
                            </td>

                            {/* ORDERS */}
                            <td className="px-5 py-4 text-center">
                              <span className="inline-flex min-w-[38px] items-center justify-center rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                                {customer.orders ||
                                  0}
                              </span>
                            </td>

                            {/* ACTIONS */}
                            <td className="px-5 py-4">
                              <div className="flex items-center justify-center">
                                <button
                                  type="button"
                                  data-customer-action-button={String(
                                    customer.id,
                                  )}
                                  onClick={(event) =>
                                    handleActionMenu(
                                      event,
                                      customer.id,
                                    )
                                  }
                                  className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                                  aria-label={`Actions for ${customer.name}`}
                                >
                                  <MoreVertical
                                    size={18}
                                  />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ),
                      )
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-5 py-12 text-center"
                        >
                          <div className="text-sm font-semibold text-text-primary">
                            No customers found
                          </div>

                          <p className="mt-1 text-sm text-text-secondary">
                            Try adjusting your
                            search.
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* TABLE FOOTER */}
              <div className="flex flex-col gap-4 border-t border-slate-100 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-text-secondary">
                  Showing{" "}
                  <span className="font-semibold text-text-primary">
                    {showingStart}
                    {sortedCustomers.length >
                      0 &&
                    showingEnd !==
                      showingStart
                      ? `-${showingEnd}`
                      : ""}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-text-primary">
                    {sortedCustomers.length}
                  </span>{" "}
                  items
                </p>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage(
                        (page) =>
                          Math.max(
                            1,
                            page - 1,
                          ),
                      )
                    }
                    disabled={
                      currentPage === 1
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={16} />
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
                      className={`flex h-8 min-w-8 items-center justify-center rounded-md border px-2 text-sm font-semibold transition-colors ${
                        currentPage === page
                          ? "border-button-background bg-button-background text-white"
                          : "border-slate-200 bg-white text-text-primary hover:bg-slate-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage(
                        (page) =>
                          Math.min(
                            totalPages,
                            page + 1,
                          ),
                      )
                    }
                    disabled={
                      currentPage ===
                      totalPages
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Next page"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>

        <AdminFooter />
      </div>

      {/* THREE-DOT MENU PORTAL */}
      {actionMenu}

      {/* DELETE MODAL */}
      {showDeleteModal &&
        customerToDelete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-[460px] overflow-hidden rounded-xl bg-white shadow-2xl">
              {/* Modal Header */}
              <div className="flex items-start justify-between px-6 pt-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                    <AlertTriangle
                      size={20}
                    />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-text-primary">
                      Delete Customer
                    </h2>

                    <p className="mt-1 text-sm text-text-secondary">
                      This action cannot be
                      undone.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={
                    handleCancelDelete
                  }
                  className="rounded-lg p-1 text-text-secondary transition-colors hover:bg-slate-100"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="px-6 py-6">
                <p className="text-sm leading-6 text-text-primary">
                  Are you sure you want to
                  delete{" "}
                  <span className="font-bold">
                    {customerToDelete.name}
                  </span>
                  ?
                </p>

                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
                  <div className="flex gap-3">
                    <Trash2
                      size={18}
                      className="mt-0.5 shrink-0 text-red-600"
                    />

                    <p className="text-sm leading-5 text-red-700">
                      This customer will be
                      permanently removed
                      from the customer
                      management list.
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 px-6 py-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={
                    handleCancelDelete
                  }
                  className="h-11 rounded-lg border border-slate-200 bg-white px-5 text-sm font-semibold text-text-primary transition-colors hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={
                    handleConfirmDelete
                  }
                  className="flex h-11 items-center justify-center gap-2 rounded-lg bg-red-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
                >
                  <Trash2 size={16} />
                  Delete Customer
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}