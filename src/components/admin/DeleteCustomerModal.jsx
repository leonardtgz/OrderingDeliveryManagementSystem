import React from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";

export default function DeleteCustomerModal({
  customer,
  onCancel,
  onConfirm,
}) {
  if (!customer) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">

      <div className="w-full max-w-[460px] rounded-xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6">

          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
              <AlertTriangle size={20} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-text-primary">
                Delete Customer
              </h2>

              <p className="mt-1 text-sm text-text-secondary">
                This action requires confirmation.
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
        <div className="px-6 py-6">

          <p className="text-sm leading-6 text-text-primary">
            Are you sure you want to delete
            <span className="font-bold">
              {" "}{customer.name}
            </span>
            ?
          </p>

          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">

            <div className="flex gap-3">
              <Trash2
                size={18}
                className="mt-0.5 shrink-0 text-red-600"
              />

              <p className="text-sm leading-5 text-red-700">
                This customer will be removed from the customer
                management list. This action cannot be undone.
              </p>
            </div>
          </div>
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
            className="flex h-11 items-center justify-center gap-2 rounded-lg bg-red-600 px-5 text-sm font-semibold text-white hover:bg-red-700"
          >
            <Trash2 size={16} />
            Delete Customer
          </button>
        </div>
      </div>
    </div>
  );
}