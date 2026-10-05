import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChevronRight,
  Edit3,
  LockKeyhole,
  LogOut,
  Mail,
  MapPin,
  Phone,
  User,
  X,
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
  const [showLogoutModal, setShowLogoutModal] = useState(false);

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

  const handleLogout = () => {
    const possibleKeys = [
      "currentUser",
      "authenticatedUser",
      "loggedInUser",
      "user",
    ];

    possibleKeys.forEach((key) => {
      localStorage.removeItem(key);
    });

    navigate("/login");
  };

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    handleLogout();
  };

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
                          ? "bg-background-lightBlue text-text-accent"
                          : "bg-background-accent text-text-secondary"
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

                  {/* Log Out */}
                  <button
                    type="button"
                    onClick={() => setShowLogoutModal(true)}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-3 text-[11px] font-bold uppercase tracking-[0.5px] text-red-600 transition-colors duration-200 hover:border-red-300 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    LOG OUT
                  </button>
                </div>
              </section>
            </div>
          </main>

          <AdminFooter />
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/25 px-4"
          onClick={() => setShowLogoutModal(false)}
        >
          <div
            className="w-full max-w-[420px] overflow-hidden rounded-xl border border-red-200 bg-background-card shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex justify-end px-6 pt-5 sm:px-8">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-background-main hover:text-text-primary"
                aria-label="Close logout modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-7 pb-7 pt-2 text-center sm:px-8">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
                <LogOut className="h-7 w-7" />
              </div>

              <h2 className="mt-5 text-lg font-bold text-text-primary">
                Log Out?
              </h2>

              <p className="mx-auto mt-2 max-w-[300px] text-sm leading-5 text-text-secondary">
                Are you sure you want to log out of your administrator account?
              </p>
            </div>

            <div className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:px-8">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="min-h-10 flex-1 rounded-full border border-border-light bg-background-card px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.5px] text-text-secondary transition-colors hover:bg-background-main hover:text-text-primary"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleLogoutConfirm}
                className="min-h-10 flex-1 rounded-full bg-red-600 px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.5px] text-white transition-colors hover:bg-red-700"
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