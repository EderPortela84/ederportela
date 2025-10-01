-- Adiciona campos para nível e background personalizado
ALTER TABLE public.profiles
ADD COLUMN level INTEGER DEFAULT 1,
ADD COLUMN background_url TEXT,
ADD COLUMN custom_background_unlocked BOOLEAN DEFAULT false;

-- Função para verificar se o usuário pode alterar o background
CREATE OR REPLACE FUNCTION public.can_change_background(user_level INTEGER)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
  -- Usuário pode alterar o background a partir do nível 5
  RETURN user_level >= 5;
END;
$$;

-- Trigger para atualizar custom_background_unlocked baseado no nível
CREATE OR REPLACE FUNCTION public.update_background_unlock()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.level != OLD.level THEN
    NEW.custom_background_unlocked = public.can_change_background(NEW.level);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_background_unlock
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  WHEN (NEW.level IS DISTINCT FROM OLD.level)
  EXECUTE FUNCTION public.update_background_unlock();

-- Atualiza os perfis existentes
UPDATE public.profiles
SET custom_background_unlocked = public.can_change_background(level);