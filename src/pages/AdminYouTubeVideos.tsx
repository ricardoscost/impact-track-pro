import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ArrowLeft, Trash2, Plus, Edit, Move } from "lucide-react";
import { Link } from "react-router-dom";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface YouTubeVideo {
  id: string;
  title: string;
  youtube_url: string;
  thumbnail_url: string | null;
  description: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

const AdminYouTubeVideos = () => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<YouTubeVideo | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    youtube_url: "",
    description: "",
    is_active: true,
    sort_order: 0
  });

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('youtube_videos')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
      toast.error('Erro ao carregar vídeos');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      youtube_url: "",
      description: "",
      is_active: true,
      sort_order: videos.length
    });
    setEditingVideo(null);
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.youtube_url.trim()) {
      toast.error('Título e URL são obrigatórios');
      return;
    }

    try {
      if (editingVideo) {
        const { error } = await supabase
          .from('youtube_videos')
          .update(formData)
          .eq('id', editingVideo.id);
        
        if (error) throw error;
        toast.success('Vídeo atualizado com sucesso');
      } else {
        const { error } = await supabase
          .from('youtube_videos')
          .insert([formData]);
        
        if (error) throw error;
        toast.success('Vídeo adicionado com sucesso');
      }

      fetchVideos();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving video:', error);
      toast.error('Erro ao salvar vídeo');
    }
  };

  const handleEdit = (video: YouTubeVideo) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      youtube_url: video.youtube_url,
      description: video.description || "",
      is_active: video.is_active,
      sort_order: video.sort_order
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('youtube_videos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Vídeo removido com sucesso');
      fetchVideos();
    } catch (error) {
      console.error('Error deleting video:', error);
      toast.error('Erro ao remover vídeo');
    }
  };

  const updateSortOrder = async (id: string, newOrder: number) => {
    try {
      const { error } = await supabase
        .from('youtube_videos')
        .update({ sort_order: newOrder })
        .eq('id', id);

      if (error) throw error;
      fetchVideos();
    } catch (error) {
      console.error('Error updating sort order:', error);
      toast.error('Erro ao atualizar ordem');
    }
  };

  const moveVideo = (id: string, direction: 'up' | 'down') => {
    const video = videos.find(v => v.id === id);
    if (!video) return;

    const sortedVideos = [...videos].sort((a, b) => a.sort_order - b.sort_order);
    const currentIndex = sortedVideos.findIndex(v => v.id === id);
    
    if (direction === 'up' && currentIndex > 0) {
      const targetVideo = sortedVideos[currentIndex - 1];
      updateSortOrder(video.id, targetVideo.sort_order);
      updateSortOrder(targetVideo.id, video.sort_order);
    } else if (direction === 'down' && currentIndex < sortedVideos.length - 1) {
      const targetVideo = sortedVideos[currentIndex + 1];
      updateSortOrder(video.id, targetVideo.sort_order);
      updateSortOrder(targetVideo.id, video.sort_order);
    }
  };

  const extractVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const getYouTubeThumbnail = (url: string) => {
    const videoId = extractVideoId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <main className="container mx-auto px-4 py-8">
          <p className="text-center">Carregando...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Gestão de Vídeos YouTube</h1>
        </div>

        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">
            Gerir vídeos do YouTube exibidos na página inicial
          </p>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Vídeo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingVideo ? 'Editar Vídeo' : 'Adicionar Vídeo'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Título do vídeo"
                  />
                </div>
                <div>
                  <Label htmlFor="youtube_url">URL do YouTube</Label>
                  <Input
                    id="youtube_url"
                    value={formData.youtube_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, youtube_url: e.target.value }))}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>
                <div>
                  <Label htmlFor="description">Descrição (opcional)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descrição do vídeo"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="sort_order">Ordem</Label>
                  <Input
                    id="sort_order"
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                  />
                  <Label htmlFor="is_active">Ativo</Label>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave} className="flex-1">
                    {editingVideo ? 'Atualizar' : 'Adicionar'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)} 
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {videos.map((video, index) => (
            <Card key={video.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-32 h-20 rounded overflow-hidden bg-muted">
                    {video.youtube_url && (
                      <img
                        src={getYouTubeThumbnail(video.youtube_url) || '/placeholder.svg'}
                        alt={video.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">{video.title}</h3>
                    {video.description && (
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {video.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Ordem: {video.sort_order}</span>
                      <span>•</span>
                      <span>{video.is_active ? 'Ativo' : 'Inativo'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveVideo(video.id, 'up')}
                      disabled={index === 0}
                    >
                      ↑
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveVideo(video.id, 'down')}
                      disabled={index === videos.length - 1}
                    >
                      ↓
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(video)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja remover este vídeo? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(video.id)}>
                            Remover
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {videos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum vídeo encontrado</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminYouTubeVideos;