import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function callLLM(context: string, question: string, answer: string): Promise<string> {
    const prompt: string = `
Você é um avaliador imparcial de respostas de assistente. Decida apenas se a resposta é SATISFATÓRIA (true) ou NÃO SATISFATÓRIA (false). 
Pense nos critérios, mas retorne SOMENTE um booleano minúsculo, sem aspas, sem texto extra.

=========Contexto=========:
${context}

=========Pergunta do usuário=========:
${question}

=========Resposta do modelo=========:
${answer}

Critérios (todos precisam estar OK para retornar true):
1) Exatidão: não contradiz o contexto; nada inventado.
2) Utilidade: responde diretamente o que foi pedido e resolve a necessidade.
3) Completude essencial: não deixa faltar algo crítico para agir/entender.
4) Clareza e tom: claro, educado, sem confundir ou desviar.
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