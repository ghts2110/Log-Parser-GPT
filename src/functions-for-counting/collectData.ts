import type { LogEntry } from "./logEntry";

export async function collectData(content: LogEntry[]){
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

    return { context, question, answer };
}