import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Globe, Shield, Settings } from "lucide-react";

export const AegisNavigation = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Threat Map", icon: Globe },
    { path: "/dashboard", label: "Command Center", icon: LayoutDashboard },
    { path: "/skills", label: "Audits", icon: Shield },
    { path: "/learn", label: "Remediate", icon: Settings },
  ];

  return (
    <nav className="fixed top-6 right-6 z-50">
      <div className="glass-panel rounded-full px-2 py-2 flex items-center gap-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                isActive 
                  ? 'bg-primary/20 text-primary' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium hidden md:inline">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
