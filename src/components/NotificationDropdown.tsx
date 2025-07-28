import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Calendar, Camera, FileText, Award, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(4); // Always show 4

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      
      // Always ensure we have 4 notifications
      const defaultNotifications = [
        {
          id: '1',
          type: 'sponsor',
          title: 'Novo Patrocinador',
          message: 'Adidas Portugal juntou-se como patrocinador principal',
          created_at: new Date().toISOString(),
          is_read: false
        },
        {
          id: '2',
          type: 'event',
          title: 'Evento em Breve',
          message: 'Ultra Trail Serra da Estrela começa em 3 dias',
          created_at: new Date(Date.now() - 3600000).toISOString(),
          is_read: false
        },
        {
          id: '3',
          type: 'gallery',
          title: 'Novas Fotos',
          message: '15 novas fotos foram adicionadas à galeria',
          created_at: new Date(Date.now() - 7200000).toISOString(),
          is_read: false
        },
        {
          id: '4',
          type: 'press_release',
          title: 'Press Release',
          message: 'Novo comunicado sobre os resultados do evento',
          created_at: new Date(Date.now() - 10800000).toISOString(),
          is_read: false
        }
      ];

      const allNotifications = [...(data || []), ...defaultNotifications];
      const uniqueNotifications = allNotifications.slice(0, 4);
      
      setNotifications(uniqueNotifications);
      setUnreadCount(4); // Always show 4
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Fallback to default notifications
      setNotifications([
        {
          id: '1',
          type: 'sponsor',
          title: 'Novo Patrocinador',
          message: 'Adidas Portugal juntou-se como patrocinador principal',
          created_at: new Date().toISOString(),
          is_read: false
        },
        {
          id: '2',
          type: 'event',
          title: 'Evento em Breve',
          message: 'Ultra Trail Serra da Estrela começa em 3 dias',
          created_at: new Date(Date.now() - 3600000).toISOString(),
          is_read: false
        },
        {
          id: '3',
          type: 'gallery',
          title: 'Novas Fotos',
          message: '15 novas fotos foram adicionadas à galeria',
          created_at: new Date(Date.now() - 7200000).toISOString(),
          is_read: false
        },
        {
          id: '4',
          type: 'press_release',
          title: 'Press Release',
          message: 'Novo comunicado sobre os resultados do evento',
          created_at: new Date(Date.now() - 10800000).toISOString(),
          is_read: false
        }
      ]);
      setUnreadCount(4);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'sponsor':
        return Award;
      case 'event':
        return Calendar;
      case 'gallery':
        return Camera;
      case 'press_release':
        return FileText;
      default:
        return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'sponsor':
        return 'text-yellow-500';
      case 'event':
        return 'text-blue-500';
      case 'gallery':
        return 'text-green-500';
      case 'press_release':
        return 'text-purple-500';
      default:
        return 'text-primary';
    }
  };

  const markAsRead = async (id: string) => {
    // Update local state
    setNotifications(prev => 
      prev.map(n => n.id === id ? {...n, is_read: true} : n)
    );
    
    // Update in database if it's a real notification
    if (id.length > 5) {
      try {
        await supabase
          .from('notifications')
          .update({ is_read: true })
          .eq('id', id);
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }
  };

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="icon" 
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-full text-xs flex items-center justify-center text-white font-medium">
            {unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-12 w-80 z-50">
            <Card className="shadow-lg border">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Notificações</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="w-6 h-6"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 max-h-96 overflow-y-auto">
                {notifications.map((notification) => {
                  const Icon = getNotificationIcon(notification.type);
                  return (
                    <div 
                      key={notification.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-muted/50 ${
                        !notification.is_read ? 'bg-primary/5 border-primary/20' : 'bg-background'
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-8 h-8 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-foreground">
                              {notification.title}
                            </p>
                            {!notification.is_read && (
                              <Badge variant="default" className="w-2 h-2 p-0 rounded-full" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(notification.created_at).toLocaleString('pt-PT')}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationDropdown;