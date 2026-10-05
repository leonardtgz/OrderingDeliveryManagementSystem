import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  MapPin,
  Plus,
  Pencil,
  ChevronRight,
  UserRound,
  CircleHelp,
  MessageCircle,
  AlertTriangle,
  X,
  MapPinned,
  Phone,
  CheckCircle2,
} from "lucide-react";

import Header from "../../components/Header/Header";
import CustomerNavbar from "../../components/customer/CustomerNavbar";
import CustomerFooter from "../../components/customer/CustomerFooter";
import { getProfile, formatAddress } from "../../utils/profileStorage";

function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(() => getProfile());
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  useEffect(() => {
    const loadProfile = () => {
      setProfile(getProfile());
    };

    loadProfile();

    window.addEventListener("profileUpdated", loadProfile);
    window.addEventListener("storage", loadProfile);

    return () => {
      window.removeEventListener("profileUpdated", loadProfile);
      window.removeEventListener("storage", loadProfile);
    };
  }, []);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setShowLogoutModal(false);
        setShowTermsModal(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
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

  const savedAddresses = Array.isArray(profile.addresses)
    ? profile.addresses
    : [];

  const editAddress = (addressId) => {
    const query = addressId
      ? `?addressId=${encodeURIComponent(addressId)}`
      : "";

    navigate(`/customer/edit-profile${query}`);
  };

  const getAddressText = (address) => {
    const formatted = formatAddress(address);
    return formatted || "No address details provided.";
  };

  return (
    <div className="flex min-h-screen flex-col bg-background-main">
      <div className="w-full shrink-0">
        <Header />
      </div>

      <main className="flex-1 overflow-y-auto bg-background-main pb-[120px]">
        <div className="mx-auto flex w-full max-w-[700px] flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
          {/* Page Header */}
          <div>
            <h1 className="text-2xl font-bold leading-tight tracking-tight text-text-accent sm:text-[28px]">
              Profile
            </h1>
            <p className="mt-1 text-sm leading-5 text-text-secondary">
              Manage your account information and preferences.
            </p>
          </div>

          {/* Profile Card */}
          <section className="overflow-hidden rounded-xl border border-border-light bg-background-card shadow-sm">
            <div className="flex flex-col items-center gap-3 border-b border-border-light bg-background-accent px-5 py-6 sm:flex-row sm:px-6">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-secondary-light">
                <UserRound
                  size={42}
                  strokeWidth={1.5}
                  className="text-text-accent"
                />
              </div>

              <div className="text-center sm:text-left">
                <p className="text-xs font-bold uppercase tracking-[0.6px] text-text-secondary">
                  Customer
                </p>

                <h2 className="mt-1 text-xl font-bold text-text-primary">
                  {profile.fullName || "Customer"}
                </h2>

                <div className="mt-1 flex items-center justify-center gap-1.5 text-sm text-text-secondary sm:justify-start">
                  <Phone size={14} />
                  <span>
                    {profile.phoneNumber || "No contact number added"}
                  </span>
                </div>

                {/* Account Status */}
                <span
                  className={`mt-3 inline-flex rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-[0.5px] ${
                    profile.status === "Active"
                      ? "bg-background-lightBlue text-text-accent"
                      : "bg-background-accent text-text-secondary"
                  }`}
                >
                  {profile.status === "Offline" ? "Offline" : "Active"}
                </span>
              </div>
            </div>

            {/* Personal Information */}
            <div className="flex flex-col">
              <div className="border-b border-border-light px-5 py-4 sm:px-6">
                <span className="text-[10px] font-bold uppercase tracking-[0.6px] text-text-secondary">
                  Name
                </span>
                <p className="mt-1 text-sm font-semibold text-text-primary">
                  {profile.fullName || "Not provided"}
                </p>
              </div>

              <div className="border-b border-border-light px-5 py-4 sm:px-6">
                <span className="text-[10px] font-bold uppercase tracking-[0.6px] text-text-secondary">
                  Contact Number
                </span>
                <p className="mt-1 text-sm font-semibold text-text-primary">
                  {profile.phoneNumber || "Not provided"}
                </p>
              </div>

              {/* Improved Saved Addresses */}
              <div className="px-5 py-5 sm:px-6 sm:py-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-text-primary">
                      Saved Addresses
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-text-secondary">
                      Manage the locations where you receive deliveries.
                    </p>
                  </div>

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background-accent text-text-accent">
                    <MapPinned size={20} />
                  </div>
                </div>

                {savedAddresses.length > 0 ? (
                  <div className="mt-4 flex flex-col gap-3">
                    {savedAddresses.map((address, index) => {
                      const isDefault =
                        address.isDefault === true ||
                        address.isDefault === "true" ||
                        (address.isDefault == null && index === 0);

                      return (
                        <div
                          key={address.id ?? `address-${index}`}
                          className={`rounded-xl border p-4 transition-colors ${
                            isDefault
                              ? "border-primary-background/40 bg-background-accent"
                              : "border-border-light bg-background-card hover:bg-background-main"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                                isDefault
                                  ? "bg-primary-background text-white"
                                  : "bg-background-accent text-text-accent"
                              }`}
                            >
                              <MapPin size={20} />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className="break-words text-sm font-bold text-text-primary">
                                  {address.label || "Saved Address"}
                                </h4>

                                {isDefault && (
                                  <span className="inline-flex items-center gap-1 rounded-full border border-primary-background/20 bg-background-card px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-text-accent">
                                    <CheckCircle2 size={12} />
                                    Default
                                  </span>
                                )}
                              </div>

                              <p className="mt-2 whitespace-pre-line break-words text-sm leading-6 text-text-secondary">
                                {getAddressText(address)}
                              </p>

                              {address.recipientName && (
                                <p className="mt-2 text-xs text-text-secondary">
                                  Recipient: {address.recipientName}
                                </p>
                              )}

                              {address.phoneNumber && (
                                <p className="mt-1 text-xs text-text-secondary">
                                  Contact: {address.phoneNumber}
                                </p>
                              )}

                              <button
                                type="button"
                                onClick={() => editAddress(address.id)}
                                className="mt-3 inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-border-light bg-background-card px-3 py-2 text-xs font-bold text-text-accent transition-colors hover:border-primary-background hover:bg-background-main"
                              >
                                <Pencil size={14} />
                                Edit Address
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : profile.address ? (
                  <div className="mt-4 rounded-xl border border-border-light bg-background-accent p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-background-card text-text-accent">
                        <MapPin size={20} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-bold text-text-primary">
                          Delivery Address
                        </h4>

                        <p className="mt-2 whitespace-pre-line break-words text-sm leading-6 text-text-secondary">
                          {profile.address}
                        </p>

                        <button
                          type="button"
                          onClick={() => editAddress()}
                          className="mt-3 inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-border-light bg-background-card px-3 py-2 text-xs font-bold text-text-accent transition-colors hover:bg-background-main"
                        >
                          <Pencil size={14} />
                          Edit Address
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 rounded-xl border border-dashed border-border-light bg-background-main px-4 py-6 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-background-accent text-text-accent">
                      <MapPin size={22} />
                    </div>

                    <h4 className="mt-3 text-sm font-bold text-text-primary">
                      No saved addresses yet
                    </h4>

                    <p className="mx-auto mt-1 max-w-[280px] text-xs leading-5 text-text-secondary">
                      Add your delivery address to make placing your next
                      order easier.
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() =>
                    navigate("/customer/edit-profile?addAddress=1")
                  }
                  className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary-background px-4 py-3 text-xs font-bold uppercase tracking-[0.5px] text-white transition-colors hover:opacity-90"
                >
                  <Plus size={17} />
                  Add New Address
                </button>
              </div>
            </div>
          </section>

          {/* Account Settings */}
          <section className="overflow-hidden rounded-xl border border-border-light bg-background-card shadow-sm">
            <div className="border-b border-border-light px-5 py-3 sm:px-6">
              <h2 className="text-xs font-bold uppercase tracking-[0.6px] text-text-accent">
                Account Settings
              </h2>
            </div>

            <button
              type="button"
              onClick={() => navigate("/customer/edit-profile")}
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

              <ChevronRight
                size={18}
                className="shrink-0 text-text-secondary"
              />
            </button>

            <button
              type="button"
              onClick={() => navigate("/customer/change-password")}
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

              <ChevronRight
                size={18}
                className="shrink-0 text-text-secondary"
              />
            </button>
          </section>

          {/* Help & Support */}
          <section className="overflow-hidden rounded-xl border border-border-light bg-background-card shadow-sm">
            <div className="border-b border-border-light px-5 py-3 sm:px-6">
              <h2 className="text-xs font-bold uppercase tracking-[0.6px] text-text-accent">
                Help &amp; Support
              </h2>
            </div>

            <button
              type="button"
              onClick={() => navigate("/customer/faqs")}
              className="flex w-full items-center gap-3 border-b border-border-light px-5 py-4 text-left transition-colors hover:bg-background-accent sm:px-6"
            >
              <CircleHelp
                size={22}
                className="shrink-0 text-text-accent"
              />

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-text-primary">
                  FAQs
                </p>
                <p className="mt-1 text-xs text-text-secondary">
                  Find answers to frequently asked questions
                </p>
              </div>

              <ChevronRight
                size={18}
                className="shrink-0 text-text-secondary"
              />
            </button>

            <button
              type="button"
              onClick={() => navigate("/customer/contact-support")}
              className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-background-accent sm:px-6"
            >
              <MessageCircle
                size={22}
                className="shrink-0 text-text-accent"
              />

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-text-primary">
                  Contact Support
                </p>
                <p className="mt-1 text-xs text-text-secondary">
                  Get help with your account or orders
                </p>
              </div>

              <ChevronRight
                size={18}
                className="shrink-0 text-text-secondary"
              />
            </button>
          </section>

          {/* Legal */}
          <section className="overflow-hidden rounded-xl border border-border-light bg-background-card shadow-sm">
            <div className="border-b border-border-light px-5 py-3 sm:px-6">
              <h2 className="text-xs font-bold uppercase tracking-[0.6px] text-text-accent">
                Legal
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setShowTermsModal(true)}
              className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-background-accent sm:px-6"
            >
              <div>
                <p className="text-sm font-semibold text-text-primary">
                  Terms &amp; Conditions
                </p>
                <p className="mt-1 text-xs text-text-secondary">
                  Review the terms and conditions for using GoldenPR
                </p>
              </div>

              <ChevronRight
                size={18}
                className="shrink-0 text-text-secondary"
              />
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
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
            className="w-full max-w-[380px] rounded-xl bg-background-card p-5 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                <AlertTriangle size={32} className="text-red-500" />
              </div>
            </div>

            <div className="mt-4 text-center">
              <h2
                id="logout-title"
                className="text-lg font-bold text-text-primary"
              >
                Log Out?
              </h2>

              <p className="mt-1.5 text-sm leading-5 text-text-secondary">
                Are you sure you want to log out of your account?
              </p>
            </div>

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
            role="dialog"
            aria-modal="true"
            aria-labelledby="terms-title"
            className="flex max-h-[85vh] w-full max-w-[650px] flex-col rounded-xl bg-background-card shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border-light px-5 py-4 sm:px-6">
              <div>
                <h2
                  id="terms-title"
                  className="text-lg font-bold text-text-primary"
                >
                  Terms &amp; Conditions
                </h2>

                <p className="mt-1 text-xs text-text-secondary">
                  GoldenPR Water Delivery Service
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-background-accent hover:text-text-primary"
                aria-label="Close Terms & Conditions"
              >
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto px-5 py-5 sm:px-6">
              <div className="flex flex-col gap-5 text-sm leading-6 text-text-secondary">
                <section>
                  <h3 className="font-bold text-text-primary">
                    1. Acceptance of Terms
                  </h3>
                  <p className="mt-1.5">
                    By using the GoldenPR water delivery service, you agree
                    to comply with these Terms &amp; Conditions. If you do
                    not agree with these terms, please do not use the service.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-text-primary">
                    2. Account Information
                  </h3>
                  <p className="mt-1.5">
                    Customers are responsible for providing accurate and
                    updated account information, including their name,
                    contact number, and delivery address.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-text-primary">
                    3. Orders and Delivery
                  </h3>
                  <p className="mt-1.5">
                    Customers are responsible for reviewing their order
                    details before confirming an order. Delivery schedules
                    may vary depending on availability, location, and
                    operational conditions.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-text-primary">
                    4. Payments
                  </h3>
                  <p className="mt-1.5">
                    Customers are responsible for paying the applicable
                    amount for their confirmed orders. Prices and delivery
                    charges may be updated when necessary.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-text-primary">
                    5. Cancellations
                  </h3>
                  <p className="mt-1.5">
                    Customers may cancel orders subject to the applicable
                    order status and GoldenPR&apos;s cancellation procedures.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-text-primary">
                    6. Customer Responsibilities
                  </h3>
                  <p className="mt-1.5">
                    Customers agree to use the GoldenPR system responsibly
                    and provide information that is truthful and accurate.
                    Customers should also keep their account credentials
                    secure.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-text-primary">
                    7. Privacy
                  </h3>
                  <p className="mt-1.5">
                    GoldenPR handles customer information in accordance
                    with its Privacy Notice and applicable Philippine data
                    privacy laws.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-text-primary">
                    8. Changes to These Terms
                  </h3>
                  <p className="mt-1.5">
                    GoldenPR may update these Terms &amp; Conditions when
                    necessary. Updated terms will be made available to
                    customers through the system.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold text-text-primary">
                    9. Contact
                  </h3>
                  <p className="mt-1.5">
                    If you have questions about these Terms &amp; Conditions,
                    you may contact GoldenPR through the Contact Support
                    section of your account.
                  </p>
                </section>
              </div>
            </div>

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

      <CustomerFooter />
    </div>
  );
}

export default Profile;