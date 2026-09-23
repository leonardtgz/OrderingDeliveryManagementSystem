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

  const [agreedToTerms, setAgreedToTerms] =
    useState(false);

  const [activeLegalDocument, setActiveLegalDocument] =
    useState(null);

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

    if (!agreedToTerms) {
      alert(
        "Please agree to the Privacy Notice and Terms & Conditions before creating your account."
      );
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

                {/* Privacy Notice / Terms Agreement */}
                <div className="mt-1 rounded-sm border border-border-light bg-background-lightBlue/50 p-3">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) =>
                        setAgreedToTerms(
                          e.target.checked
                        )
                      }
                      className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-primary-background"
                    />

                    <span className="text-xs leading-5 text-text-secondary">
                      I have read and agree to the{" "}
                      <button
                        type="button"
                        onClick={() =>
                          setActiveLegalDocument(
                            "privacy"
                          )
                        }
                        className="font-semibold text-text-accent underline underline-offset-2 hover:opacity-70"
                      >
                        Privacy Notice
                      </button>{" "}
                      and{" "}
                      <button
                        type="button"
                        onClick={() =>
                          setActiveLegalDocument(
                            "terms"
                          )
                        }
                        className="font-semibold text-text-accent underline underline-offset-2 hover:opacity-70"
                      >
                        Terms & Conditions
                      </button>
                      .
                    </span>
                  </label>
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

      {/* ========================================
          LEGAL INFORMATION MODAL
      ======================================== */}

      {activeLegalDocument && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 py-6"
          onClick={() =>
            setActiveLegalDocument(null)
          }
        >
          <div
            className="flex max-h-[85vh] w-full max-w-[650px] flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border-light px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-bold text-text-primary sm:text-xl">
                  {activeLegalDocument ===
                  "privacy"
                    ? "Privacy Notice"
                    : "Terms & Conditions"}
                </h2>

                <p className="mt-1 text-xs text-text-secondary">
                  GoldenPR Water Delivery System
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setActiveLegalDocument(null)
                }
                className="flex h-8 w-8 items-center justify-center rounded-full text-xl text-text-secondary transition-colors hover:bg-background-lightBlue hover:text-text-primary"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto px-5 py-5 text-sm leading-6 text-text-secondary sm:px-6">

              {/* ================= PRIVACY NOTICE ================= */}

              {activeLegalDocument ===
                "privacy" && (
                <div className="flex flex-col gap-5">
                  <section>
                    <h3 className="mb-2 font-bold text-text-primary">
                      1. Who We Are
                    </h3>

                    <p>
                      GoldenPR operates a water
                      delivery ordering system that
                      allows customers to create
                      accounts, browse available water
                      products, place orders, provide
                      delivery information, and monitor
                      order status.
                    </p>

                    <p className="mt-2">
                      GoldenPR is responsible for the
                      personal information processed
                      through this system in accordance
                      with applicable Philippine data
                      privacy laws.
                    </p>
                  </section>

                  <section>
                    <h3 className="mb-2 font-bold text-text-primary">
                      2. Personal Information We Collect
                    </h3>

                    <p>
                      When you create and use a GoldenPR
                      account, we may collect:
                    </p>

                    <ul className="mt-2 list-disc space-y-1 pl-5">
                      <li>Full name</li>
                      <li>Contact number</li>
                      <li>Email address</li>
                      <li>Delivery address</li>
                      <li>Account credentials</li>
                      <li>
                        Order and transaction
                        information
                      </li>
                      <li>
                        Delivery schedule and delivery
                        status
                      </li>
                      <li>
                        Information you provide when
                        contacting GoldenPR
                      </li>
                    </ul>

                    <p className="mt-2">
                      GoldenPR aims to collect only
                      personal information that is
                      adequate, relevant, and necessary
                      for the purposes for which it is
                      processed.
                    </p>
                  </section>

                  <section>
                    <h3 className="mb-2 font-bold text-text-primary">
                      3. Why We Process Your Information
                    </h3>

                    <p>
                      Your information may be processed
                      to:
                    </p>

                    <ul className="mt-2 list-disc space-y-1 pl-5">
                      <li>
                        Create and manage your GoldenPR
                        account
                      </li>
                      <li>
                        Process and fulfill water
                        delivery orders
                      </li>
                      <li>
                        Confirm orders and delivery
                        schedules
                      </li>
                      <li>
                        Deliver products to your
                        requested address
                      </li>
                      <li>
                        Contact you regarding your
                        order
                      </li>
                      <li>
                        Provide order tracking and
                        order history
                      </li>
                      <li>
                        Respond to customer concerns
                        and requests
                      </li>
                      <li>
                        Maintain records necessary for
                        legitimate business and legal
                        purposes
                      </li>
                      <li>
                        Protect the security and proper
                        operation of the GoldenPR
                        system
                      </li>
                      <li>
                        Comply with applicable laws and
                        regulations
                      </li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="mb-2 font-bold text-text-primary">
                      4. Lawful Processing
                    </h3>

                    <p>
                      Personal information will be
                      processed only when there is a
                      lawful basis under applicable
                      Philippine data privacy laws.
                      Depending on the processing
                      activity, this may include the
                      performance of a contract, steps
                      requested by the customer,
                      compliance with a legal obligation,
                      protection of legitimate interests,
                      or consent when consent is
                      required.
                    </p>
                  </section>

                  <section>
                    <h3 className="mb-2 font-bold text-text-primary">
                      5. Information Used for Delivery
                    </h3>

                    <p>
                      Information such as your name,
                      contact number, delivery address,
                      and order details may be accessed
                      by authorized GoldenPR personnel
                      who need the information to
                      prepare, coordinate, and complete
                      your water delivery.
                    </p>
                  </section>

                  <section>
                    <h3 className="mb-2 font-bold text-text-primary">
                      6. Data Sharing and Disclosure
                    </h3>

                    <p>
                      GoldenPR will not disclose your
                      personal information to unrelated
                      third parties for purposes
                      incompatible with this Privacy
                      Notice.
                    </p>

                    <p className="mt-2">
                      Information may be disclosed when
                      necessary to fulfill your order,
                      operate the service, comply with a
                      legal obligation, respond to a
                      lawful request, or protect the
                      rights, security, and legitimate
                      interests of GoldenPR and its
                      customers.
                    </p>
                  </section>

                  <section>
                    <h3 className="mb-2 font-bold text-text-primary">
                      7. Data Retention
                    </h3>

                    <p>
                      GoldenPR will retain personal
                      information only for as long as
                      reasonably necessary to fulfill the
                      purposes for which it was collected,
                      comply with applicable legal
                      obligations, resolve disputes,
                      maintain appropriate business
                      records, or establish, exercise,
                      or defend legal claims.
                    </p>

                    <p className="mt-2">
                      When personal information is no
                      longer necessary, it should be
                      securely deleted, anonymized, or
                      otherwise disposed of in accordance
                      with applicable requirements.
                    </p>
                  </section>

                  <section>
                    <h3 className="mb-2 font-bold text-text-primary">
                      8. Data Security
                    </h3>

                    <p>
                      GoldenPR will implement reasonable
                      and appropriate organizational,
                      physical, and technical measures
                      designed to protect personal
                      information against unauthorized
                      access, alteration, disclosure,
                      loss, or other unlawful processing.
                    </p>

                    <p className="mt-2">
                      Customers should also protect
                      their account credentials and
                      should not share their passwords
                      with other persons.
                    </p>
                  </section>

                  <section>
                    <h3 className="mb-2 font-bold text-text-primary">
                      9. Your Rights as a Data Subject
                    </h3>

                    <p>
                      Subject to applicable law and
                      limitations, you may have the
                      right to:
                    </p>

                    <ul className="mt-2 list-disc space-y-1 pl-5">
                      <li>
                        Be informed about the processing
                        of your personal information
                      </li>
                      <li>
                        Access personal information
                        being processed about you
                      </li>
                      <li>
                        Request correction of inaccurate
                        or incomplete information
                      </li>
                      <li>
                        Object to certain processing
                      </li>
                      <li>
                        Request erasure or blocking when
                        legally applicable
                      </li>
                      <li>
                        Request data portability when
                        applicable
                      </li>
                      <li>
                        File a complaint concerning the
                        processing of your personal
                        information
                      </li>
                      <li>
                        Seek damages where provided by
                        law
                      </li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="mb-2 font-bold text-text-primary">
                      10. Privacy Concerns
                    </h3>

                    <p>
                      For questions, requests concerning
                      your personal information, or
                      privacy concerns, customers should
                      contact the GoldenPR administrator
                      or designated privacy contact
                      through the contact information
                      provided by GoldenPR.
                    </p>

                    <p className="mt-2">
                      Where applicable, customers may
                      also have the right to lodge a
                      complaint with the National
                      Privacy Commission, subject to
                      applicable procedures.
                    </p>
                  </section>

                  <section>
                    <h3 className="mb-2 font-bold text-text-primary">
                      11. Changes to This Privacy Notice
                    </h3>

                    <p>
                      GoldenPR may update this Privacy
                      Notice when necessary because of
                      changes to the system, services,
                      processing activities, or
                      applicable laws. Where required,
                      users will be provided appropriate
                      notice of material changes.
                    </p>
                  </section>
                </div>
              )}

              {/* ================= TERMS & CONDITIONS ================= */}

              {activeLegalDocument ===
                "terms" && (
                <div className="flex flex-col gap-5">
                  <section>
                    <h3 className="mb-2 font-bold text-text-primary">
                      1. Account Registration
                    </h3>

                    <p>
                      You must provide accurate,
                      complete, and current information
                      when creating a GoldenPR account.
                      You are responsible for keeping
                      your account information updated.
                    </p>
                  </section>

                  <section>
                    <h3 className="mb-2 font-bold text-text-primary">
                      2. Account Security
                    </h3>

                    <p>
                      You are responsible for maintaining
                      the confidentiality of your account
                      credentials and for activities
                      conducted through your account.
                      Notify GoldenPR promptly if you
                      believe your account has been
                      accessed or used without
                      authorization.
                    </p>
                  </section>

                  <section>
                    <h3 className="mb-2 font-bold text-text-primary">
                      3. Ordering Products
                    </h3>

                    <p>
                      GoldenPR allows registered
                      customers to select available
                      water products, specify quantities,
                      provide delivery information,
                      select an available delivery
                      schedule, and submit orders through
                      the system.
                    </p>

                    <p className="mt-2">
                      Before confirming an order, you
                      should review the selected products,
                      quantities, delivery address,
                      schedule, applicable fees, and
                      total amount.
                    </p>
                  </section>

                  <section>
                    <h3 className="mb-2 font-bold text-text-primary">
                      4. Product Availability and Pricing
                    </h3>

                    <p>
                      Products, prices, availability, and
                      delivery schedules displayed in the
                      system may be subject to change.
                      GoldenPR aims to provide customers
                      with clear and accurate information
                      about products and applicable
                      charges.
                    </p>

                    <p className="mt-2">
                      Nothing in these Terms is intended
                      to remove or limit consumer rights
                      that cannot lawfully be waived under
                      Philippine law.
                    </p>
                  </section>

                  <section>
                    <h3 className="mb-2 font-bold text-text-primary">
                      5. Order Confirmation
                    </h3>

                    <p>
                      An order submitted through GoldenPR
                      is subject to confirmation and
                      fulfillment based on product
                      availability and operational
                      conditions.
                    </p>

                    <p className="mt-2">
                      GoldenPR may contact you using the
                      contact information associated with
                      your account when clarification or
                      coordination is necessary.
                    </p>
                  </section>

                  <section>
                    <h3 className="mb-2 font-bold text-text-primary">
                      6. Delivery
                    </h3>

                    <p>
                      Customers are responsible for
                      providing a complete and accurate
                      delivery address and a working
                      contact number.
                    </p>

                    <p className="mt-2">
                      Estimated delivery times are
                      provided for scheduling and
                      coordination and may be affected
                      by circumstances such as traffic,
                      weather, product availability,
                      operational conditions, or other
                      circumstances beyond reasonable
                      control.
                    </p>
                  </section>

                  <section>
                    <h3 className="mb-2 font-bold text-text-primary">
                      7. Order Status and Tracking
                    </h3>

                    <p>
                      GoldenPR may display order statuses
                      such as:
                    </p>

                    <ul className="mt-2 list-disc space-y-1 pl-5">
                      <li>Pending</li>
                      <li>Confirmed</li>
                      <li>Out for Delivery</li>
                      <li>Delivered</li>
                      <li>Cancelled</li>
                    </ul>

                    <p className="mt-2">
                      These statuses are intended to
                      provide customers with information
                      about the progress of their orders.
                    </p>
                  </section>

                  <section>
                    <h3 className="mb-2 font-bold text-text-primary">
                      8. Cancellation, Refunds, and Remedies
                    </h3>

                    <p>
                      Order cancellation, refund,
                      replacement, or other remedies will
                      be handled according to GoldenPR's
                      applicable procedures and the rights
                      available under Philippine law.
                    </p>

                    <p className="mt-2">
                      Nothing in these Terms is intended
                      to remove or limit consumer rights
                      that cannot lawfully be waived.
                      Applicable Philippine consumer
                      protections remain applicable where
                      relevant.
                    </p>
                  </section>

                  <section>
                    <h3 className="mb-2 font-bold text-text-primary">
                      9. Product Quality and Consumer Protection
                    </h3>

                    <p>
                      GoldenPR aims to provide products
                      and services in accordance with
                      applicable Philippine consumer
                      protection, product quality, and
                      safety requirements.
                    </p>

                    <p className="mt-2">
                      Customers may raise concerns
                      regarding an order, product,
                      delivery, or service through
                      GoldenPR's available customer
                      support channels.
                    </p>
                  </section>

                  <section>
                    <h3 className="mb-2 font-bold text-text-primary">
                      10. Customer Complaints
                    </h3>

                    <p>
                      Customers may contact GoldenPR
                      regarding concerns about their
                      orders or transactions. GoldenPR
                      should provide an appropriate
                      channel for receiving and addressing
                      customer complaints.
                    </p>

                    <p className="mt-2">
                      Philippine consumer law provides
                      mechanisms for consumer complaints
                      and remedies, including applicable
                      processes administered by the
                      Department of Trade and Industry.
                    </p>
                  </section>

                  <section>
                    <h3 className="mb-2 font-bold text-text-primary">
                      11. Prohibited Use
                    </h3>

                    <p>
                      Customers must not:
                    </p>

                    <ul className="mt-2 list-disc space-y-1 pl-5">
                      <li>
                        Provide false or misleading
                        information
                      </li>
                      <li>
                        Use another person's account
                        without authorization
                      </li>
                      <li>
                        Attempt to access another
                        customer's information
                      </li>
                      <li>
                        Interfere with the operation or
                        security of the system
                      </li>
                      <li>
                        Use the system for fraudulent or
                        unlawful purposes
                      </li>
                      <li>
                        Attempt to manipulate orders,
                        prices, statuses, or other system
                        information
                      </li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="mb-2 font-bold text-text-primary">
                      12. Privacy
                    </h3>

                    <p>
                      The collection and processing of
                      personal information through
                      GoldenPR are governed by the
                      GoldenPR Privacy Notice and
                      applicable Philippine data privacy
                      laws.
                    </p>
                  </section>

                  <section>
                    <h3 className="mb-2 font-bold text-text-primary">
                      13. Changes to These Terms
                    </h3>

                    <p>
                      GoldenPR may update these Terms
                      when necessary due to changes in
                      its services, system functionality,
                      or applicable laws. Where
                      appropriate, customers will be
                      notified of material changes.
                    </p>
                  </section>

                  <section>
                    <h3 className="mb-2 font-bold text-text-primary">
                      14. Applicable Law
                    </h3>

                    <p>
                      These Terms are intended to be
                      interpreted consistently with
                      applicable laws and regulations of
                      the Republic of the Philippines.
                    </p>
                  </section>

                  <section>
                    <h3 className="mb-2 font-bold text-text-primary">
                      15. Customer Agreement
                    </h3>

                    <p>
                      By creating a GoldenPR account,
                      you confirm that you have read and
                      understood these Terms & Conditions
                      and acknowledge the GoldenPR Privacy
                      Notice.
                    </p>
                  </section>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-border-light bg-background-main px-5 py-4 sm:px-6">
              <button
                type="button"
                onClick={() =>
                  setActiveLegalDocument(null)
                }
                className="w-full rounded-sm bg-button-background px-4 py-3 text-xs font-bold tracking-[0.5px] text-button-text transition-colors hover:bg-button-hover"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthBackground>
  );
}

export default SignUp;