import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

// Always-loaded (tiny, structural components)
import Navbar from "./components/Navbar";
import OfferBanner from "./components/OfferBanner";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./routes/AdminProtectedRoute";
import AdminLayout from "./components/Admin/AdminLayout";
import "./components/playfair.css";
import { ThemeProvider } from "./context/ThemeContext";
import { AdminProvider } from "./context/AdminContext";

// Lazy-loaded pages — only downloaded when the user navigates to them
const Login          = lazy(() => import("./pages/Login"));
const Signup         = lazy(() => import("./pages/Signup"));
const Home           = lazy(() => import("./pages/Home"));
const Cart           = lazy(() => import("./pages/Cart"));
const Orders         = lazy(() => import("./pages/Orders"));
const Checkout       = lazy(() => import("./pages/Checkout"));
const Placeholder    = lazy(() => import("./pages/PlaceHolder"));

const AdminDashboard    = lazy(() => import("./pages/Admin/Dashboard"));
const AdminProducts     = lazy(() => import("./pages/Admin/Products"));
const AdminOrders       = lazy(() => import("./pages/Admin/Orders"));
const CompletedOrders   = lazy(() => import("./pages/Admin/CompletedOrders"));
const CancelledOrders   = lazy(() => import("./pages/Admin/CancelledOrders"));
const AdminBanners      = lazy(() => import("./pages/Admin/Banner"));
const AdminUsers        = lazy(() => import("./pages/Admin/Users"));

// Full-page loading spinner shown while a lazy chunk is being fetched
function PageLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white gap-4">
      <div className="relative">
        <div className="h-12 w-12 rounded-md border-2 border-gray-100" />
        <div className="absolute inset-0 h-12 w-12 animate-spin rounded-md border-2 border-transparent border-t-black" />
      </div>
      <p className="text-xs font-black text-gray-300 uppercase tracking-widest">Loading…</p>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AdminProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/"        element={<><Navbar /><OfferBanner /><Home /></>} />
              <Route path="/login"   element={<><Navbar /><Login /></>} />
              <Route path="/signup"  element={<><Navbar /><Signup /></>} />

              <Route path="/cart" element={
                <ProtectedRoute><Navbar /><Cart /></ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute><Navbar /><Orders /></ProtectedRoute>
              } />
              <Route path="/checkout" element={
                <ProtectedRoute><Navbar /><Checkout /></ProtectedRoute>
              } />

              {/* Admin Routes with nested Layout */}
              <Route path="/admin" element={
                <AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>
              }>
                <Route index                      element={<AdminDashboard />} />
                <Route path="banner"              element={<AdminBanners />} />
                <Route path="products"            element={<AdminProducts />} />
                <Route path="orders"              element={<AdminOrders />} />
                <Route path="completed-orders"    element={<CompletedOrders />} />
                <Route path="cancelled-orders"    element={<CancelledOrders />} />
                <Route path="users"               element={<AdminUsers />} />
              </Route>

              <Route path="*" element={<><Navbar /><Placeholder /></>} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AdminProvider>
    </ThemeProvider>
  );
}

export default App;
