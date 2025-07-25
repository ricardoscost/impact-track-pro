import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  Users, 
  Clock, 
  Plus,
  Filter
} from "lucide-react";

const Calendar = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });
      
      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-secondary/20 text-secondary border-secondary/30";
      case "registered":
        return "bg-primary/20 text-primary border-primary/30";
      case "scheduled":
        return "bg-accent/20 text-accent border-accent/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getTypeColor = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('trail')) {
      return "bg-green-100 text-green-800 border-green-200";
    } else if (lowerType.includes('maratona')) {
      return "bg-blue-100 text-blue-800 border-blue-200";  
    } else if (lowerType.includes('treino')) {
      return "bg-purple-100 text-purple-800 border-purple-200";
    } else {
      return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Calendário de Provas</h1>
          <p className="text-muted-foreground">
            Próximos eventos e oportunidades de visibilidade
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Filter className="w-4 h-4" />
            Filtrar
          </Button>
          <Button variant="gradient">
            <Plus className="w-4 h-4" />
            Novo Evento
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <CalendarIcon className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Próximos 30 dias</p>
                <p className="text-2xl font-bold">{events.length} eventos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 gradient-performance rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Participantes</p>
                <p className="text-2xl font-bold">
                  {events.reduce((sum, event) => sum + (event.participants || 0), 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 gradient-energy rounded-lg flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cidades Visitadas</p>
                <p className="text-2xl font-bold">8 cidades</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Events List */}
      <Card>
        <CardHeader>
          <CardTitle>Eventos Programados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">Carregando eventos...</div>
            ) : events.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum evento encontrado
              </div>
            ) : (
            events.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-smooth"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {new Date(event.date).getDate()}
                    </div>
                    <div className="text-xs text-muted-foreground uppercase">
                      {new Date(event.date).toLocaleDateString('pt-PT', { month: 'short' })}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="font-semibold">{event.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{event.location}</span>
                      </div>
                       <div className="flex items-center space-x-1">
                         <Users className="w-3 h-3" />
                         <span>{event.participants} participantes</span>
                       </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge
                    variant="outline"
                    className={getTypeColor(event.type)}
                  >
                    {event.type}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={getStatusColor(event.status)}
                  >
                    {event.status}
                  </Badge>
                   <div className="text-xs text-muted-foreground">
                     {event.sponsors} patrocinadores
                   </div>
                </div>
               </div>
             ))
            )}
           </div>
        </CardContent>
      </Card>
      </main>
    </div>
  );
};

export default Calendar;