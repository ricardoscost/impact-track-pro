import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Save, 
  BarChart3,
  Users,
  MapPin,
  Calendar,
  Eye,
  TrendingUp,
  Award,
  Share
} from 'lucide-react';

const AdminMetrics = () => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [metrics, setMetrics] = useState({
    totalParticipants: '15462',
    activeEvents: '3',
    citiesVisited: '8',
    totalViews: '124500',
    socialShares: '8942',
    brandExposure: '2.4M',
    sponsorSatisfaction: '95',
    mediaDownloads: '1247'
  });

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleSave = () => {
    // Aqui você salvaria as métricas no backend
    toast({
      title: "Métricas atualizadas",
      description: "As métricas foram salvas com sucesso",
    });
  };

  const metricCards = [
    {
      key: 'totalParticipants',
      title: 'Total de Participantes',
      icon: Users,
      color: 'text-primary',
      gradient: 'gradient-primary'
    },
    {
      key: 'activeEvents',
      title: 'Eventos Ativos',
      icon: Calendar,
      color: 'text-secondary',
      gradient: 'gradient-performance'
    },
    {
      key: 'citiesVisited',
      title: 'Cidades Visitadas',
      icon: MapPin,
      color: 'text-accent',
      gradient: 'gradient-energy'
    },
    {
      key: 'totalViews',
      title: 'Total de Visualizações',
      icon: Eye,
      color: 'text-purple-500',
      gradient: 'gradient-subtle'
    },
    {
      key: 'socialShares',
      title: 'Partilhas Sociais',
      icon: Share,
      color: 'text-green-500',
      gradient: 'gradient-primary'
    },
    {
      key: 'brandExposure',
      title: 'Exposição da Marca',
      icon: TrendingUp,
      color: 'text-orange-500',
      gradient: 'gradient-performance'
    },
    {
      key: 'sponsorSatisfaction',
      title: 'Satisfação Patrocinadores (%)',
      icon: Award,
      color: 'text-yellow-500',
      gradient: 'gradient-energy'
    },
    {
      key: 'mediaDownloads',
      title: 'Downloads de Media',
      icon: BarChart3,
      color: 'text-blue-500',
      gradient: 'gradient-subtle'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/admin">
              <Button variant="outline" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Gerir Métricas</h1>
              <p className="text-muted-foreground">
                Atualizar dados e estatísticas
              </p>
            </div>
          </div>
          <Button variant="gradient" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Guardar Alterações
          </Button>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {metricCards.map((metric) => {
            const Icon = metric.icon;
            return (
              <Card key={metric.key}>
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 ${metric.gradient} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <CardTitle className="text-sm">{metric.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <Input
                    value={metrics[metric.key as keyof typeof metrics]}
                    onChange={(e) => setMetrics({
                      ...metrics,
                      [metric.key]: e.target.value
                    })}
                    className="text-2xl font-bold text-center"
                  />
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Settings */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Configurações Adicionais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="growth-rate">Taxa de Crescimento (%)</Label>
                <Input
                  id="growth-rate"
                  placeholder="12.5"
                  type="number"
                  step="0.1"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="revenue">Receita Gerada (€)</Label>
                <Input
                  id="revenue"
                  placeholder="45000"
                  type="number"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reach">Alcance Total</Label>
                <Input
                  id="reach"
                  placeholder="500000"
                  type="number"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="engagement">Taxa de Envolvimento (%)</Label>
                <Input
                  id="engagement"
                  placeholder="8.2"
                  type="number"
                  step="0.1"
                />
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <Button variant="outline" className="w-full">
                <BarChart3 className="w-4 h-4 mr-2" />
                Gerar Relatório Completo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminMetrics;