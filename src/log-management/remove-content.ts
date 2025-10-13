interface ChoiceMessage {
  role: string;
  content: string;
  refusal?: string | null;
  annotations?: unknown[];
}

interface Choice {
  index: number;
  message: ChoiceMessage;
  logprobs?: unknown | null;
  finish_reason?: string;
}

interface LogEntry {
  msg?: string;
  reason?: string;
  raw?: string;
  model? : string;
  choices? : Choice[]
}

export function removeContent(parsedLines: LogEntry[]): boolean{
  // tem model
  const hasModel = parsedLines.some(
    (entry) => entry.model === "gpt-4o"
  );
  if (!hasModel){
    return true;
  }

  // const hasGreeting = parsedLines.some(
  //   (entry) =>
  //     entry.choices?.some(
  //       (c) => c.message?.content?.trim().toLowerCase() === "greeting." || c.message?.content?.trim().toLowerCase() === "greeting"
  //     )
  // );
  // if(hasGreeting){
  //   return true;
  // }


  return false;
}