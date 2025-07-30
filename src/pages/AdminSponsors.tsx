import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Edit, 
  Trash2, 
  ExternalLink,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Save,
  ArrowLeft,
  X
} from "lucide-react";

interface Sponsor {
  id?: string;
  name: string;
  logo_url: string;
  description: string;
  website: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  twitter: string;
  is_active: boolean;
  sort_order: number;
}

const AdminSponsors = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Sponsor>({
    name: '',
    logo_url: '',
    description: '',
    website: '',
    facebook: '',
    instagram: '',
    linkedin: '',
    twitter: '',
    is_active: true,
    sort_order: 0
  });

  useEffect(() => {
    fetchSponsors();
  }, []);

  const fetchSponsors = async () => {
    try {
      const { data, error } = await supabase
        .from('sponsors')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      setSponsors(data || []);
    } catch (error) {
      console.error('Error fetching sponsors:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar patrocinadores",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        const { error } = await supabase
          .from('sponsors')
          .update(formData)
          .eq('id', editingId);
        
        if (error) throw error;
        
        toast({
          title: "Sucesso",
          description: "Patrocinador atualizado com sucesso",
        });
      } else {
        const { error } = await supabase
          .from('sponsors')
          .insert([formData]);
        
        if (error) throw error;
        
        toast({
          title: "Sucesso",
          description: "Patrocinador adicionado com sucesso",
        });
      }
      
      resetForm();
      fetchSponsors();
    } catch (error) {
      console.error('Error saving sponsor:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar patrocinador",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (sponsor: Sponsor) => {
    setFormData(sponsor);
    setEditingId(sponsor.id || null);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja eliminar este patrocinador?')) return;
    
    try {
      const { error } = await supabase
        .from('sponsors')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Patrocinador eliminado com sucesso",
      });
      
      fetchSponsors();
    } catch (error) {
      console.error('Error deleting sponsor:', error);
      toast({
        title: "Erro",
        description: "Erro ao eliminar patrocinador",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      logo_url: '',
      description: '',
      website: '',
      facebook: '',
      instagram: '',
      linkedin: '',
      twitter: '',
      is_active: true,
      sort_order: 0
    });
    setIsEditing(false);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/admin">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Gestão de Patrocinadores</h1>
        </div>
        <Button onClick={() => setIsEditing(true)}>
          <Plus className="w-4 h-4" />
          Novo Patrocinador
        </Button>
      </div>

      {/* Form */}
      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingId ? 'Editar Patrocinador' : 'Novo Patrocinador'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="logo_url">URL do Logotipo *</Label>
                  <Input
                    id="logo_url"
                    type="url"
                    value={formData.logo_url}
                    onChange={(e) => setFormData({...formData, logo_url: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="sort_order">Ordem de Exibição</Label>
                  <Input
                    id="sort_order"
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({...formData, sort_order: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    value={formData.facebook}
                    onChange={(e) => setFormData({...formData, facebook: e.target.value})}
                    placeholder="@username"
                  />
                </div>
                
                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={formData.instagram}
                    onChange={(e) => setFormData({...formData, instagram: e.target.value})}
                    placeholder="@username"
                  />
                </div>
                
                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                    placeholder="company-name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    value={formData.twitter}
                    onChange={(e) => setFormData({...formData, twitter: e.target.value})}
                    placeholder="@username"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                />
                <Label htmlFor="is_active">Ativo</Label>
              </div>
              
              <div className="flex space-x-2">
                <Button type="submit">
                  <Save className="w-4 h-4" />
                  Salvar
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  <X className="w-4 h-4" />
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Sponsors List */}
      <Card>
        <CardHeader>
          <CardTitle>Patrocinadores Existentes</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : sponsors.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum patrocinador encontrado
            </div>
          ) : (
            <div className="space-y-4">
              {sponsors.map((sponsor) => (
                <div key={sponsor.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <img
                      src={sponsor.logo_url}
                      alt={sponsor.name}
                      className="w-16 h-16 object-contain bg-white rounded border"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                    <div>
                      <h3 className="font-semibold">{sponsor.name}</h3>
                      <p className="text-sm text-muted-foreground">{sponsor.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant={sponsor.is_active ? "default" : "secondary"}>
                          {sponsor.is_active ? "Ativo" : "Inativo"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Ordem: {sponsor.sort_order}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {sponsor.website && (
                      <Button variant="outline" size="icon" asChild>
                        <a href={sponsor.website} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                    <Button variant="outline" size="icon" onClick={() => handleEdit(sponsor)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleDelete(sponsor.id!)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSponsors;