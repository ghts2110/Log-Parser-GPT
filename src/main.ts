import { countDifferentNumbers } from "./functions-for-counting/counter-of-different-numbers"
import { logToJson } from "./log-management/log-to-json";
import { simulate } from "./simulate";

async function main() {
  const args = process.argv.slice(2);
  const shouldConvert = args.includes("--convert");

  if (shouldConvert) {
    let numMessages = 0, numConversations = 0, numGoodConversations = 0;
    numMessages = await logToJson();

    if(!numMessages){
      console.log("Nunhuma mensagem encontrada");
    }

    return;
  }

  simulate();
}

main().catch((err) => {
  console.error("Erro no main:", err);
  process.exit(1);
});
