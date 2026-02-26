import api from "./axios";

export const getAdminNotifications = async () => {
    try {
        const res = await api.get("/admin/notifications");
        return res.data;
    } catch (error) {
        console.error("Fetch notifications error:", error);
        throw error;
    }
};

export const markNotificationRead = async (id) => {
    try {
        const res = await api.put(`/admin/notifications/${id}/mark-read`);
        return res.data;
    } catch (error) {
        console.error("Mark notification read error:", error);
        throw error;
    }
};

export const markAllNotificationsRead = async () => {
    try {
        const res = await api.put("/admin/notifications/mark-all-read");
        return res.data;
    } catch (error) {
        console.error("Mark all notifications read error:", error);
        throw error;
    }
};

export const deleteAdminNotification = async (id) => {
    try {
        const res = await api.delete(`/admin/notifications/${id}`);
        return res.data;
    } catch (error) {
        console.error("Delete notification error:", error);
        throw error;
    }
};

export const deleteAllAdminNotifications = async () => {
    try {
        const res = await api.delete("/admin/notifications/clear-all");
        return res.data;
    } catch (error) {
        console.error("Delete all notifications error:", error);
        throw error;
    }
};
