"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { getGame, coverUrl, downloadUrl, type GameDetail } from "@/lib/api";

export default function GamePage({
  params,
}: {
  params: Promise<{ system: string; gameId: string }>;
}) {
  const { system, gameId } = use(params);
  const [game, setGame] = useState<GameDetail | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    getGame(gameId).then(setGame).catch(() => {});
  }, [gameId]);

  const handleDownload = () => {
    setDownloading(true);
    // El link al download endpoint activa la generación del .exe en el servidor
    // y el navegador descarga el archivo automáticamente.
    const a = document.createElement("a");
    a.href = downloadUrl(gameId);
    a.download = "";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => setDownloading(false), 4000);
  };

  const color = game?.system_color ?? "#64748b";

  return (
    <main className="min-h-screen px-6 py-10 max-w-4xl mx-auto">
      <Link href={`/${system}`} className="pixel text-xs mb-8 inline-block" style={{ color: "#64748b", fontSize: "9px" }}>
        ← {game?.system_short ?? system.toUpperCase()}
      </Link>

      {!game ? (
        <p className="text-center py-32" style={{ color: "#64748b" }}>Cargando...</p>
      ) : (
        <div className="flex flex-col md:flex-row gap-10">
          {/* Cover */}
          <div className="flex-shrink-0">
            <div
              className="rounded-xl overflow-hidden shadow-2xl"
              style={{ width: 220, boxShadow: `0 0 40px ${color}44` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverUrl(gameId)}
                alt={game.name}
                className="w-full"
                style={{ display: "block" }}
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="pixel px-2 py-1 rounded text-xs"
                  style={{ background: `${color}22`, color, fontSize: "9px" }}
                >
                  {game.system_short}
                </span>
                <span className="text-sm" style={{ color: "#64748b" }}>{game.year}</span>
              </div>

              <h1
                className="font-semibold mb-6 leading-tight"
                style={{ fontSize: "clamp(18px, 3vw, 28px)", color: "#e2e8f0" }}
              >
                {game.name}
              </h1>

              <div
                className="rounded-lg p-4 border mb-6"
                style={{ background: "#12121f", borderColor: "rgba(255,255,255,0.08)" }}
              >
                <p className="pixel mb-3" style={{ fontSize: "9px", color: "#64748b" }}>INSTRUCCIONES</p>
                <ul className="text-sm space-y-2" style={{ color: "#94a3b8" }}>
                  <li>1. Haz clic en <strong style={{ color: "#e2e8f0" }}>Instalar y Jugar</strong></li>
                  <li>2. Ejecuta el archivo descargado</li>
                  <li>3. Se instala automáticamente y el juego arranca</li>
                  <li>4. Se crea un acceso directo en el escritorio</li>
                </ul>
              </div>

              <div
                className="rounded-lg p-4 border"
                style={{ background: "#12121f", borderColor: "rgba(255,255,255,0.08)" }}
              >
                <p className="pixel mb-3" style={{ fontSize: "9px", color: "#64748b" }}>CONTROLADOR</p>
                <p className="text-sm" style={{ color: "#94a3b8" }}>
                  Compatible con mando de PS5, Xbox y cualquier controlador USB/Bluetooth.
                  Conéctalo antes de lanzar el juego.
                </p>
              </div>
            </div>

            {/* Botón de descarga */}
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="mt-8 w-full py-4 rounded-xl font-bold text-base transition-all duration-200"
              style={{
                background: downloading ? `${color}44` : color,
                color: downloading ? color : "#000",
                cursor: downloading ? "wait" : "pointer",
                border: `2px solid ${color}`,
                letterSpacing: "0.05em",
              }}
            >
              {downloading ? "⏳ Preparando instalador..." : "⬇ INSTALAR Y JUGAR"}
            </button>

            <p className="text-xs mt-3 text-center" style={{ color: "#334155" }}>
              Windows · Sin subscripción · Sin publicidad
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
