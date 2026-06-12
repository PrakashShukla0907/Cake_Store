import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ShoppingBag, Box, Users, CheckCircle, Package, IndianRupee } from "lucide-react";
import StatsCard from "../../components/Admin/StatsCard";
import { getAdminStats, getAdminOrders } from "../../api/admin.api";

export default function Dashboard() {
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
        <div className="h-8 w-8 animate-spin rounded-md border-4 border-gray-200 border-t-black"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-black">
          Dashboard Overview
        </h2>
        <p className="mt-2 text-sm font-medium text-gray-500">
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
        <div className="rounded-md shadow-sm border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-black mb-6 text-black">
            Revenue Overview (Past 7 Months)
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={1}>
              <AreaChart data={stats.monthlySales}>
                <defs>
                   <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#111111" stopOpacity={0.2}/>
                     <stop offset="95%" stopColor="#111111" stopOpacity={0}/>
                   </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280", fontSize: 12, fontWeight: 700 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280", fontSize: 12, fontWeight: 700 }}
                  tickFormatter={(value) => `₹${value}`}
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#ffffff",
                    borderColor: "#e5e7eb",
                    borderRadius: '0.375rem',
                    color: "#111111",
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    borderWidth: '1px'
                  }}
                  itemStyle={{
                    color: "#111111",
                    fontWeight: '900'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#111111" 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                  strokeWidth={3}
                  activeDot={{ r: 6, stroke: "#111111", strokeWidth: 2, fill: "#ffffff" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  )
}