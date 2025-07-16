import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  className?: string;
  gradient?: "primary" | "performance" | "energy";
}

const MetricCard = ({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  className,
  gradient,
}: MetricCardProps) => {
  const getChangeColor = () => {
    switch (changeType) {
      case "positive":
        return "text-secondary";
      case "negative":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <Card className={cn("hover-lift transition-smooth", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div
          className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center",
            gradient === "primary" && "gradient-primary",
            gradient === "performance" && "gradient-performance",
            gradient === "energy" && "gradient-energy",
            !gradient && "bg-muted"
          )}
        >
          <Icon
            className={cn(
              "w-4 h-4",
              gradient ? "text-white" : "text-muted-foreground"
            )}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {change && (
          <p className={cn("text-xs", getChangeColor())}>
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;