import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AdminLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 transition-colors duration-300">
      {/* Sidebar handles both desktop and mobile overlays */}
      <Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Topbar setMobileMenuOpen={setMobileMenuOpen} />

        <main className="flex-1 py-8">
          <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {/* The routed Admin page components inject here */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
