// Database Entity Types

export interface Role {
  id: string
  name: string
  created_at: string
}

export interface User {
  id: string
  name: string
  password: string
  role_id: string
  created_at: string
  updated_at: string
}

export interface Quest {
  id: string
  name: string
  created_at: string
  updated_at: string
}

export interface QuestStep {
  id: string
  quest_id: string
  text: string
  can_see: boolean
  display_order: number
  created_at: string
}

export interface Item {
  id: string
  name: string
  description?: string
  image?: string
  price: number
  attunement: boolean
  type?: string
  created_at: string
  updated_at: string
}

export interface QuestReward {
  id: string
  quest_step_id: string
  reward_id: string
  quantity: number
  created_at: string
}

export interface QuestNote {
  id: string
  quest_id: string
  user_id: string
  text: string
  created_at: string
  updated_at: string
}

export interface Character {
  id: string
  name: string
  user_id: string
  notes?: string
  campaign_id?: string
  created_at: string
  updated_at: string
}

export interface CharacterSecret {
  id: string
  character_id: string
  secret: string
  written_by: string
  created_at: string
  updated_at: string
}

export interface NPC {
  id: string
  name: string
  description?: string
  image?: string
  created_at: string
  updated_at: string
}

export interface NPCComment {
  id: string
  npc_id: string
  user_id: string
  text: string
  created_at: string
  updated_at: string
}
