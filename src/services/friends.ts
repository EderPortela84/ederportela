import { supabase } from '@/integrations/supabase/client'
import type { Friend } from '@/components/house/types'
import type { Database } from '@/integrations/supabase/types'

type FriendshipWithProfile = Database['public']['Tables']['friendships']['Row'] & {
  friend: {
    id: string
    profiles: {
      casa_name: string
      avatar_url: string | null
    }
  }
}

export async function fetchFriends(userId: string) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuário não autenticado')

  const { data: friendships, error } = await supabase
    .from('friendships')
    .select(`
      id,
      friend_id,
      interaction_score,
      status,
      friend:friend_id(
        id,
        profiles (
          casa_name,
          avatar_url
        )
      )
    `)
    .eq('user_id', userId)
    .eq('status', 'accepted')
    .order('interaction_score', { ascending: false })
    .returns<FriendshipWithProfile[]>()

  if (error) {
    throw error
  }

  // Buscar amigos em comum
  const friendIds = friendships.map(f => f.friend_id)
  const mutualFriendsPromises = friendIds.map(friendId =>
    supabase.rpc('count_mutual_friends', {
      user_id: userId,
      friend_id: friendId
    } satisfies Database['public']['Functions']['count_mutual_friends']['Args'])
  )

  const mutualFriendsCounts = await Promise.all(mutualFriendsPromises)

  // Verificar quem está online (últimos 5 minutos)
  const { data: onlineUsers } = await supabase
    .from('profiles')
    .select('user_id')
    .in('user_id', friendIds)
    .gte('updated_at', new Date(Date.now() - 5 * 60 * 1000).toISOString())

  const onlineUserIds = new Set(onlineUsers?.map(u => u.user_id) || [])

  return friendships.map((friendship, index) => ({
    id: friendship.friend_id,
    name: friendship.friend.profiles.casa_name,
    avatar_url: friendship.friend.profiles.avatar_url || '',
    online: onlineUserIds.has(friendship.friend_id),
    is_best_friend: friendship.interaction_score >= 100,
    mutual_friends: mutualFriendsCounts[index].data || 0,
    interaction_score: friendship.interaction_score
  })) as Friend[]
}

export async function sendFriendRequest(friendId: string) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuário não autenticado')

  const { error } = await supabase
    .from('friendships')
    .insert({
      user_id: user.id,
      friend_id: friendId,
      status: 'pending',
      interaction_score: 0
    } satisfies Database['public']['Tables']['friendships']['Insert'])

  if (error) {
    throw error
  }
}

export async function acceptFriendRequest(friendshipId: string) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuário não autenticado')

  const { error } = await supabase
    .from('friendships')
    .update({
      status: 'accepted',
      updated_at: new Date().toISOString()
    } satisfies Partial<Database['public']['Tables']['friendships']['Update']>)
    .eq('id', friendshipId)
    .eq('friend_id', user.id)

  if (error) {
    throw error
  }
}

export async function rejectFriendRequest(friendshipId: string) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuário não autenticado')

  const { error } = await supabase
    .from('friendships')
    .update({
      status: 'rejected',
      updated_at: new Date().toISOString()
    } satisfies Partial<Database['public']['Tables']['friendships']['Update']>)
    .eq('id', friendshipId)
    .eq('friend_id', user.id)

  if (error) {
    throw error
  }
}

export async function removeFriend(friendId: string) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuário não autenticado')

  const { error } = await supabase
    .from('friendships')
    .delete()
    .or(`and(user_id.eq.${user.id},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${user.id})`)

  if (error) {
    throw error
  }
}