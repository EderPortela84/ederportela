-- Tabela de recados (scraps)
CREATE TABLE public.scraps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.scraps(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  attachments JSONB DEFAULT '[]'::jsonb,
  likes INTEGER DEFAULT 0,
  liked_by UUID[] DEFAULT '{}'::UUID[]
);

-- Tabela de amizades (friendships)
CREATE TABLE public.friendships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  friend_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  interaction_score INTEGER DEFAULT 0,
  UNIQUE(user_id, friend_id)
);

-- Função para atualizar o timestamp de updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar o timestamp de updated_at
CREATE TRIGGER handle_scraps_updated_at
  BEFORE UPDATE ON public.scraps
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_friendships_updated_at
  BEFORE UPDATE ON public.friendships
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Políticas de segurança para scraps
ALTER TABLE public.scraps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Qualquer um pode ver recados"
  ON public.scraps FOR SELECT
  USING (true);

CREATE POLICY "Usuários podem criar recados"
  ON public.scraps FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Autores podem editar seus recados"
  ON public.scraps FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Autores e donos do perfil podem deletar recados"
  ON public.scraps FOR DELETE
  USING (auth.uid() IN (author_id, profile_id));

-- Políticas de segurança para friendships
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver suas amizades"
  ON public.friendships FOR SELECT
  USING (auth.uid() IN (user_id, friend_id));

CREATE POLICY "Usuários podem criar amizades"
  ON public.friendships FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas amizades"
  ON public.friendships FOR UPDATE
  USING (auth.uid() IN (user_id, friend_id));

CREATE POLICY "Usuários podem deletar suas amizades"
  ON public.friendships FOR DELETE
  USING (auth.uid() IN (user_id, friend_id));

-- Função para contar amigos em comum
CREATE OR REPLACE FUNCTION public.count_mutual_friends(user_id UUID, friend_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(DISTINCT f2.friend_id)
    FROM public.friendships f1
    JOIN public.friendships f2 ON f1.friend_id = f2.user_id
    WHERE f1.user_id = $1
    AND f2.friend_id != $1
    AND f2.friend_id IN (
      SELECT friend_id
      FROM public.friendships
      WHERE user_id = $2
      AND status = 'accepted'
    )
    AND f1.status = 'accepted'
    AND f2.status = 'accepted'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;