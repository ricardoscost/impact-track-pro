import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Camera, 
  Video, 
  Download, 
  Share, 
  Filter,
  Grid3X3,
  List
} from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  type: string;
  created_at: string;
}

const Gallery = () => {
  const [mediaItems, setMediaItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGalleryItems();
  }, []);

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
    } finally {
      setLoading(false);
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
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Galeria Multimédia</h1>
          <p className="text-muted-foreground">
            Conteúdos exclusivos para patrocinadores e imprensa
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon">
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon">
            <List className="w-4 h-4" />
          </Button>
          <Button variant="outline">
            <Filter className="w-4 h-4" />
            Filtrar
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Camera className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Fotos</p>
                <p className="text-xl font-bold">
                  {mediaItems.filter(item => item.type === 'photo').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Video className="w-5 h-5 text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">Vídeos</p>
                <p className="text-xl font-bold">
                  {mediaItems.filter(item => item.type === 'video').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Download className="w-5 h-5 text-secondary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="text-xl font-bold">{mediaItems.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Share className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Este Mês</p>
                <p className="text-xl font-bold">
                  {mediaItems.filter(item => {
                    const itemDate = new Date(item.created_at);
                    const now = new Date();
                    return itemDate.getMonth() === now.getMonth() && 
                           itemDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="text-center py-12">Carregando galeria...</div>
      ) : mediaItems.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          Nenhuma imagem encontrada
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mediaItems.map((item) => {
            const TypeIcon = getTypeIcon(item.type);
            return (
              <Card key={item.id} className="overflow-hidden hover-lift">
                <div className="relative">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
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
                    <Button variant="secondary" size="icon" className="w-8 h-8">
                      <Download className="w-3 h-3" />
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
                  </div>
                  
                  <div className="flex space-x-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="w-3 h-3" />
                      Download
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
      </main>
    </div>
  );
};

export default Gallery;