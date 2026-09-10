import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Customer pages
import Home from "./pages/customer/Home";
import Products from "./pages/customer/Products";
import OrderReview from "./pages/customer/OrderReview";
import EditOrder from "./pages/customer/EditOrder";
import OrderSummary from "./pages/customer/Ordersummary";
import OrderSuccessful from "./pages/customer/OrderSuccessful";
import Orders from "./pages/customer/Orders";




// Authentication pages
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import ResetPassword from "./pages/auth/ResetPassword";

// Admin pages
import Dashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AddProduct from "./pages/admin/Addproduct";
import EditAdminProduct from "./pages/admin/EditAdminProduct";
import Customers from "./pages/admin/Customers";
import ViewCustomer from "./pages/admin/ViewCustomer";
import AddCustomer from "./pages/admin/AddCustomer";
import OrderDetails from "./pages/customer/OrderDetails";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Root → Login */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Customer */}
        <Route path="/customer/home" element={<Home />} />
        <Route path="/customer/products" element={<Products />} />
        <Route path="/customer/order-review" element={<OrderReview />} />
        <Route path="/customer/edit-order" element={<EditOrder />} />
        <Route path="/customer/order-summary" element={<OrderSummary />} />
        <Route path="/customer/order-successful" element={<OrderSuccessful />} />
        <Route path="/customer/orders" element={<Orders />} />
        <Route path="/customer/order-details" element={<OrderDetails />} />
        


        {/* Admin */}
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/products/new" element={<AddProduct />} />
        <Route path="/admin/products/edit/:id" element={<EditAdminProduct />} />
        <Route path="/admin/customers" element={<Customers />} />
        <Route path="/admin/customers/:id" element={<ViewCustomer />}/>
        <Route path="/admin/customers/new" element={<AddCustomer />} />

        {/* Unknown URL → Login */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;