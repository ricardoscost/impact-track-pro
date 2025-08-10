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
  pilots?: {
    id: string;
    name: string;
    photo_url: string | null;
  };
  event: {
    title: string;
    date: string;
    location: string;
  };
}

const LatestResultBanner = () => {
  const [latestResults, setLatestResults] = useState<LatestResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLatestResult();
  }, []);

  const fetchLatestResult = async () => {
    try {
      // First, get the latest event with results
      const { data: latestEventData, error: eventError } = await supabase
        .from('results')
        .select('event_id')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (eventError || !latestEventData) {
        setLoading(false);
        return;
      }

      // Then get all results for that event
      const { data, error } = await supabase
        .from('results')
        .select(`
          id,
          pilot_name,
          position,
          points,
          time_result,
          category,
          pilots (
            id,
            name,
            photo_url
          ),
          events (
            title,
            date,
            location
          )
        `)
        .eq('is_active', true)
        .eq('event_id', latestEventData.event_id)
        .order('position', { ascending: true });

      if (error) throw error;
      
      if (data && data.length > 0) {
        const resultsWithEvents = data.map(result => ({
          ...result,
          event: result.events as any
        }));
        setLatestResults(resultsWithEvents);
      }
    } catch (error) {
      console.error('Error fetching latest result:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || latestResults.length === 0) {
    return null;
  }

  const event = latestResults[0]?.event;

  return (
    <Card className="bg-card border border-primary/20 shadow-elegant overflow-hidden">
      <CardContent className="p-4">
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Trophy className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-card-foreground">🏁 Últimos Resultados</h3>
              <div className="text-sm text-muted-foreground">{event.title}</div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(event.date), "dd/MM/yyyy", { locale: ptBR })}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{event.location}</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          {latestResults.slice(0, 5).map((result, index) => (
            <div key={result.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                result.position === 1 ? 'bg-yellow-500 text-white' :
                result.position === 2 ? 'bg-gray-400 text-white' :
                result.position === 3 ? 'bg-amber-600 text-white' :
                'bg-muted text-foreground'
              }`}>
                {result.position}
              </div>
              {result.pilots?.photo_url && (
                <img
                  src={result.pilots.photo_url}
                  alt={result.pilot_name}
                  className="w-8 h-8 rounded-full object-cover border border-primary/20"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{result.pilot_name}</div>
                {result.time_result && (
                  <div className="text-xs text-muted-foreground">{result.time_result}</div>
                )}
              </div>
              {result.points > 0 && (
                <div className="text-xs text-muted-foreground">{result.points} pts</div>
              )}
            </div>
          ))}
          {latestResults.length > 5 && (
            <div className="text-center text-sm text-muted-foreground pt-2">
              +{latestResults.length - 5} mais...
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LatestResultBanner;