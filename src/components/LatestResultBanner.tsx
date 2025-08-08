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
      <CardContent className="p-3 md:p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <Trophy className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm md:text-base font-bold mb-1 text-card-foreground">🏁 Último Resultado</h3>
              <div className="flex items-center gap-2 mb-1">
                <User className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground flex-shrink-0" />
                <span className="font-semibold text-sm md:text-base text-card-foreground truncate">{latestResult.pilot_name} - {latestResult.position}º lugar</span>
              </div>
              <div className="text-xs md:text-sm text-muted-foreground">
                {latestResult.category && `Categoria: ${latestResult.category}`}
                {latestResult.time_result && ` • Tempo: ${latestResult.time_result}`}
              </div>
            </div>
          </div>
          <div className="text-left md:text-right flex-shrink-0">
            <div className="text-sm md:text-lg font-bold mb-1 text-card-foreground">{latestResult.event.title}</div>
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-xs md:text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3 flex-shrink-0" />
                <span>{format(new Date(latestResult.event.date), "dd/MM/yyyy", { locale: ptBR })}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{latestResult.event.location}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LatestResultBanner;