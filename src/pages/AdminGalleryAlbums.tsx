import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  ArrowLeft, 
  Plus, 
  Trash, 
  Edit,
  Eye,
  Calendar
} from 'lucide-react';

interface Album {
  id: string;
  title: string;
  description?: string;
  cover_image_url?: string;
  event_id?: string;
  sort_order: number;
  created_at: string;
  event?: {
    id: string;
    title: string;
    date: string;
  };
  items_count: number;
}

interface Event {
  id: string;
  title: string;
  date: string;
}

const AdminGalleryAlbums = () => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_id: '',
    cover_image_url: ''
  });

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const fetchAlbums = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_albums')
        .select(`
          *,
          event:events(id, title, date),
          gallery_items(count)
        `)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      
      const albumsWithCount = data?.map(album => ({
        ...album,
        items_count: album.gallery_items?.[0]?.count || 0
      })) || [];
      
      setAlbums(albumsWithCount);
    } catch (error) {
      console.error('Error fetching albums:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar álbuns",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('id, title, date')
        .order('date', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    fetchAlbums();
    fetchEvents();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const albumData = {
        title: formData.title,
        description: formData.description || null,
        event_id: formData.event_id || null,
        cover_image_url: formData.cover_image_url || null,
        sort_order: albums.length
      };

      if (editingAlbum) {
        const { error } = await supabase
          .from('gallery_albums')
          .update(albumData)
          .eq('id', editingAlbum.id);

        if (error) throw error;
        
        toast({
          title: "Álbum atualizado",
          description: "O álbum foi atualizado com sucesso",
        });
      } else {
        const { error } = await supabase
          .from('gallery_albums')
          .insert([albumData]);

        if (error) throw error;
        
        toast({
          title: "Álbum criado",
          description: "O álbum foi criado com sucesso",
        });
      }

      await fetchAlbums();
      resetForm();
    } catch (error) {
      console.error('Error saving album:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar álbum",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (album: Album) => {
    setEditingAlbum(album);
    setFormData({
      title: album.title,
      description: album.description || '',
      event_id: album.event_id || '',
      cover_image_url: album.cover_image_url || ''
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      event_id: '',
      cover_image_url: ''
    });
    setEditingAlbum(null);
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este álbum?')) return;
    
    try {
      const { error } = await supabase
        .from('gallery_albums')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchAlbums();
      toast({
        title: "Álbum removido",
        description: "O álbum foi removido com sucesso",
      });
    } catch (error) {
      console.error('Error deleting album:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover álbum",
        variant: "destructive"
      });
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
              <h1 className="text-3xl font-bold">Gerir Álbuns</h1>
              <p className="text-muted-foreground">
                Organizar galeria por eventos e álbuns
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" asChild>
              <Link to="/admin/gallery">
                <Eye className="w-4 h-4 mr-2" />
                Gerir Fotos
              </Link>
            </Button>
            <Button variant="gradient" onClick={() => setShowForm(!showForm)}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Álbum
            </Button>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                {editingAlbum ? 'Editar Álbum' : 'Criar Novo Álbum'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="event_id">Evento (opcional)</Label>
                  <select
                    id="event_id"
                    value={formData.event_id}
                    onChange={(e) => setFormData({...formData, event_id: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">Selecionar evento...</option>
                    {events.map((event) => (
                      <option key={event.id} value={event.id}>
                        {event.title} - {new Date(event.date).toLocaleDateString('pt-PT')}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Descrição do álbum"
                  />
                </div>
                
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="cover_image_url">Imagem de Capa (URL)</Label>
                  <Input
                    id="cover_image_url"
                    type="url"
                    value={formData.cover_image_url}
                    onChange={(e) => setFormData({...formData, cover_image_url: e.target.value})}
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                </div>
                
                <div className="md:col-span-2 flex space-x-2">
                  <Button type="submit" variant="gradient">
                    {editingAlbum ? 'Atualizar' : 'Criar'} Álbum
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Albums Grid */}
        {loading ? (
          <div className="text-center py-8">
            <p>A carregar...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map((album) => (
              <Card key={album.id} className="overflow-hidden">
                <div className="relative h-48">
                  <img
                    src={album.cover_image_url || '/placeholder.svg'}
                    alt={album.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <Button 
                      variant="secondary" 
                      size="icon" 
                      className="w-8 h-8"
                      onClick={() => handleEdit(album)}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="w-8 h-8"
                      onClick={() => handleDelete(album.id)}
                    >
                      <Trash className="w-3 h-3" />
                    </Button>
                  </div>
                  {album.event && (
                    <div className="absolute bottom-2 left-2">
                      <Badge variant="outline" className="bg-black/50 text-white border-white/30">
                        <Calendar className="w-3 h-3 mr-1" />
                        Evento
                      </Badge>
                    </div>
                  )}
                </div>
                
                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{album.title}</h3>
                    {album.description && (
                      <p className="text-sm text-muted-foreground">{album.description}</p>
                    )}
                  </div>
                  
                  {album.event && (
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium">{album.event.title}</p>
                      <p>{new Date(album.event.date).toLocaleDateString('pt-PT')}</p>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {album.items_count} {album.items_count === 1 ? 'item' : 'itens'}
                    </span>
                    <span className="text-muted-foreground">
                      {new Date(album.created_at).toLocaleDateString('pt-PT')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminGalleryAlbums;