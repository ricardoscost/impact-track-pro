import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  Users, 
  Clock, 
  Plus,
  Filter,
  ExternalLink
} from "lucide-react";

const Calendar = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

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
              <Dialog key={event.id}>
                <DialogTrigger asChild>
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 hover:border-accent/50 transition-smooth cursor-pointer group">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-accent group-hover:text-accent">
                          {new Date(event.date).getDate()}
                        </div>
                        <div className="text-xs text-muted-foreground uppercase">
                          {new Date(event.date).toLocaleDateString('pt-PT', { month: 'short' })}
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <h3 className="font-semibold group-hover:text-accent transition-smooth">{event.title}</h3>
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant="outline"
                        className="bg-accent/10 text-accent border-accent/30"
                      >
                        {event.type}
                      </Badge>
                    </div>
                  </div>
                </DialogTrigger>
                
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl">{event.title}</DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <CalendarIcon className="w-4 h-4 text-accent" />
                          <span className="font-medium">Data:</span>
                          <span>{new Date(event.date).toLocaleDateString('pt-PT')}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-accent" />
                          <span className="font-medium">Hora:</span>
                          <span>{event.time}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-accent" />
                          <span className="font-medium">Local:</span>
                          <span>{event.location}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-accent" />
                          <span className="font-medium">Participantes:</span>
                          <span>{event.participants}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">Patrocinadores:</span>
                          <span>{event.sponsors}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">Estado:</span>
                          <Badge
                            variant="outline"
                            className={getStatusColor(event.status)}
                          >
                            {event.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    {event.description && (
                      <div>
                        <h4 className="font-medium mb-2">Descrição:</h4>
                        <p className="text-muted-foreground">{event.description}</p>
                      </div>
                    )}
                    
                    {event.links && event.links.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Links:</h4>
                        <div className="space-y-2">
                          {event.links.map((link: any, index: number) => (
                            <a
                              key={index}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-smooth"
                            >
                              <ExternalLink className="w-4 h-4" />
                              <span>{link.title}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
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