import { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { Search, Mail } from "lucide-react";
import { getAdminUsers } from "../../api/admin.api";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function AdminUsers() {
  const { theme } = useTheme();
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
          <h2 className={classNames(
            "text-2xl font-bold tracking-tight",
            theme === "dark" ? "text-theme-dark-text" : "text-theme-light-text"
          )}>
            Users
          </h2>
          <p className={classNames(
            "mt-1 text-sm",
            theme === "dark" ? "text-theme-dark-muted" : "text-theme-light-muted"
          )}>
            View a list of registered customers.
          </p>
        </div>
      </div>

      <div className={classNames(
        "flex items-center justify-between p-4 rounded-xl border shadow-sm transition-colors duration-300",
        theme === "dark" ? "bg-theme-dark-card border-theme-dark-border" : "bg-theme-light-card border-theme-light-border"
      )}>
        <div className="relative max-w-sm w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className={classNames("h-5 w-5", theme === "dark" ? "text-theme-dark-muted" : "text-theme-light-muted")} aria-hidden="true" />
          </div>
          <input
            type="text"
            className={classNames(
              "block w-full rounded-lg border-0 py-2 pl-10 pr-3 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 transition-colors",
              theme === "dark" 
                ? "bg-theme-dark-bg text-theme-dark-text ring-theme-dark-border placeholder:text-theme-dark-muted focus:ring-theme-dark-primary" 
                : "bg-theme-light-bg text-theme-light-text ring-theme-light-border placeholder:text-theme-light-muted focus:ring-theme-light-primary"
            )}
            placeholder="Search email..."
          />
        </div>
      </div>

      {loading ? (
        <div className={classNames(
          "flex flex-col items-center justify-center p-20 rounded-xl border shadow-sm transition-colors duration-300",
          theme === "dark" ? "bg-theme-dark-card border-theme-dark-border" : "bg-theme-light-card border-theme-light-border"
        )}>
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-rose-500 border-t-transparent mb-4"></div>
          <p className={theme === "dark" ? "text-theme-dark-muted" : "text-theme-light-muted"}>Loading users...</p>
        </div>
      ) : users.length === 0 ? (
        <div className={classNames(
          "flex flex-col items-center justify-center p-20 rounded-xl border shadow-sm transition-colors duration-300",
          theme === "dark" ? "bg-theme-dark-card border-theme-dark-border" : "bg-theme-light-card border-theme-light-border"
        )}>
          <div className={classNames(
            "h-16 w-16 mb-4 rounded-full flex items-center justify-center",
            theme === "dark" ? "bg-theme-dark-bg text-theme-dark-muted" : "bg-theme-light-bg text-theme-light-muted"
          )}>
            <Search className="h-8 w-8" />
          </div>
          <h3 className={classNames("text-lg font-semibold", theme === "dark" ? "text-theme-dark-text" : "text-theme-light-text")}>No users found</h3>
          <p className={classNames("mt-1 text-sm max-w-sm text-center", theme === "dark" ? "text-theme-dark-muted" : "text-theme-light-muted")}>
            There are currently no customers registered.
          </p>
        </div>
      ) : (
        <div className={classNames(
          "rounded-xl shadow-sm border overflow-hidden transition-colors duration-300",
          theme === "dark" ? "bg-theme-dark-card border-theme-dark-border" : "bg-theme-light-card border-theme-light-border"
        )}>
          <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-800">
            {users.map((user) => (
              <li key={user._id} className={classNames(
                "flex items-center justify-between gap-x-6 px-4 py-5 sm:px-6 transition-colors",
                theme === "dark" ? "hover:bg-theme-dark-bg/50" : "hover:bg-theme-light-bg/50"
              )}>
                <div className="flex min-w-0 gap-x-4">
                  <div className={classNames(
                    "h-12 w-12 flex-none rounded-full flex items-center justify-center font-bold text-lg",
                    theme === "dark" ? "bg-theme-dark-bg text-theme-dark-primary" : "bg-theme-light-bg text-theme-light-primary border border-theme-light-border"
                  )}>
                    {user.name?.[0].toUpperCase() || "C"}
                  </div>
                  <div className="min-w-0 flex-auto">
                    <p className={classNames("text-sm font-semibold leading-6 flex items-center gap-2", theme === "dark" ? "text-theme-dark-text" : "text-theme-light-text")}>
                      {user.name}
                      {user.role === 'admin' && (
                        <span className="inline-flex items-center rounded-md bg-rose-50 px-2 py-1 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-600/20">
                          Admin
                        </span>
                      )}
                    </p>
                    <p className={classNames("mt-1 truncate text-xs leading-5 flex items-center", theme === "dark" ? "text-theme-dark-muted" : "text-theme-light-muted")}>
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
