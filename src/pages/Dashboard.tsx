import NextEventBanner from "@/components/NextEventBanner";
import LatestResultBanner from "@/components/LatestResultBanner";
import PressReleaseCard from "@/components/PressReleaseCard";
import LatestGallery from "@/components/LatestGallery";
import LatestYouTubeVideos from "@/components/LatestYouTubeVideos";
import SponsorCarousel from "@/components/SponsorCarousel";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { 
  MapPin, 
  Calendar, 
  Users,
  Award,
  Camera,
  TrendingUp
} from "lucide-react";

interface Metric {
  id: string;
  title: string;
  value: string;
  change_text: string;
  change_type: string;
  icon_name: string;
  gradient_type: string;
}

const iconMap: { [key: string]: any } = {
  MapPin,
  Calendar,
  Users,
  Award,
  Camera,
  TrendingUp
};

const Dashboard = () => {
  const [nextEvent, setNextEvent] = useState<any>(null);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [pressReleases, setPressReleases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch next event
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .gte('date', new Date().toISOString().split('T')[0])
        .order('date', { ascending: true })
        .limit(1)
        .single();
      
      if (eventError && eventError.code !== 'PGRST116') throw eventError;
      
      if (eventData) {
        const eventDateTime = new Date(`${eventData.date}T${eventData.time}`);
        setNextEvent({
          eventName: eventData.title,
          location: eventData.location,
          date: eventDateTime,
          backgroundImage: eventData.background_image_url
        });
      }

      // Fetch metrics
      const { data: metricsData, error: metricsError } = await supabase
        .from('metrics')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      
      if (metricsError) throw metricsError;
      setMetrics(metricsData || []);

      // Fetch press releases
      const { data: pressData, error: pressError } = await supabase
        .from('press_releases')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .limit(3);
      
      if (pressError) throw pressError;
      setPressReleases(pressData || []);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPressReleases = (data: any[]) => {
    return data.map(item => ({
      id: item.id,
      title: item.title,
      date: new Date(item.published_at),
      excerpt: item.excerpt || item.content?.substring(0, 100) + '...'
    }));
  };

  return (
    <div className="space-y-8">
      {/* Hero Banner - Próximo Evento */}
      {loading ? (
        <div className="text-center py-12">Carregando próximo evento...</div>
      ) : nextEvent ? (
        <NextEventBanner
          eventName={nextEvent.eventName}
          location={nextEvent.location}
          date={nextEvent.date}
          backgroundImage={nextEvent.backgroundImage || "/lovable-uploads/20c68fe8-f328-4e28-a945-fd12a9bc57a5.png"}
        />
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          Nenhum evento programado
        </div>
      )}

      {/* Banner do Último Resultado */}
      <LatestResultBanner />

      {/* Carrossel de Patrocinadores */}
      <SponsorCarousel />

      {/* Últimos Vídeos do YouTube */}
      <LatestYouTubeVideos />

      {/* Secções Secundárias */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Press Releases */}
        <div>
          <PressReleaseCard pressReleases={formatPressReleases(pressReleases)} />
        </div>

        {/* Últimas Fotografias */}
        <div>
          <LatestGallery />
        </div>
      </div>

      {/* Métricas */}
      {loading ? (
        <div className="text-center py-8">Carregando métricas...</div>
      ) : metrics.length > 0 ? (
        <div>
          <h2 className="text-2xl font-bold mb-6 text-center">Estatísticas da Época</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric) => {
              const Icon = iconMap[metric.icon_name] || TrendingUp;
              return (
                <Card key={metric.id} className="overflow-hidden hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className={`w-12 h-12 gradient-${metric.gradient_type} rounded-lg flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm text-muted-foreground mb-1">
                          {metric.title}
                        </h3>
                        <p className="text-2xl font-bold text-foreground">
                          {metric.value}
                        </p>
                      </div>
                    </div>
                    {metric.change_text && (
                      <div className="flex items-center text-sm">
                        <span className={`${
                          metric.change_type === 'positive' ? 'text-secondary' :
                          metric.change_type === 'negative' ? 'text-destructive' :
                          'text-muted-foreground'
                        }`}>
                          {metric.change_text}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Dashboard;