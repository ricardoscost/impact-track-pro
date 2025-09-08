import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Camera, Video, Download } from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  type: string;
  item_date: string;
  album?: {
    title: string;
    event?: {
      title: string;
      date: string;
    };
  };
}

interface PilotGalleryProps {
  pilotId: string;
  pilotName: string;
}

const PilotGallery = ({ pilotId, pilotName }: PilotGalleryProps) => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPilotGallery();
  }, [pilotId]);

  const fetchPilotGallery = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_item_pilots')
        .select(`
          gallery_item:gallery_items(
            id,
            title,
            description,
            image_url,
            type,
            item_date,
            album:gallery_albums(
              title,
              event:events(title, date)
            )
          )
        `)
        .eq('pilot_id', pilotId);
      
      if (error) throw error;
      
      const galleryItems = data?.map(item => item.gallery_item).filter(Boolean) || [];
      setItems(galleryItems);
    } catch (error) {
      console.error('Error fetching pilot gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'video' ? Video : Camera;
  };

  const getTypeColor = (type: string) => {
    return type === 'video' 
      ? "bg-accent/20 text-accent border-accent/30" 
      : "bg-primary/20 text-primary border-primary/30";
  };

  const handleDownload = async (imageUrl: string, title: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Galeria do Piloto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Carregando galeria...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Galeria do Piloto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma fotografia encontrada para {pilotName}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Galeria do Piloto ({items.length} {items.length === 1 ? 'item' : 'itens'})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => {
            const TypeIcon = getTypeIcon(item.type);
            return (
              <Dialog key={item.id}>
                <div className="relative group">
                  <DialogTrigger asChild>
                    <div className="aspect-square overflow-hidden rounded-lg cursor-pointer">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                    </div>
                  </DialogTrigger>
                  
                  <div className="absolute top-2 left-2">
                    <Badge
                      variant="outline"
                      className={`${getTypeColor(item.type)} backdrop-blur-sm text-xs`}
                    >
                      <TypeIcon className="w-3 h-3 mr-1" />
                      {item.type === 'video' ? 'Vídeo' : 'Foto'}
                    </Badge>
                  </div>
                  
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-end p-3">
                    <div className="text-white">
                      <h4 className="text-sm font-medium mb-1">{item.title}</h4>
                      <p className="text-xs opacity-90">
                        {new Date(item.item_date).toLocaleDateString('pt-PT')}
                      </p>
                      {item.album?.event && (
                        <p className="text-xs opacity-75">
                          {item.album.event.title}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <DialogContent className="max-w-4xl max-h-[90vh] p-0">
                  <div className="relative">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-auto max-h-[85vh] object-contain"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm text-white p-4">
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                      {item.description && (
                        <p className="text-sm opacity-90 mb-2">{item.description}</p>
                      )}
                      
                      {item.album?.event && (
                        <div className="mb-2">
                          <p className="text-sm font-medium">{item.album.event.title}</p>
                          <p className="text-xs opacity-75">
                            {new Date(item.album.event.date).toLocaleDateString('pt-PT')}
                          </p>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm opacity-75">
                          {new Date(item.item_date).toLocaleDateString('pt-PT')}
                        </span>
                        <button 
                          className="px-3 py-1 bg-white/20 rounded hover:bg-white/30 transition-colors flex items-center space-x-1"
                          onClick={() => handleDownload(item.image_url, item.title)}
                        >
                          <Download className="w-4 h-4" />
                          <span className="text-sm">Download</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default PilotGallery;