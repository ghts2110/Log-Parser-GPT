interface LogEntry {
  msg?: string;
  reason?: string;
  raw?: string;
}

export function removeContent(parsedLines: LogEntry[]): boolean{
  // mensagem analisada
  const hasParsedMessage = parsedLines.some(
    (entry) => entry.msg === "parsed message"
  );
  if (!hasParsedMessage){
    return true;
  }

  // tíquete aberto
  const hasAutomationBlocked = parsedLines.some(
    (entry) => entry.reason === "open ticket"
  );
  if (hasAutomationBlocked){
    return true;
  }

  // fora de horario
  const hasNotInWorkingHours = parsedLines.some(
    (entry) => entry.reason === "not in working hours"
  );
  if (hasNotInWorkingHours){
    return true;
  }

  // sessão paulsada
  const hasSessionPaused = parsedLines.some(
    (entry) => entry.reason === "session paused: attendant_took_over"
  );
  if (hasSessionPaused){
    return true;
  }

  // não pode responder
  const hasIgnoreBatchProcess = parsedLines.some(
    (entry) => entry.msg === "ignore batch process: cannot suggest answer or chat not active"
  );
  if (hasIgnoreBatchProcess){
    return true;
  }

  return false;
}