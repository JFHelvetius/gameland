const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export interface System {
  id: string;
  name: string;
  short: string;
  year: string;
  color: string;
  game_count: number;
}

export interface GameSummary {
  id: string;
  name: string;
  system: string;
}

export interface GameDetail {
  id: string;
  name: string;
  system: string;
  system_name: string;
  system_short: string;
  system_color: string;
  year: string;
}

export const getSystems = (): Promise<System[]> =>
  fetch(`${API}/api/systems`, { next: { revalidate: 3600 } }).then((r) => r.json());

export const getGames = (system: string): Promise<GameSummary[]> =>
  fetch(`${API}/api/games/${system}`, { next: { revalidate: 3600 } }).then((r) => r.json());

export const getGame = (gameId: string): Promise<GameDetail> =>
  fetch(`${API}/api/game/${gameId}`, { next: { revalidate: 3600 } }).then((r) => r.json());

export const coverUrl = (gameId: string) => `${API}/api/covers/${gameId}`;

export const downloadUrl = (gameId: string) => `${API}/download/${gameId}`;
