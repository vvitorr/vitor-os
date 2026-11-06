import { useId } from "react";

// macOS-style folder glyph, drawn inline (no image assets).
export default function FileIcon({ kind, size = 56 }: { kind: "folder"; size?: number }) {
  // Unique per instance: a shared id breaks when the first copy sits in a display:none subtree.
  const grad = useId();
  if (kind === "folder") {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
        <defs>
          <linearGradient id={grad} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7cc8ff" />
            <stop offset="1" stopColor="#3d9bf0" />
          </linearGradient>
        </defs>
        <path d="M6 14a4 4 0 0 1 4-4h14l5 5h25a4 4 0 0 1 4 4v3H6z" fill="#3a8fe0" />
        <rect x="6" y="19" width="52" height="35" rx="4" fill={`url(#${grad})`} />
        <rect x="6" y="19" width="52" height="2" fill="#fff" opacity=".35" />
      </svg>
    );
  }
  return null;
}
