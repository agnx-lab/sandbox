// 场景：Host SDK 指南 — WorkspaceAppHostApi 能力目录（开发者可读说明）。
export type HostSdkSurfaceStatus = "live" | "planned";

export interface HostSdkSurfaceEntry {
  id: string;
  sdkPath: string;
  label: string;
  status: HostSdkSurfaceStatus;
  /** 开发者向：能做什么 */
  description: string;
  /** 小白向：什么时候用、解决什么问题 */
  scenario?: string;
  /** 探针/实现备注 */
  note?: string;
}

export const HOST_SDK_HERO = {
  title: "Host SDK 指南",
  subtitle: "面向子应用开发者",
  body: "开发第三方或 first-party 子应用时，通过本页了解 Agnx 宿主已暴露的 WorkspaceAppHostApi 能力。每个卡片对应一条 SDK 路径：可点击探针亲自验证；路线图区为即将开放的能力。",
};

/** 已实现探针（面板按此顺序渲染卡片）。 */
export const HOST_SDK_LIVE_SURFACES: readonly HostSdkSurfaceEntry[] = [
  {
    id: "ui.notification",
    sdkPath: "host.ui.notification",
    label: "轻量全局通知",
    status: "live",
    description: "短时 toast 式反馈：成功 / 信息 / 警告 / 错误。禁止自造第二套全局提示层。",
    note: "与 progress 共用顶栏壳层，source=notification",
  },
  {
    id: "ui.progress",
    sdkPath: "host.ui.progress",
    label: "长任务进度",
    status: "live",
    description: "不确定或确定进度、可取消、多任务并行；适合打包、同步、下载等长操作。",
    note: "顶栏反馈条 · source=progress",
  },
  {
    id: "ui.brandLoader",
    sdkPath: "host.ui.BrandLogoLoaderPanel",
    label: "品牌 Logo 扫光",
    status: "live",
    description:
      "面板内内容区 loading（如左右布局点导航换内容）。与 pane 首屏 boot 同源组件；Pane 级请用 isPanelBootReady。",
    scenario: "左侧导航 + 右侧内容区切换时，在内容区显示横向扫光。",
    note: "另有 host.ui.BrandLogoLoader（仅图标）",
  },
  {
    id: "ui.confirmRisk",
    sdkPath: "host.ui.confirmRisk",
    label: "桌面风险确认",
    status: "live",
    description: "高敏操作前的原生确认框，可选 checkbox。仅桌面注入时可用。",
  },
  {
    id: "config",
    sdkPath: "host.config",
    label: "App 级配置",
    status: "live",
    description:
      "global / app 两级 JSON 偏好，带 subscribe、listKeys、delete。适合设置项持久化，非业务大文件。",
  },
  {
    id: "tools.run",
    sdkPath: "host.tools.run",
    label: "Sidecar 工具",
    status: "live",
    description: "在 App 包内 tools/ 白名单脚本，由桌面主进程 spawn；stderr PROGRESS: 可流式上报。",
    note: "仅 Electron",
  },
  {
    id: "lifecycle",
    sdkPath: "host.lifecycle",
    label: "宿主生命周期",
    status: "live",
    description: "HostReady、冷恢复、suspend / resume。用于在宿主就绪后再拉数据。",
  },
  {
    id: "tabs",
    sdkPath: "host.tabs",
    label: "Tab 生命周期",
    status: "live",
    description: "open / close / focus / blur / visible。与布局槽位可能不同步（LRU keep-alive）。",
  },
  {
    id: "background",
    sdkPath: "host.background",
    label: "后台钉住",
    status: "live",
    description: "requestRetain 避免 Sub App Tab 被 LRU 卸载；registerSession 声明长会话恢复。",
  },
  {
    id: "agentTools",
    sdkPath: "host.registerAgentTools",
    label: "Agent 工具",
    status: "live",
    description: "向编码 Agent 暴露结构化工具（如 host_sandbox_ping）。与 Context VFS 互补。",
    note: "工具名 host_sandbox_ping",
  },
  {
    id: "events",
    sdkPath: "host.events",
    label: "统一事件观测",
    status: "live",
    description: "只读环缓冲 + 事件矩阵；诊断与排障用，不替代各域 subscribe API。",
    scenario:
      "子应用「好像没反应、同步失败、不知道宿主有没有收到操作」时——读这里或去命令面板「诊断」→ Host 观测，复制给 AI。",
    note: "readRecent / subscribe / matrix",
  },
  {
    id: "worker.observe",
    sdkPath: "host.worker.observe",
    label: "Worker 观测",
    status: "live",
    description: "Web Worker spawn/terminate/error 时 opt-in 上报；宿主不代为 spawn。",
    scenario:
      "App 里用 Worker 做重计算（解析大文件等），Worker 崩了但界面还挂着——上报后诊断里能看见 worker 行。",
    note: "配合 registerMiniApp.isolation.mode=worker",
  },
  {
    id: "isolation",
    sdkPath: "registerMiniApp.isolation",
    label: "轻量隔离声明",
    status: "live",
    description:
      "sidecar-tools / iframe / worker 声明；诊断「隔离配置」可见；sidecar 走 host.tools.run。",
    scenario:
      "用户或 AI 问「这个 App 的重活在哪跑、会不会拖垮界面」——声明后诊断一行就能看懂（sidecar / iframe / worker）。",
    note: "声明索引，非运行时开关",
  },
];

export const HOST_SDK_PLANNED_SURFACES: readonly HostSdkSurfaceEntry[] = [
  {
    id: "ui.customizeActionLayout",
    sdkPath: "host.ui.customizeActionLayout",
    label: "编辑动作布局",
    status: "planned",
    description: "打开宿主「编辑布局」sheet，与消息 footer / 侧栏同源，禁止自造第二套编辑器。",
  },
  {
    id: "sync",
    sdkPath: "host.sync",
    label: "跨端实时同步",
    status: "planned",
    description: "app_sync 频道 publish/subscribe，多端即时合并状态（如反馈旁观）。",
  },
  {
    id: "storage",
    sdkPath: "host.storage",
    label: "数据根读写",
    status: "planned",
    description: "$AGNX_HOME/apps/data/<appId> 下 JSON / 文件；大对象与业务缓存。",
  },
  {
    id: "android",
    sdkPath: "host.android",
    label: "Android Host",
    status: "planned",
    description: "桌面 ADB 设备发现、会话与帧流；见 Android Host Services 合同。",
  },
  {
    id: "miniAppStatic",
    sdkPath: "host.miniAppStatic",
    label: "静态包入口",
    status: "planned",
    description: "解析包内 dist/game 等静态资源 URL（Electron / daemon HTTP）。",
  },
];

export function countHostSdkSurfaces(): { live: number; planned: number } {
  return {
    live: HOST_SDK_LIVE_SURFACES.length,
    planned: HOST_SDK_PLANNED_SURFACES.length,
  };
}
