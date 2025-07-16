import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ExternalLink, Instagram } from "lucide-react";

interface InstagramPost {
  id: string;
  imageUrl: string;
  likes: number;
  caption: string;
  postUrl?: string;
}

interface InstagramPostCardProps {
  posts: InstagramPost[];
}

const InstagramPostCard = ({ posts }: InstagramPostCardProps) => {
  const formatLikes = (likes: number) => {
    if (likes >= 1000) {
      return `${(likes / 1000).toFixed(1)}k`;
    }
    return likes.toString();
  };

  const truncateCaption = (caption: string, maxLength: number = 80) => {
    if (caption.length <= maxLength) return caption;
    return caption.substring(0, maxLength) + "...";
  };

  return (
    <Card className="h-full hover-lift transition-smooth">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <div className="gradient-energy w-8 h-8 rounded-lg flex items-center justify-center">
            <Instagram className="w-4 h-4 text-white" />
          </div>
          <span>Últimos Posts Instagram</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          {posts.map((post) => (
            <div 
              key={post.id}
              className="group cursor-pointer"
              onClick={() => post.postUrl && window.open(post.postUrl, '_blank')}
            >
              <div className="relative overflow-hidden rounded-lg aspect-square mb-3">
                <img 
                  src={post.imageUrl} 
                  alt="Instagram post"
                  className="w-full h-full object-cover transition-smooth group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-smooth" />
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-smooth">
                  <ExternalLink className="w-4 h-4 text-white" />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                  <span className="text-sm font-medium text-foreground">
                    {formatLikes(post.likes)} likes
                  </span>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {truncateCaption(post.caption)}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <Button variant="outline" className="w-full mt-4" size="sm">
          <Instagram className="w-4 h-4 mr-2" />
          Ver mais no Instagram
        </Button>
      </CardContent>
    </Card>
  );
};

export default InstagramPostCard;