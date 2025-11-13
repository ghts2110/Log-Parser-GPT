import type { LogEntry } from "./logEntry";

// Removes line breaks and extra spaces, keeping the text in a single line
const cleanSpaces = (text: string) => text.replace(/\s*\n\s*/g, ' ').trim();

function extractQuestion(entry: LogEntry) {
	if (!entry.messages) return '';

	for (const msg of entry.messages) {
		if (msg.role === 'user') {
			return msg.content;
		}
	}

	return '';
}

function extractAnswer(entry: LogEntry) {
	if (entry.reply?._data?.body) {
		return entry.reply._data.body;
	}

	return '';
}

function collectPieceOfMessages(content: LogEntry[]) {
	let userQuestion = '';
	let assistantAnswer = '';

	for (const entry of content) {
		if (!userQuestion) {
			userQuestion = extractQuestion(entry);
		}

		if (!assistantAnswer) {
			assistantAnswer = extractAnswer(entry);
		}
	}

	return { userQuestion, assistantAnswer };
}

export function collectMessage(content: LogEntry[]) {
	let { userQuestion, assistantAnswer } = collectPieceOfMessages(content);
	userQuestion = cleanSpaces(userQuestion);
	assistantAnswer = cleanSpaces(assistantAnswer);

	return { userQuestion, assistantAnswer };
}