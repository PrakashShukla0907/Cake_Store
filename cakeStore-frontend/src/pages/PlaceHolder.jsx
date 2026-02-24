import { useLocation } from "react-router-dom";
import { Construction } from "lucide-react";

export default function Placeholder() {
  const location = useLocation();
  const pageName = location.pathname
    .split("/")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" > ");

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-slate-50 to-white">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 mb-6 shadow-lg bg-linear-to-r from-blue-500 to-purple-500 rounded-3xl">
          <Construction className="w-12 h-12 text-white" />
        </div>
        <h1 className="mb-3 text-3xl font-bold text-gray-900">
          {pageName || "Page"}
        </h1>
        <p className="mb-8 text-gray-600">
          This page is currently under construction. Stay tuned!
        </p>
        <div className="inline-flex items-center px-6 py-3 font-medium text-blue-800 bg-linear-to-r from-blue-100 to-purple-100 rounded-xl">
          Coming Soon
        </div>
      </div>
    </div>
  );
}
