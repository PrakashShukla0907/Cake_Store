import { useTheme } from "../../context/ThemeContext";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function StatsCard({ title, value, icon: Icon, trend, trendValue }) {
  const { theme } = useTheme();

  return (
    <div className={classNames(
      "overflow-hidden rounded-2xl p-6 shadow-sm border transition-all duration-500 hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02] group",
      theme === "dark" 
        ? "bg-theme-dark-card border-theme-dark-border hover:shadow-rose-500/10 hover:border-rose-500/30" 
        : "bg-theme-light-card border-theme-light-border hover:shadow-rose-500/20 hover:border-rose-500/40"
    )}>
      <div className="flex items-center justify-between">
        <div>
          <p className={classNames(
            "text-sm font-medium",
            theme === "dark" ? "text-theme-dark-muted" : "text-theme-light-muted"
          )}>
            {title}
          </p>
          <p className={classNames(
            "mt-2 text-3xl font-bold tracking-tight",
            theme === "dark" ? "text-theme-dark-text" : "text-theme-light-text"
          )}>
            {value}
          </p>
        </div>
        
        {Icon && (
          <div className={classNames(
            "flex h-12 w-12 items-center justify-center rounded-xl",
            theme === "dark" ? "bg-theme-dark-bg/50 text-theme-dark-primary" : "bg-theme-light-bg text-theme-light-primary border border-theme-light-border/50"
          )}>
            <Icon className="h-6 w-6" aria-hidden="true" />
          </div>
        )}
      </div>
      
      {(trend || trendValue) && (
        <div className="mt-4 flex items-center text-sm">
          <span className={classNames(
            "font-medium",
            trend === "up" 
              ? (theme === "dark" ? "text-emerald-400" : "text-emerald-600") 
              : (theme === "dark" ? "text-rose-400" : "text-rose-600")
          )}>
            {trend === "up" ? "↑" : "↓"} {trendValue}
          </span>
          <span className={classNames(
            "ml-2",
            theme === "dark" ? "text-theme-dark-muted" : "text-theme-light-muted"
          )}>
            vs last month
          </span>
        </div>
      )}
    </div>
  );
}
