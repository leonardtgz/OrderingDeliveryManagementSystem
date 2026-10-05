import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  MapPin,
  Phone,
  Save,
  User,
  X,
} from "lucide-react";
import Header from "../../components/Header/Header";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminFooter from "../../components/admin/AdminFooter";
import snazzyImage from "../../assets/images/snazzy-image.png";

const BULACAN_BARANGAYS = [
  "Caingin",
  "Capihan",
  "Coral na Bato",
  "Cruz na Daan",
  "Dagat-dagatan",
  "Diliman I",
  "Diliman II",
  "Lico",
  "Maasim",
  "Maguinao",
  "Maronquillo",
  "Pantubig",
  "Pasong Bangkal",
  "Pasong Callos",
  "Pasong Intsik",
  "Pinacpinacan",
  "Poblacion",
  "Pulong Bayabas",
  "Sampaloc",
  "San Agustin",
  "San Roque",
  "Talacsan",
  "Tambubong",
  "Tukod",
  "Ulingao",
];

const BULACAN_MUNICIPALITIES = [
  "San Rafael",
  "Angat",
  "Balagtas",
  "Baliwag",
  "Bocaue",
  "Bulakan",
  "Bustos",
  "Calumpit",
  "Doña Remedios Trinidad",
  "Guiguinto",
  "Hagonoy",
  "Malolos",
  "Marilao",
  "Meycauayan",
  "Norzagaray",
  "Obando",
  "Pandi",
  "Paombong",
  "Plaridel",
  "Pulilan",
  "San Ildefonso",
  "San Jose del Monte",
  "San Miguel",
  "Santa Maria",
];

const BARANGAYS_BY_MUNICIPALITY = {
  "San Rafael": BULACAN_BARANGAYS,
  Angat: ["Banaban", "Baybay", "Marungko", "Poblacion"],
  Balagtas: ["Borol 1st", "Borol 2nd", "Longos", "Poblacion"],
  Baliwag: ["Bagong Nayon", "Poblacion", "Sabang", "San Jose"],
  Bocaue: ["Batia", "Lolomboy", "Poblacion", "Taal"],
  Bulakan: ["Bagumbayan", "Matungao", "Poblacion", "San Nicolas"],
  Bustos: ["Bonga Menor", "Bonga Mayor", "Poblacion", "Tibagan"],
  Calumpit: ["Balite", "Gatbuca", "Poblacion", "San Jose"],
  "Doña Remedios Trinidad": [
    "Camachin",
    "Kabayo",
    "Poblacion",
    "Talbak",
  ],
  Guiguinto: ["Cutcut", "Ilang-Ilang", "Poblacion", "Tabe"],
  Hagonoy: ["Abulalas", "Iba", "Poblacion", "San Agustin"],
  Malolos: ["Anilao", "Atlag", "Bulihan", "Poblacion"],
  Marilao: ["Ibayo", "Lambakin", "Poblacion", "Prenza"],
  Meycauayan: ["Bahay Pare", "Calvario", "Poblacion", "Saluysoy"],
  Norzagaray: ["Bigte", "Matictic", "Poblacion", "San Mateo"],
  Obando: ["Binuangan", "Paco", "Poblacion", "Salambao"],
  Pandi: ["Bagbaguin", "Bunsuran", "Poblacion", "Siling Bata"],
  Paombong: ["Binakod", "Poblacion", "San Isidro", "San Roque"],
  Plaridel: ["Agnaya", "Banga I", "Poblacion", "Tabang"],
  Pulilan: ["Dampol", "Longos", "Poblacion", "Tibag"],
  "San Ildefonso": ["Akle", "Anyatam", "Poblacion", "Upig"],
  "San Jose del Monte": [
    "Citrus",
    "Graceville",
    "Poblacion",
    "Tungkong Mangga",
  ],
  "San Miguel": ["Bagong Silang", "Poblacion", "San Juan", "Tartaro"],
  "Santa Maria": [
    "Bagbaguin",
    "Catmon",
    "Poblacion",
    "Pulong Buhangin",
  ],
};

const DEFAULT_PROFILE = {
  name: "Admin User",
  contact: "0917-000-0000",
  email: "admin@goldenpr.com",
  region: "Central Luzon",
  province: "Bulacan",
  city: "San Rafael",
  barangay: "Poblacion",
  postalCode: "",
  streetAddress: "GoldenPR Water Refilling Station",
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

function SelectField({
  id,
  name,
  label,
  value,
  onChange,
  options,
  disabled = false,
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-[10px] font-bold uppercase tracking-[0.4px] text-text-secondary sm:text-xs"
      >
        {label}
      </label>

      <div className="relative">
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="h-11 w-full appearance-none rounded border border-border-secondary bg-background-main px-3 pr-10 text-sm text-text-primary outline-none transition-colors focus:border-primary-background focus:ring-1 focus:ring-primary-background disabled:cursor-not-allowed disabled:opacity-60"
        >
          <option value="">Select {label}</option>

          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <svg
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

function EditAdminProfile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [formData, setFormData] = useState(DEFAULT_PROFILE);

  useEffect(() => {
    const currentUser = getCurrentUser();

    const loadedProfile = {
      ...DEFAULT_PROFILE,
      ...currentUser,
      status:
        currentUser.status === "Offline"
          ? "Offline"
          : "Active",
      region: currentUser.region || DEFAULT_PROFILE.region,
      province:
        currentUser.province || DEFAULT_PROFILE.province,
      city: currentUser.city || DEFAULT_PROFILE.city,
      barangay:
        currentUser.barangay || DEFAULT_PROFILE.barangay,
      postalCode: currentUser.postalCode || "",
      streetAddress:
        currentUser.streetAddress ||
        currentUser.address ||
        DEFAULT_PROFILE.streetAddress,
    };

    setProfile(loadedProfile);
    setFormData(loadedProfile);
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => {
      if (name === "city") {
        const availableBarangays =
          BARANGAYS_BY_MUNICIPALITY[value] ||
          BULACAN_BARANGAYS;

        return {
          ...previous,
          city: value,
          barangay: availableBarangays.includes(
            previous.barangay,
          )
            ? previous.barangay
            : "",
        };
      }

      return {
        ...previous,
        [name]: value,
      };
    });
  };

  const handleSave = (event) => {
    event.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.contact.trim() ||
      !formData.email.trim() ||
      !formData.region.trim() ||
      !formData.province.trim() ||
      !formData.city.trim() ||
      !formData.barangay.trim() ||
      !formData.streetAddress.trim()
    ) {
      return;
    }

    const formattedAddress = [
      formData.streetAddress,
      formData.barangay,
      formData.city,
      formData.province,
      formData.region,
      formData.postalCode,
    ]
      .filter(Boolean)
      .join(", ");

    const updatedUser = {
      ...profile,
      ...formData,
      address: formattedAddress,
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

    navigate("/admin/dashboard", {
      state: {
        toast: {
          type: "success",
          message: "Profile updated successfully.",
        },
      },
    });
  };

  const handleCancel = () => {
    setFormData(profile);
    navigate(-1);
  };

  const availableBarangays =
    BARANGAYS_BY_MUNICIPALITY[formData.city] ||
    BULACAN_BARANGAYS;

  return (
    <div className="min-h-screen bg-background-main">
      <Header />

      <div className="flex min-h-[calc(100vh-64px)]">
        <AdminSidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-[1200px] px-4 pb-28 pt-5 sm:px-6 sm:pb-32 sm:pt-7 lg:px-8 lg:pb-36">
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
                    Edit Profile
                  </h1>

                  <p className="mt-0.5 text-xs text-text-secondary sm:text-sm">
                    Update your administrator account information
                  </p>
                </div>
              </div>

              <form onSubmit={handleSave}>
                <div className="rounded-xl border border-border-light bg-background-card p-4 shadow-sm sm:p-6">
                  {/* Personal Details */}
                  <section>
                    <div className="mb-5 border-b border-border-light pb-3">
                      <h2 className="text-[10px] font-bold uppercase tracking-[0.8px] text-text-accent sm:text-xs">
                        Personal Details
                      </h2>

                      <p className="mt-1 text-xs text-text-secondary">
                        Update your basic administrator
                        information.
                      </p>
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
                  <section className="mt-8">
                    <div className="mb-5 border-b border-border-light pb-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary-background" />

                        <h2 className="text-[10px] font-bold uppercase tracking-[0.8px] text-text-accent sm:text-xs">
                          Delivery Address
                        </h2>
                      </div>

                      <p className="mt-1 text-xs text-text-secondary">
                        Select your registered delivery
                        location.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                      {/* Region */}
                      <SelectField
                        id="region"
                        name="region"
                        label="Region"
                        value={formData.region}
                        onChange={handleChange}
                        options={["Central Luzon"]}
                      />

                      {/* Province */}
                      <SelectField
                        id="province"
                        name="province"
                        label="Province"
                        value={formData.province}
                        onChange={handleChange}
                        options={["Bulacan"]}
                      />

                      {/* City / Municipality */}
                      <SelectField
                        id="city"
                        name="city"
                        label="City / Municipality"
                        value={formData.city}
                        onChange={handleChange}
                        options={BULACAN_MUNICIPALITIES}
                      />

                      {/* Barangay */}
                      <SelectField
                        id="barangay"
                        name="barangay"
                        label="Barangay"
                        value={formData.barangay}
                        onChange={handleChange}
                        options={availableBarangays}
                        disabled={!formData.city}
                      />

                      {/* Postal Code */}
                      <div className="flex flex-col gap-1.5">
                        <label
                          htmlFor="postalCode"
                          className="text-[10px] font-bold uppercase tracking-[0.4px] text-text-secondary sm:text-xs"
                        >
                          Postal Code
                        </label>

                        <input
                          id="postalCode"
                          name="postalCode"
                          type="text"
                          value={formData.postalCode}
                          onChange={handleChange}
                          placeholder="Enter postal code"
                          className="h-11 w-full rounded border border-border-secondary bg-background-main px-3 text-sm text-text-primary outline-none transition-colors focus:border-primary-background focus:ring-1 focus:ring-primary-background"
                        />
                      </div>

                      {/* Street Address */}
                      <div className="flex flex-col gap-1.5 lg:col-span-2">
                        <label
                          htmlFor="streetAddress"
                          className="text-[10px] font-bold uppercase tracking-[0.4px] text-text-secondary sm:text-xs"
                        >
                          Street Address
                        </label>

                        <div className="relative">
                          <MapPin className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-text-secondary" />

                          <textarea
                            id="streetAddress"
                            name="streetAddress"
                            rows={3}
                            value={formData.streetAddress}
                            onChange={handleChange}
                            placeholder="House/Unit No., Street, Subdivision or Building"
                            className="w-full resize-none rounded border border-border-secondary bg-background-main py-3 pl-10 pr-3 text-sm text-text-primary outline-none transition-colors focus:border-primary-background focus:ring-1 focus:ring-primary-background"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Address Preview */}
                    <div className="mt-5 rounded-lg border border-border-light bg-background-main p-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background-lightBlue text-primary-background">
                          <MapPin className="h-4 w-4" />
                        </div>

                        <div className="min-w-0">
                          <p className="text-[9px] font-bold uppercase tracking-[0.6px] text-text-accent">
                            Address Preview
                          </p>

                          <p className="mt-1 break-words text-sm font-medium leading-5 text-text-primary">
                            {[
                              formData.streetAddress,
                              formData.barangay,
                              formData.city,
                              formData.province,
                              formData.region,
                              formData.postalCode,
                            ]
                              .filter(Boolean)
                              .join(", ") ||
                              "No address selected"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Location Picture */}
                    <div className="relative mt-5 h-44 w-full overflow-hidden rounded-lg border border-border-light bg-background-lightBlue">
                      <img
                        src={snazzyImage}
                        alt="Registered delivery location"
                        className="h-full w-full object-cover"
                      />

                      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-background text-white shadow-md">
                          <MapPin className="h-5 w-5" />
                        </div>

                        <div className="mt-1 rounded bg-background-card px-2 py-1 text-[9px] font-bold text-text-primary shadow-sm">
                          Registered Location
                        </div>
                      </div>

                      <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded bg-background-card px-2 py-1 text-[9px] font-bold text-text-accent shadow-sm">
                        ✓ Verified
                      </div>
                    </div>
                  </section>

                  {/* Account Status */}
                  <section className="mt-8">
                    <div className="mb-5 border-b border-border-light pb-3">
                      <h2 className="text-[10px] font-bold uppercase tracking-[0.8px] text-text-accent sm:text-xs">
                        Account Status
                      </h2>

                      <p className="mt-1 text-xs text-text-secondary">
                        Control the current access status of
                        this administrator account.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                      {/* Active */}
                      <label
                        className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors ${
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
                              formData.status === "Active"
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
                        className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors ${
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
                              formData.status === "Offline"
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
                  <div className="mt-8 flex flex-col-reverse gap-3 border-t border-border-light pt-6 sm:flex-row sm:items-center sm:justify-between">
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

          <AdminFooter />
        </div>
      </div>
    </div>
  );
}

export default EditAdminProfile;