import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../components/Header/Header";
import CustomerNavbar from "../../components/customer/CustomerNavbar";

import { getProfile } from "../../utils/profileStorage";

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

function PhoneIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-text-accent"
    >
      <path
        d="M6.5 3.5L9 3L11 8L8.5 9.5C9.5 12 11.5 14 14 15L15.5 12.5L20.5 14.5L20 17C19.5 19 17.5 20.5 15.5 20C9.5 18.5 5.5 14.5 4 8.5C3.5 6.5 5 4 6.5 3.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-text-accent"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M4 7L12 13L20 7"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ContactSupport() {
  const navigate = useNavigate();

  const profile = getProfile();

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!subject || !message.trim()) {
      alert("Please complete the subject and message fields.");
      return;
    }

    const supportRequest = {
      id: crypto.randomUUID(),
      customerName: profile.fullName || "",
      customerPhone: profile.phoneNumber || "",
      customerEmail: profile.email || "",
      subject,
      message: message.trim(),
      createdAt: new Date().toISOString(),
      status: "OPEN",
    };

    const existingRequests =
      JSON.parse(
        localStorage.getItem(
          "goldenpr_support_requests",
        ) || "[]",
      );

    localStorage.setItem(
      "goldenpr_support_requests",
      JSON.stringify([
        ...existingRequests,
        supportRequest,
      ]),
    );

    setSubject("");
    setMessage("");
    setSubmitted(true);
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
              Contact Support
            </h1>

            <p className="mt-1 text-sm leading-5 text-text-secondary">
              Need help? Send us a message and our support team can assist you.
            </p>
          </div>

          {/* Support Information */}
          <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">

            <div className="rounded-xl border border-border-primary bg-background-card p-5 shadow-card">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background-accent">
                  <PhoneIcon />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.6px] text-text-secondary">
                    Phone
                  </p>

                  <p className="mt-1 text-sm font-semibold text-text-primary">
                    0917-555-0192
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border-primary bg-background-card p-5 shadow-card">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background-accent">
                  <EmailIcon />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.6px] text-text-secondary">
                    Email
                  </p>

                  <p className="mt-1 break-all text-sm font-semibold text-text-primary">
                    support@goldenpr.com
                  </p>
                </div>
              </div>
            </div>

          </section>

          {/* Contact Form */}
          <section className="overflow-hidden rounded-xl border border-border-primary bg-background-card shadow-card">

            <div className="border-b border-border-light bg-background-accent px-5 py-4 sm:px-6">
              <h2 className="text-base font-bold text-text-primary">
                Send a Message
              </h2>

              <p className="mt-1 text-xs text-text-secondary">
                Please provide enough details so we can assist you properly.
              </p>
            </div>

            {submitted ? (
              <div className="px-5 py-8 text-center sm:px-6">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-background-accent">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-text-accent"
                  >
                    <path
                      d="M5 12L10 17L19 7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <h2 className="mt-4 text-lg font-bold text-text-primary">
                  Message Sent
                </h2>

                <p className="mx-auto mt-1 max-w-[450px] text-sm leading-5 text-text-secondary">
                  Your support request has been submitted. Our team will review your concern and assist you as soon as possible.
                </p>

                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-5 rounded-lg bg-button-background px-5 py-2.5 text-xs font-bold uppercase tracking-[0.5px] text-button-text transition-colors hover:bg-button-hover"
                >
                  Send Another Message
                </button>

              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-5 p-5 sm:p-6"
              >

                {/* Customer */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[0.6px] text-text-secondary">
                    Customer
                  </label>

                  <div className="mt-1 rounded-lg border border-border-light bg-background-accent px-3 py-2.5 text-sm text-text-primary">
                    {profile.fullName || "Customer"}
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label
                    htmlFor="support-subject"
                    className="text-[10px] font-bold uppercase tracking-[0.6px] text-text-secondary"
                  >
                    Subject
                  </label>

                  <select
                    id="support-subject"
                    value={subject}
                    onChange={(event) =>
                      setSubject(event.target.value)
                    }
                    className="mt-1 w-full rounded-lg border border-border-light bg-background-main px-3 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-primary-background"
                  >
                    <option value="">
                      Select a concern
                    </option>

                    <option value="Order Concern">
                      Order Concern
                    </option>

                    <option value="Delivery Concern">
                      Delivery Concern
                    </option>

                    <option value="Product Concern">
                      Product Concern
                    </option>

                    <option value="Account Concern">
                      Account Concern
                    </option>

                    <option value="Payment Concern">
                      Payment Concern
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="support-message"
                    className="text-[10px] font-bold uppercase tracking-[0.6px] text-text-secondary"
                  >
                    Message
                  </label>

                  <textarea
                    id="support-message"
                    value={message}
                    onChange={(event) =>
                      setMessage(event.target.value)
                    }
                    rows={6}
                    placeholder="Describe your concern..."
                    className="mt-1 w-full resize-none rounded-lg border border-border-light bg-background-main px-3 py-2.5 text-sm text-text-primary outline-none placeholder:text-text-secondary/70 transition-colors focus:border-primary-background"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="flex min-h-11 w-full items-center justify-center rounded-lg bg-button-background px-4 py-3 text-xs font-bold uppercase tracking-[0.6px] text-button-text transition-colors hover:bg-button-hover"
                >
                  Submit Support Request
                </button>

              </form>
            )}

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

export default ContactSupport;