import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  BarChart3, 
  ImageIcon, 
  LogOut,
  Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Admin = () => {
  const { isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const adminSections = [
    {
      title: "Calendário de Eventos",
      description: "Gerir eventos e provas",
      icon: Calendar,
      path: "/admin/calendar",
      color: "text-primary"
    },
    {
      title: "Métricas",
      description: "Atualizar estatísticas e dados",
      icon: BarChart3,
      path: "/admin/metrics",
      color: "text-secondary"
    },
    {
      title: "Galeria",
      description: "Upload de imagens e vídeos",
      icon: ImageIcon,
      path: "/admin/gallery",
      color: "text-accent"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Administração</h1>
            <p className="text-muted-foreground">
              Painel de controlo do Enduro Sponsor App
            </p>
          </div>
          <Button variant="outline" onClick={logout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Admin Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {adminSections.map((section) => {
            const Icon = section.icon;
            return (
              <Card key={section.path} className="hover-lift">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{section.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {section.description}
                  </p>
                  <Link to={section.path}>
                    <Button variant="outline" className="w-full">
                      <Settings className="w-4 h-4 mr-2" />
                      Gerir
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Stats */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Resumo Rápido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">3</p>
                <p className="text-sm text-muted-foreground">Eventos Ativos</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-secondary">248</p>
                <p className="text-sm text-muted-foreground">Fotos na Galeria</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-accent">42</p>
                <p className="text-sm text-muted-foreground">Vídeos na Galeria</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-500">15.462</p>
                <p className="text-sm text-muted-foreground">Total Participantes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;