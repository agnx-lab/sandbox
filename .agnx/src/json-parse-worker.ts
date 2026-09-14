// 场景：Host SDK 指南 — 真实 Web Worker 探针（JSON 解析），配合 host.worker.observe。
import type { WorkspaceAppHostApi } from "@getagnx/app-sdk";

const WORKER_SOURCE = `
self.addEventListener("message", (event) => {
  try {
    const text = typeof event.data === "string" ? event.data : String(event.data ?? "");
    const parsed = JSON.parse(text);
    const count = Array.isArray(parsed) ? parsed.length : Object.keys(parsed ?? {}).length;
    self.postMessage({ ok: true, count });
  } catch (error) {
    self.postMessage({
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
});
`;

function postToWorker(worker: Worker, payload: string): void {
  // Worker.postMessage 只有 data[/transfer]，无 targetOrigin；规则误套 Window API。
  // oxlint-disable-next-line eslint-plugin-unicorn(require-post-message-target-origin) -- Worker 单参 API
  worker.postMessage(payload);
}

export async function runHostSandboxJsonParseWorker(
  host: WorkspaceAppHostApi,
  payloadJson: string,
): Promise<{ ok: boolean; summary: string }> {
  if (typeof Worker === "undefined" || typeof URL === "undefined" || typeof Blob === "undefined") {
    host.worker.observe({
      type: "error",
      summary: "Web Worker 不可用（当前平台）",
    });
    return { ok: false, summary: "当前平台无 Web Worker" };
  }

  const blob = new Blob([WORKER_SOURCE], { type: "application/javascript" });
  const url = URL.createObjectURL(blob);
  host.worker.observe({
    type: "spawn",
    summary: "json-parse-worker started",
    detail: url.slice(0, 48),
  });

  try {
    const result = await new Promise<{ ok: boolean; count?: number; error?: string }>(
      (resolve, reject) => {
        const worker = new Worker(url);
        const timer = setTimeout(() => {
          worker.terminate();
          reject(new Error("worker timeout"));
        }, 5_000);
        worker.addEventListener("message", (event: MessageEvent) => {
          clearTimeout(timer);
          worker.terminate();
          resolve(event.data as { ok: boolean; count?: number; error?: string });
        });
        worker.addEventListener("error", (event) => {
          clearTimeout(timer);
          worker.terminate();
          reject(event.error ?? new Error(event.message || "worker error"));
        });
        postToWorker(worker, payloadJson);
      },
    );

    if (!result.ok) {
      host.worker.observe({
        type: "error",
        summary: `json-parse-worker failed: ${result.error ?? "unknown"}`,
      });
      return { ok: false, summary: result.error ?? "parse failed" };
    }

    host.worker.observe({
      type: "terminate",
      summary: `json-parse-worker done · ${result.count ?? 0} keys/items`,
    });
    return { ok: true, summary: `解析完成 · ${result.count ?? 0} 项` };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    host.worker.observe({
      type: "error",
      summary: `json-parse-worker throw: ${message}`,
    });
    return { ok: false, summary: message };
  } finally {
    URL.revokeObjectURL(url);
  }
}
