import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
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
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    type: '',
    status: 'scheduled',
    participants: '',
    sponsors: '',
    background_image_url: '',
    links: [{ title: '', url: '' }]
  });

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
      toast({
        title: "Erro",
        description: "Erro ao carregar eventos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('events')
        .insert({
          title: formData.title,
          description: formData.description,
          date: formData.date,
          time: formData.time,
          location: formData.location,
          type: formData.type,
          status: formData.status,
          participants: parseInt(formData.participants) || 0,
          sponsors: parseInt(formData.sponsors) || 0,
          background_image_url: formData.background_image_url,
          links: formData.links.filter(link => link.title && link.url)
        })
        .select()
        .single();
      
      if (error) throw error;
      
      setEvents([...events, data]);
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        type: '',
        status: 'scheduled',
        participants: '',
        sponsors: '',
        background_image_url: '',
        links: [{ title: '', url: '' }]
      });
      setShowForm(false);
      
      toast({
        title: "Evento adicionado",
        description: "O evento foi adicionado com sucesso",
      });
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar evento",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setEvents(events.filter(e => e.id !== id));
      toast({
        title: "Evento removido",
        description: "O evento foi removido com sucesso",
      });
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover evento",
        variant: "destructive"
      });
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
                   <Input
                     id="type"
                     value={formData.type}
                     onChange={(e) => setFormData({...formData, type: e.target.value})}
                     placeholder="ex: Trail, Maratona, Treino"
                     required
                   />
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
                     <option value="scheduled">Agendado</option>
                     <option value="registered">Inscrito</option>
                     <option value="confirmed">Confirmado</option>
                   </select>
                 </div>
                
                 <div className="space-y-2">
                   <Label htmlFor="sponsors">Número de Patrocinadores</Label>
                   <Input
                     id="sponsors"
                     type="number"
                     value={formData.sponsors}
                     onChange={(e) => setFormData({...formData, sponsors: e.target.value})}
                     placeholder="0"
                   />
                 </div>
                 
                 <div className="space-y-2">
                   <Label htmlFor="description">Descrição</Label>
                   <Textarea
                     id="description"
                     value={formData.description}
                     onChange={(e) => setFormData({...formData, description: e.target.value})}
                     placeholder="Descrição do evento"
                   />
                 </div>
                 
                 <div className="space-y-2">
                   <Label htmlFor="background_image_url">URL da Imagem de Fundo</Label>
                   <Input
                     id="background_image_url"
                     value={formData.background_image_url}
                     onChange={(e) => setFormData({...formData, background_image_url: e.target.value})}
                     placeholder="https://example.com/image.jpg"
                   />
                 </div>
                 
                 <div className="md:col-span-2 space-y-4">
                   <div className="flex items-center justify-between">
                     <Label>Links (Opcionais)</Label>
                     <Button
                       type="button"
                       variant="outline"
                       size="sm"
                       onClick={() => setFormData({
                         ...formData,
                         links: [...formData.links, { title: '', url: '' }]
                       })}
                     >
                       <Plus className="w-4 h-4 mr-2" />
                       Adicionar Link
                     </Button>
                   </div>
                   {formData.links.map((link, index) => (
                     <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-2">
                       <Input
                         placeholder="Título do link (ex: Inscrições, Documentos)"
                         value={link.title}
                         onChange={(e) => {
                           const newLinks = [...formData.links];
                           newLinks[index].title = e.target.value;
                           setFormData({...formData, links: newLinks});
                         }}
                       />
                       <div className="flex space-x-2">
                         <Input
                           placeholder="URL do link"
                           value={link.url}
                           onChange={(e) => {
                             const newLinks = [...formData.links];
                             newLinks[index].url = e.target.value;
                             setFormData({...formData, links: newLinks});
                           }}
                         />
                         <Button
                           type="button"
                           variant="outline"
                           size="icon"
                           onClick={() => {
                             const newLinks = formData.links.filter((_, i) => i !== index);
                             setFormData({...formData, links: newLinks});
                           }}
                         >
                           <Trash className="w-4 h-4" />
                         </Button>
                       </div>
                     </div>
                   ))}
                 </div>
                
                <div className="md:col-span-3 flex space-x-2">
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
                           <span>{event.participants} participantes</span>
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
               ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminCalendar;