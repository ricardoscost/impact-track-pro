import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Euro, Target, Users, Zap } from "lucide-react";

const SponsorshipValue = () => {
  const valueMetrics = [
    {
      label: "Valor Total de Exposição",
      value: "€45.230",
      progress: 85,
      icon: Euro,
      color: "gradient-primary",
    },
    {
      label: "Alcance Potencial",
      value: "127.5K pessoas",
      progress: 72,
      icon: Users,
      color: "gradient-performance",
    },
    {
      label: "Engagement Rate",
      value: "8.4%",
      progress: 84,
      icon: Zap,
      color: "gradient-energy",
    },
    {
      label: "ROI Estimado",
      value: "312%",
      progress: 91,
      icon: Target,
      color: "gradient-primary",
    },
  ];

  return (
    <Card className="hover-lift transition-smooth">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center space-x-2">
          <div className="w-6 h-6 gradient-primary rounded flex items-center justify-center">
            <Euro className="w-4 h-4 text-white" />
          </div>
          <span>Valor de Retorno para Patrocinadores</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Métricas de performance e ROI em tempo real
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {valueMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{metric.label}</span>
                </div>
                <Badge variant="secondary" className="font-semibold">
                  {metric.value}
                </Badge>
              </div>
              <Progress value={metric.progress} className="h-2" />
              <p className="text-xs text-muted-foreground text-right">
                {metric.progress}% do objetivo anual
              </p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default SponsorshipValue;