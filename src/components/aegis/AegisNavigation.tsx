import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Globe, Shield } from "lucide-react";

export const AegisNavigation = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Threat Map", icon: Globe },
    { path: "/dashboard", label: "Command", icon: LayoutDashboard },
    { path: "/skills", label: "Audits", icon: Shield },
  ];

  return (
    <nav className="fixed top-6 right-6 z-50">
      <div 
        className="rounded-full px-1.5 py-1.5 flex items-center gap-0.5"
        style={{
          background: 'rgba(18, 8, 12, 0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(122, 30, 58, 0.15)',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 248, 240, 0.03)',
        }}
      >
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300"
              style={{
                background: isActive ? 'rgba(122, 30, 58, 0.25)' : 'transparent',
                color: isActive ? 'rgba(255, 248, 240, 0.9)' : 'rgba(127, 183, 214, 0.6)',
                boxShadow: isActive ? '0 0 12px rgba(122, 30, 58, 0.3)' : 'none',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(127, 183, 214, 0.08)';
                  e.currentTarget.style.color = 'rgba(255, 248, 240, 0.8)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'rgba(127, 183, 214, 0.6)';
                }
              }}
            >
              <Icon className="w-4 h-4" />
              <span className="text-xs font-medium tracking-wide hidden md:inline">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
