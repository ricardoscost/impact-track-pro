import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Sponsor {
  id: string;
  name: string;
  logo_url: string;
}

const SponsorCarousel = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);

  useEffect(() => {
    fetchSponsors();
  }, []);

  const fetchSponsors = async () => {
    try {
      const { data, error } = await supabase
        .from('sponsors')
        .select('id, name, logo_url')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      setSponsors(data || []);
    } catch (error) {
      console.error('Error fetching sponsors for carousel:', error);
    }
  };

  if (sponsors.length === 0) return null;

  // Duplicar a lista para criar o efeito infinito
  const duplicatedSponsors = [...sponsors, ...sponsors];

  return (
    <div className="relative overflow-hidden bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 py-8">
      <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background z-10 pointer-events-none" />
      
      <div className="flex animate-scroll-left">
        {duplicatedSponsors.map((sponsor, index) => (
          <div
            key={`${sponsor.id}-${index}`}
            className="flex-shrink-0 mx-8 w-32 h-16 flex items-center justify-center"
          >
            <img
              src={sponsor.logo_url}
              alt={sponsor.name}
              className="max-h-full max-w-full object-contain opacity-70 hover:opacity-100 transition-opacity duration-300 filter grayscale hover:grayscale-0"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
          </div>
        ))}
      </div>
      
      <div className="text-center mt-4">
        <p className="text-sm text-muted-foreground">
          Patrocinadores Oficiais
        </p>
      </div>
    </div>
  );
};

export default SponsorCarousel;