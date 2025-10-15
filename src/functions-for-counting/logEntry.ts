

interface Id {
    remote?: string;
}

interface _Data {
    body?: string;
    id? : Id;
}

interface Message {
    role?: string;
    content: string;
    _data?: _Data;
}

interface Reply {
    _data?: _Data;
}

export interface LogEntry {
    messages?: Message[];
    message?: Message;
    text?: string;
    reply?: Reply;
}