-- DnD Website Database Schema

-- Create Roles table
CREATE TABLE Roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Users table
CREATE TABLE Users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    -- TO BE MOVED
    password VARCHAR NOT NULL,
    role_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES Roles(id) ON DELETE RESTRICT
);

-- Create Quests table
CREATE TABLE Quest (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Quest Steps table
CREATE TABLE Quest_Step (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quest_id UUID NOT NULL,
    text TEXT NOT NULL,
    can_see BOOLEAN DEFAULT FALSE,
    display_order INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quest_id) REFERENCES Quest(id) ON DELETE CASCADE
);

-- Create Items table
CREATE TABLE Items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image VARCHAR(1024),
    price INT DEFAULT 0,
    attunement BOOLEAN DEFAULT FALSE,
    type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Quest Rewards table
CREATE TABLE Quest_Rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quest_step_id UUID NOT NULL,
    reward_id UUID NOT NULL,
    quantity INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quest_step_id) REFERENCES Quest_Step(id) ON DELETE CASCADE,
    FOREIGN KEY (reward_id) REFERENCES Items(id) ON DELETE CASCADE
);

-- Create Quest Notes table
CREATE TABLE QuestNotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quest_id UUID NOT NULL,
    user_id UUID NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quest_id) REFERENCES Quest(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- Create Characters table
CREATE TABLE Characters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    user_id UUID NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (campaign_id) REFERENCES Campaigns(id) ON DELETE SET NULL
);

-- Create Character Secrets table
CREATE TABLE Character_Secrets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    character_id UUID NOT NULL,
    secret TEXT NOT NULL,
    written_by UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (character_id) REFERENCES Characters(id) ON DELETE CASCADE,
    FOREIGN KEY (written_by) REFERENCES Users(id) ON DELETE CASCADE
);

-- Create NPCs table
CREATE TABLE NPCs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image VARCHAR(1024),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create NPC Comments table
CREATE TABLE NPC_Comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    npc_id UUID NOT NULL,
    user_id UUID NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (npc_id) REFERENCES NPCs(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX idx_users_role_id ON Users(role_id);
CREATE INDEX idx_quest_steps_quest_id ON Quest_Step(quest_id);
CREATE INDEX idx_quest_rewards_quest_step_id ON Quest_Rewards(quest_step_id);
CREATE INDEX idx_quest_rewards_reward_id ON Quest_Rewards(reward_id);
CREATE INDEX idx_quest_notes_quest_id ON QuestNotes(quest_id);
CREATE INDEX idx_quest_notes_user_id ON QuestNotes(user_id);
CREATE INDEX idx_characters_user_id ON Characters(user_id);
CREATE INDEX idx_characters_campaign_id ON Characters(campaign_id);
CREATE INDEX idx_character_secrets_character_id ON Character_Secrets(character_id);
CREATE INDEX idx_character_secrets_written_by ON Character_Secrets(written_by);
CREATE INDEX idx_npc_comments_npc_id ON NPC_Comments(npc_id);
CREATE INDEX idx_npc_comments_user_id ON NPC_Comments(user_id);
