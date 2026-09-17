import React, {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import Header from "../../components/Header/Header";

import CustomerNavbar from "../../components/customer/CustomerNavbar";

import {
  getProfile,
} from "../../utils/profileStorage";

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

function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] =
    useState(() => getProfile());

  const [showLogoutModal, setShowLogoutModal] =
    useState(false);

  /*
   * Always reload the latest saved profile.
   */
  useEffect(() => {
    const loadProfile = () => {
      setProfile(getProfile());
    };

    loadProfile();

    /*
     * Same-tab profile updates.
     */
    window.addEventListener(
      "profileUpdated",
      loadProfile,
    );

    /*
     * Cross-tab localStorage updates.
     */
    window.addEventListener(
      "storage",
      loadProfile,
    );

    /*
     * Extra protection so the page stays
     * synchronized if profile data changes
     * elsewhere in the app.
     */
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

  /*
   * Convert the saved address into lines.
   */
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
                  {addressLines.map(
                    (line, index) => (
                      <React.Fragment
                        key={index}
                      >
                        {line}

                        {index <
                          addressLines.length -
                            1 && (
                          <br />
                        )}
                      </React.Fragment>
                    ),
                  )}
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
                navigate(
                  "/customer/edit-profile",
                )
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
                navigate(
                  "/customer/change-password",
                )
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-[380px] rounded-xl bg-background-card p-5 shadow-2xl">

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
    </div>
  );
}

export default Profile;