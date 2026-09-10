import React from "react";

function WarningModal({
  isOpen,
  type,
  product,
  onCancel,
  onConfirm,
}) {
  if (!isOpen) {
    return null;
  }

  const isEdit = type === "edit";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-[420px] rounded-xl bg-white p-6 shadow-2xl">
        {/* Warning Icon */}
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF4E5]">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 9V13"
              stroke="#F59E0B"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M12 17.01L12.01 16.9989"
              stroke="#F59E0B"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M10.29 3.86L1.82 18C1.64 18.31 1.55 18.47 1.52 18.64C1.37 19.31 1.66 20 2.25 20.34C2.4 20.43 2.58 20.46 2.94 20.5H21.06C21.42 20.46 21.6 20.43 21.75 20.34C22.34 20 22.63 19.31 22.48 18.64C22.45 18.47 22.36 18.31 22.18 18L13.71 3.86C13.53 3.55 13.44 3.39 13.27 3.28C12.51 2.8 11.49 2.8 10.73 3.28C10.56 3.39 10.47 3.55 10.29 3.86Z"
              stroke="#F59E0B"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-center text-lg font-bold text-text-primary">
          {isEdit ? "Edit Product?" : "Delete Product?"}
        </h2>

        {/* Message */}
        <p className="mt-2 text-center text-sm leading-6 text-text-secondary">
          {isEdit
            ? `Are you sure you want to edit ${
                product?.name || "this product"
              }?`
            : `Are you sure you want to delete ${
                product?.name || "this product"
              }? This action cannot be undone.`}
        </p>

        {/* Buttons */}
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex h-10 flex-1 items-center justify-center rounded-lg border border-border-secondary bg-white text-xs font-bold uppercase tracking-[0.6px] text-text-secondary shadow-sm transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className={`flex h-10 flex-1 items-center justify-center rounded-lg text-xs font-bold uppercase tracking-[0.6px] text-white shadow-sm transition-colors ${
              isEdit
                ? "bg-button-background hover:bg-button-hover"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {isEdit ? "Edit" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default WarningModal;