import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  Save,
  User,
  X,
} from "lucide-react";

import Header from "../../components/Header/Header";
import AdminSidebar from "../../components/admin/AdminSidebar";

import snazzyImage from "../../assets/images/snazzy-image.png";

const DEFAULT_PROFILE = {
  name: "Admin User",
  contact: "0917-000-0000",
  email: "admin@goldenpr.com",
  address: "GoldenPR Water Refilling Station",
  role: "Admin",
  status: "Active",
};

function getCurrentUser() {
  const possibleKeys = [
    "currentUser",
    "authenticatedUser",
    "loggedInUser",
    "user",
  ];

  for (const key of possibleKeys) {
    const savedUser = localStorage.getItem(key);

    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);

        if (parsedUser && typeof parsedUser === "object") {
          return parsedUser;
        }
      } catch {
        // Ignore invalid user data.
      }
    }
  }

  return DEFAULT_PROFILE;
}

function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [formData, setFormData] = useState(DEFAULT_PROFILE);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();

    const loadedProfile = {
      ...DEFAULT_PROFILE,
      ...currentUser,
      status:
        currentUser.status === "Offline"
          ? "Offline"
          : "Active",
    };

    setProfile(loadedProfile);
    setFormData(loadedProfile);
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSave = (event) => {
    event.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.contact.trim() ||
      !formData.email.trim() ||
      !formData.address.trim()
    ) {
      return;
    }

    const updatedUser = {
      ...profile,
      ...formData,
      status:
        formData.status === "Offline"
          ? "Offline"
          : "Active",
    };

    const possibleKeys = [
      "currentUser",
      "authenticatedUser",
      "loggedInUser",
      "user",
    ];

    let savedExistingUser = false;

    for (const key of possibleKeys) {
      if (localStorage.getItem(key)) {
        localStorage.setItem(
          key,
          JSON.stringify(updatedUser),
        );

        savedExistingUser = true;
        break;
      }
    }

    if (!savedExistingUser) {
      localStorage.setItem(
        "currentUser",
        JSON.stringify(updatedUser),
      );
    }

    setProfile(updatedUser);
    setFormData(updatedUser);

    window.dispatchEvent(
      new Event("profileUpdated"),
    );

    window.dispatchEvent(
      new Event("userUpdated"),
    );

    setShowSuccess(true);

    // Redirect after 3 seconds.
    setTimeout(() => {
      navigate("/admin/dashboard");
    }, 3000);
  };

  const handleCancel = () => {
    setFormData(profile);
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background-main">
      <Header />

      <div className="flex min-h-[calc(100vh-64px)]">
        <AdminSidebar />

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1100px] px-4 py-5 sm:px-6 sm:py-7 lg:px-8">

            {/* Page Header */}
            <div className="mb-5 flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex h-9 w-9 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-background-accent hover:text-text-primary"
                aria-label="Go back"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>

              <h1 className="text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
                Profile
              </h1>
            </div>

            {/* Profile Header Card */}
            <section className="mb-5 flex flex-col items-center rounded-lg border border-border-light bg-background-card px-4 py-7 shadow-sm sm:px-6">
              <div className="relative mb-3">
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-background-lightBlue text-primary-background sm:h-24 sm:w-24">
                  <User className="h-9 w-9 sm:h-11 sm:w-11" />
                </div>

                <div className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-background-card bg-primary-background text-white">
                  <User className="h-3.5 w-3.5" />
                </div>
              </div>

              <h2 className="text-base font-bold text-text-primary sm:text-lg">
                {formData.name}
              </h2>

              <p className="mt-0.5 text-xs text-text-secondary">
                {formData.role || "Admin"}
              </p>
            </section>

            <form onSubmit={handleSave}>
              <div className="rounded-lg border border-border-light bg-background-card p-4 shadow-sm sm:p-6">

                {/* Personal Details */}
                <section>
                  <div className="mb-4 border-b border-border-light pb-2">
                    <h2 className="text-[10px] font-bold uppercase tracking-[0.8px] text-text-accent sm:text-xs">
                      Personal Details
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

                    {/* Full Name */}
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="name"
                        className="text-[10px] font-bold uppercase tracking-[0.4px] text-text-secondary sm:text-xs"
                      >
                        Full Name
                      </label>

                      <div className="relative">
                        <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />

                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleChange}
                          className="h-11 w-full rounded border border-border-secondary bg-background-main pl-10 pr-3 text-sm text-text-primary outline-none transition-colors focus:border-primary-background focus:ring-1 focus:ring-primary-background"
                        />
                      </div>
                    </div>

                    {/* Contact Number */}
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="contact"
                        className="text-[10px] font-bold uppercase tracking-[0.4px] text-text-secondary sm:text-xs"
                      >
                        Contact Number
                      </label>

                      <div className="relative">
                        <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />

                        <input
                          id="contact"
                          name="contact"
                          type="text"
                          value={formData.contact}
                          onChange={handleChange}
                          className="h-11 w-full rounded border border-border-secondary bg-background-main pl-10 pr-3 text-sm text-text-primary outline-none transition-colors focus:border-primary-background focus:ring-1 focus:ring-primary-background"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-1.5 lg:col-span-2">
                      <label
                        htmlFor="email"
                        className="text-[10px] font-bold uppercase tracking-[0.4px] text-text-secondary sm:text-xs"
                      >
                        Email Address
                      </label>

                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />

                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="h-11 w-full rounded border border-border-secondary bg-background-main pl-10 pr-3 text-sm text-text-primary outline-none transition-colors focus:border-primary-background focus:ring-1 focus:ring-primary-background"
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Delivery Location */}
                <section className="mt-7">
                  <div className="mb-4 border-b border-border-light pb-2">
                    <h2 className="text-[10px] font-bold uppercase tracking-[0.8px] text-text-accent sm:text-xs">
                      Delivery Location
                    </h2>
                  </div>

                  {/* Street Address */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="address"
                      className="text-[10px] font-bold uppercase tracking-[0.4px] text-text-secondary sm:text-xs"
                    >
                      Street Address
                    </label>

                    <div className="relative">
                      <MapPin className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-text-secondary" />

                      <textarea
                        id="address"
                        name="address"
                        rows={3}
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full resize-none rounded border border-border-secondary bg-background-main py-3 pl-10 pr-3 text-sm text-text-primary outline-none transition-colors focus:border-primary-background focus:ring-1 focus:ring-primary-background"
                      />
                    </div>
                  </div>

                  {/* Location Picture */}
                  <div className="relative mt-4 h-44 w-full overflow-hidden rounded border border-border-light bg-background-lightBlue">
                    <img
                      src={snazzyImage}
                      alt="Registered delivery location"
                      className="h-full w-full object-cover"
                    />

                    {/* Registered Location Marker */}
                    <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-background text-white shadow-md">
                        <MapPin className="h-5 w-5" />
                      </div>

                      <div className="mt-1 rounded bg-background-card px-2 py-1 text-[9px] font-bold text-text-primary shadow-sm">
                        Registered Location
                      </div>
                    </div>

                    {/* Verified Status */}
                    <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded bg-background-card px-2 py-1 text-[9px] font-bold text-text-accent shadow-sm">
                      <CheckCircle2 className="h-3 w-3" />
                      Verified
                    </div>
                  </div>
                </section>

                {/* Account Status */}
                <section className="mt-7">
                  <div className="mb-4 border-b border-border-light pb-2">
                    <h2 className="text-[10px] font-bold uppercase tracking-[0.8px] text-text-accent sm:text-xs">
                      Account Status
                    </h2>
                  </div>

                  <div className="flex flex-col gap-2">

                    {/* Active */}
                    <label
                      className={`flex cursor-pointer items-center justify-between rounded border p-3 transition-colors ${
                        formData.status === "Active"
                          ? "border-primary-background bg-background-lightBlue"
                          : "border-border-light bg-background-main"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="status"
                          value="Active"
                          checked={
                            formData.status ===
                            "Active"
                          }
                          onChange={handleChange}
                          className="h-4 w-4 accent-[#006994]"
                        />

                        <div>
                          <p className="text-sm font-semibold text-text-primary">
                            Active
                          </p>

                          <p className="text-xs text-text-secondary">
                            Full platform access
                          </p>
                        </div>
                      </div>

                      {formData.status === "Active" && (
                        <span className="rounded bg-background-accent px-2 py-1 text-[9px] font-bold uppercase tracking-[0.5px] text-text-accent">
                          Current
                        </span>
                      )}
                    </label>

                    {/* Offline */}
                    <label
                      className={`flex cursor-pointer items-center justify-between rounded border p-3 transition-colors ${
                        formData.status === "Offline"
                          ? "border-border-secondary bg-background-accent"
                          : "border-border-light bg-background-main"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="status"
                          value="Offline"
                          checked={
                            formData.status ===
                            "Offline"
                          }
                          onChange={handleChange}
                          className="h-4 w-4 accent-[#006994]"
                        />

                        <div>
                          <p className="text-sm font-semibold text-text-primary">
                            Offline
                          </p>

                          <p className="text-xs text-text-secondary">
                            Restricted access
                          </p>
                        </div>
                      </div>

                      {formData.status === "Offline" && (
                        <span className="rounded bg-background-accent px-2 py-1 text-[9px] font-bold uppercase tracking-[0.5px] text-text-secondary">
                          Current
                        </span>
                      )}
                    </label>
                  </div>
                </section>

                {/* Action Buttons */}
                <div className="mt-7 flex items-center justify-between border-t border-border-light pt-5">

                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex min-h-10 items-center justify-center gap-2 rounded-full border border-primary-background bg-transparent px-5 text-[11px] font-bold uppercase tracking-[0.5px] text-primary-background transition-colors hover:bg-background-lightBlue"
                  >
                    <X className="h-4 w-4" />
                    CANCEL
                  </button>

                  <button
                    type="submit"
                    className="flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary-background px-7 text-[11px] font-bold uppercase tracking-[0.5px] text-white shadow-sm transition-colors hover:opacity-90"
                  >
                    <Save className="h-4 w-4" />
                    SAVE CHANGES
                  </button>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>

      {/* Save Confirmation Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 backdrop-blur-[2px]">
          <div className="w-full max-w-[460px] overflow-hidden rounded-2xl border border-border-light bg-background-card shadow-2xl">

            {/* Success Content */}
            <div className="px-7 pb-6 pt-8 text-center sm:px-9 sm:pt-9">

              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-background-lightBlue">
                <CheckCircle2 className="h-9 w-9 text-primary-background" />
              </div>

              <h2 className="text-xl font-bold text-text-primary sm:text-2xl">
                Changes Saved Successfully
              </h2>

              <p className="mx-auto mt-3 max-w-[350px] text-sm leading-6 text-text-secondary">
                Your profile information has been updated successfully.
              </p>

              <p className="mt-1 text-xs text-text-secondary">
                Redirecting you to the dashboard...
              </p>
            </div>

            {/* Progress Section */}
            <div className="border-t border-border-light bg-background-main px-7 py-4 sm:px-9">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.5px] text-text-secondary">
                  Please wait
                </span>

                <span className="text-[10px] font-bold text-text-accent">
                  3 seconds
                </span>
              </div>

              <div className="h-1.5 w-full overflow-hidden rounded-full bg-background-accent">
                <div className="h-full w-full origin-left animate-[shrink_3s_linear_forwards] rounded-full bg-primary-background" />
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;