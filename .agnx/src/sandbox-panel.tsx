// 场景：Host SDK 指南 — 文档站主从布局 + 总览/搜索/代码片段/事件流。
/* oxlint-disable eslint-plugin-react-perf(jsx-no-new-array-as-prop, jsx-no-new-function-as-prop, jsx-no-jsx-as-prop, jsx-no-new-object-as-prop) */
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import { ScrollView, Text, useWindowDimensions, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import type { WorkspaceAppHostApi, WorkspaceAppBrandLogoLoaderPanelProps } from "@getagnx/app-sdk";
import { HOST_SANDBOX_APP_ID } from "./constants";
import { peekHostSandboxHost, requireHostSandboxHost } from "./sandbox-host-binding";
import {
  appendHostSandboxEventLog,
  readHostSandboxEventLog,
  subscribeHostSandboxEventLog,
} from "./sandbox-event-log";
import {
  HOST_SDK_HERO,
  HOST_SDK_LIVE_SURFACES,
  HOST_SDK_PLANNED_SURFACES,
  type HostSdkSurfaceEntry,
} from "./sdk-surface-catalog";
import { getHostSdkCodeSample } from "./sdk-code-samples";
import { runHostSandboxJsonParseWorker } from "./json-parse-worker";
import {
  readHostSandboxRuntimeSnapshot,
  setHostSandboxRetain,
  subscribeHostSandboxRuntime,
} from "./sandbox-runtime";
import {
  ActionChip,
  CodeBlock,
  DemoBox,
  DemoBoxTitle,
  DocDetailHeader,
  DocNavGroup,
  DocNavItem,
  DocOverviewNavItem,
  EventLogPanel,
  Flex,
  InlineHint,
  NavSearch,
  OverviewTable,
  SectionBlock,
} from "./sandbox-ui";

const CONFIG_COUNTER_KEY = "host-sandbox.counter";
const CONFIG_EXAMPLE_KEY = "host-sandbox.example";
const OVERVIEW_ID = "__overview__";
const COMPACT_BREAKPOINT = 720;

const NAV_GROUPS: { title: string; entries: readonly HostSdkSurfaceEntry[] }[] = [
  { title: "host.ui", entries: HOST_SDK_LIVE_SURFACES.filter((e) => e.id.startsWith("ui.")) },
  {
    title: "数据与工具",
    entries: HOST_SDK_LIVE_SURFACES.filter((e) =>
      ["config", "tools.run", "agentTools"].includes(e.id),
    ),
  },
  {
    title: "生命周期",
    entries: HOST_SDK_LIVE_SURFACES.filter((e) =>
      ["lifecycle", "tabs", "background"].includes(e.id),
    ),
  },
  {
    title: "观测与隔离",
    entries: HOST_SDK_LIVE_SURFACES.filter((e) =>
      ["events", "worker.observe", "isolation"].includes(e.id),
    ),
  },
  { title: "路线图", entries: HOST_SDK_PLANNED_SURFACES },
];

function HostSandboxBrandLoaderDemo(): ReactNode {
  const { theme } = useUnistyles();
  const [activeNav, setActiveNav] = useState<"a" | "b">("a");
  const [loading, setLoading] = useState(false);
  const Panel = getHost().ui
    .BrandLogoLoaderPanel as ComponentType<WorkspaceAppBrandLogoLoaderPanelProps>;

  const switchNav = useCallback(
    (next: "a" | "b") => {
      if (next === activeNav) {
        return;
      }
      setLoading(true);
      setActiveNav(next);
      window.setTimeout(() => setLoading(false), 1200);
    },
    [activeNav],
  );

  return (
    <DemoBox testID="host-sandbox-demo-brand-loader">
      <DemoBoxTitle>左右布局 · 内容区扫光</DemoBoxTitle>
      <View style={brandLoaderDemoStyles.row}>
        <View style={brandLoaderDemoStyles.nav}>
          <ActionChip
            label="导航 A"
            testID="host-sandbox-brand-nav-a"
            onPress={() => switchNav("a")}
          />
          <ActionChip
            label="导航 B"
            testID="host-sandbox-brand-nav-b"
            onPress={() => switchNav("b")}
          />
        </View>
        <View style={[brandLoaderDemoStyles.content, { borderColor: theme.colors.borderAccent }]}>
          {loading ? (
            <Panel title="加载内容…" testID="host-sandbox-brand-content-loading" />
          ) : (
            <Text style={{ color: theme.colors.foreground }}>
              当前：{activeNav === "a" ? "内容 A" : "内容 B"}
            </Text>
          )}
        </View>
      </View>
      <InlineHint>点另一侧导航，右侧约 1.2s 扫光后显示内容</InlineHint>
    </DemoBox>
  );
}

const brandLoaderDemoStyles = StyleSheet.create((theme) => ({
  row: {
    flexDirection: "row",
    minHeight: 200,
    gap: theme.spacing[3],
  },
  nav: {
    width: 120,
    gap: theme.spacing[2],
    paddingVertical: theme.spacing[2],
  },
  content: {
    flex: 1,
    minHeight: 200,
    borderWidth: theme.borderWidth[1],
    borderRadius: theme.borderRadius.md,
    overflow: "hidden",
  },
}));

export { bindHostSandboxHost } from "./sandbox-host-binding";

function getHost(): WorkspaceAppHostApi {
  return requireHostSandboxHost();
}

function HostSandboxEventsDemo(input: {
  setLogTick: (updater: (v: number) => number) => void;
}): ReactNode {
  const [hint, setHint] = useState("");
  return (
    <DemoBox testID="host-sandbox-demo-events">
      <DemoBoxTitle>试一试</DemoBoxTitle>
      <Flex direction="row" wrap gap={8}>
        <ActionChip
          label="读取最近 5 条"
          testID="host-sandbox-events-refresh"
          onPress={() => {
            const rows = getHost().events.readRecent({
              appId: HOST_SANDBOX_APP_ID,
              limit: 5,
            });
            const preview =
              rows.length > 0
                ? rows.map((row) => `${row.domain}/${row.type}`).join(" · ")
                : "（暂无）";
            setHint(`读到 ${rows.length} 条：${preview}`);
            appendHostSandboxEventLog(`events.readRecent · ${rows.length} 条`, "info");
            input.setLogTick((v) => v + 1);
          }}
        />
      </Flex>
      {hint ? <InlineHint testID="host-sandbox-events-hint">{hint}</InlineHint> : null}
      <InlineHint>
        排查步骤：命令面板搜「诊断」→ 打开本 App → Host 观测（矩阵在上、事件在下）→ 点「复制」贴给
        AI。
      </InlineHint>
    </DemoBox>
  );
}

function HostSandboxWorkerDemo(input: {
  setLogTick: (updater: (v: number) => number) => void;
}): ReactNode {
  const report = (type: "spawn" | "terminate" | "error", summary: string) => {
    getHost().worker.observe({ type, summary });
    appendHostSandboxEventLog(`worker.observe · ${type}`, type === "error" ? "error" : "success");
    input.setLogTick((v) => v + 1);
  };
  return (
    <DemoBox testID="host-sandbox-demo-worker">
      <DemoBoxTitle>真实 Worker：在后台线程解析一段 JSON</DemoBoxTitle>
      <Flex direction="row" wrap gap={8}>
        <ActionChip
          label="跑真实 JSON Worker"
          testID="host-sandbox-worker-real"
          onPress={() => {
            void (async () => {
              const payload = JSON.stringify(
                Array.from({ length: 200 }, (_, index) => ({ id: index, name: `item-${index}` })),
              );
              const result = await runHostSandboxJsonParseWorker(getHost(), payload);
              appendHostSandboxEventLog(
                `worker.real · ${result.summary}`,
                result.ok ? "success" : "error",
              );
              input.setLogTick((v) => v + 1);
            })();
          }}
        />
      </Flex>
      <DemoBoxTitle>仅写入观测（不启线程，方便对照）</DemoBoxTitle>
      <Flex direction="row" wrap gap={8}>
        <ActionChip
          label="模拟：Worker 启动"
          testID="host-sandbox-worker-spawn"
          onPress={() => report("spawn", "demo-parse-worker started")}
        />
        <ActionChip
          label="模拟：Worker 结束"
          testID="host-sandbox-worker-terminate"
          onPress={() => report("terminate", "demo-parse-worker stopped")}
        />
        <ActionChip
          label="模拟：Worker 报错"
          testID="host-sandbox-worker-error"
          variant="danger"
          onPress={() => report("error", "demo-parse-worker OOM")}
        />
      </Flex>
      <InlineHint>
        点「跑真实 JSON Worker」后，去「诊断 → Host 观测 / 隔离配置」应能看到 worker 行；复制整段给
        AI 即可。
      </InlineHint>
    </DemoBox>
  );
}

function HostSandboxIsolationDemo(): ReactNode {
  return (
    <DemoBox testID="host-sandbox-demo-isolation">
      <DemoBoxTitle>已接入示例（打开对应 App 的「诊断」查看）</DemoBoxTitle>
      <Flex direction="column" gap={6}>
        <InlineHint>· Host SDK 指南 → worker（真实 JSON Worker 演示）</InlineHint>
        <InlineHint>· 系统洞察 / 微信收藏 → sidecar（后台工具跑重活）</InlineHint>
        <InlineHint>· Screen Toys / 牌宗 → iframe（内嵌网页 + 快捷键转发）</InlineHint>
      </Flex>
      <InlineHint>
        开发者：在 registerMiniApp 里加 isolation 字段；用户只需知道「诊断 → 隔离配置」那一行。
      </InlineHint>
    </DemoBox>
  );
}

function HostSandboxObservationDemoSection(input: {
  entryId: string;
  setLogTick: (updater: (v: number) => number) => void;
}): ReactNode {
  if (input.entryId === "events") {
    return <HostSandboxEventsDemo setLogTick={input.setLogTick} />;
  }
  if (input.entryId === "worker.observe") {
    return <HostSandboxWorkerDemo setLogTick={input.setLogTick} />;
  }
  if (input.entryId === "isolation") {
    return <HostSandboxIsolationDemo />;
  }
  return null;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function findEntry(id: string): HostSdkSurfaceEntry | undefined {
  if (id === OVERVIEW_ID) {
    return undefined;
  }
  return [...HOST_SDK_LIVE_SURFACES, ...HOST_SDK_PLANNED_SURFACES].find((e) => e.id === id);
}

function matchesSearch(entry: HostSdkSurfaceEntry, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) {
    return true;
  }
  return (
    entry.label.toLowerCase().includes(q) ||
    entry.sdkPath.toLowerCase().includes(q) ||
    entry.description.toLowerCase().includes(q)
  );
}

export function HostSandboxPanel() {
  const { theme } = useUnistyles();
  const host = peekHostSandboxHost();
  if (!host) {
    return (
      <Flex style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24 }}>
        <Text style={{ color: theme.colors.foregroundMuted, fontSize: theme.fontSize.sm }}>
          正在连接宿主…
        </Text>
      </Flex>
    );
  }

  return <HostSandboxPanelContent />;
}

function HostSandboxPanelContent() {
  const { theme } = useUnistyles();
  const { width } = useWindowDimensions();
  const compact = width < COMPACT_BREAKPOINT;
  const [selectedId, setSelectedId] = useState(OVERVIEW_ID);
  const [searchQuery, setSearchQuery] = useState("");
  const [counter, setCounter] = useState<number | null>(null);
  const [configHint, setConfigHint] = useState("");
  const [toolsHint, setToolsHint] = useState("");
  const [logTick, setLogTick] = useState(0);

  const runtime = readHostSandboxRuntimeSnapshot();
  const eventLines = useMemo(() => {
    void logTick;
    return readHostSandboxEventLog(12);
  }, [logTick]);

  const selected = selectedId === OVERVIEW_ID ? undefined : findEntry(selectedId);

  useEffect(() => {
    const unsubs = [
      subscribeHostSandboxRuntime(() => setLogTick((v) => v + 1)),
      subscribeHostSandboxEventLog(() => setLogTick((v) => v + 1)),
    ];
    return () => {
      for (const unsub of unsubs) {
        unsub();
      }
    };
  }, []);

  useEffect(() => {
    void (async () => {
      try {
        const host = getHost();
        const seen = await host.config.get<boolean>({
          scope: "app",
          appId: HOST_SANDBOX_APP_ID,
          key: "host-sandbox.seen-guide",
          defaultValue: false,
        });
        if (!seen) {
          appendHostSandboxEventLog(
            "欢迎：① 选左侧能力 ② 复制用法代码 ③ 点演示 ④ 观察顶栏反馈与本事件流",
            "info",
          );
          await host.config.set({
            scope: "app",
            appId: HOST_SANDBOX_APP_ID,
            key: "host-sandbox.seen-guide",
            value: true,
          });
        }
        // 种子示例 key，保证 listKeys 演示区非空（可被「删除计数 key」之外的删除逻辑覆盖）。
        const keys = await host.config.listKeys({
          scope: "app",
          appId: HOST_SANDBOX_APP_ID,
        });
        if (!keys.includes(CONFIG_EXAMPLE_KEY)) {
          await host.config.set({
            scope: "app",
            appId: HOST_SANDBOX_APP_ID,
            key: CONFIG_EXAMPLE_KEY,
            value: { note: "listKeys 演示用示例，可删可重建" },
          });
        }
        if (!keys.includes(CONFIG_COUNTER_KEY)) {
          await host.config.set({
            scope: "app",
            appId: HOST_SANDBOX_APP_ID,
            key: CONFIG_COUNTER_KEY,
            value: 0,
          });
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.warn("[host-sandbox] config seed failed:", message);
        appendHostSandboxEventLog(`config 种子写入失败（可稍后重试演示）：${message}`, "warn");
      }
    })();
  }, []);

  const refreshCounter = useCallback(async () => {
    const raw = await getHost().config.get<number>({
      scope: "app",
      appId: HOST_SANDBOX_APP_ID,
      key: CONFIG_COUNTER_KEY,
      defaultValue: 0,
    });
    setCounter(typeof raw === "number" && Number.isFinite(raw) ? raw : 0);
  }, []);

  useEffect(() => {
    void refreshCounter();
  }, [refreshCounter]);

  const notify = useCallback(
    async (kind: "success" | "info" | "warning" | "error", title: string) => {
      await getHost().ui.notification.show({ title, message: `kind=${kind}`, kind });
      appendHostSandboxEventLog(`notification.show · ${kind} · ${title}`, "success");
    },
    [],
  );

  const runIndeterminateProgress = useCallback(async () => {
    const handle = getHost().ui.progress.create({
      title: "不确定进度",
      appId: HOST_SANDBOX_APP_ID,
    });
    await sleep(500);
    handle.report({ message: "处理中" });
    await sleep(500);
    handle.end({ kind: "success", message: "完成" });
    appendHostSandboxEventLog("progress · 不确定进度完成", "success");
  }, []);

  const runDeterminateProgress = useCallback(async () => {
    const total = 10;
    const handle = getHost().ui.progress.create({
      title: "确定进度",
      total,
      appId: HOST_SANDBOX_APP_ID,
    });
    for (let value = 1; value <= total; value += 1) {
      await sleep(100);
      handle.report({ value, total });
    }
    handle.end({ kind: "success", message: "完成" });
    appendHostSandboxEventLog("progress · 确定进度完成", "success");
  }, []);

  const runCancellableProgress = useCallback(async () => {
    const handle = getHost().ui.progress.create({
      title: "可取消",
      total: 15,
      cancellable: true,
      appId: HOST_SANDBOX_APP_ID,
    });
    for (let value = 1; value <= 15; value += 1) {
      await sleep(120);
      handle.report({ value, total: 15 });
    }
    handle.end({ kind: "success" });
    appendHostSandboxEventLog("progress · 可取消任务完成", "success");
  }, []);

  const runFailedProgress = useCallback(async () => {
    const handle = getHost().ui.progress.create({ title: "失败", appId: HOST_SANDBOX_APP_ID });
    await sleep(200);
    handle.end({ kind: "error", message: "模拟失败" });
    appendHostSandboxEventLog("progress · 模拟失败", "error");
  }, []);

  const runMultiTasks = useCallback(async () => {
    const host = getHost();
    await Promise.all(
      (["A", "B", "C"] as const).map(async (name, i) => {
        const h = host.ui.progress.create({ title: `任务 ${name}`, appId: HOST_SANDBOX_APP_ID });
        await sleep(150 + i * 60);
        h.end({ kind: "success" });
      }),
    );
    appendHostSandboxEventLog("progress · 多任务并行完成", "success");
  }, []);

  const bumpCounter = useCallback(async () => {
    const next = (counter ?? 0) + 1;
    await getHost().config.set({
      scope: "app",
      appId: HOST_SANDBOX_APP_ID,
      key: CONFIG_COUNTER_KEY,
      value: next,
    });
    setCounter(next);
    setConfigHint(`已写入 ${CONFIG_COUNTER_KEY} = ${next}`);
    appendHostSandboxEventLog(`config.set · ${CONFIG_COUNTER_KEY}=${next}`, "info");
  }, [counter]);

  const runToolsProgressDemo = useCallback(async () => {
    if (!getHost().tools?.run) {
      setToolsHint("host.tools.run 仅 Electron 桌面端可用");
      appendHostSandboxEventLog("tools.run · 不可用（非 Electron）", "warn");
      return;
    }
    setToolsHint("运行中…");
    try {
      const r = await getHost().tools!.run!({
        appId: HOST_SANDBOX_APP_ID,
        tool: "tools/progress-demo.mjs",
      });
      setToolsHint(r.ok ? "完成" : `exit ${r.exitCode}`);
      appendHostSandboxEventLog(
        `tools.run · ${r.ok ? "完成" : `exit ${r.exitCode}`}`,
        r.ok ? "success" : "error",
      );
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setToolsHint(msg);
      appendHostSandboxEventLog(`tools.run · ${msg}`, "error");
    }
  }, []);

  const runConfirmRisk = useCallback(async () => {
    const r = await getHost().ui.confirmRisk?.({
      title: "探针",
      message: "host.ui.confirmRisk 演示",
      kind: "warning",
    });
    setConfigHint(r ? `confirmed=${r.confirmed}` : "不可用");
    appendHostSandboxEventLog(`confirmRisk · confirmed=${r?.confirmed ?? false}`, "info");
  }, []);

  const allEntries = useMemo(() => [...HOST_SDK_LIVE_SURFACES, ...HOST_SDK_PLANNED_SURFACES], []);

  const filteredOverview = useMemo(
    () => allEntries.filter((e) => matchesSearch(e, searchQuery)),
    [allEntries, searchQuery],
  );

  const visibleNavGroups = useMemo(() => {
    return NAV_GROUPS.map((group) => ({
      title: group.title,
      entries: group.entries.filter(
        (e) =>
          matchesSearch(e, searchQuery) &&
          (e.id !== "ui.confirmRisk" || runtime.confirmRiskAvailable),
      ),
    })).filter((g) => g.entries.length > 0);
  }, [runtime.confirmRiskAvailable, searchQuery]);

  function renderDemo(entry: HostSdkSurfaceEntry): ReactNode {
    if (entry.status === "planned") {
      return (
        <DemoBox testID="host-sandbox-demo-planned">
          <InlineHint>该能力尚未提供交互探针，接入后会在本页升级为「可用」。</InlineHint>
        </DemoBox>
      );
    }

    const observationDemo = HostSandboxObservationDemoSection({
      entryId: entry.id,
      setLogTick,
    });
    if (observationDemo) {
      return observationDemo;
    }

    switch (entry.id) {
      case "ui.notification":
        return (
          <DemoBox testID="host-sandbox-demo-notification">
            <DemoBoxTitle>代码演示</DemoBoxTitle>
            <Flex direction="row" wrap gap={8}>
              <ActionChip
                label="成功"
                testID="host-sandbox-notify-success"
                onPress={() => void notify("success", "成功通知")}
              />
              <ActionChip
                label="信息"
                testID="host-sandbox-notify-info"
                onPress={() => void notify("info", "信息通知")}
              />
              <ActionChip
                label="警告"
                testID="host-sandbox-notify-warning"
                onPress={() => void notify("warning", "警告通知")}
              />
              <ActionChip
                label="错误"
                testID="host-sandbox-notify-error"
                variant="danger"
                onPress={() => void notify("error", "错误通知")}
              />
            </Flex>
            <InlineHint>触发后请看窗口顶部反馈条</InlineHint>
          </DemoBox>
        );
      case "ui.progress":
        return (
          <DemoBox testID="host-sandbox-demo-progress">
            <DemoBoxTitle>代码演示</DemoBoxTitle>
            <Flex direction="row" wrap gap={8}>
              <ActionChip
                label="不确定"
                testID="host-sandbox-progress-indeterminate"
                onPress={() => void runIndeterminateProgress()}
              />
              <ActionChip
                label="确定"
                testID="host-sandbox-progress-determinate"
                onPress={() => void runDeterminateProgress()}
              />
              <ActionChip
                label="可取消"
                testID="host-sandbox-progress-cancellable"
                onPress={() => void runCancellableProgress()}
              />
              <ActionChip
                label="失败"
                testID="host-sandbox-progress-error"
                variant="danger"
                onPress={() => void runFailedProgress()}
              />
              <ActionChip
                label="多任务"
                testID="host-sandbox-progress-multi"
                onPress={() => void runMultiTasks()}
              />
            </Flex>
          </DemoBox>
        );
      case "ui.brandLoader":
        return <HostSandboxBrandLoaderDemo />;
      case "ui.confirmRisk":
        return (
          <DemoBox>
            <ActionChip
              label="打开确认框"
              testID="host-sandbox-confirm-risk"
              onPress={() => void runConfirmRisk()}
            />
            {configHint ? (
              <InlineHint testID="host-sandbox-config-hint">{configHint}</InlineHint>
            ) : null}
          </DemoBox>
        );
      case "config":
        return (
          <DemoBox testID="host-sandbox-demo-config">
            <Flex direction="row" wrap gap={8}>
              <ActionChip
                label={`计数 +1（${counter ?? "…"}）`}
                testID="host-sandbox-config-bump"
                onPress={() => void bumpCounter()}
              />
              <ActionChip
                label="列出本 App keys"
                testID="host-sandbox-config-list-keys"
                onPress={() => {
                  void (async () => {
                    const keys = await getHost().config.listKeys({
                      scope: "app",
                      appId: HOST_SANDBOX_APP_ID,
                    });
                    const text = keys.length > 0 ? keys.join(", ") : "（空）";
                    setConfigHint(`listKeys → ${text}`);
                    appendHostSandboxEventLog(`config.listKeys · ${keys.length} 个`, "info");
                  })();
                }}
              />
              <ActionChip
                label="删除计数 key"
                testID="host-sandbox-config-delete"
                onPress={() => {
                  void (async () => {
                    await getHost().config.delete({
                      scope: "app",
                      appId: HOST_SANDBOX_APP_ID,
                      key: CONFIG_COUNTER_KEY,
                    });
                    setCounter(null);
                    setConfigHint(`已 delete ${CONFIG_COUNTER_KEY}`);
                    appendHostSandboxEventLog(`config.delete · ${CONFIG_COUNTER_KEY}`, "info");
                  })();
                }}
              />
            </Flex>
            {configHint ? (
              <InlineHint testID="host-sandbox-config-hint">{configHint}</InlineHint>
            ) : null}
          </DemoBox>
        );
      case "tools.run":
        return (
          <DemoBox testID="host-sandbox-demo-tools">
            {!runtime.toolsAvailable ? (
              <InlineHint>Web/手机端无 host.tools.run，请使用 Agnx 桌面端打开本指南。</InlineHint>
            ) : null}
            <ActionChip
              label="progress-demo.mjs"
              testID="host-sandbox-tools-progress-demo"
              disabled={!runtime.toolsAvailable}
              onPress={() => void runToolsProgressDemo()}
            />
            {toolsHint ? (
              <InlineHint testID="host-sandbox-tools-hint">{toolsHint}</InlineHint>
            ) : null}
          </DemoBox>
        );
      case "lifecycle":
        return (
          <DemoBox testID="host-sandbox-demo-lifecycle">
            <InlineHint testID="host-sandbox-lifecycle-status">
              {`${runtime.hostReady ? "HostReady ✓" : "未就绪"} · ${runtime.lastLifecycleLine}`}
            </InlineHint>
          </DemoBox>
        );
      case "tabs":
        return (
          <DemoBox testID="host-sandbox-demo-tabs">
            <InlineHint testID="host-sandbox-tab-status">{runtime.lastTabLine}</InlineHint>
          </DemoBox>
        );
      case "background":
        return (
          <DemoBox testID="host-sandbox-demo-background">
            <ActionChip
              label={runtime.retainActive ? "取消 retain" : "申请 retain"}
              testID="host-sandbox-background-retain"
              onPress={() => {
                setHostSandboxRetain(!runtime.retainActive);
                appendHostSandboxEventLog(`background.retain · ${!runtime.retainActive}`, "info");
              }}
            />
          </DemoBox>
        );
      case "agentTools":
        return (
          <DemoBox>
            <InlineHint>
              在 Agent 对话调用 host_sandbox_ping；notify:true 才触发 notification。
            </InlineHint>
          </DemoBox>
        );
      default:
        return null;
    }
  }

  const navContent = (
    <>
      <NavSearch value={searchQuery} onChange={setSearchQuery} />
      <DocOverviewNavItem
        selected={selectedId === OVERVIEW_ID}
        onPress={() => setSelectedId(OVERVIEW_ID)}
      />
      {visibleNavGroups.map((group) => (
        <DocNavGroup key={group.title} title={group.title}>
          {group.entries.map((entry) => (
            <DocNavItem
              key={entry.id}
              entry={entry}
              selected={selectedId === entry.id}
              onPress={() => setSelectedId(entry.id)}
            />
          ))}
        </DocNavGroup>
      ))}
    </>
  );

  function renderDetailContent(): ReactNode {
    if (selectedId === OVERVIEW_ID) {
      return (
        <View style={styles.detailColumn}>
          <Text style={[styles.detailTitle, { color: theme.colors.foreground }]}>能力总览</Text>
          <Text
            style={[
              styles.detailDescription,
              { color: theme.colors.foregroundMuted, marginBottom: 12 },
            ]}
          >
            点击行跳转到对应能力的说明与演示。共 {HOST_SDK_LIVE_SURFACES.length} 项可用、
            {HOST_SDK_PLANNED_SURFACES.length} 项路线图。
          </Text>
          <OverviewTable entries={filteredOverview} onSelect={setSelectedId} />
        </View>
      );
    }
    if (!selected) {
      return null;
    }
    const sample = getHostSdkCodeSample(selected.id);
    return (
      <View style={styles.detailColumn}>
        <DocDetailHeader
          sdkPath={selected.sdkPath}
          label={selected.label}
          description={selected.description}
          scenario={selected.scenario}
          planned={selected.status === "planned"}
        />
        {selected.note ? (
          <Text style={[styles.note, { color: theme.colors.foregroundMuted }]}>
            {selected.note}
          </Text>
        ) : null}
        {sample ? (
          <SectionBlock title="用法" testID="host-sandbox-section-usage">
            <CodeBlock code={sample} testID="host-sandbox-code-block" />
          </SectionBlock>
        ) : null}
        <SectionBlock title="演示" testID="host-sandbox-section-demo">
          {renderDemo(selected)}
        </SectionBlock>
      </View>
    );
  }

  return (
    <View style={styles.root} testID="host-sandbox-panel">
      <View style={[styles.pageHeader, { borderBottomColor: theme.colors.border }]}>
        <Text style={[styles.pageTitle, { color: theme.colors.foreground }]}>
          {HOST_SDK_HERO.title}
        </Text>
        <Text
          style={[styles.pageSubtitle, { color: theme.colors.foregroundMuted }]}
          numberOfLines={compact ? 2 : 3}
        >
          {HOST_SDK_HERO.body}
        </Text>
      </View>

      {compact ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={[styles.compactNav, { borderBottomColor: theme.colors.border }]}
        >
          <Flex direction="row" gap={8} style={styles.compactNavInner}>
            <ActionChip
              label="总览"
              testID="host-sandbox-nav-overview"
              onPress={() => setSelectedId(OVERVIEW_ID)}
            />
            {filteredOverview.map((entry) => (
              <ActionChip
                key={entry.id}
                label={entry.label}
                testID={`host-sandbox-nav-${entry.id}`}
                onPress={() => setSelectedId(entry.id)}
              />
            ))}
          </Flex>
        </ScrollView>
      ) : null}

      <View style={styles.body}>
        {!compact ? (
          <ScrollView
            style={[styles.nav, { borderRightColor: theme.colors.border }]}
            contentContainerStyle={styles.navContent}
          >
            {navContent}
          </ScrollView>
        ) : null}

        <ScrollView style={styles.detail} contentContainerStyle={styles.detailContent}>
          {renderDetailContent()}
          <SectionBlock title="事件流" testID="host-sandbox-section-events">
            <EventLogPanel lines={eventLines} />
          </SectionBlock>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  root: { flex: 1, backgroundColor: "transparent" },
  pageHeader: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    gap: 6,
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
    marginTop: -8,
  },
}));
