import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Camera, 
  Trophy, 
  Users, 
  ArrowRight,
  MapPin,
  Clock
} from "lucide-react";

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: "evento",
      title: "Meia Maratona do Porto",
      description: "Participação com 3 patrocinadores principais",
      date: "2024-01-15",
      status: "concluído",
      icon: Trophy,
      metrics: { participants: 1200, exposure: "€8.500" },
    },
    {
      id: 2,
      type: "media",
      title: "Sessão Fotográfica - Equipamentos",
      description: "Produção de conteúdo para redes sociais",
      date: "2024-01-12",
      status: "processando",
      icon: Camera,
      metrics: { photos: 45, videos: 8 },
    },
    {
      id: 3,
      type: "reuniao",
      title: "Reunião com Novos Patrocinadores",
      description: "Apresentação da proposta para 2024",
      date: "2024-01-18",
      status: "agendado",
      icon: Users,
      metrics: { companies: 3, value: "€12.000" },
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "concluído":
        return "bg-secondary/20 text-secondary border-secondary/30";
      case "processando":
        return "bg-accent/20 text-accent border-accent/30";
      case "agendado":
        return "bg-primary/20 text-primary border-primary/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "evento":
        return Trophy;
      case "media":
        return Camera;
      case "reuniao":
        return Users;
      default:
        return Calendar;
    }
  };

  return (
    <Card className="hover-lift transition-smooth">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Atividade Recente
          </CardTitle>
          <Button variant="ghost" size="sm">
            Ver Tudo
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Últimas atividades e eventos realizados
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => {
          const Icon = getIcon(activity.type);
          return (
            <div
              key={activity.id}
              className="flex items-start space-x-4 p-4 rounded-lg border hover:bg-muted/50 transition-smooth"
            >
              <Avatar className="w-10 h-10">
                <AvatarFallback className="gradient-primary">
                  <Icon className="w-5 h-5 text-white" />
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">{activity.title}</h4>
                  <Badge
                    variant="outline"
                    className={getStatusColor(activity.status)}
                  >
                    {activity.status}
                  </Badge>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  {activity.description}
                </p>
                
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(activity.date).toLocaleDateString('pt-PT')}</span>
                  </div>
                  
                  <div className="flex space-x-3 text-muted-foreground">
                    {Object.entries(activity.metrics).map(([key, value]) => (
                      <span key={key} className="text-xs">
                        <strong>{value}</strong> {key}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;