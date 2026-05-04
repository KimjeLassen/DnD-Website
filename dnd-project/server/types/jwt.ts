export interface JwtPayload {
  userId: string;
  username: string;
  role: 'dungeon master' | 'player';
  iat?: number;
  exp?: number;
}

export interface JwtTokens {
  accessToken: string;
  refreshToken?: string;
}
