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
        .eq('position', 1) // Apenas vencedores
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
    <Card className="bg-gradient-primary border-none text-white shadow-elegant">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Trophy className="w-8 h-8 text-yellow-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-1">🏆 Último Vencedor</h3>
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4" />
                <span className="font-semibold text-lg">{latestResult.pilot_name}</span>
              </div>
              <div className="text-sm text-white/80">
                {latestResult.category && `Categoria: ${latestResult.category}`}
                {latestResult.time_result && ` • Tempo: ${latestResult.time_result}`}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold mb-1">{latestResult.event.title}</div>
            <div className="flex items-center gap-4 text-sm text-white/80">
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