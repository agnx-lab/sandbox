// 场景：Host SDK 指南 — 统一事件流（探针反馈 + lifecycle/tabs 采样）。
export interface HostSandboxLogLine {
  id: string;
  at: number;
  text: string;
  kind?: "info" | "success" | "warn" | "error";
}

let sequence = 0;
let lines: HostSandboxLogLine[] = [];
const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) {
    listener();
  }
}

function nextId(): string {
  sequence += 1;
  return `log-${sequence}`;
}

export function subscribeHostSandboxEventLog(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function readHostSandboxEventLog(limit = 12): readonly HostSandboxLogLine[] {
  return lines.slice(-limit);
}

export function appendHostSandboxEventLog(
  text: string,
  kind: HostSandboxLogLine["kind"] = "info",
): void {
  lines = [
    ...lines,
    {
      id: nextId(),
      at: Date.now(),
      text,
      kind,
    },
  ].slice(-40);
  emit();
}

export function clearHostSandboxEventLog(): void {
  lines = [];
  emit();
}

export function formatHostSandboxLogTime(at: number): string {
  return new Date(at).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}
