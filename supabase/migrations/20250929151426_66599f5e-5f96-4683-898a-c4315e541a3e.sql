-- Expandir tabela profiles para suportar o conceito de casa virtual
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS house_style text DEFAULT 'modern';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS house_color text DEFAULT 'blue';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS house_number text DEFAULT '1';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS street_name text DEFAULT 'Rua Principal';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS garden_items text[] DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS room_decorations jsonb DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status text DEFAULT 'online';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS favorite_music text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS favorite_books text[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS favorite_movies text[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS house_motto text;

-- Criar tabela para mensagens no mural/livro de visitas
CREATE TABLE IF NOT EXISTS public.house_visits (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  house_owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  visitor_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message text NOT NULL,
  is_public boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on house_visits
ALTER TABLE public.house_visits ENABLE ROW LEVEL SECURITY;

-- Políticas para house_visits
CREATE POLICY "House visits are viewable by house owner and public ones by everyone"
ON public.house_visits
FOR SELECT
USING (
  (is_public = true AND auth.uid() IS NOT NULL) OR 
  house_owner_id = auth.uid() OR 
  visitor_id = auth.uid()
);

CREATE POLICY "Users can leave messages in public houses"
ON public.house_visits
FOR INSERT
WITH CHECK (auth.uid() = visitor_id);

CREATE POLICY "Users can update their own messages"
ON public.house_visits
FOR UPDATE
USING (visitor_id = auth.uid());

CREATE POLICY "Users can delete their own messages"
ON public.house_visits
FOR DELETE
USING (visitor_id = auth.uid() OR house_owner_id = auth.uid());

-- Criar trigger para atualizar updated_at em house_visits
CREATE TRIGGER update_house_visits_updated_at
  BEFORE UPDATE ON public.house_visits
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();