import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash, 
  Calendar,
  MapPin,
  Users,
  Clock
} from 'lucide-react';

const AdminCalendar = () => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Ultra Trail Serra da Estrela",
      date: "2024-02-15",
      time: "08:00",
      location: "Covilhã, Portugal",
      type: "trail",
      status: "confirmado",
      participants: 450,
      sponsors: ["Brand A", "Brand B", "Brand C"],
    },
    {
      id: 2,
      title: "Maratona de Lisboa",
      date: "2024-03-10",
      time: "09:00",
      location: "Lisboa, Portugal",
      type: "maratona",
      status: "inscrito",
      participants: 15000,
      sponsors: ["Brand A", "Brand D"],
    },
  ]);

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    type: 'trail',
    status: 'planeado',
    participants: '',
    sponsors: ''
  });

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent = {
      ...formData,
      id: events.length + 1,
      participants: parseInt(formData.participants),
      sponsors: formData.sponsors.split(',').map(s => s.trim())
    };
    
    setEvents([...events, newEvent]);
    setFormData({
      title: '',
      date: '',
      time: '',
      location: '',
      type: 'trail',
      status: 'planeado',
      participants: '',
      sponsors: ''
    });
    setShowForm(false);
    
    toast({
      title: "Evento adicionado",
      description: "O evento foi adicionado com sucesso",
    });
  };

  const handleDelete = (id: number) => {
    setEvents(events.filter(e => e.id !== id));
    toast({
      title: "Evento removido",
      description: "O evento foi removido com sucesso",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmado":
        return "bg-secondary/20 text-secondary border-secondary/30";
      case "inscrito":
        return "bg-primary/20 text-primary border-primary/30";
      case "planeado":
        return "bg-accent/20 text-accent border-accent/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/admin">
              <Button variant="outline" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Gerir Calendário</h1>
              <p className="text-muted-foreground">
                Adicionar e editar eventos
              </p>
            </div>
          </div>
          <Button variant="gradient" onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Evento
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Adicionar Novo Evento</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título do Evento</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo</Label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="trail">Trail</option>
                    <option value="maratona">Maratona</option>
                    <option value="treino">Treino</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date">Data</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="time">Hora</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Localização</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="participants">Participantes</Label>
                  <Input
                    id="participants"
                    type="number"
                    value={formData.participants}
                    onChange={(e) => setFormData({...formData, participants: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Estado</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="planeado">Planeado</option>
                    <option value="inscrito">Inscrito</option>
                    <option value="confirmado">Confirmado</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sponsors">Patrocinadores (separados por vírgula)</Label>
                  <Input
                    id="sponsors"
                    value={formData.sponsors}
                    onChange={(e) => setFormData({...formData, sponsors: e.target.value})}
                    placeholder="Brand A, Brand B, Brand C"
                  />
                </div>
                
                <div className="md:col-span-2 flex space-x-2">
                  <Button type="submit" variant="gradient">
                    Adicionar Evento
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Events List */}
        <Card>
          <CardHeader>
            <CardTitle>Eventos Atuais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
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
                          <span>{event.participants.toLocaleString()} participantes</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant="outline"
                      className={getStatusColor(event.status)}
                    >
                      {event.status}
                    </Badge>
                    <Button variant="ghost" size="icon">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDelete(event.id)}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminCalendar;