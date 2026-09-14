var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  HOST_SANDBOX_APP_ID: () => HOST_SANDBOX_APP_ID,
  HOST_SANDBOX_COMMAND_OPEN: () => HOST_SANDBOX_COMMAND_OPEN,
  HOST_SANDBOX_PANEL_ID: () => HOST_SANDBOX_PANEL_ID,
  HostSandboxPanel: () => HostSandboxPanel,
  activate: () => activate,
  appId: () => appId,
  default: () => index_default,
  invokeHostSandboxPing: () => invokeHostSandboxPing
});
module.exports = __toCommonJS(index_exports);
var import_lucide_react_native = require("lucide-react-native");

// src/constants.ts
var HOST_SANDBOX_APP_ID = "sandbox";
var HOST_SANDBOX_PANEL_ID = "host-sandbox.main";
var HOST_SANDBOX_COMMAND_OPEN = "host-sandbox.open";

// src/agent-tools.ts
async function invokeHostSandboxPing(host, input) {
  const echo = input.message?.trim() || "pong";
  if (input.notify) {
    await host.ui.notification.show({
      title: "Agent \u63A2\u9488",
      message: echo,
      kind: "info"
    });
  }
  return { ok: true, echo };
}
function registerHostSandboxAgentTools(host) {
  return host.registerAgentTools({
    appId: HOST_SANDBOX_APP_ID,
    availability: "always",
    tools: [
      {
        name: "host_sandbox_ping",
        description: "Host \u6C99\u76D2\u63A2\u9488\uFF1A\u56DE\u663E message\uFF0C\u53EF\u9009 notify \u89E6\u53D1 notification",
        inputSchema: {
          type: "object",
          properties: {
            message: { type: "string" },
            notify: { type: "boolean" }
          },
          additionalProperties: false
        },
        execute: async (raw) => invokeHostSandboxPing(host, raw ?? {})
      }
    ]
  });
}

// src/sandbox-host-binding.ts
var boundHost = null;
function bindHostSandboxHost(host) {
  boundHost = host;
}
function peekHostSandboxHost() {
  return boundHost;
}
function requireHostSandboxHost() {
  if (!boundHost) {
    throw new Error("Host SDK \u6307\u5357\u5C1A\u672A bind host");
  }
  return boundHost;
}

// src/sandbox-panel.tsx
var import_react2 = require("react");
var import_react_native2 = require("react-native");
var import_react_native_unistyles2 = require("react-native-unistyles");

// src/sandbox-event-log.ts
var sequence = 0;
var lines = [];
var listeners = /* @__PURE__ */ new Set();
function emit() {
  for (const listener of listeners) {
    listener();
  }
}
function nextId() {
  sequence += 1;
  return `log-${sequence}`;
}
function subscribeHostSandboxEventLog(listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
function readHostSandboxEventLog(limit = 12) {
  return lines.slice(-limit);
}
function appendHostSandboxEventLog(text, kind = "info") {
  lines = [
    ...lines,
    {
      id: nextId(),
      at: Date.now(),
      text,
      kind
    }
  ].slice(-40);
  emit();
}
function clearHostSandboxEventLog() {
  lines = [];
  emit();
}
function formatHostSandboxLogTime(at) {
  return new Date(at).toLocaleTimeString(void 0, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}

// src/sdk-surface-catalog.ts
var HOST_SDK_HERO = {
  title: "Host SDK \u6307\u5357",
  subtitle: "\u9762\u5411\u5B50\u5E94\u7528\u5F00\u53D1\u8005",
  body: "\u5F00\u53D1\u7B2C\u4E09\u65B9\u6216 first-party \u5B50\u5E94\u7528\u65F6\uFF0C\u901A\u8FC7\u672C\u9875\u4E86\u89E3 Agnx \u5BBF\u4E3B\u5DF2\u66B4\u9732\u7684 WorkspaceAppHostApi \u80FD\u529B\u3002\u6BCF\u4E2A\u5361\u7247\u5BF9\u5E94\u4E00\u6761 SDK \u8DEF\u5F84\uFF1A\u53EF\u70B9\u51FB\u63A2\u9488\u4EB2\u81EA\u9A8C\u8BC1\uFF1B\u8DEF\u7EBF\u56FE\u533A\u4E3A\u5373\u5C06\u5F00\u653E\u7684\u80FD\u529B\u3002"
};
var HOST_SDK_LIVE_SURFACES = [
  {
    id: "ui.notification",
    sdkPath: "host.ui.notification",
    label: "\u8F7B\u91CF\u5168\u5C40\u901A\u77E5",
    status: "live",
    description: "\u77ED\u65F6 toast \u5F0F\u53CD\u9988\uFF1A\u6210\u529F / \u4FE1\u606F / \u8B66\u544A / \u9519\u8BEF\u3002\u7981\u6B62\u81EA\u9020\u7B2C\u4E8C\u5957\u5168\u5C40\u63D0\u793A\u5C42\u3002",
    note: "\u4E0E progress \u5171\u7528\u9876\u680F\u58F3\u5C42\uFF0Csource=notification"
  },
  {
    id: "ui.progress",
    sdkPath: "host.ui.progress",
    label: "\u957F\u4EFB\u52A1\u8FDB\u5EA6",
    status: "live",
    description: "\u4E0D\u786E\u5B9A\u6216\u786E\u5B9A\u8FDB\u5EA6\u3001\u53EF\u53D6\u6D88\u3001\u591A\u4EFB\u52A1\u5E76\u884C\uFF1B\u9002\u5408\u6253\u5305\u3001\u540C\u6B65\u3001\u4E0B\u8F7D\u7B49\u957F\u64CD\u4F5C\u3002",
    note: "\u9876\u680F\u53CD\u9988\u6761 \xB7 source=progress"
  },
  {
    id: "ui.brandLoader",
    sdkPath: "host.ui.BrandLogoLoaderPanel",
    label: "\u54C1\u724C Logo \u626B\u5149",
    status: "live",
    description: "\u9762\u677F\u5185\u5185\u5BB9\u533A loading\uFF08\u5982\u5DE6\u53F3\u5E03\u5C40\u70B9\u5BFC\u822A\u6362\u5185\u5BB9\uFF09\u3002\u4E0E pane \u9996\u5C4F boot \u540C\u6E90\u7EC4\u4EF6\uFF1BPane \u7EA7\u8BF7\u7528 isPanelBootReady\u3002",
    scenario: "\u5DE6\u4FA7\u5BFC\u822A + \u53F3\u4FA7\u5185\u5BB9\u533A\u5207\u6362\u65F6\uFF0C\u5728\u5185\u5BB9\u533A\u663E\u793A\u6A2A\u5411\u626B\u5149\u3002",
    note: "\u53E6\u6709 host.ui.BrandLogoLoader\uFF08\u4EC5\u56FE\u6807\uFF09"
  },
  {
    id: "ui.confirmRisk",
    sdkPath: "host.ui.confirmRisk",
    label: "\u684C\u9762\u98CE\u9669\u786E\u8BA4",
    status: "live",
    description: "\u9AD8\u654F\u64CD\u4F5C\u524D\u7684\u539F\u751F\u786E\u8BA4\u6846\uFF0C\u53EF\u9009 checkbox\u3002\u4EC5\u684C\u9762\u6CE8\u5165\u65F6\u53EF\u7528\u3002"
  },
  {
    id: "config",
    sdkPath: "host.config",
    label: "App \u7EA7\u914D\u7F6E",
    status: "live",
    description: "global / app \u4E24\u7EA7 JSON \u504F\u597D\uFF0C\u5E26 subscribe\u3001listKeys\u3001delete\u3002\u9002\u5408\u8BBE\u7F6E\u9879\u6301\u4E45\u5316\uFF0C\u975E\u4E1A\u52A1\u5927\u6587\u4EF6\u3002"
  },
  {
    id: "tools.run",
    sdkPath: "host.tools.run",
    label: "Sidecar \u5DE5\u5177",
    status: "live",
    description: "\u5728 App \u5305\u5185 tools/ \u767D\u540D\u5355\u811A\u672C\uFF0C\u7531\u684C\u9762\u4E3B\u8FDB\u7A0B spawn\uFF1Bstderr PROGRESS: \u53EF\u6D41\u5F0F\u4E0A\u62A5\u3002",
    note: "\u4EC5 Electron"
  },
  {
    id: "lifecycle",
    sdkPath: "host.lifecycle",
    label: "\u5BBF\u4E3B\u751F\u547D\u5468\u671F",
    status: "live",
    description: "HostReady\u3001\u51B7\u6062\u590D\u3001suspend / resume\u3002\u7528\u4E8E\u5728\u5BBF\u4E3B\u5C31\u7EEA\u540E\u518D\u62C9\u6570\u636E\u3002"
  },
  {
    id: "tabs",
    sdkPath: "host.tabs",
    label: "Tab \u751F\u547D\u5468\u671F",
    status: "live",
    description: "open / close / focus / blur / visible\u3002\u4E0E\u5E03\u5C40\u69FD\u4F4D\u53EF\u80FD\u4E0D\u540C\u6B65\uFF08LRU keep-alive\uFF09\u3002"
  },
  {
    id: "background",
    sdkPath: "host.background",
    label: "\u540E\u53F0\u9489\u4F4F",
    status: "live",
    description: "requestRetain \u907F\u514D Sub App Tab \u88AB LRU \u5378\u8F7D\uFF1BregisterSession \u58F0\u660E\u957F\u4F1A\u8BDD\u6062\u590D\u3002"
  },
  {
    id: "agentTools",
    sdkPath: "host.registerAgentTools",
    label: "Agent \u5DE5\u5177",
    status: "live",
    description: "\u5411\u7F16\u7801 Agent \u66B4\u9732\u7ED3\u6784\u5316\u5DE5\u5177\uFF08\u5982 host_sandbox_ping\uFF09\u3002\u4E0E Context VFS \u4E92\u8865\u3002",
    note: "\u5DE5\u5177\u540D host_sandbox_ping"
  },
  {
    id: "events",
    sdkPath: "host.events",
    label: "\u7EDF\u4E00\u4E8B\u4EF6\u89C2\u6D4B",
    status: "live",
    description: "\u53EA\u8BFB\u73AF\u7F13\u51B2 + \u4E8B\u4EF6\u77E9\u9635\uFF1B\u8BCA\u65AD\u4E0E\u6392\u969C\u7528\uFF0C\u4E0D\u66FF\u4EE3\u5404\u57DF subscribe API\u3002",
    scenario: "\u5B50\u5E94\u7528\u300C\u597D\u50CF\u6CA1\u53CD\u5E94\u3001\u540C\u6B65\u5931\u8D25\u3001\u4E0D\u77E5\u9053\u5BBF\u4E3B\u6709\u6CA1\u6709\u6536\u5230\u64CD\u4F5C\u300D\u65F6\u2014\u2014\u8BFB\u8FD9\u91CC\u6216\u53BB\u547D\u4EE4\u9762\u677F\u300C\u8BCA\u65AD\u300D\u2192 Host \u89C2\u6D4B\uFF0C\u590D\u5236\u7ED9 AI\u3002",
    note: "readRecent / subscribe / matrix"
  },
  {
    id: "worker.observe",
    sdkPath: "host.worker.observe",
    label: "Worker \u89C2\u6D4B",
    status: "live",
    description: "Web Worker spawn/terminate/error \u65F6 opt-in \u4E0A\u62A5\uFF1B\u5BBF\u4E3B\u4E0D\u4EE3\u4E3A spawn\u3002",
    scenario: "App \u91CC\u7528 Worker \u505A\u91CD\u8BA1\u7B97\uFF08\u89E3\u6790\u5927\u6587\u4EF6\u7B49\uFF09\uFF0CWorker \u5D29\u4E86\u4F46\u754C\u9762\u8FD8\u6302\u7740\u2014\u2014\u4E0A\u62A5\u540E\u8BCA\u65AD\u91CC\u80FD\u770B\u89C1 worker \u884C\u3002",
    note: "\u914D\u5408 registerMiniApp.isolation.mode=worker"
  },
  {
    id: "isolation",
    sdkPath: "registerMiniApp.isolation",
    label: "\u8F7B\u91CF\u9694\u79BB\u58F0\u660E",
    status: "live",
    description: "sidecar-tools / iframe / worker \u58F0\u660E\uFF1B\u8BCA\u65AD\u300C\u9694\u79BB\u914D\u7F6E\u300D\u53EF\u89C1\uFF1Bsidecar \u8D70 host.tools.run\u3002",
    scenario: "\u7528\u6237\u6216 AI \u95EE\u300C\u8FD9\u4E2A App \u7684\u91CD\u6D3B\u5728\u54EA\u8DD1\u3001\u4F1A\u4E0D\u4F1A\u62D6\u57AE\u754C\u9762\u300D\u2014\u2014\u58F0\u660E\u540E\u8BCA\u65AD\u4E00\u884C\u5C31\u80FD\u770B\u61C2\uFF08sidecar / iframe / worker\uFF09\u3002",
    note: "\u58F0\u660E\u7D22\u5F15\uFF0C\u975E\u8FD0\u884C\u65F6\u5F00\u5173"
  }
];
var HOST_SDK_PLANNED_SURFACES = [
  {
    id: "ui.customizeActionLayout",
    sdkPath: "host.ui.customizeActionLayout",
    label: "\u7F16\u8F91\u52A8\u4F5C\u5E03\u5C40",
    status: "planned",
    description: "\u6253\u5F00\u5BBF\u4E3B\u300C\u7F16\u8F91\u5E03\u5C40\u300Dsheet\uFF0C\u4E0E\u6D88\u606F footer / \u4FA7\u680F\u540C\u6E90\uFF0C\u7981\u6B62\u81EA\u9020\u7B2C\u4E8C\u5957\u7F16\u8F91\u5668\u3002"
  },
  {
    id: "sync",
    sdkPath: "host.sync",
    label: "\u8DE8\u7AEF\u5B9E\u65F6\u540C\u6B65",
    status: "planned",
    description: "app_sync \u9891\u9053 publish/subscribe\uFF0C\u591A\u7AEF\u5373\u65F6\u5408\u5E76\u72B6\u6001\uFF08\u5982\u53CD\u9988\u65C1\u89C2\uFF09\u3002"
  },
  {
    id: "storage",
    sdkPath: "host.storage",
    label: "\u6570\u636E\u6839\u8BFB\u5199",
    status: "planned",
    description: "$AGNX_HOME/apps/data/<appId> \u4E0B JSON / \u6587\u4EF6\uFF1B\u5927\u5BF9\u8C61\u4E0E\u4E1A\u52A1\u7F13\u5B58\u3002"
  },
  {
    id: "android",
    sdkPath: "host.android",
    label: "Android Host",
    status: "planned",
    description: "\u684C\u9762 ADB \u8BBE\u5907\u53D1\u73B0\u3001\u4F1A\u8BDD\u4E0E\u5E27\u6D41\uFF1B\u89C1 Android Host Services \u5408\u540C\u3002"
  },
  {
    id: "miniAppStatic",
    sdkPath: "host.miniAppStatic",
    label: "\u9759\u6001\u5305\u5165\u53E3",
    status: "planned",
    description: "\u89E3\u6790\u5305\u5185 dist/game \u7B49\u9759\u6001\u8D44\u6E90 URL\uFF08Electron / daemon HTTP\uFF09\u3002"
  }
];

// src/sdk-code-samples.ts
var HOST_SDK_CODE_SAMPLES = {
  "ui.notification": `await host.ui.notification.show({
  title: "\u4FDD\u5B58\u6210\u529F",
  message: "\u53EF\u9009\u526F\u6587\u6848",
  kind: "success", // success | info | warning | error
});`,
  "ui.progress": `const handle = host.ui.progress.create({
  title: "\u540C\u6B65\u4E2D",
  message: "\u53EF\u9009",
  total: 100, // \u7701\u7565\u5219\u4E3A\u4E0D\u786E\u5B9A\u8FDB\u5EA6
  cancellable: true,
  appId: "your.app.id",
});
handle.report({ value: 42, message: "\u5904\u7406\u4E2D\u2026" });
handle.end({ kind: "success", message: "\u5B8C\u6210" });`,
  "ui.brandLoader": `const Panel = host.ui.BrandLogoLoaderPanel as ComponentType<{
  title?: string;
  description?: string;
  testID?: string;
}>;

// \u5DE6\u53F3\u5E03\u5C40\uFF1A\u5BFC\u822A\u5207\u6362\u540E\u5185\u5BB9\u533A loading
return loading ? (
  <Panel title="\u52A0\u8F7D\u4E2D\u2026" testID="my-content-loading" />
) : <MyContent />;`,
  "ui.confirmRisk": `const { confirmed } = await host.ui.confirmRisk({
  title: "\u786E\u8BA4\u5220\u9664",
  message: "\u6B64\u64CD\u4F5C\u4E0D\u53EF\u64A4\u9500",
  kind: "warning",
  checkboxLabel: "\u4E0D\u518D\u8BE2\u95EE",
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
// keys \u2192 ["prefs.theme", ...]\uFF08\u76EE\u5F55\u4E0B\u5DF2\u6709\u7684 *.json \u6587\u4EF6\u540D\uFF09
await host.config.delete({
  scope: "app",
  appId: "your.app.id",
  key: "prefs.theme",
});
// \u6587\u4EF6\u4E0D\u5B58\u5728\u4E5F\u89C6\u4E3A\u6210\u529F\uFF1B\u4F1A\u53D1 sync ping`,
  "tools.run": `const result = await host.tools.run({
  appId: "your.app.id",
  tool: "tools/my-sidecar.mjs",
  args: ["--flag"],
});
// stderr \u884C PROGRESS:... \u4F1A\u6D41\u5F0F\u53CD\u6620\u5230\u9876\u680F\u8FDB\u5EA6`,
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
    description: "\u2026",
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
    note: "\u7ED9\u4EBA\u770B\u7684\u8BF4\u660E\uFF0C\u8BCA\u65AD\u53EF\u89C1",
  },
  iframeShortcutCapture: true, // mode=iframe \u65F6\u5EFA\u8BAE\u5F00\u542F
});`
};
function getHostSdkCodeSample(id) {
  return HOST_SDK_CODE_SAMPLES[id];
}

// src/json-parse-worker.ts
var WORKER_SOURCE = `
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
function postToWorker(worker, payload) {
  worker.postMessage(payload);
}
async function runHostSandboxJsonParseWorker(host, payloadJson) {
  if (typeof Worker === "undefined" || typeof URL === "undefined" || typeof Blob === "undefined") {
    host.worker.observe({
      type: "error",
      summary: "Web Worker \u4E0D\u53EF\u7528\uFF08\u5F53\u524D\u5E73\u53F0\uFF09"
    });
    return { ok: false, summary: "\u5F53\u524D\u5E73\u53F0\u65E0 Web Worker" };
  }
  const blob = new Blob([WORKER_SOURCE], { type: "application/javascript" });
  const url = URL.createObjectURL(blob);
  host.worker.observe({
    type: "spawn",
    summary: "json-parse-worker started",
    detail: url.slice(0, 48)
  });
  try {
    const result = await new Promise(
      (resolve, reject) => {
        const worker = new Worker(url);
        const timer = setTimeout(() => {
          worker.terminate();
          reject(new Error("worker timeout"));
        }, 5e3);
        worker.addEventListener("message", (event) => {
          clearTimeout(timer);
          worker.terminate();
          resolve(event.data);
        });
        worker.addEventListener("error", (event) => {
          clearTimeout(timer);
          worker.terminate();
          reject(event.error ?? new Error(event.message || "worker error"));
        });
        postToWorker(worker, payloadJson);
      }
    );
    if (!result.ok) {
      host.worker.observe({
        type: "error",
        summary: `json-parse-worker failed: ${result.error ?? "unknown"}`
      });
      return { ok: false, summary: result.error ?? "parse failed" };
    }
    host.worker.observe({
      type: "terminate",
      summary: `json-parse-worker done \xB7 ${result.count ?? 0} keys/items`
    });
    return { ok: true, summary: `\u89E3\u6790\u5B8C\u6210 \xB7 ${result.count ?? 0} \u9879` };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    host.worker.observe({
      type: "error",
      summary: `json-parse-worker throw: ${message}`
    });
    return { ok: false, summary: message };
  } finally {
    URL.revokeObjectURL(url);
  }
}

// src/sandbox-runtime.ts
var boundHost2 = null;
var retainActive = false;
var lastLifecycleLine = "\uFF08\u5C1A\u65E0\u4E8B\u4EF6\uFF09";
var lastTabLine = "\uFF08\u5C1A\u65E0\u4E8B\u4EF6\uFF09";
var listeners2 = /* @__PURE__ */ new Set();
function emit2() {
  for (const listener of listeners2) {
    listener();
  }
}
function bindHostSandboxRuntime(host) {
  boundHost2 = host;
  const unsubs = [];
  lastLifecycleLine = host.lifecycle.isHostReady() ? "HostReady \u2713" : "\u7B49\u5F85 HostReady\u2026";
  unsubs.push(
    host.lifecycle.onHostReady(() => {
      lastLifecycleLine = `HostReady @ ${(/* @__PURE__ */ new Date()).toLocaleTimeString()}`;
      appendHostSandboxEventLog("lifecycle \xB7 HostReady", "success");
      emit2();
    })
  );
  unsubs.push(
    host.lifecycle.onSuspend(() => {
      lastLifecycleLine = `Suspend @ ${(/* @__PURE__ */ new Date()).toLocaleTimeString()}`;
      appendHostSandboxEventLog("lifecycle \xB7 suspend", "warn");
      emit2();
    })
  );
  unsubs.push(
    host.lifecycle.onResume(() => {
      lastLifecycleLine = `Resume @ ${(/* @__PURE__ */ new Date()).toLocaleTimeString()}`;
      appendHostSandboxEventLog("lifecycle \xB7 resume", "info");
      emit2();
    })
  );
  const tabKinds = ["open", "close", "focus", "blur", "visible"];
  for (const kind of tabKinds) {
    const attach = {
      open: host.tabs.onOpen,
      close: host.tabs.onClose,
      focus: host.tabs.onFocus,
      blur: host.tabs.onBlur,
      visible: host.tabs.onVisibleChange
    }[kind];
    unsubs.push(
      attach((event) => {
        const tabId = event.tabId;
        lastTabLine = `${kind} \xB7 ${tabId} @ ${(/* @__PURE__ */ new Date()).toLocaleTimeString()}`;
        appendHostSandboxEventLog(`tabs \xB7 ${kind} \xB7 ${tabId}`, "info");
        emit2();
      })
    );
  }
  emit2();
  return () => {
    for (const unsub of unsubs) {
      unsub();
    }
    if (boundHost2 === host) {
      boundHost2 = null;
    }
  };
}
function subscribeHostSandboxRuntime(listener) {
  listeners2.add(listener);
  return () => {
    listeners2.delete(listener);
  };
}
function readHostSandboxRuntimeSnapshot() {
  const host = boundHost2;
  return {
    hostReady: host?.lifecycle.isHostReady() ?? false,
    lastLifecycleLine,
    lastTabLine,
    retainActive,
    syncAvailable: Boolean(host?.sync),
    toolsAvailable: Boolean(host?.tools?.run),
    confirmRiskAvailable: Boolean(host?.ui.confirmRisk)
  };
}
function setHostSandboxRetain(active, reason) {
  const host = boundHost2;
  if (!host) {
    return;
  }
  retainActive = active;
  host.background.requestRetain({
    appId: HOST_SANDBOX_APP_ID,
    active,
    reason: reason ?? "host-sandbox-probe"
  });
  emit2();
}

// src/sandbox-ui.tsx
var import_react = require("react");
var import_react_native = require("react-native");
var import_react_native_unistyles = require("react-native-unistyles");
var import_jsx_runtime = require("react/jsx-runtime");
function Flex({
  direction = "row",
  gap = 8,
  wrap = false,
  align = "stretch",
  justify = "flex-start",
  style,
  children,
  testID
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_react_native.View,
    {
      testID,
      style: [
        {
          flexDirection: direction,
          flexWrap: wrap ? "wrap" : "nowrap",
          alignItems: align,
          justifyContent: justify,
          gap
        },
        style
      ],
      children
    }
  );
}
function DocNavItem({
  entry,
  selected,
  onPress
}) {
  const { theme } = (0, import_react_native_unistyles.useUnistyles)();
  const planned = entry.status === "planned";
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_react_native.Pressable,
    {
      accessibilityRole: "button",
      onPress,
      testID: `host-sandbox-nav-${entry.id}`,
      style: [
        styles.navItem,
        {
          backgroundColor: selected ? theme.colors.surface2 : "transparent",
          borderLeftColor: selected ? theme.colors.primary : "transparent",
          opacity: planned ? 0.85 : 1
        }
      ],
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_react_native.Text,
          {
            style: [
              styles.navLabel,
              {
                color: selected ? theme.colors.foreground : theme.colors.foregroundMuted,
                fontWeight: selected ? "600" : "400"
              }
            ],
            numberOfLines: 1,
            children: entry.label
          }
        ),
        planned ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react_native.Text, { style: [styles.navTag, { color: theme.colors.foregroundMuted }], children: "\u5373\u5C06\u63A8\u51FA" }) : null
      ]
    }
  );
}
function DocNavGroup({ title, children }) {
  const { theme } = (0, import_react_native_unistyles.useUnistyles)();
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_react_native.View,
    {
      style: [
        styles.navGroupBox,
        { backgroundColor: theme.colors.surface2, borderColor: theme.colors.border }
      ],
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react_native.Text, { style: [styles.navGroupTitle, { color: theme.colors.foregroundMuted }], children: title }),
        children
      ]
    }
  );
}
function SectionBlock({
  title,
  children,
  testID
}) {
  const { theme } = (0, import_react_native_unistyles.useUnistyles)();
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_react_native.View,
    {
      testID,
      style: [
        styles.sectionBlock,
        { borderColor: theme.colors.border, backgroundColor: theme.colors.surface2 }
      ],
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react_native.Text, { style: [styles.sectionBlockTitle, { color: theme.colors.foreground }], children: title }),
        children
      ]
    }
  );
}
function ScenarioCallout({ children, testID }) {
  const { theme } = (0, import_react_native_unistyles.useUnistyles)();
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_react_native.View,
    {
      testID,
      style: [
        styles.scenarioCallout,
        {
          backgroundColor: theme.colors.surface2,
          borderColor: theme.colors.border
        }
      ],
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react_native.Text, { style: [styles.scenarioCalloutLabel, { color: theme.colors.primary }], children: "\u4EC0\u4E48\u65F6\u5019\u7528" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react_native.Text, { style: [styles.scenarioCalloutBody, { color: theme.colors.foreground }], children })
      ]
    }
  );
}
function DocDetailHeader({
  sdkPath,
  label,
  description,
  scenario,
  planned
}) {
  const { theme } = (0, import_react_native_unistyles.useUnistyles)();
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react_native.View, { style: [styles.detailHeader, { borderBottomColor: theme.colors.border }], children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Flex, { direction: "row", align: "center", gap: 8, wrap: true, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react_native.Text, { style: [styles.detailTitle, { color: theme.colors.foreground }], children: label }),
      planned ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_react_native.View,
        {
          style: [
            styles.badge,
            { borderColor: theme.colors.border, backgroundColor: theme.colors.surface2 }
          ],
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react_native.Text, { style: [styles.badgeText, { color: theme.colors.foregroundMuted }], children: "\u5373\u5C06\u63A8\u51FA" })
        }
      ) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_react_native.View,
        {
          style: [
            styles.badge,
            { borderColor: theme.colors.primary, backgroundColor: theme.colors.surface2 }
          ],
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react_native.Text, { style: [styles.badgeText, { color: theme.colors.primary }], children: "\u53EF\u7528" })
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SdkPathRow, { sdkPath }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react_native.Text, { style: [styles.detailDescription, { color: theme.colors.foregroundMuted }], children: description }),
    scenario ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScenarioCallout, { testID: "host-sandbox-scenario", children: scenario }) : null
  ] });
}
function DemoBox({ children, testID }) {
  const { theme } = (0, import_react_native_unistyles.useUnistyles)();
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_react_native.View,
    {
      testID,
      style: [
        styles.demoBox,
        {
          backgroundColor: theme.colors.surface1,
          borderColor: theme.colors.border
        }
      ],
      children
    }
  );
}
function DemoBoxTitle({ children }) {
  const { theme } = (0, import_react_native_unistyles.useUnistyles)();
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react_native.Text, { style: [styles.demoBoxTitle, { color: theme.colors.foregroundMuted }], children });
}
function ActionChip({
  label,
  testID,
  onPress,
  variant = "default",
  disabled = false
}) {
  const { theme } = (0, import_react_native_unistyles.useUnistyles)();
  const fg = variant === "danger" ? theme.colors.destructive : theme.colors.foreground;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_react_native.Pressable,
    {
      accessibilityRole: "button",
      disabled,
      onPress,
      testID,
      style: [
        styles.chipButton,
        {
          backgroundColor: theme.colors.surface2,
          borderColor: theme.colors.border,
          opacity: disabled ? 0.45 : 1
        }
      ],
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react_native.Text, { style: [styles.chipButtonLabel, { color: fg }], children: label })
    }
  );
}
function InlineHint({ children, testID }) {
  const { theme } = (0, import_react_native_unistyles.useUnistyles)();
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react_native.Text, { style: [styles.inlineHint, { color: theme.colors.foregroundMuted }], testID, children });
}
async function copyToClipboard(text) {
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
  }
  return false;
}
function SdkPathRow({ sdkPath }) {
  const { theme } = (0, import_react_native_unistyles.useUnistyles)();
  const [copied, setCopied] = (0, import_react.useState)(false);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Flex, { direction: "row", align: "center", gap: 8, wrap: true, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react_native.Text, { style: [styles.sdkPath, { color: theme.colors.primary, flex: 1 }], children: sdkPath }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_react_native.Pressable,
      {
        accessibilityRole: "button",
        testID: "host-sandbox-copy-sdk-path",
        onPress: () => {
          void (async () => {
            const ok = await copyToClipboard(sdkPath);
            if (ok) {
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }
          })();
        },
        style: [
          styles.copyButton,
          { borderColor: theme.colors.border, backgroundColor: theme.colors.surface2 }
        ],
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react_native.Text, { style: [styles.copyButtonLabel, { color: theme.colors.foregroundMuted }], children: copied ? "\u5DF2\u590D\u5236" : "\u590D\u5236\u8DEF\u5F84" })
      }
    )
  ] });
}
function CodeBlock({ code, testID }) {
  const { theme } = (0, import_react_native_unistyles.useUnistyles)();
  const [copied, setCopied] = (0, import_react.useState)(false);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_react_native.View,
    {
      testID,
      style: [
        styles.codeBlock,
        { backgroundColor: theme.colors.surface2, borderColor: theme.colors.border }
      ],
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Flex, { direction: "row", justify: "space-between", align: "center", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react_native.Text, { style: [styles.codeBlockTitle, { color: theme.colors.foregroundMuted }], children: "\u7528\u6CD5" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_react_native.Pressable,
            {
              accessibilityRole: "button",
              testID: "host-sandbox-copy-code",
              onPress: () => {
                void (async () => {
                  const ok = await copyToClipboard(code);
                  if (ok) {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  }
                })();
              },
              children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react_native.Text, { style: [styles.copyButtonLabel, { color: theme.colors.primary }], children: copied ? "\u5DF2\u590D\u5236" : "\u590D\u5236\u4EE3\u7801" })
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react_native.Text, { style: [styles.codeText, { color: theme.colors.foreground }], selectable: true, children: code })
      ]
    }
  );
}
function NavSearch({
  value,
  onChange
}) {
  const { theme } = (0, import_react_native_unistyles.useUnistyles)();
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_react_native.TextInput,
    {
      testID: "host-sandbox-nav-search",
      value,
      onChangeText: onChange,
      placeholder: "\u641C\u7D22\u80FD\u529B\u2026",
      placeholderTextColor: theme.colors.foregroundMuted,
      style: [
        styles.searchInput,
        {
          color: theme.colors.foreground,
          backgroundColor: theme.colors.surface2,
          borderColor: theme.colors.border
        }
      ]
    }
  );
}
function logLineColor(kind, colors) {
  if (kind === "error") {
    return colors.destructive;
  }
  if (kind === "warn") {
    return colors.statusWarning;
  }
  if (kind === "success") {
    return colors.primary;
  }
  return colors.foregroundMuted;
}
function EventLogPanel({ lines: lines2 }) {
  const { theme } = (0, import_react_native_unistyles.useUnistyles)();
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react_native.View, { testID: "host-sandbox-event-log", style: styles.eventLogInner, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flex, { direction: "row", justify: "flex-end", align: "center", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_react_native.Pressable,
      {
        accessibilityRole: "button",
        testID: "host-sandbox-event-log-clear",
        onPress: () => clearHostSandboxEventLog(),
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react_native.Text, { style: [styles.copyButtonLabel, { color: theme.colors.foregroundMuted }], children: "\u6E05\u7A7A" })
      }
    ) }),
    lines2.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react_native.Text, { style: [styles.inlineHint, { color: theme.colors.foregroundMuted }], children: "\u63A2\u9488\u4E0E lifecycle \u4E8B\u4EF6\u5C06\u663E\u793A\u5728\u6B64" }) : lines2.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      import_react_native.Text,
      {
        style: [styles.logLine, { color: logLineColor(line.kind, theme.colors) }],
        numberOfLines: 2,
        children: [
          formatHostSandboxLogTime(line.at),
          " \xB7 ",
          line.text
        ]
      },
      line.id
    ))
  ] });
}
function DocOverviewNavItem({
  selected,
  onPress
}) {
  const { theme } = (0, import_react_native_unistyles.useUnistyles)();
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_react_native.View,
    {
      style: [
        styles.navGroupBox,
        {
          backgroundColor: theme.colors.surface2,
          borderColor: theme.colors.border,
          marginBottom: 8
        }
      ],
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_react_native.Pressable,
        {
          accessibilityRole: "button",
          testID: "host-sandbox-nav-overview",
          onPress,
          style: [
            styles.navItem,
            {
              backgroundColor: selected ? theme.colors.surface2 : "transparent",
              borderLeftColor: selected ? theme.colors.primary : "transparent"
            }
          ],
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_react_native.Text,
            {
              style: [
                styles.navLabel,
                {
                  color: selected ? theme.colors.foreground : theme.colors.foregroundMuted,
                  fontWeight: selected ? "600" : "500"
                }
              ],
              children: "\u80FD\u529B\u603B\u89C8"
            }
          )
        }
      )
    }
  );
}
function OverviewTable({
  entries,
  onSelect
}) {
  const { theme } = (0, import_react_native_unistyles.useUnistyles)();
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react_native.View, { testID: "host-sandbox-overview-table", style: styles.overviewTable, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react_native.View, { style: [styles.overviewHeader, { borderBottomColor: theme.colors.border }], children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_react_native.Text,
        {
          style: [
            styles.overviewColPath,
            styles.overviewHead,
            { color: theme.colors.foregroundMuted }
          ],
          children: "SDK \u8DEF\u5F84"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_react_native.Text,
        {
          style: [
            styles.overviewColLabel,
            styles.overviewHead,
            { color: theme.colors.foregroundMuted }
          ],
          children: "\u540D\u79F0"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_react_native.Text,
        {
          style: [
            styles.overviewColStatus,
            styles.overviewHead,
            { color: theme.colors.foregroundMuted }
          ],
          children: "\u72B6\u6001"
        }
      )
    ] }),
    entries.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      import_react_native.Pressable,
      {
        accessibilityRole: "button",
        testID: `host-sandbox-overview-row-${entry.id}`,
        onPress: () => onSelect(entry.id),
        style: [styles.overviewRow, { borderBottomColor: theme.colors.border }],
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_react_native.Text,
            {
              style: [styles.overviewColPath, styles.overviewPath, { color: theme.colors.primary }],
              numberOfLines: 1,
              children: entry.sdkPath
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_react_native.Text,
            {
              style: [styles.overviewColLabel, { color: theme.colors.foreground }],
              numberOfLines: 1,
              children: entry.label
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_react_native.Text,
            {
              style: [
                styles.overviewColStatus,
                {
                  color: entry.status === "live" ? theme.colors.primary : theme.colors.foregroundMuted
                }
              ],
              children: entry.status === "live" ? "\u53EF\u7528" : "\u5373\u5C06\u63A8\u51FA"
            }
          )
        ]
      },
      entry.id
    ))
  ] });
}
var styles = import_react_native_unistyles.StyleSheet.create((theme) => ({
  navGroupBox: {
    marginHorizontal: 6,
    marginBottom: 8,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    paddingBottom: 4,
    overflow: "hidden"
  },
  navGroup: {
    gap: 2,
    marginBottom: 10
  },
  navGroupTitle: {
    fontSize: theme.fontSize.xs,
    fontWeight: "700",
    letterSpacing: 0.4,
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 4,
    textTransform: "uppercase"
  },
  navItem: {
    paddingVertical: 7,
    paddingHorizontal: 8,
    paddingLeft: 10,
    borderLeftWidth: 3,
    gap: 2,
    marginHorizontal: 4,
    borderRadius: theme.borderRadius.base
  },
  navLabel: {
    fontSize: theme.fontSize.sm
  },
  navTag: {
    fontSize: theme.fontSize.xs
  },
  detailHeader: {
    gap: 8,
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: 1
  },
  detailTitle: {
    fontSize: theme.fontSize.base,
    fontWeight: "700"
  },
  sdkPath: {
    fontSize: theme.fontSize.sm,
    fontFamily: "monospace",
    fontWeight: "500"
  },
  detailDescription: {
    fontSize: theme.fontSize.sm,
    lineHeight: theme.fontSize.sm + 8
  },
  scenarioCallout: {
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    padding: 10,
    gap: 4,
    marginTop: 4
  },
  scenarioCalloutLabel: {
    fontSize: theme.fontSize.xs,
    fontWeight: "700"
  },
  scenarioCalloutBody: {
    fontSize: theme.fontSize.sm,
    lineHeight: theme.fontSize.sm + 6
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1
  },
  badgeText: {
    fontSize: theme.fontSize.xs,
    fontWeight: "600"
  },
  demoBox: {
    borderWidth: 1,
    borderRadius: theme.borderRadius.lg,
    padding: 14,
    gap: 10
  },
  demoBoxTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: "600"
  },
  chipButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.base,
    borderWidth: 1
  },
  chipButtonLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: "500"
  },
  inlineHint: {
    fontSize: theme.fontSize.sm,
    lineHeight: theme.fontSize.sm + 6
  },
  copyButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.base,
    borderWidth: 1
  },
  copyButtonLabel: {
    fontSize: theme.fontSize.xs,
    fontWeight: "500"
  },
  codeBlock: {
    borderWidth: 1,
    borderRadius: theme.borderRadius.lg,
    padding: 12,
    gap: 8
  },
  codeBlockTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: "600"
  },
  codeText: {
    fontSize: theme.fontSize.sm,
    lineHeight: theme.fontSize.sm + 4,
    fontFamily: "monospace"
  },
  searchInput: {
    fontSize: theme.fontSize.sm,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.base,
    borderWidth: 1,
    marginHorizontal: 6,
    marginBottom: 8
  },
  sectionBlock: {
    borderWidth: 1,
    borderRadius: theme.borderRadius.lg,
    padding: 14,
    gap: 10,
    marginBottom: 12
  },
  sectionBlockTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: "700",
    letterSpacing: 0.2
  },
  eventLogInner: {
    gap: 6
  },
  logLine: {
    fontSize: theme.fontSize.sm,
    lineHeight: theme.fontSize.sm + 4,
    fontFamily: "monospace"
  },
  overviewTable: {
    width: "100%",
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    overflow: "hidden"
  },
  overviewHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 8
  },
  overviewRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 8,
    borderBottomWidth: 1
  },
  overviewHead: {
    fontSize: theme.fontSize.xs,
    fontWeight: "600",
    textTransform: "uppercase"
  },
  overviewColPath: {
    flex: 2,
    fontSize: theme.fontSize.sm
  },
  overviewColLabel: {
    flex: 1.2,
    fontSize: theme.fontSize.sm
  },
  overviewColStatus: {
    width: 64,
    fontSize: theme.fontSize.sm,
    fontWeight: "500"
  },
  overviewPath: {
    fontFamily: "monospace"
  }
}));

// src/sandbox-panel.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
var CONFIG_COUNTER_KEY = "host-sandbox.counter";
var CONFIG_EXAMPLE_KEY = "host-sandbox.example";
var OVERVIEW_ID = "__overview__";
var COMPACT_BREAKPOINT = 720;
var NAV_GROUPS = [
  { title: "host.ui", entries: HOST_SDK_LIVE_SURFACES.filter((e) => e.id.startsWith("ui.")) },
  {
    title: "\u6570\u636E\u4E0E\u5DE5\u5177",
    entries: HOST_SDK_LIVE_SURFACES.filter(
      (e) => ["config", "tools.run", "agentTools"].includes(e.id)
    )
  },
  {
    title: "\u751F\u547D\u5468\u671F",
    entries: HOST_SDK_LIVE_SURFACES.filter(
      (e) => ["lifecycle", "tabs", "background"].includes(e.id)
    )
  },
  {
    title: "\u89C2\u6D4B\u4E0E\u9694\u79BB",
    entries: HOST_SDK_LIVE_SURFACES.filter(
      (e) => ["events", "worker.observe", "isolation"].includes(e.id)
    )
  },
  { title: "\u8DEF\u7EBF\u56FE", entries: HOST_SDK_PLANNED_SURFACES }
];
function HostSandboxBrandLoaderDemo() {
  const { theme } = (0, import_react_native_unistyles2.useUnistyles)();
  const [activeNav, setActiveNav] = (0, import_react2.useState)("a");
  const [loading, setLoading] = (0, import_react2.useState)(false);
  const Panel = getHost().ui.BrandLogoLoaderPanel;
  const switchNav = (0, import_react2.useCallback)(
    (next) => {
      if (next === activeNav) {
        return;
      }
      setLoading(true);
      setActiveNav(next);
      window.setTimeout(() => setLoading(false), 1200);
    },
    [activeNav]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(DemoBox, { testID: "host-sandbox-demo-brand-loader", children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(DemoBoxTitle, { children: "\u5DE6\u53F3\u5E03\u5C40 \xB7 \u5185\u5BB9\u533A\u626B\u5149" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_react_native2.View, { style: brandLoaderDemoStyles.row, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_react_native2.View, { style: brandLoaderDemoStyles.nav, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          ActionChip,
          {
            label: "\u5BFC\u822A A",
            testID: "host-sandbox-brand-nav-a",
            onPress: () => switchNav("a")
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          ActionChip,
          {
            label: "\u5BFC\u822A B",
            testID: "host-sandbox-brand-nav-b",
            onPress: () => switchNav("b")
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react_native2.View, { style: [brandLoaderDemoStyles.content, { borderColor: theme.colors.borderAccent }], children: loading ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Panel, { title: "\u52A0\u8F7D\u5185\u5BB9\u2026", testID: "host-sandbox-brand-content-loading" }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_react_native2.Text, { style: { color: theme.colors.foreground }, children: [
        "\u5F53\u524D\uFF1A",
        activeNav === "a" ? "\u5185\u5BB9 A" : "\u5185\u5BB9 B"
      ] }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(InlineHint, { children: "\u70B9\u53E6\u4E00\u4FA7\u5BFC\u822A\uFF0C\u53F3\u4FA7\u7EA6 1.2s \u626B\u5149\u540E\u663E\u793A\u5185\u5BB9" })
  ] });
}
var brandLoaderDemoStyles = import_react_native_unistyles2.StyleSheet.create((theme) => ({
  row: {
    flexDirection: "row",
    minHeight: 200,
    gap: theme.spacing[3]
  },
  nav: {
    width: 120,
    gap: theme.spacing[2],
    paddingVertical: theme.spacing[2]
  },
  content: {
    flex: 1,
    minHeight: 200,
    borderWidth: theme.borderWidth[1],
    borderRadius: theme.borderRadius.md,
    overflow: "hidden"
  }
}));
function getHost() {
  return requireHostSandboxHost();
}
function HostSandboxEventsDemo(input) {
  const [hint, setHint] = (0, import_react2.useState)("");
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(DemoBox, { testID: "host-sandbox-demo-events", children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(DemoBoxTitle, { children: "\u8BD5\u4E00\u8BD5" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Flex, { direction: "row", wrap: true, gap: 8, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      ActionChip,
      {
        label: "\u8BFB\u53D6\u6700\u8FD1 5 \u6761",
        testID: "host-sandbox-events-refresh",
        onPress: () => {
          const rows = getHost().events.readRecent({
            appId: HOST_SANDBOX_APP_ID,
            limit: 5
          });
          const preview = rows.length > 0 ? rows.map((row) => `${row.domain}/${row.type}`).join(" \xB7 ") : "\uFF08\u6682\u65E0\uFF09";
          setHint(`\u8BFB\u5230 ${rows.length} \u6761\uFF1A${preview}`);
          appendHostSandboxEventLog(`events.readRecent \xB7 ${rows.length} \u6761`, "info");
          input.setLogTick((v) => v + 1);
        }
      }
    ) }),
    hint ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(InlineHint, { testID: "host-sandbox-events-hint", children: hint }) : null,
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(InlineHint, { children: "\u6392\u67E5\u6B65\u9AA4\uFF1A\u547D\u4EE4\u9762\u677F\u641C\u300C\u8BCA\u65AD\u300D\u2192 \u6253\u5F00\u672C App \u2192 Host \u89C2\u6D4B\uFF08\u77E9\u9635\u5728\u4E0A\u3001\u4E8B\u4EF6\u5728\u4E0B\uFF09\u2192 \u70B9\u300C\u590D\u5236\u300D\u8D34\u7ED9 AI\u3002" })
  ] });
}
function HostSandboxWorkerDemo(input) {
  const report = (type, summary) => {
    getHost().worker.observe({ type, summary });
    appendHostSandboxEventLog(`worker.observe \xB7 ${type}`, type === "error" ? "error" : "success");
    input.setLogTick((v) => v + 1);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(DemoBox, { testID: "host-sandbox-demo-worker", children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(DemoBoxTitle, { children: "\u771F\u5B9E Worker\uFF1A\u5728\u540E\u53F0\u7EBF\u7A0B\u89E3\u6790\u4E00\u6BB5 JSON" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Flex, { direction: "row", wrap: true, gap: 8, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      ActionChip,
      {
        label: "\u8DD1\u771F\u5B9E JSON Worker",
        testID: "host-sandbox-worker-real",
        onPress: () => {
          void (async () => {
            const payload = JSON.stringify(
              Array.from({ length: 200 }, (_, index) => ({ id: index, name: `item-${index}` }))
            );
            const result = await runHostSandboxJsonParseWorker(getHost(), payload);
            appendHostSandboxEventLog(
              `worker.real \xB7 ${result.summary}`,
              result.ok ? "success" : "error"
            );
            input.setLogTick((v) => v + 1);
          })();
        }
      }
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(DemoBoxTitle, { children: "\u4EC5\u5199\u5165\u89C2\u6D4B\uFF08\u4E0D\u542F\u7EBF\u7A0B\uFF0C\u65B9\u4FBF\u5BF9\u7167\uFF09" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(Flex, { direction: "row", wrap: true, gap: 8, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        ActionChip,
        {
          label: "\u6A21\u62DF\uFF1AWorker \u542F\u52A8",
          testID: "host-sandbox-worker-spawn",
          onPress: () => report("spawn", "demo-parse-worker started")
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        ActionChip,
        {
          label: "\u6A21\u62DF\uFF1AWorker \u7ED3\u675F",
          testID: "host-sandbox-worker-terminate",
          onPress: () => report("terminate", "demo-parse-worker stopped")
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        ActionChip,
        {
          label: "\u6A21\u62DF\uFF1AWorker \u62A5\u9519",
          testID: "host-sandbox-worker-error",
          variant: "danger",
          onPress: () => report("error", "demo-parse-worker OOM")
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(InlineHint, { children: "\u70B9\u300C\u8DD1\u771F\u5B9E JSON Worker\u300D\u540E\uFF0C\u53BB\u300C\u8BCA\u65AD \u2192 Host \u89C2\u6D4B / \u9694\u79BB\u914D\u7F6E\u300D\u5E94\u80FD\u770B\u5230 worker \u884C\uFF1B\u590D\u5236\u6574\u6BB5\u7ED9 AI \u5373\u53EF\u3002" })
  ] });
}
function HostSandboxIsolationDemo() {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(DemoBox, { testID: "host-sandbox-demo-isolation", children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(DemoBoxTitle, { children: "\u5DF2\u63A5\u5165\u793A\u4F8B\uFF08\u6253\u5F00\u5BF9\u5E94 App \u7684\u300C\u8BCA\u65AD\u300D\u67E5\u770B\uFF09" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(Flex, { direction: "column", gap: 6, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(InlineHint, { children: "\xB7 Host SDK \u6307\u5357 \u2192 worker\uFF08\u771F\u5B9E JSON Worker \u6F14\u793A\uFF09" }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(InlineHint, { children: "\xB7 \u7CFB\u7EDF\u6D1E\u5BDF / \u5FAE\u4FE1\u6536\u85CF \u2192 sidecar\uFF08\u540E\u53F0\u5DE5\u5177\u8DD1\u91CD\u6D3B\uFF09" }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(InlineHint, { children: "\xB7 Screen Toys / \u724C\u5B97 \u2192 iframe\uFF08\u5185\u5D4C\u7F51\u9875 + \u5FEB\u6377\u952E\u8F6C\u53D1\uFF09" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(InlineHint, { children: "\u5F00\u53D1\u8005\uFF1A\u5728 registerMiniApp \u91CC\u52A0 isolation \u5B57\u6BB5\uFF1B\u7528\u6237\u53EA\u9700\u77E5\u9053\u300C\u8BCA\u65AD \u2192 \u9694\u79BB\u914D\u7F6E\u300D\u90A3\u4E00\u884C\u3002" })
  ] });
}
function HostSandboxObservationDemoSection(input) {
  if (input.entryId === "events") {
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(HostSandboxEventsDemo, { setLogTick: input.setLogTick });
  }
  if (input.entryId === "worker.observe") {
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(HostSandboxWorkerDemo, { setLogTick: input.setLogTick });
  }
  if (input.entryId === "isolation") {
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(HostSandboxIsolationDemo, {});
  }
  return null;
}
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
function findEntry(id) {
  if (id === OVERVIEW_ID) {
    return void 0;
  }
  return [...HOST_SDK_LIVE_SURFACES, ...HOST_SDK_PLANNED_SURFACES].find((e) => e.id === id);
}
function matchesSearch(entry, query) {
  const q = query.trim().toLowerCase();
  if (!q) {
    return true;
  }
  return entry.label.toLowerCase().includes(q) || entry.sdkPath.toLowerCase().includes(q) || entry.description.toLowerCase().includes(q);
}
function HostSandboxPanel() {
  const { theme } = (0, import_react_native_unistyles2.useUnistyles)();
  const host = peekHostSandboxHost();
  if (!host) {
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Flex, { style: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 }, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react_native2.Text, { style: { color: theme.colors.foregroundMuted, fontSize: theme.fontSize.sm }, children: "\u6B63\u5728\u8FDE\u63A5\u5BBF\u4E3B\u2026" }) });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(HostSandboxPanelContent, {});
}
function HostSandboxPanelContent() {
  const { theme } = (0, import_react_native_unistyles2.useUnistyles)();
  const { width } = (0, import_react_native2.useWindowDimensions)();
  const compact = width < COMPACT_BREAKPOINT;
  const [selectedId, setSelectedId] = (0, import_react2.useState)(OVERVIEW_ID);
  const [searchQuery, setSearchQuery] = (0, import_react2.useState)("");
  const [counter, setCounter] = (0, import_react2.useState)(null);
  const [configHint, setConfigHint] = (0, import_react2.useState)("");
  const [toolsHint, setToolsHint] = (0, import_react2.useState)("");
  const [logTick, setLogTick] = (0, import_react2.useState)(0);
  const runtime = readHostSandboxRuntimeSnapshot();
  const eventLines = (0, import_react2.useMemo)(() => {
    void logTick;
    return readHostSandboxEventLog(12);
  }, [logTick]);
  const selected = selectedId === OVERVIEW_ID ? void 0 : findEntry(selectedId);
  (0, import_react2.useEffect)(() => {
    const unsubs = [
      subscribeHostSandboxRuntime(() => setLogTick((v) => v + 1)),
      subscribeHostSandboxEventLog(() => setLogTick((v) => v + 1))
    ];
    return () => {
      for (const unsub of unsubs) {
        unsub();
      }
    };
  }, []);
  (0, import_react2.useEffect)(() => {
    void (async () => {
      try {
        const host = getHost();
        const seen = await host.config.get({
          scope: "app",
          appId: HOST_SANDBOX_APP_ID,
          key: "host-sandbox.seen-guide",
          defaultValue: false
        });
        if (!seen) {
          appendHostSandboxEventLog(
            "\u6B22\u8FCE\uFF1A\u2460 \u9009\u5DE6\u4FA7\u80FD\u529B \u2461 \u590D\u5236\u7528\u6CD5\u4EE3\u7801 \u2462 \u70B9\u6F14\u793A \u2463 \u89C2\u5BDF\u9876\u680F\u53CD\u9988\u4E0E\u672C\u4E8B\u4EF6\u6D41",
            "info"
          );
          await host.config.set({
            scope: "app",
            appId: HOST_SANDBOX_APP_ID,
            key: "host-sandbox.seen-guide",
            value: true
          });
        }
        const keys = await host.config.listKeys({
          scope: "app",
          appId: HOST_SANDBOX_APP_ID
        });
        if (!keys.includes(CONFIG_EXAMPLE_KEY)) {
          await host.config.set({
            scope: "app",
            appId: HOST_SANDBOX_APP_ID,
            key: CONFIG_EXAMPLE_KEY,
            value: { note: "listKeys \u6F14\u793A\u7528\u793A\u4F8B\uFF0C\u53EF\u5220\u53EF\u91CD\u5EFA" }
          });
        }
        if (!keys.includes(CONFIG_COUNTER_KEY)) {
          await host.config.set({
            scope: "app",
            appId: HOST_SANDBOX_APP_ID,
            key: CONFIG_COUNTER_KEY,
            value: 0
          });
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.warn("[host-sandbox] config seed failed:", message);
        appendHostSandboxEventLog(`config \u79CD\u5B50\u5199\u5165\u5931\u8D25\uFF08\u53EF\u7A0D\u540E\u91CD\u8BD5\u6F14\u793A\uFF09\uFF1A${message}`, "warn");
      }
    })();
  }, []);
  const refreshCounter = (0, import_react2.useCallback)(async () => {
    const raw = await getHost().config.get({
      scope: "app",
      appId: HOST_SANDBOX_APP_ID,
      key: CONFIG_COUNTER_KEY,
      defaultValue: 0
    });
    setCounter(typeof raw === "number" && Number.isFinite(raw) ? raw : 0);
  }, []);
  (0, import_react2.useEffect)(() => {
    void refreshCounter();
  }, [refreshCounter]);
  const notify = (0, import_react2.useCallback)(
    async (kind, title) => {
      await getHost().ui.notification.show({ title, message: `kind=${kind}`, kind });
      appendHostSandboxEventLog(`notification.show \xB7 ${kind} \xB7 ${title}`, "success");
    },
    []
  );
  const runIndeterminateProgress = (0, import_react2.useCallback)(async () => {
    const handle = getHost().ui.progress.create({
      title: "\u4E0D\u786E\u5B9A\u8FDB\u5EA6",
      appId: HOST_SANDBOX_APP_ID
    });
    await sleep(500);
    handle.report({ message: "\u5904\u7406\u4E2D" });
    await sleep(500);
    handle.end({ kind: "success", message: "\u5B8C\u6210" });
    appendHostSandboxEventLog("progress \xB7 \u4E0D\u786E\u5B9A\u8FDB\u5EA6\u5B8C\u6210", "success");
  }, []);
  const runDeterminateProgress = (0, import_react2.useCallback)(async () => {
    const total = 10;
    const handle = getHost().ui.progress.create({
      title: "\u786E\u5B9A\u8FDB\u5EA6",
      total,
      appId: HOST_SANDBOX_APP_ID
    });
    for (let value = 1; value <= total; value += 1) {
      await sleep(100);
      handle.report({ value, total });
    }
    handle.end({ kind: "success", message: "\u5B8C\u6210" });
    appendHostSandboxEventLog("progress \xB7 \u786E\u5B9A\u8FDB\u5EA6\u5B8C\u6210", "success");
  }, []);
  const runCancellableProgress = (0, import_react2.useCallback)(async () => {
    const handle = getHost().ui.progress.create({
      title: "\u53EF\u53D6\u6D88",
      total: 15,
      cancellable: true,
      appId: HOST_SANDBOX_APP_ID
    });
    for (let value = 1; value <= 15; value += 1) {
      await sleep(120);
      handle.report({ value, total: 15 });
    }
    handle.end({ kind: "success" });
    appendHostSandboxEventLog("progress \xB7 \u53EF\u53D6\u6D88\u4EFB\u52A1\u5B8C\u6210", "success");
  }, []);
  const runFailedProgress = (0, import_react2.useCallback)(async () => {
    const handle = getHost().ui.progress.create({ title: "\u5931\u8D25", appId: HOST_SANDBOX_APP_ID });
    await sleep(200);
    handle.end({ kind: "error", message: "\u6A21\u62DF\u5931\u8D25" });
    appendHostSandboxEventLog("progress \xB7 \u6A21\u62DF\u5931\u8D25", "error");
  }, []);
  const runMultiTasks = (0, import_react2.useCallback)(async () => {
    const host = getHost();
    await Promise.all(
      ["A", "B", "C"].map(async (name, i) => {
        const h = host.ui.progress.create({ title: `\u4EFB\u52A1 ${name}`, appId: HOST_SANDBOX_APP_ID });
        await sleep(150 + i * 60);
        h.end({ kind: "success" });
      })
    );
    appendHostSandboxEventLog("progress \xB7 \u591A\u4EFB\u52A1\u5E76\u884C\u5B8C\u6210", "success");
  }, []);
  const bumpCounter = (0, import_react2.useCallback)(async () => {
    const next = (counter ?? 0) + 1;
    await getHost().config.set({
      scope: "app",
      appId: HOST_SANDBOX_APP_ID,
      key: CONFIG_COUNTER_KEY,
      value: next
    });
    setCounter(next);
    setConfigHint(`\u5DF2\u5199\u5165 ${CONFIG_COUNTER_KEY} = ${next}`);
    appendHostSandboxEventLog(`config.set \xB7 ${CONFIG_COUNTER_KEY}=${next}`, "info");
  }, [counter]);
  const runToolsProgressDemo = (0, import_react2.useCallback)(async () => {
    if (!getHost().tools?.run) {
      setToolsHint("host.tools.run \u4EC5 Electron \u684C\u9762\u7AEF\u53EF\u7528");
      appendHostSandboxEventLog("tools.run \xB7 \u4E0D\u53EF\u7528\uFF08\u975E Electron\uFF09", "warn");
      return;
    }
    setToolsHint("\u8FD0\u884C\u4E2D\u2026");
    try {
      const r = await getHost().tools.run({
        appId: HOST_SANDBOX_APP_ID,
        tool: "tools/progress-demo.mjs"
      });
      setToolsHint(r.ok ? "\u5B8C\u6210" : `exit ${r.exitCode}`);
      appendHostSandboxEventLog(
        `tools.run \xB7 ${r.ok ? "\u5B8C\u6210" : `exit ${r.exitCode}`}`,
        r.ok ? "success" : "error"
      );
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setToolsHint(msg);
      appendHostSandboxEventLog(`tools.run \xB7 ${msg}`, "error");
    }
  }, []);
  const runConfirmRisk = (0, import_react2.useCallback)(async () => {
    const r = await getHost().ui.confirmRisk?.({
      title: "\u63A2\u9488",
      message: "host.ui.confirmRisk \u6F14\u793A",
      kind: "warning"
    });
    setConfigHint(r ? `confirmed=${r.confirmed}` : "\u4E0D\u53EF\u7528");
    appendHostSandboxEventLog(`confirmRisk \xB7 confirmed=${r?.confirmed ?? false}`, "info");
  }, []);
  const allEntries = (0, import_react2.useMemo)(() => [...HOST_SDK_LIVE_SURFACES, ...HOST_SDK_PLANNED_SURFACES], []);
  const filteredOverview = (0, import_react2.useMemo)(
    () => allEntries.filter((e) => matchesSearch(e, searchQuery)),
    [allEntries, searchQuery]
  );
  const visibleNavGroups = (0, import_react2.useMemo)(() => {
    return NAV_GROUPS.map((group) => ({
      title: group.title,
      entries: group.entries.filter(
        (e) => matchesSearch(e, searchQuery) && (e.id !== "ui.confirmRisk" || runtime.confirmRiskAvailable)
      )
    })).filter((g) => g.entries.length > 0);
  }, [runtime.confirmRiskAvailable, searchQuery]);
  function renderDemo(entry) {
    if (entry.status === "planned") {
      return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(DemoBox, { testID: "host-sandbox-demo-planned", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(InlineHint, { children: "\u8BE5\u80FD\u529B\u5C1A\u672A\u63D0\u4F9B\u4EA4\u4E92\u63A2\u9488\uFF0C\u63A5\u5165\u540E\u4F1A\u5728\u672C\u9875\u5347\u7EA7\u4E3A\u300C\u53EF\u7528\u300D\u3002" }) });
    }
    const observationDemo = HostSandboxObservationDemoSection({
      entryId: entry.id,
      setLogTick
    });
    if (observationDemo) {
      return observationDemo;
    }
    switch (entry.id) {
      case "ui.notification":
        return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(DemoBox, { testID: "host-sandbox-demo-notification", children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(DemoBoxTitle, { children: "\u4EE3\u7801\u6F14\u793A" }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(Flex, { direction: "row", wrap: true, gap: 8, children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
              ActionChip,
              {
                label: "\u6210\u529F",
                testID: "host-sandbox-notify-success",
                onPress: () => void notify("success", "\u6210\u529F\u901A\u77E5")
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
              ActionChip,
              {
                label: "\u4FE1\u606F",
                testID: "host-sandbox-notify-info",
                onPress: () => void notify("info", "\u4FE1\u606F\u901A\u77E5")
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
              ActionChip,
              {
                label: "\u8B66\u544A",
                testID: "host-sandbox-notify-warning",
                onPress: () => void notify("warning", "\u8B66\u544A\u901A\u77E5")
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
              ActionChip,
              {
                label: "\u9519\u8BEF",
                testID: "host-sandbox-notify-error",
                variant: "danger",
                onPress: () => void notify("error", "\u9519\u8BEF\u901A\u77E5")
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(InlineHint, { children: "\u89E6\u53D1\u540E\u8BF7\u770B\u7A97\u53E3\u9876\u90E8\u53CD\u9988\u6761" })
        ] });
      case "ui.progress":
        return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(DemoBox, { testID: "host-sandbox-demo-progress", children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(DemoBoxTitle, { children: "\u4EE3\u7801\u6F14\u793A" }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(Flex, { direction: "row", wrap: true, gap: 8, children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
              ActionChip,
              {
                label: "\u4E0D\u786E\u5B9A",
                testID: "host-sandbox-progress-indeterminate",
                onPress: () => void runIndeterminateProgress()
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
              ActionChip,
              {
                label: "\u786E\u5B9A",
                testID: "host-sandbox-progress-determinate",
                onPress: () => void runDeterminateProgress()
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
              ActionChip,
              {
                label: "\u53EF\u53D6\u6D88",
                testID: "host-sandbox-progress-cancellable",
                onPress: () => void runCancellableProgress()
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
              ActionChip,
              {
                label: "\u5931\u8D25",
                testID: "host-sandbox-progress-error",
                variant: "danger",
                onPress: () => void runFailedProgress()
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
              ActionChip,
              {
                label: "\u591A\u4EFB\u52A1",
                testID: "host-sandbox-progress-multi",
                onPress: () => void runMultiTasks()
              }
            )
          ] })
        ] });
      case "ui.brandLoader":
        return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(HostSandboxBrandLoaderDemo, {});
      case "ui.confirmRisk":
        return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(DemoBox, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            ActionChip,
            {
              label: "\u6253\u5F00\u786E\u8BA4\u6846",
              testID: "host-sandbox-confirm-risk",
              onPress: () => void runConfirmRisk()
            }
          ),
          configHint ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(InlineHint, { testID: "host-sandbox-config-hint", children: configHint }) : null
        ] });
      case "config":
        return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(DemoBox, { testID: "host-sandbox-demo-config", children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(Flex, { direction: "row", wrap: true, gap: 8, children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
              ActionChip,
              {
                label: `\u8BA1\u6570 +1\uFF08${counter ?? "\u2026"}\uFF09`,
                testID: "host-sandbox-config-bump",
                onPress: () => void bumpCounter()
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
              ActionChip,
              {
                label: "\u5217\u51FA\u672C App keys",
                testID: "host-sandbox-config-list-keys",
                onPress: () => {
                  void (async () => {
                    const keys = await getHost().config.listKeys({
                      scope: "app",
                      appId: HOST_SANDBOX_APP_ID
                    });
                    const text = keys.length > 0 ? keys.join(", ") : "\uFF08\u7A7A\uFF09";
                    setConfigHint(`listKeys \u2192 ${text}`);
                    appendHostSandboxEventLog(`config.listKeys \xB7 ${keys.length} \u4E2A`, "info");
                  })();
                }
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
              ActionChip,
              {
                label: "\u5220\u9664\u8BA1\u6570 key",
                testID: "host-sandbox-config-delete",
                onPress: () => {
                  void (async () => {
                    await getHost().config.delete({
                      scope: "app",
                      appId: HOST_SANDBOX_APP_ID,
                      key: CONFIG_COUNTER_KEY
                    });
                    setCounter(null);
                    setConfigHint(`\u5DF2 delete ${CONFIG_COUNTER_KEY}`);
                    appendHostSandboxEventLog(`config.delete \xB7 ${CONFIG_COUNTER_KEY}`, "info");
                  })();
                }
              }
            )
          ] }),
          configHint ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(InlineHint, { testID: "host-sandbox-config-hint", children: configHint }) : null
        ] });
      case "tools.run":
        return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(DemoBox, { testID: "host-sandbox-demo-tools", children: [
          !runtime.toolsAvailable ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(InlineHint, { children: "Web/\u624B\u673A\u7AEF\u65E0 host.tools.run\uFF0C\u8BF7\u4F7F\u7528 Agnx \u684C\u9762\u7AEF\u6253\u5F00\u672C\u6307\u5357\u3002" }) : null,
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            ActionChip,
            {
              label: "progress-demo.mjs",
              testID: "host-sandbox-tools-progress-demo",
              disabled: !runtime.toolsAvailable,
              onPress: () => void runToolsProgressDemo()
            }
          ),
          toolsHint ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(InlineHint, { testID: "host-sandbox-tools-hint", children: toolsHint }) : null
        ] });
      case "lifecycle":
        return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(DemoBox, { testID: "host-sandbox-demo-lifecycle", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(InlineHint, { testID: "host-sandbox-lifecycle-status", children: `${runtime.hostReady ? "HostReady \u2713" : "\u672A\u5C31\u7EEA"} \xB7 ${runtime.lastLifecycleLine}` }) });
      case "tabs":
        return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(DemoBox, { testID: "host-sandbox-demo-tabs", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(InlineHint, { testID: "host-sandbox-tab-status", children: runtime.lastTabLine }) });
      case "background":
        return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(DemoBox, { testID: "host-sandbox-demo-background", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          ActionChip,
          {
            label: runtime.retainActive ? "\u53D6\u6D88 retain" : "\u7533\u8BF7 retain",
            testID: "host-sandbox-background-retain",
            onPress: () => {
              setHostSandboxRetain(!runtime.retainActive);
              appendHostSandboxEventLog(`background.retain \xB7 ${!runtime.retainActive}`, "info");
            }
          }
        ) });
      case "agentTools":
        return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(DemoBox, { children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(InlineHint, { children: "\u5728 Agent \u5BF9\u8BDD\u8C03\u7528 host_sandbox_ping\uFF1Bnotify:true \u624D\u89E6\u53D1 notification\u3002" }) });
      default:
        return null;
    }
  }
  const navContent = /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(NavSearch, { value: searchQuery, onChange: setSearchQuery }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      DocOverviewNavItem,
      {
        selected: selectedId === OVERVIEW_ID,
        onPress: () => setSelectedId(OVERVIEW_ID)
      }
    ),
    visibleNavGroups.map((group) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(DocNavGroup, { title: group.title, children: group.entries.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      DocNavItem,
      {
        entry,
        selected: selectedId === entry.id,
        onPress: () => setSelectedId(entry.id)
      },
      entry.id
    )) }, group.title))
  ] });
  function renderDetailContent() {
    if (selectedId === OVERVIEW_ID) {
      return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_react_native2.View, { style: styles2.detailColumn, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react_native2.Text, { style: [styles2.detailTitle, { color: theme.colors.foreground }], children: "\u80FD\u529B\u603B\u89C8" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
          import_react_native2.Text,
          {
            style: [
              styles2.detailDescription,
              { color: theme.colors.foregroundMuted, marginBottom: 12 }
            ],
            children: [
              "\u70B9\u51FB\u884C\u8DF3\u8F6C\u5230\u5BF9\u5E94\u80FD\u529B\u7684\u8BF4\u660E\u4E0E\u6F14\u793A\u3002\u5171 ",
              HOST_SDK_LIVE_SURFACES.length,
              " \u9879\u53EF\u7528\u3001",
              HOST_SDK_PLANNED_SURFACES.length,
              " \u9879\u8DEF\u7EBF\u56FE\u3002"
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(OverviewTable, { entries: filteredOverview, onSelect: setSelectedId })
      ] });
    }
    if (!selected) {
      return null;
    }
    const sample = getHostSdkCodeSample(selected.id);
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_react_native2.View, { style: styles2.detailColumn, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        DocDetailHeader,
        {
          sdkPath: selected.sdkPath,
          label: selected.label,
          description: selected.description,
          scenario: selected.scenario,
          planned: selected.status === "planned"
        }
      ),
      selected.note ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react_native2.Text, { style: [styles2.note, { color: theme.colors.foregroundMuted }], children: selected.note }) : null,
      sample ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(SectionBlock, { title: "\u7528\u6CD5", testID: "host-sandbox-section-usage", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(CodeBlock, { code: sample, testID: "host-sandbox-code-block" }) }) : null,
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(SectionBlock, { title: "\u6F14\u793A", testID: "host-sandbox-section-demo", children: renderDemo(selected) })
    ] });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_react_native2.View, { style: styles2.root, testID: "host-sandbox-panel", children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_react_native2.View, { style: [styles2.pageHeader, { borderBottomColor: theme.colors.border }], children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react_native2.Text, { style: [styles2.pageTitle, { color: theme.colors.foreground }], children: HOST_SDK_HERO.title }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        import_react_native2.Text,
        {
          style: [styles2.pageSubtitle, { color: theme.colors.foregroundMuted }],
          numberOfLines: compact ? 2 : 3,
          children: HOST_SDK_HERO.body
        }
      )
    ] }),
    compact ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      import_react_native2.ScrollView,
      {
        horizontal: true,
        showsHorizontalScrollIndicator: false,
        style: [styles2.compactNav, { borderBottomColor: theme.colors.border }],
        children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(Flex, { direction: "row", gap: 8, style: styles2.compactNavInner, children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            ActionChip,
            {
              label: "\u603B\u89C8",
              testID: "host-sandbox-nav-overview",
              onPress: () => setSelectedId(OVERVIEW_ID)
            }
          ),
          filteredOverview.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            ActionChip,
            {
              label: entry.label,
              testID: `host-sandbox-nav-${entry.id}`,
              onPress: () => setSelectedId(entry.id)
            },
            entry.id
          ))
        ] })
      }
    ) : null,
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_react_native2.View, { style: styles2.body, children: [
      !compact ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        import_react_native2.ScrollView,
        {
          style: [styles2.nav, { borderRightColor: theme.colors.border }],
          contentContainerStyle: styles2.navContent,
          children: navContent
        }
      ) : null,
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_react_native2.ScrollView, { style: styles2.detail, contentContainerStyle: styles2.detailContent, children: [
        renderDetailContent(),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(SectionBlock, { title: "\u4E8B\u4EF6\u6D41", testID: "host-sandbox-section-events", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(EventLogPanel, { lines: eventLines }) })
      ] })
    ] })
  ] });
}
var styles2 = import_react_native_unistyles2.StyleSheet.create((theme) => ({
  root: { flex: 1, backgroundColor: "transparent" },
  pageHeader: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    gap: 6
  },
  pageTitle: { fontSize: theme.fontSize.lg, fontWeight: "700" },
  pageSubtitle: { fontSize: theme.fontSize.sm, lineHeight: theme.fontSize.sm + 6 },
  compactNav: { borderBottomWidth: 1, maxHeight: 52 },
  compactNavInner: { paddingHorizontal: 12, paddingVertical: 8 },
  body: { flex: 1, flexDirection: "row", backgroundColor: "transparent" },
  nav: { width: 156, flexShrink: 0, flexGrow: 0, borderRightWidth: 1 },
  navContent: { paddingVertical: 8, paddingBottom: 16 },
  detail: { flex: 1, minWidth: 0, backgroundColor: "transparent" },
  detailContent: { padding: 16, paddingBottom: 24, gap: 4 },
  detailColumn: { width: "100%", gap: 4 },
  detailTitle: { fontSize: theme.fontSize.base, fontWeight: "700", marginBottom: 8 },
  detailDescription: { fontSize: theme.fontSize.sm, lineHeight: theme.fontSize.sm + 8 },
  note: {
    fontSize: theme.fontSize.sm,
    fontStyle: "italic",
    marginBottom: 12,
    marginTop: -8
  }
}));

// src/index.ts
var appId = HOST_SANDBOX_APP_ID;
function openHostSandboxTab(host, context) {
  host.openMiniAppTab({
    appId: HOST_SANDBOX_APP_ID,
    panelId: HOST_SANDBOX_PANEL_ID,
    serverId: context?.serverId,
    workspaceId: context?.workspaceId,
    currentPathname: context?.currentPathname
  });
}
function activate(host) {
  bindHostSandboxHost(host);
  bindHostSandboxRuntime(host);
  registerHostSandboxAgentTools(host);
  host.registerMiniApp({
    id: HOST_SANDBOX_PANEL_ID,
    appId: HOST_SANDBOX_APP_ID,
    title: "Host SDK \u6307\u5357",
    icon: import_lucide_react_native.BookOpen,
    component: HostSandboxPanel,
    isolation: {
      mode: "worker",
      workerScripts: ["json-parse-worker (Blob)"],
      note: "\u6307\u5357\u9875\u6F14\u793A\u771F\u5B9E Web Worker JSON \u89E3\u6790\uFF0C\u7ECF host.worker.observe \u4E0A\u62A5"
    }
  });
  host.registerCommand({
    id: HOST_SANDBOX_COMMAND_OPEN,
    appId: HOST_SANDBOX_APP_ID,
    title: "Host SDK \u6307\u5357",
    keywords: ["host", "sdk", "guide", "api", "sandbox", "\u5B50\u5E94\u7528", "\u5F00\u53D1\u8005", "\u80FD\u529B", "\u6307\u5357"],
    icon: import_lucide_react_native.BookOpen,
    sidebarAction: {
      defaultVisible: true,
      label: "SDK",
      order: 90
    },
    run: (context) => {
      openHostSandboxTab(host, context);
    }
  });
}
var moduleExport = {
  appId: HOST_SANDBOX_APP_ID,
  activate
};
var index_default = moduleExport;
