"use client";

import { useEffect, useState, use, useCallback, useRef } from "react";
import Link from "next/link";
import { getGames, getSystems, coverUrl, coverUrlSvg, type GameSummary, type System } from "@/lib/api";

const PER_PAGE = 72;

function GameCard({ g, color }: { g: GameSummary; color: string }) {
  const [src, setSrc] = useState(() => coverUrl(g.id));
  const [imgErr, setImgErr] = useState(false);
  const handleError = () => {
    if (src.endsWith(".jpg")) setSrc(coverUrlSvg(g.id));
    else setImgErr(true);
  };
  return (
    <Link href={`/${g.system}/${g.id}`} className="card-hover block group">
      <div className="rounded-lg overflow-hidden border" style={{ borderColor: "rgba(255,255,255,0.07)", background: "#12121f" }}>
        <div className="relative aspect-[3/4] overflow-hidden bg-[#0a0a14]">
          {!imgErr ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={g.name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
              onError={handleError}
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

function Pagination({
  page, pages, color, onChange,
}: {
  page: number; pages: number; color: string; onChange: (p: number) => void;
}) {
  if (pages <= 1) return null;

  const range: (number | "…")[] = [];
  if (pages <= 7) {
    for (let i = 1; i <= pages; i++) range.push(i);
  } else {
    range.push(1);
    if (page > 3) range.push("…");
    for (let i = Math.max(2, page - 1); i <= Math.min(pages - 1, page + 1); i++) range.push(i);
    if (page < pages - 2) range.push("…");
    range.push(pages);
  }

  const btn = (label: React.ReactNode, target: number, active = false, disabled = false) => (
    <button
      key={String(label) + String(target)}
      onClick={() => !disabled && onChange(target)}
      disabled={disabled}
      style={{
        minWidth: 36,
        height: 36,
        borderRadius: 6,
        border: `1px solid ${active ? color : "rgba(255,255,255,0.1)"}`,
        background: active ? color + "22" : "transparent",
        color: active ? color : disabled ? "#334155" : "#94a3b8",
        cursor: disabled ? "default" : "pointer",
        fontSize: 13,
        fontWeight: active ? 700 : 400,
      }}
    >
      {label}
    </button>
  );

  return (
    <div className="flex items-center justify-center gap-1 mt-10 flex-wrap">
      {btn("←", page - 1, false, page === 1)}
      {range.map((r, i) =>
        r === "…"
          ? <span key={`dots-${i}`} style={{ color: "#334155", padding: "0 4px" }}>…</span>
          : btn(r, r as number, r === page)
      )}
      {btn("→", page + 1, false, page === pages)}
    </div>
  );
}

export default function SystemPage({ params }: { params: Promise<{ system: string }> }) {
  const { system } = use(params);
  const [games, setGames] = useState<GameSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [sysInfo, setSysInfo] = useState<System | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchPage = useCallback((p: number, q: string) => {
    setLoading(true);
    getGames(system, p, q, PER_PAGE)
      .then((data) => {
        setGames(data.games);
        setTotal(data.total);
        setPages(data.pages);
        setPage(data.page);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [system]);

  useEffect(() => {
    fetchPage(1, "");
    getSystems().then((all) => setSysInfo(all.find((s) => s.id === system) ?? null)).catch(() => {});
  }, [system, fetchPage]);

  const handleSearch = (q: string) => {
    setSearch(q);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchPage(1, q), 300);
  };

  const handlePage = (p: number) => {
    fetchPage(p, search);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const color = sysInfo?.color ?? "#64748b";
  const start = (page - 1) * PER_PAGE + 1;
  const end = Math.min(page * PER_PAGE, total);

  return (
    <main className="min-h-screen px-6 py-10 max-w-7xl mx-auto">
      {/* Header */}
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
          <span className="ml-auto text-sm" style={{ color: "#64748b" }}>
            {total > 0 && !loading
              ? search
                ? `${total} resultados`
                : `${total} juegos`
              : ""}
          </span>
        </div>
      </div>

      {/* Buscador */}
      <div className="mb-6 flex items-center gap-4">
        <input
          type="text"
          placeholder="Buscar juego..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full max-w-md px-4 py-3 rounded-lg text-sm outline-none border"
          style={{ background: "#12121f", borderColor: `${color}44`, color: "#e2e8f0" }}
        />
        {total > PER_PAGE && !search && (
          <span className="text-xs whitespace-nowrap" style={{ color: "#334155" }}>
            {start}–{end} de {total}
          </span>
        )}
      </div>

      {/* Grid */}
      {loading && games.length === 0 && (
        <p className="text-center py-20 pixel" style={{ fontSize: "9px", color: "#334155" }}>
          CARGANDO...
        </p>
      )}
      {!loading && games.length === 0 && (
        <p className="text-center py-20" style={{ color: "#64748b" }}>
          {search ? `Sin resultados para "${search}"` : "No hay juegos"}
        </p>
      )}

      <div
        className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3"
        style={{ opacity: loading ? 0.5 : 1, transition: "opacity 0.15s" }}
      >
        {games.map((g) => <GameCard key={g.id} g={g} color={color} />)}
      </div>

      <Pagination page={page} pages={pages} color={color} onChange={handlePage} />

      {pages > 1 && (
        <p className="text-center mt-4 text-xs" style={{ color: "#334155" }}>
          Página {page} de {pages}
        </p>
      )}
    </main>
  );
}
