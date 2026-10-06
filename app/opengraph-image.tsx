import { ImageResponse } from "next/og";
import { hero, site } from "@/content/site";

export const alt = `${site.name} — ${hero.pitch}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Light-theme OG card: name, one-line pitch, nothing else. Same palette as the
 * site so a shared link looks like the page it opens.
 */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#F8F8F6",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontWeight: 700, color: "#0F0F0F", letterSpacing: "-0.02em" }}>
            {site.name}
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 40,
              lineHeight: 1.25,
              color: "#0F0F0F",
              maxWidth: 900,
            }}
          >
            {hero.pitch}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 64, height: 4, background: "#6C47FF" }} />
          <div style={{ fontSize: 26, color: "#5A6170" }}>
            Engineer · Researcher · Founder — aayushswami.com
          </div>
        </div>
      </div>
    ),
    size,
  );
}
