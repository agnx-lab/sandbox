// 场景：Host SDK 指南 host 绑定单例；独立模块避免 panel HMR 重载时清空 boundHost。
import type { WorkspaceAppHostApi } from "@agnx-lab/app-sdk";

let boundHost: WorkspaceAppHostApi | null = null;

export function bindHostSandboxHost(host: WorkspaceAppHostApi): void {
  boundHost = host;
}

export function peekHostSandboxHost(): WorkspaceAppHostApi | null {
  return boundHost;
}

export function requireHostSandboxHost(): WorkspaceAppHostApi {
  if (!boundHost) {
    throw new Error("Host SDK 指南尚未 bind host");
  }
  return boundHost;
}
