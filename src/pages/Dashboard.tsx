import MetricCard from "@/components/MetricCard";
import NextEventBanner from "@/components/NextEventBanner";
import PressReleaseCard from "@/components/PressReleaseCard";
import InstagramPostCard from "@/components/InstagramPostCard";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  MapPin, 
  Calendar, 
  Users,
  Award,
  Camera,
  TrendingUp
} from "lucide-react";

const Dashboard = () => {
  const [nextEvent, setNextEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNextEvent();
  }, []);

  const fetchNextEvent = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('date', new Date().toISOString().split('T')[0])
        .order('date', { ascending: true })
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        const eventDateTime = new Date(`${data.date}T${data.time}`);
        setNextEvent({
          eventName: data.title,
          location: data.location,
          date: eventDateTime,
          backgroundImage: data.background_image_url
        });
      }
    } catch (error) {
      console.error('Error fetching next event:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock data para press releases
  const pressReleases = [
    {
      id: '1',
      title: 'Nova Parceria com Husqvarna Portugal',
      date: new Date('2024-07-10'),
      excerpt: 'Anunciamos uma nova parceria estratégica que reforça nosso compromisso com a excelência no enduro. Esta colaboração...'
    },
    {
      id: '2', 
      title: 'Vitória no Campeonato Nacional de Enduro',
      date: new Date('2024-07-05'),
      excerpt: 'Conquistámos o primeiro lugar na categoria Elite, demonstrando a qualidade do nosso equipamento e preparação...'
    },
    {
      id: '3',
      title: 'Inauguração de Nova Base de Treinos',
      date: new Date('2024-06-28'),
      excerpt: 'A nossa nova base de treinos em Viseu está agora operacional, oferecendo instalações de última geração...'
    }
  ];

  // Mock data para posts do Instagram
  const instagramPosts = [
    {
      id: '1',
      imageUrl: '/placeholder.svg',
      likes: 2847,
      caption: 'Treino intensivo na Serra da Estrela! 💪 Preparação para o próximo campeonato está a todo o vapor. #enduro #training'
    },
    {
      id: '2',
      imageUrl: '/placeholder.svg', 
      likes: 1923,
      caption: 'Nova parceria com a Husqvarna! 🏍️ Equipamento de topo para os maiores desafios. #husqvarna #partnership'
    },
    {
      id: '3',
      imageUrl: '/placeholder.svg',
      likes: 3156,
      caption: 'Vitória no campeonato nacional! 🏆 Obrigado a todos os nossos apoiantes e patrocinadores. #victory #enduro'
    }
  ];

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

      {/* Métricas Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Km Percorridos Esta Época"
          value="2.847 km"
          change="+12% vs época anterior"
          changeType="positive"
          icon={MapPin}
          gradient="primary"
        />
        <MetricCard
          title="Eventos Realizados"
          value="23"
          change="5 vitórias conquistadas"
          changeType="positive"
          icon={Calendar}
          gradient="performance"
        />
        <MetricCard
          title="Visualizações nas Redes"
          value="127.5K"
          change="+18% este mês"
          changeType="positive"
          icon={Users}
          gradient="energy"
        />
        <MetricCard
          title="Marcas Visíveis"
          value="15"
          change="8 parceiros principais"
          changeType="neutral"
          icon={Award}
        />
      </div>

      {/* Secções Secundárias */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Press Releases */}
        <div className="lg:col-span-1">
          <PressReleaseCard pressReleases={pressReleases} />
        </div>

        {/* Posts Instagram */}
        <div className="lg:col-span-1">
          <InstagramPostCard posts={instagramPosts} />
        </div>

        {/* Métricas Adicionais */}
        <div className="lg:col-span-1 space-y-4">
          <MetricCard
            title="Alcance Mensal"
            value="45.2K"
            change="+23% crescimento"
            changeType="positive"
            icon={TrendingUp}
            gradient="performance"
            className="h-fit"
          />
          <MetricCard
            title="Conteúdo Produzido"
            value="156"
            change="Posts este mês"
            changeType="neutral"
            icon={Camera}
            className="h-fit"
          />
          <MetricCard
            title="Engagement Rate"
            value="8.4%"
            change="Acima da média"
            changeType="positive"
            icon={Users}
            gradient="energy"
            className="h-fit"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;