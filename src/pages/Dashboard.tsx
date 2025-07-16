import MetricCard from "@/components/MetricCard";
import VisibilityChart from "@/components/VisibilityChart";
import SponsorshipValue from "@/components/SponsorshipValue";
import RecentActivity from "@/components/RecentActivity";
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  MapPin, 
  Camera,
  Award,
  Zap
} from "lucide-react";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="gradient-subtle rounded-xl p-8 border">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold mb-2">
            Bem-vindo ao SportsPro Dashboard
          </h1>
          <p className="text-muted-foreground text-lg mb-6">
            Plataforma profissional para gestão e apresentação de projetos desportivos. 
            Acompanhe métricas, gerencie patrocínios e maximize o retorno de visibilidade.
          </p>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-secondary rounded-full"></div>
              <span>Sistema em tempo real</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span>Dados verificados</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>ROI transparente</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Quilómetros Percorridos"
          value="2.847 km"
          change="+12% vs mês anterior"
          changeType="positive"
          icon={MapPin}
          gradient="primary"
        />
        <MetricCard
          title="Eventos Realizados"
          value="23"
          change="+4 este mês"
          changeType="positive"
          icon={Calendar}
          gradient="performance"
        />
        <MetricCard
          title="Alcance nas Redes"
          value="127.5K"
          change="+8.2% crescimento"
          changeType="positive"
          icon={Users}
          gradient="energy"
        />
        <MetricCard
          title="Marcas Expostas"
          value="15"
          change="5 parceiros ativos"
          changeType="neutral"
          icon={Award}
        />
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VisibilityChart />
        <SponsorshipValue />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
        
        {/* Quick Stats */}
        <div className="space-y-4">
          <MetricCard
            title="Próximo Evento"
            value="Ultra Trail"
            change="15 de Fevereiro"
            icon={Calendar}
            className="h-fit"
          />
          <MetricCard
            title="Conteúdo Produzido"
            value="156"
            change="Posts este mês"
            icon={Camera}
            className="h-fit"
          />
          <MetricCard
            title="Performance Score"
            value="94%"
            change="Excelente"
            changeType="positive"
            icon={Zap}
            gradient="performance"
            className="h-fit"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;