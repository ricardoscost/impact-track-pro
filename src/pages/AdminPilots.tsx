import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Save, X, Trophy, Award, Medal, Globe, Instagram, Facebook, Twitter, Linkedin } from "lucide-react";
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

interface Pilot {
  id: string;
  name: string;
  biography: string | null;
  photo_url: string | null;
  birth_date: string | null;
  nationality: string | null;
  team: string | null;
  championships: number;
  victories: number;
  podiums: number;
  website: string | null;
  instagram: string | null;
  facebook: string | null;
  twitter: string | null;
  linkedin: string | null;
  is_active: boolean;
  sort_order: number;
}

interface PilotFormData {
  name: string;
  biography: string;
  photo_url: string;
  birth_date: string;
  nationality: string;
  team: string;
  championships: number;
  victories: number;
  podiums: number;
  website: string;
  instagram: string;
  facebook: string;
  twitter: string;
  linkedin: string;
  is_active: boolean;
  sort_order: number;
}

const AdminPilots = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPilot, setEditingPilot] = useState<Pilot | null>(null);
  const [formData, setFormData] = useState<PilotFormData>({
    name: "",
    biography: "",
    photo_url: "",
    birth_date: "",
    nationality: "",
    team: "",
    championships: 0,
    victories: 0,
    podiums: 0,
    website: "",
    instagram: "",
    facebook: "",
    twitter: "",
    linkedin: "",
    is_active: true,
    sort_order: 0,
  });

  const { data: pilots, isLoading } = useQuery({
    queryKey: ["pilots"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pilots")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      return data as Pilot[];
    },
  });

  const createPilotMutation = useMutation({
    mutationFn: async (pilotData: Omit<PilotFormData, "id">) => {
      const { data, error } = await supabase
        .from("pilots")
        .insert([pilotData])
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pilots"] });
      toast({
        title: "Sucesso",
        description: "Piloto criado com sucesso!",
      });
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao criar piloto: " + error.message,
        variant: "destructive",
      });
    },
  });

  const updatePilotMutation = useMutation({
    mutationFn: async ({ id, ...pilotData }: PilotFormData & { id: string }) => {
      const { data, error } = await supabase
        .from("pilots")
        .update(pilotData)
        .eq("id", id)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pilots"] });
      toast({
        title: "Sucesso",
        description: "Piloto atualizado com sucesso!",
      });
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar piloto: " + error.message,
        variant: "destructive",
      });
    },
  });

  const deletePilotMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("pilots")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pilots"] });
      toast({
        title: "Sucesso",
        description: "Piloto eliminado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao eliminar piloto: " + error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPilot) {
      updatePilotMutation.mutate({ ...formData, id: editingPilot.id });
    } else {
      createPilotMutation.mutate(formData);
    }
  };

  const handleEdit = (pilot: Pilot) => {
    setEditingPilot(pilot);
    setFormData({
      name: pilot.name,
      biography: pilot.biography || "",
      photo_url: pilot.photo_url || "",
      birth_date: pilot.birth_date || "",
      nationality: pilot.nationality || "",
      team: pilot.team || "",
      championships: pilot.championships,
      victories: pilot.victories,
      podiums: pilot.podiums,
      website: pilot.website || "",
      instagram: pilot.instagram || "",
      facebook: pilot.facebook || "",
      twitter: pilot.twitter || "",
      linkedin: pilot.linkedin || "",
      is_active: pilot.is_active,
      sort_order: pilot.sort_order,
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    deletePilotMutation.mutate(id);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      biography: "",
      photo_url: "",
      birth_date: "",
      nationality: "",
      team: "",
      championships: 0,
      victories: 0,
      podiums: 0,
      website: "",
      instagram: "",
      facebook: "",
      twitter: "",
      linkedin: "",
      is_active: true,
      sort_order: 0,
    });
    setEditingPilot(null);
    setIsFormOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestão de Pilotos</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Piloto
        </Button>
      </div>

      {isFormOpen && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingPilot ? "Editar Piloto" : "Adicionar Novo Piloto"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="photo_url">URL da Foto</Label>
                  <Input
                    id="photo_url"
                    type="url"
                    value={formData.photo_url}
                    onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birth_date">Data de Nascimento</Label>
                  <Input
                    id="birth_date"
                    type="date"
                    value={formData.birth_date}
                    onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nationality">Nacionalidade</Label>
                  <Input
                    id="nationality"
                    value={formData.nationality}
                    onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="team">Equipa</Label>
                  <Input
                    id="team"
                    value={formData.team}
                    onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sort_order">Ordem de Exibição</Label>
                  <Input
                    id="sort_order"
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="biography">Biografia</Label>
                <Textarea
                  id="biography"
                  value={formData.biography}
                  onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="championships">Títulos</Label>
                  <Input
                    id="championships"
                    type="number"
                    min="0"
                    value={formData.championships}
                    onChange={(e) => setFormData({ ...formData, championships: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="victories">Vitórias</Label>
                  <Input
                    id="victories"
                    type="number"
                    min="0"
                    value={formData.victories}
                    onChange={(e) => setFormData({ ...formData, victories: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="podiums">Pódios</Label>
                  <Input
                    id="podiums"
                    type="number"
                    min="0"
                    value={formData.podiums}
                    onChange={(e) => setFormData({ ...formData, podiums: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Redes Sociais e Website</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      type="url"
                      value={formData.instagram}
                      onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input
                      id="facebook"
                      type="url"
                      value={formData.facebook}
                      onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter</Label>
                    <Input
                      id="twitter"
                      type="url"
                      value={formData.twitter}
                      onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      type="url"
                      value={formData.linkedin}
                      onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Piloto Ativo</Label>
              </div>

              <div className="flex space-x-4">
                <Button type="submit" disabled={createPilotMutation.isPending || updatePilotMutation.isPending}>
                  <Save className="w-4 h-4 mr-2" />
                  {editingPilot ? "Atualizar" : "Criar"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Pilotos Existentes</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="w-16 h-16 bg-gray-300 rounded-full mb-4"></div>
                  <div className="h-6 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-4"></div>
                  <div className="flex space-x-2">
                    <div className="h-8 w-16 bg-gray-300 rounded"></div>
                    <div className="h-8 w-16 bg-gray-300 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : pilots && pilots.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pilots.map((pilot) => (
              <Card key={pilot.id}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    {pilot.photo_url ? (
                      <img
                        src={pilot.photo_url}
                        alt={pilot.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">
                          {pilot.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{pilot.name}</h3>
                      {pilot.team && (
                        <p className="text-sm text-muted-foreground mb-2">{pilot.team}</p>
                      )}
                      
                      <div className="flex space-x-4 text-sm mb-4">
                        <div className="flex items-center">
                          <Trophy className="w-4 h-4 text-yellow-500 mr-1" />
                          <span>{pilot.championships}</span>
                        </div>
                        <div className="flex items-center">
                          <Award className="w-4 h-4 text-green-500 mr-1" />
                          <span>{pilot.victories}</span>
                        </div>
                        <div className="flex items-center">
                          <Medal className="w-4 h-4 text-bronze mr-1" />
                          <span>{pilot.podiums}</span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(pilot)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Editar
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="w-4 h-4 mr-1" />
                              Eliminar
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Eliminar Piloto</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem a certeza que deseja eliminar o piloto "{pilot.name}"? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(pilot.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                  
                  {!pilot.is_active && (
                    <div className="mt-2">
                      <span className="inline-block px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                        Inativo
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum piloto encontrado</h3>
              <p className="text-muted-foreground mb-4">
                Comece por adicionar o primeiro piloto.
              </p>
              <Button onClick={() => setIsFormOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Piloto
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminPilots;