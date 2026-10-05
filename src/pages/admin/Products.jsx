import React, {
  useEffect,
  useState,
} from "react";

import { createPortal } from "react-dom";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  ChevronLeft,
  ChevronRight,
  MoreVertical,
} from "lucide-react";

import AdminSidebar from "../../components/admin/AdminSidebar";

import AdminFooter from "../../components/admin/AdminFooter";

import Header from "../../components/Header/Header";

import WarningModal from "../../components/admin/WarningModal";

import slimPurifiedWater from "../../assets/images/slim-purified-water.png";

import roundPurifiedWater from "../../assets/images/round-purified-water.png";

import bottle500ml from "../../assets/images/500ml-bottle.png";

const PRODUCTS_KEY = "adminProducts";

const PRODUCT_TOAST_KEY = "adminProductToast";

const ITEMS_PER_PAGE = 10;

const defaultProducts = [
  {
    id: "1",
    name: "Slim Gallon Refill",
    description: "Purified Drinking Water",
    quantity: 145,
    price: 25,
    status: "In Stock",
    image: slimPurifiedWater,
  },
  {
    id: "2",
    name: "Round Gallon Refill",
    description: "Purified Drinking Water",
    quantity: 85,
    price: 25,
    status: "In Stock",
    image: roundPurifiedWater,
  },
  {
    id: "3",
    name: "500ml Bottle (Case of 24)",
    description: "Purified Drinking Water",
    quantity: 50,
    price: 240,
    status: "In Stock",
    image: bottle500ml,
  },
];

const getProductImage = (product) => {
  if (product.image) {
    return product.image;
  }

  const productName = String(
    product.name || "",
  ).toLowerCase();

  if (productName.includes("slim")) {
    return slimPurifiedWater;
  }

  if (productName.includes("round")) {
    return roundPurifiedWater;
  }

  if (
    productName.includes("500ml") ||
    productName.includes("bottle")
  ) {
    return bottle500ml;
  }

  return slimPurifiedWater;
};

/*
 * Make sure the original/default products
 * always exist without removing any other
 * products that were added by the admin.
 */
const restoreMissingDefaultProducts = (
  savedProducts,
) => {
  const products = Array.isArray(savedProducts)
    ? [...savedProducts]
    : [];

  const existingNames = new Set(
    products.map((product) =>
      String(product?.name || "")
        .trim()
        .toLowerCase(),
    ),
  );

  defaultProducts.forEach((defaultProduct) => {
    const defaultName = String(
      defaultProduct.name || "",
    )
      .trim()
      .toLowerCase();

    if (!existingNames.has(defaultName)) {
      products.push(defaultProduct);
    }
  });

  return products;
};

const getProducts = () => {
  try {
    const savedProducts = localStorage.getItem(
      PRODUCTS_KEY,
    );

    if (!savedProducts) {
      localStorage.setItem(
        PRODUCTS_KEY,
        JSON.stringify(defaultProducts),
      );

      return defaultProducts;
    }

    const parsedProducts = JSON.parse(
      savedProducts,
    );

    if (!Array.isArray(parsedProducts)) {
      localStorage.setItem(
        PRODUCTS_KEY,
        JSON.stringify(defaultProducts),
      );

      return defaultProducts;
    }

    const restoredProducts =
      restoreMissingDefaultProducts(
        parsedProducts,
      );

    if (
      restoredProducts.length !==
      parsedProducts.length
    ) {
      localStorage.setItem(
        PRODUCTS_KEY,
        JSON.stringify(restoredProducts),
      );
    }

    return restoredProducts;
  } catch (error) {
    console.error(
      "Failed to load products:",
      error,
    );

    localStorage.setItem(
      PRODUCTS_KEY,
      JSON.stringify(defaultProducts),
    );

    return defaultProducts;
  }
};

const saveProducts = (products) => {
  localStorage.setItem(
    PRODUCTS_KEY,
    JSON.stringify(products),
  );

  window.dispatchEvent(
    new Event("productUpdated"),
  );
};

const isRefillProduct = (product) => {
  const productName = String(
    product?.name || "",
  ).toLowerCase();

  return (
    product?.productType === "Refill" ||
    productName.includes(
      "round gallon refill",
    ) ||
    productName.includes(
      "slim gallon refill",
    )
  );
};

function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  const [toast, setToast] = useState("");

  const [
    showWarning,
    setShowWarning,
  ] = useState(false);

  const [
    selectedProduct,
    setSelectedProduct,
  ] = useState(null);

  const [
    deleting,
    setDeleting,
  ] = useState(false);

  const [
    openActionId,
    setOpenActionId,
  ] = useState(null);

  const [
    actionMenuPosition,
    setActionMenuPosition,
  ] = useState(null);

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  useEffect(() => {
    const load = () => {
      setProducts(getProducts());
    };

    load();

    const handleProductUpdated = () => {
      load();
    };

    const handleStorage = (event) => {
      if (event.key === PRODUCTS_KEY) {
        load();
      }
    };

    window.addEventListener(
      "productUpdated",
      handleProductUpdated,
    );

    window.addEventListener(
      "storage",
      handleStorage,
    );

    return () => {
      window.removeEventListener(
        "productUpdated",
        handleProductUpdated,
      );

      window.removeEventListener(
        "storage",
        handleStorage,
      );
    };
  }, []);

  useEffect(() => {
    const savedToast =
      localStorage.getItem(
        PRODUCT_TOAST_KEY,
      );

    if (!savedToast) {
      return;
    }

    localStorage.removeItem(
      PRODUCT_TOAST_KEY,
    );

    setToast(savedToast);

    const timeout = setTimeout(() => {
      setToast("");
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  /*
   * Close the action menu when clicking
   * outside the button or portal menu.
   */
  useEffect(() => {
    const handleDocumentClick = (
      event,
    ) => {
      if (
        !event.target.closest(
          "[data-product-action-button]",
        ) &&
        !event.target.closest(
          "[data-product-action-portal]",
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

  /*
   * Position the portal menu relative
   * to the clicked three-dot button.
   */
  useEffect(() => {
    if (!openActionId) {
      setActionMenuPosition(null);
      return;
    }

    const updatePosition = () => {
      const button =
        document.querySelector(
          `[data-product-action-button="${openActionId}"]`,
        );

      if (!button) {
        return;
      }

      const rect =
        button.getBoundingClientRect();

      const menuWidth = 176;

      const menuHeight = 96;

      const gap = 8;

      let left =
        rect.right -
        menuWidth;

      let top =
        rect.bottom +
        gap;

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
          gap;
      }

      if (top < 8) {
        top = 8;
      }

      setActionMenuPosition({
        top,
        left,
      });
    };

    updatePosition();

    window.addEventListener(
      "resize",
      updatePosition,
    );

    window.addEventListener(
      "scroll",
      updatePosition,
      true,
    );

    return () => {
      window.removeEventListener(
        "resize",
        updatePosition,
      );

      window.removeEventListener(
        "scroll",
        updatePosition,
        true,
      );
    };
  }, [openActionId]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      products.length /
        ITEMS_PER_PAGE,
    ),
  );

  const paginatedProducts =
    products.slice(
      (currentPage - 1) *
        ITEMS_PER_PAGE,
      currentPage *
        ITEMS_PER_PAGE,
    );

  useEffect(() => {
    if (
      currentPage >
      totalPages
    ) {
      setCurrentPage(
        totalPages,
      );
    }
  }, [
    currentPage,
    totalPages,
  ]);

  const showingStart =
    products.length === 0
      ? 0
      : (currentPage - 1) *
          ITEMS_PER_PAGE +
        1;

  const showingEnd = Math.min(
    currentPage *
      ITEMS_PER_PAGE,
    products.length,
  );

  const handleEdit = (
    product,
  ) => {
    setOpenActionId(null);
    setActionMenuPosition(null);

    navigate(
      `/admin/products/edit/${product.id}`,
    );
  };

  const handleDelete = (
    product,
  ) => {
    if (deleting) {
      return;
    }

    setOpenActionId(null);
    setActionMenuPosition(null);

    setSelectedProduct(
      product,
    );

    setShowWarning(true);
  };

  const handleConfirmDelete =
    () => {
      if (
        !selectedProduct ||
        deleting
      ) {
        return;
      }

      setDeleting(true);

      try {
        const savedProducts =
          localStorage.getItem(
            PRODUCTS_KEY,
          );

        if (!savedProducts) {
          alert(
            "Product data could not be found.",
          );

          setDeleting(false);
          setShowWarning(false);
          setSelectedProduct(null);

          return;
        }

        const parsedProducts =
          JSON.parse(
            savedProducts,
          );

        if (
          !Array.isArray(
            parsedProducts,
          )
        ) {
          alert(
            "Product data is invalid.",
          );

          setDeleting(false);
          setShowWarning(false);
          setSelectedProduct(null);

          return;
        }

        const updatedProducts =
          parsedProducts.filter(
            (item) =>
              String(item.id) !==
              String(
                selectedProduct.id,
              ),
          );

        saveProducts(
          updatedProducts,
        );

        setProducts(
          updatedProducts,
        );

        setShowWarning(false);
        setSelectedProduct(null);
        setDeleting(false);
      } catch (error) {
        console.error(
          "Failed to delete product:",
          error,
        );

        alert(
          "Failed to delete the product.",
        );

        setDeleting(false);
        setShowWarning(false);
        setSelectedProduct(null);
      }
    };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />

        <main className="min-w-0 flex-1 overflow-y-auto bg-slate-50 pb-12">
          <div className="mx-auto w-full max-w-[1200px] px-5 py-7 sm:px-7 lg:px-8 lg:py-8">
            {/* Page Header */}
            <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <h1 className="text-2xl font-bold leading-8 tracking-[-0.2px] text-slate-800 sm:text-[26px]">
                Product Management
              </h1>

              <Link
                to="/admin/products/new"
                className="flex items-center gap-2.5 rounded-lg bg-button-background px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-button-hover"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 8H0V6H6V0H8V6H14V8H8V14H6V8Z"
                    fill="#FFFFFF"
                  />
                </svg>

                <span className="text-white">
                  Add Product
                </span>
              </Link>
            </div>

            {/* Product Table */}
            <section className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="w-full overflow-x-auto">
                <table className="w-full min-w-[760px] border-collapse">
                  <thead>
                    <tr className="border-b border-blue-100 bg-blue-50">
                      <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-[0.7px] text-slate-600">
                        Product Name
                      </th>

                      <th className="px-5 py-3.5 text-right text-xs font-bold uppercase tracking-[0.7px] text-slate-600">
                        Avail. Qty
                      </th>

                      <th className="px-5 py-3.5 text-center text-xs font-bold uppercase tracking-[0.7px] text-slate-600">
                        Status
                      </th>

                      <th className="px-5 py-3.5 text-right text-xs font-bold uppercase tracking-[0.7px] text-slate-600">
                        Price
                      </th>

                      <th className="px-5 py-3.5 text-center text-xs font-bold uppercase tracking-[0.7px] text-slate-600">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="bg-white">
                    {paginatedProducts.length >
                    0 ? (
                      paginatedProducts.map(
                        (product) => {
                          const refillProduct =
                            isRefillProduct(
                              product,
                            );

                          const actionId =
                            String(
                              product.id,
                            );

                          const quantity =
                            Number(
                              product.quantity,
                            );

                          /*
                           * Use the saved status first.
                           * Only calculate from quantity
                           * when no status exists.
                           */
                          const stockStatus =
                            product.status ||
                            (quantity <= 0
                              ? "Out of Stock"
                              : quantity <= 30
                                ? "Low Stock"
                                : "In Stock");

                          const stockStatusClass =
                            stockStatus ===
                            "Out of Stock"
                              ? "border-red-200 bg-red-50 text-red-700"
                              : stockStatus ===
                                  "Low Stock"
                                ? "border-yellow-200 bg-yellow-50 text-yellow-700"
                                : "border-green-200 bg-green-50 text-green-700";

                          return (
                            <tr
                              key={actionId}
                              className="border-t border-slate-100 bg-white transition-colors first:border-t-0 hover:bg-slate-50/70"
                            >
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-3.5">
                                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
                                    <img
                                      src={getProductImage(
                                        product,
                                      )}
                                      alt={
                                        product.name
                                      }
                                      className="h-8 w-8 object-contain"
                                    />
                                  </div>

                                  <div className="flex min-w-0 flex-col">
                                    <span className="text-sm font-semibold leading-5 text-slate-800">
                                      {
                                        product.name
                                      }
                                    </span>

                                    <span className="text-xs leading-5 text-slate-500">
                                      {
                                        product.description
                                      }
                                    </span>
                                  </div>
                                </div>
                              </td>

                              <td
                                className={`px-5 py-4 text-right text-sm font-medium leading-5 ${
                                  refillProduct
                                    ? "text-slate-400"
                                    : "text-slate-700"
                                }`}
                              >
                                {refillProduct
                                  ? "—"
                                  : product.quantity}
                              </td>

                              <td className="px-5 py-4 text-center">
                                {refillProduct ? (
                                  <span className="text-sm text-slate-400">
                                    —
                                  </span>
                                ) : (
                                  <span
                                    className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${stockStatusClass}`}
                                  >
                                    {
                                      stockStatus
                                    }
                                  </span>
                                )}
                              </td>

                              <td className="px-5 py-4 text-right text-sm font-medium leading-5 text-slate-700">
                                ₱{" "}
                                {Number(
                                  product.price,
                                ).toFixed(
                                  2,
                                )}
                              </td>

                              <td className="px-5 py-4">
                                <div className="relative flex items-center justify-center">
                                  <button
                                    type="button"
                                    data-product-action-button={
                                      actionId
                                    }
                                    onClick={(
                                      event,
                                    ) => {
                                      event.stopPropagation();

                                      if (
                                        openActionId ===
                                        actionId
                                      ) {
                                        setOpenActionId(
                                          null,
                                        );

                                        setActionMenuPosition(
                                          null,
                                        );

                                        return;
                                      }

                                      setOpenActionId(
                                        actionId,
                                      );
                                    }}
                                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
                                    aria-label={`Actions for ${product.name}`}
                                    aria-expanded={
                                      openActionId ===
                                      actionId
                                    }
                                  >
                                    <MoreVertical
                                      size={18}
                                    />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        },
                      )
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="px-5 py-12 text-center text-sm text-slate-500"
                        >
                          No products available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex w-full flex-col items-center justify-between gap-4 border-t border-slate-100 bg-white px-5 py-4 sm:flex-row">
                <span className="text-sm leading-6 text-slate-500">
                  Showing{" "}
                  <span className="font-semibold text-slate-700">
                    {showingStart}
                    -
                    {showingEnd}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-700">
                    {
                      products.length
                    }
                  </span>{" "}
                  items
                </span>

                <div className="flex items-center gap-1.5">
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
                      currentPage ===
                      1
                    }
                    aria-label="Previous page"
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 transition-colors hover:border-button-background hover:bg-button-background hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft
                      size={16}
                    />
                  </button>

                  {Array.from(
                    {
                      length:
                        totalPages,
                    },
                    (
                      _,
                      index,
                    ) =>
                      index + 1,
                  ).map(
                    (page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() =>
                          setCurrentPage(
                            page,
                          )
                        }
                        className={`flex h-8 min-w-8 items-center justify-center rounded-md border px-2.5 text-sm font-semibold transition-colors ${
                          currentPage ===
                          page
                            ? "border-button-background bg-button-background text-white"
                            : "border-slate-200 bg-white text-slate-600 hover:border-button-background hover:bg-button-background hover:text-white"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}

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
                    aria-label="Next page"
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 transition-colors hover:border-button-background hover:bg-button-background hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronRight
                      size={16}
                    />
                  </button>
                </div>
              </div>
            </section>
          </div>
        </main>

        <AdminFooter />
      </div>

      {/* Portal Action Menu */}
      {openActionId &&
        actionMenuPosition &&
        createPortal(
          (() => {
            const product =
              products.find(
                (item) =>
                  String(
                    item.id,
                  ) ===
                  String(
                    openActionId,
                  ),
              );

            if (!product) {
              return null;
            }

            return (
              <div
                data-product-action-portal
                className="fixed z-[99999] w-44 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-xl"
                style={{
                  top: actionMenuPosition.top,
                  left: actionMenuPosition.left,
                }}
                onMouseDown={(
                  event,
                ) =>
                  event.stopPropagation()
                }
              >
                <button
                  type="button"
                  onClick={() =>
                    handleEdit(
                      product,
                    )
                  }
                  className="flex w-full items-center px-4 py-2.5 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleDelete(
                      product,
                    )
                  }
                  disabled={
                    deleting
                  }
                  className="flex w-full items-center px-4 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            );
          })(),
          document.body,
        )}

      {/* Toast */}
      {toast && (
        <div className="fixed right-5 top-5 z-[100] flex items-center gap-3 rounded-lg border border-green-200 bg-white px-4 py-3 shadow-lg">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 6L9 17L4 12"
                stroke="#16A34A"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <span className="text-sm font-semibold text-slate-800">
            {toast}
          </span>
        </div>
      )}

      <WarningModal
        isOpen={showWarning}
        type="delete"
        product={selectedProduct}
        onCancel={() => {
          setShowWarning(false);
          setSelectedProduct(null);
        }}
        onConfirm={
          handleConfirmDelete
        }
      />
    </div>
  );
}

export default Products;