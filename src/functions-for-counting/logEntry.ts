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

export interface LogEntry {
    messages?: Message[];
    text?: string;
    chat?: string;
    reply?: Reply;
}