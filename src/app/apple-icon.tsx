import { ImageResponse } from "next/og";

// Home-screen icon for iPhone (iOS requires a PNG).
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  const bar = (height: number) => ({ width: 17, height, background: "#f6f6f4" });
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#1f3a5f",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: 14,
          paddingBottom: 56,
        }}
      >
        <div style={bar(68)} />
        <div style={bar(45)} />
        <div style={bar(28)} />
      </div>
    ),
    size,
  );
}
