import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Trophy, Clock, User, Bike } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  type: string;
  status: string;
}

interface Result {
  id: string;
  event_id: string;
  pilot_name: string;
  position: number;
  points: number;
  time_result: string | null;
  category: string | null;
  bike_info: string | null;
  observations: string | null;
  event?: Event;
}

const Results = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [groupedResults, setGroupedResults] = useState<{ [eventId: string]: Result[] }>({});

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const { data, error } = await supabase
        .from('results')
        .select(`
          *,
          events (
            id,
            title,
            date,
            location,
            type,
            status
          )
        `)
        .eq('is_active', true)
        .order('event_id')
        .order('position', { ascending: true });

      if (error) throw error;
      
      const resultsData = data || [];
      setResults(resultsData);

      // Group results by event
      const grouped = resultsData.reduce((acc, result) => {
        const eventId = result.event_id;
        if (!acc[eventId]) {
          acc[eventId] = [];
        }
        acc[eventId].push({
          ...result,
          event: result.events // Fix: map events to event property
        });
        return acc;
      }, {} as { [eventId: string]: Result[] });

      setGroupedResults(grouped);
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPositionColor = (position: number) => {
    switch (position) {
      case 1:
        return "bg-yellow-500 text-white";
      case 2:
        return "bg-gray-400 text-white";
      case 3:
        return "bg-amber-600 text-white";
      default:
        return "bg-muted text-foreground";
    }
  };

  const getPositionIcon = (position: number) => {
    if (position <= 3) {
      return <Trophy className="w-4 h-4" />;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold mb-4">Resultados</h1>
            <p>Carregando resultados...</p>
          </div>
        </main>
      </div>
    );
  }

  if (Object.keys(groupedResults).length === 0) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold mb-4">Resultados</h1>
            <p className="text-muted-foreground">Nenhum resultado encontrado</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Resultados</h1>
          <p className="text-muted-foreground">
            Resultados dos eventos e competições
          </p>
        </div>

        <div className="space-y-8">
          {Object.entries(groupedResults).map(([eventId, eventResults]) => {
            const event = eventResults[0]?.event as Event;
            if (!event) return null;

            return (
              <Card key={eventId} className="overflow-hidden">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="flex items-center gap-2 mb-2">
                        <Trophy className="w-5 h-5 text-primary" />
                        {event.title}
                      </CardTitle>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <CalendarDays className="w-4 h-4" />
                          {format(new Date(event.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {event.location}
                        </div>
                        <Badge variant="outline">
                          {event.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {eventResults.map((result, index) => (
                      <div
                        key={result.id}
                        className="flex items-center justify-between p-4 bg-card rounded-lg border"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${getPositionColor(result.position)}`}>
                            {getPositionIcon(result.position)}
                            <span className="ml-1">{result.position}º</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <User className="w-4 h-4 text-muted-foreground" />
                              <span className="font-medium">{result.pilot_name}</span>
                            </div>
                            {result.category && (
                              <div className="text-sm text-muted-foreground mb-1">
                                Categoria: {result.category}
                              </div>
                            )}
                            {result.bike_info && (
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Bike className="w-3 h-3" />
                                {result.bike_info}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          {result.time_result && (
                            <div className="flex items-center gap-1 text-sm font-mono">
                              <Clock className="w-4 h-4" />
                              {result.time_result}
                            </div>
                          )}
                          {result.points > 0 && (
                            <div className="text-sm text-muted-foreground">
                              {result.points} pts
                            </div>
                          )}
                          {result.observations && (
                            <div className="text-xs text-muted-foreground mt-1 max-w-xs">
                              {result.observations}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Results;