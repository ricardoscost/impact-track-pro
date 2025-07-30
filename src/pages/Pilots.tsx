import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import Header from "@/components/Header";
import PilotDetailDialog from "@/components/PilotDetailDialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

const Pilots = () => {
  const [selectedPilot, setSelectedPilot] = useState<Pilot | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: pilots, isLoading } = useQuery({
    queryKey: ["pilots"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pilots")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (error) throw error;
      return data as Pilot[];
    },
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-8">Pilotos</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
                    <div className="h-6 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-300 rounded"></div>
                      <div className="h-3 bg-gray-300 rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Pilotos</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Conheça os nossos talentosos pilotos que representam o nosso clube nas competições de enduro.
          </p>
        </div>

        {pilots && pilots.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pilots.map((pilot) => (
              <Card 
                key={pilot.id} 
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => {
                  setSelectedPilot(pilot);
                  setDialogOpen(true);
                }}
              >
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    {pilot.photo_url ? (
                      <img
                        src={pilot.photo_url}
                        alt={pilot.name}
                        className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-primary/20"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-primary">
                          {pilot.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </span>
                      </div>
                    )}
                    
                    <h3 className="text-xl font-bold mb-2">{pilot.name}</h3>
                    
                    <div className="flex flex-wrap gap-2 justify-center mb-4">
                      {pilot.nationality && (
                        <Badge variant="secondary">{pilot.nationality}</Badge>
                      )}
                      {pilot.team && (
                        <Badge variant="outline">{pilot.team}</Badge>
                      )}
                      {pilot.birth_date && (
                        <Badge variant="secondary">
                          <Calendar className="w-3 h-3 mr-1" />
                          {calculateAge(pilot.birth_date)} anos
                        </Badge>
                      )}
                    </div>

                    {/* Bike Info */}
                    {(pilot.bike_make || pilot.bike_model) && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Bike className="w-4 h-4" />
                        <span>
                          {pilot.bike_make && pilot.bike_model 
                            ? `${pilot.bike_make} ${pilot.bike_model}`
                            : pilot.bike_make || pilot.bike_model
                          }
                        </span>
                      </div>
                    )}
                  </div>

                  {pilot.biography && (
                    <p className="text-sm text-muted-foreground mb-6 line-clamp-3">
                      {pilot.biography}
                    </p>
                  )}

                  <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                    <div className="flex flex-col items-center">
                      <Trophy className="w-5 h-5 text-yellow-500 mb-1" />
                      <span className="text-sm font-semibold">{pilot.championships}</span>
                      <span className="text-xs text-muted-foreground">Títulos</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Award className="w-5 h-5 text-green-500 mb-1" />
                      <span className="text-sm font-semibold">{pilot.victories}</span>
                      <span className="text-xs text-muted-foreground">Vitórias</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Medal className="w-5 h-5 text-bronze mb-1" />
                      <span className="text-sm font-semibold">{pilot.podiums}</span>
                      <span className="text-xs text-muted-foreground">Pódios</span>
                    </div>
                  </div>

                  <div className="flex justify-center space-x-2">
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
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhum piloto encontrado</h3>
            <p className="text-muted-foreground">
              Os pilotos serão adicionados em breve.
            </p>
          </div>
        )}

        <PilotDetailDialog 
          pilot={selectedPilot}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      </main>
    </div>
  );
};

export default Pilots;