import { promises as fs } from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { creatFile, creatFolder, getAllFiles } from "./file-management";
import { watchPrompt } from "./watch-prompt";

const outDir  = path.join(__dirname, '..', 'logs/output');

async function promptChoice(files: string[]): Promise<string | undefined> {
    if(files.length === 0) {
        console.log('Nenhum arquivo JSON encontrado em logs/output/.');
        return;
    }

    console.log('Escolha um JSON disponíveis:');
    files.forEach((file, index) => {
        console.log(`[${index + 1}] ${path.basename(file)}`);
    });

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const answer = await new Promise<string>((resolve) => {
        rl.question("Digite o número do arquivo que deseja simular: ", (input) => {
        rl.close();
        resolve(input.trim());
        });
    });

    const index = Number(answer) -1;
    if(index < 0 || index >= files.length ) {
        console.log('Escolha inválida. Tente novamente.');
        return;
    }

    return files[index];
}   

let filePath: any;
async function actionChoice(fileChoice: string) {
    // ações disponíveis
    const actions = ['categorização', 'resposta', 'tools'];

    for(const [index, action] of actions.entries()){
        console.log(`[${index + 1}] ${action}`);
    }
    
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const answer = await new Promise<string>((resolve) => {
        rl.question("Digite o número da ação que deseja simular: ", (input) => {
        rl.close();
        resolve(input.trim());
        });
    });

    filePath = await creatFile(path.basename(fileChoice, path.extname(fileChoice)), actions[Number(answer)-1])

    const choice = Number(answer);
    if (![1, 2, 3].includes(choice)) {
        console.log("Opção inválida.");
        return;
    }

    const content = await fs.readFile(fileChoice, 'utf-8');
    const data = JSON.parse(content);

    // determina a ocorrência alvo conforme a escolha
    const targetOccurrences: Record<1 | 2 | 3, number> = { 1: 1, 2: 3, 3: 5 };
    const target = targetOccurrences[choice as 1 | 2 | 3];

    let count = 0;
    let found = null;

    for (const d of data) {
        if (d.model) {
        count++;
        if (count === target) {
            found = d;
            break;
        }
        }
    }

    if (!found) {
        console.log(`Não foi possível encontrar a ${target}ª ocorrência de "model" neste arquivo.`);
        return;
    }

    return found;
}   

export async function simulate() {
    const allFiles = await getAllFiles(outDir);

    let fileChoice: string | undefined;

    while (!fileChoice) {
        fileChoice = await promptChoice(allFiles);
    }
    creatFolder(path.basename(fileChoice, path.extname(fileChoice)));

    let prompt: any;

    while (!prompt) {
        prompt = await actionChoice(fileChoice);
    }
    
    const messages = prompt.messages;

    const promptText = JSON.stringify(messages, null, 2);
    const promptPath = path.join(__dirname, "..", "prompt.txt");

    await fs.writeFile(promptPath, promptText, 'utf-8');

    watchPrompt(filePath);
}