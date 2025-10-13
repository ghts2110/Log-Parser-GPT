import { logToJson } from "./log-management/log-to-json";
import { simulate } from "./simulate";

async function main() {
  const args = process.argv.slice(2);
  const shouldConvert = args.includes("--convert");

  if (shouldConvert) {
    await logToJson();
  }

  simulate();
}

main().catch((err) => {
  console.error("Erro no main:", err);
  process.exit(1);
});
