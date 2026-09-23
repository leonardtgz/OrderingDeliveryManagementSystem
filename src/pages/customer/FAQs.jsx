import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../components/Header/Header";
import CustomerNavbar from "../../components/customer/CustomerNavbar";

function BackArrowIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15 18L9 12L15 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronIcon({ open }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform ${
        open ? "rotate-180" : ""
      }`}
    >
      <path
        d="M6 9L12 15L18 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const faqs = [
  {
    question: "How do I place an order?",
    answer:
      "Go to the Products page, choose the water product and quantity you need, then proceed to checkout. Review your delivery details and order summary before confirming your order.",
  },
  {
    question: "How can I track my order?",
    answer:
      "After placing an order, go to the Order Tracking page from the customer navigation. You can view the current status of your order and its delivery progress.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Delivery time depends on your location, order volume, and the current delivery schedule. Your estimated delivery time will be shown when your order is confirmed.",
  },
  {
    question: "Can I cancel my order?",
    answer:
      "Order cancellation may depend on the current status of your order. If you need to cancel an order, contact customer support as soon as possible and provide your order number.",
  },
  {
    question: "Can I change my delivery address?",
    answer:
      "You may update your saved profile address from Edit Profile. For an order that has already been placed, contact customer support immediately to check whether the delivery details can still be changed.",
  },
  {
    question: "What should I do if my order is delayed?",
    answer:
      "Check the Order Tracking page first for the latest status. If your order remains delayed or you need additional assistance, contact customer support and provide your order number.",
  },
  {
    question: "What payment options are available?",
    answer:
      "Available payment options depend on the payment methods currently supported by GoldenPR. The available option will be shown during the ordering process.",
  },
  {
    question: "How do I update my account information?",
    answer:
      "Go to Profile, select Edit Profile, update your information, and save your changes. Your updated profile information will be used for future orders.",
  },
];

function FAQs() {
  const navigate = useNavigate();

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(
      openIndex === index ? null : index,
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-background-main">

      {/* Header */}
      <div className="w-full shrink-0">
        <Header />
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background-main pb-[120px]">
        <div className="mx-auto flex w-full max-w-[700px] flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">

          {/* Back Button */}
          <button
            type="button"
            onClick={() => navigate("/customer/profile")}
            className="flex w-fit items-center gap-1.5 text-xs font-bold uppercase tracking-[0.5px] text-text-secondary transition-colors hover:text-text-accent"
          >
            <BackArrowIcon />
            Back to Profile
          </button>

          {/* Page Header */}
          <div>
            <h1 className="text-[24px] font-bold leading-[120%] tracking-[-0.02em] text-text-accent sm:text-[28px]">
              Frequently Asked Questions
            </h1>

            <p className="mt-1 text-sm leading-5 text-text-secondary">
              Find quick answers to common questions about GoldenPR.
            </p>
          </div>

          {/* FAQ Card */}
          <section className="overflow-hidden rounded-xl border border-border-primary bg-background-card shadow-card">

            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={faq.question}
                  className="border-b border-border-light last:border-b-0"
                >
                  <button
                    type="button"
                    onClick={() => toggleFAQ(index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-background-accent sm:px-6"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm font-semibold text-text-primary">
                      {faq.question}
                    </span>

                    <ChevronIcon open={isOpen} />
                  </button>

                  {isOpen && (
                    <div className="bg-background-accent px-5 pb-5 pt-1 sm:px-6">
                      <p className="text-sm leading-6 text-text-secondary">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}

          </section>

          {/* Still Need Help */}
          <section className="rounded-xl border border-border-primary bg-background-accent p-5 sm:p-6">
            <h2 className="text-base font-bold text-text-primary">
              Still need help?
            </h2>

            <p className="mt-1 text-sm leading-5 text-text-secondary">
              If you cannot find the answer you need, our support team can assist you with your account or order.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/customer/contact-support")
              }
              className="mt-4 flex min-h-10 items-center justify-center rounded-lg bg-button-background px-4 py-2.5 text-xs font-bold uppercase tracking-[0.5px] text-button-text transition-colors hover:bg-button-hover"
            >
              Contact Support
            </button>
          </section>

        </div>
      </main>

      {/* Customer Navbar */}
      <div className="fixed bottom-0 left-0 z-50 w-full">
        <CustomerNavbar />
      </div>

    </div>
  );
}

export default FAQs;