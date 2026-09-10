import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import Header from "../../components/Header/Header";
import WarningModal from "../../components/admin/WarningModal";

function JugIcon() {
  return (
    <svg
      width="18"
      height="20"
      viewBox="0 0 18 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <path
        d="M8.1 7C7.18333 7 6.28333 7.12917 5.4 7.3875C4.51667 7.64583 3.7 8.03333 2.95 8.55L4 18H14L15.1 8H14.4C13.7667 8 13.1917 7.95417 12.675 7.8625C12.1583 7.77083 11.45 7.59167 10.55 7.325C10.1667 7.20833 9.76667 7.125 9.35 7.075C8.93333 7.025 8.51667 7 8.1 7ZM2.7 6.375C3.55 5.925 4.42917 5.58333 5.3375 5.35C6.24583 5.11667 7.175 5 8.125 5C8.625 5 9.12083 5.03333 9.6125 5.1C10.1042 5.16667 10.5917 5.26667 11.075 5.4C11.9083 5.63333 12.5458 5.79167 12.9875 5.875C13.4292 5.95833 13.9 6 14.4 6H15.325L15.75 2H2.25L2.7 6.375ZM3.975 20C3.45833 20 3.0125 19.8333 2.6375 19.5C2.2625 19.1667 2.05 18.7417 2 18.225L0 0H18L16 18.225C15.95 18.7417 15.7375 19.1667 15.3625 19.5C14.9875 19.8333 14.5417 20 14.025 20H3.975ZM8.1 18C8.51667 18 8.93333 18 9.35 18C9.76667 18 10.1667 18 10.55 18C11.45 18 12.1458 18 12.6375 18C13.1292 18 13.5833 18 14 18H4C4.23333 18 4.74583 18 5.5375 18C6.32917 18 7.18333 18 8.1 18Z"
        fill="#2CA6D8"
      />
    </svg>
  );
}

const defaultProducts = [
  {
    id: "1",
    name: "Slim Gallon Refill",
    description: "Purified Drinking Water",
    quantity: 145,
    price: 25,
    status: "In Stock",
  },
  {
    id: "2",
    name: "Round Gallon Refill",
    description: "Purified Drinking Water",
    quantity: 85,
    price: 25,
    status: "In Stock",
  },
];

function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  // Modal is CLOSED by default.
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const savedProducts = localStorage.getItem("adminProducts");

    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts));
      } catch {
        setProducts(defaultProducts);
        localStorage.setItem(
          "adminProducts",
          JSON.stringify(defaultProducts)
        );
      }
    } else {
      setProducts(defaultProducts);
      localStorage.setItem(
        "adminProducts",
        JSON.stringify(defaultProducts)
      );
    }
  }, []);

  // Only opens the warning modal when Edit/Delete is clicked.
  const openWarning = (type, product) => {
    setSelectedProduct(product);
    setModalType(type);
    setModalOpen(true);
  };

  const closeWarning = () => {
    setModalOpen(false);
    setModalType("");
    setSelectedProduct(null);
  };

  const handleEditConfirm = () => {
    if (!selectedProduct) return;

    const productId = selectedProduct.id;

    closeWarning();
    navigate(`/admin/products/edit/${productId}`);
  };

  const handleDeleteConfirm = () => {
    if (!selectedProduct) return;

    const updatedProducts = products.filter(
      (product) => product.id !== selectedProduct.id
    );

    setProducts(updatedProducts);

    localStorage.setItem(
      "adminProducts",
      JSON.stringify(updatedProducts)
    );

    closeWarning();
  };

  const handleModalConfirm = () => {
    if (modalType === "edit") {
      handleEditConfirm();
      return;
    }

    if (modalType === "delete") {
      handleDeleteConfirm();
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

                <span className="text-white">Add Product</span>
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
                    {products.map((product, index) => (
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
                              <JugIcon />
                            </div>

                            <div className="flex flex-col">
                              <span className="text-base font-bold leading-6 text-text-primary">
                                {product.name}
                              </span>

                              <span className="text-sm leading-5 text-text-light">
                                {product.description}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Quantity */}
                        <td className="p-5 text-right text-base leading-6 text-text-primary">
                          {product.quantity}
                        </td>

                        {/* Status */}
                        <td className="p-5 text-center">
                          <span className="inline-flex items-center rounded-full border border-secondary-medium bg-background-lightBlue px-3 py-1 text-xs font-semibold uppercase tracking-[0.7px] text-text-secondary">
                            {product.status}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="p-5 text-right text-base leading-6 text-text-primary">
                          ₱ {Number(product.price).toFixed(2)}
                        </td>

                        {/* Actions */}
                        <td className="p-5">
                          <div className="flex items-center justify-center gap-4">

                            {/* EDIT ONLY OPENS MODAL */}
                            <button
                              type="button"
                              onClick={() => openWarning("edit", product)}
                              className="text-sm font-semibold uppercase tracking-[0.7px] text-text-secondary transition-colors hover:text-text-accent"
                            >
                              Edit
                            </button>

                            {/* DELETE ONLY OPENS MODAL */}
                            <button
                              type="button"
                              onClick={() => openWarning("delete", product)}
                              className="text-sm font-semibold uppercase tracking-[0.7px] text-red-600 transition-colors hover:text-red-700"
                            >
                              Delete
                            </button>

                          </div>
                        </td>
                      </tr>
                    ))}

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
                  Showing {products.length === 0 ? 0 : 1}-
                  {products.length} of {products.length} items
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
                    aria-label="Next page"
                    className="flex items-center justify-center rounded border border-border-secondary px-3 py-2 transition-colors hover:bg-background-lightBlue"
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

      {/* Warning Modal
          This is rendered but CLOSED by default.
          It will ONLY become visible after Edit or Delete is clicked. */}
      <WarningModal
        isOpen={modalOpen}
        type={modalType}
        product={selectedProduct}
        onCancel={closeWarning}
        onConfirm={handleModalConfirm}
      />
    </div>
  );
}

export default Products;