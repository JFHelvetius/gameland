"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSystems, type System } from "@/lib/api";

function SystemCard({ s }: { s: System }) {
  return (
    <Link href={`/${s.id}`} className="card-hover block">
      <div
        className="relative rounded-xl p-6 h-44 flex flex-col justify-between overflow-hidden border"
        style={{
          background: `linear-gradient(135deg, ${s.color}22 0%, #12121f 100%)`,
          borderColor: `${s.color}44`,
        }}
      >
        <div
          className="absolute -top-6 -left-6 w-24 h-24 rounded-full blur-2xl opacity-30"
          style={{ background: s.color }}
        />
        <div className="relative">
          <p className="pixel mb-2" style={{ color: s.color, fontSize: "9px" }}>{s.year}</p>
          <h2 className="pixel leading-relaxed" style={{ color: s.color, fontSize: "13px" }}>{s.short}</h2>
          <p className="text-sm mt-1" style={{ color: "#94a3b8" }}>{s.name}</p>
        </div>
        <div className="relative flex items-end justify-between">
          <span className="text-xs" style={{ color: "#64748b" }}>{s.game_count} juegos</span>
          <span className="text-xs px-2 py-1 rounded" style={{ background: `${s.color}22`, color: s.color }}>
            VER →
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const [systems, setSystems] = useState<System[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSystems()
      .then(setSystems)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen px-6 py-12 max-w-5xl mx-auto">
      <div className="text-center mb-14">
        <h1 className="pixel mb-4" style={{ fontSize: "clamp(16px, 3.5vw, 30px)", color: "#e2e8f0", letterSpacing: "0.08em" }}>
          GAMELAND
        </h1>
        <p className="pixel" style={{ fontSize: "8px", color: "#64748b", letterSpacing: "3px" }}>
          PRESERVACIÓN DEL VIDEOJUEGO
        </p>
        <div className="mt-6 mx-auto w-24 h-px" style={{ background: "linear-gradient(90deg, transparent, #64748b, transparent)" }} />
      </div>

      {loading && (
        <p className="text-center py-20 pixel" style={{ fontSize: "9px", color: "#334155" }}>
          CARGANDO...
        </p>
      )}

      {!loading && systems.length === 0 && (
        <div className="rounded-xl p-8 text-center border" style={{ background: "#12121f", borderColor: "rgba(255,255,255,0.08)" }}>
          <p className="pixel mb-3" style={{ color: "#E53E3E", fontSize: "10px" }}>SERVIDOR OFFLINE</p>
          <p className="text-sm mb-4" style={{ color: "#64748b" }}>Arranca el servidor local para ver la biblioteca.</p>
          <code className="block text-xs p-3 rounded" style={{ background: "#0a0a14", color: "#94a3b8" }}>
            .\start-server.ps1
          </code>
        </div>
      )}

      {systems.length > 0 && (
        <>
          <p className="pixel mb-6 text-center" style={{ fontSize: "9px", color: "#64748b", letterSpacing: "2px" }}>
            ELIGE UNA CONSOLA
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {systems.map((s) => <SystemCard key={s.id} s={s} />)}
          </div>
        </>
      )}

      <footer className="mt-20 text-center">
        <p className="pixel" style={{ fontSize: "8px", color: "#334155" }}>
          GAMELAND · PRESERVACIÓN DEL VIDEOJUEGO
        </p>
      </footer>
    </main>
  );
}
