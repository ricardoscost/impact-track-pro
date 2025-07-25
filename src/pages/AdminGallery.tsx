import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
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
  const [mediaItems, setMediaItems] = useState([
    {
      id: 1,
      type: "photo",
      title: "Ultra Trail Serra da Estrela - Largada",
      date: "2024-01-15",
      event: "Ultra Trail Serra da Estrela",
      downloads: 24,
      sponsors: ["Brand A", "Brand B"],
      thumbnail: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop",
    },
    {
      id: 2,
      type: "video",
      title: "Highlights - Meia Maratona do Porto",
      date: "2024-01-10",
      event: "Meia Maratona do Porto",
      downloads: 45,
      sponsors: ["Brand C", "Brand D"],
      thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    },
  ]);

  const [formData, setFormData] = useState({
    title: '',
    type: 'photo',
    event: '',
    thumbnail: '',
    sponsors: ''
  });

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem = {
      ...formData,
      id: mediaItems.length + 1,
      date: new Date().toISOString().split('T')[0],
      downloads: 0,
      sponsors: formData.sponsors.split(',').map(s => s.trim()).filter(s => s)
    };
    
    setMediaItems([...mediaItems, newItem]);
    setFormData({
      title: '',
      type: 'photo',
      event: '',
      thumbnail: '',
      sponsors: ''
    });
    setShowForm(false);
    
    toast({
      title: "Media adicionado",
      description: "O item foi adicionado à galeria com sucesso",
    });
  };

  const handleDelete = (id: number) => {
    setMediaItems(mediaItems.filter(item => item.id !== id));
    toast({
      title: "Item removido",
      description: "O item foi removido da galeria",
    });
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
                  <Label htmlFor="event">Evento</Label>
                  <Input
                    id="event"
                    value={formData.event}
                    onChange={(e) => setFormData({...formData, event: e.target.value})}
                    required
                  />
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
                
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="thumbnail">Link da Imagem/Vídeo</Label>
                  <Input
                    id="thumbnail"
                    type="url"
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({...formData, thumbnail: e.target.value})}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mediaItems.map((item) => {
            const TypeIcon = getTypeIcon(item.type);
            return (
              <Card key={item.id} className="overflow-hidden">
                <div className="relative">
                  <img
                    src={item.thumbnail}
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
                    <p className="text-xs text-muted-foreground">{item.event}</p>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      {new Date(item.date).toLocaleDateString('pt-PT')}
                    </span>
                    <span className="text-muted-foreground">
                      {item.downloads} downloads
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {item.sponsors.map((sponsor, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {sponsor}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminGallery;