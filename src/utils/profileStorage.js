const PROFILE_KEY = "goldenpr_customer_profile";

const DEFAULT_ADDRESS = {
  id: "default-address",
  label: "Home",
  region: "Central Luzon",
  province: "Bulacan",
  city: "San Rafael",
  barangay: "Poblacion",
  postalCode: "3008",
  streetAddress: "",
};

const DEFAULT_PROFILE = {
  fullName: "Maria Santos",
  phoneNumber: "0917-555-0192",
  address:
    "Block 4, Lot 12, Phase 2\nSunnyvale Subdivision\nBrgy. San Jose, Antipolo",
  addresses: [],
};

export const formatAddress = (address) => {
  if (!address) return "";

  return [
    address.streetAddress,
    address.barangay
      ? `Barangay ${address.barangay}, ${address.city || ""}`.trim()
      : address.city,
    [
      address.province,
      address.region,
      address.postalCode,
    ]
      .filter(Boolean)
      .join(" "),
  ]
    .filter(Boolean)
    .join(", ");
};

export const getProfile = () => {
  try {
    const savedProfile = localStorage.getItem(PROFILE_KEY);

    if (!savedProfile) {
      return {
        ...DEFAULT_PROFILE,
        addresses: [],
      };
    }

    const profile = JSON.parse(savedProfile);

    return {
      ...DEFAULT_PROFILE,
      ...profile,
      addresses: Array.isArray(profile.addresses)
        ? profile.addresses
        : [],
    };
  } catch (error) {
    console.error("Failed to load profile:", error);

    return {
      ...DEFAULT_PROFILE,
      addresses: [],
    };
  }
};

export const saveProfile = (profile) => {
  const currentProfile = getProfile();

  const updatedProfile = {
    ...currentProfile,
    ...profile,
    addresses: Array.isArray(profile.addresses)
      ? profile.addresses
      : currentProfile.addresses,
  };

  localStorage.setItem(
    PROFILE_KEY,
    JSON.stringify(updatedProfile),
  );

  window.dispatchEvent(new Event("profileUpdated"));

  return updatedProfile;
};

export const updateProfile = (changes) => {
  const currentProfile = getProfile();

  return saveProfile({
    ...currentProfile,
    ...changes,
  });
};

export const getAddresses = () => {
  const profile = getProfile();

  return Array.isArray(profile.addresses)
    ? profile.addresses
    : [];
};

export const saveAddress = (address) => {
  const profile = getProfile();
  const addresses = [...profile.addresses];

  const savedAddress = {
    ...address,
    id: address.id || `address-${Date.now()}`,
  };

  const existingIndex = addresses.findIndex(
    (item) => String(item.id) === String(savedAddress.id),
  );

  if (existingIndex >= 0) {
    addresses[existingIndex] = savedAddress;
  } else {
    addresses.push(savedAddress);
  }

  const formattedAddress = formatAddress(savedAddress);

  saveProfile({
    ...profile,
    addresses,
    address:
      formattedAddress ||
      profile.address ||
      "",
  });

  return savedAddress;
};

export const deleteAddress = (addressId) => {
  const profile = getProfile();

  const addresses = profile.addresses.filter(
    (address) => String(address.id) !== String(addressId),
  );

  const primaryAddress = addresses[0];

  saveProfile({
    ...profile,
    addresses,
    address: primaryAddress
      ? formatAddress(primaryAddress)
      : "",
  });

  return addresses;
};

export const getDefaultAddress = () => {
  const addresses = getAddresses();

  return (
    addresses.find((address) => address.isDefault) ||
    addresses[0] ||
    null
  );
};

export { DEFAULT_ADDRESS };