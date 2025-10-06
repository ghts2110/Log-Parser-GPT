import { logToJson } from "./log-to-json";

async function main() {
  const args = process.argv.slice(2);
  const shouldConvert = args.includes("--convert");

  if (shouldConvert) {
    await logToJson();
  }

  
}

main().catch((err) => {
  console.error("Erro no main:", err);
  process.exit(1);
});
