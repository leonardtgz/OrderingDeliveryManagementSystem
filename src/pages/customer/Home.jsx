import { useState } from "react";

import containerIcon from "../../assets/images/img_container.svg";
import lightBlueIcon40 from "../../assets/images/img_icon_light_blue_900_40x20.svg";
import lightBlueIcon from "../../assets/images/img_icon_light_blue_900.svg";
import icon from "../../assets/images/img_icon.svg";

import Header from "../../components/Header/Header";
import CustomerNavbar from "../../components/customer/CustomerNavbar";

function Home() {
  const [activeTab, setActiveTab] = useState("home");

  const products = [
    {
      id: 1,
      name: "Round Gallon Refill",
      price: "PHP 25.00",
      image: containerIcon,
    },
    {
      id: 2,
      name: "Slim Gallon Refill",
      price: "PHP 25.00",
      image: containerIcon,
    },
    {
      id: 3,
      name: "500ml Bottle (Case of 24)",
      price: "PHP 240.00",
      image: lightBlueIcon40,
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

  return (
    <div className="min-h-screen w-full bg-background-main text-text-primary">
      <Header />

      <main className="w-full px-4 py-6 sm:px-6 md:px-8 lg:px-10">
        
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
            onClick={() => setActiveTab("products")}
          >
            <img
              src={icon}
              alt=""
              className="h-4 w-4 object-contain"
            />

            <span>NEW ORDER</span>
          </button>
        </section>

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
                className="w-64 flex-shrink-0 overflow-hidden rounded-md bg-background-accent"
                style={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}
              >
                <div className="flex h-56 items-center justify-center bg-white/30">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-28 w-28 object-contain"
                  />
                </div>

                <div className="p-4">
                  <h4 className="text-sm font-bold">
                    {product.name}
                  </h4>

                  <p className="mt-1 text-xs font-bold text-text-accent">
                    {product.price}
                  </p>
                </div>

                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 bg-white py-3 text-xs font-bold uppercase text-text-accent transition hover:bg-gray-50"
                >
                  <img
                    src={lightBlueIcon}
                    alt=""
                    className="h-3 w-3 object-contain"
                  />

                  <span>ADD</span>
                </button>
              </div>
            ))}
          </div>
        </section>

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

      <CustomerNavbar
        activeTab={activeTab}
        onNavigate={setActiveTab}
      />
    </div>
  );
}

export default Home;