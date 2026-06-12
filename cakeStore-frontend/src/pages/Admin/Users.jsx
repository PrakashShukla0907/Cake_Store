import { useState, useEffect } from "react";
import { Search, Mail } from "lucide-react";
import { getAdminUsers } from "../../api/admin.api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAdminUsers();
      setUsers(data?.users || data || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-black">
            Users
          </h2>
          <p className="mt-1 text-sm font-medium text-gray-500">
            View a list of registered customers.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 rounded-md border border-gray-200 bg-white shadow-sm">
        <div className="relative max-w-sm w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="block w-full rounded-md border border-gray-200 py-2 pl-10 pr-3 shadow-sm bg-white text-black placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black sm:text-sm sm:leading-6 transition-colors"
            placeholder="Search email..."
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 rounded-md border border-gray-200 bg-white shadow-sm">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black mb-4"></div>
          <p className="font-medium text-gray-500">Loading users...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 rounded-md border border-gray-200 bg-white shadow-sm">
          <div className="h-16 w-16 mb-4 rounded-md flex items-center justify-center bg-gray-50 text-gray-400">
            <Search className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-black text-black">No users found</h3>
          <p className="mt-1 text-sm max-w-sm text-center font-medium text-gray-500">
            There are currently no customers registered.
          </p>
        </div>
      ) : (
        <div className="rounded-md shadow-sm border border-gray-200 bg-white overflow-hidden">
          <ul role="list" className="divide-y divide-gray-200">
            {users.map((user) => (
              <li key={user._id} className="flex items-center justify-between gap-x-6 px-4 py-5 sm:px-6 hover:bg-gray-50 transition-colors">
                <div className="flex min-w-0 gap-x-4">
                  <div className="h-12 w-12 flex-none rounded-md flex items-center justify-center font-black text-lg bg-gray-100 text-black border border-gray-200">
                    {user.name?.[0].toUpperCase() || "C"}
                  </div>
                  <div className="min-w-0 flex-auto">
                    <p className="text-sm font-black leading-6 flex items-center gap-2 text-black">
                      {user.name}
                      {user.role === 'admin' && (
                        <span className="inline-flex items-center rounded-sm bg-black px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-white">
                          Admin
                        </span>
                      )}
                    </p>
                    <p className="mt-1 truncate text-xs font-medium leading-5 flex items-center text-gray-500">
                      <Mail className="mr-1.5 h-3 w-3 flex-shrink-0" />
                      {user.email}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
