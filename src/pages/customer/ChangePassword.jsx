import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../components/Header/Header";
import CustomerNavbar from "../../components/customer/CustomerNavbar";

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
      <circle cx="12" cy="16.5" r="0.8" fill="currentColor" />
    </svg>
  );
}

function Requirement({ valid, children }) {
  return (
    <p
      className={`text-xs ${
        valid ? "text-green-600" : "text-red-500"
      }`}
    >
      {valid ? "✓" : "•"} {children}
    </p>
  );
}

function ChangePassword() {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);

  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);

  const passwordIsValid =
    hasMinLength &&
    hasUppercase &&
    hasLowercase &&
    hasNumber &&
    hasSpecial;

  const passwordsMatch =
    confirmPassword.length > 0 &&
    newPassword === confirmPassword;

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword ||
      !passwordIsValid ||
      newPassword !== confirmPassword
    ) {
      setShowWarningModal(true);
      return;
    }

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
              Change Password
            </h1>

            <p className="text-sm leading-[1.5] text-text-secondary">
              Update your password to keep your account secure.
            </p>
          </div>

          {/* Form Card */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5 rounded-xl border border-border-primary bg-background-card p-5 shadow-card sm:p-6"
          >
            {/* Current Password */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="currentPassword"
                className="text-[10px] font-bold uppercase tracking-[0.6px] text-text-primary"
              >
                Current Password
              </label>

              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(event) =>
                  setCurrentPassword(event.target.value)
                }
                placeholder="Enter current password"
                className="h-11 w-full rounded-md border border-border-light bg-background-card px-3 text-sm text-text-primary outline-none placeholder:text-text-secondary transition focus:border-primary-background"
              />
            </div>

            {/* New Password */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="newPassword"
                className="text-[10px] font-bold uppercase tracking-[0.6px] text-text-primary"
              >
                New Password
              </label>

              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(event) =>
                  setNewPassword(event.target.value)
                }
                placeholder="Enter new password"
                className={`h-11 w-full rounded-md border bg-background-card px-3 text-sm text-text-primary outline-none placeholder:text-text-secondary transition ${
                  newPassword.length > 0
                    ? passwordIsValid
                      ? "border-green-500 focus:border-green-500"
                      : "border-red-400 focus:border-red-500"
                    : "border-border-light focus:border-primary-background"
                }`}
              />

              {/* Password Requirements */}
              {newPassword.length > 0 && (
                <div className="mt-1 flex flex-col gap-1">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.5px] text-text-secondary">
                    Password Requirements
                  </p>

                  <Requirement valid={hasMinLength}>
                    At least 8 characters
                  </Requirement>

                  <Requirement valid={hasUppercase}>
                    At least one uppercase letter
                  </Requirement>

                  <Requirement valid={hasLowercase}>
                    At least one lowercase letter
                  </Requirement>

                  <Requirement valid={hasNumber}>
                    At least one number
                  </Requirement>

                  <Requirement valid={hasSpecial}>
                    At least one special character
                  </Requirement>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="confirmPassword"
                className="text-[10px] font-bold uppercase tracking-[0.6px] text-text-primary"
              >
                Confirm New Password
              </label>

              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                placeholder="Confirm new password"
                className={`h-11 w-full rounded-md border bg-background-card px-3 text-sm text-text-primary outline-none placeholder:text-text-secondary transition ${
                  confirmPassword.length > 0
                    ? passwordsMatch
                      ? "border-green-500 focus:border-green-500"
                      : "border-red-400 focus:border-red-500"
                    : "border-border-light focus:border-primary-background"
                }`}
              />

              {/* Password Match Warning */}
              {confirmPassword.length > 0 && !passwordsMatch && (
                <p className="text-xs text-red-500">
                  Passwords do not match.
                </p>
              )}

              {passwordsMatch && (
                <p className="text-xs text-green-600">
                  ✓ Passwords match.
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3 pt-1 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate("/customer/profile")}
                className="flex min-h-11 flex-1 items-center justify-center rounded-lg border-2 border-primary-light bg-background-card px-4 text-xs font-bold uppercase tracking-[0.6px] text-primary-light transition-colors hover:bg-primary-light hover:text-primary-foreground"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex min-h-11 flex-1 items-center justify-center rounded-lg bg-primary-background px-4 text-xs font-bold uppercase tracking-[0.6px] text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      </main>

      <CustomerNavbar />

      {/* Warning Modal */}
      {showWarningModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-[380px] rounded-xl bg-background-card p-5 shadow-2xl">

            <div className="flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                <WarningIcon />
              </div>
            </div>

            <div className="mt-4 text-center">
              <h2 className="text-lg font-bold text-text-primary">
                Unable to Update Password
              </h2>

              <p className="mt-1.5 text-sm leading-5 text-text-secondary">
                Please make sure all password fields are filled in,
                your password meets all requirements, and the new
                password matches the confirmation.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowWarningModal(false)}
              className="mt-5 flex h-10 w-full items-center justify-center rounded-lg bg-primary-background px-4 text-xs font-bold uppercase tracking-[0.5px] text-primary-foreground transition-opacity hover:opacity-90"
            >
              Close
            </button>
          </div>
        </div>
      )}

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
                Password Changed
              </h2>

              <p className="mt-1.5 text-sm leading-5 text-text-secondary">
                Your password has been changed successfully.
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

export default ChangePassword;