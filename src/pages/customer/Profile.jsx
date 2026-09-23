import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../components/Header/Header";
import CustomerNavbar from "../../components/customer/CustomerNavbar";

import { getProfile } from "../../utils/profileStorage";

function UserIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-text-accent"
    >
      <circle
        cx="12"
        cy="8"
        r="4"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      <path
        d="M4 21C4 16.5817 7.58172 13 12 13C16.4183 13 20 16.5817 20 21"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 text-text-secondary"
    >
      <path
        d="M9 18L15 12L9 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 text-text-accent"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M9.75 9C9.75 7.75736 10.7574 6.75 12 6.75C13.2426 6.75 14.25 7.75736 14.25 9C14.25 10.5 12 10.5 12 12"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <circle
        cx="12"
        cy="15.5"
        r="1"
        fill="currentColor"
      />
    </svg>
  );
}

function SupportIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 text-text-accent"
    >
      <path
        d="M4 5.5C4 4.67157 4.67157 4 5.5 4H18.5C19.3284 4 20 4.67157 20 5.5V15.5C20 16.3284 19.3284 17 18.5 17H13L9 20V17H5.5C4.67157 17 4 16.3284 4 15.5V5.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />

      <path
        d="M8 9H16"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <path
        d="M8 12H13"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-red-500"
    >
      <path
        d="M12 3L21 20H3L12 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M12 9V13"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <circle
        cx="12"
        cy="16.5"
        r="0.8"
        fill="currentColor"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 6L18 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <path
        d="M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(() => getProfile());

  const [showLogoutModal, setShowLogoutModal] =
    useState(false);

  const [showTermsModal, setShowTermsModal] =
    useState(false);

  useEffect(() => {
    const loadProfile = () => {
      setProfile(getProfile());
    };

    loadProfile();

    window.addEventListener(
      "profileUpdated",
      loadProfile,
    );

    window.addEventListener(
      "storage",
      loadProfile,
    );

    const interval = setInterval(
      loadProfile,
      1000,
    );

    return () => {
      window.removeEventListener(
        "profileUpdated",
        loadProfile,
      );

      window.removeEventListener(
        "storage",
        loadProfile,
      );

      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    navigate("/login");
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const addressLines = String(
    profile.address || "",
  ).split("\n");

  return (
    <div className="flex min-h-screen flex-col bg-background-main">

      {/* Header */}
      <div className="w-full shrink-0">
        <Header />
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background-main pb-[120px]">
        <div className="mx-auto flex w-full max-w-[700px] flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">

          {/* Page Header */}
          <div>
            <h1 className="text-[24px] font-bold leading-[120%] tracking-[-0.02em] text-text-accent sm:text-[28px]">
              Profile
            </h1>

            <p className="mt-1 text-sm leading-5 text-text-secondary">
              Manage your account information and preferences.
            </p>
          </div>

          {/* Profile Card */}
          <section className="overflow-hidden rounded-xl border border-border-primary bg-background-card shadow-card">

            {/* Profile Header */}
            <div className="flex flex-col items-center gap-3 border-b border-border-light bg-background-accent px-5 py-6 sm:flex-row sm:px-6">

              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-secondary-light">
                <UserIcon />
              </div>

              <div className="text-center sm:text-left">
                <p className="text-xs font-bold uppercase tracking-[0.6px] text-text-secondary">
                  Customer
                </p>

                <h2 className="mt-1 text-xl font-bold text-text-primary">
                  {profile.fullName}
                </h2>

                <p className="mt-1 text-sm text-text-secondary">
                  {profile.phoneNumber}
                </p>
              </div>
            </div>

            {/* Personal Information */}
            <div className="flex flex-col">

              {/* Name */}
              <div className="border-b border-border-light px-5 py-4 sm:px-6">
                <span className="text-[10px] font-bold uppercase tracking-[0.6px] text-text-secondary">
                  Name
                </span>

                <p className="mt-1 text-sm font-semibold text-text-primary">
                  {profile.fullName}
                </p>
              </div>

              {/* Contact */}
              <div className="border-b border-border-light px-5 py-4 sm:px-6">
                <span className="text-[10px] font-bold uppercase tracking-[0.6px] text-text-secondary">
                  Contact Number
                </span>

                <p className="mt-1 text-sm font-semibold text-text-primary">
                  {profile.phoneNumber}
                </p>
              </div>

              {/* Address */}
              <div className="px-5 py-4 sm:px-6">
                <span className="text-[10px] font-bold uppercase tracking-[0.6px] text-text-secondary">
                  Address
                </span>

                <p className="mt-1 text-sm font-semibold leading-5 text-text-primary">
                  {addressLines.map((line, index) => (
                    <React.Fragment key={index}>
                      {line}

                      {index < addressLines.length - 1 && (
                        <br />
                      )}
                    </React.Fragment>
                  ))}
                </p>
              </div>

            </div>
          </section>

          {/* Account Settings */}
          <section className="overflow-hidden rounded-xl border border-border-primary bg-background-card shadow-card">

            <div className="border-b border-border-light px-5 py-3 sm:px-6">
              <h2 className="text-xs font-bold uppercase tracking-[0.6px] text-text-accent">
                Account Settings
              </h2>
            </div>

            {/* Edit Profile */}
            <button
              type="button"
              onClick={() =>
                navigate("/customer/edit-profile")
              }
              className="flex w-full items-center justify-between border-b border-border-light px-5 py-4 text-left transition-colors hover:bg-background-accent sm:px-6"
            >
              <div>
                <p className="text-sm font-semibold text-text-primary">
                  Edit Profile
                </p>

                <p className="mt-1 text-xs text-text-secondary">
                  Update your personal information
                </p>
              </div>

              <ChevronRight />
            </button>

            {/* Change Password */}
            <button
              type="button"
              onClick={() =>
                navigate("/customer/change-password")
              }
              className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-background-accent sm:px-6"
            >
              <div>
                <p className="text-sm font-semibold text-text-primary">
                  Change Password
                </p>

                <p className="mt-1 text-xs text-text-secondary">
                  Update your account password
                </p>
              </div>

              <ChevronRight />
            </button>

          </section>

          {/* Help & Support */}
          <section className="overflow-hidden rounded-xl border border-border-primary bg-background-card shadow-card">

            <div className="border-b border-border-light px-5 py-3 sm:px-6">
              <h2 className="text-xs font-bold uppercase tracking-[0.6px] text-text-accent">
                Help & Support
              </h2>
            </div>

            {/* FAQs */}
            <button
              type="button"
              onClick={() =>
                navigate("/customer/faqs")
              }
              className="flex w-full items-center gap-3 border-b border-border-light px-5 py-4 text-left transition-colors hover:bg-background-accent sm:px-6"
            >
              <HelpIcon />

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-text-primary">
                  FAQs
                </p>

                <p className="mt-1 text-xs text-text-secondary">
                  Find answers to frequently asked questions
                </p>
              </div>

              <ChevronRight />
            </button>

            {/* Contact Support */}
            <button
              type="button"
              onClick={() =>
                navigate("/customer/contact-support")
              }
              className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-background-accent sm:px-6"
            >
              <SupportIcon />

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-text-primary">
                  Contact Support
                </p>

                <p className="mt-1 text-xs text-text-secondary">
                  Get help with your account or orders
                </p>
              </div>

              <ChevronRight />
            </button>

          </section>

          {/* Legal */}
          <section className="overflow-hidden rounded-xl border border-border-primary bg-background-card shadow-card">

            <div className="border-b border-border-light px-5 py-3 sm:px-6">
              <h2 className="text-xs font-bold uppercase tracking-[0.6px] text-text-accent">
                Legal
              </h2>
            </div>

            {/* Terms & Conditions */}
            <button
              type="button"
              onClick={() => setShowTermsModal(true)}
              className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-background-accent sm:px-6"
            >
              <div>
                <p className="text-sm font-semibold text-text-primary">
                  Terms & Conditions
                </p>

                <p className="mt-1 text-xs text-text-secondary">
                  Review the terms and conditions for using GoldenPR
                </p>
              </div>

              <ChevronRight />
            </button>

          </section>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="flex min-h-11 w-full items-center justify-center rounded-lg border border-red-500 bg-background-card px-4 py-3 text-xs font-bold uppercase tracking-[0.6px] text-red-500 transition-colors hover:bg-red-500 hover:text-white"
          >
            Log Out
          </button>

        </div>
      </main>

      {/* Customer Navbar */}
      <div className="fixed bottom-0 left-0 z-50 w-full">
        <CustomerNavbar />
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4"
          onClick={cancelLogout}
        >
          <div
            className="w-full max-w-[380px] rounded-xl bg-background-card p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Icon */}
            <div className="flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                <WarningIcon />
              </div>
            </div>

            {/* Message */}
            <div className="mt-4 text-center">
              <h2 className="text-lg font-bold text-text-primary">
                Log Out?
              </h2>

              <p className="mt-1.5 text-sm leading-5 text-text-secondary">
                Are you sure you want to log out of your account?
              </p>
            </div>

            {/* Buttons */}
            <div className="mt-5 flex gap-2.5">
              <button
                type="button"
                onClick={cancelLogout}
                className="flex h-10 flex-1 items-center justify-center rounded-lg border border-border-light bg-background-main px-3 text-xs font-bold uppercase tracking-[0.5px] text-text-primary transition-colors hover:bg-background-accent"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmLogout}
                className="flex h-10 flex-1 items-center justify-center rounded-lg bg-red-500 px-3 text-xs font-bold uppercase tracking-[0.5px] text-white transition-colors hover:bg-red-600"
              >
                Log Out
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Terms & Conditions Modal */}
      {showTermsModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 py-6"
          onClick={() => setShowTermsModal(false)}
        >
          <div
            className="flex max-h-[85vh] w-full max-w-[650px] flex-col rounded-xl bg-background-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border-light px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-bold text-text-primary">
                  Terms & Conditions
                </h2>

                <p className="mt-1 text-xs text-text-secondary">
                  GoldenPR Water Delivery Service
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-background-accent hover:text-text-primary"
                aria-label="Close Terms & Conditions"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto px-5 py-5 sm:px-6">
              <div className="flex flex-col gap-5 text-sm leading-6 text-text-secondary">

                <section>
                  <h3 className="font-bold text-text-primary">
                    1. Acceptance of Terms
                  </h3>

                  <p className="mt-1.5">
                    By using the GoldenPR water delivery service,
                    you agree to comply with these Terms &
                    Conditions. If you do not agree with these
                    terms, please do not use the service.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-text-primary">
                    2. Account Information
                  </h3>

                  <p className="mt-1.5">
                    Customers are responsible for providing
                    accurate and updated account information,
                    including their name, contact number, and
                    delivery address.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-text-primary">
                    3. Orders and Delivery
                  </h3>

                  <p className="mt-1.5">
                    Customers are responsible for reviewing
                    their order details before confirming an
                    order. Delivery schedules may vary depending
                    on availability, location, and operational
                    conditions.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-text-primary">
                    4. Payments
                  </h3>

                  <p className="mt-1.5">
                    Customers are responsible for paying the
                    applicable amount for their confirmed orders.
                    Prices and delivery charges may be updated
                    when necessary.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-text-primary">
                    5. Cancellations
                  </h3>

                  <p className="mt-1.5">
                    Customers may cancel orders subject to the
                    applicable order status and GoldenPR's
                    cancellation procedures.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-text-primary">
                    6. Customer Responsibilities
                  </h3>

                  <p className="mt-1.5">
                    Customers agree to use the GoldenPR system
                    responsibly and provide information that is
                    truthful and accurate. Customers should also
                    keep their account credentials secure.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-text-primary">
                    7. Privacy
                  </h3>

                  <p className="mt-1.5">
                    GoldenPR handles customer information in
                    accordance with its Privacy Notice and
                    applicable Philippine data privacy laws.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-text-primary">
                    8. Changes to These Terms
                  </h3>

                  <p className="mt-1.5">
                    GoldenPR may update these Terms & Conditions
                    when necessary. Updated terms will be made
                    available to customers through the system.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-text-primary">
                    9. Contact
                  </h3>

                  <p className="mt-1.5">
                    If you have questions about these Terms &
                    Conditions, you may contact GoldenPR through
                    the Contact Support section of your account.
                  </p>
                </section>

              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-border-light px-5 py-4 sm:px-6">
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="flex h-10 w-full items-center justify-center rounded-lg bg-primary-background px-4 text-xs font-bold uppercase tracking-[0.5px] text-white transition-colors hover:opacity-90"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default Profile;