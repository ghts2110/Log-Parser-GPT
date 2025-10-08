import fs from "node:fs";
import path from "node:path";
import OpenAI from "openai";
import { writeFile } from "./file-management";

const promptPath = path.join(__dirname, "..", "prompt.txt");

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function callLLM(filePath: string): Promise<string> {
    try {
        const content = await fs.promises.readFile(promptPath, 'utf-8');
        const messages = JSON.parse(content);

        const answer = await client.chat.completions.create({
            model: "gpt-4o",
            messages,
        });

        const response = answer.choices[0].message.content
        writeFile(filePath, content, response ?? "" );

        return response ?? "";
    }catch (err) {
        console.error("Erro ao chamar LLM:", err);
        return "";
    }
}