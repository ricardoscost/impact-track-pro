import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Calendar, MapPin, User } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface LatestResult {
  id: string;
  pilot_name: string;
  position: number;
  points: number;
  time_result: string | null;
  category: string | null;
  event: {
    title: string;
    date: string;
    location: string;
  };
}

const LatestResultBanner = () => {
  const [latestResult, setLatestResult] = useState<LatestResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLatestResult();
  }, []);

  const fetchLatestResult = async () => {
    try {
      const { data, error } = await supabase
        .from('results')
        .select(`
          id,
          pilot_name,
          position,
          points,
          time_result,
          category,
          events (
            title,
            date,
            location
          )
        `)
        .eq('is_active', true)
        // Buscar qualquer resultado recente (removido filtro de posição para teste)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setLatestResult({
          ...data,
          event: data.events as any
        });
      }
    } catch (error) {
      console.error('Error fetching latest result:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !latestResult) {
    return null;
  }

  return (
    <Card className="bg-card border border-primary/20 shadow-elegant overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <Trophy className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-1 text-card-foreground">🏁 Último Resultado</h3>
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="font-semibold text-lg text-card-foreground">{latestResult.pilot_name} - {latestResult.position}º lugar</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {latestResult.category && `Categoria: ${latestResult.category}`}
                {latestResult.time_result && ` • Tempo: ${latestResult.time_result}`}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold mb-1 text-card-foreground">{latestResult.event.title}</div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {format(new Date(latestResult.event.date), "dd/MM/yyyy", { locale: ptBR })}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {latestResult.event.location}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LatestResultBanner;