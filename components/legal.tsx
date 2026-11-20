import { readFile } from "node:fs/promises";
import path from "node:path";
export async function Legal({ kind }: { kind: "privacy" | "terms" }) {
  const text = await readFile(
    path.join(process.cwd(), "content", `${kind}.md`),
    "utf8",
  );
  return (
    <article className="policy">
      {text.split("\n").filter(Boolean).map((p, i) =>
        p.startsWith("# ") ? (
          <h1 key={i}>{p.slice(2)}</h1>
        ) : p.startsWith("## ") ? (
          <h2 key={i}>{p.slice(3)}</h2>
        ) : (
          <p key={i}>
            {p.includes("https://github.com/SayedZahur786") ? (
              <>
                {p.split("https://github.com/SayedZahur786")[0]}
                <a href="https://github.com/SayedZahur786">
                  Sayed Zahur on GitHub
                </a>
                {p.split("https://github.com/SayedZahur786")[1]}
              </>
            ) : (
              p
            )}
          </p>
        ),
      )}
    </article>
  );
}
