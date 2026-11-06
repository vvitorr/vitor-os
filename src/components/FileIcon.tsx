import { useId } from "react";

// macOS-style folder / document glyphs, drawn inline (no image assets).
export default function FileIcon({ kind, size = 56 }: { kind: "folder" | "doc"; size?: number }) {
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
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
      <path d="M14 6h26l12 12v38a2 2 0 0 1-2 2H14a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" fill="#fff" stroke="#c9ccd2" />
      <path d="M40 6v10a2 2 0 0 0 2 2h10" fill="#eef0f3" stroke="#c9ccd2" />
      <rect x="18" y="26" width="28" height="3" rx="1.5" fill="#b8bdc6" />
      <rect x="18" y="33" width="24" height="3" rx="1.5" fill="#d0d4da" />
      <rect x="18" y="40" width="26" height="3" rx="1.5" fill="#d0d4da" />
      <rect x="18" y="16" width="12" height="5" rx="1" fill="#e5484d" />
    </svg>
  );
}
