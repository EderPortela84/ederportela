-- Enum para tipos de itens da biblioteca
CREATE TYPE public.library_item_type AS ENUM (
  'book',
  'movie',
  'series',
  'music',
  'link',
  'note'
);

-- Enum para status de leitura/consumo
CREATE TYPE public.consumption_status AS ENUM (
  'completed',
  'in_progress',
  'want_to'
);

-- Tabela principal de itens da biblioteca
CREATE TABLE public.library_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type library_item_type NOT NULL,
  title TEXT NOT NULL,
  creator TEXT, -- autor, artista, diretor
  cover_url TEXT,
  status consumption_status DEFAULT 'want_to',
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes TEXT,
  is_favorite BOOLEAN DEFAULT false,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Tabela para likes em itens
CREATE TABLE public.library_item_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID REFERENCES public.library_items(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
  UNIQUE(item_id, user_id)
);

-- Tabela para comentários em itens
CREATE TABLE public.library_item_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID REFERENCES public.library_items(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Tabela para recomendações
CREATE TABLE public.library_recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  from_user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  to_user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  item_id UUID REFERENCES public.library_items(id) ON DELETE CASCADE,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected'))
);

-- Tabela para conquistas da biblioteca
CREATE TABLE public.library_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  achieved_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Função para atualizar o contador de likes
CREATE OR REPLACE FUNCTION public.update_library_item_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.library_items
    SET likes_count = likes_count + 1
    WHERE id = NEW.item_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.library_items
    SET likes_count = likes_count - 1
    WHERE id = OLD.item_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar likes
CREATE TRIGGER update_library_item_likes_count
AFTER INSERT OR DELETE ON public.library_item_likes
FOR EACH ROW
EXECUTE FUNCTION public.update_library_item_likes_count();

-- Função para verificar conquistas
CREATE OR REPLACE FUNCTION public.check_library_achievements()
RETURNS TRIGGER AS $$
DECLARE
  item_count INTEGER;
  achievement_type TEXT;
  achievement_title TEXT;
  achievement_description TEXT;
BEGIN
  -- Conta itens por tipo
  SELECT COUNT(*) INTO item_count
  FROM public.library_items
  WHERE user_id = NEW.user_id AND type = NEW.type;
  
  -- Define conquistas baseado no tipo e quantidade
  CASE
    WHEN NEW.type = 'book' AND item_count = 5 THEN
      achievement_type := 'reader_beginner';
      achievement_title := 'Leitor Iniciante';
      achievement_description := 'Adicionou 5 livros à biblioteca';
    WHEN NEW.type = 'movie' AND item_count = 10 THEN
      achievement_type := 'cinephile';
      achievement_title := 'Cinéfilo';
      achievement_description := 'Adicionou 10 filmes à biblioteca';
    WHEN NEW.type = 'music' AND item_count = 10 THEN
      achievement_type := 'sound_collector';
      achievement_title := 'Colecionador de Sons';
      achievement_description := 'Adicionou 10 músicas à biblioteca';
    ELSE
      RETURN NULL;
  END CASE;

  -- Insere nova conquista se ainda não existe
  INSERT INTO public.library_achievements (
    user_id,
    type,
    title,
    description
  )
  SELECT
    NEW.user_id,
    achievement_type,
    achievement_title,
    achievement_description
  WHERE NOT EXISTS (
    SELECT 1
    FROM public.library_achievements
    WHERE user_id = NEW.user_id AND type = achievement_type
  );

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger para verificar conquistas
CREATE TRIGGER check_library_achievements
AFTER INSERT ON public.library_items
FOR EACH ROW
EXECUTE FUNCTION public.check_library_achievements();

-- Políticas de segurança RLS
ALTER TABLE public.library_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_item_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_item_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_achievements ENABLE ROW LEVEL SECURITY;

-- Políticas para itens da biblioteca
CREATE POLICY "Usuários podem ver itens públicos"
ON public.library_items FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Usuários podem gerenciar seus próprios itens"
ON public.library_items FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Políticas para likes
CREATE POLICY "Usuários podem ver todos os likes"
ON public.library_item_likes FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Usuários podem gerenciar seus próprios likes"
ON public.library_item_likes FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Políticas para comentários
CREATE POLICY "Usuários podem ver todos os comentários"
ON public.library_item_comments FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Usuários podem gerenciar seus próprios comentários"
ON public.library_item_comments FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Políticas para recomendações
CREATE POLICY "Usuários podem ver recomendações enviadas ou recebidas"
ON public.library_recommendations FOR SELECT
TO authenticated
USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

CREATE POLICY "Usuários podem criar recomendações"
ON public.library_recommendations FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = from_user_id);

CREATE POLICY "Usuários podem gerenciar recomendações recebidas"
ON public.library_recommendations FOR UPDATE
TO authenticated
USING (auth.uid() = to_user_id);

-- Políticas para conquistas
CREATE POLICY "Usuários podem ver todas as conquistas"
ON public.library_achievements FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Sistema pode criar conquistas"
ON public.library_achievements FOR INSERT
TO authenticated
WITH CHECK (true);