import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", visibilidade: 12000, eventos: 4 },
  { month: "Fev", visibilidade: 19000, eventos: 6 },
  { month: "Mar", visibilidade: 15000, eventos: 5 },
  { month: "Abr", visibilidade: 28000, eventos: 8 },
  { month: "Mai", visibilidade: 35000, eventos: 10 },
  { month: "Jun", visibilidade: 42000, eventos: 12 },
];

const VisibilityChart = () => {
  return (
    <Card className="hover-lift transition-smooth">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Evolução da Visibilidade da Marca
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Impressões mensais e eventos realizados
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorVisibilidade" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(214, 84%, 56%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(214, 84%, 56%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="month" 
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                tickLine={{ stroke: "hsl(var(--border))" }}
              />
              <YAxis 
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                tickLine={{ stroke: "hsl(var(--border))" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--card-foreground))",
                }}
              />
              <Area
                type="monotone"
                dataKey="visibilidade"
                stroke="hsl(214, 84%, 56%)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorVisibilidade)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default VisibilityChart;