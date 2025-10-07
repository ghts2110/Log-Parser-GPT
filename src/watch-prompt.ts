import fs from "node:fs";
import path from "node:path";

const promptPath = path.join(__dirname, "..", "prompt.txt");

async function readPromptFile() {
    try {
        const content = await fs.promises.readFile(promptPath, 'utf-8');
        console.log("Conteúdo do prompt.txt:\n", content);
    }catch (err) {
        console.error("Erro ao ler prompt.txt:", err);
    }
}

export function watchPrompt() {
    readPromptFile()

    fs.watch(promptPath, async (eventType) => {
        if (eventType === 'change') {
            console.clear();
            console.log("prompt.txt foi modificado. Novo conteúdo:");
            await readPromptFile();
        }
    });
}