import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import Header from "../../components/Header/Header";

const PRODUCT_STATUSES = [
  "In Stock",
  "Low Stock",
  "Out of Stock",
];

function EditAdminProduct() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("In Stock");

  useEffect(() => {
    const savedProducts = localStorage.getItem("adminProducts");

    if (!savedProducts) {
      navigate("/admin/products");
      return;
    }

    try {
      const products = JSON.parse(savedProducts);
      const product = products.find(
        (item) => String(item.id) === String(id)
      );

      if (!product) {
        navigate("/admin/products");
        return;
      }

      setName(product.name || "");
      setDescription(product.description || "");
      setQuantity(product.quantity ?? "");
      setPrice(product.price ?? "");
      setStatus(product.status || "In Stock");
    } catch {
      navigate("/admin/products");
    }
  }, [id, navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const savedProducts = localStorage.getItem("adminProducts");

    if (!savedProducts) {
      navigate("/admin/products");
      return;
    }

    try {
      const products = JSON.parse(savedProducts);

      const updatedProducts = products.map((product) =>
        String(product.id) === String(id)
          ? {
              ...product,
              name,
              description,
              quantity: Number(quantity) || 0,
              price: Number(price) || 0,
              status,
            }
          : product
      );

      localStorage.setItem(
        "adminProducts",
        JSON.stringify(updatedProducts)
      );

      navigate("/admin/products");
    } catch {
      navigate("/admin/products");
    }
  };

  const handleCancel = () => {
    navigate("/admin/products");
  };

  return (
    <div className="flex min-h-screen w-full bg-background-main">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main application area */}
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />

        {/* Page Content */}
        <main className="min-w-0 flex-1 overflow-y-auto">
          <div className="w-full px-8 py-8 lg:px-12">
            {/* Page Header */}
            <div className="mb-6">
              <button
                type="button"
                onClick={handleCancel}
                className="mb-1 block text-sm font-semibold uppercase tracking-[0.7px] text-text-accent hover:underline"
              >
                ← Back to Products
              </button>

              <h1 className="text-3xl font-bold leading-10 tracking-[-0.32px] text-text-primary">
                Edit Product
              </h1>
            </div>

            {/* Edit Product Form */}
            <form
              onSubmit={handleSubmit}
              className="block w-full max-w-[650px] rounded-xl border border-card-border bg-card-background p-7 shadow-card"
            >
              <div className="flex w-full flex-col gap-5">
                {/* Product Name */}
                <div className="flex w-full flex-col gap-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-semibold text-text-primary"
                  >
                    Product Name
                  </label>

                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Slim Gallon Refill"
                    required
                    className="box-border w-full rounded-lg border border-border-secondary bg-background-card px-3 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-primary"
                  />
                </div>

                {/* Description */}
                <div className="flex w-full flex-col gap-2">
                  <label
                    htmlFor="description"
                    className="text-sm font-semibold text-text-primary"
                  >
                    Description
                  </label>

                  <input
                    id="description"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Purified Drinking Water"
                    required
                    className="box-border w-full rounded-lg border border-border-secondary bg-background-card px-3 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-primary"
                  />
                </div>

                {/* Quantity and Price */}
                <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* Available Quantity */}
                  <div className="flex w-full flex-col gap-2">
                    <label
                      htmlFor="quantity"
                      className="text-sm font-semibold text-text-primary"
                    >
                      Available Quantity
                    </label>

                    <input
                      id="quantity"
                      type="number"
                      min="0"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="0"
                      required
                      className="box-border w-full rounded-lg border border-border-secondary bg-background-card px-3 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-primary"
                    />
                  </div>

                  {/* Price */}
                  <div className="flex w-full flex-col gap-2">
                    <label
                      htmlFor="price"
                      className="text-sm font-semibold text-text-primary"
                    >
                      Price (₱)
                    </label>

                    <input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00"
                      required
                      className="box-border w-full rounded-lg border border-border-secondary bg-background-card px-3 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-primary"
                    />
                  </div>
                </div>

                {/* Status */}
                <div className="flex w-full flex-col gap-2">
                  <label
                    htmlFor="status"
                    className="text-sm font-semibold text-text-primary"
                  >
                    Status
                  </label>

                  <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="box-border w-full rounded-lg border border-border-secondary bg-background-card px-3 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-primary"
                  >
                    {PRODUCT_STATUSES.map((productStatus) => (
                      <option
                        key={productStatus}
                        value={productStatus}
                      >
                        {productStatus}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Buttons */}
                <div className="flex w-full items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="rounded-lg border border-border-secondary px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.7px] text-text-accent transition-colors hover:bg-background-lightBlue"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="rounded-lg bg-button-background px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.7px] text-white shadow-sm transition-colors hover:bg-button-hover"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

export default EditAdminProduct;