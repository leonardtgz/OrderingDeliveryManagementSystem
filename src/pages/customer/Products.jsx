import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../components/Header/Header";
import CustomerNavbar from "../../components/customer/CustomerNavbar";

import slimRefillImage from "../../assets/images/slim-purified-water.png";
import roundRefillImage from "../../assets/images/round-purified-water.png";
import bottleImage from "../../assets/images/500ml-bottle.png";

import increaseIcon from "../../assets/images/img_button_increase.svg";

const MinusIcon = () => {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-text-accent"
    >
      <path
        d="M3 7H11"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

const defaultProducts = [
  {
    id: "1",
    name: "Slim Gallon Refill",
    quantity: 145,
    price: 25,
  },
  {
    id: "2",
    name: "Round Gallon Refill",
    quantity: 85,
    price: 25,
  },
  {
    id: "3",
    name: "500ml Bottle (Case of 24)",
    quantity: 50,
    price: 240,
  },
];

const Products = () => {
  const navigate = useNavigate();

  const [slimRefillQuantity, setSlimRefillQuantity] = useState(0);
  const [roundRefillQuantity, setRoundRefillQuantity] = useState(0);
  const [bottleCaseQuantity, setBottleCaseQuantity] = useState(0);

  const [availableProducts, setAvailableProducts] =
    useState(defaultProducts);

  const [activeTab, setActiveTab] = useState("products");

  // ============================================================
  // LOAD PRODUCT QUANTITIES FROM ADMIN
  // ============================================================

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

      const mergedProducts = defaultProducts.map((defaultProduct) => {
        const savedProduct = parsedProducts.find(
          (product) =>
            String(product.id) === String(defaultProduct.id),
        );

        if (!savedProduct) {
          return defaultProduct;
        }

        return {
          ...defaultProduct,
          ...savedProduct,
          quantity: Number(savedProduct.quantity) || 0,
        };
      });

      setAvailableProducts(mergedProducts);
    } catch (error) {
      console.error("Failed to load products:", error);
      setAvailableProducts(defaultProducts);
    }
  };

  useEffect(() => {
    loadProducts();

    const handleProductUpdate = () => {
      loadProducts();
    };

    window.addEventListener("storage", handleProductUpdate);
    window.addEventListener("productUpdated", handleProductUpdate);

    return () => {
      window.removeEventListener("storage", handleProductUpdate);
      window.removeEventListener("productUpdated", handleProductUpdate);
    };
  }, []);

  // ============================================================
  // AVAILABLE QUANTITY
  // ============================================================

  const slimAvailableQty =
    Number(
      availableProducts.find(
        (product) => String(product.id) === "1",
      )?.quantity,
    ) || 0;

  const roundAvailableQty =
    Number(
      availableProducts.find(
        (product) => String(product.id) === "2",
      )?.quantity,
    ) || 0;

  const bottleAvailableQty =
    Number(
      availableProducts.find(
        (product) => String(product.id) === "3",
      )?.quantity,
    ) || 0;

  // ============================================================
  // PRICES
  // ============================================================

  const slimRefillPrice = 25.0;
  const roundRefillPrice = 25.0;
  const bottleCasePrice = 240.0;

  // ============================================================
  // TOTAL
  // ============================================================

  const calculateTotal = () => {
    return (
      slimRefillQuantity * slimRefillPrice +
      roundRefillQuantity * roundRefillPrice +
      bottleCaseQuantity * bottleCasePrice
    );
  };

  const getTotalItems = () => {
    return (
      slimRefillQuantity +
      roundRefillQuantity +
      bottleCaseQuantity
    );
  };

  const total = calculateTotal();
  const totalItems = getTotalItems();

  // ============================================================
  // CREATE SHARED ORDER
  // ============================================================

  const createOrderProducts = () => {
    return [
      {
        id: "1",
        name: "Slim Gallon Refill",
        quantity: slimRefillQuantity,
        price: slimRefillPrice,
        total: slimRefillQuantity * slimRefillPrice,
      },
      {
        id: "2",
        name: "Round Gallon Refill",
        quantity: roundRefillQuantity,
        price: roundRefillPrice,
        total: roundRefillQuantity * roundRefillPrice,
      },
      {
        id: "3",
        name: "500ml Bottle (Case of 24)",
        quantity: bottleCaseQuantity,
        price: bottleCasePrice,
        total: bottleCaseQuantity * bottleCasePrice,
      },
    ].filter((product) => product.quantity > 0);
  };

  // ============================================================
  // REVIEW ORDER
  // ============================================================

  const handleReviewOrder = () => {
    const products = createOrderProducts();

    if (products.length === 0) {
      return;
    }

    const subtotal = products.reduce(
      (sum, product) =>
        sum +
        Number(product.price) * Number(product.quantity),
      0,
    );

    const orderData = {
      id: `ORD-${Date.now()}`,
      customerName: "Maria Santos",
      contactNumber: "0917-555-0192",

      products,

      deliveryAddress:
        "Block 4, Lot 12, Phase 2, Sunnyvale Subdivision, Brgy. San Jose, Antipolo",

      deliveryAddressLines: [
        "Block 4, Lot 12, Phase 2",
        "Sunnyvale Subdivision",
        "Brgy. San Jose, Antipolo",
      ],

      deliveryDate: "",
      deliveryTime: "",
      deliverySchedule: "",

      notes: "",

      subtotal,
      deliveryFee: 20,
      total: subtotal + 20,

      status: "Pending",
    };

    navigate("/customer/edit-order", {
      state: {
        order: orderData,
      },
    });
  };

  // ============================================================
  // NAVIGATION
  // ============================================================

  const handleNavigate = (tab) => {
    setActiveTab(tab);

    if (tab === "home") {
      navigate("/customer/home");
    } else if (tab === "products") {
      navigate("/customer/products");
    } else if (tab === "orders") {
      navigate("/customer/orders");
    } else if (tab === "track") {
      navigate("/customer/track");
    } else if (tab === "profile") {
      navigate("/customer/profile");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background-main">
      <Header />

      <main className="flex-1 overflow-y-auto bg-background-main px-4 pb-[170px] pt-8 sm:px-6 md:px-10">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold leading-8 tracking-[-0.32px] text-text-primary sm:text-3xl">
              Select Products
            </h1>

            <p className="text-sm leading-6 text-text-secondary sm:text-base">
              Choose the gallon type and quantity for your delivery.
            </p>
          </div>

          {/* PRODUCTS GRID */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

            {/* =====================================================
                SLIM REFILL
            ====================================================== */}

            <article className="flex min-h-[480px] flex-col overflow-hidden rounded-xl border border-card-border bg-card-background shadow-card transition-shadow duration-200 hover:shadow-md">
              <div className="h-[220px] w-full overflow-hidden bg-background-accent">
                <img
                  src={slimRefillImage}
                  alt="Slim Refill 5-gallon water container"
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                />
              </div>

              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-lg font-bold leading-6 text-text-primary">
                    Slim Refill
                  </h3>

                  <span className="shrink-0 rounded-md bg-background-accent px-3 py-1.5 text-sm font-bold text-text-accent">
                    ₱25.00
                  </span>
                </div>

                <p className="mt-3 text-sm leading-5 text-text-secondary">
                  Standard slim profile 5-gallon refill. Multi-stage
                  purified mineral water.
                </p>

                <div className="my-5 border-t border-border-light" />

                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.7px] text-text-secondary">
                    Available Qty
                  </span>

                  <span className="text-sm font-bold text-text-accent">
                    {slimAvailableQty}
                  </span>
                </div>

                <div className="mt-auto flex flex-col gap-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.7px] text-text-secondary">
                    Quantity
                  </span>

                  <div className="flex h-11 items-center overflow-hidden rounded-lg border border-border-secondary bg-background-card">
                    <button
                      type="button"
                      onClick={() =>
                        setSlimRefillQuantity((q) =>
                          Math.max(0, q - 1),
                        )
                      }
                      disabled={slimRefillQuantity === 0}
                      className="flex h-full w-14 items-center justify-center border-r border-border-secondary text-text-accent transition-colors hover:bg-background-accent disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Decrease Slim Refill quantity"
                    >
                      <MinusIcon />
                    </button>

                    <span className="flex flex-1 items-center justify-center text-sm font-bold text-text-primary">
                      {slimRefillQuantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setSlimRefillQuantity((q) =>
                          Math.min(slimAvailableQty, q + 1),
                        )
                      }
                      disabled={
                        slimRefillQuantity >= slimAvailableQty
                      }
                      className="flex h-full w-14 items-center justify-center border-l border-border-secondary transition-colors hover:bg-background-accent disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Increase Slim Refill quantity"
                    >
                      <img
                        src={increaseIcon}
                        alt="Increase"
                        className="h-4 w-4"
                      />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setSlimRefillQuantity((q) =>
                        Math.min(slimAvailableQty, q + 1),
                      )
                    }
                    disabled={
                      slimAvailableQty === 0 ||
                      slimRefillQuantity >= slimAvailableQty
                    }
                    className="mt-1 w-full rounded-lg bg-button-background py-3 text-xs font-bold uppercase tracking-[0.7px] text-white shadow-sm transition-colors hover:bg-button-hover disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {slimAvailableQty === 0
                      ? "Out of Stock"
                      : "Add to Order"}
                  </button>
                </div>
              </div>
            </article>

            {/* =====================================================
                ROUND REFILL
            ====================================================== */}

            <article className="flex min-h-[480px] flex-col overflow-hidden rounded-xl border border-card-border bg-card-background shadow-card transition-shadow duration-200 hover:shadow-md">
              <div className="h-[220px] w-full overflow-hidden bg-background-accent">
                <img
                  src={roundRefillImage}
                  alt="Round Refill 5-gallon water container"
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                />
              </div>

              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-lg font-bold leading-6 text-text-primary">
                    Round Refill
                  </h3>

                  <span className="shrink-0 rounded-md bg-background-accent px-3 py-1.5 text-sm font-bold text-text-accent">
                    ₱25.00
                  </span>
                </div>

                <p className="mt-3 text-sm leading-5 text-text-secondary">
                  Traditional round 5-gallon refill. Purified mineral
                  water.
                </p>

                <div className="my-5 border-t border-border-light" />

                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.7px] text-text-secondary">
                    Available Qty
                  </span>

                  <span className="text-sm font-bold text-text-accent">
                    {roundAvailableQty}
                  </span>
                </div>

                <div className="mt-auto flex flex-col gap-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.7px] text-text-secondary">
                    Quantity
                  </span>

                  <div className="flex h-11 items-center overflow-hidden rounded-lg border border-border-secondary bg-background-card">
                    <button
                      type="button"
                      onClick={() =>
                        setRoundRefillQuantity((q) =>
                          Math.max(0, q - 1),
                        )
                      }
                      disabled={roundRefillQuantity === 0}
                      className="flex h-full w-14 items-center justify-center border-r border-border-secondary text-text-accent transition-colors hover:bg-background-accent disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Decrease Round Refill quantity"
                    >
                      <MinusIcon />
                    </button>

                    <span className="flex flex-1 items-center justify-center text-sm font-bold text-text-primary">
                      {roundRefillQuantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setRoundRefillQuantity((q) =>
                          Math.min(roundAvailableQty, q + 1),
                        )
                      }
                      disabled={
                        roundRefillQuantity >= roundAvailableQty
                      }
                      className="flex h-full w-14 items-center justify-center border-l border-border-secondary transition-colors hover:bg-background-accent disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Increase Round Refill quantity"
                    >
                      <img
                        src={increaseIcon}
                        alt="Increase"
                        className="h-4 w-4"
                      />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setRoundRefillQuantity((q) =>
                        Math.min(roundAvailableQty, q + 1),
                      )
                    }
                    disabled={
                      roundAvailableQty === 0 ||
                      roundRefillQuantity >= roundAvailableQty
                    }
                    className="mt-1 w-full rounded-lg bg-button-background py-3 text-xs font-bold uppercase tracking-[0.7px] text-white shadow-sm transition-colors hover:bg-button-hover disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {roundAvailableQty === 0
                      ? "Out of Stock"
                      : "Add to Order"}
                  </button>
                </div>
              </div>
            </article>

            {/* =====================================================
                500ML BOTTLE
            ====================================================== */}

            <article className="flex min-h-[480px] flex-col overflow-hidden rounded-xl border border-card-border bg-card-background shadow-card transition-shadow duration-200 hover:shadow-md">
              <div className="h-[220px] w-full overflow-hidden bg-background-accent">
                <img
                  src={bottleImage}
                  alt="500ml Bottle Case of 24"
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                />
              </div>

              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-lg font-bold leading-6 text-text-primary">
                    500ml Bottle (Case of 24)
                  </h3>

                  <span className="shrink-0 rounded-md bg-background-accent px-3 py-1.5 text-sm font-bold text-text-accent">
                    ₱240.00
                  </span>
                </div>

                <p className="mt-3 text-sm leading-5 text-text-secondary">
                  Case of 24 × 500ml purified mineral water bottles.
                </p>

                <div className="my-5 border-t border-border-light" />

                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.7px] text-text-secondary">
                    Available Qty
                  </span>

                  <span className="text-sm font-bold text-text-accent">
                    {bottleAvailableQty}
                  </span>
                </div>

                <div className="mt-auto flex flex-col gap-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.7px] text-text-secondary">
                    Quantity
                  </span>

                  <div className="flex h-11 items-center overflow-hidden rounded-lg border border-border-secondary bg-background-card">
                    <button
                      type="button"
                      onClick={() =>
                        setBottleCaseQuantity((q) =>
                          Math.max(0, q - 1),
                        )
                      }
                      disabled={bottleCaseQuantity === 0}
                      className="flex h-full w-14 items-center justify-center border-r border-border-secondary text-text-accent transition-colors hover:bg-background-accent disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Decrease 500ml Bottle quantity"
                    >
                      <MinusIcon />
                    </button>

                    <span className="flex flex-1 items-center justify-center text-sm font-bold text-text-primary">
                      {bottleCaseQuantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setBottleCaseQuantity((q) =>
                          Math.min(bottleAvailableQty, q + 1),
                        )
                      }
                      disabled={
                        bottleCaseQuantity >= bottleAvailableQty
                      }
                      className="flex h-full w-14 items-center justify-center border-l border-border-secondary transition-colors hover:bg-background-accent disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Increase 500ml Bottle quantity"
                    >
                      <img
                        src={increaseIcon}
                        alt="Increase"
                        className="h-4 w-4"
                      />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setBottleCaseQuantity((q) =>
                        Math.min(bottleAvailableQty, q + 1),
                      )
                    }
                    disabled={
                      bottleAvailableQty === 0 ||
                      bottleCaseQuantity >= bottleAvailableQty
                    }
                    className="mt-1 w-full rounded-lg bg-button-background py-3 text-xs font-bold uppercase tracking-[0.7px] text-white shadow-sm transition-colors hover:bg-button-hover disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {bottleAvailableQty === 0
                      ? "Out of Stock"
                      : "Add to Order"}
                  </button>
                </div>
              </div>
            </article>
          </div>
        </div>
      </main>

      {/* CART SUMMARY */}

      <footer className="fixed bottom-[72px] left-0 z-40 w-full border-t border-border-secondary bg-background-card shadow-[0_-4px_15px_rgba(0,0,0,0.08)]">
        <div className="mx-auto flex min-h-[78px] w-full max-w-[1200px] items-center justify-between gap-4 px-4 py-3 sm:px-6 md:px-10">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold uppercase tracking-[0.7px] text-text-accent">
              Total: ₱{total.toFixed(2)}
            </span>

            <span className="text-sm text-text-secondary">
              {totalItems}{" "}
              {totalItems === 1 ? "Item" : "Items"} in cart
            </span>
          </div>

          <button
            type="button"
            disabled={totalItems === 0}
            onClick={handleReviewOrder}
            className="rounded-lg bg-button-background px-6 py-3 text-xs font-bold uppercase tracking-[0.7px] text-white shadow-sm transition-colors hover:bg-button-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            Review Order
          </button>
        </div>
      </footer>

      <CustomerNavbar
        activeTab={activeTab}
        onNavigate={handleNavigate}
      />
    </div>
  );
};

export default Products;