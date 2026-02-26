import { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ShoppingBag, Box, Users, CheckCircle, Package, IndianRupee } from "lucide-react";
import StatsCard from "../../components/Admin/StatsCard";
import { getAdminStats, getAdminOrders } from "../../api/admin.api";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Dashboard() {
  const { theme } = useTheme();
  const [stats, setStats] = useState({ 
    totalRevenue: 0, 
    totalOrders: 0, 
    activeOrders: 0,
    completedOrders: 0,
    totalProducts: 0, 
    totalUsers: 0, 
    monthlySales: [{ name: "Jan", revenue: 0 }, { name: "Feb", revenue: 0 }],
    trends: { revenue: 0, orders: 0, products: 0, users: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [statsData, ordersData] = await Promise.all([
          getAdminStats(),
          getAdminOrders()
        ]);

        const allOrders = ordersData?.orders || ordersData || [];
        const completed = allOrders.filter(o => o.orderStatus === "Delivered").length;
        const active = allOrders.length - completed;

        if (statsData) {
           setStats({
             totalRevenue: statsData.totalRevenue || 0,
             totalOrders: allOrders.length,
             activeOrders: active,
             completedOrders: completed,
             totalProducts: statsData.totalProducts || 0,
             totalUsers: statsData.totalUsers || 0,
             monthlySales: statsData.monthlySales || [],
             trends: statsData.trends || { revenue: 0, orders: 0, products: 0, users: 0 }
           });
        }
      } catch (error) {
        console.error("Failed to load dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-rose-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h2 className={classNames(
          "text-2xl font-bold tracking-tight",
          theme === "dark" ? "text-theme-dark-text" : "text-theme-light-text"
        )}>
          Dashboard Overview
        </h2>
        <p className={classNames(
          "mt-2 text-sm",
          theme === "dark" ? "text-theme-dark-muted" : "text-theme-light-muted"
        )}>
          Detailed view of your bakery&apos;s performance and order status.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Total Revenue" 
          value={`₹${stats.totalRevenue.toLocaleString()}`} 
          icon={IndianRupee} 
          trend={stats.trends.revenue >= 0 ? "up" : "down"} 
          trendValue={`${Math.abs(stats.trends.revenue)}%`} 
        />
        <StatsCard 
          title="Active Orders" 
          value={stats.activeOrders} 
          icon={Package} 
          trend={stats.trends.orders >= 0 ? "up" : "down"} 
          trendValue={`${Math.abs(stats.trends.orders)}%`} 
        />
        <StatsCard 
          title="Completed Orders" 
          value={stats.completedOrders} 
          icon={CheckCircle} 
          trendValue="Live"
        />
        <StatsCard 
          title="Total Customers" 
          value={stats.totalUsers} 
          icon={Users} 
          trend={stats.trends.users >= 0 ? "up" : "down"} 
          trendValue={`${Math.abs(stats.trends.users)}%`} 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Revenue Line Chart */}
        <div className={classNames(
          "rounded-2xl shadow-sm border p-6 transition-colors duration-300",
          theme === "dark" 
            ? "bg-theme-dark-card border-theme-dark-border" 
            : "bg-theme-light-card border-theme-light-border"
        )}>
          <h3 className={classNames(
            "text-lg font-semibold mb-6",
            theme === "dark" ? "text-theme-dark-text" : "text-theme-light-text"
          )}>
            Revenue Overview (Past 7 Months)
          </h3>
          <div className="h-80 w-full animate-in fade-in zoom-in duration-1000 delay-300">
            <ResponsiveContainer width="100%" height="100%" minWidth={1}>
              <AreaChart data={stats.monthlySales}>
                <defs>
                   <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor={theme === "dark" ? "#FB7185" : "#F43F5E"} stopOpacity={0.3}/>
                     <stop offset="95%" stopColor={theme === "dark" ? "#FB7185" : "#F43F5E"} stopOpacity={0}/>
                   </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === "dark" ? "#1e293b" : "#e2e8f0"} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: theme === "dark" ? "#94A3B8" : "#64748B", fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: theme === "dark" ? "#94A3B8" : "#64748B", fontSize: 12 }}
                  tickFormatter={(value) => `₹${value}`}
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: theme === "dark" ? "#0F172A" : "#FFFFFF",
                    borderColor: theme === "dark" ? "#1E293B" : "#F1F5F9",
                    borderRadius: '16px',
                    color: theme === "dark" ? "#F8FAFC" : "#0F172A",
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                    borderWidth: '1px'
                  }}
                  itemStyle={{
                    color: theme === "dark" ? "#FB7185" : "#F43F5E",
                    fontWeight: 'bold'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke={theme === "dark" ? "#FB7185" : "#F43F5E"} 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                  strokeWidth={4}
                  activeDot={{ r: 8, stroke: theme === "dark" ? "#FB7185" : "#F43F5E", strokeWidth: 2, fill: theme === "dark" ? "#0F172A" : "#FFFFFF" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  )
};