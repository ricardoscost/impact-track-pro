import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Camera, 
  Video, 
  Download, 
  Share, 
  Filter,
  Grid3X3,
  List,
  X
} from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  type: string;
  created_at: string;
  album?: {
    id: string;
    title: string;
    event?: {
      id: string;
      title: string;
      date: string;
    };
  };
  pilots?: {
    id: string;
    name: string;
    photo_url?: string;
  }[];
}

interface Album {
  id: string;
  title: string;
  description?: string;
  cover_image_url?: string;
  event?: {
    id: string;
    title: string;
    date: string;
  };
  items_count: number;
}

const Gallery = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const [mediaItems, setMediaItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'albums' | 'grid'>('albums');

  useEffect(() => {
    if (viewMode === 'albums') {
      fetchAlbums();
    } else {
      fetchGalleryItems();
    }
  }, [viewMode]);

  useEffect(() => {
    if (selectedAlbum) {
      fetchAlbumItems(selectedAlbum);
    }
  }, [selectedAlbum]);

  const fetchAlbums = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_albums')
        .select(`
          *,
          event:events(id, title, date),
          gallery_items(count)
        `)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      
      const albumsWithCount = data?.map(album => ({
        ...album,
        items_count: album.gallery_items?.[0]?.count || 0
      })) || [];
      
      setAlbums(albumsWithCount);
    } catch (error) {
      console.error('Error fetching albums:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGalleryItems = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_items')
        .select(`
          *,
          album:gallery_albums(
            id,
            title,
            event:events(id, title, date)
          ),
          gallery_item_pilots(
            pilot:pilots(id, name, photo_url)
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const itemsWithPilots = data?.map(item => ({
        ...item,
        pilots: item.gallery_item_pilots?.map(gip => gip.pilot) || []
      })) || [];
      
      setMediaItems(itemsWithPilots);
    } catch (error) {
      console.error('Error fetching gallery items:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAlbumItems = async (albumId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('gallery_items')
        .select(`
          *,
          album:gallery_albums(
            id,
            title,
            event:events(id, title, date)
          ),
          gallery_item_pilots(
            pilot:pilots(id, name, photo_url)
          )
        `)
        .eq('album_id', albumId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const itemsWithPilots = data?.map(item => ({
        ...item,
        pilots: item.gallery_item_pilots?.map(gip => gip.pilot) || []
      })) || [];
      
      setMediaItems(itemsWithPilots);
    } catch (error) {
      console.error('Error fetching album items:', error);
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

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {selectedAlbum ? 'Álbum' : 'Galeria Multimédia'}
          </h1>
          <p className="text-muted-foreground">
            {selectedAlbum 
              ? 'Fotografias do álbum selecionado'
              : 'Conteúdos organizados por eventos e álbuns'
            }
          </p>
        </div>
        <div className="flex space-x-2">
          {selectedAlbum && (
            <Button variant="outline" onClick={() => {
              setSelectedAlbum(null);
              setViewMode('albums');
            }}>
              ← Voltar aos Álbuns
            </Button>
          )}
          <Button 
            variant={viewMode === 'albums' ? 'default' : 'outline'} 
            onClick={() => setViewMode('albums')}
          >
            <Grid3X3 className="w-4 h-4" />
            Álbuns
          </Button>
          <Button 
            variant={viewMode === 'grid' ? 'default' : 'outline'} 
            onClick={() => setViewMode('grid')}
          >
            <List className="w-4 h-4" />
            Todas as Fotos
          </Button>
        </div>
      </div>

      {/* Albums Grid */}
      {viewMode === 'albums' && !selectedAlbum && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-12">Carregando álbuns...</div>
            ) : albums.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                Nenhum álbum encontrado
              </div>
            ) : (
              albums.map((album) => (
                <Card 
                  key={album.id} 
                  className="overflow-hidden hover-lift cursor-pointer"
                  onClick={() => setSelectedAlbum(album.id)}
                >
                  <div className="relative h-48">
                    <img
                      src={album.cover_image_url || '/placeholder.svg'}
                      alt={album.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-end p-4">
                      <div className="text-white">
                        <h3 className="font-semibold text-lg">{album.title}</h3>
                        {album.event && (
                          <p className="text-sm opacity-90">
                            {album.event.title} • {new Date(album.event.date).toLocaleDateString('pt-PT')}
                          </p>
                        )}
                        <p className="text-xs opacity-75 mt-1">
                          {album.items_count} {album.items_count === 1 ? 'item' : 'itens'}
                        </p>
                      </div>
                    </div>
                  </div>
                  {album.description && (
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">{album.description}</p>
                    </CardContent>
                  )}
                </Card>
              ))
            )}
          </div>
        </>
      )}

      {/* Media Grid */}
      {(viewMode === 'grid' || selectedAlbum) && (
        <>
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
                  <Dialog key={item.id}>
                    <Card className="overflow-hidden hover-lift group">
                      <div className="relative">
                        <DialogTrigger asChild>
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder.svg';
                            }}
                          />
                        </DialogTrigger>
                        
                        {/* Hover overlay with info */}
                        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                          <div className="text-white text-center space-y-2">
                            {item.album?.event && (
                              <div>
                                <p className="text-sm font-medium">{item.album.event.title}</p>
                                <p className="text-xs opacity-75">
                                  {new Date(item.album.event.date).toLocaleDateString('pt-PT')}
                                </p>
                              </div>
                            )}
                            {item.pilots && item.pilots.length > 0 && (
                              <div className="flex flex-wrap justify-center gap-1 mt-2">
                                {item.pilots.map((pilot) => (
                                  <div key={pilot.id} className="flex items-center space-x-1 bg-black/50 rounded-full px-2 py-1">
                                    {pilot.photo_url ? (
                                      <img 
                                        src={pilot.photo_url} 
                                        alt={pilot.name}
                                        className="w-4 h-4 rounded-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-4 h-4 rounded-full bg-primary/30" />
                                    )}
                                    <span className="text-xs">{pilot.name}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        
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
                            variant="secondary" 
                            size="icon" 
                            className="w-8 h-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(item.image_url, item.title);
                            }}
                          >
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
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleDownload(item.image_url, item.title)}
                          >
                            <Download className="w-3 h-3" />
                            Download
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share className="w-3 h-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

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
                          
                          {item.pilots && item.pilots.length > 0 && (
                            <div className="mb-3">
                              <p className="text-xs opacity-75 mb-1">Pilotos:</p>
                              <div className="flex flex-wrap gap-2">
                                {item.pilots.map((pilot) => (
                                  <div key={pilot.id} className="flex items-center space-x-2 bg-black/50 rounded-full px-3 py-1">
                                    {pilot.photo_url ? (
                                      <img 
                                        src={pilot.photo_url} 
                                        alt={pilot.name}
                                        className="w-6 h-6 rounded-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-6 h-6 rounded-full bg-primary/30" />
                                    )}
                                    <span className="text-sm">{pilot.name}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm opacity-75">
                              {new Date(item.created_at).toLocaleDateString('pt-PT')}
                            </span>
                            <Button 
                              variant="secondary" 
                              size="sm"
                              onClick={() => handleDownload(item.image_url, item.title)}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                );
              })}
            </div>
          )}
        </>
      )}
      </main>
    </div>
  );
};

export default Gallery;