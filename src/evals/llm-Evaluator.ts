import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function callLLM(conversations: string): Promise<string> {
    const prompt: string = `
Você é um avaliador imparcial de sentimento do usuário em uma conversa com um assistente. 
Decida apenas se o usuário aparenta estar SATISFEITO (true) ou INSATISFEITO (false).
Analise o tom, as palavras e a intenção implícita das mensagens.

=========Conversa=========:
${conversations}
    `;

    try {
        const answer = await client.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "system", content: prompt }],
            response_format: {
                type: "json_schema",
                json_schema: {
                    name: "bool_eval",
                    schema: {
                        type: "object",
                        properties: {
                            result: { type: "boolean" },
                        },
                        required: ["result"],
                        additionalProperties: false
                    },
                    strict: true
                }
            }
        });

        const content = answer.choices[0].message.content?.trim() ?? ""
        const response = JSON.parse(content).result

        return response ?? "";
    }catch (err) {
        console.error("Erro ao chamar LLM:", err);
        return "";
    }
}