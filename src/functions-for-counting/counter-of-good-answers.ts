import { promises as fs } from "node:fs";
import path from "node:path";
import { callLLM } from "../evals/llm-Evaluator";
import { getAllFiles } from "../file-management";

const outDir  = path.join(__dirname, '../../', 'logs/output');

interface Message {
    role?: string;
    content: string;
}

interface _Data {
    body?: string;
}

interface Reply {
    _data?: _Data;
}

interface LogEntry {
    messages?: Message[];
    text?: string;
    reply?: Reply;
}

async function collectData(content: LogEntry[], filePath: string){
    let context: string = "";
    let question: string = "";
    let answer: string = "";

    for(const entry of content){
        if(entry.messages){
            for(const msg of entry.messages){
                if(msg.role === "system"){
                    context += msg.content;
                }

                if(msg.role === "user"){
                    question = msg.content;
                }
            }
        }

        if(entry.reply){
            if(entry.reply._data){
                if(entry.reply._data.body) {
                    answer = entry.reply._data.body
                }
            }
        }
    }

    const result: string = await callLLM(context, question, answer);
    if(!result){
        console.log(filePath)
    }
}

async function countGood(){
    const allFiles = await getAllFiles(outDir);
    
    if (allFiles.length === 0) {
        console.log('Nenhum arquivo encontrado em logs/input/.');
        return;
    }
    
    for (const f of allFiles) {
        const content = JSON.parse(await fs.readFile(f, 'utf8'))

        collectData(content, f);
    }

    // printar o resultado
}

countGood().catch((err) => {
  console.error("Erro no main:", err);
  process.exit(1);
});
