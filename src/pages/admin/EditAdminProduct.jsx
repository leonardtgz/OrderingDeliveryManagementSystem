import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload } from "lucide-react";

import AdminSidebar from "../../components/admin/AdminSidebar";
import Header from "../../components/Header/Header";
import WarningModal from "../../components/admin/WarningModal";

const PRODUCTS_KEY = "adminProducts";
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const EditAdminProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("In Stock");

  const [image, setImage] = useState("");
  const [imageError, setImageError] = useState("");

  const [saving, setSaving] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    try {
      const savedProducts =
        localStorage.getItem(PRODUCTS_KEY);

      if (!savedProducts) {
        navigate("/admin/products");
        return;
      }

      const products = JSON.parse(savedProducts);

      if (!Array.isArray(products)) {
        navigate("/admin/products");
        return;
      }

      const foundProduct = products.find(
        (item) =>
          String(item.id) === String(id),
      );

      if (!foundProduct) {
        navigate("/admin/products");
        return;
      }

      setProduct(foundProduct);

      setName(foundProduct.name || "");
      setDescription(
        foundProduct.description || "",
      );
      setQuantity(
        foundProduct.quantity ?? 0,
      );
      setPrice(foundProduct.price ?? 0);
      setStatus(
        foundProduct.status || "In Stock",
      );
      setImage(foundProduct.image || "");
    } catch (error) {
      console.error(
        "Failed to load product:",
        error,
      );

      navigate("/admin/products");
    }
  }, [id, navigate]);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setImageError("");

    if (!file.type.startsWith("image/")) {
      setImageError(
        "Please select a valid image file.",
      );

      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setImageError(
        "Image must be 5MB or below.",
      );

      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !name.trim() ||
      !description.trim() ||
      quantity === "" ||
      price === ""
    ) {
      return;
    }

    if (saving) {
      return;
    }

    setShowWarning(true);
  };

  const handleSave = () => {
    if (saving) {
      return;
    }

    setSaving(true);

    try {
      const savedProducts =
        localStorage.getItem(PRODUCTS_KEY);

      if (!savedProducts) {
        alert(
          "Product data could not be found.",
        );

        setSaving(false);
        setShowWarning(false);
        return;
      }

      const products = JSON.parse(
        savedProducts,
      );

      if (!Array.isArray(products)) {
        alert(
          "Product data is invalid.",
        );

        setSaving(false);
        setShowWarning(false);
        return;
      }

      const productExists = products.some(
        (item) =>
          String(item.id) === String(id),
      );

      if (!productExists) {
        alert(
          "The product could not be found.",
        );

        setSaving(false);
        setShowWarning(false);
        return;
      }

      const updatedProducts =
        products.map((item) => {
          if (
            String(item.id) !== String(id)
          ) {
            return item;
          }

          return {
            ...item,
            name: name.trim(),
            description: description.trim(),
            quantity: Number(quantity),
            price: Number(price),
            status,
            image:
              image ||
              item.image ||
              "",
          };
        });

      localStorage.setItem(
        PRODUCTS_KEY,
        JSON.stringify(updatedProducts),
      );

      window.dispatchEvent(
        new Event("productUpdated"),
      );

      setShowWarning(false);

      navigate("/admin/products");
    } catch (error) {
      console.error(
        "Failed to update product:",
        error,
      );

      alert(
        "Failed to save the product changes.",
      );

      setSaving(false);
      setShowWarning(false);
    }
  };

  if (!product) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background-main">
      <AdminSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />

        <main className="flex-1 overflow-y-auto p-4 pb-10 sm:p-6 md:p-8">
          <div className="mx-auto w-full max-w-[1000px]">

            {/* Page Header */}
            <div className="mb-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  navigate("/admin/products")
                }
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-border-light bg-background-card text-text-secondary transition-colors hover:bg-background-accent"
                aria-label="Back to Products"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>

              <div>
                <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">
                  Edit Product
                </h1>

                <p className="mt-1 text-sm text-text-secondary">
                  Update the product information and quantity.
                </p>
              </div>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="rounded-xl border border-border-light bg-background-card p-5 shadow-sm sm:p-6"
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                {/* Product Name */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="product-name"
                    className="text-sm font-semibold text-text-primary"
                  >
                    Product Name
                  </label>

                  <input
                    id="product-name"
                    type="text"
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                    className="h-11 rounded-lg border border-border-secondary bg-background-main px-3 text-sm text-text-primary outline-none transition focus:border-primary-background"
                  />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="product-description"
                    className="text-sm font-semibold text-text-primary"
                  >
                    Description
                  </label>

                  <input
                    id="product-description"
                    type="text"
                    value={description}
                    onChange={(event) =>
                      setDescription(
                        event.target.value,
                      )
                    }
                    className="h-11 rounded-lg border border-border-secondary bg-background-main px-3 text-sm text-text-primary outline-none transition focus:border-primary-background"
                  />
                </div>

                {/* Quantity */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="product-quantity"
                    className="text-sm font-semibold text-text-primary"
                  >
                    Available Quantity
                  </label>

                  <input
                    id="product-quantity"
                    type="number"
                    min="0"
                    value={quantity}
                    onChange={(event) =>
                      setQuantity(
                        event.target.value,
                      )
                    }
                    className="h-11 rounded-lg border border-border-secondary bg-background-main px-3 text-sm text-text-primary outline-none transition focus:border-primary-background"
                  />
                </div>

                {/* Price */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="product-price"
                    className="text-sm font-semibold text-text-primary"
                  >
                    Price
                  </label>

                  <input
                    id="product-price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(event) =>
                      setPrice(
                        event.target.value,
                      )
                    }
                    className="h-11 rounded-lg border border-border-secondary bg-background-main px-3 text-sm text-text-primary outline-none transition focus:border-primary-background"
                  />
                </div>

                {/* Status */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="product-status"
                    className="text-sm font-semibold text-text-primary"
                  >
                    Status
                  </label>

                  <select
                    id="product-status"
                    value={status}
                    onChange={(event) =>
                      setStatus(
                        event.target.value,
                      )
                    }
                    className="h-11 rounded-lg border border-border-secondary bg-background-main px-3 text-sm text-text-primary outline-none transition focus:border-primary-background"
                  >
                    <option value="In Stock">
                      In Stock
                    </option>

                    <option value="Low Stock">
                      Low Stock
                    </option>

                    <option value="Out of Stock">
                      Out of Stock
                    </option>
                  </select>
                </div>

                {/* Image */}
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-sm font-semibold text-text-primary">
                    Product Image
                  </label>

                  <label
                    htmlFor="product-image"
                    className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border-secondary bg-background-main p-5 transition-colors hover:bg-background-accent"
                  >
                    {image ? (
                      <img
                        src={image}
                        alt="Product preview"
                        className="h-[150px] w-full object-contain"
                      />
                    ) : (
                      <>
                        <Upload className="mb-3 h-8 w-8 text-text-secondary" />

                        <span className="text-sm font-semibold text-text-primary">
                          Click to upload product image
                        </span>

                        <span className="mt-1 text-xs text-text-secondary">
                          PNG, JPG, JPEG, or other image files
                        </span>
                      </>
                    )}

                    <input
                      id="product-image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>

                  <p className="text-center text-xs text-text-secondary">
                    Image should be 5MB or below.
                  </p>

                  {imageError && (
                    <p className="text-sm font-medium text-red-600">
                      {imageError}
                    </p>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() =>
                    navigate("/admin/products")
                  }
                  className="rounded-lg border border-border-secondary px-5 py-3 text-sm font-semibold text-text-primary transition-colors hover:bg-background-accent"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-button-background px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-button-hover disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>

      {/* Warning Modal */}
      <WarningModal
        isOpen={showWarning}
        type="edit"
        product={{
          ...product,
          name: name.trim(),
        }}
        onCancel={() =>
          setShowWarning(false)
        }
        onConfirm={handleSave}
      />
    </div>
  );
};

export default EditAdminProduct;