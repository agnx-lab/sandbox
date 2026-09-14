// 场景：Host 沙盒运行时状态 — lifecycle/tabs 事件采样（供面板只读展示）。
import type { WorkspaceAppHostApi } from "@getagnx/app-sdk";
import { HOST_SANDBOX_APP_ID } from "./constants";
import { appendHostSandboxEventLog } from "./sandbox-event-log";

export interface HostSandboxRuntimeSnapshot {
  hostReady: boolean;
  lastLifecycleLine: string;
  lastTabLine: string;
  retainActive: boolean;
  syncAvailable: boolean;
  toolsAvailable: boolean;
  confirmRiskAvailable: boolean;
}

let boundHost: WorkspaceAppHostApi | null = null;
let retainActive = false;
let lastLifecycleLine = "（尚无事件）";
let lastTabLine = "（尚无事件）";
const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) {
    listener();
  }
}

export function bindHostSandboxRuntime(host: WorkspaceAppHostApi): () => void {
  boundHost = host;
  const unsubs: Array<() => void> = [];

  lastLifecycleLine = host.lifecycle.isHostReady() ? "HostReady ✓" : "等待 HostReady…";
  unsubs.push(
    host.lifecycle.onHostReady(() => {
      lastLifecycleLine = `HostReady @ ${new Date().toLocaleTimeString()}`;
      appendHostSandboxEventLog("lifecycle · HostReady", "success");
      emit();
    }),
  );
  unsubs.push(
    host.lifecycle.onSuspend(() => {
      lastLifecycleLine = `Suspend @ ${new Date().toLocaleTimeString()}`;
      appendHostSandboxEventLog("lifecycle · suspend", "warn");
      emit();
    }),
  );
  unsubs.push(
    host.lifecycle.onResume(() => {
      lastLifecycleLine = `Resume @ ${new Date().toLocaleTimeString()}`;
      appendHostSandboxEventLog("lifecycle · resume", "info");
      emit();
    }),
  );

  const tabKinds = ["open", "close", "focus", "blur", "visible"] as const;
  for (const kind of tabKinds) {
    const attach = {
      open: host.tabs.onOpen,
      close: host.tabs.onClose,
      focus: host.tabs.onFocus,
      blur: host.tabs.onBlur,
      visible: host.tabs.onVisibleChange,
    }[kind];
    unsubs.push(
      attach((event) => {
        const tabId = event.tabId;
        lastTabLine = `${kind} · ${tabId} @ ${new Date().toLocaleTimeString()}`;
        appendHostSandboxEventLog(`tabs · ${kind} · ${tabId}`, "info");
        emit();
      }),
    );
  }

  emit();

  return () => {
    for (const unsub of unsubs) {
      unsub();
    }
    if (boundHost === host) {
      boundHost = null;
    }
  };
}

export function getHostSandboxRuntimeHost(): WorkspaceAppHostApi | null {
  return boundHost;
}

export function subscribeHostSandboxRuntime(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function readHostSandboxRuntimeSnapshot(): HostSandboxRuntimeSnapshot {
  const host = boundHost;
  return {
    hostReady: host?.lifecycle.isHostReady() ?? false,
    lastLifecycleLine,
    lastTabLine,
    retainActive,
    syncAvailable: Boolean(host?.sync),
    toolsAvailable: Boolean(host?.tools?.run),
    confirmRiskAvailable: Boolean(host?.ui.confirmRisk),
  };
}

export function setHostSandboxRetain(active: boolean, reason?: string): void {
  const host = boundHost;
  if (!host) {
    return;
  }
  retainActive = active;
  host.background.requestRetain({
    appId: HOST_SANDBOX_APP_ID,
    active,
    reason: reason ?? "host-sandbox-probe",
  });
  emit();
}
