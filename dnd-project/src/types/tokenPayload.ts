import { type JwtPayload } from 'jwt-decode';

export interface jwtToken extends JwtPayload{
  username: string;
  role: 'dungeon master' | 'player';
  exp: number;
}