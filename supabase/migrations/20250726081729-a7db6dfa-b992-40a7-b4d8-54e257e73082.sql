-- Criar tabela para patrocinadores
CREATE TABLE public.sponsors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  description TEXT,
  website TEXT,
  facebook TEXT,
  instagram TEXT,
  linkedin TEXT,
  twitter TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para galeria
CREATE TABLE public.gallery_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'photo', -- 'photo' ou 'video'
  event_id UUID REFERENCES public.events(id),
  tags TEXT[],
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para métricas customizáveis
CREATE TABLE public.metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  value TEXT NOT NULL,
  change_text TEXT,
  change_type TEXT DEFAULT 'neutral', -- 'positive', 'negative', 'neutral'
  icon_name TEXT, -- nome do ícone do Lucide
  gradient_type TEXT DEFAULT 'primary', -- 'primary', 'performance', 'energy'
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para press releases
CREATE TABLE public.press_releases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  image_url TEXT,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para notificações
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL, -- 'sponsor', 'press_release', 'gallery', 'event', 'metric'
  related_id UUID, -- ID do item relacionado
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Ativar RLS para todas as tabelas
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.press_releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS (acesso público para leitura)
CREATE POLICY "Allow public read access to sponsors" ON public.sponsors FOR SELECT USING (true);
CREATE POLICY "Allow public read access to gallery_items" ON public.gallery_items FOR SELECT USING (true);
CREATE POLICY "Allow public read access to metrics" ON public.metrics FOR SELECT USING (true);
CREATE POLICY "Allow public read access to press_releases" ON public.press_releases FOR SELECT USING (true);
CREATE POLICY "Allow public read access to notifications" ON public.notifications FOR SELECT USING (true);

-- Políticas para admin (todas as operações)
CREATE POLICY "Allow all operations on sponsors" ON public.sponsors FOR ALL USING (true);
CREATE POLICY "Allow all operations on gallery_items" ON public.gallery_items FOR ALL USING (true);
CREATE POLICY "Allow all operations on metrics" ON public.metrics FOR ALL USING (true);
CREATE POLICY "Allow all operations on press_releases" ON public.press_releases FOR ALL USING (true);
CREATE POLICY "Allow all operations on notifications" ON public.notifications FOR ALL USING (true);

-- Adicionar triggers para updated_at
CREATE TRIGGER update_sponsors_updated_at
  BEFORE UPDATE ON public.sponsors
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_gallery_items_updated_at
  BEFORE UPDATE ON public.gallery_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_metrics_updated_at
  BEFORE UPDATE ON public.metrics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_press_releases_updated_at
  BEFORE UPDATE ON public.press_releases
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir dados iniciais
INSERT INTO public.sponsors (name, logo_url, description, website, instagram, sort_order) VALUES
('Husqvarna', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Husqvarna_logo.svg/1200px-Husqvarna_logo.svg.png', 'Equipamentos premium para enduro', 'https://husqvarna.com', '@husqvarnamotorcycles', 1),
('KTM', 'https://logos-world.net/wp-content/uploads/2021/10/KTM-Logo.png', 'Ready to Race - Motos de competição', 'https://ktm.com', '@ktm_official', 2),
('Fox Racing', 'https://logos-world.net/wp-content/uploads/2020/11/Fox-Racing-Logo.png', 'Equipamentos de proteção e vestuário', 'https://foxracing.com', '@foxracing', 3);

INSERT INTO public.metrics (title, value, change_text, change_type, icon_name, gradient_type, sort_order) VALUES
('Km Percorridos Esta Época', '2.847 km', '+12% vs época anterior', 'positive', 'MapPin', 'primary', 1),
('Eventos Realizados', '23', '5 vitórias conquistadas', 'positive', 'Calendar', 'performance', 2),
('Visualizações nas Redes', '127.5K', '+18% este mês', 'positive', 'Users', 'energy', 3),
('Marcas Visíveis', '15', '8 parceiros principais', 'neutral', 'Award', 'primary', 4);

INSERT INTO public.press_releases (title, excerpt, published_at) VALUES
('Nova Parceria com Husqvarna Portugal', 'Anunciamos uma nova parceria estratégica que reforça nosso compromisso com a excelência no enduro...', '2024-07-10'),
('Vitória no Campeonato Nacional de Enduro', 'Conquistámos o primeiro lugar na categoria Elite, demonstrando a qualidade do nosso equipamento...', '2024-07-05'),
('Inauguração de Nova Base de Treinos', 'A nossa nova base de treinos em Viseu está agora operacional, oferecendo instalações de última geração...', '2024-06-28');

INSERT INTO public.gallery_items (title, description, image_url, type) VALUES
('Treino Serra da Estrela', 'Sessão de treino intensiva nas montanhas', 'https://images.unsplash.com/photo-1544966503-7cc5ac882d2d?w=800&h=600&fit=crop', 'photo'),
('Vitória no Nacional', 'Momento da vitória no campeonato nacional', 'https://images.unsplash.com/photo-1506629905851-f4a93c2ec1e9?w=800&h=600&fit=crop', 'photo'),
('Nova Husqvarna em Ação', 'Primeira volta com a nova moto', 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop', 'photo');

-- Criar notificações exemplo
INSERT INTO public.notifications (title, message, type) VALUES
('Novo Patrocinador', 'Husqvarna juntou-se aos nossos patrocinadores!', 'sponsor'),
('Novo Press Release', 'Publicado: Nova Parceria com Husqvarna Portugal', 'press_release'),
('Nova Foto Adicionada', 'Adicionada foto do treino na Serra da Estrela', 'gallery'),
('Evento em Breve', 'Próximo evento: Trail Monchique em 3 dias', 'event');