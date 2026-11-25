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

export interface GamesPage {
  games: GameSummary[];
  total: number;
  page: number;
  pages: number;
  per_page: number;
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

type Catalog = Record<string, { info: System; games: GameSummary[] }>;

let _catalog: Catalog | null = null;
async function getCatalog(): Promise<Catalog> {
  if (_catalog) return _catalog;
  const r = await fetch("/catalog.json");
  _catalog = await r.json();
  return _catalog!;
}

export const getSystems = async (): Promise<System[]> => {
  const cat = await getCatalog();
  return Object.values(cat).map((e) => e.info);
};

export const getGames = async (
  system: string,
  page = 1,
  search = "",
  perPage = 72
): Promise<GamesPage> => {
  const cat = await getCatalog();
  const all = cat[system]?.games ?? [];
  const filtered = search
    ? all.filter((g) => g.name.toLowerCase().includes(search.toLowerCase()))
    : all;
  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const p = Math.min(Math.max(1, page), pages);
  const games = filtered.slice((p - 1) * perPage, p * perPage);
  return { games, total, page: p, pages, per_page: perPage };
};

export const getGame = async (gameId: string): Promise<GameDetail> => {
  const cat = await getCatalog();
  for (const [, entry] of Object.entries(cat)) {
    const g = entry.games.find((x) => x.id === gameId);
    if (g) {
      return {
        id: g.id,
        name: g.name,
        system: g.system,
        system_name: entry.info.name,
        system_short: entry.info.short,
        system_color: entry.info.color,
        year: entry.info.year,
      };
    }
  }
  throw new Error(`Game not found: ${gameId}`);
};

const COVERS = "https://jfhelvetius.github.io/gameland-covers";
export const coverUrl = (gameId: string) => `${COVERS}/${gameId}.jpg`;
export const coverUrlSvg = (gameId: string) => `${COVERS}/${gameId}.svg`;

export const downloadUrl = (gameId: string) =>
  `https://archive.org/download/gameland-roms/${gameId}.exe`;
