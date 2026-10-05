import React, { useCallback, useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import {
  Check,
  ChevronDown,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import Header from "../../components/Header/Header";
import CustomerNavbar from "../../components/customer/CustomerNavbar";
import CustomerFooter from "../../components/customer/CustomerFooter";
import ToastNotification from "../../components/ToastNotification";

import {
  getProfile,
  saveProfile,
  saveAddress,
  deleteAddress,
  formatAddress,
} from "../../utils/profileStorage";

import { saveCurrentOrder } from "../../utils/orderStorage";

const PROFILE_TOAST_KEY = "goldenpr_profile_toast";

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

const emptyAddress = {
  id: "",
  label: "Home",
  region: "Central Luzon",
  province: "Bulacan",
  city: "San Rafael",
  barangay: "Poblacion",
  postalCode: "3008",
  streetAddress: "",
  isDefault: false,
};

function TextField({
  id,
  label,
  value,
  onChange,
  required = false,
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <label
        htmlFor={id}
        className="whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.5px] text-text-primary"
      >
        {label}
      </label>

      <input
        id={id}
        type="text"
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full min-w-0 rounded-md border border-border-light bg-background-card px-3 text-sm text-text-primary outline-none transition focus:border-primary-background"
      />
    </div>
  );
}

function SelectField({
  id,
  label,
  value,
  onChange,
  options,
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <label
        htmlFor={id}
        className="whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.6px] text-text-primary"
      >
        {label}
      </label>

      <div className="relative">
        <select
          id={id}
          value={value}
          required
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-full appearance-none rounded-md border border-border-light bg-background-card pl-3 pr-12 text-sm text-text-primary outline-none focus:border-primary-background"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <ChevronDown
          size={16}
          strokeWidth={2}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary"
        />
      </div>
    </div>
  );
}

function EditProfile() {
  const navigate = useNavigate();
  const location = useLocation();

  const [profile, setProfile] = useState(() => getProfile());
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [status, setStatus] = useState("Active");
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [addressForm, setAddressForm] = useState(emptyAddress);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isClosingEdit, setIsClosingEdit] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    title: "",
    message: "",
  });

  const searchParams = new URLSearchParams(location.search);
  const requestedAddressId = searchParams.get("addressId");
  const shouldAddAddress = searchParams.get("addAddress") === "1";

  const returnTo = location.state?.returnTo;
  const returnOrder = location.state?.order;

  const loadProfile = useCallback(() => {
    const savedProfile = getProfile();

    const savedAddresses = Array.isArray(savedProfile.addresses)
      ? savedProfile.addresses
      : [];

    setProfile(savedProfile);
    setFullName(savedProfile.fullName || "");
    setPhoneNumber(savedProfile.phoneNumber || "");
    setStatus(savedProfile.status || "Active");
    setAddresses(savedAddresses);

    if (shouldAddAddress) {
      setSelectedAddressId("");

      setAddressForm({
        ...emptyAddress,
        isDefault: savedAddresses.length === 0,
      });

      setIsAddingAddress(true);
      return;
    }

    const addressToEdit =
      savedAddresses.find(
        (address) =>
          String(address.id) === String(requestedAddressId),
      ) || savedAddresses[0];

    if (addressToEdit) {
      setSelectedAddressId(addressToEdit.id);

      setAddressForm({
        ...emptyAddress,
        ...addressToEdit,
      });

      setIsAddingAddress(false);
    } else {
      setSelectedAddressId("");
      setAddressForm({ ...emptyAddress });
      setIsAddingAddress(true);
    }
  }, [requestedAddressId, shouldAddAddress]);

  useEffect(() => {
    loadProfile();

    window.addEventListener("profileUpdated", loadProfile);

    return () => {
      window.removeEventListener("profileUpdated", loadProfile);
    };
  }, [loadProfile]);

  const getProfileAddresses = () => {
    const savedProfile = getProfile();

    return Array.isArray(savedProfile.addresses)
      ? savedProfile.addresses
      : [];
  };

  const updateAddressField = (field, value) => {
    setAddressForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const selectAddressToEdit = (addressId) => {
    const selectedAddress = addresses.find(
      (address) =>
        String(address.id) === String(addressId),
    );

    if (!selectedAddress) return;

    setSelectedAddressId(selectedAddress.id);

    setAddressForm({
      ...emptyAddress,
      ...selectedAddress,
    });

    setIsAddingAddress(false);
    setIsClosingEdit(false);
  };

  const startAddingAddress = () => {
    setSelectedAddressId("");

    setAddressForm({
      ...emptyAddress,
      id: "",
      label: "Home",
      isDefault: addresses.length === 0,
    });

    setIsAddingAddress(true);
    setIsClosingEdit(false);
  };

  const closeEditForm = () => {
    setIsClosingEdit(true);

    window.setTimeout(() => {
      setSelectedAddressId("");
      setAddressForm({ ...emptyAddress });
      setIsAddingAddress(false);
      setIsClosingEdit(false);
    }, 250);
  };

  const handleSetDefaultAddress = (addressId) => {
    const currentProfile = getProfile();

    const currentAddresses = Array.isArray(
      currentProfile.addresses,
    )
      ? currentProfile.addresses
      : [];

    const updatedAddresses = currentAddresses.map(
      (address) => ({
        ...address,
        isDefault:
          String(address.id) === String(addressId),
      }),
    );

    const defaultAddress = updatedAddresses.find(
      (address) =>
        String(address.id) === String(addressId),
    );

    const updatedProfile = {
      ...currentProfile,
      addresses: updatedAddresses,
      address: defaultAddress
        ? formatAddress(defaultAddress)
        : currentProfile.address || "",
    };

    saveProfile(updatedProfile);

    setProfile(updatedProfile);
    setAddresses(updatedAddresses);

    setAddressForm((current) => ({
      ...current,
      isDefault:
        String(current.id) === String(addressId),
    }));

    setToast({
      show: true,
      title: "Default Address Updated",
      message:
        "This address is now your default delivery address.",
    });
  };

  const handleDeleteAddress = (addressId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this address?",
    );

    if (!confirmed) return;

    const currentProfileBeforeDelete = getProfile();

    const currentAddresses = Array.isArray(
      currentProfileBeforeDelete.addresses,
    )
      ? currentProfileBeforeDelete.addresses
      : [];

    const deletedAddress = currentAddresses.find(
      (address) =>
        String(address.id) === String(addressId),
    );

    deleteAddress(addressId);

    let updatedAddresses = getProfileAddresses();

    if (
      deletedAddress?.isDefault &&
      updatedAddresses.length > 0
    ) {
      const nextDefaultId = updatedAddresses[0].id;

      updatedAddresses = updatedAddresses.map(
        (address) => ({
          ...address,
          isDefault:
            String(address.id) ===
            String(nextDefaultId),
        }),
      );

      updatedAddresses.forEach((address) => {
        saveAddress(address);
      });
    }

    const currentProfile = getProfile();

    const defaultAddress =
      updatedAddresses.find(
        (address) => address.isDefault,
      ) || updatedAddresses[0];

    const updatedProfile = {
      ...currentProfile,
      addresses: updatedAddresses,
      address: defaultAddress
        ? formatAddress(defaultAddress)
        : "",
    };

    saveProfile(updatedProfile);

    setProfile(updatedProfile);
    setAddresses(updatedAddresses);

    if (
      String(selectedAddressId) === String(addressId)
    ) {
      setSelectedAddressId("");
      setAddressForm({ ...emptyAddress });
      setIsAddingAddress(false);
    }

    setToast({
      show: true,
      title: "Address Deleted",
      message:
        "The saved address has been deleted.",
    });
  };

  const handleSaveAddress = () => {
    if (
      !addressForm.streetAddress.trim() ||
      !addressForm.region ||
      !addressForm.province ||
      !addressForm.city ||
      !addressForm.barangay ||
      !addressForm.postalCode.trim()
    ) {
      window.alert(
        "Please complete all delivery address fields.",
      );

      return false;
    }

    const isEditingExistingAddress =
      Boolean(addressForm.id) &&
      !isAddingAddress;

    const addressToSave = {
      ...addressForm,
      id: isEditingExistingAddress
        ? addressForm.id
        : `address-${Date.now()}`,
      label:
        addressForm.label.trim() || "Home",
      streetAddress:
        addressForm.streetAddress.trim(),
      postalCode:
        addressForm.postalCode.trim(),
      isDefault: Boolean(addressForm.isDefault),
    };

    let currentAddresses = getProfileAddresses();

    if (addressToSave.isDefault) {
      currentAddresses = currentAddresses.map(
        (address) => ({
          ...address,
          isDefault:
            String(address.id) ===
            String(addressToSave.id),
        }),
      );

      currentAddresses.forEach((address) => {
        saveAddress(address);
      });
    }

    const savedAddress =
      saveAddress(addressToSave);

    let updatedAddresses =
      getProfileAddresses();

    if (
      updatedAddresses.length > 0 &&
      !updatedAddresses.some(
        (address) => address.isDefault,
      )
    ) {
      const firstAddress =
        updatedAddresses[0];

      updatedAddresses =
        updatedAddresses.map(
          (address) => ({
            ...address,
            isDefault:
              String(address.id) ===
              String(firstAddress.id),
          }),
        );

      updatedAddresses.forEach((address) => {
        saveAddress(address);
      });
    }

    const defaultAddress =
      updatedAddresses.find(
        (address) => address.isDefault,
      ) || savedAddress;

    const currentProfile = getProfile();

    const updatedProfile = {
      ...currentProfile,
      addresses: updatedAddresses,
      address: defaultAddress
        ? formatAddress(defaultAddress)
        : "",
    };

    saveProfile(updatedProfile);

    setProfile(updatedProfile);
    setAddresses(updatedAddresses);

    const refreshedAddress =
      updatedAddresses.find(
        (address) =>
          String(address.id) ===
          String(savedAddress.id),
      );

    if (refreshedAddress) {
      setAddressForm({
        ...emptyAddress,
        ...refreshedAddress,
      });
    }

    setIsClosingEdit(true);

    window.setTimeout(() => {
      setSelectedAddressId("");
      setAddressForm({ ...emptyAddress });
      setIsAddingAddress(false);
      setIsClosingEdit(false);
    }, 250);

    setToast({
      show: true,
      title: isEditingExistingAddress
        ? "Address Updated"
        : "Address Added",
      message: isEditingExistingAddress
        ? "Your delivery address has been updated successfully."
        : "Your new delivery address has been saved successfully.",
    });

    return true;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!fullName.trim() || !phoneNumber.trim()) {
      window.alert(
        "Please enter your full name and phone number.",
      );

      return;
    }

    let updatedProfile = {
      ...profile,
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      status: status || "Active",
    };

    if (isAddingAddress || addressForm.id) {
      const addressSaved = handleSaveAddress();

      if (!addressSaved) return;

      /*
       * Re-read the saved profile after the address update,
       * but preserve the newly selected account status.
       */
      updatedProfile = {
        ...getProfile(),
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        status: status || "Active",
      };
    }

    saveProfile(updatedProfile);

    if (returnTo === "/customer/delivery-details") {
      const order = {
        ...(returnOrder || {}),
        customerName: updatedProfile.fullName,
        contactNumber: updatedProfile.phoneNumber,
        updatedAt: new Date().toISOString(),
      };

      saveCurrentOrder(order);

      navigate("/customer/delivery-details", {
        replace: true,
        state: {
          order,
          profileUpdated: true,
        },
      });

      return;
    }

    const successMessage = isAddingAddress
      ? "Your new delivery address has been saved."
      : "Your profile and address changes have been saved.";

    try {
      sessionStorage.setItem(
        PROFILE_TOAST_KEY,
        JSON.stringify({
          title: "Profile Updated",
          message: successMessage,
          timestamp: Date.now(),
        }),
      );
    } catch (error) {
      console.error(
        "Could not store profile notification:",
        error,
      );
    }

    navigate("/customer/profile", {
      replace: true,
      state: {
        showProfileToast: true,
        toastTitle: "Profile Updated",
        toastMessage: successMessage,
      },
    });
  };

  const handleCancel = () => {
    if (returnTo === "/customer/delivery-details") {
      navigate("/customer/delivery-details", {
        state: {
          order: returnOrder,
        },
      });

      return;
    }

    navigate("/customer/profile");
  };

  const availableBarangays =
    BARANGAYS_BY_MUNICIPALITY[
      addressForm.city
    ] || BULACAN_BARANGAYS;

  return (
    <div className="flex min-h-screen flex-col bg-background-main">
      <Header />

      <main className="flex-1 overflow-y-auto bg-background-main pb-[120px]">
        <div className="mx-auto flex w-full max-w-[600px] flex-col px-4 py-6 sm:px-6 sm:py-8">
          <div className="mb-5 flex flex-col gap-1">
            <h1 className="text-[24px] font-bold leading-[120%] tracking-[-0.02em] text-text-accent sm:text-[28px]">
              Edit Profile
            </h1>

            <p className="text-sm leading-[1.5] text-text-secondary">
              Update your personal information and saved addresses.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5 rounded-xl border border-border-primary bg-background-card p-5 shadow-card sm:p-6"
          >
            <TextField
              id="fullName"
              label="Full Name"
              value={fullName}
              onChange={setFullName}
              required
            />

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
                required
                onChange={(event) =>
                  setPhoneNumber(event.target.value)
                }
                className="h-11 w-full rounded-md border border-border-light bg-background-card px-3 text-sm text-text-primary outline-none transition focus:border-primary-background"
              />
            </div>

            {/* Account Status */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="status"
                className="text-[10px] font-bold uppercase tracking-[0.6px] text-text-primary"
              >
                Account Status
              </label>

              <div className="relative">
                <select
                  id="status"
                  value={status || "Active"}
                  onChange={(event) =>
                    setStatus(event.target.value)
                  }
                  className="h-11 w-full appearance-none rounded-md border border-border-light bg-background-card px-3 pr-10 text-sm text-text-primary outline-none transition focus:border-primary-background"
                >
                  <option value="Active">Active</option>
                  <option value="Offline">Offline</option>
                </select>

                <ChevronDown
                  size={16}
                  strokeWidth={2}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary"
                />
              </div>
            </div>

            <div className="border-t border-border-light pt-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-[0.6px] text-text-accent">
                    Saved Addresses
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-text-secondary">
                    Add a new address or choose one to edit.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={startAddingAddress}
                  className="flex min-h-10 items-center justify-center gap-2 rounded-lg border border-primary-background px-3 py-2 text-xs font-bold uppercase tracking-[0.4px] text-primary-background transition-colors hover:bg-background-accent"
                >
                  <Plus size={16} />
                  Add Address
                </button>
              </div>

              {addresses.length > 0 && (
                <div className="mt-4 flex flex-col gap-3">
                  {addresses.map((address) => {
                    const isSelected =
                      String(selectedAddressId) ===
                      String(address.id);

                    const isDefault =
                      Boolean(address.isDefault);

                    const isEditingThisAddress =
                      isSelected && !isAddingAddress;

                    return (
                      <div
                        key={address.id}
                        className={`overflow-hidden rounded-lg border transition-all duration-300 ease-out ${
                          isSelected
                            ? "border-primary-background bg-background-accent"
                            : "border-border-light bg-background-card"
                        }`}
                      >
                        <div className="p-3">
                          <div className="flex items-start gap-3">
                            <input
                              type="radio"
                              name="selectedAddress"
                              checked={isSelected}
                              onChange={() =>
                                selectAddressToEdit(
                                  address.id,
                                )
                              }
                              className="mt-1 accent-primary-background"
                              aria-label={`Select ${
                                address.label ||
                                "address"
                              } to edit`}
                            />

                            <button
                              type="button"
                              onClick={() =>
                                selectAddressToEdit(
                                  address.id,
                                )
                              }
                              className="min-w-0 flex-1 text-left"
                            >
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-sm font-semibold text-text-primary">
                                  {address.label ||
                                    "Address"}
                                </span>

                                {isDefault && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-primary-background px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.4px] text-white">
                                    <Check size={10} />
                                    Default
                                  </span>
                                )}
                              </div>

                              <p className="mt-1 text-xs leading-5 text-text-secondary">
                                {formatAddress(address)}
                              </p>
                            </button>

                            <div className="flex shrink-0 items-center gap-1">
                              <button
                                type="button"
                                onClick={() =>
                                  selectAddressToEdit(
                                    address.id,
                                  )
                                }
                                className={`rounded-md p-1.5 transition-colors ${
                                  isEditingThisAddress
                                    ? "bg-primary-background text-white"
                                    : "text-text-secondary hover:bg-background-accent hover:text-primary-background"
                                }`}
                                aria-label={`Edit ${
                                  address.label ||
                                  "address"
                                }`}
                              >
                                <Pencil size={16} />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteAddress(
                                    address.id,
                                  )
                                }
                                className="rounded-md p-1.5 text-red-500 transition-colors hover:bg-red-50"
                                aria-label="Delete address"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>

                        {isEditingThisAddress && (
                          <div
                            className={`border-t border-primary-background/20 bg-background-card transition-all duration-250 ease-out ${
                              isClosingEdit
                                ? "max-h-0 translate-y-1 overflow-hidden p-0 opacity-0"
                                : "max-h-[1000px] translate-y-0 p-4 opacity-100 sm:p-5"
                            }`}
                          >
                            <div className="mb-5 flex items-start justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-2">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-background-accent text-primary-background">
                                    <Pencil size={15} />
                                  </div>

                                  <div>
                                    <h3 className="text-sm font-bold text-text-primary">
                                      Edit Delivery Address
                                    </h3>

                                    <p className="mt-0.5 text-[11px] text-text-secondary">
                                      Update your saved delivery details.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="rounded-lg border border-border-light bg-background-main p-4 sm:p-5">
                              <div className="grid grid-cols-1 gap-5">
                                <TextField
                                  id={`addressLabel-${address.id}`}
                                  label="Address Label"
                                  value={
                                    addressForm.label
                                  }
                                  onChange={(value) =>
                                    updateAddressField(
                                      "label",
                                      value,
                                    )
                                  }
                                  required
                                />

                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                  <SelectField
                                    id={`region-${address.id}`}
                                    label="Region"
                                    value={
                                      addressForm.region
                                    }
                                    onChange={(value) =>
                                      updateAddressField(
                                        "region",
                                        value,
                                      )
                                    }
                                    options={[
                                      "Central Luzon",
                                    ]}
                                  />

                                  <SelectField
                                    id={`province-${address.id}`}
                                    label="Province"
                                    value={
                                      addressForm.province
                                    }
                                    onChange={(value) =>
                                      updateAddressField(
                                        "province",
                                        value,
                                      )
                                    }
                                    options={[
                                      "Bulacan",
                                    ]}
                                  />
                                </div>

                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                  <SelectField
                                    id={`city-${address.id}`}
                                    label="City / Municipality"
                                    value={
                                      addressForm.city
                                    }
                                    onChange={(value) => {
                                      const nextBarangays =
                                        BARANGAYS_BY_MUNICIPALITY[
                                          value
                                        ] ||
                                        BULACAN_BARANGAYS;

                                      setAddressForm(
                                        (current) => ({
                                          ...current,
                                          city: value,
                                          barangay:
                                            nextBarangays[0] ||
                                            "",
                                          postalCode:
                                            value ===
                                            "San Rafael"
                                              ? "3008"
                                              : "",
                                        }),
                                      );
                                    }}
                                    options={
                                      BULACAN_MUNICIPALITIES
                                    }
                                  />

                                  <SelectField
                                    id={`barangay-${address.id}`}
                                    label="Barangay"
                                    value={
                                      addressForm.barangay
                                    }
                                    onChange={(value) =>
                                      updateAddressField(
                                        "barangay",
                                        value,
                                      )
                                    }
                                    options={
                                      availableBarangays
                                    }
                                  />
                                </div>

                                {/* POSTAL CODE + STREET ADDRESS */}
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-12 sm:items-start">
                                  <div className="sm:col-span-4">
                                    <TextField
                                      id={`postalCode-${address.id}`}
                                      label="Postal Code"
                                      value={
                                        addressForm.postalCode
                                      }
                                      onChange={(value) =>
                                        updateAddressField(
                                          "postalCode",
                                          value,
                                        )
                                      }
                                      required
                                    />
                                  </div>

                                  <div className="sm:col-span-8">
                                    <TextField
                                      id={`streetAddress-${address.id}`}
                                      label="Street Name / Building / House No."
                                      value={
                                        addressForm.streetAddress
                                      }
                                      onChange={(value) =>
                                        updateAddressField(
                                          "streetAddress",
                                          value,
                                        )
                                      }
                                      required
                                    />
                                  </div>
                                </div>

                                {/* DEFAULT ADDRESS TOGGLE */}
                                <div className="flex items-center justify-between gap-4 rounded-md border border-border-light bg-background-card px-3 py-3 sm:px-4">
                                  <div className="min-w-0">
                                    <p className="text-xs font-semibold text-text-primary">
                                      Default delivery address
                                    </p>

                                    <p className="mt-0.5 text-[10px] leading-4 text-text-secondary">
                                      Use this address automatically for delivery.
                                    </p>
                                  </div>

                                  <label
                                    className="relative flex h-5 w-9 shrink-0 cursor-pointer items-center"
                                    aria-label="Set as default delivery address"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={Boolean(
                                        addressForm.isDefault,
                                      )}
                                      onChange={(event) =>
                                        updateAddressField(
                                          "isDefault",
                                          event.target.checked,
                                        )
                                      }
                                      className="sr-only"
                                    />

                                    <span
                                      className={`relative block h-5 w-9 rounded-full transition-colors duration-200 ${
                                        addressForm.isDefault
                                          ? "bg-primary-background"
                                          : "bg-stone-300"
                                      }`}
                                    >
                                      <span
                                        className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ease-out ${
                                          addressForm.isDefault
                                            ? "translate-x-4"
                                            : "translate-x-0"
                                        }`}
                                      />
                                    </span>
                                  </label>
                                </div>
                              </div>
                            </div>

                            <div className="mt-5 flex gap-3">
                              <button
                                type="button"
                                onClick={closeEditForm}
                                disabled={isClosingEdit}
                                className="flex min-h-11 flex-1 items-center justify-center rounded-lg border border-border-light bg-background-card px-4 text-[10px] font-bold uppercase tracking-[0.5px] text-text-secondary transition-colors hover:bg-background-accent hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                Cancel
                              </button>

                              <button
                                type="button"
                                onClick={handleSaveAddress}
                                disabled={isClosingEdit}
                                className="flex min-h-11 flex-1 items-center justify-center rounded-lg bg-primary-background px-4 text-[10px] font-bold uppercase tracking-[0.5px] text-white shadow-sm transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                Save Address
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* ADD NEW ADDRESS */}
              {isAddingAddress && (
                <div className="mt-5 rounded-lg border border-border-light p-4 sm:p-5">
                  <div className="mb-4">
                    <h3 className="text-sm font-bold text-text-primary">
                      Add New Address
                    </h3>
                  </div>

                  <div className="flex flex-col gap-4">
                    <TextField
                      id="newAddressLabel"
                      label="Address Label"
                      value={addressForm.label}
                      onChange={(value) =>
                        updateAddressField(
                          "label",
                          value,
                        )
                      }
                      required
                    />

                    <SelectField
                      id="newRegion"
                      label="Region"
                      value={addressForm.region}
                      onChange={(value) =>
                        updateAddressField(
                          "region",
                          value,
                        )
                      }
                      options={["Central Luzon"]}
                    />

                    <SelectField
                      id="newProvince"
                      label="Province"
                      value={addressForm.province}
                      onChange={(value) =>
                        updateAddressField(
                          "province",
                          value,
                        )
                      }
                      options={["Bulacan"]}
                    />

                    <SelectField
                      id="newCity"
                      label="City / Municipality"
                      value={addressForm.city}
                      onChange={(value) => {
                        const nextBarangays =
                          BARANGAYS_BY_MUNICIPALITY[
                            value
                          ] ||
                          BULACAN_BARANGAYS;

                        setAddressForm(
                          (current) => ({
                            ...current,
                            city: value,
                            barangay:
                              nextBarangays[0] ||
                              "",
                            postalCode:
                              value ===
                              "San Rafael"
                                ? "3008"
                                : "",
                          }),
                        );
                      }}
                      options={
                        BULACAN_MUNICIPALITIES
                      }
                    />

                    <SelectField
                      id="newBarangay"
                      label="Barangay"
                      value={addressForm.barangay}
                      onChange={(value) =>
                        updateAddressField(
                          "barangay",
                          value,
                        )
                      }
                      options={availableBarangays}
                    />

                    <TextField
                      id="newPostalCode"
                      label="Postal Code"
                      value={
                        addressForm.postalCode
                      }
                      onChange={(value) =>
                        updateAddressField(
                          "postalCode",
                          value,
                        )
                      }
                      required
                    />

                    <TextField
                      id="newStreetAddress"
                      label="Street Name / Building / House No."
                      value={
                        addressForm.streetAddress
                      }
                      onChange={(value) =>
                        updateAddressField(
                          "streetAddress",
                          value,
                        )
                      }
                      required
                    />

                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={Boolean(
                          addressForm.isDefault,
                        )}
                        onChange={(event) =>
                          updateAddressField(
                            "isDefault",
                            event.target.checked,
                          )
                        }
                        className="h-4 w-4 accent-primary-background"
                      />

                      <span className="text-xs font-semibold text-text-primary">
                        Set as default delivery address
                      </span>
                    </label>

                    <div className="mt-1 flex gap-3">
                      {addresses.length > 0 && (
                        <button
                          type="button"
                          onClick={closeEditForm}
                          disabled={isClosingEdit}
                          className="flex min-h-11 flex-1 items-center justify-center rounded-lg border border-border-light bg-background-card px-4 text-xs font-bold uppercase tracking-[0.5px] text-text-secondary transition-colors hover:bg-background-accent hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Cancel
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={handleSaveAddress}
                        disabled={isClosingEdit}
                        className={`flex min-h-11 items-center justify-center rounded-lg bg-primary-background px-4 text-xs font-bold uppercase tracking-[0.6px] text-white shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 ${
                          addresses.length > 0
                            ? "flex-1"
                            : "w-full"
                        }`}
                      >
                        Save Address
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {!isAddingAddress &&
                addresses.length > 0 && (
                  <p className="mt-3 text-xs leading-5 text-text-secondary">
                    Select an address above to edit its
                    details, or click Add Address to create
                    another one.
                  </p>
                )}
            </div>

            <div className="flex flex-col gap-3 border-t border-border-light pt-5 sm:flex-row">
              <button
                type="button"
                onClick={handleCancel}
                className="flex min-h-11 flex-1 items-center justify-center rounded-lg border-2 border-primary-light bg-background-card px-4 text-xs font-bold uppercase tracking-[0.6px] text-primary-light transition-colors hover:bg-primary-light hover:text-white"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex min-h-11 flex-1 items-center justify-center rounded-lg bg-primary-background px-4 text-xs font-bold uppercase tracking-[0.6px] text-white shadow-sm transition-opacity hover:opacity-90"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 z-50 w-full">
        <CustomerNavbar />
      </div>

      <CustomerFooter />

      <ToastNotification
        show={toast.show}
        title={toast.title}
        message={toast.message}
        onClose={() =>
          setToast((current) => ({
            ...current,
            show: false,
          }))
        }
      />
    </div>
  );
}

export default EditProfile;