import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  ExternalLink, 
  Facebook, 
  Instagram, 
  Linkedin, 
  Twitter,
  Globe
} from "lucide-react";

interface Sponsor {
  id: string;
  name: string;
  logo_url: string;
  description: string;
  website: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  is_active: boolean;
}

const Sponsors = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSponsors();
  }, []);

  const fetchSponsors = async () => {
    try {
      const { data, error } = await supabase
        .from('sponsors')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      setSponsors(data || []);
    } catch (error) {
      console.error('Error fetching sponsors:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'facebook': return Facebook;
      case 'instagram': return Instagram;
      case 'linkedin': return Linkedin;
      case 'twitter': return Twitter;
      default: return Globe;
    }
  };

  const formatSocialUrl = (platform: string, handle: string) => {
    if (!handle) return '';
    
    const cleanHandle = handle.replace('@', '');
    
    switch (platform) {
      case 'facebook': return `https://facebook.com/${cleanHandle}`;
      case 'instagram': return `https://instagram.com/${cleanHandle}`;
      case 'linkedin': return `https://linkedin.com/company/${cleanHandle}`;
      case 'twitter': return `https://twitter.com/${cleanHandle}`;
      default: return handle;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Nossos Patrocinadores</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Conheça as marcas que apoiam nossa jornada no enduro e tornam possível 
            a nossa participação em competições de alto nível.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {sponsors.length}
              </div>
              <p className="text-muted-foreground">Patrocinadores Ativos</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-secondary mb-2">5+</div>
              <p className="text-muted-foreground">Anos de Parceria</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-accent mb-2">100%</div>
              <p className="text-muted-foreground">Satisfação Garantida</p>
            </CardContent>
          </Card>
        </div>

        {/* Sponsors Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-lg">Carregando patrocinadores...</div>
          </div>
        ) : sponsors.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            Nenhum patrocinador encontrado
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sponsors.map((sponsor) => (
              <Card key={sponsor.id} className="overflow-hidden hover-lift">
                <CardContent className="p-0">
                  {/* Logo Section */}
                  <div className="bg-white p-8 flex items-center justify-center h-48">
                    <img
                      src={sponsor.logo_url}
                      alt={`${sponsor.name} logo`}
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  
                  {/* Content Section */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{sponsor.name}</h3>
                      {sponsor.description && (
                        <p className="text-muted-foreground text-sm">
                          {sponsor.description}
                        </p>
                      )}
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center space-x-2">
                      {sponsor.website && (
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-8 h-8"
                          asChild
                        >
                          <a
                            href={sponsor.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Website da ${sponsor.name}`}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                      
                      {['facebook', 'instagram', 'linkedin', 'twitter'].map((platform) => {
                        const handle = sponsor[platform as keyof Sponsor] as string;
                        if (!handle) return null;
                        
                        const Icon = getSocialIcon(platform);
                        const url = formatSocialUrl(platform, handle);
                        
                        return (
                          <Button
                            key={platform}
                            variant="outline"
                            size="icon"
                            className="w-8 h-8"
                            asChild
                          >
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`${sponsor.name} no ${platform}`}
                            >
                              <Icon className="w-4 h-4" />
                            </a>
                          </Button>
                        );
                      })}
                    </div>

                    {/* Visit Website Button */}
                    {sponsor.website && (
                      <Button 
                        variant="gradient" 
                        className="w-full"
                        asChild
                      >
                        <a
                          href={sponsor.website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Visitar Website
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Sponsors;