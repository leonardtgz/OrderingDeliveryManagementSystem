import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AdminSidebar from "../../components/admin/AdminSidebar";
import Header from "../../components/Header/Header";
import WarningModal from "../../components/admin/WarningModal";

import slimPurifiedWater from "../../assets/images/slim-purified-water.png";
import roundPurifiedWater from "../../assets/images/round-purified-water.png";
import bottle500ml from "../../assets/images/500ml-bottle.png";

const PRODUCTS_KEY = "adminProducts";

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

const getProducts = () => {
  try {
    const savedProducts =
      localStorage.getItem(PRODUCTS_KEY);

    if (!savedProducts) {
      localStorage.setItem(
        PRODUCTS_KEY,
        JSON.stringify(defaultProducts),
      );

      return defaultProducts;
    }

    const parsedProducts =
      JSON.parse(savedProducts);

    if (!Array.isArray(parsedProducts)) {
      localStorage.setItem(
        PRODUCTS_KEY,
        JSON.stringify(defaultProducts),
      );

      return defaultProducts;
    }

    return parsedProducts;
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

function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  // Warning modal state
  const [showWarning, setShowWarning] =
    useState(false);

  const [selectedProduct, setSelectedProduct] =
    useState(null);

  const [deleting, setDeleting] =
    useState(false);

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

  const handleEdit = (product) => {
    navigate(
      `/admin/products/edit/${product.id}`,
    );
  };

  // Open warning modal
  const handleDelete = (product) => {
    if (deleting) {
      return;
    }

    setSelectedProduct(product);
    setShowWarning(true);
  };

  // Actually delete the product after confirmation
  const handleConfirmDelete = () => {
    if (!selectedProduct || deleting) {
      return;
    }

    setDeleting(true);

    try {
      const savedProducts =
        localStorage.getItem(PRODUCTS_KEY);

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
        JSON.parse(savedProducts);

      if (!Array.isArray(parsedProducts)) {
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
            String(selectedProduct.id),
        );

      saveProducts(updatedProducts);

      // Update the list immediately
      setProducts(updatedProducts);

      // Close modal
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
    <div className="flex min-h-screen bg-background-main">
      <AdminSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />

        <main className="min-w-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1100px] px-5 py-8 sm:px-7">

            {/* Page Header */}
            <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <h1 className="text-3xl font-bold leading-10 tracking-[-0.32px] text-text-primary">
                Product Management
              </h1>

              <Link
                to="/admin/products/new"
                className="flex items-center gap-3 rounded-lg bg-button-background px-5 py-3 text-sm font-semibold uppercase tracking-[0.7px] text-white shadow-sm transition-colors hover:bg-button-hover"
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

            {/* Products Card */}
            <section className="w-full overflow-hidden rounded-xl border border-card-border bg-card-background shadow-card">
              <div className="w-full overflow-x-auto">
                <table className="w-full min-w-[760px] border-collapse">
                  <thead>
                    <tr className="border-b border-table-border bg-table-headerBg">
                      <th className="p-5 text-left text-sm font-semibold uppercase tracking-[0.7px] text-text-secondary">
                        Product Name
                      </th>

                      <th className="p-5 text-right text-sm font-semibold uppercase tracking-[0.7px] text-text-secondary">
                        Avail. Qty
                      </th>

                      <th className="p-5 text-center text-sm font-semibold uppercase tracking-[0.7px] text-text-secondary">
                        Status
                      </th>

                      <th className="p-5 text-right text-sm font-semibold uppercase tracking-[0.7px] text-text-secondary">
                        Price
                      </th>

                      <th className="p-5 text-center text-sm font-semibold uppercase tracking-[0.7px] text-text-secondary">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="bg-card-background">
                    {products.map(
                      (product, index) => (
                        <tr
                          key={product.id}
                          className={
                            index > 0
                              ? "border-t border-table-border"
                              : ""
                          }
                        >
                          {/* Product */}
                          <td className="p-5">
                            <div className="flex items-center gap-4">
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border-secondary bg-background-accent">
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

                              <div className="flex flex-col">
                                <span className="text-base font-bold leading-6 text-text-primary">
                                  {
                                    product.name
                                  }
                                </span>

                                <span className="text-sm leading-5 text-text-light">
                                  {
                                    product.description
                                  }
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Quantity */}
                          <td className="p-5 text-right text-base leading-6 text-text-primary">
                            {
                              product.quantity
                            }
                          </td>

                          {/* Status */}
                          <td className="p-5 text-center">
                            <span className="inline-flex items-center rounded-full border border-secondary-medium bg-background-lightBlue px-3 py-1 text-xs font-semibold uppercase tracking-[0.7px] text-text-secondary">
                              {
                                product.status
                              }
                            </span>
                          </td>

                          {/* Price */}
                          <td className="p-5 text-right text-base leading-6 text-text-primary">
                            ₱{" "}
                            {Number(
                              product.price,
                            ).toFixed(2)}
                          </td>

                          {/* Actions */}
                          <td className="p-5">
                            <div className="flex items-center justify-center gap-4">
                              <button
                                type="button"
                                onClick={() =>
                                  handleEdit(
                                    product,
                                  )
                                }
                                className="text-sm font-semibold uppercase tracking-[0.7px] text-text-secondary transition-colors hover:text-text-accent"
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
                                disabled={deleting}
                                className="text-sm font-semibold uppercase tracking-[0.7px] text-red-600 transition-colors hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ),
                    )}

                    {products.length === 0 && (
                      <tr>
                        <td
                          colSpan="5"
                          className="p-10 text-center text-base text-text-light"
                        >
                          No products available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div className="flex w-full flex-col items-center justify-between gap-4 border-t border-table-border bg-card-background px-5 py-4 sm:flex-row">
                <span className="text-sm leading-6 text-text-light">
                  Showing{" "}
                  {products.length === 0
                    ? 0
                    : 1}
                  -
                  {products.length} of{" "}
                  {products.length} items
                </span>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled
                    aria-label="Previous page"
                    className="flex items-center justify-center rounded border border-border-secondary px-3 py-2 opacity-50"
                  >
                    <svg
                      width="7"
                      height="10"
                      viewBox="0 0 7 10"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 10L0 5L5 0L6.16667 1.16667L2.33333 5L6.16667 8.83333L5 10Z"
                        fill="#001D32"
                      />
                    </svg>
                  </button>

                  <button
                    type="button"
                    disabled
                    aria-label="Next page"
                    className="flex items-center justify-center rounded border border-border-secondary px-3 py-2 opacity-50"
                  >
                    <svg
                      width="7"
                      height="10"
                      viewBox="0 0 7 10"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3.83333 5L0 1.16667L1.16667 0L6.16667 5L1.16667 10L0 8.83333L3.83333 5Z"
                        fill="#001D32"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* Delete Warning Modal */}
      <WarningModal
        isOpen={showWarning}
        type="delete"
        product={selectedProduct}
        onCancel={() => {
          setShowWarning(false);
          setSelectedProduct(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default Products;