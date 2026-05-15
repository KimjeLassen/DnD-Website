import { query } from './db'
import type { Role, User, Quest, QuestStep, Item, Character, CharacterSecret, NPC, NPCComment, QuestReward, QuestNote } from './types'

const USER_PUBLIC_COLUMNS = 'Users.id, Users.name, Users.role_id, Users.created_at, Users.updated_at, Roles.name AS role'

// ============================================================================
// ROLES QUERIES
// ============================================================================

export const roleQueries = {
  async getAll(): Promise<Role[]> {
    const result = await query('SELECT * FROM Roles ORDER BY created_at DESC')
    return result.rows
  },

  async getById(id: string): Promise<Role | null> {
    const result = await query('SELECT * FROM Roles WHERE id = $1', [id])
    return result.rows[0] || null
  },

  async create(name: string): Promise<Role> {
    const result = await query(
      'INSERT INTO Roles (name) VALUES ($1) RETURNING *',
      [name]
    )
    return result.rows[0]
  },

  async update(id: string, name: string): Promise<Role | null> {
    const result = await query(
      'UPDATE Roles SET name = $1 WHERE id = $2 RETURNING *',
      [name, id]
    )
    return result.rows[0] || null
  },

  async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM Roles WHERE id = $1', [id])
    return result.rowCount > 0
  },
}

// ============================================================================
// USERS QUERIES
// ============================================================================

export const userQueries = {
  async getAll(): Promise<User[]> {
    const result = await query(
      `SELECT ${USER_PUBLIC_COLUMNS} FROM Users JOIN Roles ON Users.role_id = Roles.id ORDER BY Users.created_at DESC`
    )
    return result.rows
  },

  async getById(id: string): Promise<User | null> {
    const result = await query(
      `SELECT ${USER_PUBLIC_COLUMNS} FROM Users JOIN Roles ON Users.role_id = Roles.id WHERE Users.id = $1`,
      [id]
    )
    return result.rows[0] || null
  },

  async create(name: string, password: string, role_id: string): Promise<User> {
    const result = await query(
      'INSERT INTO Users (name, password, role_id) VALUES ($1, $2, $3) RETURNING id',
      [name, password, role_id]
    )
    return (await this.getById(result.rows[0].id))!
  },

  async update(id: string, name?: string, password?: string, role_id?: string): Promise<User | null> {
    const updates: string[] = []
    const params: unknown[] = []
    let param_count = 1

    if (name !== undefined) {
      updates.push(`name = $${param_count}`)
      params.push(name)
      param_count += 1
    }
    if (password !== undefined) {
      updates.push(`password = $${param_count}`)
      params.push(password)
      param_count += 1
    }
    if (role_id !== undefined) {
      updates.push(`role_id = $${param_count}`)
      params.push(role_id)
      param_count += 1
    }

    if (updates.length === 0) return this.getById(id)

    updates.push('updated_at = NOW()')
    params.push(id)

    const result = await query(
      `UPDATE Users SET ${updates.join(', ')} WHERE id = $${param_count} RETURNING id`,
      params
    )
    if (!result.rows[0]) return null
    return this.getById(id)
  },

  async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM Users WHERE id = $1', [id])
    return result.rowCount > 0
  },
  async login(name: string): Promise<(User & { password: string }) | null> {
    const result = await query(
      'SELECT Users.id, Users.name, Users.password, Users.role_id, Roles.name AS role FROM Users JOIN Roles ON Users.role_id = Roles.id WHERE Users.name = $1 LIMIT 1',
      [name]
    )
    return result.rows[0] || null
  }
}

// ============================================================================
// ITEMS QUERIES
// ============================================================================

export const itemQueries = {
  async getAll(): Promise<Item[]> {
    const result = await query('SELECT * FROM Items ORDER BY created_at DESC')
    return result.rows
  },

  async getById(id: string): Promise<Item | null> {
    const result = await query('SELECT * FROM Items WHERE id = $1', [id])
    return result.rows[0] || null
  },

  async create(name: string, description?: string, image?: string, price?: number, attunement?: boolean, type?: string): Promise<Item> {
    const result = await query(
      `INSERT INTO Items (name, description, image, price, attunement, type) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, description || null, image || null, price || 0, attunement || false, type || null]
    )
    return result.rows[0]
  },

  async update(id: string, name?: string, description?: string, image?: string, price?: number, attunement?: boolean, type?: string): Promise<Item | null> {
    const updates: string[] = []
    const params: unknown[] = []
    let param_count = 1

    if (name !== undefined) {
      updates.push(`name = $${param_count}`)
      params.push(name)
      param_count += 1
    }
    if (description !== undefined) {
      updates.push(`description = $${param_count}`)
      params.push(description)
      param_count += 1
    }
    if (image !== undefined) {
      updates.push(`image = $${param_count}`)
      params.push(image)
      param_count += 1
    }
    if (price !== undefined) {
      updates.push(`price = $${param_count}`)
      params.push(price)
      param_count += 1
    }
    if (attunement !== undefined) {
      updates.push(`attunement = $${param_count}`)
      params.push(attunement)
      param_count += 1
    }
    if (type !== undefined) {
      updates.push(`type = $${param_count}`)
      params.push(type)
      param_count += 1
    }

    if (updates.length === 0) return null

    updates.push(`updated_at = NOW()`)
    params.push(id)

    const result = await query(
      `UPDATE Items SET ${updates.join(', ')} WHERE id = $${param_count + 1} RETURNING *`,
      params
    )
    return result.rows[0] || null
  },

  async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM Items WHERE id = $1', [id])
    return result.rowCount > 0
  },
}

// ============================================================================
// QUESTS QUERIES
// ============================================================================

export const questQueries = {
  async getAll(): Promise<Quest[]> {
    const result = await query('SELECT * FROM Quest ORDER BY created_at DESC')
    return result.rows
  },
  async getVisible(): Promise<Quest[]> {
    const result = await query('SELECT id, can_see, name FROM Quest WHERE can_see = true ORDER BY created_at DESC')
    return result.rows
  },
  async getById(id: string): Promise<Quest | null> {
    const result = await query('SELECT id, can_see, name FROM Quest WHERE id = $1', [id])
    return result.rows[0] || null
  },

  async create(name: string): Promise<Quest> {
    const result = await query(
      'INSERT INTO Quest (name, can_see) VALUES ($1, $2) RETURNING *',
      [name, false]
    )
    return result.rows[0]
  },

  async update(id: string, name: string): Promise<Quest | null> {
    const result = await query(
      'UPDATE Quest SET name = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [name, id]
    )
    return result.rows[0] || null
  },

  async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM Quest WHERE id = $1', [id])
    return result.rowCount > 0
  },
  async setVisibility(id: string, can_see: boolean): Promise<Quest | null> {
    const result = await query(
      'UPDATE Quest SET can_see = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [can_see, id]
    )
    return result.rows[0] || null
  }
}

// ============================================================================
// QUEST STEPS QUERIES
// ============================================================================

export const questStepQueries = {
  async getAll(): Promise<QuestStep[]> {
    const result = await query('SELECT * FROM Quest_Step ORDER BY display_order ASC')
    return result.rows
  },

  async getById(id: string): Promise<QuestStep | null> {
    const result = await query('SELECT * FROM Quest_Step WHERE id = $1', [id])
    return result.rows[0] || null
  },

  async getByQuestId(quest_id: string, visibleOnly = false): Promise<QuestStep[]> {
    const sql = visibleOnly
      ? 'SELECT * FROM Quest_Step WHERE quest_id = $1 AND can_see = true ORDER BY display_order ASC'
      : 'SELECT * FROM Quest_Step WHERE quest_id = $1 ORDER BY display_order ASC'
    const result = await query(sql, [quest_id])
    return result.rows
  },

  async create(quest_id: string, text: string, can_see?: boolean, display_order?: number): Promise<QuestStep> {
    const result = await query(
      `INSERT INTO Quest_Step (quest_id, text, can_see, display_order) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [quest_id, text, can_see || false, display_order || 1]
    )
    return result.rows[0]
  },

  async update(id: string, text?: string, can_see?: boolean, display_order?: number): Promise<QuestStep | null> {
    const updates: string[] = []
    const params: unknown[] = []
    let param_count = 1

    if (text !== undefined) {
      updates.push(`text = $${param_count}`)
      params.push(text)
      param_count += 1
    }
    if (can_see !== undefined) {
      updates.push(`can_see = $${param_count}`)
      params.push(can_see)
      param_count += 1
    }
    if (display_order !== undefined) {
      updates.push(`display_order = $${param_count}`)
      params.push(display_order)
      param_count += 1
    }

    if (updates.length === 0) return null

    params.push(id)
    const result = await query(
      `UPDATE Quest_Step SET ${updates.join(', ')} WHERE id = $${param_count} RETURNING *`,
      params
    )
    return result.rows[0] || null
  },

  async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM Quest_Step WHERE id = $1', [id])
    return result.rowCount > 0
  },

  async setVisibility(id: string, can_see: boolean): Promise<QuestStep | null> {
    const result = await query(
      'UPDATE Quest_Step SET can_see = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [can_see, id]
    )
    return result.rows[0] || null
  }
}

// ============================================================================
// QUEST REWARDS QUERIES
// ============================================================================

export const questRewardQueries = {
  async getAll(): Promise<QuestReward[]> {
    const result = await query('SELECT * FROM Quest_Rewards ORDER BY created_at DESC')
    return result.rows
  },

  async getById(id: string): Promise<QuestReward | null> {
    const result = await query('SELECT * FROM Quest_Rewards WHERE id = $1', [id])
    return result.rows[0] || null
  },

  async getByQuestStepId(quest_step_id: string): Promise<QuestReward[]> {
    const result = await query(
      'SELECT * FROM Quest_Rewards WHERE quest_step_id = $1 ORDER BY created_at DESC',
      [quest_step_id]
    )
    return result.rows
  },

  async create(quest_step_id: string, reward_id: string, quantity?: number): Promise<QuestReward> {
    const result = await query(
      `INSERT INTO Quest_Rewards (quest_step_id, reward_id, quantity) 
       VALUES ($1, $2, $3) RETURNING *`,
      [quest_step_id, reward_id, quantity || 1]
    )
    return result.rows[0]
  },

  async update(id: string, quantity: number): Promise<QuestReward | null> {
    const result = await query(
      'UPDATE Quest_Rewards SET quantity = $1 WHERE id = $2 RETURNING *',
      [quantity, id]
    )
    return result.rows[0] || null
  },

  async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM Quest_Rewards WHERE id = $1', [id])
    return result.rowCount > 0
  },
}

// ============================================================================
// QUEST NOTES QUERIES
// ============================================================================

export const questNoteQueries = {
  async getAll(): Promise<QuestNote[]> {
    const result = await query('SELECT Quest_Notes.*, Users.name AS user_name FROM Quest_Notes JOIN Users ON Quest_Notes.user_id = Users.id ORDER BY created_at DESC')
    return result.rows
  },

  async getById(id: string): Promise<QuestNote | null> {
    const result = await query('SELECT * FROM Quest_Notes WHERE id = $1', [id])
    return result.rows[0] || null
  },

  async getByQuestId(quest_id: string): Promise<QuestNote[]> {
    const result = await query(
      'SELECT Quest_Notes.*, Users.name AS user_name FROM Quest_Notes JOIN Users ON Quest_Notes.user_id = Users.id WHERE quest_id = $1 ORDER BY created_at DESC',
      [quest_id]
    )
    return result.rows
  },

  async create(quest_id: string, user_id: string, text: string): Promise<QuestNote> {
    const result = await query(
      `INSERT INTO Quest_Notes (quest_id, user_id, text) 
       VALUES ($1, $2, $3) RETURNING *`,
      [quest_id, user_id, text]
    )
    return result.rows[0]
  },

  async update(id: string, text: string): Promise<QuestNote | null> {
    const result = await query(
      'UPDATE Quest_Notes SET text = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [text, id]
    )
    return result.rows[0] || null
  },

  async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM Quest_Notes WHERE id = $1', [id])
    return result.rowCount > 0
  },
}

// ============================================================================
// CHARACTERS QUERIES
// ============================================================================

export const characterQueries = {
  async getAll(): Promise<Character[]> {
    const result = await query('SELECT * FROM Characters ORDER BY created_at DESC')
    return result.rows
  },

  async getById(id: string): Promise<Character | null> {
    const result = await query('SELECT * FROM Characters WHERE id = $1', [id])
    return result.rows[0] || null
  },

  async getByUserId(user_id: string): Promise<Character[]> {
    const result = await query(
      'SELECT * FROM Characters WHERE user_id = $1 ORDER BY created_at DESC',
      [user_id]
    )
    return result.rows
  },

  async create(name: string, user_id: string, notes?: string, campaign_id?: string): Promise<Character> {
    const result = await query(
      `INSERT INTO Characters (name, user_id, notes, campaign_id) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, user_id, notes || null, campaign_id || null]
    )
    return result.rows[0]
  },

  async update(id: string, name?: string, notes?: string, campaign_id?: string): Promise<Character | null> {
    const updates: string[] = []
    const params: unknown[] = []
    let param_count = 1

    if (name !== undefined) {
      updates.push(`name = $${param_count}`)
      params.push(name)
      param_count += 1
    }
    if (notes !== undefined) {
      updates.push(`notes = $${param_count}`)
      params.push(notes)
      param_count += 1
    }
    if (campaign_id !== undefined) {
      updates.push(`campaign_id = $${param_count}`)
      params.push(campaign_id)
      param_count += 1
    }

    if (updates.length === 0) return null

    updates.push(`updated_at = NOW()`)
    params.push(id)

    const result = await query(
      `UPDATE Characters SET ${updates.join(', ')} WHERE id = $${param_count + 1} RETURNING *`,
      params
    )
    return result.rows[0] || null
  },

  async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM Characters WHERE id = $1', [id])
    return result.rowCount > 0
  },
}

// ============================================================================
// CHARACTER SECRETS QUERIES
// ============================================================================

export const characterSecretQueries = {
  async getAll(): Promise<CharacterSecret[]> {
    const result = await query('SELECT * FROM Character_Secrets ORDER BY created_at DESC')
    return result.rows
  },

  async getById(id: string): Promise<CharacterSecret | null> {
    const result = await query('SELECT * FROM Character_Secrets WHERE id = $1', [id])
    return result.rows[0] || null
  },

  async getByCharacterId(character_id: string): Promise<CharacterSecret[]> {
    const result = await query(
      'SELECT * FROM Character_Secrets WHERE character_id = $1 ORDER BY created_at DESC',
      [character_id]
    )
    return result.rows
  },

  async create(character_id: string, secret: string, written_by: string): Promise<CharacterSecret> {
    const result = await query(
      `INSERT INTO Character_Secrets (character_id, secret, written_by) 
       VALUES ($1, $2, $3) RETURNING *`,
      [character_id, secret, written_by]
    )
    return result.rows[0]
  },

  async update(id: string, secret: string): Promise<CharacterSecret | null> {
    const result = await query(
      'UPDATE Character_Secrets SET secret = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [secret, id]
    )
    return result.rows[0] || null
  },

  async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM Character_Secrets WHERE id = $1', [id])
    return result.rowCount > 0
  },
}

// ============================================================================
// NPCS QUERIES
// ============================================================================

export const npcQueries = {
  async getAll(): Promise<NPC[]> {
    const result = await query('SELECT * FROM NPCs ORDER BY created_at DESC')
    return result.rows
  },

  async getById(id: string): Promise<NPC | null> {
    const result = await query('SELECT * FROM NPCs WHERE id = $1', [id])
    return result.rows[0] || null
  },

  async create(name: string, description?: string, image?: string): Promise<NPC> {
    const result = await query(
      `INSERT INTO NPCs (name, description, image) 
       VALUES ($1, $2, $3) RETURNING *`,
      [name, description || null, image || null]
    )
    return result.rows[0]
  },

  async update(id: string, name?: string, description?: string, image?: string): Promise<NPC | null> {
    const updates: string[] = []
    const params: unknown[] = []
    let param_count = 1

    if (name !== undefined) {
      updates.push(`name = $${param_count}`)
      params.push(name)
      param_count += 1
    }
    if (description !== undefined) {
      updates.push(`description = $${param_count}`)
      params.push(description)
      param_count += 1
    }
    if (image !== undefined) {
      updates.push(`image = $${param_count}`)
      params.push(image)
      param_count += 1
    }

    if (updates.length === 0) return null

    updates.push(`updated_at = NOW()`)
    params.push(id)

    const result = await query(
      `UPDATE NPCs SET ${updates.join(', ')} WHERE id = $${param_count + 1} RETURNING *`,
      params
    )
    return result.rows[0] || null
  },

  async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM NPCs WHERE id = $1', [id])
    return result.rowCount > 0
  },
}

// ============================================================================
// NPC COMMENTS QUERIES
// ============================================================================

export const npcCommentQueries = {
  async getAll(): Promise<NPCComment[]> {
    const result = await query('SELECT * FROM NPC_Comments ORDER BY created_at DESC')
    return result.rows
  },

  async getById(id: string): Promise<NPCComment | null> {
    const result = await query('SELECT * FROM NPC_Comments WHERE id = $1', [id])
    return result.rows[0] || null
  },

  async getByNpcId(npc_id: string): Promise<NPCComment[]> {
    const result = await query(
      'SELECT * FROM NPC_Comments WHERE npc_id = $1 ORDER BY created_at DESC',
      [npc_id]
    )
    return result.rows
  },

  async create(npc_id: string, user_id: string, text: string): Promise<NPCComment> {
    const result = await query(
      `INSERT INTO NPC_Comments (npc_id, user_id, text) 
       VALUES ($1, $2, $3) RETURNING *`,
      [npc_id, user_id, text]
    )
    return result.rows[0]
  },

  async update(id: string, text: string): Promise<NPCComment | null> {
    const result = await query(
      'UPDATE NPC_Comments SET text = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [text, id]
    )
    return result.rows[0] || null
  },

  async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM NPC_Comments WHERE id = $1', [id])
    return result.rowCount > 0
  },
}
