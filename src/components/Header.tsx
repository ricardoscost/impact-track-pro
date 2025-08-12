import { Button } from "@/components/ui/button";
import { Calendar, Camera, Menu, TrendingUp, X, Award, Users, Trophy } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import NotificationDropdown from "./NotificationDropdown";
import { useTranslation } from "react-i18next";
const Header = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const isActive = (path: string) => location.pathname === path;
  const navItems = [
    { path: "/", key: "nav.dashboard", icon: TrendingUp },
    { path: "/calendar", key: "nav.calendar", icon: Calendar },
    { path: "/pilots", key: "nav.pilots", icon: Users },
    { path: "/gallery", key: "nav.gallery", icon: Camera },
    { path: "/results", key: "nav.results", icon: Trophy },
    { path: "/sponsors", key: "nav.sponsors", icon: Award },
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
              <h1 className="text-xl font-bold text-chrome">{t('brand.name')}</h1>
              <p className="text-xs text-muted-foreground">{t('brand.tagline')}</p>
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
                    <span>{t(item.key)}</span>
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <div className="hidden md:flex items-center space-x-1">
              <Button aria-label="Português" variant={i18n.language?.startsWith('pt') ? "secondary" : "ghost"} size="icon" onClick={() => i18n.changeLanguage('pt')}>🇵🇹</Button>
              <Button aria-label="English" variant={i18n.language?.startsWith('en') ? "secondary" : "ghost"} size="icon" onClick={() => i18n.changeLanguage('en')}>🇬🇧</Button>
              <Button aria-label="Español" variant={i18n.language?.startsWith('es') ? "secondary" : "ghost"} size="icon" onClick={() => i18n.changeLanguage('es')}>🇪🇸</Button>
            </div>
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
            <div className="flex items-center gap-2 mb-2">
              <Button aria-label="Português" variant={i18n.language?.startsWith('pt') ? "secondary" : "ghost"} className="flex-1" onClick={() => i18n.changeLanguage('pt')}>🇵🇹 Português</Button>
              <Button aria-label="English" variant={i18n.language?.startsWith('en') ? "secondary" : "ghost"} className="flex-1" onClick={() => i18n.changeLanguage('en')}>🇬🇧 English</Button>
              <Button aria-label="Español" variant={i18n.language?.startsWith('es') ? "secondary" : "ghost"} className="flex-1" onClick={() => i18n.changeLanguage('es')}>🇪🇸 Español</Button>
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.path} to={item.path} onClick={() => setIsMobileMenuOpen(false)}>
                  <Button
                    variant={isActive(item.path) ? "default" : "ghost"}
                    className="w-full justify-start"
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {t(item.key)}
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