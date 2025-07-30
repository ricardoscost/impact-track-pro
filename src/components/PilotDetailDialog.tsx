import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Trophy, Award, Medal, Globe, Instagram, Facebook, Twitter, Linkedin, Calendar, Bike } from "lucide-react";

interface Pilot {
  id: string;
  name: string;
  biography: string | null;
  photo_url: string | null;
  birth_date: string | null;
  nationality: string | null;
  team: string | null;
  bike_make: string | null;
  bike_model: string | null;
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

interface PilotDetailDialogProps {
  pilot: Pilot | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PilotDetailDialog = ({ pilot, open, onOpenChange }: PilotDetailDialogProps) => {
  const { data: galleryItems, isLoading: loadingGallery } = useQuery({
    queryKey: ["pilot-gallery", pilot?.id],
    queryFn: async () => {
      if (!pilot?.id) return [];
      
      const { data, error } = await supabase
        .from("gallery_items")
        .select("*")
        .contains("tags", [pilot.id])
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!pilot?.id && open,
  });

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  if (!pilot) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{pilot.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Photo and Basic Info */}
          <div className="space-y-4">
            {pilot.photo_url ? (
              <img
                src={pilot.photo_url}
                alt={pilot.name}
                className="w-full aspect-square rounded-lg object-cover border-4 border-primary/20"
              />
            ) : (
              <div className="w-full aspect-square rounded-lg bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                <span className="text-4xl font-bold text-primary">
                  {pilot.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </span>
              </div>
            )}
            
            <div className="space-y-2">
              {pilot.nationality && (
                <Badge variant="secondary" className="w-full justify-center">
                  {pilot.nationality}
                </Badge>
              )}
              {pilot.team && (
                <Badge variant="outline" className="w-full justify-center">
                  {pilot.team}
                </Badge>
              )}
              {pilot.birth_date && (
                <Badge variant="secondary" className="w-full justify-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {calculateAge(pilot.birth_date)} anos
                </Badge>
              )}
            </div>

            {/* Bike Info */}
            {(pilot.bike_make || pilot.bike_model) && (
              <div className="p-3 bg-card rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <Bike className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-sm">Mota</span>
                </div>
                {pilot.bike_make && (
                  <p className="text-sm text-muted-foreground">
                    <strong>Marca:</strong> {pilot.bike_make}
                  </p>
                )}
                {pilot.bike_model && (
                  <p className="text-sm text-muted-foreground">
                    <strong>Modelo:</strong> {pilot.bike_model}
                  </p>
                )}
              </div>
            )}

            {/* Social Links */}
            <div className="flex flex-wrap gap-2">
              {pilot.website && (
                <Button variant="outline" size="sm" asChild>
                  <a href={pilot.website} target="_blank" rel="noopener noreferrer">
                    <Globe className="w-4 h-4" />
                  </a>
                </Button>
              )}
              {pilot.instagram && (
                <Button variant="outline" size="sm" asChild>
                  <a href={pilot.instagram} target="_blank" rel="noopener noreferrer">
                    <Instagram className="w-4 h-4" />
                  </a>
                </Button>
              )}
              {pilot.facebook && (
                <Button variant="outline" size="sm" asChild>
                  <a href={pilot.facebook} target="_blank" rel="noopener noreferrer">
                    <Facebook className="w-4 h-4" />
                  </a>
                </Button>
              )}
              {pilot.twitter && (
                <Button variant="outline" size="sm" asChild>
                  <a href={pilot.twitter} target="_blank" rel="noopener noreferrer">
                    <Twitter className="w-4 h-4" />
                  </a>
                </Button>
              )}
              {pilot.linkedin && (
                <Button variant="outline" size="sm" asChild>
                  <a href={pilot.linkedin} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="w-4 h-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Right Column - Details and Gallery */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-card rounded-lg border">
                <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                <div className="text-xl font-bold">{pilot.championships}</div>
                <div className="text-sm text-muted-foreground">Títulos</div>
              </div>
              <div className="p-4 bg-card rounded-lg border">
                <Award className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <div className="text-xl font-bold">{pilot.victories}</div>
                <div className="text-sm text-muted-foreground">Vitórias</div>
              </div>
              <div className="p-4 bg-card rounded-lg border">
                <Medal className="w-6 h-6 text-bronze mx-auto mb-2" />
                <div className="text-xl font-bold">{pilot.podiums}</div>
                <div className="text-sm text-muted-foreground">Pódios</div>
              </div>
            </div>

            {/* Biography */}
            {pilot.biography && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Biografia</h3>
                <p className="text-muted-foreground">{pilot.biography}</p>
              </div>
            )}

            <Separator />

            {/* Gallery */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Galeria</h3>
              {loadingGallery ? (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">A carregar galeria...</p>
                </div>
              ) : galleryItems && galleryItems.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {galleryItems.map((item) => (
                    <div key={item.id} className="aspect-square rounded-lg overflow-hidden border">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                        onClick={() => window.open(item.image_url, '_blank')}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Nenhuma foto ou vídeo associado ainda.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PilotDetailDialog;