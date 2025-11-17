// src/App.tsx
import { useState } from "react";
import { encode } from "@toon-format/toon";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MagicCard } from "./components/ui/magic-card";
import { encode as gptEncode } from "gpt-tokenizer";

const defaultJson = JSON.stringify(
  {
    users: [
      { id: 1, name: "Alice", role: "admin" },
      { id: 2, name: "Bob", role: "user" },
    ],
  },
  null,
  2
);

function countTokens(text: string) {
  if (!text) return 0;

  // gpt-tokenizer returns an array of token IDs
  const tokens = gptEncode(text);

  return tokens.length;
}

function App() {
  const [jsonInput, setJsonInput] = useState<string>(defaultJson);
  const [jsonString, setJsonString] = useState<string>("");
  const [toonString, setToonString] = useState<string>("");
  const [jsonTokens, setJsonTokens] = useState<number>(0);
  const [jsonStringTokens, setJsonStringTokens] = useState<number>(0);
  const [toonTokens, setToonTokens] = useState<number>(0);
  const [error, setError] = useState<string>("");

  const handleConvert = () => {
    setError("");
    try {
      const parsed = JSON.parse(jsonInput);

      const prettyJson = JSON.stringify(parsed, null, 2);
      const jsonTokenCount = countTokens(prettyJson);

      const stringJson = JSON.stringify(parsed, null, 0);
      const jsonStringTokenCount = countTokens(stringJson);

      const toon = encode(parsed);
      const toonTokenCount = countTokens(toon);

      setJsonString(stringJson);
      setToonString(toon);
      setJsonTokens(jsonTokenCount);
      setToonTokens(toonTokenCount);
      setJsonStringTokens(jsonStringTokenCount);
    } catch (e: any) {
      setError(e?.message || "Invalid JSON input");
      setJsonString("");
      setToonString("");
      setJsonTokens(0);
      setToonTokens(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50 flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-5xl border-slate-800 bg-black/60 backdrop-blur-xl shadow-2xl">
        <CardHeader className="border-b border-slate-800 pb-6">
          <CardTitle className="text-2xl md:text-3xl font-semibold tracking-tight text-white">
            JSON ➝ TOON Token Playground
          </CardTitle>
          <CardDescription className="text-slate-400">
            Paste any JSON, convert it to a JSON string and TOON format, and
            compare their approximate token counts for your LLM.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-start">
            {/* Left: Input / controls */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="json-input" className="text-slate-200">
                  JSON input
                </Label>
                <Textarea
                  id="json-input"
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  className="min-h-[220px] font-mono text-sm bg-slate-950/70 border-slate-800 focus-visible:ring-slate-500 text-white"
                  placeholder='{"your": "json"}'
                />
              </div>

              {error && (
                <div className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                  {error}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Button
                  onClick={handleConvert}
                  className="px-6 rounded-2xl"
                  size="lg"
                >
                  Convert &amp; Count Tokens
                </Button>

                <div className="text-xs text-slate-400">
                  Token counts are a simple whitespace-based approximation, not
                  an exact tokenizer.
                </div>
              </div>
            </div>

            {/* Right: Magic UI card with stats */}
            <div className="w-full">
              <MagicCard
                gradientColor="#262626"
                className="rounded-2xl border border-slate-800/70 bg-slate-950/70 p-0"
              >
                <div className="p-4 border-b border-slate-800/70 flex items-center justify-between gap-3 bg-black">
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                      Token Overview
                    </p>
                    <p className="text-sm text-slate-300">
                      LLM (approximate tokens)
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                        JSON
                      </span>
                      <span className="font-semibold text-slate-100">
                        {jsonTokens}
                      </span>
                    </div>
                    <div className="h-10 w-px bg-slate-800/80" />
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                        JSON single-line string
                      </span>
                      <span className="font-semibold text-amber-300">
                        {jsonStringTokens}
                      </span>
                    </div>
                    <div className="h-10 w-px bg-slate-800/80" />
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                        TOON
                      </span>
                      <span className="font-semibold text-emerald-400">
                        {toonTokens}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 divide-y divide-slate-800/70 bg-black">
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium text-slate-300">
                        JSON
                      </span>
                      <span className="rounded-full border border-slate-800/60 bg-slate-900/70 px-2 py-0.5 text-[10px] text-slate-400">
                        {jsonTokens || 0} tokens (approx)
                      </span>
                    </div>
                    <pre className="max-h-22 overflow-auto rounded-lg border border-slate-800/70 bg-slate-950/80 p-3 text-[11px] leading-relaxed text-slate-100">
                      {jsonInput || "// Convert to see JSON output here"}
                    </pre>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium text-slate-300">
                        JSON single-line string
                      </span>
                      <span className="rounded-full border border-amber-500/30 bg-amber-950/90 px-2 py-0.5 text-[10px] text-amber-100">
                        {jsonStringTokens || 0} tokens (approx)
                      </span>
                    </div>
                    <pre className="max-h-44 overflow-auto rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-[11px] leading-relaxed text-amber-100">
                      {jsonString || "// Convert to see JSON output here"}
                    </pre>
                  </div>

                  <div className="p-4 space-y-2 bg-black">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium text-slate-300">
                        TOON output
                      </span>
                      <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-200">
                        {toonTokens || 0} tokens (approx)
                      </span>
                    </div>
                    <pre className="max-h-44 overflow-auto rounded-lg border border-emerald-500/30 bg-slate-950/90 p-3 text-[11px] leading-relaxed text-emerald-100">
                      {toonString || "# Convert to see TOON output here"}
                    </pre>
                  </div>
                </div>
              </MagicCard>
            </div>
          </div>
        </CardContent>
        <div className="pt-6 text-center text-xs text-slate-500">
        <a
          href="https://github.com/RajARROW/token-comparison"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-400 hover:text-slate-200 transition underline underline-offset-4">
          View the source on GitHub →
        </a>
      </div>
      </Card>
    </div>
  );
}

export default App;