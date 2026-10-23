import type { WorkspaceAppHostApi } from "@agnx-lab/app-sdk";
import { HOST_SANDBOX_APP_ID } from "./constants";

export interface HostSandboxPingInput {
  message?: string;
  notify?: boolean;
}

export async function invokeHostSandboxPing(
  host: WorkspaceAppHostApi,
  input: HostSandboxPingInput,
): Promise<{ ok: true; echo: string }> {
  const echo = input.message?.trim() || "pong";
  if (input.notify) {
    await host.ui.notification.show({
      title: "Agent 探针",
      message: echo,
      kind: "info",
    });
  }
  return { ok: true, echo };
}

export function registerHostSandboxAgentTools(host: WorkspaceAppHostApi): () => void {
  return host.registerAgentTools({
    appId: HOST_SANDBOX_APP_ID,
    availability: "always",
    tools: [
      {
        name: "host_sandbox_ping",
        description: "Host 沙盒探针：回显 message，可选 notify 触发 notification",
        inputSchema: {
          type: "object",
          properties: {
            message: { type: "string" },
            notify: { type: "boolean" },
          },
          additionalProperties: false,
        },
        execute: async (raw) => invokeHostSandboxPing(host, (raw ?? {}) as HostSandboxPingInput),
      },
    ],
  });
}
