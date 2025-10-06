import { promises as fs } from "node:fs";
import path from "node:path";

const logsDir = path.resolve(__dirname, "..", "logs");

type Dirent = import("fs").Dirent;

async function getAllLogFiles(dir: string): Promise<string[]> {
	const entries: Dirent[] = await fs.readdir(dir, { withFileTypes: true });

	const files = await Promise.all(
        entries
        .filter((entry) => !entry.name.startsWith('.')) 
        .map(async (entry) => {
            const fullPath = path.join(dir, entry.name);

            if (entry.isDirectory()) {
            return getAllLogFiles(fullPath);
            } else {
            return [fullPath];
            }
        })
    );

	return files.flat();
}

(async () => {
	const allFiles = await getAllLogFiles(logsDir);
	console.log("Arquivos encontrados:");
	for (const f of allFiles) console.log(" -", path.basename(f));
})();
