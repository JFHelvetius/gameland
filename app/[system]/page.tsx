"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { getGames, getSystems, coverUrl, type GameSummary, type System } from "@/lib/api";

function GameCard({ g, color }: { g: GameSummary; color: string }) {
  const [imgErr, setImgErr] = useState(false);

  return (
    <Link href={`/${g.system}/${g.id}`} className="card-hover block group">
      <div className="rounded-lg overflow-hidden border" style={{ borderColor: "rgba(255,255,255,0.07)", background: "#12121f" }}>
        <div className="relative aspect-[3/4] overflow-hidden bg-[#0a0a14]">
          {!imgErr ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverUrl(g.id)}
              alt={g.name}
              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
              onError={() => setImgErr(true)}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center p-3"
              style={{ background: `${color}11` }}
            >
              <span className="pixel text-center leading-relaxed" style={{ fontSize: "8px", color }}>
                {g.name}
              </span>
            </div>
          )}
        </div>
        <div className="p-2">
          <p className="text-xs truncate font-medium" style={{ color: "#cbd5e1" }} title={g.name}>
            {g.name}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default function SystemPage({ params }: { params: Promise<{ system: string }> }) {
  const { system } = use(params);
  const [games, setGames] = useState<GameSummary[]>([]);
  const [filtered, setFiltered] = useState<GameSummary[]>([]);
  const [search, setSearch] = useState("");
  const [sysInfo, setSysInfo] = useState<System | null>(null);

  useEffect(() => {
    getGames(system).then(setGames).catch(() => {});
    getSystems().then((all) => setSysInfo(all.find((s) => s.id === system) ?? null)).catch(() => {});
  }, [system]);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(q ? games.filter((g) => g.name.toLowerCase().includes(q)) : games);
  }, [search, games]);

  const color = sysInfo?.color ?? "#64748b";

  return (
    <main className="min-h-screen px-6 py-10 max-w-7xl mx-auto">
      {/* Back + header */}
      <div className="mb-8">
        <Link href="/" className="pixel text-xs mb-4 inline-block" style={{ color: "#64748b", fontSize: "9px" }}>
          ← VOLVER
        </Link>
        <div className="flex items-center gap-4 mt-3">
          <div className="w-1 h-10 rounded" style={{ background: color }} />
          <div>
            <h1 className="pixel" style={{ color, fontSize: "clamp(12px, 2.5vw, 20px)" }}>
              {sysInfo?.short ?? system.toUpperCase()}
            </h1>
            <p className="text-sm mt-1" style={{ color: "#64748b" }}>{sysInfo?.name}</p>
          </div>
          <span className="ml-auto text-sm" style={{ color: "#64748b" }}>{filtered.length} juegos</span>
        </div>
      </div>

      {/* Buscador */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Buscar juego..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-3 rounded-lg text-sm outline-none border"
          style={{
            background: "#12121f",
            borderColor: `${color}44`,
            color: "#e2e8f0",
          }}
        />
      </div>

      {/* Grid */}
      {filtered.length === 0 && games.length === 0 && (
        <p className="text-center py-20" style={{ color: "#64748b" }}>Cargando juegos...</p>
      )}
      {filtered.length === 0 && games.length > 0 && (
        <p className="text-center py-20" style={{ color: "#64748b" }}>No hay resultados para &quot;{search}&quot;</p>
      )}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3">
        {filtered.map((g) => <GameCard key={g.id} g={g} color={color} />)}
      </div>
    </main>
  );
}
