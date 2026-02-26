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
const AdminBanners      = lazy(() => import("./pages/Admin/Banner"));
const AdminUsers        = lazy(() => import("./pages/Admin/Users"));

// Full-page loading spinner shown while a lazy chunk is being fetched
function PageLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-slate-950 gap-5">
      <div className="relative">
        <div className="h-14 w-14 rounded-full border-4 border-rose-100 dark:border-slate-800" />
        <div className="absolute inset-0 h-14 w-14 animate-spin rounded-full border-4 border-transparent border-t-rose-500" />
      </div>
      <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest animate-pulse">
        Loading…
      </p>
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
              <Route path="/login"   element={<><Navbar /><OfferBanner /><Login /></>} />
              <Route path="/signup"  element={<><Navbar /><OfferBanner /><Signup /></>} />

              <Route path="/cart" element={
                <ProtectedRoute><Navbar /><OfferBanner /><Cart /></ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute><Navbar /><OfferBanner /><Orders /></ProtectedRoute>
              } />
              <Route path="/checkout" element={
                <ProtectedRoute><Navbar /><OfferBanner /><Checkout /></ProtectedRoute>
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
                <Route path="users"               element={<AdminUsers />} />
              </Route>

              <Route path="*" element={<><Navbar /><OfferBanner /><Placeholder /></>} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AdminProvider>
    </ThemeProvider>
  );
}

export default App;
