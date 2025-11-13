import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { callLLM } from "./llm";

const promptPath = path.join(__dirname, "..", "prompt.txt");

async function readPromptFile(filePath: string) {
    while(true){
        try {
            const content = await fs.promises.readFile(promptPath, 'utf-8');
            console.log("Conteúdo do prompt.txt:\n", content);

            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
        
            const answer = await new Promise<string>((resolve) => {
                rl.question("Digite 1 para simular esse prompt: ", (input) => {
                rl.close();
                resolve(input.trim());
                });
            });

            const ans = Number(answer);
            if (ans === 1) {
                const response = callLLM(filePath)
                console.log("\nResposta da LLM:\n", await response);
            }else {
                break;
            }

        }catch (err) {
            console.error("Erro ao ler prompt.txt:", err);
        }
    }
}

export function watchPrompt(filePath: string) {
    readPromptFile(filePath)

    fs.watch(promptPath, async (eventType) => {
        if (eventType === 'change') {
            console.clear();
            console.log("prompt.txt foi modificado. Novo conteúdo:");
            await readPromptFile(filePath);
        }
    });
}