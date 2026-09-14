// 场景：Host SDK 指南 — 各能力最小可复制代码示例。
export const HOST_SDK_CODE_SAMPLES: Record<string, string> = {
  "ui.notification": `await host.ui.notification.show({
  title: "保存成功",
  message: "可选副文案",
  kind: "success", // success | info | warning | error
});`,
  "ui.progress": `const handle = host.ui.progress.create({
  title: "同步中",
  message: "可选",
  total: 100, // 省略则为不确定进度
  cancellable: true,
  appId: "your.app.id",
});
handle.report({ value: 42, message: "处理中…" });
handle.end({ kind: "success", message: "完成" });`,
  "ui.brandLoader": `const Panel = host.ui.BrandLogoLoaderPanel as ComponentType<{
  title?: string;
  description?: string;
  testID?: string;
}>;

// 左右布局：导航切换后内容区 loading
return loading ? (
  <Panel title="加载中…" testID="my-content-loading" />
) : <MyContent />;`,
  "ui.confirmRisk": `const { confirmed } = await host.ui.confirmRisk({
  title: "确认删除",
  message: "此操作不可撤销",
  kind: "warning",
  checkboxLabel: "不再询问",
});
if (!confirmed) return;`,
  config: `await host.config.set({
  scope: "app",
  appId: "your.app.id",
  key: "prefs.theme",
  value: "dark",
});
const theme = await host.config.get({
  scope: "app",
  appId: "your.app.id",
  key: "prefs.theme",
  defaultValue: "system",
});
const keys = await host.config.listKeys({
  scope: "app",
  appId: "your.app.id",
});
// keys → ["prefs.theme", ...]（目录下已有的 *.json 文件名）
await host.config.delete({
  scope: "app",
  appId: "your.app.id",
  key: "prefs.theme",
});
// 文件不存在也视为成功；会发 sync ping`,
  "tools.run": `const result = await host.tools.run({
  appId: "your.app.id",
  tool: "tools/my-sidecar.mjs",
  args: ["--flag"],
});
// stderr 行 PROGRESS:... 会流式反映到顶栏进度`,
  lifecycle: `if (host.lifecycle.isHostReady()) {
  void bootstrap();
}
host.lifecycle.onHostReady(() => void bootstrap());`,
  tabs: `host.tabs.onFocus((e) => {
  if (e.appId === "your.app.id") resumeWork();
});`,
  background: `host.background.requestRetain({
  appId: "your.app.id",
  active: true,
  reason: "audio-playback",
});`,
  agentTools: `host.registerAgentTools({
  appId: "your.app.id",
  availability: "tab-open",
  tools: [{
    name: "my_tool",
    description: "…",
    inputSchema: { type: "object", properties: {} },
    execute: async (raw) => ({ ok: true }),
  }],
});`,
  events: `const recent = host.events.readRecent({
  appId: "your.app.id",
  limit: 20,
});
const matrix = host.events.matrix();
host.events.subscribe(() => {
  console.log(host.events.readRecent({ limit: 5 }));
});`,
  "worker.observe": `host.worker.observe({
  type: "spawn", // spawn | terminate | error | message
  summary: "parse-worker started",
  detail: "optional-id",
});`,
  isolation: `host.registerMiniApp({
  id: "main-panel",
  appId: "your.app.id",
  title: "My App",
  component: MyPanel,
  isolation: {
    mode: "sidecar-tools", // none | sidecar-tools | iframe | worker
    sidecarTools: ["tools/my-sidecar.mjs"],
    note: "给人看的说明，诊断可见",
  },
  iframeShortcutCapture: true, // mode=iframe 时建议开启
});`,
};

export function getHostSdkCodeSample(id: string): string | undefined {
  return HOST_SDK_CODE_SAMPLES[id];
}
