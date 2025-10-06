import { promises as fs } from "node:fs";
import path from "node:path";
import readline from "node:readline";

const outDir  = path.join(__dirname, '..', 'logs/output');

type Dirent = import("fs").Dirent;

async function getAllFiles(dir: string): Promise<string[]> {
    const entries: Dirent[] = await fs.readdir(dir, { withFileTypes: true });

    const files = await Promise.all(
        entries
        .filter((entry) => !entry.name.startsWith('.')) 
        .map(async (entry) => {
            const fullPath = path.join(dir, entry.name);

            if (entry.isDirectory()) return getAllFiles(fullPath);
            
            return [fullPath];
        })
    );

    return files.flat();
}

async function promptChoice(files: string[]){
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
    const chosenFile = path.join(outDir, files[index]);

    return chosenFile;
}   

export async function simulate() {
    const allFiles = await getAllFiles(outDir);
    promptChoice(allFiles)
}