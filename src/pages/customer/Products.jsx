import React, { useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { Check } from "lucide-react";

import Header from "../../components/Header/Header";

import CustomerNavbar from "../../components/customer/CustomerNavbar";

import CustomerFooter from "../../components/customer/CustomerFooter";

import slimRefillImage from "../../assets/images/slim-purified-water.png";

import roundRefillImage from "../../assets/images/round-purified-water.png";

import bottleImage from "../../assets/images/500ml-bottle.png";

import increaseIcon from "../../assets/images/img_button_increase.svg";

import {
  getCurrentOrder,
  saveCurrentOrder,
} from "../../utils/orderStorage";

const defaultProducts = [
  { id: "1", name: "Slim Gallon Refill", quantity: 145, price: 25 },
  { id: "2", name: "Round Gallon Refill", quantity: 85, price: 25 },
  { id: "3", name: "500ml Bottle (Case of 24)", quantity: 50, price: 240 },
];

const productCards = [
  {
    id: "1",
    title: "Slim Refill",
    description:
      "Standard slim profile 5-gallon refill. Multi-stage purified mineral water.",
    price: 25,
    image: slimRefillImage,
    alt: "Slim 5-gallon water container",
  },
  {
    id: "2",
    title: "Round Refill",
    description:
      "Traditional round 5-gallon refill. Purified mineral water.",
    price: 25,
    image: roundRefillImage,
    alt: "Round 5-gallon water container",
  },
  {
    id: "3",
    title: "500ml Bottle (Case of 24)",
    description:
      "Case of 24 × 500ml purified mineral water bottles.",
    price: 240,
    image: bottleImage,
    alt: "500ml bottled water case of 24",
  },
];

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

function Products() {
  const navigate = useNavigate();
  const location = useLocation();

  const incomingOrder =
    location.state?.order || getCurrentOrder() || null;

  const incomingReviewProduct = location.state?.reviewProduct || null;

  const returnToEditOrder = Boolean(
    location.state?.returnToEditOrder,
  );

  const [quantities, setQuantities] = useState({
    "1": 0,
    "2": 0,
    "3": 0,
  });

  const [cartItems, setCartItems] = useState(() => {
    if (
      !returnToEditOrder ||
      !Array.isArray(incomingOrder?.products)
    ) {
      if (incomingReviewProduct) {
        const price =
          Number(
            String(incomingReviewProduct.price || "").replace(
              /[^0-9.]/g,
              "",
            ),
          ) || 0;

        return [
          {
            id: String(incomingReviewProduct.id),
            name: incomingReviewProduct.name,
            quantity: 1,
            price,
            total: price,
          },
        ];
      }

      return [];
    }

    return incomingOrder.products.map((item) => ({
      ...item,
      id: String(item.id),
      quantity: Number(item.quantity) || 0,
      price: Number(item.price) || 0,
      total:
        (Number(item.price) || 0) *
        (Number(item.quantity) || 0),
    }));
  });

  const [availableProducts, setAvailableProducts] =
    useState(defaultProducts);

  const [showOrderAdded, setShowOrderAdded] = useState(false);

  const [activeTab] = useState("products");

  useEffect(() => {
    const loadProducts = () => {
      try {
        const savedProducts = localStorage.getItem("adminProducts");

        if (!savedProducts) {
          setAvailableProducts(defaultProducts);
          return;
        }

        const parsedProducts = JSON.parse(savedProducts);

        if (!Array.isArray(parsedProducts)) {
          setAvailableProducts(defaultProducts);
          return;
        }

        setAvailableProducts(
          defaultProducts.map((defaultProduct) => {
            const savedProduct = parsedProducts.find(
              (product) =>
                String(product.id) === String(defaultProduct.id),
            );

            return savedProduct
              ? {
                  ...defaultProduct,
                  ...savedProduct,
                  id: String(defaultProduct.id),
                  quantity: Math.max(
                    0,
                    Number(savedProduct.quantity) || 0,
                  ),
                  price:
                    Number(savedProduct.price) ||
                    defaultProduct.price,
                }
              : defaultProduct;
          }),
        );
      } catch (error) {
        console.error("Failed to load products:", error);
        setAvailableProducts(defaultProducts);
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

  useEffect(() => {
    if (!showOrderAdded) return undefined;

    const timeout = window.setTimeout(() => {
      setShowOrderAdded(false);
    }, 1800);

    return () => window.clearTimeout(timeout);
  }, [showOrderAdded]);

  const getAvailableQuantity = (productId) => {
    const product = availableProducts.find(
      (item) => String(item.id) === String(productId),
    );

    return Math.max(0, Number(product?.quantity) || 0);
  };

  const addToCart = (productId) => {
    const selectedQuantity =
      Number(quantities[productId]) || 0;

    if (selectedQuantity <= 0) return;

    const product = availableProducts.find(
      (item) => String(item.id) === String(productId),
    );

    if (!product) return;

    const availableQuantity =
      getAvailableQuantity(productId);

    const existingItem = cartItems.find(
      (item) => String(item.id) === String(productId),
    );

    const existingQuantity =
      Number(existingItem?.quantity) || 0;

    // When editing an existing order, allow the current quantity
    // to remain selected, but do not let it exceed available stock.
    const remainingAvailable = Math.max(
      0,
      availableQuantity - existingQuantity,
    );

    const quantityToAdd = Math.min(
      selectedQuantity,
      remainingAvailable,
    );

    // A product already in the order can be replaced with the
    // newly selected total, up to the available stock.
    const updatedQuantity = existingItem
      ? Math.min(availableQuantity, selectedQuantity)
      : quantityToAdd;

    if (updatedQuantity <= 0) {
      setShowOrderAdded(false);
      return;
    }

    const updatedItem = {
      id: String(product.id),
      name:
        productCards.find(
          (card) => card.id === String(productId),
        )?.title || product.name,
      price: Number(product.price),
      quantity: updatedQuantity,
      total: Number(product.price) * updatedQuantity,
    };

    setCartItems((currentCart) => {
      const exists = currentCart.some(
        (item) => String(item.id) === String(productId),
      );

      if (exists) {
        return currentCart.map((item) =>
          String(item.id) === String(productId)
            ? updatedItem
            : item,
        );
      }

      return [...currentCart, updatedItem];
    });

    setShowOrderAdded(true);
  };

  const changeQuantity = (productId, change) => {
    const available = getAvailableQuantity(productId);

    setQuantities((current) => ({
      ...current,
      [productId]: Math.min(
        available,
        Math.max(
          0,
          (Number(current[productId]) || 0) + change,
        ),
      ),
    }));
  };

  const totalItems = cartItems.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0),
    0,
  );

  const subtotal = cartItems.reduce(
    (sum, item) =>
      sum +
      (Number(item.price) || 0) *
        (Number(item.quantity) || 0),
    0,
  );

  const deliveryFee =
    cartItems.length > 0
      ? Number(incomingOrder?.deliveryFee ?? 20)
      : 0;

  const total = subtotal + deliveryFee;

  const handleProceedToOrder = () => {
    if (cartItems.length === 0) return;

    const existingOrder =
      incomingOrder || getCurrentOrder() || {};

    const now = new Date().toISOString();

    const order = {
      ...existingOrder,
      id: existingOrder.id || `ORD-${Date.now()}`,
      orderNumber:
        existingOrder.orderNumber ||
        `#ORD-${String(Date.now()).slice(-6)}`,
      customerName:
        existingOrder.customerName || "Maria Santos",
      contactNumber:
        existingOrder.contactNumber || "0917-555-0192",

      products: cartItems.map((item) => ({
        ...item,
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 0,
        total:
          (Number(item.price) || 0) *
          (Number(item.quantity) || 0),
      })),

      subtotal,
      deliveryFee,
      total,
      status: existingOrder.status || "Pending",
      deliveryDate: existingOrder.deliveryDate || "",
      deliveryTime: existingOrder.deliveryTime || "",
      notes: existingOrder.notes || "",
      createdAt: existingOrder.createdAt || now,
      updatedAt: now,
    };

    saveCurrentOrder(order);

    if (returnToEditOrder) {
      navigate("/customer/edit-order", {
        state: { order },
      });

      return;
    }

    navigate("/customer/edit-order", {
      state: { order },
    });
  };

  const handleNavigate = (tab) => {
    const routes = {
      home: "/customer/home",
      products: "/customer/products",
      orders: "/customer/orders",
      track: "/customer/track",
      profile: "/customer/profile",
    };

    if (routes[tab]) {
      navigate(routes[tab]);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background-main">
      <Header />

      <div
        role="status"
        aria-live="polite"
        className={`pointer-events-none fixed right-4 top-5 z-[200] transition-all duration-300 sm:right-6 ${
          showOrderAdded
            ? "translate-x-0 opacity-100"
            : "translate-x-8 opacity-0"
        }`}
      >
        <div className="flex items-center gap-3 rounded-lg border border-[#A8DCE8] bg-white px-4 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.15)]">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#08779D] text-white">
            <Check size={17} strokeWidth={3} />
          </div>

          <div>
            <p className="text-xs font-bold text-text-primary">
              Products Added
            </p>

            <p className="mt-0.5 text-[10px] text-text-secondary">
              Added to your order.
            </p>
          </div>
        </div>
      </div>

      <main className="flex-1 bg-background-main px-4 pb-16 pt-8 sm:px-6 sm:pb-20 md:px-10 md:pb-24">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold leading-8 tracking-[-0.32px] text-text-primary sm:text-3xl">
              Select Products
            </h1>

            <p className="text-sm leading-6 text-text-secondary sm:text-base">
              Choose the gallon type and quantity for your delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {productCards.map((card) => {
              const available = getAvailableQuantity(card.id);
              const selectedQuantity = quantities[card.id] || 0;
              const isBottle = card.id === "3";

              return (
                <article
                  key={card.id}
                  className="flex min-h-[480px] flex-col overflow-hidden rounded-xl border border-card-border bg-card-background shadow-card transition-shadow duration-200 hover:shadow-md"
                >
                  <div className="h-[220px] w-full overflow-hidden bg-background-accent">
                    <img
                      src={card.image}
                      alt={card.alt}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                    />
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex min-h-[64px] items-start justify-between gap-3">
                      <h3 className="min-w-0 flex-1 text-lg font-bold leading-7 text-text-primary">
                        {isBottle ? (
                          <>
                            <span className="block">
                              500ml Bottle
                            </span>

                            <span className="mt-0.5 block leading-7">
                              (Case of 24)
                            </span>
                          </>
                        ) : (
                          card.title
                        )}
                      </h3>

                      <span className="shrink-0 rounded-md bg-background-accent px-3 py-1.5 text-sm font-bold text-text-accent">
                        ₱{card.price.toFixed(2)}
                      </span>
                    </div>

                    <p className="mt-3 min-h-[60px] text-sm leading-5 text-text-secondary">
                      {card.description}
                    </p>

                    <div className="my-5 border-t border-border-light" />

                    {isBottle && (
                      <p className="mb-4 text-xs font-semibold leading-5 text-text-accent">
                        {available} stocks available
                      </p>
                    )}

                    <div className="mt-auto flex flex-col gap-3">
                      <span className="text-xs font-semibold uppercase tracking-[0.7px] text-text-secondary">
                        Quantity
                      </span>

                      <div className="flex h-11 items-center overflow-hidden rounded-lg border border-border-secondary bg-background-card">
                        <button
                          type="button"
                          onClick={() =>
                            changeQuantity(card.id, -1)
                          }
                          disabled={selectedQuantity === 0}
                          aria-label={`Decrease ${card.title} quantity`}
                          className="flex h-full w-14 items-center justify-center border-r border-border-secondary text-text-accent transition-colors hover:bg-background-accent disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <MinusIcon />
                        </button>

                        <span className="flex flex-1 items-center justify-center text-sm font-bold text-text-primary">
                          {selectedQuantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            changeQuantity(card.id, 1)
                          }
                          disabled={
                            selectedQuantity >= available
                          }
                          aria-label={`Increase ${card.title} quantity`}
                          className="flex h-full w-14 items-center justify-center border-l border-border-secondary transition-colors hover:bg-background-accent disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <img
                            src={increaseIcon}
                            alt=""
                            className="h-4 w-4"
                          />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => addToCart(card.id)}
                        disabled={
                          selectedQuantity === 0 ||
                          available === 0
                        }
                        className="mt-1 w-full rounded-lg bg-button-background py-3 text-xs font-bold uppercase tracking-[0.7px] text-white shadow-sm transition-colors hover:bg-button-hover disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {available === 0
                          ? "Out of Stock"
                          : "Add to Order"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <section className="rounded-xl border border-border-secondary bg-background-card shadow-card">
            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.7px] text-text-accent">
                  Review Order
                </p>

                <p className="mt-1 text-sm leading-6 text-text-secondary">
                  {totalItems}{" "}
                  {totalItems === 1 ? "item" : "items"} in your
                  order · Total ₱{total.toFixed(2)}
                </p>
              </div>

              <button
                type="button"
                onClick={handleProceedToOrder}
                disabled={cartItems.length === 0}
                className="w-full shrink-0 rounded-lg bg-button-background px-6 py-3 text-xs font-bold uppercase tracking-[0.7px] text-white shadow-sm transition-colors hover:bg-button-hover disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                Review Order
              </button>
            </div>

            {cartItems.length > 0 && (
              <div className="border-t border-border-light px-5 py-4 sm:px-6">
                <div className="flex flex-col gap-3">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-4"
                    >
                      <div className="min-w-0">
                        <p className="break-words text-sm font-semibold leading-5 text-text-primary">
                          {item.name}
                        </p>

                        <p className="text-xs text-text-secondary">
                          Quantity: {item.quantity}
                        </p>
                      </div>

                      <span className="shrink-0 text-sm font-bold text-text-primary">
                        ₱
                        {(
                          Number(item.price) *
                          Number(item.quantity)
                        ).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      <CustomerNavbar
        activeTab={activeTab}
        onNavigate={handleNavigate}
      />

      <div className="w-full">
        <CustomerFooter />
      </div>
    </div>
  );
}

export default Products;