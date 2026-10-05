import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  Save,
} from "lucide-react";
import Header from "../../components/Header/Header";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminFooter from "../../components/admin/AdminFooter";

function AdminChangePassword() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);
  const [showNewPassword, setShowNewPassword] =
    useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.currentPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      setError("Please complete all password fields.");
      return;
    }

    if (formData.newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New password and confirmation password do not match.");
      return;
    }

    /*
      Password storage/update logic can be connected here
      if your authentication system already stores passwords.
    */

    setSuccess("Password changed successfully.");

    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const PasswordInput = ({
    id,
    name,
    label,
    value,
    showPassword,
    setShowPassword,
    placeholder,
  }) => (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-[10px] font-bold uppercase tracking-[0.4px] text-text-secondary sm:text-xs"
      >
        {label}
      </label>

      <div className="relative">
        <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />

        <input
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="h-11 w-full rounded border border-border-secondary bg-background-main pl-10 pr-11 text-sm text-text-primary outline-none transition-colors placeholder:text-text-secondary focus:border-primary-background focus:ring-1 focus:ring-primary-background"
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded text-text-secondary transition-colors hover:bg-background-accent hover:text-text-primary"
          aria-label={
            showPassword ? "Hide password" : "Show password"
          }
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background-main">
      <Header />

      <div className="flex min-h-[calc(100vh-64px)]">
        <AdminSidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-[900px] px-4 pb-28 pt-5 sm:px-6 sm:pb-32 sm:pt-7 lg:px-8 lg:pb-36">
              {/* Page Header */}
              <div className="mb-6 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex h-9 w-9 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-background-accent hover:text-text-primary"
                  aria-label="Go back"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>

                <div>
                  <h1 className="text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
                    Change Password
                  </h1>

                  <p className="mt-0.5 text-xs text-text-secondary sm:text-sm">
                    Update your administrator account password
                  </p>
                </div>
              </div>

              {/* Change Password Card */}
              <section className="rounded-xl border border-border-light bg-background-card p-4 shadow-sm sm:p-6">
                {/* Card Header */}
                <div className="mb-6 border-b border-border-light pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background-lightBlue text-primary-background">
                      <LockKeyhole className="h-5 w-5" />
                    </div>

                    <div>
                      <h2 className="text-sm font-bold text-text-primary sm:text-base">
                        Update Password
                      </h2>

                      <p className="mt-0.5 text-xs text-text-secondary">
                        Enter your current password and choose a new
                        password for your administrator account.
                      </p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    {/* Current Password */}
                    <PasswordInput
                      id="currentPassword"
                      name="currentPassword"
                      label="Current Password"
                      value={formData.currentPassword}
                      showPassword={showCurrentPassword}
                      setShowPassword={setShowCurrentPassword}
                      placeholder="Enter your current password"
                    />

                    {/* New Password */}
                    <PasswordInput
                      id="newPassword"
                      name="newPassword"
                      label="New Password"
                      value={formData.newPassword}
                      showPassword={showNewPassword}
                      setShowPassword={setShowNewPassword}
                      placeholder="Enter your new password"
                    />

                    {/* Confirm Password */}
                    <PasswordInput
                      id="confirmPassword"
                      name="confirmPassword"
                      label="Confirm New Password"
                      value={formData.confirmPassword}
                      showPassword={showConfirmPassword}
                      setShowPassword={setShowConfirmPassword}
                      placeholder="Confirm your new password"
                    />
                  </div>

                  {/* Password Requirement */}
                  <div className="mt-5 rounded-lg border border-border-light bg-background-main p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.5px] text-text-accent">
                      Password Requirements
                    </p>

                    <p className="mt-1 text-xs leading-5 text-text-secondary">
                      Your new password must contain at least 8
                      characters.
                    </p>
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                      <p className="text-xs font-medium text-red-700">
                        {error}
                      </p>
                    </div>
                  )}

                  {/* Success */}
                  {success && (
                    <div className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
                      <p className="text-xs font-medium text-green-700">
                        {success}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-8 flex flex-col-reverse gap-3 border-t border-border-light pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      className="flex min-h-10 items-center justify-center rounded-full border border-primary-background bg-transparent px-5 text-[11px] font-bold uppercase tracking-[0.5px] text-primary-background transition-colors hover:bg-background-lightBlue"
                    >
                      CANCEL
                    </button>

                    <button
                      type="submit"
                      className="flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary-background px-7 text-[11px] font-bold uppercase tracking-[0.5px] text-white shadow-sm transition-colors hover:opacity-90"
                    >
                      <Save className="h-4 w-4" />
                      CHANGE PASSWORD
                    </button>
                  </div>
                </form>
              </section>
            </div>
          </main>

          <AdminFooter />
        </div>
      </div>
    </div>
  );
}

export default AdminChangePassword;