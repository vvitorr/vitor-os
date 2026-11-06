import { readdirSync } from "node:fs";
import path from "node:path";
import Desktop from "@/components/Desktop";

// Icons you drop into public/icons (e.g. github.png) replace the built-in tiles.
function iconFiles() {
  try {
    return Object.fromEntries(
      readdirSync(path.join(process.cwd(), "public/icons"))
        .filter((f) => /\.(png|webp|svg|jpe?g)$/i.test(f))
        .map((f) => [f.replace(/\.[^.]+$/, ""), `/icons/${f}`]),
    );
  } catch {
    return {};
  }
}

export default function Page() {
  return <Desktop icons={iconFiles()} />;
}
