import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
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
  const [loading, setLoading] = useState(true);
  const [metricsData, setMetricsData] = useState<any[]>([]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const fetchMetrics = async () => {
    try {
      const { data, error } = await supabase
        .from('metrics')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (error) throw error;
      setMetricsData(data || []);
    } catch (error) {
      console.error('Error fetching metrics:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar métricas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const handleSave = async (metric: any, newValue: string) => {
    try {
      const { error } = await supabase
        .from('metrics')
        .update({ value: newValue })
        .eq('id', metric.id);

      if (error) throw error;

      // Create notification
      await supabase
        .from('notifications')
        .insert([
          {
            type: 'metrics',
            title: 'Métrica atualizada',
            message: `${metric.title} foi atualizada para ${newValue}`,
            related_id: metric.id
          }
        ]);

      await fetchMetrics();
      toast({
        title: "Métrica atualizada",
        description: "A métrica foi salva com sucesso",
      });
    } catch (error) {
      console.error('Error updating metric:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar métrica",
        variant: "destructive"
      });
    }
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
          <Button variant="gradient" onClick={() => fetchMetrics()}>
            <Save className="w-4 h-4 mr-2" />
            Recarregar Métricas
          </Button>
        </div>

        {/* Metrics Cards */}
        {loading ? (
          <div className="text-center py-8">
            <p>A carregar métricas...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {metricsData.map((metric) => (
              <Card key={metric.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 gradient-${metric.gradient_type || 'primary'} rounded-lg flex items-center justify-center`}>
                      <BarChart3 className="w-4 h-4 text-white" />
                    </div>
                    <CardTitle className="text-sm">{metric.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <Input
                    value={metric.value}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setMetricsData(prev => 
                        prev.map(m => m.id === metric.id ? {...m, value: newValue} : m)
                      );
                    }}
                    onBlur={(e) => handleSave(metric, e.target.value)}
                    className="text-2xl font-bold text-center"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

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