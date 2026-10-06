import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Trash2, Plus } from "lucide-react";

import Header from "../../components/Header/Header";
import CustomerNavbar from "../../components/customer/CustomerNavbar";
import CustomerFooter from "../../components/customer/CustomerFooter";
import OrderStepper from "../../components/customer/OrderStepper";


import {
  getCurrentOrder,
  saveCurrentOrder,
} from "../../utils/orderStorage";

import slimRefillImage from "../../assets/images/slim-purified-water.png";
import roundRefillImage from "../../assets/images/round-purified-water.png";
import bottleImage from "../../assets/images/500ml-bottle.png";
import increaseIcon from "../../assets/images/img_button_increase.svg";

const DEFAULT_AVAILABILITY = {
  "1": 145,
  "2": 85,
  "3": 50,
};

const getProductImage = (productId) => {
  if (String(productId) === "1") return slimRefillImage;
  if (String(productId) === "2") return roundRefillImage;
  return bottleImage;
};

const MinusIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-text-accent"
    aria-hidden="true"
  >
    <path
      d="M3 7H11"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

function EditOrder() {
  const navigate = useNavigate();
  const location = useLocation();

  const existingOrder =
    location.state?.order || getCurrentOrder() || {};

  const [products, setProducts] = useState(() =>
    Array.isArray(existingOrder.products)
      ? existingOrder.products.map((product) => ({
          ...product,
          quantity: Number(product.quantity) || 0,
          price: Number(product.price) || 0,
        }))
      : [],
  );

  const [availableProducts, setAvailableProducts] = useState([]);

  useEffect(() => {
    const loadProducts = () => {
      try {
        const saved = localStorage.getItem("adminProducts");
        const parsed = saved ? JSON.parse(saved) : [];

        setAvailableProducts(Array.isArray(parsed) ? parsed : []);
      } catch (error) {
        console.error("Failed to load product availability:", error);
        setAvailableProducts([]);
      }
    };

    loadProducts();

    window.addEventListener("storage", loadProducts);
    window.addEventListener("productUpdated", loadProducts);

    return () => {
      window.removeEventListener("storage", loadProducts);
      window.removeEventListener("productUpdated", loadProducts);
    };
  }, []);

  const getAvailableQuantity = (productId) => {
    const savedProduct = availableProducts.find(
      (product) => String(product.id) === String(productId),
    );

    if (savedProduct) {
      return Math.max(0, Number(savedProduct.quantity) || 0);
    }

    return DEFAULT_AVAILABILITY[String(productId)] || 0;
  };

  const subtotal = products.reduce(
    (sum, product) =>
      sum +
      Number(product.price || 0) *
        Number(product.quantity || 0),
    0,
  );

  const deliveryFee = Number(existingOrder.deliveryFee ?? 20) || 0;
  const total = subtotal + deliveryFee;

  const updateProductQuantity = (productId, change) => {
    setProducts((currentProducts) =>
      currentProducts
        .map((product) => {
          if (String(product.id) !== String(productId)) {
            return product;
          }

          const available = getAvailableQuantity(product.id);
          const currentQuantity = Number(product.quantity) || 0;

          const nextQuantity = Math.min(
            available,
            Math.max(0, currentQuantity + change),
          );

          return {
            ...product,
            quantity: nextQuantity,
            total: Number(product.price || 0) * nextQuantity,
          };
        })
        .filter((product) => Number(product.quantity) > 0),
    );
  };

  const removeProduct = (productId) => {
    setProducts((currentProducts) =>
      currentProducts.filter(
        (product) => String(product.id) !== String(productId),
      ),
    );
  };

  const buildOrder = (productList = products) => {
    const normalizedProducts = productList.map((product) => ({
      ...product,
      price: Number(product.price) || 0,
      quantity: Number(product.quantity) || 0,
      total:
        (Number(product.price) || 0) *
        (Number(product.quantity) || 0),
    }));

    const updatedSubtotal = normalizedProducts.reduce(
      (sum, product) => sum + product.total,
      0,
    );

    return {
      ...existingOrder,
      id: existingOrder.id || `ORD-${Date.now()}`,
      orderNumber:
        existingOrder.orderNumber ||
        `#ORD-${String(Date.now()).slice(-6)}`,
      products: normalizedProducts,
      subtotal: updatedSubtotal,
      deliveryFee,
      total: updatedSubtotal + deliveryFee,
      updatedAt: new Date().toISOString(),
    };
  };

  const handleNext = () => {
    if (products.length === 0) return;

    const order = buildOrder();

    saveCurrentOrder(order);

    navigate("/customer/delivery-details", {
      state: { order },
    });
  };

  const handleBack = () => {
    const order = buildOrder();

    saveCurrentOrder(order);

    navigate("/customer/products", {
      state: {
        order,
        returnToEditOrder: true,
      },
    });
  };

  const handleAddItem = () => {
    const order = buildOrder();

    saveCurrentOrder(order);

    navigate("/customer/products", {
      state: {
        order,
        returnToEditOrder: true,
      },
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background-main">
      <Header />

      <OrderStepper currentStep={1} />

      <main className="flex-1 bg-background-main px-4 pb-24 pt-6 sm:px-6 sm:pb-28 md:px-10 md:pb-32">
        <div className="mx-auto flex w-full max-w-[760px] flex-col gap-6">
          <div>
            <h1 className="text-2xl font-bold leading-8 text-text-primary sm:text-3xl">
              Edit Order
            </h1>

            <p className="mt-1 text-sm leading-6 text-text-secondary">
              Review your selected products and adjust quantities before
              continuing.
            </p>
          </div>

          <section className="overflow-hidden rounded-xl border border-border-light bg-background-card shadow-card">
            <div className="border-b border-border-light bg-background-accent px-5 py-4">
              <h2 className="text-sm font-bold uppercase tracking-[0.6px] text-text-accent">
                Selected Products
              </h2>
            </div>

            <div className="px-5">
              {products.length === 0 ? (
                <div className="py-6">
                  <p className="text-sm text-text-secondary">
                    No products selected.
                  </p>

                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border-light bg-background-card px-4 py-2.5 text-xs font-semibold text-text-accent shadow-sm transition-colors hover:border-primary-background hover:bg-background-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-background focus-visible:ring-offset-2"
                  >
                    <Plus size={15} strokeWidth={2} />
                    Browse Products
                  </button>
                </div>
              ) : (
                products.map((product, index) => {
                  const available = getAvailableQuantity(product.id);

                  return (
                    <div
                      key={product.id || index}
                      className="flex flex-col gap-4 border-b border-border-light py-5 sm:flex-row sm:items-center"
                    >
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-background-accent">
                        <img
                          src={getProductImage(product.id)}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="break-words text-sm font-bold leading-6 text-text-primary">
                          {product.name}
                        </p>

                        <p className="mt-1 text-xs text-text-secondary">
                          ₱{Number(product.price).toFixed(2)} each
                        </p>

                        <div className="mt-3 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              updateProductQuantity(product.id, -1)
                            }
                            aria-label={`Decrease ${product.name}`}
                            className="flex h-9 w-9 items-center justify-center rounded-md border border-border-light bg-background-card transition-colors hover:bg-background-accent"
                          >
                            <MinusIcon />
                          </button>

                          <span className="flex h-9 min-w-10 items-center justify-center rounded-md bg-background-accent px-3 text-sm font-bold text-text-primary">
                            {product.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              updateProductQuantity(product.id, 1)
                            }
                            disabled={
                              Number(product.quantity) >= available
                            }
                            aria-label={`Increase ${product.name}`}
                            className="flex h-9 w-9 items-center justify-center rounded-md border border-border-light bg-background-card transition-colors hover:bg-background-accent disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <img
                              src={increaseIcon}
                              alt=""
                              className="h-4 w-4"
                            />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                        <div className="flex flex-col items-start gap-2 sm:items-end">
                          {index === 0 && (
                            <button
                              type="button"
                              onClick={handleAddItem}
                              className="inline-flex items-center gap-2 rounded-md border border-border-light bg-background-card px-3 py-2 text-sm font-bold text-text-accent transition-colors hover:border-primary-background hover:bg-background-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-background focus-visible:ring-offset-2"
                            >
                              <Plus size={16} strokeWidth={2.25} />
                              Add Item
                            </button>
                          )}

                          <span className="text-sm font-bold text-text-primary">
                            ₱
                            {(
                              Number(product.price) *
                              Number(product.quantity)
                            ).toFixed(2)}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeProduct(product.id)}
                          aria-label={`Remove ${product.name}`}
                          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[10px] font-semibold uppercase tracking-[0.5px] text-red-500/80 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 focus-visible:ring-offset-2"
                        >
                          <Trash2 size={13} strokeWidth={1.8} />
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })
              )}

              <div className="flex items-center justify-between py-4">
                <span className="text-sm font-semibold text-text-primary">
                  Subtotal
                </span>

                <span className="text-base font-bold text-text-accent">
                  ₱{subtotal.toFixed(2)}
                </span>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-border-light bg-background-card p-5 shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-text-primary">
                Total
              </span>

              <span className="text-lg font-bold text-text-accent">
                ₱{total.toFixed(2)}
              </span>
            </div>

            <p className="mt-2 text-xs text-text-secondary">
              Includes delivery fee of ₱{deliveryFee.toFixed(2)}.
            </p>
          </section>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleBack}
              className="h-11 w-full rounded-lg border-2 border-primary-light bg-background-card px-6 text-xs font-bold uppercase tracking-[0.6px] text-primary-light transition-colors hover:bg-primary-light hover:text-white sm:w-auto sm:min-w-[150px]"
            >
              Back
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={products.length === 0}
              className="h-11 w-full rounded-lg bg-button-background px-6 text-xs font-bold uppercase tracking-[0.6px] text-white shadow-sm transition-colors hover:bg-button-hover disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-[180px]"
            >
              Next
            </button>
          </div>
        </div>
      </main>

      <CustomerNavbar activeTab="products" />
      <CustomerFooter />
    </div>
  );
}

export default EditOrder;