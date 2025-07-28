import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  ArrowLeft, 
  Plus, 
  Trash, 
  Camera,
  Video,
  Download
} from 'lucide-react';

const AdminGallery = () => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    type: 'photo',
    event: '',
    image_url: '',
    description: ''
  });

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const fetchGalleryItems = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMediaItems(data || []);
    } catch (error) {
      console.error('Error fetching gallery items:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar itens da galeria",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('gallery_items')
        .insert([
          {
            title: formData.title,
            type: formData.type,
            image_url: formData.image_url,
            description: formData.description,
            tags: formData.event ? [formData.event] : []
          }
        ])
        .select();

      if (error) throw error;

      // Create notification
      await supabase
        .from('notifications')
        .insert([
          {
            type: 'gallery',
            title: 'Nova foto/vídeo adicionado',
            message: `${formData.title} foi adicionado à galeria`,
            related_id: data[0].id
          }
        ]);

      await fetchGalleryItems();
      setFormData({
        title: '',
        type: 'photo',
        event: '',
        image_url: '',
        description: ''
      });
      setShowForm(false);
      
      toast({
        title: "Media adicionado",
        description: "O item foi adicionado à galeria com sucesso",
      });
    } catch (error) {
      console.error('Error adding gallery item:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar item à galeria",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('gallery_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchGalleryItems();
      toast({
        title: "Item removido",
        description: "O item foi removido da galeria",
      });
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover item da galeria",
        variant: "destructive"
      });
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return Video;
      default:
        return Camera;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "video":
        return "bg-accent/20 text-accent border-accent/30";
      default:
        return "bg-primary/20 text-primary border-primary/30";
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
              <h1 className="text-3xl font-bold">Gerir Galeria</h1>
              <p className="text-muted-foreground">
                Adicionar fotos e vídeos via links
              </p>
            </div>
          </div>
          <Button variant="gradient" onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Media
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Adicionar Novo Item</CardTitle>
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
                  <Label htmlFor="type">Tipo</Label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="photo">Foto</option>
                    <option value="video">Vídeo</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="event">Evento (opcional)</Label>
                  <Input
                    id="event"
                    value={formData.event}
                    onChange={(e) => setFormData({...formData, event: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Descrição do item"
                  />
                </div>
                
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="image_url">Link da Imagem/Vídeo</Label>
                  <Input
                    id="image_url"
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                    placeholder="https://exemplo.com/imagem.jpg"
                    required
                  />
                </div>
                
                <div className="md:col-span-2 flex space-x-2">
                  <Button type="submit" variant="gradient">
                    Adicionar Item
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Media Grid */}
        {loading ? (
          <div className="text-center py-8">
            <p>A carregar...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mediaItems.map((item) => {
              const TypeIcon = getTypeIcon(item.type);
              return (
                <Card key={item.id} className="overflow-hidden">
                  <div className="relative">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge
                        variant="outline"
                        className={`${getTypeColor(item.type)} backdrop-blur-sm`}
                      >
                        <TypeIcon className="w-3 h-3 mr-1" />
                        {item.type === 'video' ? 'Vídeo' : 'Foto'}
                      </Badge>
                    </div>
                    <div className="absolute top-2 right-2">
                      <Button 
                        variant="destructive" 
                        size="icon" 
                        className="w-8 h-8"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                      {item.description && (
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        {new Date(item.created_at).toLocaleDateString('pt-PT')}
                      </span>
                      {item.is_featured && (
                        <Badge variant="secondary" className="text-xs">
                          Destaque
                        </Badge>
                      )}
                    </div>
                    
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {item.tags.map((tag: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminGallery;