import { useState } from "react";

import { useNavigate } from "react-router-dom";

import containerIcon from "../../assets/images/img_container.svg";
import lightBlueIcon40 from "../../assets/images/img_icon_light_blue_900_40x20.svg";
import lightBlueIcon from "../../assets/images/img_icon_light_blue_900.svg";
import icon from "../../assets/images/img_icon.svg";

import roundPurifiedWaterImage from "../../assets/images/round-purified-water.png";
import slimPurifiedWaterImage from "../../assets/images/slim-purified-water.png";
import bottleImage from "../../assets/images/500ml-bottle.png";

import Header from "../../components/Header/Header";
import CustomerNavbar from "../../components/customer/CustomerNavbar";

function Home() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("home");

  const products = [
    {
      id: 1,
      name: "Round Gallon Refill",
      price: "PHP 25.00",
      image: roundPurifiedWaterImage,
    },
    {
      id: 2,
      name: "Slim Gallon Refill",
      price: "PHP 25.00",
      image: slimPurifiedWaterImage,
    },
    {
      id: 3,
      name: "500ml Bottle (Case of 24)",
      price: "PHP 240.00",
      image: bottleImage,
    },
  ];

  const orderHistory = [
    {
      date: "Oct 24, 2023",
      items: "2x Round Gallon",
      amount: "PHP 80.00",
      status: "COMPLETED",
    },
    {
      date: "Oct 18, 2023",
      items: "1x Slim Gallon",
      amount: "PHP 50.00",
      status: "COMPLETED",
    },
  ];

  const handleProductClick = () => {
    navigate("/customer/products");
  };

  return (
    <div className="min-h-screen w-full bg-background-main text-text-primary">
      <Header />

      <main className="w-full px-4 py-6 sm:px-6 md:px-8 lg:px-10">
        {/* Greeting */}
        <section className="mb-8 w-full">
          <h2 className="text-2xl font-bold text-text-primary">
            Hello, Customer
          </h2>

          <p className="mt-1 text-sm text-text-secondary">
            Your designated zone: Sector 4
          </p>

          <button
            type="button"
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-button-background px-4 py-3 text-sm font-bold text-button-text transition hover:opacity-90"
            onClick={() => navigate("/customer/products")}
          >
            <img
              src={icon}
              alt=""
              className="h-4 w-4 object-contain"
            />
            <span>NEW ORDER</span>
          </button>
        </section>

        {/* Current Order Status */}
        <section className="mb-8 w-full">
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-text-primary">
            Current Order Status
          </h3>

          <div className="w-full rounded-md bg-background-accent p-4">
            <div className="mb-5 flex items-center justify-between">
              <h4 className="text-sm font-bold">
                Order #TRX-8921
              </h4>

              <span className="rounded-md bg-white/50 px-3 py-1 text-xs">
                Est. 45 min
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-md bg-white/40 p-3">
                <span className="text-xs font-bold uppercase">
                  Pending
                </span>

                <span className="text-xs text-text-secondary">
                  Confirmed
                </span>
              </div>

              <div className="flex items-center justify-between rounded-md bg-primary-background p-3 text-primary-foreground">
                <span className="text-xs font-bold uppercase">
                  Out for Delivery
                </span>

                <span className="text-xs">
                  In Transit
                </span>
              </div>

              <div className="flex items-center justify-between rounded-md bg-white/40 p-3">
                <span className="text-xs font-bold uppercase">
                  Delivered
                </span>

                <span className="text-xs text-text-secondary">
                  Pending
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Available Products */}
        <section className="mb-8 w-full">
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-text-primary">
            Available Products
          </h3>

          <div className="mb-4 w-full rounded-md bg-background-accent p-3 text-xs font-bold">
            Note: All products are for refills only.
          </div>

          <div className="flex w-full gap-4 overflow-x-auto px-1 pb-3 pt-1">
            {products.map((product) => (
              <div
                key={product.id}
                role="button"
                tabIndex={0}
                onClick={handleProductClick}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleProductClick();
                  }
                }}
                className="w-64 flex-shrink-0 cursor-pointer overflow-hidden rounded-md bg-background-accent transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary"
                style={{
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                }}
              >
                {/* Product Image */}
                <div className="h-56 w-full overflow-hidden bg-white/30">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Product Information */}
                <div className="p-4">
                  <h4 className="text-sm font-bold">
                    {product.name}
                  </h4>

                  <p className="mt-1 text-xs font-bold text-text-accent">
                    {product.price}
                  </p>
                </div>

                <div className="flex w-full items-center justify-center gap-2 bg-white py-3 text-xs font-bold uppercase text-text-accent">
                  <img
                    src={lightBlueIcon}
                    alt=""
                    className="h-3 w-3 object-contain"
                  />

                  <span>ADD</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent History */}
        <section className="mb-24 w-full">
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-text-primary">
            Recent History
          </h3>

          <div className="w-full overflow-hidden rounded-md bg-background-accent">
            {orderHistory.map((order, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-4 ${
                  index !== orderHistory.length - 1
                    ? "border-b border-border-light"
                    : ""
                }`}
              >
                <div>
                  <p className="text-sm font-bold">
                    {order.date}
                  </p>

                  <p className="mt-1 text-xs text-text-secondary">
                    {order.items}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm">
                    {order.amount}
                  </p>

                  <p className="mt-1 text-xs font-bold text-text-accent">
                    {order.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Customer Navbar */}
      <CustomerNavbar
        activeTab={activeTab}
        onNavigate={(tab) => {
          setActiveTab(tab);

          if (tab === "products") {
            navigate("/customer/products");
          }
        }}
      />
    </div>
  );
}

export default Home;