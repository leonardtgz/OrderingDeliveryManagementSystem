import AuthBackground from "../../components/AuthBackground";

import { useState } from "react";

import { Link } from "react-router-dom";

import Button from "../../components/ui/Button";

function SignUp() {
  const [formData, setFormData] = useState({
    fullName: "",
    contactNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    deliveryAddress: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const passwordRequirements = [
    {
      label: "At least 8 characters",
      valid: formData.password.length >= 8,
    },
    {
      label: "At least one uppercase letter",
      valid: /[A-Z]/.test(formData.password),
    },
    {
      label: "At least one lowercase letter",
      valid: /[a-z]/.test(formData.password),
    },
    {
      label: "At least one number",
      valid: /[0-9]/.test(formData.password),
    },
    {
      label: "At least one special character",
      valid: /[^A-Za-z0-9]/.test(formData.password),
    },
  ];

  const isPasswordValid =
    passwordRequirements.every(
      (requirement) => requirement.valid
    );

  const passwordsMatch =
    formData.confirmPassword.length > 0 &&
    formData.password ===
      formData.confirmPassword;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isPasswordValid) {
      alert(
        "Please meet all password requirements."
      );
      return;
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      alert("Passwords do not match.");
      return;
    }

    const newCustomer = {
      id: crypto.randomUUID(),
      name: formData.fullName,
      contact: formData.contactNumber,
      email: formData.email,
      address: formData.deliveryAddress,
      orders: 0,
      status: "Active",
    };

    const savedCustomers =
      localStorage.getItem("adminCustomers");

    let customers = [];

    if (savedCustomers) {
      try {
        customers = JSON.parse(
          savedCustomers
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
      ])
    );

    console.log(
      "Registration:",
      formData
    );

    alert("Registration successful!");
  };

  const inputClass =
    "w-full rounded-sm border border-gray-300 bg-input-background px-3 py-3 text-sm text-input-text placeholder:text-input-text focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <AuthBackground>
      <div className="flex min-h-screen flex-col">
        <main className="flex flex-1 items-center justify-center px-4 py-8">
          <div className="w-full max-w-[480px]">
            <div className="flex w-full flex-col items-center justify-center gap-4 rounded-md border border-border-light bg-background-main p-4 sm:p-6">

              {/* Form Header */}
              <div className="flex w-full flex-col items-center gap-2">
                <h1 className="text-center text-2xl font-bold text-text-primary">
                  Register
                </h1>

                <p className="text-center text-sm text-text-secondary">
                  Create an account to order water delivery.
                </p>
              </div>

              {/* Registration Form */}
              <form
                onSubmit={handleSubmit}
                className="flex w-full flex-col gap-4"
              >
                {/* Full Name */}
                <div className="flex w-full flex-col gap-1">
                  <label
                    htmlFor="fullName"
                    className="text-xs font-bold text-text-primary"
                  >
                    Full Name
                  </label>

                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Juan Dela Cruz"
                    className={inputClass}
                    required
                  />
                </div>

                {/* Contact Number */}
                <div className="flex w-full flex-col gap-1">
                  <label
                    htmlFor="contactNumber"
                    className="text-xs font-bold text-text-primary"
                  >
                    Contact Number (PH)
                  </label>

                  <input
                    type="tel"
                    id="contactNumber"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    placeholder="0917 123 4567"
                    className={inputClass}
                    required
                  />
                </div>

                {/* Email */}
                <div className="flex w-full flex-col gap-1">
                  <label
                    htmlFor="email"
                    className="text-xs font-bold text-text-primary"
                  >
                    Email
                  </label>

                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="juan@example.com"
                    className={inputClass}
                    required
                  />
                </div>

                {/* Password */}
                <div className="flex w-full flex-col gap-1">
                  <label
                    htmlFor="password"
                    className="text-xs font-bold text-text-primary"
                  >
                    Password
                  </label>

                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={inputClass}
                    required
                  />

                  {formData.password.length > 0 && (
                    <div className="mt-1 rounded-sm bg-background-lightBlue px-3 py-2">
                      <p className="mb-1.5 text-xs font-semibold text-text-primary">
                        Password must contain:
                      </p>

                      <div className="flex flex-col gap-1">
                        {passwordRequirements.map(
                          (requirement) => (
                            <p
                              key={requirement.label}
                              className={`text-xs ${
                                requirement.valid
                                  ? "text-green-600"
                                  : "text-red-500"
                              }`}
                            >
                              {requirement.valid
                                ? "✓"
                                : "✕"}{" "}
                              {requirement.label}
                            </p>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="flex w-full flex-col gap-1">
                  <label
                    htmlFor="confirmPassword"
                    className="text-xs font-bold text-text-primary"
                  >
                    Confirm Password
                  </label>

                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={
                      formData.confirmPassword
                    }
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={inputClass}
                    required
                  />

                  {formData.confirmPassword.length >
                    0 && (
                    <p
                      className={`mt-1 text-xs ${
                        passwordsMatch
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {passwordsMatch
                        ? "✓ Passwords match."
                        : "✕ Passwords do not match."}
                    </p>
                  )}
                </div>

                {/* Delivery Address */}
                <div className="flex w-full flex-col gap-1">
                  <label
                    htmlFor="deliveryAddress"
                    className="text-xs font-bold text-text-primary"
                  >
                    Delivery Address
                  </label>

                  <textarea
                    id="deliveryAddress"
                    name="deliveryAddress"
                    value={
                      formData.deliveryAddress
                    }
                    onChange={handleChange}
                    placeholder="Unit/House No., Street, Barangay, City, Province, Zip Code"
                    rows="3"
                    className={`${inputClass} resize-none`}
                    required
                  />
                </div>

                {/* Buttons */}
                <div className="mt-2 flex w-full flex-col gap-3">
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                  >
                    REGISTER
                  </Button>

                  <Link
                    to="/login"
                    className="w-full"
                  >
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                    >
                      BACK TO LOGIN
                    </Button>
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </AuthBackground>
  );
}

export default SignUp;