import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../components/Header/Header";
import CustomerNavbar from "../../components/customer/CustomerNavbar";

import {
  getProfile,
  saveProfile,
} from "../../utils/profileStorage";

function SuccessIcon() {
  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-green-500"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M8 12L10.5 14.5L16 9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EditProfile() {
  const navigate = useNavigate();

  const profile = getProfile();

  const [fullName, setFullName] =
    useState(profile.fullName);

  const [phoneNumber, setPhoneNumber] =
    useState(profile.phoneNumber);

  const [address, setAddress] =
    useState(profile.address);

  const [showSuccessModal, setShowSuccessModal] =
    useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    const updatedProfile = {
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      address: address.trim(),
    };

    saveProfile(updatedProfile);

    setShowSuccessModal(true);
  };

  const handleContinue = () => {
    setShowSuccessModal(false);
    navigate("/customer/profile");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background-main">
      <div className="w-full shrink-0">
        <Header />
      </div>

      <main className="flex-1 overflow-y-auto bg-background-main pb-[120px]">
        <div className="mx-auto flex w-full max-w-[600px] flex-col px-4 py-6 sm:px-6 sm:py-8">

          {/* Page Header */}
          <div className="mb-5 flex flex-col gap-1">
            <h1 className="text-[24px] font-bold leading-[120%] tracking-[-0.02em] text-text-accent sm:text-[28px]">
              Edit Profile
            </h1>

            <p className="text-sm leading-[1.5] text-text-secondary">
              Update your personal information.
            </p>
          </div>

          {/* Form Card */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5 rounded-xl border border-border-primary bg-background-card p-5 shadow-card sm:p-6"
          >

            {/* Full Name */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="fullName"
                className="text-[10px] font-bold uppercase tracking-[0.6px] text-text-primary"
              >
                Full Name
              </label>

              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(event) =>
                  setFullName(
                    event.target.value,
                  )
                }
                className="h-11 w-full rounded-md border border-border-light bg-background-card px-3 text-sm text-text-primary outline-none transition focus:border-primary-background"
              />
            </div>

            {/* Phone Number */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="phoneNumber"
                className="text-[10px] font-bold uppercase tracking-[0.6px] text-text-primary"
              >
                Phone Number
              </label>

              <input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(event) =>
                  setPhoneNumber(
                    event.target.value,
                  )
                }
                className="h-11 w-full rounded-md border border-border-light bg-background-card px-3 text-sm text-text-primary outline-none transition focus:border-primary-background"
              />
            </div>

            {/* Address */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="address"
                className="text-[10px] font-bold uppercase tracking-[0.6px] text-text-primary"
              >
                Address
              </label>

              <textarea
                id="address"
                rows={4}
                value={address}
                onChange={(event) =>
                  setAddress(
                    event.target.value,
                  )
                }
                className="w-full resize-none rounded-md border border-border-light bg-background-card px-3 py-2 text-sm leading-5 text-text-primary outline-none transition focus:border-primary-background"
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3 pt-1 sm:flex-row">
              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/customer/profile",
                  )
                }
                className="flex min-h-11 flex-1 items-center justify-center rounded-lg border-2 border-primary-light bg-background-card px-4 text-xs font-bold uppercase tracking-[0.6px] text-primary-light transition-colors hover:bg-primary-light hover:text-primary-foreground"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex min-h-11 flex-1 items-center justify-center rounded-lg bg-primary-background px-4 text-xs font-bold uppercase tracking-[0.6px] text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </main>

      <CustomerNavbar />

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-[380px] rounded-xl bg-background-card p-5 shadow-2xl">

            <div className="flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
                <SuccessIcon />
              </div>
            </div>

            <div className="mt-4 text-center">
              <h2 className="text-lg font-bold text-text-primary">
                Profile Updated
              </h2>

              <p className="mt-1.5 text-sm leading-5 text-text-secondary">
                Your profile information has been saved successfully.
              </p>
            </div>

            <button
              type="button"
              onClick={handleContinue}
              className="mt-5 flex h-10 w-full items-center justify-center rounded-lg bg-primary-background px-4 text-xs font-bold uppercase tracking-[0.5px] text-primary-foreground transition-opacity hover:opacity-90"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditProfile;