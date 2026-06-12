import { useTheme } from "../../context/ThemeContext";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function StatsCard({ title, value, icon: Icon, trend, trendValue }) {
  return (
    <div className="overflow-hidden rounded-md p-6 bg-white shadow-sm border border-gray-200 transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>
          <p className="mt-2 text-3xl font-black tracking-tight text-black">
            {value}
          </p>
        </div>
        
        {Icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gray-50 border border-gray-200 text-black">
            <Icon className="h-6 w-6" aria-hidden="true" />
          </div>
        )}
      </div>
      
      {(trend || trendValue) && (
        <div className="mt-4 flex items-center text-sm">
          <span className={classNames(
            "font-bold",
            trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-black"
          )}>
            {trend === "up" ? "↑" : trend === "down" ? "↓" : ""} {trendValue}
          </span>
          <span className="ml-2 font-medium text-gray-400">
            vs last month
          </span>
        </div>
      )}
    </div>
  );
}
