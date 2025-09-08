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
  Download,
  Edit,
  Upload
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

const AdminGallery = () => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [pilots, setPilots] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPilots, setSelectedPilots] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    type: 'photo',
    album_id: '',
    image_url: '',
    description: '',
    item_date: '',
    bulk_count: 1,
    bulk_urls: ['']
  });
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const fetchGalleryItems = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_items')
        .select(`
          *,
          album:gallery_albums(title, event:events(title, date)),
          gallery_item_pilots(pilot:pilots(id, name, photo_url))
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const itemsWithPilots = data?.map(item => ({
        ...item,
        pilots: item.gallery_item_pilots?.map((gip: any) => gip.pilot) || []
      })) || [];
      
      setMediaItems(itemsWithPilots);
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

  const fetchPilots = async () => {
    try {
      const { data, error } = await supabase
        .from('pilots')
        .select('id, name, photo_url')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) throw error;
      setPilots(data || []);
    } catch (error) {
      console.error('Error fetching pilots:', error);
    }
  };

  const fetchAlbums = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_albums')
        .select('id, title')
        .eq('is_active', true)
        .order('title', { ascending: true });

      if (error) throw error;
      setAlbums(data || []);
    } catch (error) {
      console.error('Error fetching albums:', error);
    }
  };

  useEffect(() => {
    fetchGalleryItems();
    fetchPilots();
    fetchAlbums();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const itemsToInsert = [];
      
      if (formData.bulk_count > 1) {
        // Bulk upload
        for (let i = 0; i < formData.bulk_urls.length; i++) {
          const url = formData.bulk_urls[i].trim();
          if (url) {
            itemsToInsert.push({
              title: `${formData.title} ${i + 1}`,
              type: formData.type,
              image_url: url,
              description: formData.description,
              album_id: formData.album_id || null,
              item_date: formData.item_date || (
                formData.album_id ? 
                  (await getAlbumEventDate(formData.album_id)) || new Date().toISOString() :
                  new Date().toISOString()
              )
            });
          }
        }
      } else {
        // Single upload
        itemsToInsert.push({
          title: formData.title,
          type: formData.type,
          image_url: formData.image_url,
          description: formData.description,
          album_id: formData.album_id || null,
          item_date: formData.item_date || (
            formData.album_id ? 
              (await getAlbumEventDate(formData.album_id)) || new Date().toISOString() :
              new Date().toISOString()
          )
        });
      }

      const { data, error } = await supabase
        .from('gallery_items')
        .insert(itemsToInsert)
        .select();

      if (error) throw error;

      // Add pilots to gallery items
      if (selectedPilots.length > 0) {
        const pilotInserts: any[] = [];
        data.forEach((item: any) => {
          selectedPilots.forEach(pilotId => {
            pilotInserts.push({
              gallery_item_id: item.id,
              pilot_id: pilotId
            });
          });
        });

        const { error: pilotError } = await supabase
          .from('gallery_item_pilots')
          .insert(pilotInserts);

        if (pilotError) throw pilotError;
      }

      // Create notification
      await supabase
        .from('notifications')
        .insert([
          {
            type: 'gallery',
            title: `${itemsToInsert.length > 1 ? `${itemsToInsert.length} items` : 'Nova foto/vídeo'} adicionado`,
            message: `${formData.title} foi adicionado à galeria`,
            related_id: data[0].id
          }
        ]);

      await fetchGalleryItems();
      setFormData({
        title: '',
        type: 'photo',
        album_id: '',
        image_url: '',
        description: '',
        item_date: '',
        bulk_count: 1,
        bulk_urls: ['']
      });
      setSelectedPilots([]);
      setShowForm(false);
      
      toast({
        title: "Media adicionado",
        description: `${itemsToInsert.length} ${itemsToInsert.length === 1 ? 'item foi adicionado' : 'itens foram adicionados'} à galeria com sucesso`,
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

  const getAlbumEventDate = async (albumId: string) => {
    try {
      const { data, error } = await supabase
        .from('gallery_albums')
        .select('event:events(date)')
        .eq('id', albumId)
        .single();
      
      if (error || !data?.event?.date) return null;
      return data.event.date;
    } catch (error) {
      return null;
    }
  };

  const handleEdit = async (item: any) => {
    setEditingItem(item);
    setSelectedPilots(item.pilots?.map((p: any) => p.id) || []);
    setShowEditDialog(true);
  };

  const handleUpdate = async (updatedItem: any) => {
    try {
      const { error } = await supabase
        .from('gallery_items')
        .update({
          title: updatedItem.title,
          description: updatedItem.description,
          item_date: updatedItem.item_date
        })
        .eq('id', updatedItem.id);

      if (error) throw error;

      // Update pilots
      await supabase
        .from('gallery_item_pilots')
        .delete()
        .eq('gallery_item_id', updatedItem.id);

      if (selectedPilots.length > 0) {
        const pilotInserts = selectedPilots.map(pilotId => ({
          gallery_item_id: updatedItem.id,
          pilot_id: pilotId
        }));

        const { error: pilotError } = await supabase
          .from('gallery_item_pilots')
          .insert(pilotInserts);

        if (pilotError) throw pilotError;
      }

      await fetchGalleryItems();
      setShowEditDialog(false);
      setEditingItem(null);
      setSelectedPilots([]);
      
      toast({
        title: "Item atualizado",
        description: "O item foi atualizado com sucesso",
      });
    } catch (error) {
      console.error('Error updating gallery item:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar item",
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
              <h1 className="text-3xl font-bold">Gerir Fotos/Vídeos</h1>
              <p className="text-muted-foreground">
                Adicionar fotos e vídeos aos álbuns
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" asChild>
              <Link to="/admin/gallery-albums">Gerir Álbuns</Link>
            </Button>
            <Button variant="gradient" onClick={() => setShowForm(!showForm)}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Media
            </Button>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Adicionar Novo Item</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center space-x-4 mb-4">
                  <Label>Modo de upload:</Label>
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant={formData.bulk_count === 1 ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFormData({...formData, bulk_count: 1})}
                    >
                      Individual
                    </Button>
                    <Button
                      type="button"
                      variant={formData.bulk_count > 1 ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFormData({...formData, bulk_count: 5, bulk_urls: ['', '', '', '', '']})}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Lote
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título {formData.bulk_count > 1 && '(será numerado automaticamente)'}</Label>
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
                    <Label htmlFor="album_id">Álbum</Label>
                    <select
                      id="album_id"
                      value={formData.album_id}
                      onChange={(e) => setFormData({...formData, album_id: e.target.value})}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="">Selecionar álbum...</option>
                      {albums.map((album) => (
                        <option key={album.id} value={album.id}>
                          {album.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="item_date">Data da Foto (opcional)</Label>
                    <Input
                      id="item_date"
                      type="date"
                      value={formData.item_date}
                      onChange={(e) => setFormData({...formData, item_date: e.target.value})}
                      placeholder="Se vazio, usa data do evento ou upload"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label>Pilotos na Foto (opcional)</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto border rounded-md p-2">
                      {pilots.map((pilot) => (
                        <label key={pilot.id} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedPilots.includes(pilot.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedPilots([...selectedPilots, pilot.id]);
                              } else {
                                setSelectedPilots(selectedPilots.filter(id => id !== pilot.id));
                              }
                            }}
                            className="rounded"
                          />
                          <div className="flex items-center space-x-1">
                            {pilot.photo_url && (
                              <img 
                                src={pilot.photo_url} 
                                alt={pilot.name}
                                className="w-4 h-4 rounded-full object-cover"
                              />
                            )}
                            <span className="text-sm">{pilot.name}</span>
                          </div>
                        </label>
                      ))}
                    </div>
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
                  
                  {formData.bulk_count === 1 ? (
                    <div className="space-y-2">
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
                  ) : (
                    <div className="md:col-span-2 space-y-2">
                      <Label>Links das Imagens/Vídeos</Label>
                      {formData.bulk_urls.map((url, index) => (
                        <div key={index} className="flex space-x-2">
                          <Input
                            type="url"
                            value={url}
                            onChange={(e) => {
                              const newUrls = [...formData.bulk_urls];
                              newUrls[index] = e.target.value;
                              setFormData({...formData, bulk_urls: newUrls});
                            }}
                            placeholder={`URL ${index + 1}`}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              const newUrls = formData.bulk_urls.filter((_, i) => i !== index);
                              setFormData({...formData, bulk_urls: newUrls, bulk_count: newUrls.length});
                            }}
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newUrls = [...formData.bulk_urls, ''];
                          setFormData({...formData, bulk_urls: newUrls, bulk_count: newUrls.length});
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar URL
                      </Button>
                    </div>
                  )}
                  
                  <div className="md:col-span-2 flex space-x-2">
                    <Button type="submit" variant="gradient">
                      Adicionar {formData.bulk_count > 1 ? `${formData.bulk_urls.filter(url => url.trim()).length} Itens` : 'Item'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Edit Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Editar Item</DialogTitle>
            </DialogHeader>
            {editingItem && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_title">Título</Label>
                  <Input
                    id="edit_title"
                    value={editingItem.title}
                    onChange={(e) => setEditingItem({...editingItem, title: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit_description">Descrição</Label>
                  <Textarea
                    id="edit_description"
                    value={editingItem.description || ''}
                    onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit_item_date">Data da Foto</Label>
                  <Input
                    id="edit_item_date"
                    type="date"
                    value={editingItem.item_date?.split('T')[0] || ''}
                    onChange={(e) => setEditingItem({...editingItem, item_date: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Pilotos Identificados</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto border rounded-md p-2">
                    {pilots.map((pilot) => (
                      <label key={pilot.id} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedPilots.includes(pilot.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedPilots([...selectedPilots, pilot.id]);
                            } else {
                              setSelectedPilots(selectedPilots.filter(id => id !== pilot.id));
                            }
                          }}
                          className="rounded"
                        />
                        <div className="flex items-center space-x-1">
                          {pilot.photo_url && (
                            <img 
                              src={pilot.photo_url} 
                              alt={pilot.name}
                              className="w-4 h-4 rounded-full object-cover"
                            />
                          )}
                          <span className="text-sm">{pilot.name}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button onClick={() => handleUpdate(editingItem)} variant="gradient">
                    Atualizar
                  </Button>
                  <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

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
                    <div className="absolute top-2 right-2 flex space-x-1">
                      <Button 
                        variant="secondary" 
                        size="icon" 
                        className="w-8 h-8"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
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
                        {item.item_date 
                          ? new Date(item.item_date).toLocaleDateString('pt-PT')
                          : new Date(item.created_at).toLocaleDateString('pt-PT')
                        }
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