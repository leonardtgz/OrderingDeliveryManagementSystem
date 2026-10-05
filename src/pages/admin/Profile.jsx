import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  ChevronRight,
  Edit3,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";

import Header from "../../components/Header/Header";

import AdminSidebar from "../../components/admin/AdminSidebar";

import AdminFooter from "../../components/admin/AdminFooter";

const DEFAULT_PROFILE = {
  name: "Admin User",
  contact: "0917-000-0000",
  email: "admin@goldenpr.com",
  role: "Admin",
  status: "Active",
  streetAddress: "GoldenPR Water Refilling Station",
  address: "GoldenPR Water Refilling Station",
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

  const loadProfile = () => {
    const currentUser = getCurrentUser();

    setProfile({
      ...DEFAULT_PROFILE,
      ...currentUser,
      name: currentUser.name || DEFAULT_PROFILE.name,
      contact:
        currentUser.contact ||
        currentUser.contactNumber ||
        DEFAULT_PROFILE.contact,
      email: currentUser.email || DEFAULT_PROFILE.email,
      role: currentUser.role || DEFAULT_PROFILE.role,
      status: currentUser.status || DEFAULT_PROFILE.status,
      streetAddress:
        currentUser.streetAddress ||
        currentUser.address ||
        DEFAULT_PROFILE.streetAddress,
      address:
        currentUser.address ||
        currentUser.streetAddress ||
        DEFAULT_PROFILE.address,
    });
  };

  useEffect(() => {
    loadProfile();

    const handleProfileUpdate = () => {
      loadProfile();
    };

    window.addEventListener("storage", handleProfileUpdate);
    window.addEventListener("profileUpdated", handleProfileUpdate);
    window.addEventListener("userUpdated", handleProfileUpdate);

    return () => {
      window.removeEventListener("storage", handleProfileUpdate);
      window.removeEventListener("profileUpdated", handleProfileUpdate);
      window.removeEventListener("userUpdated", handleProfileUpdate);
    };
  }, []);

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
                  className="flex h-9 w-9 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-background-lightBlue hover:text-primary-background"
                  aria-label="Go back"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>

                <div>
                  <h1 className="text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
                    Profile
                  </h1>

                  <p className="mt-0.5 text-xs text-text-secondary sm:text-sm">
                    Manage your administrator account information
                  </p>
                </div>
              </div>

              {/* Profile Information Card */}
              <section className="overflow-hidden rounded-xl border border-border-light bg-background-card shadow-sm">
                {/* Profile Banner */}
                <div className="h-24 bg-background-lightBlue sm:h-28" />

                {/* Profile Information */}
                <div className="-mt-10 px-5 pb-6 sm:-mt-12 sm:px-7">
                  <div className="flex flex-col items-center text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-background-card bg-background-lightBlue text-primary-background shadow-sm sm:h-24 sm:w-24">
                      <User className="h-9 w-9 sm:h-11 sm:w-11" />
                    </div>

                    <h2 className="mt-3 text-lg font-bold text-text-primary sm:text-xl">
                      {profile.name}
                    </h2>

                    <p className="mt-0.5 text-xs text-text-secondary">
                      {profile.role || "Admin"}
                    </p>

                    <span
                      className={`mt-3 rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-[0.5px] ${
                        profile.status === "Active"
                          ? "border border-green-200 bg-green-100 text-green-700"
                          : "border border-gray-200 bg-gray-100 text-gray-600"
                      }`}
                    >
                      {profile.status}
                    </span>
                  </div>

                  {/* Personal Information */}
                  <div className="mt-6 overflow-hidden rounded-lg border border-border-light">
                    <div className="border-b border-border-light bg-background-main px-4 py-3">
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.8px] text-text-accent sm:text-xs">
                        Personal Information
                      </h3>

                      <p className="mt-1 text-xs text-text-secondary">
                        Your administrator account information.
                      </p>
                    </div>

                    <div className="divide-y divide-border-light">
                      {/* Full Name */}
                      <div className="flex items-center gap-3 px-4 py-3.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background-lightBlue text-primary-background">
                          <User className="h-4 w-4" />
                        </div>

                        <div className="min-w-0">
                          <p className="text-[9px] font-bold uppercase tracking-[0.5px] text-text-secondary">
                            Full Name
                          </p>

                          <p className="mt-0.5 break-words text-sm font-semibold text-text-primary">
                            {profile.name}
                          </p>
                        </div>
                      </div>

                      {/* Contact Number */}
                      <div className="flex items-center gap-3 px-4 py-3.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background-lightBlue text-primary-background">
                          <Phone className="h-4 w-4" />
                        </div>

                        <div className="min-w-0">
                          <p className="text-[9px] font-bold uppercase tracking-[0.5px] text-text-secondary">
                            Contact Number
                          </p>

                          <p className="mt-0.5 break-words text-sm font-semibold text-text-primary">
                            {profile.contact}
                          </p>
                        </div>
                      </div>

                      {/* Email */}
                      <div className="flex items-center gap-3 px-4 py-3.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background-lightBlue text-primary-background">
                          <Mail className="h-4 w-4" />
                        </div>

                        <div className="min-w-0">
                          <p className="text-[9px] font-bold uppercase tracking-[0.5px] text-text-secondary">
                            Email Address
                          </p>

                          <p className="mt-0.5 break-words text-sm font-semibold text-text-primary">
                            {profile.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* GoldenPR Address */}
                  <div className="mt-5 overflow-hidden rounded-lg border border-border-light">
                    <div className="border-b border-border-light bg-background-main px-4 py-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary-background" />

                        <h3 className="text-[10px] font-bold uppercase tracking-[0.8px] text-text-accent sm:text-xs">
                          GoldenPR Address
                        </h3>
                      </div>

                      <p className="mt-1 text-xs text-text-secondary">
                        Registered address of the GoldenPR Water Refilling
                        Station.
                      </p>
                    </div>

                    <div className="flex items-start gap-3 px-4 py-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background-lightBlue text-primary-background">
                        <MapPin className="h-4 w-4" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[9px] font-bold uppercase tracking-[0.5px] text-text-secondary">
                          Address
                        </p>

                        <p className="mt-1 break-words text-sm font-semibold leading-5 text-text-primary">
                          {profile.address}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Account Settings */}
                  <div className="mt-5 overflow-hidden rounded-lg border border-border-light">
                    <div className="border-b border-border-light bg-background-main px-4 py-3">
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.8px] text-text-accent sm:text-xs">
                        Account Settings
                      </h3>

                      <p className="mt-1 text-xs text-text-secondary">
                        Manage your administrator account.
                      </p>
                    </div>

                    <div className="divide-y divide-border-light">
                      {/* Edit Profile */}
                      <button
                        type="button"
                        onClick={() => navigate("/admin/edit-profile")}
                        className="group flex w-full items-center justify-between px-4 py-4 text-left transition-colors duration-200 hover:bg-background-lightBlue"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background-lightBlue text-primary-background transition-colors duration-200 group-hover:bg-primary-background group-hover:text-white">
                            <Edit3 className="h-4 w-4" />
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-text-primary transition-colors duration-200 group-hover:text-primary-background">
                              Edit Profile
                            </p>

                            <p className="mt-0.5 text-xs text-text-secondary">
                              Update your personal information
                            </p>
                          </div>
                        </div>

                        <ChevronRight className="h-4 w-4 shrink-0 text-text-secondary transition-colors duration-200 group-hover:text-primary-background" />
                      </button>

                      {/* Change Password */}
                      <button
                        type="button"
                        onClick={() => navigate("/admin/change-password")}
                        className="group flex w-full items-center justify-between px-4 py-4 text-left transition-colors duration-200 hover:bg-background-lightBlue"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background-lightBlue text-primary-background transition-colors duration-200 group-hover:bg-primary-background group-hover:text-white">
                            <LockKeyhole className="h-4 w-4" />
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-text-primary transition-colors duration-200 group-hover:text-primary-background">
                              Change Password
                            </p>

                            <p className="mt-0.5 text-xs text-text-secondary">
                              Update your account password
                            </p>
                          </div>
                        </div>

                        <ChevronRight className="h-4 w-4 shrink-0 text-text-secondary transition-colors duration-200 group-hover:text-primary-background" />
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </main>

          <AdminFooter />
        </div>
      </div>
    </div>
  );
}

export default Profile;