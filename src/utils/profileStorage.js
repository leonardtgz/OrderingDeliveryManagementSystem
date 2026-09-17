const PROFILE_KEY = "goldenpr_customer_profile";

const DEFAULT_PROFILE = {
  fullName: "Maria Santos",
  phoneNumber: "0917-555-0192",
  address:
    "Block 4, Lot 12, Phase 2\nSunnyvale Subdivision\nBrgy. San Jose, Antipolo",
};

export const getProfile = () => {
  try {
    const savedProfile =
      localStorage.getItem(PROFILE_KEY);

    if (!savedProfile) {
      return DEFAULT_PROFILE;
    }

    const profile = JSON.parse(savedProfile);

    return {
      ...DEFAULT_PROFILE,
      ...profile,
    };
  } catch (error) {
    console.error(
      "Failed to load profile:",
      error,
    );

    return DEFAULT_PROFILE;
  }
};

export const saveProfile = (profile) => {
  localStorage.setItem(
    PROFILE_KEY,
    JSON.stringify(profile),
  );

  // Update all profile pages in the same tab.
  window.dispatchEvent(
    new Event("profileUpdated"),
  );
};

export const updateProfile = (changes) => {
  const currentProfile = getProfile();

  const updatedProfile = {
    ...currentProfile,
    ...changes,
  };

  saveProfile(updatedProfile);

  return updatedProfile;
};