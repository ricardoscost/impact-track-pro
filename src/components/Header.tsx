import { Button } from "@/components/ui/button";
import { Calendar, Camera, Menu, TrendingUp, X, Award, Users, Trophy } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import NotificationDropdown from "./NotificationDropdown";

const Header = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/", label: "Dashboard", icon: TrendingUp },
    { path: "/calendar", label: "Calendário", icon: Calendar },
    { path: "/pilots", label: "Pilotos", icon: Users },
    { path: "/gallery", label: "Galeria", icon: Camera },
    { path: "/results", label: "Resultados", icon: Trophy },
    { path: "/sponsors", label: "Patrocinadores", icon: Award },
  ];

  return (
    <header className="border-b bg-card/50 backdrop-blur-md sticky top-0 z-50 shadow-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-lg overflow-hidden shadow-chrome">
              <img 
                src="/lovable-uploads/d8cfd119-802a-4051-8930-ca50bc9b9086.png" 
                alt="Hard Enduro Social Club Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-chrome">Hard Enduro Social Club</h1>
              <p className="text-xs text-muted-foreground">Hard Trails. Good Vibes.</p>
            </div>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive(item.path) ? "default" : "ghost"}
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <NotificationDropdown />
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-card/95 backdrop-blur-md">
          <nav className="container mx-auto px-4 py-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.path} to={item.path} onClick={() => setIsMobileMenuOpen(false)}>
                  <Button
                    variant={isActive(item.path) ? "default" : "ghost"}
                    className="w-full justify-start"
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
