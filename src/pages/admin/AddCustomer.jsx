import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

import { ChevronDown } from "lucide-react";

import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminFooter from "../../components/admin/AdminFooter";

import Header from "../../components/Header/Header";

const CUSTOMER_TOAST_KEY = "adminCustomerToast";

const REGIONS = ["Central Luzon"];

const PROVINCES_BY_REGION = {
  "Central Luzon": ["Bulacan"],
};

const CITIES_BY_PROVINCE = {
  Bulacan: [
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
  ],
};

const BARANGAYS_BY_MUNICIPALITY = {
  "San Rafael": [
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
  ],

  Angat: [
    "Banaban",
    "Baybay",
    "Marungko",
    "Poblacion",
  ],

  Balagtas: [
    "Borol 1st",
    "Borol 2nd",
    "Longos",
    "Poblacion",
  ],

  Baliwag: [
    "Bagong Nayon",
    "Poblacion",
    "Sabang",
    "San Jose",
  ],

  Bocaue: [
    "Batia",
    "Lolomboy",
    "Poblacion",
    "Taal",
  ],

  Bulakan: [
    "Bagumbayan",
    "Matungao",
    "Poblacion",
    "San Nicolas",
  ],

  Bustos: [
    "Bonga Menor",
    "Bonga Mayor",
    "Poblacion",
    "Tibagan",
  ],

  Calumpit: [
    "Balite",
    "Gatbuca",
    "Poblacion",
    "San Jose",
  ],

  "Doña Remedios Trinidad": [
    "Camachin",
    "Kabayo",
    "Poblacion",
    "Talbak",
  ],

  Guiguinto: [
    "Cutcut",
    "Ilang-Ilang",
    "Poblacion",
    "Tabe",
  ],

  Hagonoy: [
    "Abulalas",
    "Iba",
    "Poblacion",
    "San Agustin",
  ],

  Malolos: [
    "Anilao",
    "Atlag",
    "Bulihan",
    "Poblacion",
  ],

  Marilao: [
    "Ibayo",
    "Lambakin",
    "Poblacion",
    "Prenza",
  ],

  Meycauayan: [
    "Bahay Pare",
    "Calvario",
    "Poblacion",
    "Saluysoy",
  ],

  Norzagaray: [
    "Bigte",
    "Matictic",
    "Poblacion",
    "San Mateo",
  ],

  Obando: [
    "Binuangan",
    "Paco",
    "Poblacion",
    "Salambao",
  ],

  Pandi: [
    "Bagbaguin",
    "Bunsuran",
    "Poblacion",
    "Siling Bata",
  ],

  Paombong: [
    "Binakod",
    "Poblacion",
    "San Isidro",
    "San Roque",
  ],

  Plaridel: [
    "Agnaya",
    "Banga I",
    "Poblacion",
    "Tabang",
  ],

  Pulilan: [
    "Dampol",
    "Longos",
    "Poblacion",
    "Tibag",
  ],

  "San Ildefonso": [
    "Akle",
    "Anyatam",
    "Poblacion",
    "Upig",
  ],

  "San Jose del Monte": [
    "Citrus",
    "Graceville",
    "Poblacion",
    "Tungkong Mangga",
  ],

  "San Miguel": [
    "Bagong Silang",
    "Poblacion",
    "San Juan",
    "Tartaro",
  ],

  "Santa Maria": [
    "Bagbaguin",
    "Catmon",
    "Poblacion",
    "Pulong Buhangin",
  ],
};

function AddCustomer() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [region, setRegion] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [barangay, setBarangay] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [streetAddress, setStreetAddress] = useState("");

  const handleRegionChange = (event) => {
    const value = event.target.value;

    setRegion(value);
    setProvince("");
    setCity("");
    setBarangay("");
    setPostalCode("");
  };

  const handleProvinceChange = (event) => {
    const value = event.target.value;

    setProvince(value);
    setCity("");
    setBarangay("");
    setPostalCode("");
  };

  const handleCityChange = (event) => {
    const value = event.target.value;

    const nextBarangays =
      BARANGAYS_BY_MUNICIPALITY[value] || [];

    setCity(value);
    setBarangay(
      nextBarangays[0] || "",
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const addressParts = [
      streetAddress,
      barangay,
      city,
      province,
      region,
      postalCode,
    ].filter(Boolean);

    const address =
      addressParts.join(", ");

    const newCustomer = {
      id: crypto.randomUUID(),
      name,
      contact,
      email,
      address,
      region,
      province,
      city,
      barangay,
      postalCode,
      streetAddress,
      orders: 0,
    };

    const savedCustomers =
      localStorage.getItem(
        "adminCustomers",
      );

    let customers = [];

    if (savedCustomers) {
      try {
        customers =
          JSON.parse(
            savedCustomers,
          );
      } catch {
        customers = [];
      }
    }

    localStorage.setItem(
      "adminCustomers",
      JSON.stringify([
        ...customers,
        newCustomer,
      ]),
    );

    // Store success message for the Customers page
    localStorage.setItem(
      CUSTOMER_TOAST_KEY,
      "Customer added successfully.",
    );

    navigate("/admin/customers");
  };

  const handleCancel = () => {
    navigate("/admin/customers");
  };

  const availableBarangays =
    BARANGAYS_BY_MUNICIPALITY[city] || [];

  return (
    <div className="flex min-h-screen w-full bg-background-main">
      {/* Existing Admin Sidebar */}
      <AdminSidebar />

      {/* Main Application Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Existing Header */}
        <Header />

        <main className="min-w-0 flex-1 overflow-y-auto">
          <div className="w-full px-6 py-8 pb-20 lg:px-12 lg:pb-20">
            {/* Page Header */}
            <div className="mb-6">
              <button
                type="button"
                onClick={handleCancel}
                className="mb-1 block text-sm font-semibold uppercase tracking-[0.7px] text-text-accent hover:underline"
              >
                ← Back to Customers
              </button>

              <h1 className="text-3xl font-bold leading-10 tracking-[-0.32px] text-text-primary">
                Add Customer
              </h1>
            </div>

            {/* Add Customer Form */}
            <form
              onSubmit={handleSubmit}
              className="block w-full max-w-[650px] rounded-xl border border-card-border bg-card-background p-7 shadow-card"
            >
              <div className="flex w-full flex-col gap-5">
                {/* Customer Name */}
                <div className="flex w-full flex-col gap-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-semibold text-text-primary"
                  >
                    Customer Name
                  </label>

                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(event) =>
                      setName(
                        event.target.value,
                      )
                    }
                    placeholder="e.g. John Doe"
                    required
                    className="box-border w-full rounded-lg border border-border-secondary bg-background-card px-3 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Contact Number */}
                <div className="flex w-full flex-col gap-2">
                  <label
                    htmlFor="contact"
                    className="text-sm font-semibold text-text-primary"
                  >
                    Contact Number
                  </label>

                  <input
                    id="contact"
                    type="tel"
                    value={contact}
                    onChange={(event) =>
                      setContact(
                        event.target.value,
                      )
                    }
                    placeholder="e.g. 0917-123-4567"
                    required
                    className="box-border w-full rounded-lg border border-border-secondary bg-background-card px-3 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Email */}
                <div className="flex w-full flex-col gap-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-semibold text-text-primary"
                  >
                    Email Address
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(
                        event.target.value,
                      )
                    }
                    placeholder="e.g. john.doe@email.com"
                    required
                    className="box-border w-full rounded-lg border border-border-secondary bg-background-card px-3 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Address */}
                <div className="flex w-full flex-col gap-4">
                  <label className="text-sm font-semibold text-text-primary">
                    Address
                  </label>

                  {/* Region */}
                  <div className="flex w-full flex-col gap-2">
                    <label
                      htmlFor="region"
                      className="text-sm font-medium text-text-primary"
                    >
                      Region
                    </label>

                    <div className="relative">
                      <select
                        id="region"
                        value={region}
                        onChange={
                          handleRegionChange
                        }
                        required
                        className="box-border w-full appearance-none rounded-lg border border-border-secondary bg-background-card py-2.5 pl-3 pr-12 text-sm text-text-primary outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="">
                          Select Region
                        </option>

                        {REGIONS.map(
                          (item) => (
                            <option
                              key={item}
                              value={item}
                            >
                              {item}
                            </option>
                          ),
                        )}
                      </select>

                      <ChevronDown
                        size={16}
                        strokeWidth={2}
                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary"
                      />
                    </div>
                  </div>

                  {/* Province */}
                  <div className="flex w-full flex-col gap-2">
                    <label
                      htmlFor="province"
                      className="text-sm font-medium text-text-primary"
                    >
                      Province
                    </label>

                    <div className="relative">
                      <select
                        id="province"
                        value={province}
                        onChange={
                          handleProvinceChange
                        }
                        required
                        disabled={!region}
                        className="box-border w-full appearance-none rounded-lg border border-border-secondary bg-background-card py-2.5 pl-3 pr-12 text-sm text-text-primary outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-background-accent"
                      >
                        <option value="">
                          Select Province
                        </option>

                        {(
                          PROVINCES_BY_REGION[
                            region
                          ] || []
                        ).map(
                          (item) => (
                            <option
                              key={item}
                              value={item}
                            >
                              {item}
                            </option>
                          ),
                        )}
                      </select>

                      <ChevronDown
                        size={16}
                        strokeWidth={2}
                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary"
                      />
                    </div>
                  </div>

                  {/* City / Municipality */}
                  <div className="flex w-full flex-col gap-2">
                    <label
                      htmlFor="city"
                      className="text-sm font-medium text-text-primary"
                    >
                      City / Municipality
                    </label>

                    <div className="relative">
                      <select
                        id="city"
                        value={city}
                        onChange={
                          handleCityChange
                        }
                        required
                        disabled={!province}
                        className="box-border w-full appearance-none rounded-lg border border-border-secondary bg-background-card py-2.5 pl-3 pr-12 text-sm text-text-primary outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-background-accent"
                      >
                        <option value="">
                          Select City / Municipality
                        </option>

                        {(
                          CITIES_BY_PROVINCE[
                            province
                          ] || []
                        ).map(
                          (item) => (
                            <option
                              key={item}
                              value={item}
                            >
                              {item}
                            </option>
                          ),
                        )}
                      </select>

                      <ChevronDown
                        size={16}
                        strokeWidth={2}
                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary"
                      />
                    </div>
                  </div>

                  {/* Barangay */}
                  <div className="flex w-full flex-col gap-2">
                    <label
                      htmlFor="barangay"
                      className="text-sm font-medium text-text-primary"
                    >
                      Barangay
                    </label>

                    <div className="relative">
                      <select
                        id="barangay"
                        value={barangay}
                        onChange={(event) =>
                          setBarangay(
                            event.target.value,
                          )
                        }
                        required
                        disabled={!city}
                        className="box-border w-full appearance-none rounded-lg border border-border-secondary bg-background-card py-2.5 pl-3 pr-12 text-sm text-text-primary outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-background-accent"
                      >
                        <option value="">
                          Select Barangay
                        </option>

                        {availableBarangays.map(
                          (item) => (
                            <option
                              key={item}
                              value={item}
                            >
                              {item}
                            </option>
                          ),
                        )}
                      </select>

                      <ChevronDown
                        size={16}
                        strokeWidth={2}
                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary"
                      />
                    </div>
                  </div>

                  {/* Postal Code */}
                  <div className="flex w-full flex-col gap-2">
                    <label
                      htmlFor="postalCode"
                      className="text-sm font-medium text-text-primary"
                    >
                      Postal Code
                    </label>

                    <input
                      id="postalCode"
                      type="text"
                      value={postalCode}
                      onChange={(event) =>
                        setPostalCode(
                          event.target.value,
                        )
                      }
                      placeholder="e.g. 3000"
                      required
                      className="box-border w-full rounded-lg border border-border-secondary bg-background-card px-3 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  {/* Street Address */}
                  <div className="flex w-full flex-col gap-2">
                    <label
                      htmlFor="streetAddress"
                      className="text-sm font-medium text-text-primary"
                    >
                      Street Address
                    </label>

                    <input
                      id="streetAddress"
                      type="text"
                      value={streetAddress}
                      onChange={(event) =>
                        setStreetAddress(
                          event.target.value,
                        )
                      }
                      placeholder="House/Unit No., Street Name"
                      required
                      className="box-border w-full rounded-lg border border-border-secondary bg-background-card px-3 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex w-full items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="rounded-lg border border-border-secondary px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.7px] text-text-accent transition-colors hover:bg-background-accent"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="rounded-lg bg-button-background px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.7px] text-white shadow-sm transition-colors hover:bg-button-hover"
                  >
                    Save Customer
                  </button>
                </div>
              </div>
            </form>
          </div>
        </main>

        <AdminFooter />
      </div>
    </div>
  );
}

export default AddCustomer;