import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Customer pages
import Home from "./pages/customer/Home";
import Products from "./pages/customer/Products";
import OrderReview from "./pages/customer/OrderReview";
import EditOrder from "./pages/customer/EditOrder";
import OrderSummary from "./pages/customer/OrderSummary";
import OrderSuccessful from "./pages/customer/OrderSuccessful";
import OrderDetails from "./pages/customer/OrderDetails";
import Orders from "./pages/customer/Orders";
import Track from "./pages/customer/Track";
import Profile from "./pages/customer/Profile";
import EditProfile from "./pages/customer/EditProfile";
import ChangePassword from "./pages/customer/ChangePassword";
import Notifications from "./pages/customer/Notifications";
import FAQs from "./pages/customer/FAQs";
import ContactSupport from "./pages/customer/ContactSupport";



// Authentication pages
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import ResetPassword from "./pages/auth/ResetPassword";

// Admin pages
import Dashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AddProduct from "./pages/admin/AddProduct";
import EditAdminProduct from "./pages/admin/EditAdminProduct";
import Customers from "./pages/admin/Customers";
import ViewCustomer from "./pages/admin/ViewCustomer";
import AddCustomer from "./pages/admin/AddCustomer";
import AdminOrders from "./pages/admin/Orders";
import Deliveries from "./pages/admin/Deliveries";
import EditCustomer from "./pages/admin/EditCustomer";
import AdminProfile from "./pages/admin/Profile";
import AdminNotifications from "./pages/admin/Notifications";



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
        <Route path="/customer/track" element={<Track />} />
        <Route path="/customer/profile" element={<Profile />} />
        <Route path="/customer/edit-profile" element={<EditProfile />} />
        <Route path="/customer/change-password" element={<ChangePassword />} />
        <Route path="/customer/notifications" element={<Notifications />} />
        <Route path="/customer/faqs" element={<FAQs />} /> 
        <Route path="/customer/contact-support" element={<ContactSupport />} />
        
        
        


        {/* Admin */}
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/products/new" element={<AddProduct />} />
        <Route path="/admin/products/edit/:id" element={<EditAdminProduct />} />
        <Route path="/admin/customers" element={<Customers />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/deliveries" element={<Deliveries />} />
        <Route path="/admin/customers/:id" element={<ViewCustomer />} />
        <Route path="/admin/customers/new" element={<AddCustomer />} />
        <Route path="/admin/customers/:id/edit" element={<EditCustomer />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/admin/notifications" element={<AdminNotifications />} />


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