import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ExternalLink } from "lucide-react";

interface PressRelease {
  id: string;
  title: string;
  date: Date;
  excerpt: string;
  readMoreUrl?: string;
}

interface PressReleaseCardProps {
  pressReleases: PressRelease[];
}

const PressReleaseCard = ({ pressReleases }: PressReleaseCardProps) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-PT', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Card className="h-full hover-lift transition-smooth">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <div className="gradient-primary w-8 h-8 rounded-lg flex items-center justify-center">
            <ExternalLink className="w-4 h-4 text-white" />
          </div>
          <span>Últimos Press Releases</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {pressReleases.map((release) => (
            <div 
              key={release.id}
              className="border rounded-lg p-4 hover:bg-muted/50 transition-smooth"
            >
              <div className="flex items-start space-x-3">
                <Calendar className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground line-clamp-1 mb-1">
                    {release.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    {formatDate(release.date)}
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {release.excerpt}
                  </p>
                  <Button variant="ghost" size="sm" className="text-xs h-auto p-1">
                    Ler mais
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PressReleaseCard;