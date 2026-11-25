import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Gameland — Preservación del Videojuego";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0a0a14 0%, #12121f 60%, #1a1a2e 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "monospace",
          position: "relative",
        }}
      >
        {/* Grid de fondo */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(100,116,139,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(100,116,139,0.06) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Glow central */}
        <div
          style={{
            position: "absolute",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(94,106,210,0.15) 0%, transparent 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        />
        {/* Título */}
        <div
          style={{
            fontSize: 96,
            fontWeight: 900,
            color: "#e2e8f0",
            letterSpacing: "0.12em",
            marginBottom: 16,
            position: "relative",
            textShadow: "0 0 60px rgba(94,106,210,0.5)",
          }}
        >
          GAMELAND
        </div>
        {/* Separador */}
        <div
          style={{
            width: 300,
            height: 2,
            background: "linear-gradient(90deg, transparent, #64748b, transparent)",
            marginBottom: 28,
            position: "relative",
          }}
        />
        {/* Subtítulo */}
        <div
          style={{
            fontSize: 22,
            color: "#64748b",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            position: "relative",
            marginBottom: 48,
          }}
        >
          PRESERVACIÓN DEL VIDEOJUEGO
        </div>
        {/* Chips de sistemas */}
        <div style={{ display: "flex", gap: 16, position: "relative" }}>
          {[
            { label: "NES", color: "#E53E3E" },
            { label: "SNES", color: "#7B6BA4" },
            { label: "MD", color: "#2C5F8A" },
            { label: "GB", color: "#8B8B23" },
            { label: "N64", color: "#2A9D3A" },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                padding: "8px 20px",
                borderRadius: 8,
                background: s.color + "22",
                border: `1px solid ${s.color}66`,
                color: s.color,
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: "0.15em",
              }}
            >
              {s.label}
            </div>
          ))}
        </div>
        {/* Contador */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            fontSize: 16,
            color: "#334155",
            letterSpacing: "0.2em",
          }}
        >
          +4.500 JUEGOS · INSTALA Y JUEGA EN SEGUNDOS
        </div>
      </div>
    ),
    { ...size }
  );
}
