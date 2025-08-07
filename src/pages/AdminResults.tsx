import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft, Plus, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
}

interface Result {
  id: string;
  event_id: string;
  pilot_name: string;
  position: number;
  points: number;
  time_result: string | null;
  category: string | null;
  bike_info: string | null;
  observations: string | null;
  events?: Event;
}

const AdminResults = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingResult, setEditingResult] = useState<Result | null>(null);
  const [formData, setFormData] = useState({
    event_id: "",
    pilot_name: "",
    position: 1,
    points: 0,
    time_result: "",
    category: "",
    bike_info: "",
    observations: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resultsData, eventsData] = await Promise.all([
        supabase.from('results').select('*, events(id, title, date, location)').order('event_id'),
        supabase.from('events').select('id, title, date, location').order('date', { ascending: false })
      ]);

      if (resultsData.error) throw resultsData.error;
      if (eventsData.error) throw eventsData.error;

      setResults(resultsData.data || []);
      setEvents(eventsData.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.event_id || !formData.pilot_name.trim()) {
      toast.error('Evento e nome do piloto são obrigatórios');
      return;
    }

    try {
      if (editingResult) {
        const { error } = await supabase.from('results').update(formData).eq('id', editingResult.id);
        if (error) throw error;
        toast.success('Resultado atualizado');
      } else {
        const { error } = await supabase.from('results').insert([formData]);
        if (error) throw error;
        toast.success('Resultado adicionado');
      }

      fetchData();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving result:', error);
      toast.error('Erro ao salvar resultado');
    }
  };

  const resetForm = () => {
    setFormData({
      event_id: "",
      pilot_name: "",
      position: 1,
      points: 0,
      time_result: "",
      category: "",
      bike_info: "",
      observations: ""
    });
    setEditingResult(null);
  };

  const handleEdit = (result: Result) => {
    setEditingResult(result);
    setFormData({
      event_id: result.event_id,
      pilot_name: result.pilot_name,
      position: result.position,
      points: result.points,
      time_result: result.time_result || "",
      category: result.category || "",
      bike_info: result.bike_info || "",
      observations: result.observations || ""
    });
    setIsDialogOpen(true);
  };

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
          <h1 className="text-3xl font-bold">Gestão de Resultados</h1>
        </div>

        <div className="flex justify-end mb-6">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Resultado
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingResult ? 'Editar' : 'Adicionar'} Resultado</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Evento</Label>
                  <Select value={formData.event_id} onValueChange={(value) => setFormData(prev => ({...prev, event_id: value}))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um evento" />
                    </SelectTrigger>
                    <SelectContent>
                      {events.map(event => (
                        <SelectItem key={event.id} value={event.id}>{event.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Nome do Piloto</Label>
                  <Input value={formData.pilot_name} onChange={(e) => setFormData(prev => ({...prev, pilot_name: e.target.value}))} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Posição</Label>
                    <Input type="number" value={formData.position} onChange={(e) => setFormData(prev => ({...prev, position: parseInt(e.target.value) || 1}))} />
                  </div>
                  <div>
                    <Label>Pontos</Label>
                    <Input type="number" value={formData.points} onChange={(e) => setFormData(prev => ({...prev, points: parseInt(e.target.value) || 0}))} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Tempo</Label>
                    <Input value={formData.time_result} onChange={(e) => setFormData(prev => ({...prev, time_result: e.target.value}))} placeholder="Ex: 01:23:45" />
                  </div>
                  <div>
                    <Label>Categoria</Label>
                    <Input value={formData.category} onChange={(e) => setFormData(prev => ({...prev, category: e.target.value}))} />
                  </div>
                </div>
                <div>
                  <Label>Informação da Moto</Label>
                  <Input value={formData.bike_info} onChange={(e) => setFormData(prev => ({...prev, bike_info: e.target.value}))} />
                </div>
                <div>
                  <Label>Observações</Label>
                  <Textarea value={formData.observations} onChange={(e) => setFormData(prev => ({...prev, observations: e.target.value}))} />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave} className="flex-1">{editingResult ? 'Atualizar' : 'Adicionar'}</Button>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">Cancelar</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {results.map(result => (
            <Card key={result.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{result.pilot_name} - {result.position}º lugar</h3>
                    <p className="text-sm text-muted-foreground">{result.events?.title}</p>
                    {result.time_result && <p className="text-sm">Tempo: {result.time_result}</p>}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(result)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminResults;