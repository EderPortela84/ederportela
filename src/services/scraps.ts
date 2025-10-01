import { supabase } from '@/integrations/supabase/client'
import type { Scrap } from '@/components/house/types'

export async function fetchScraps(profileId: string, parentId: string | null = null) {
  const [{ data, error }, { data: { user } }] = await Promise.all([
    supabase
      .from('scraps')
      .select(`
        id,
        content,
        created_at,
        attachments,
        likes,
        liked_by,
        author:author_id(
          id,
          profiles:profiles(
            avatar_url,
            casa_name
          )
        )
      `)
      .eq('profile_id', profileId)
      .eq('parent_id', parentId)
      .order('created_at', { ascending: false }),
    supabase.auth.getUser()
  ])

  if (error) {
    throw error
  }

  return data.map((scrap: any) => ({
    id: scrap.id,
    content: scrap.content,
    created_at: scrap.created_at,
    author: {
      id: scrap.author.id,
      name: scrap.author.profiles.casa_name,
      avatar_url: scrap.author.profiles.avatar_url
    },
    likes: scrap.likes,
    liked_by_me: scrap.liked_by?.includes(user?.id),
    attachments: scrap.attachments
  })) as Scrap[]
}

export async function createScrap(profileId: string, content: string, attachments: any[] = [], parentId: string | null = null) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuário não autenticado')

  const { data, error } = await supabase
    .from('scraps')
    .insert({
      content,
      author_id: user.id,
      profile_id: profileId,
      parent_id: parentId,
      attachments
    })
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function deleteScrap(scrapId: string) {
  const { error } = await supabase
    .from('scraps')
    .delete()
    .eq('id', scrapId)

  if (error) {
    throw error
  }
}

export const toggleLike = async (scrapId: string) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.id) throw new Error('User not authenticated')

  const { data: scrap } = await supabase
    .from('scraps')
    .select('liked_by, likes')
    .eq('id', scrapId)
    .single()

  if (!scrap) throw new Error('Recado não encontrado')

  const isLiked = scrap.liked_by?.includes(user.id)
  const newLikedBy = isLiked
    ? (scrap.liked_by || []).filter(id => id !== user.id)
    : [...(scrap.liked_by || []), user.id]
  const newLikes = isLiked ? scrap.likes - 1 : scrap.likes + 1

  const { error } = await supabase
    .from('scraps')
    .update({
      liked_by: newLikedBy,
      likes: newLikes
    })
    .eq('id', scrapId)

  if (error) {
    throw error
  }

  return { liked: !isLiked, likes: newLikes }
}