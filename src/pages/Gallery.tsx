import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Camera, 
  Video, 
  Download, 
  Share, 
  Plus,
  Filter,
  Grid3X3,
  List
} from "lucide-react";

const Gallery = () => {
  const mediaItems = [
    {
      id: 1,
      type: "photo",
      title: "Ultra Trail Serra da Estrela - Largada",
      date: "2024-01-15",
      event: "Ultra Trail Serra da Estrela",
      downloads: 24,
      sponsors: ["Brand A", "Brand B"],
      thumbnail: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop",
    },
    {
      id: 2,
      type: "video",
      title: "Highlights - Meia Maratona do Porto",
      date: "2024-01-10",
      event: "Meia Maratona do Porto",
      downloads: 45,
      sponsors: ["Brand C", "Brand D"],
      thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    },
    {
      id: 3,
      type: "photo",
      title: "Equipamentos Técnicos - Sessão de Produto",
      date: "2024-01-08",
      event: "Sessão Fotográfica",
      downloads: 18,
      sponsors: ["Brand A"],
      thumbnail: "https://images.unsplash.com/photo-1544966503-7cc5ac882d2d?w=400&h=300&fit=crop",
    },
    {
      id: 4,
      type: "photo",
      title: "Chegada Vitoriosa - Trail Running",
      date: "2024-01-05",
      event: "Trail Monchique",
      downloads: 36,
      sponsors: ["Brand B", "Brand C"],
      thumbnail: "https://images.unsplash.com/photo-1506629905851-f4a93c2ec1e9?w=400&h=300&fit=crop",
    },
    {
      id: 5,
      type: "video",
      title: "Making Of - Treino de Montanha",
      date: "2024-01-03",
      event: "Treino Técnico",
      downloads: 12,
      sponsors: ["Brand A", "Brand D"],
      thumbnail: "https://images.unsplash.com/photo-1486754735734-325b5831c3ad?w=400&h=300&fit=crop",
    },
    {
      id: 6,
      type: "photo",
      title: "Paisagem Natural - Percurso Trail",
      date: "2024-01-01",
      event: "Trail Descoberta",
      downloads: 28,
      sponsors: ["Brand C"],
      thumbnail: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400&h=300&fit=crop",
    },
  ];

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
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Galeria Multimédia</h1>
          <p className="text-muted-foreground">
            Conteúdos exclusivos para patrocinadores e imprensa
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon">
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon">
            <List className="w-4 h-4" />
          </Button>
          <Button variant="outline">
            <Filter className="w-4 h-4" />
            Filtrar
          </Button>
          <Button variant="gradient">
            <Plus className="w-4 h-4" />
            Upload
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Camera className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Fotos</p>
                <p className="text-xl font-bold">248</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Video className="w-5 h-5 text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">Vídeos</p>
                <p className="text-xl font-bold">42</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Download className="w-5 h-5 text-secondary" />
              <div>
                <p className="text-sm text-muted-foreground">Downloads</p>
                <p className="text-xl font-bold">1.247</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Share className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Partilhas</p>
                <p className="text-xl font-bold">384</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mediaItems.map((item) => {
          const TypeIcon = getTypeIcon(item.type);
          return (
            <Card key={item.id} className="overflow-hidden hover-lift">
              <div className="relative">
                <img
                  src={item.thumbnail}
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
                <div className="absolute top-2 right-2">
                  <Button variant="secondary" size="icon" className="w-8 h-8">
                    <Download className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              
              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.event}</p>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {new Date(item.date).toLocaleDateString('pt-PT')}
                  </span>
                  <span className="text-muted-foreground">
                    {item.downloads} downloads
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {item.sponsors.map((sponsor, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {sponsor}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex space-x-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="w-3 h-3" />
                    Download
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      </main>
    </div>
  );
};

export default Gallery;