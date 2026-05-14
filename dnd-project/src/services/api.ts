import type {
  User,
  Character,
  Quest,
  QuestStep,
  QuestNote,
  NPC,
  Item,
  Role,
  Campaign,
  CreateUserRequest,
  CreateCharacterRequest,
  CreateQuestRequest,
  CreateNPCRequest,
  CreateItemRequest,
} from '../types';
import { getAuthorizationHeader } from './authUtils';

const API_BASE = '/api';

interface LoginResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken?: string;
  };
}

// Helper function for API calls
async function apiCall<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const authHeader = getAuthorizationHeader();
  const headers = {
    'Content-Type': 'application/json',
    ...(authHeader || {}),
    ...options?.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers,
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API error: ${response.statusText}`);
  }

  return response.json();
}

// Health Check
export const healthCheck = () => apiCall<{ ok: boolean; service: string }>('/health');

// Users API
export const usersAPI = {
  getAll: () => apiCall<User[]>('/users'),
  getById: (id: string) => apiCall<User>(`/users/${id}`),
  create: (data: CreateUserRequest) =>
    apiCall<User>('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<CreateUserRequest>) =>
    apiCall<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiCall<void>(`/users/${id}`, { method: 'DELETE' }),
  login: (name: string, password: string) =>
    apiCall<LoginResponse>('/users/login', {
      method: 'POST',
      body: JSON.stringify({ name, password }),
    }),
};

// Roles API
export const rolesAPI = {
  getAll: () => apiCall<Role[]>('/roles'),
  getById: (id: string) => apiCall<Role>(`/roles/${id}`),
  create: (name: string) =>
    apiCall<Role>('/roles', {
      method: 'POST',
      body: JSON.stringify({ name }),
    }),
};

// Characters API
export const charactersAPI = {
  getAll: () => apiCall<Character[]>('/characters'),
  getById: (id: string) => apiCall<Character>(`/characters/${id}`),
  getByUserId: (userId: string) =>
    apiCall<Character[]>(`/characters?user_id=${userId}`),
  create: (data: CreateCharacterRequest) =>
    apiCall<Character>('/characters', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<CreateCharacterRequest>) =>
    apiCall<Character>(`/characters/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiCall<void>(`/characters/${id}`, { method: 'DELETE' }),
};

// Campaigns API
export const campaignsAPI = {
  getAll: () => apiCall<Campaign[]>('/campaigns'),
  getById: (id: string) => apiCall<Campaign>(`/campaigns/${id}`),
  create: (name: string, description?: string) =>
    apiCall<Campaign>('/campaigns', {
      method: 'POST',
      body: JSON.stringify({ name, description }),
    }),
};

// Quests API
export const questsAPI = {
  getAll: () => apiCall<Quest[]>('/quests'),
  getVisible: () => apiCall<Quest[]>('/quests/visible'),
  getById: (id: string) => apiCall<Quest>(`/quests/${id}`),
  create: (data: CreateQuestRequest) =>
    apiCall<Quest>('/quests', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<CreateQuestRequest>) =>
    apiCall<Quest>(`/quests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiCall<void>(`/quests/${id}`, { method: 'DELETE' }),
  changeVisibility: (id: string, canSee: boolean) =>
    apiCall<Quest>(`/quests/${id}/visibility`, {
      method: 'PUT',
      body: JSON.stringify({ can_see: canSee }),
    }),
};

// Quest Steps API
export const questStepsAPI = {
  getByQuestId: (questId: string) =>
    apiCall<QuestStep[]>(`/quests/${questId}/steps`),
  create: (questId: string, text: string, canSee: boolean = false) =>
    apiCall<QuestStep>(`/quests/${questId}/steps`, {
      method: 'POST',
      body: JSON.stringify({ text, can_see: canSee }),
    }),
  update: (questId: string, stepId: string, data: Partial<QuestStep>) =>
    apiCall<QuestStep>(`/quests/${questId}/steps/${stepId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (questId: string, stepId: string) =>
    apiCall<void>(`/quests/${questId}/steps/${stepId}`, { method: 'DELETE' }),
};

// NPCs API
export const npcsAPI = {
  getAll: () => apiCall<NPC[]>('/npcs'),
  getById: (id: string) => apiCall<NPC>(`/npcs/${id}`),
  create: (data: CreateNPCRequest) =>
    apiCall<NPC>('/npcs', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<CreateNPCRequest>) =>
    apiCall<NPC>(`/npcs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiCall<void>(`/npcs/${id}`, { method: 'DELETE' }),
};

// Items API
export const itemsAPI = {
  getAll: () => apiCall<Item[]>('/items'),
  getById: (id: string) => apiCall<Item>(`/items/${id}`),
  create: (data: CreateItemRequest) =>
    apiCall<Item>('/items', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<CreateItemRequest>) =>
    apiCall<Item>(`/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiCall<void>(`/items/${id}`, { method: 'DELETE' }),
};

// Quest Comments API
export const questCommentsAPI = {
  getByQuestId: (questId: string) =>
    apiCall<QuestNote[]>(`/quest-comments/${questId}`),
  getById: (questId: string, commentId: string) =>
    apiCall<QuestNote>(`/quest-comments/${questId}/comment/${commentId}`),
  create: (questId: string, text: string) =>
    apiCall<QuestNote>(`/quest-comments/${questId}`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    }),
  update: (questId: string, commentId: string, text: string) =>
    apiCall<QuestNote>(`/quest-comments/${questId}/comment/${commentId}`, {
      method: 'PUT',
      body: JSON.stringify({ text }),
    }),
  delete: (questId: string, commentId: string) =>
    apiCall<void>(`/quest-comments/${questId}/comment/${commentId}`, {
      method: 'DELETE',
    }),
};
