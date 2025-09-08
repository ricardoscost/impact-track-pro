import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Camera, Video, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import GalleryModal from "./GalleryModal";

interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  type: string;
  created_at: string;
}

const LatestGallery = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    fetchLatestItems();
  }, []);

  const fetchLatestItems = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_items')
        .select('id, title, description, image_url, type, created_at')
        .order('created_at', { ascending: false })
        .limit(6);
      
      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching latest gallery items:', error);
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <Camera className="w-5 h-5" />
          <span>Últimas Fotografias</span>
        </CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/gallery">
            <Eye className="w-4 h-4" />
            Ver Todas
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            Carregando fotografias...
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma fotografia encontrada
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {items.map((item, index) => {
              const TypeIcon = getTypeIcon(item.type);
              return (
                <div 
                  key={item.id} 
                  className="relative group cursor-pointer"
                  onClick={() => {
                    setSelectedIndex(index);
                    setModalOpen(true);
                  }}
                >
                  <div className="aspect-square overflow-hidden rounded-lg">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  
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
                        {new Date(item.created_at).toLocaleDateString('pt-PT')}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        <GalleryModal
          items={items}
          currentIndex={selectedIndex}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      </CardContent>
    </Card>
  );
};

export default LatestGallery;