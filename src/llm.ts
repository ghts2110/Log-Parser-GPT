import fs from "node:fs";
import path from "node:path";
import OpenAI from "openai";

const promptPath = path.join(__dirname, "..", "prompt.txt");

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function callLLM(): Promise<string> {
    try {
        const content = await fs.promises.readFile(promptPath, 'utf-8');
        const messages = JSON.parse(content);

        const answer = await client.chat.completions.create({
            model: "gpt-4o",
            messages,
        });

        return answer.choices[0].message.content ?? "";
    }catch (err) {
        console.error("Erro ao chamar LLM:", err);
        return "";
    }
}