import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Trash2, X } from "lucide-react";

import Header from "../../components/Header/Header";
import CustomerNavbar from "../../components/customer/CustomerNavbar";

import slimRefillImage from "../../assets/images/slim-purified-water.png";
import roundRefillImage from "../../assets/images/round-purified-water.png";
import bottleImage from "../../assets/images/500ml-bottle.png";

import increaseIcon from "../../assets/images/img_button_increase.svg";

import { saveCurrentOrder } from "../../utils/orderStorage";

// ============================================================
// MINUS ICON
// ============================================================

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

// ============================================================
// DEFAULT PRODUCTS
// ============================================================

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

// ============================================================
// CUSTOMER
// ============================================================

const customer = {
  name: "Maria Santos",
  contactNumber: "0917-555-0192",
  address: [
    "Block 4, Lot 12, Phase 2",
    "Sunnyvale Subdivision",
    "Brgy. San Jose, Antipolo",
  ],
};

// ============================================================
// PRODUCT IMAGE HELPER
// ============================================================

const getProductImage = (productId) => {
  if (String(productId) === "1") {
    return slimRefillImage;
  }

  if (String(productId) === "2") {
    return roundRefillImage;
  }

  return bottleImage;
};

// ============================================================
// PRODUCTS PAGE
// ============================================================

const Products = () => {
  const navigate = useNavigate();

  // ==========================================================
  // TEMPORARY PRODUCT QUANTITIES
  // ==========================================================

  const [
    slimRefillQuantity,
    setSlimRefillQuantity,
  ] = useState(0);

  const [
    roundRefillQuantity,
    setRoundRefillQuantity,
  ] = useState(0);

  const [
    bottleCaseQuantity,
    setBottleCaseQuantity,
  ] = useState(0);

  // ==========================================================
  // ACTUAL CART
  // ==========================================================

  const [cartItems, setCartItems] =
    useState([]);

  // ==========================================================
  // AVAILABLE PRODUCTS
  // ==========================================================

  const [availableProducts, setAvailableProducts] =
    useState(defaultProducts);

  // ==========================================================
  // NAVBAR
  // ==========================================================

  const [activeTab, setActiveTab] =
    useState("products");

  // ==========================================================
  // REVIEW ORDER PANEL
  // ==========================================================

  const [showCartReview, setShowCartReview] =
    useState(false);

  // ==========================================================
  // ORDER ADDED MESSAGE
  // ==========================================================

  const [showOrderAdded, setShowOrderAdded] =
    useState(false);

  // ==========================================================
  // LOAD PRODUCTS
  // ==========================================================

  const loadProducts = () => {
    try {
      const savedProducts =
        localStorage.getItem(
          "adminProducts",
        );

      if (!savedProducts) {
        setAvailableProducts(
          defaultProducts,
        );
        return;
      }

      const parsedProducts =
        JSON.parse(savedProducts);

      if (
        !Array.isArray(
          parsedProducts,
        )
      ) {
        setAvailableProducts(
          defaultProducts,
        );
        return;
      }

      const mergedProducts =
        defaultProducts.map(
          (defaultProduct) => {
            const savedProduct =
              parsedProducts.find(
                (product) =>
                  String(
                    product.id,
                  ) ===
                  String(
                    defaultProduct.id,
                  ),
              );

            if (!savedProduct) {
              return defaultProduct;
            }

            return {
              ...defaultProduct,
              ...savedProduct,
              quantity:
                Number(
                  savedProduct.quantity,
                ) || 0,
            };
          },
        );

      setAvailableProducts(
        mergedProducts,
      );
    } catch (error) {
      console.error(
        "Failed to load products:",
        error,
      );

      setAvailableProducts(
        defaultProducts,
      );
    }
  };

  // ==========================================================
  // PRODUCT LISTENER
  // ==========================================================

  useEffect(() => {
    loadProducts();

    const handleProductUpdate =
      () => {
        loadProducts();
      };

    window.addEventListener(
      "storage",
      handleProductUpdate,
    );

    window.addEventListener(
      "productUpdated",
      handleProductUpdate,
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleProductUpdate,
      );

      window.removeEventListener(
        "productUpdated",
        handleProductUpdate,
      );
    };
  }, []);

  // ==========================================================
  // AVAILABLE QUANTITIES
  // ==========================================================

  const slimAvailableQty =
    Number(
      availableProducts.find(
        (product) =>
          String(product.id) ===
          "1",
      )?.quantity,
    ) || 0;

  const roundAvailableQty =
    Number(
      availableProducts.find(
        (product) =>
          String(product.id) ===
          "2",
      )?.quantity,
    ) || 0;

  const bottleAvailableQty =
    Number(
      availableProducts.find(
        (product) =>
          String(product.id) ===
          "3",
      )?.quantity,
    ) || 0;

  // ==========================================================
  // FIND PRODUCT
  // ==========================================================

  const getProductById = (
    productId,
  ) => {
    return (
      availableProducts.find(
        (product) =>
          String(product.id) ===
          String(productId),
      ) ||
      defaultProducts.find(
        (product) =>
          String(product.id) ===
          String(productId),
      )
    );
  };

  // ==========================================================
  // ADD TO ORDER
  // ==========================================================

  const addToCart = (
    productId,
    selectedQuantity,
  ) => {
    if (
      selectedQuantity <= 0
    ) {
      return;
    }

    const product =
      getProductById(
        productId,
      );

    if (!product) {
      return;
    }

    const availableQuantity =
      Number(
        product.quantity,
      ) || 0;

    if (
      selectedQuantity >
      availableQuantity
    ) {
      return;
    }

    setCartItems(
      (currentCart) => {
        const existingItem =
          currentCart.find(
            (item) =>
              String(item.id) ===
              String(productId),
          );

        if (existingItem) {
          return currentCart.map(
            (item) =>
              String(item.id) ===
              String(productId)
                ? {
                    ...item,
                    quantity:
                      selectedQuantity,
                    total:
                      Number(
                        item.price,
                      ) *
                      selectedQuantity,
                  }
                : item,
          );
        }

        return [
          ...currentCart,
          {
            id: product.id,
            name: product.name,
            price: Number(
              product.price,
            ),
            quantity:
              selectedQuantity,
            total:
              Number(
                product.price,
              ) *
              selectedQuantity,
          },
        ];
      },
    );

    // ========================================================
    // SHOW CENTERED ORDER ADDED MESSAGE
    // ========================================================

    setShowOrderAdded(true);

    window.setTimeout(() => {
      setShowOrderAdded(false);
    }, 1800);
  };

  // ==========================================================
  // CART INCREASE
  // ==========================================================

  const increaseCartItem = (
    item,
  ) => {
    const product =
      getProductById(item.id);

    const availableQuantity =
      Number(
        product?.quantity,
      ) || 0;

    if (
      item.quantity >=
      availableQuantity
    ) {
      return;
    }

    setCartItems(
      (currentCart) =>
        currentCart.map(
          (cartItem) =>
            String(
              cartItem.id,
            ) ===
            String(item.id)
              ? {
                  ...cartItem,
                  quantity:
                    cartItem.quantity +
                    1,
                  total:
                    Number(
                      cartItem.price,
                    ) *
                    (cartItem.quantity +
                      1),
                }
              : cartItem,
        ),
    );
  };

  // ==========================================================
  // CART DECREASE
  // ==========================================================

  const decreaseCartItem = (
    item,
  ) => {
    if (
      item.quantity <= 1
    ) {
      removeCartItem(item.id);
      return;
    }

    setCartItems(
      (currentCart) =>
        currentCart.map(
          (cartItem) =>
            String(
              cartItem.id,
            ) ===
            String(item.id)
              ? {
                  ...cartItem,
                  quantity:
                    cartItem.quantity -
                    1,
                  total:
                    Number(
                      cartItem.price,
                    ) *
                    (cartItem.quantity -
                      1),
                }
              : cartItem,
        ),
    );
  };

  // ==========================================================
  // REMOVE CART ITEM
  // ==========================================================

  const removeCartItem = (
    productId,
  ) => {
    setCartItems(
      (currentCart) =>
        currentCart.filter(
          (item) =>
            String(item.id) !==
            String(productId),
        ),
    );
  };

  // ==========================================================
  // CART TOTALS
  // ==========================================================

  const totalItems =
    cartItems.reduce(
      (sum, item) =>
        sum +
        Number(
          item.quantity,
        ),
      0,
    );

  const subtotal =
    cartItems.reduce(
      (sum, item) =>
        sum +
        Number(item.price) *
          Number(
            item.quantity,
          ),
      0,
    );

  const deliveryFee =
    cartItems.length > 0
      ? 20
      : 0;

  const total =
    subtotal +
    deliveryFee;

  // ==========================================================
  // PREPARE CURRENT ORDER
  // ==========================================================

  const buildOrder = () => {
    return {
      id: `ORD-${Date.now()}`,

      orderNumber: `#ORD-${String(
        Date.now(),
      ).slice(-6)}`,

      customerName:
        customer.name,

      contactNumber:
        customer.contactNumber,

      deliveryAddress:
        customer.address.join(
          ", ",
        ),

      deliveryAddressLines:
        customer.address,

      products:
        cartItems.map(
          (item) => ({
            id: item.id,
            name: item.name,
            price: Number(
              item.price,
            ),
            quantity:
              Number(
                item.quantity,
              ),
            total:
              Number(
                item.price,
              ) *
              Number(
                item.quantity,
              ),
          }),
        ),

      subtotal,

      deliveryFee,

      total,

      status: "Pending",

      deliveryDate: "",

      deliveryTime: "",

      deliverySchedule: "",

      notes: "",

      createdAt:
        new Date().toISOString(),

      updatedAt:
        new Date().toISOString(),
    };
  };

  // ==========================================================
  // PROCEED TO ORDER
  // ==========================================================

  const handleProceedToOrder =
    () => {
      if (
        cartItems.length ===
        0
      ) {
        return;
      }

      const order =
        buildOrder();

      saveCurrentOrder(
        order,
      );

      navigate(
        "/customer/edit-order",
        {
          state: {
            order,
          },
        },
      );
    };

  // ==========================================================
  // NAVIGATION
  // ==========================================================

  const handleNavigate = (
    tab,
  ) => {
    setActiveTab(tab);

    if (
      tab === "home"
    ) {
      navigate(
        "/customer/home",
      );
    } else if (
      tab === "products"
    ) {
      navigate(
        "/customer/products",
      );
    } else if (
      tab === "orders"
    ) {
      navigate(
        "/customer/orders",
      );
    } else if (
      tab === "track"
    ) {
      navigate(
        "/customer/track",
      );
    } else if (
      tab === "profile"
    ) {
      navigate(
        "/customer/profile",
      );
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background-main">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <Header />

      {/* =====================================================
          CENTERED ORDER ADDED NOTIFICATION
      ====================================================== */}

      <div
        className={`pointer-events-none fixed inset-0 z-[200] flex items-center justify-center px-4 transition-all duration-300 ${
          showOrderAdded
            ? "opacity-100"
            : "opacity-0"
        }`}
      >
        <div
          className={`flex min-w-[230px] flex-col items-center justify-center gap-3 rounded-2xl border border-[#A8DCE8] bg-white px-10 py-7 shadow-[0_12px_40px_rgba(0,0,0,0.18)] transition-all duration-300 ${
            showOrderAdded
              ? "scale-100 translate-y-0"
              : "scale-90 translate-y-2"
          }`}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#08779D] text-white shadow-sm">
            <Check
              size={30}
              strokeWidth={3}
            />
          </div>

          <div className="text-center">
            <p className="text-lg font-bold text-text-primary">
              Order Added
            </p>

            <p className="mt-1 text-sm text-text-secondary">
              Your item has been added to your order.
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          REVIEW ORDER BACKDROP
      ====================================================== */}

      <div
        className={`fixed inset-0 z-[70] bg-[#123047]/30 backdrop-blur-[2px] transition-all duration-300 ${
          showCartReview
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={() =>
          setShowCartReview(false)
        }
      />

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <main className="flex-1 overflow-y-auto bg-background-main px-4 pb-[170px] pt-8 sm:px-6 md:px-10">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8">
          {/* PAGE HEADER */}

          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold leading-8 tracking-[-0.32px] text-text-primary sm:text-3xl">
              Select Products
            </h1>

            <p className="text-sm leading-6 text-text-secondary sm:text-base">
              Choose the gallon type and quantity for your delivery.
            </p>
          </div>

          {/* =================================================
              PRODUCT GRID
          ================================================== */}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* =================================================
                SLIM REFILL
            ================================================== */}

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
                        setSlimRefillQuantity(
                          (quantity) =>
                            Math.max(
                              0,
                              quantity -
                                1,
                            ),
                        )
                      }
                      disabled={
                        slimRefillQuantity ===
                        0
                      }
                      className="flex h-full w-14 items-center justify-center border-r border-border-secondary text-text-accent transition-colors hover:bg-background-accent disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <MinusIcon />
                    </button>

                    <span className="flex flex-1 items-center justify-center text-sm font-bold text-text-primary">
                      {
                        slimRefillQuantity
                      }
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setSlimRefillQuantity(
                          (quantity) =>
                            Math.min(
                              slimAvailableQty,
                              quantity +
                                1,
                            ),
                        )
                      }
                      disabled={
                        slimRefillQuantity >=
                        slimAvailableQty
                      }
                      className="flex h-full w-14 items-center justify-center border-l border-border-secondary transition-colors hover:bg-background-accent disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <img
                        src={
                          increaseIcon
                        }
                        alt="Increase"
                        className="h-4 w-4"
                      />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      addToCart(
                        "1",
                        slimRefillQuantity,
                      )
                    }
                    disabled={
                      slimRefillQuantity ===
                        0 ||
                      slimAvailableQty ===
                        0
                    }
                    className="mt-1 w-full rounded-lg bg-button-background py-3 text-xs font-bold uppercase tracking-[0.7px] text-white shadow-sm transition-colors hover:bg-button-hover disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {slimAvailableQty ===
                    0
                      ? "Out of Stock"
                      : "Add to Order"}
                  </button>
                </div>
              </div>
            </article>

            {/* =================================================
                ROUND REFILL
            ================================================== */}

            <article className="flex min-h-[480px] flex-col overflow-hidden rounded-xl border border-card-border bg-card-background shadow-card transition-shadow duration-200 hover:shadow-md">
              <div className="h-[220px] w-full overflow-hidden bg-background-accent">
                <img
                  src={
                    roundRefillImage
                  }
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
                        setRoundRefillQuantity(
                          (quantity) =>
                            Math.max(
                              0,
                              quantity -
                                1,
                            ),
                        )
                      }
                      disabled={
                        roundRefillQuantity ===
                        0
                      }
                      className="flex h-full w-14 items-center justify-center border-r border-border-secondary text-text-accent transition-colors hover:bg-background-accent disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <MinusIcon />
                    </button>

                    <span className="flex flex-1 items-center justify-center text-sm font-bold text-text-primary">
                      {
                        roundRefillQuantity
                      }
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setRoundRefillQuantity(
                          (quantity) =>
                            Math.min(
                              roundAvailableQty,
                              quantity +
                                1,
                            ),
                        )
                      }
                      disabled={
                        roundRefillQuantity >=
                        roundAvailableQty
                      }
                      className="flex h-full w-14 items-center justify-center border-l border-border-secondary transition-colors hover:bg-background-accent disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <img
                        src={
                          increaseIcon
                        }
                        alt="Increase"
                        className="h-4 w-4"
                      />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      addToCart(
                        "2",
                        roundRefillQuantity,
                      )
                    }
                    disabled={
                      roundRefillQuantity ===
                        0 ||
                      roundAvailableQty ===
                        0
                    }
                    className="mt-1 w-full rounded-lg bg-button-background py-3 text-xs font-bold uppercase tracking-[0.7px] text-white shadow-sm transition-colors hover:bg-button-hover disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {roundAvailableQty ===
                    0
                      ? "Out of Stock"
                      : "Add to Order"}
                  </button>
                </div>
              </div>
            </article>

            {/* =================================================
                500ML BOTTLE
            ================================================== */}

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
                    <span>500ml Bottle</span>{" "}
                    <span>(Case of 24)</span>
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
                        setBottleCaseQuantity(
                          (quantity) =>
                            Math.max(
                              0,
                              quantity -
                                1,
                            ),
                        )
                      }
                      disabled={
                        bottleCaseQuantity ===
                        0
                      }
                      className="flex h-full w-14 items-center justify-center border-r border-border-secondary text-text-accent transition-colors hover:bg-background-accent disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <MinusIcon />
                    </button>

                    <span className="flex flex-1 items-center justify-center text-sm font-bold text-text-primary">
                      {
                        bottleCaseQuantity
                      }
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setBottleCaseQuantity(
                          (quantity) =>
                            Math.min(
                              bottleAvailableQty,
                              quantity +
                                1,
                            ),
                        )
                      }
                      disabled={
                        bottleCaseQuantity >=
                        bottleAvailableQty
                      }
                      className="flex h-full w-14 items-center justify-center border-l border-border-secondary transition-colors hover:bg-background-accent disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <img
                        src={
                          increaseIcon
                        }
                        alt="Increase"
                        className="h-4 w-4"
                      />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      addToCart(
                        "3",
                        bottleCaseQuantity,
                      )
                    }
                    disabled={
                      bottleCaseQuantity ===
                        0 ||
                      bottleAvailableQty ===
                        0
                    }
                    className="mt-1 w-full rounded-lg bg-button-background py-3 text-xs font-bold uppercase tracking-[0.7px] text-white shadow-sm transition-colors hover:bg-button-hover disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {bottleAvailableQty ===
                    0
                      ? "Out of Stock"
                      : "Add to Order"}
                  </button>
                </div>
              </div>
            </article>
          </div>
        </div>
      </main>

      {/* =====================================================
          LARGE REVIEW ORDER PANEL
      ====================================================== */}

      <div
        className={`fixed bottom-[92px] left-1/2 z-[90] w-[calc(100%-1.5rem)] max-w-[760px] -translate-x-1/2 overflow-hidden rounded-2xl border border-border-secondary bg-background-card shadow-[0_20px_60px_rgba(0,0,0,0.22)] transition-all duration-300 ease-out sm:bottom-[100px] sm:w-[calc(100%-3rem)] ${
          showCartReview
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-8 scale-[0.97] opacity-0"
        }`}
      >
        {/* PANEL HEADER */}

        <div className="flex items-center justify-between border-b border-border-light bg-background-accent px-5 py-4 sm:px-7 sm:py-5">
          <div>
            <h2 className="text-lg font-bold tracking-[-0.2px] text-text-primary sm:text-xl">
              Review Order
            </h2>

            <p className="mt-1 text-xs text-text-secondary sm:text-sm">
              {totalItems}{" "}
              {totalItems ===
              1
                ? "item"
                : "items"}{" "}
              currently in your cart
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setShowCartReview(
                false,
              )
            }
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border-secondary bg-background-card text-text-secondary transition-colors hover:bg-background-main hover:text-text-primary"
            aria-label="Close order review"
          >
            <X
              size={19}
              strokeWidth={2}
            />
          </button>
        </div>

        {/* CART ITEMS */}

        <div className="max-h-[52vh] overflow-y-auto px-5 sm:px-7">
          {cartItems.length >
          0 ? (
            <div className="divide-y divide-border-light">
              {cartItems.map(
                (item) => {
                  const product =
                    getProductById(
                      item.id,
                    );

                  const availableQuantity =
                    Number(
                      product?.quantity,
                    ) || 0;

                  return (
                    <div
                      key={
                        item.id
                      }
                      className="flex items-center gap-4 py-5 sm:gap-5 sm:py-6"
                    >
                      {/* IMAGE */}

                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-border-light bg-background-accent sm:h-24 sm:w-24">
                        <img
                          src={getProductImage(
                            item.id,
                          )}
                          alt={
                            item.name
                          }
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {/* PRODUCT INFO */}

                      <div className="min-w-0 flex-1">
                        <p className="break-words text-sm font-bold text-text-primary sm:text-base">
                          {
                            item.name
                          }
                        </p>

                        <p className="mt-1 text-xs text-text-secondary sm:text-sm">
                          ₱
                          {Number(
                            item.price,
                          ).toFixed(
                            2,
                          )}{" "}
                          each
                        </p>

                        {/* QUANTITY CONTROLS */}

                        <div className="mt-3 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              decreaseCartItem(
                                item,
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-secondary bg-background-card text-text-accent transition-colors hover:bg-background-accent"
                            aria-label={`Decrease ${item.name}`}
                          >
                            <MinusIcon />
                          </button>

                          <span className="flex h-9 min-w-[38px] items-center justify-center rounded-lg bg-background-accent px-2 text-sm font-bold text-text-primary">
                            {
                              item.quantity
                            }
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              increaseCartItem(
                                item,
                              )
                            }
                            disabled={
                              item.quantity >=
                              availableQuantity
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-secondary bg-background-card transition-colors hover:bg-background-accent disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label={`Increase ${item.name}`}
                          >
                            <img
                              src={
                                increaseIcon
                              }
                              alt="Increase"
                              className="h-4 w-4"
                            />
                          </button>
                        </div>
                      </div>

                      {/* PRICE / REMOVE */}

                      <div className="flex shrink-0 flex-col items-end gap-3">
                        <span className="text-sm font-bold text-text-primary sm:text-base">
                          ₱
                          {(
                            Number(
                              item.price,
                            ) *
                            Number(
                              item.quantity,
                            )
                          ).toFixed(
                            2,
                          )}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            removeCartItem(
                              item.id,
                            )
                          }
                          className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.5px] text-red-600 transition-opacity hover:opacity-70 sm:text-xs"
                        >
                          <Trash2
                            size={
                              14
                            }
                            strokeWidth={
                              2
                            }
                          />

                          Remove
                        </button>
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          ) : (
            <div className="py-14 text-center">
              <p className="text-base font-semibold text-text-primary">
                Your cart is empty.
              </p>

              <p className="mt-2 text-sm text-text-secondary">
                Add products above to continue.
              </p>
            </div>
          )}
        </div>

        {/* TOTALS + BUTTON */}

        {cartItems.length >
          0 && (
          <div className="border-t border-border-light bg-background-main px-5 py-4 sm:px-7 sm:py-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="w-full max-w-[300px]">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">
                    Subtotal
                  </span>

                  <span className="font-semibold text-text-primary">
                    ₱
                    {subtotal.toFixed(
                      2,
                    )}
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-text-secondary">
                    Delivery Fee
                  </span>

                  <span className="font-semibold text-text-primary">
                    ₱
                    {deliveryFee.toFixed(
                      2,
                    )}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-border-light pt-3">
                  <span className="text-base font-bold text-text-primary">
                    Total
                  </span>

                  <span className="text-xl font-bold text-text-accent">
                    ₱
                    {total.toFixed(
                      2,
                    )}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={
                  handleProceedToOrder
                }
                disabled={
                  cartItems.length ===
                  0
                }
                className="w-full rounded-lg bg-button-background px-7 py-3.5 text-xs font-bold uppercase tracking-[0.7px] text-white shadow-sm transition-all duration-200 hover:bg-button-hover hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-[220px]"
              >
                Proceed to Order
              </button>
            </div>
          </div>
        )}
      </div>

      {/* =====================================================
          CART FOOTER
      ====================================================== */}

      <footer className="fixed bottom-[72px] left-0 z-40 w-full border-t border-border-secondary bg-background-card shadow-[0_-4px_15px_rgba(0,0,0,0.08)]">
        <div className="mx-auto flex min-h-[78px] w-full max-w-[1200px] items-center justify-between gap-4 px-4 py-3 sm:px-6 md:px-10">
          {/* CART INFORMATION */}

          <button
            type="button"
            disabled={
              cartItems.length ===
              0
            }
            onClick={() =>
              setShowCartReview(
                (value) =>
                  !value,
              )
            }
            className="flex min-w-0 flex-col items-start gap-1 text-left disabled:cursor-not-allowed"
          >
            <span className="text-xs font-bold uppercase tracking-[0.7px] text-text-accent">
              TOTAL: ₱
              {total.toFixed(
                2,
              )}
            </span>

            <span className="text-sm text-text-secondary underline decoration-border-secondary underline-offset-2">
              {totalItems}{" "}
              {totalItems ===
              1
                ? "Item"
                : "Items"}{" "}
              in cart · Review Order
            </span>
          </button>

          {/* REVIEW ORDER */}

          <button
            type="button"
            disabled={
              cartItems.length ===
              0
            }
            onClick={() =>
              setShowCartReview(
                (value) =>
                  !value,
              )
            }
            className="shrink-0 rounded-lg bg-button-background px-5 py-3 text-xs font-bold uppercase tracking-[0.7px] text-white shadow-sm transition-all duration-200 hover:bg-button-hover hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 sm:px-6"
          >
            Review Order
          </button>
        </div>
      </footer>

      {/* =====================================================
          CUSTOMER NAVBAR
      ====================================================== */}

      <CustomerNavbar
        activeTab={activeTab}
        onNavigate={
          handleNavigate
        }
      />
    </div>
  );
};

export default Products;