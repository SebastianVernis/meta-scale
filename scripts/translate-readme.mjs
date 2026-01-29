#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";

function parseArgs(argv) {
  const args = { dryRun: false };

  for (const a of argv.slice(2)) {
    if (a === "--dry-run") args.dryRun = true;
    else if (a === "--help" || a === "-h") args.help = true;
    else throw new Error(`Argumento no reconocido: ${a}`);
  }

  return args;
}

function extractOutputText(responseJson) {
  if (typeof responseJson?.output_text === "string" && responseJson.output_text.trim()) {
    return responseJson.output_text;
  }

  const parts = [];
  for (const item of responseJson?.output ?? []) {
    for (const content of item?.content ?? []) {
      if (content?.type === "output_text" && typeof content?.text === "string") {
        parts.push(content.text);
      }
    }
  }

  const joined = parts.join("");
  if (joined.trim()) return joined;

  throw new Error("No se pudo extraer texto del response (output_text/output.content)."
  );
}

async function main() {
  const args = parseArgs(process.argv);

  if (args.help) {
    // eslint-disable-next-line no-console
    console.log(`Uso:
  npm run translate:readme

Opciones:
  --dry-run   No escribe README.en.md, imprime la salida a stdout

Variables de entorno:
  OPENAI_API_KEY   (requerida)
  OPENAI_MODEL     (opcional, default: gpt-4.1)
  README_ES        (opcional, default: README.md)
  README_EN        (opcional, default: README.en.md)
`);
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Falta OPENAI_API_KEY. Ej: OPENAI_API_KEY=... npm run translate:readme"
    );
  }

  const model = process.env.OPENAI_MODEL || "gpt-4.1";
  const inputPath = process.env.README_ES || "README.md";
  const outputPath = process.env.README_EN || "README.en.md";

  const readmeEs = await readFile(inputPath, "utf8");

  const instructions =
    "Eres un traductor técnico. Traduce del español al inglés. Mantén el Markdown, los títulos, listas, bloques de código y backticks. No agregues explicaciones, solo devuelve el contenido final del README en inglés. Mantén la referencia a la versión española como: '- Español: `README.md`'.";

  const body = {
    model,
    instructions,
    input: readmeEs,
    temperature: 0.2,
    max_output_tokens: 4096,
    store: false,
  };

  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(
      `OpenAI API error: ${res.status} ${res.statusText}${errText ? `\n${errText}` : ""}`
    );
  }

  const json = await res.json();
  let readmeEn = extractOutputText(json).trim();

  // Normaliza final de archivo.
  readmeEn += "\n";

  // Marca el archivo como generado (sin impedir ediciones si así lo desean).
  const header =
    "<!-- AUTO-GENERATED: run `npm run translate:readme` to update this file. -->\n\n";

  if (!readmeEn.startsWith("<!-- AUTO-GENERATED:")) {
    readmeEn = header + readmeEn;
  }

  if (args.dryRun) {
    // eslint-disable-next-line no-console
    console.log(readmeEn);
    return;
  }

  await writeFile(outputPath, readmeEn, "utf8");
  // eslint-disable-next-line no-console
  console.log(`OK: generado ${outputPath} usando ${model}`);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err?.stack || String(err));
  process.exitCode = 1;
});
