export interface Scrap {
  id: string
  content: string
  created_at: string
  author: {
    id: string
    name: string
    avatar_url: string
  }
  likes: number
  liked_by_me: boolean
  replies?: Scrap[]
  attachments?: {
    type: 'image' | 'gif'
    url: string
  }[]
}

export interface Friend {
  id: string
  name: string
  avatar_url: string
  online: boolean
  is_best_friend: boolean
  mutual_friends: number
  interaction_score: number
}