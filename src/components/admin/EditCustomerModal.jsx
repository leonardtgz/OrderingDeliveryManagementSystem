import React from "react";
import { AlertTriangle, X } from "lucide-react";

export default function EditCustomerModal({
  customer,
  updatedCustomer,
  onCancel,
  onConfirm,
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">

      <div className="w-full max-w-[500px] rounded-xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-start justify-between border-b border-border-light px-6 py-5">

          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFF4D6] text-[#C58A00]">
              <AlertTriangle size={20} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-text-primary">
                Confirm Changes
              </h2>

              <p className="mt-1 text-sm text-text-secondary">
                You are about to update this customer's information.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg p-1 text-text-secondary hover:bg-background-accent"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5">

          <p className="mb-4 text-sm text-text-secondary">
            Please review the changes before continuing.
          </p>

          <div className="space-y-3 rounded-lg bg-background-accent p-4">

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Customer
              </p>

              <p className="mt-1 font-semibold text-text-primary">
                {customer.name}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Name
              </p>

              <p className="mt-1 text-sm text-text-primary">
                {updatedCustomer.name}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Contact Number
              </p>

              <p className="mt-1 text-sm text-text-primary">
                {updatedCustomer.contact}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Email
              </p>

              <p className="mt-1 break-all text-sm text-text-primary">
                {updatedCustomer.email}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Address
              </p>

              <p className="mt-1 text-sm leading-5 text-text-primary">
                {updatedCustomer.address}
              </p>
            </div>
          </div>

          <p className="mt-4 text-xs leading-5 text-text-secondary">
            Saving these changes will update the customer's information
            throughout the customer management section.
          </p>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-3 border-t border-border-light px-6 py-5 sm:flex-row sm:justify-end">

          <button
            type="button"
            onClick={onCancel}
            className="h-11 rounded-lg border border-border-secondary bg-white px-5 text-sm font-semibold text-text-primary hover:bg-background-accent"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="h-11 rounded-lg bg-button-background px-5 text-sm font-semibold text-white hover:bg-button-hover"
          >
            Confirm Changes
          </button>
        </div>
      </div>
    </div>
  );
}