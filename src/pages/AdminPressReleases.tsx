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
  FileText,
  Calendar,
  Eye
} from 'lucide-react';

const AdminPressReleases = () => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [pressReleases, setPressReleases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    image_url: '',
    is_published: true
  });

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const fetchPressReleases = async () => {
    try {
      const { data, error } = await supabase
        .from('press_releases')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPressReleases(data || []);
    } catch (error) {
      console.error('Error fetching press releases:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar press releases",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPressReleases();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('press_releases')
        .insert([
          {
            title: formData.title,
            excerpt: formData.excerpt,
            content: formData.content,
            image_url: formData.image_url,
            is_published: formData.is_published
          }
        ])
        .select();

      if (error) throw error;

      // Create notification
      await supabase
        .from('notifications')
        .insert([
          {
            type: 'press_release',
            title: 'Novo press release',
            message: `${formData.title} foi publicado`,
            related_id: data[0].id
          }
        ]);

      await fetchPressReleases();
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        image_url: '',
        is_published: true
      });
      setShowForm(false);
      
      toast({
        title: "Press release criado",
        description: "O press release foi criado com sucesso",
      });
    } catch (error) {
      console.error('Error creating press release:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar press release",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('press_releases')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchPressReleases();
      toast({
        title: "Press release removido",
        description: "O press release foi removido com sucesso",
      });
    } catch (error) {
      console.error('Error deleting press release:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover press release",
        variant: "destructive"
      });
    }
  };

  const togglePublished = async (id: string, isPublished: boolean) => {
    try {
      const { error } = await supabase
        .from('press_releases')
        .update({ is_published: !isPublished })
        .eq('id', id);

      if (error) throw error;

      await fetchPressReleases();
      toast({
        title: "Status atualizado",
        description: `Press release ${!isPublished ? 'publicado' : 'despublicado'}`,
      });
    } catch (error) {
      console.error('Error updating press release:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar status",
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
              <h1 className="text-3xl font-bold">Gerir Press Releases</h1>
              <p className="text-muted-foreground">
                Criar e gerir comunicados de imprensa
              </p>
            </div>
          </div>
          <Button variant="gradient" onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Press Release
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Criar Novo Press Release</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <Label htmlFor="image_url">URL da Imagem</Label>
                    <Input
                      id="image_url"
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                      placeholder="https://exemplo.com/imagem.jpg"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="excerpt">Resumo</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                    placeholder="Breve resumo do press release"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="content">Conteúdo</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    placeholder="Conteúdo completo do press release"
                    rows={8}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_published"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({...formData, is_published: e.target.checked})}
                  />
                  <Label htmlFor="is_published">Publicar imediatamente</Label>
                </div>
                
                <div className="flex space-x-2">
                  <Button type="submit" variant="gradient">
                    Criar Press Release
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Press Releases Grid */}
        {loading ? (
          <div className="text-center py-8">
            <p>A carregar...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pressReleases.map((release) => (
              <Card key={release.id} className="overflow-hidden">
                {release.image_url && (
                  <div className="relative">
                    <img
                      src={release.image_url}
                      alt={release.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Button 
                        variant="destructive" 
                        size="icon" 
                        className="w-8 h-8"
                        onClick={() => handleDelete(release.id)}
                      >
                        <Trash className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                )}
                
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-sm">{release.title}</h3>
                    <Badge 
                      variant={release.is_published ? "default" : "secondary"}
                      className="ml-2 cursor-pointer"
                      onClick={() => togglePublished(release.id, release.is_published)}
                    >
                      {release.is_published ? 'Publicado' : 'Rascunho'}
                    </Badge>
                  </div>
                  
                  {release.excerpt && (
                    <p className="text-xs text-muted-foreground line-clamp-3">
                      {release.excerpt}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(release.created_at).toLocaleDateString('pt-PT')}
                    </span>
                    <div className="flex items-center space-x-2">
                      <FileText className="w-3 h-3" />
                      <span>Press Release</span>
                    </div>
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

export default AdminPressReleases;