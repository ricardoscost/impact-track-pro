import { Card } from "@/components/ui/card";
import { Calendar, MapPin, Clock } from "lucide-react";
import { useEffect, useState } from "react";

interface NextEventBannerProps {
  eventName: string;
  location: string;
  date: Date;
  backgroundImage?: string;
}

const NextEventBanner = ({ 
  eventName, 
  location, 
  date, 
  backgroundImage = "/placeholder.svg"
}: NextEventBannerProps) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +date - +new Date();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [date]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-PT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <Card className="relative overflow-hidden bg-background border-0 shadow-elegant">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
      
      {/* Content */}
      <div className="relative z-10 p-8 md:p-12">
        <div className="max-w-3xl">
          <div className="flex items-center space-x-2 text-primary mb-4">
            <Calendar className="h-5 w-5" />
            <span className="text-sm font-medium uppercase tracking-wider">
              Próximo Evento
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground leading-tight">
            {eventName}
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-center space-x-3 text-muted-foreground">
              <MapPin className="h-5 w-5 text-accent" />
              <span className="text-lg">{location}</span>
            </div>
            
            <div className="flex items-center space-x-3 text-muted-foreground">
              <Calendar className="h-5 w-5 text-secondary" />
              <span className="text-lg">{formatDate(date)}</span>
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="bg-card/80 backdrop-blur-sm rounded-lg p-6 border">
            <div className="flex items-center space-x-2 mb-4">
              <Clock className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Contagem Regressiva
              </span>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">
                  {timeLeft.days}
                </div>
                <div className="text-xs text-muted-foreground uppercase">Dias</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-secondary">
                  {timeLeft.hours}
                </div>
                <div className="text-xs text-muted-foreground uppercase">Horas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-accent">
                  {timeLeft.minutes}
                </div>
                <div className="text-xs text-muted-foreground uppercase">Min</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-muted-foreground">
                  {timeLeft.seconds}
                </div>
                <div className="text-xs text-muted-foreground uppercase">Seg</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default NextEventBanner;