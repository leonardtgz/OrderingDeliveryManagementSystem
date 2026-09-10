import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../components/Header/Header";
import CustomerNavbar from "../../components/customer/CustomerNavbar";

const OrderReview = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("products");

  return (
    <div className="flex min-h-screen flex-col bg-background-main">
      <Header />

      <main className="flex-1 bg-background-main px-4 py-6 pb-[170px] sm:px-6 md:px-10">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-4">
          <h1 className="text-xl font-bold text-text-primary sm:text-2xl">
            Review Order
          </h1>

          <div className="rounded-md bg-background-accent p-4">
            <p className="text-sm text-text-secondary">
              Order review content will be implemented here.
            </p>
          </div>
        </div>
      </main>

      <CustomerNavbar
        activeTab={activeTab}
        onNavigate={(tab) => {
          setActiveTab(tab);
          if (tab === "home") navigate("/customer/home");
          else if (tab === "products") navigate("/customer/products");
          else if (tab === "orders") navigate("/customer/orders");
          else if (tab === "track") navigate("/customer/track");
          else if (tab === "profile") navigate("/customer/profile");
        }}
      />
    </div>
  );
};

export default OrderReview;
