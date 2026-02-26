import { createContext, useState, useEffect, useContext } from "react";
import { getAdminNotifications } from "../api/notification.api";
import { getAdminOrders } from "../api/admin.api";
import { AuthContext } from "./AuthContext";

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === "admin";

  const fetchAdminState = async () => {
    try {
      // Parallel fetch for better performance
      const [notifData, ordersData] = await Promise.all([
        getAdminNotifications(),
        getAdminOrders()
      ]);

      const newNotifs = notifData?.notifications || [];
      setNotifications(newNotifs);

      // Count "Pending" and "Baking" as active/new orders for the sidebar badge
      const activeOrders = (ordersData?.orders || ordersData || []).filter(
        order => order.orderStatus === "Pending" || order.orderStatus === "Baking"
      );
      setPendingOrdersCount(activeOrders.length);
    } catch (error) {
      console.error("AdminContext: Failed to fetch state", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
        fetchAdminState();
        // Poll every 30 seconds for state updates
        const interval = setInterval(fetchAdminState, 30000);
        return () => clearInterval(interval);
    } else {
        // Reset state if not admin
        setNotifications([]);
        setPendingOrdersCount(0);
    }
  }, [isAdmin]);

  return (
    <AdminContext.Provider 
      value={{ 
        notifications, 
        notificationsCount: notifications.filter(n => !n.isRead).length,
        pendingOrdersCount, 
        refreshAdminState: fetchAdminState,
        loading 
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
