// 场景：Host 沙盒子应用入口 — 命令面板打开 + 主面板 Tab + Agent ping 工具。
import type { WorkspaceAppHostApi, WorkspaceAppModule } from "@getagnx/app-sdk";
import { BookOpen } from "lucide-react-native";
import { registerHostSandboxAgentTools } from "./agent-tools";
import { HOST_SANDBOX_APP_ID, HOST_SANDBOX_COMMAND_OPEN, HOST_SANDBOX_PANEL_ID } from "./constants";
import { bindHostSandboxHost } from "./sandbox-host-binding";
import { HostSandboxPanel } from "./sandbox-panel";
import { bindHostSandboxRuntime } from "./sandbox-runtime";

export const appId = HOST_SANDBOX_APP_ID;

function openHostSandboxTab(
  host: WorkspaceAppHostApi,
  context?: {
    serverId?: string;
    workspaceId?: string;
    currentPathname?: string | null;
  },
): void {
  host.openMiniAppTab({
    appId: HOST_SANDBOX_APP_ID,
    panelId: HOST_SANDBOX_PANEL_ID,
    serverId: context?.serverId,
    workspaceId: context?.workspaceId,
    currentPathname: context?.currentPathname,
  });
}

export function activate(host: WorkspaceAppHostApi): void {
  bindHostSandboxHost(host);
  bindHostSandboxRuntime(host);
  registerHostSandboxAgentTools(host);

  host.registerMiniApp({
    id: HOST_SANDBOX_PANEL_ID,
    appId: HOST_SANDBOX_APP_ID,
    title: "Host SDK 指南",
    icon: BookOpen,
    component: HostSandboxPanel,
    isolation: {
      mode: "worker",
      workerScripts: ["json-parse-worker (Blob)"],
      note: "指南页演示真实 Web Worker JSON 解析，经 host.worker.observe 上报",
    },
  });

  host.registerCommand({
    id: HOST_SANDBOX_COMMAND_OPEN,
    appId: HOST_SANDBOX_APP_ID,
    title: "Host SDK 指南",
    keywords: ["host", "sdk", "guide", "api", "sandbox", "子应用", "开发者", "能力", "指南"],
    icon: BookOpen,
    sidebarAction: {
      defaultVisible: true,
      label: "SDK",
      order: 90,
    },
    run: (context) => {
      openHostSandboxTab(host, context);
    },
  });
}

const moduleExport: WorkspaceAppModule = {
  appId: HOST_SANDBOX_APP_ID,
  activate,
};

export default moduleExport;

export { HOST_SANDBOX_APP_ID, HOST_SANDBOX_COMMAND_OPEN, HOST_SANDBOX_PANEL_ID } from "./constants";
export { HostSandboxPanel } from "./sandbox-panel";
export { invokeHostSandboxPing } from "./agent-tools";
