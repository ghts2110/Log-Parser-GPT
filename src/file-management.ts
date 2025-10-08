import { promises as fs } from "node:fs";
import path from "node:path";

type Dirent = import("fs").Dirent;

export async function getAllFiles(dir: string): Promise<string[]> {
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

const _path = path.join(__dirname, "..", "results");

export async function creatFolder(name: string) {
    try {
        const folderPath = path.join(_path, name);

        await fs.mkdir(folderPath, { recursive: true });
    }catch (error) {
        console.error("Erro ao criar a pasta:", error);
        throw error;
    }
}

export async function creatFile(folderName: string, fileName: string) {
    try {
        const filePath = path.join(_path, folderName, fileName);

        try{
            await fs.access(filePath);
            return filePath;
        }catch{
            await fs.writeFile(filePath, "", { flag: "wx" });
        }
    }catch (error) {
        console.error("Erro ao criar a pasta:", error);
        throw error;
    }
}

export async function writeFile(filePath: string, prompt: string, answer: string) {
    try {
        const separator = "\n------------------------------\n";

        const content = [
            "=== PROMPT ===",
            prompt,
            "\n=== RESPOSTA ===",
            answer,
            separator,
        ].join("\n");

        await fs.appendFile(filePath, content, "utf8");

        console.log(`\nConteúdo adicionado ao arquivo:\n${filePath}`);
    } catch (err) {
        console.error("Erro ao escrever no arquivo:", err);
        throw err;
    }
}