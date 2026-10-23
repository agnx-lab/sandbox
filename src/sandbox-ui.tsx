// 场景：Host SDK 指南 UI — 文档站式主从布局（左目录 + 右演示区）。
// 氛围：root/大面透明透出宿主渐变；禁止 surface0/background 铺整页（见 system-insight 注释）。
/* oxlint-disable eslint-plugin-react-perf(jsx-no-new-array-as-prop, jsx-no-new-function-as-prop, jsx-no-jsx-as-prop, jsx-no-new-object-as-prop) */
import type { ReactNode } from "react";
import { useState } from "react";
import { Pressable, Text, TextInput, View, type ViewStyle } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import type { HostSdkSurfaceEntry } from "./sdk-surface-catalog";
import {
  clearHostSandboxEventLog,
  formatHostSandboxLogTime,
  type HostSandboxLogLine,
} from "./sandbox-event-log";

export function Flex({
  direction = "row",
  gap = 8,
  wrap = false,
  align = "stretch",
  justify = "flex-start",
  style,
  children,
  testID,
}: {
  direction?: "row" | "column";
  gap?: number;
  wrap?: boolean;
  align?: ViewStyle["alignItems"];
  justify?: ViewStyle["justifyContent"];
  style?: ViewStyle;
  children: ReactNode;
  testID?: string;
}) {
  return (
    <View
      testID={testID}
      style={[
        {
          flexDirection: direction,
          flexWrap: wrap ? "wrap" : "nowrap",
          alignItems: align,
          justifyContent: justify,
          gap,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function DocNavItem({
  entry,
  selected,
  onPress,
}: {
  entry: HostSdkSurfaceEntry;
  selected: boolean;
  onPress: () => void;
}) {
  const { theme } = useUnistyles();
  const planned = entry.status === "planned";
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      testID={`host-sandbox-nav-${entry.id}`}
      style={[
        styles.navItem,
        {
          backgroundColor: selected ? theme.colors.surface2 : "transparent",
          borderLeftColor: selected ? theme.colors.primary : "transparent",
          opacity: planned ? 0.85 : 1,
        },
      ]}
    >
      <Text
        style={[
          styles.navLabel,
          {
            color: selected ? theme.colors.foreground : theme.colors.foregroundMuted,
            fontWeight: selected ? "600" : "400",
          },
        ]}
        numberOfLines={1}
      >
        {entry.label}
      </Text>
      {planned ? (
        <Text style={[styles.navTag, { color: theme.colors.foregroundMuted }]}>即将推出</Text>
      ) : null}
    </Pressable>
  );
}

export function DocNavGroup({ title, children }: { title: string; children: ReactNode }) {
  const { theme } = useUnistyles();
  return (
    <View
      style={[
        styles.navGroupBox,
        { backgroundColor: theme.colors.surface2, borderColor: theme.colors.border },
      ]}
    >
      <Text style={[styles.navGroupTitle, { color: theme.colors.foregroundMuted }]}>{title}</Text>
      {children}
    </View>
  );
}

export function SectionBlock({
  title,
  children,
  testID,
}: {
  title: string;
  children: ReactNode;
  testID?: string;
}) {
  const { theme } = useUnistyles();
  return (
    <View
      testID={testID}
      style={[
        styles.sectionBlock,
        { borderColor: theme.colors.border, backgroundColor: theme.colors.surface2 },
      ]}
    >
      <Text style={[styles.sectionBlockTitle, { color: theme.colors.foreground }]}>{title}</Text>
      {children}
    </View>
  );
}

export function ScenarioCallout({ children, testID }: { children: string; testID?: string }) {
  const { theme } = useUnistyles();
  return (
    <View
      testID={testID}
      style={[
        styles.scenarioCallout,
        {
          backgroundColor: theme.colors.surface2,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <Text style={[styles.scenarioCalloutLabel, { color: theme.colors.primary }]}>什么时候用</Text>
      <Text style={[styles.scenarioCalloutBody, { color: theme.colors.foreground }]}>
        {children}
      </Text>
    </View>
  );
}

export function DocDetailHeader({
  sdkPath,
  label,
  description,
  scenario,
  planned,
}: {
  sdkPath: string;
  label: string;
  description: string;
  scenario?: string;
  planned?: boolean;
}) {
  const { theme } = useUnistyles();
  return (
    <View style={[styles.detailHeader, { borderBottomColor: theme.colors.border }]}>
      <Flex direction="row" align="center" gap={8} wrap>
        <Text style={[styles.detailTitle, { color: theme.colors.foreground }]}>{label}</Text>
        {planned ? (
          <View
            style={[
              styles.badge,
              { borderColor: theme.colors.border, backgroundColor: theme.colors.surface2 },
            ]}
          >
            <Text style={[styles.badgeText, { color: theme.colors.foregroundMuted }]}>
              即将推出
            </Text>
          </View>
        ) : (
          <View
            style={[
              styles.badge,
              { borderColor: theme.colors.primary, backgroundColor: theme.colors.surface2 },
            ]}
          >
            <Text style={[styles.badgeText, { color: theme.colors.primary }]}>可用</Text>
          </View>
        )}
      </Flex>
      <SdkPathRow sdkPath={sdkPath} />
      <Text style={[styles.detailDescription, { color: theme.colors.foregroundMuted }]}>
        {description}
      </Text>
      {scenario ? (
        <ScenarioCallout testID="host-sandbox-scenario">{scenario}</ScenarioCallout>
      ) : null}
    </View>
  );
}

/** Ant Design 式 demo 容器：浅底 + 边框 + 内边距 */
export function DemoBox({ children, testID }: { children: ReactNode; testID?: string }) {
  const { theme } = useUnistyles();
  return (
    <View
      testID={testID}
      style={[
        styles.demoBox,
        {
          backgroundColor: theme.colors.surface1,
          borderColor: theme.colors.border,
        },
      ]}
    >
      {children}
    </View>
  );
}

export function DemoBoxTitle({ children }: { children: string }) {
  const { theme } = useUnistyles();
  return (
    <Text style={[styles.demoBoxTitle, { color: theme.colors.foregroundMuted }]}>{children}</Text>
  );
}

export function ActionChip({
  label,
  testID,
  onPress,
  variant = "default",
  disabled = false,
}: {
  label: string;
  testID: string;
  onPress: () => void;
  variant?: "default" | "danger";
  disabled?: boolean;
}) {
  const { theme } = useUnistyles();
  const fg = variant === "danger" ? theme.colors.destructive : theme.colors.foreground;
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      testID={testID}
      style={[
        styles.chipButton,
        {
          backgroundColor: theme.colors.surface2,
          borderColor: theme.colors.border,
          opacity: disabled ? 0.45 : 1,
        },
      ]}
    >
      <Text style={[styles.chipButtonLabel, { color: fg }]}>{label}</Text>
    </Pressable>
  );
}

export function InlineHint({ children, testID }: { children: string; testID?: string }) {
  const { theme } = useUnistyles();
  return (
    <Text style={[styles.inlineHint, { color: theme.colors.foregroundMuted }]} testID={testID}>
      {children}
    </Text>
  );
}

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through
  }
  return false;
}

export function SdkPathRow({ sdkPath }: { sdkPath: string }) {
  const { theme } = useUnistyles();
  const [copied, setCopied] = useState(false);
  return (
    <Flex direction="row" align="center" gap={8} wrap>
      <Text style={[styles.sdkPath, { color: theme.colors.primary, flex: 1 }]}>{sdkPath}</Text>
      <Pressable
        accessibilityRole="button"
        testID="host-sandbox-copy-sdk-path"
        onPress={() => {
          void (async () => {
            const ok = await copyToClipboard(sdkPath);
            if (ok) {
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }
          })();
        }}
        style={[
          styles.copyButton,
          { borderColor: theme.colors.border, backgroundColor: theme.colors.surface2 },
        ]}
      >
        <Text style={[styles.copyButtonLabel, { color: theme.colors.foregroundMuted }]}>
          {copied ? "已复制" : "复制路径"}
        </Text>
      </Pressable>
    </Flex>
  );
}

export function CodeBlock({ code, testID }: { code: string; testID?: string }) {
  const { theme } = useUnistyles();
  const [copied, setCopied] = useState(false);
  return (
    <View
      testID={testID}
      style={[
        styles.codeBlock,
        { backgroundColor: theme.colors.surface2, borderColor: theme.colors.border },
      ]}
    >
      <Flex direction="row" justify="space-between" align="center">
        <Text style={[styles.codeBlockTitle, { color: theme.colors.foregroundMuted }]}>用法</Text>
        <Pressable
          accessibilityRole="button"
          testID="host-sandbox-copy-code"
          onPress={() => {
            void (async () => {
              const ok = await copyToClipboard(code);
              if (ok) {
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }
            })();
          }}
        >
          <Text style={[styles.copyButtonLabel, { color: theme.colors.primary }]}>
            {copied ? "已复制" : "复制代码"}
          </Text>
        </Pressable>
      </Flex>
      <Text style={[styles.codeText, { color: theme.colors.foreground }]} selectable>
        {code}
      </Text>
    </View>
  );
}

export function NavSearch({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  const { theme } = useUnistyles();
  return (
    <TextInput
      testID="host-sandbox-nav-search"
      value={value}
      onChangeText={onChange}
      placeholder="搜索能力…"
      placeholderTextColor={theme.colors.foregroundMuted}
      style={[
        styles.searchInput,
        {
          color: theme.colors.foreground,
          backgroundColor: theme.colors.surface2,
          borderColor: theme.colors.border,
        },
      ]}
    />
  );
}

function logLineColor(
  kind: HostSandboxLogLine["kind"],
  colors: { destructive: string; statusWarning: string; primary: string; foregroundMuted: string },
): string {
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

export function EventLogPanel({ lines }: { lines: readonly HostSandboxLogLine[] }) {
  const { theme } = useUnistyles();
  return (
    <View testID="host-sandbox-event-log" style={styles.eventLogInner}>
      <Flex direction="row" justify="flex-end" align="center">
        <Pressable
          accessibilityRole="button"
          testID="host-sandbox-event-log-clear"
          onPress={() => clearHostSandboxEventLog()}
        >
          <Text style={[styles.copyButtonLabel, { color: theme.colors.foregroundMuted }]}>
            清空
          </Text>
        </Pressable>
      </Flex>
      {lines.length === 0 ? (
        <Text style={[styles.inlineHint, { color: theme.colors.foregroundMuted }]}>
          探针与 lifecycle 事件将显示在此
        </Text>
      ) : (
        lines.map((line) => (
          <Text
            key={line.id}
            style={[styles.logLine, { color: logLineColor(line.kind, theme.colors) }]}
            numberOfLines={2}
          >
            {formatHostSandboxLogTime(line.at)} · {line.text}
          </Text>
        ))
      )}
    </View>
  );
}

export function DocOverviewNavItem({
  selected,
  onPress,
}: {
  selected: boolean;
  onPress: () => void;
}) {
  const { theme } = useUnistyles();
  return (
    <View
      style={[
        styles.navGroupBox,
        {
          backgroundColor: theme.colors.surface2,
          borderColor: theme.colors.border,
          marginBottom: 8,
        },
      ]}
    >
      <Pressable
        accessibilityRole="button"
        testID="host-sandbox-nav-overview"
        onPress={onPress}
        style={[
          styles.navItem,
          {
            backgroundColor: selected ? theme.colors.surface2 : "transparent",
            borderLeftColor: selected ? theme.colors.primary : "transparent",
          },
        ]}
      >
        <Text
          style={[
            styles.navLabel,
            {
              color: selected ? theme.colors.foreground : theme.colors.foregroundMuted,
              fontWeight: selected ? "600" : "500",
            },
          ]}
        >
          能力总览
        </Text>
      </Pressable>
    </View>
  );
}

export function OverviewTable({
  entries,
  onSelect,
}: {
  entries: readonly HostSdkSurfaceEntry[];
  onSelect: (id: string) => void;
}) {
  const { theme } = useUnistyles();
  return (
    <View testID="host-sandbox-overview-table" style={styles.overviewTable}>
      <View style={[styles.overviewHeader, { borderBottomColor: theme.colors.border }]}>
        <Text
          style={[
            styles.overviewColPath,
            styles.overviewHead,
            { color: theme.colors.foregroundMuted },
          ]}
        >
          SDK 路径
        </Text>
        <Text
          style={[
            styles.overviewColLabel,
            styles.overviewHead,
            { color: theme.colors.foregroundMuted },
          ]}
        >
          名称
        </Text>
        <Text
          style={[
            styles.overviewColStatus,
            styles.overviewHead,
            { color: theme.colors.foregroundMuted },
          ]}
        >
          状态
        </Text>
      </View>
      {entries.map((entry) => (
        <Pressable
          key={entry.id}
          accessibilityRole="button"
          testID={`host-sandbox-overview-row-${entry.id}`}
          onPress={() => onSelect(entry.id)}
          style={[styles.overviewRow, { borderBottomColor: theme.colors.border }]}
        >
          <Text
            style={[styles.overviewColPath, styles.overviewPath, { color: theme.colors.primary }]}
            numberOfLines={1}
          >
            {entry.sdkPath}
          </Text>
          <Text
            style={[styles.overviewColLabel, { color: theme.colors.foreground }]}
            numberOfLines={1}
          >
            {entry.label}
          </Text>
          <Text
            style={[
              styles.overviewColStatus,
              {
                color:
                  entry.status === "live" ? theme.colors.primary : theme.colors.foregroundMuted,
              },
            ]}
          >
            {entry.status === "live" ? "可用" : "即将推出"}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  navGroupBox: {
    marginHorizontal: 6,
    marginBottom: 8,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    paddingBottom: 4,
    overflow: "hidden",
  },
  navGroup: {
    gap: 2,
    marginBottom: 10,
  },
  navGroupTitle: {
    fontSize: theme.fontSize.xs,
    fontWeight: "700",
    letterSpacing: 0.4,
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 4,
    textTransform: "uppercase",
  },
  navItem: {
    paddingVertical: 7,
    paddingHorizontal: 8,
    paddingLeft: 10,
    borderLeftWidth: 3,
    gap: 2,
    marginHorizontal: 4,
    borderRadius: theme.borderRadius.base,
  },
  navLabel: {
    fontSize: theme.fontSize.sm,
  },
  navTag: {
    fontSize: theme.fontSize.xs,
  },
  detailHeader: {
    gap: 8,
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  detailTitle: {
    fontSize: theme.fontSize.base,
    fontWeight: "700",
  },
  sdkPath: {
    fontSize: theme.fontSize.sm,
    fontFamily: "monospace",
    fontWeight: "500",
  },
  detailDescription: {
    fontSize: theme.fontSize.sm,
    lineHeight: theme.fontSize.sm + 8,
  },
  scenarioCallout: {
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    padding: 10,
    gap: 4,
    marginTop: 4,
  },
  scenarioCalloutLabel: {
    fontSize: theme.fontSize.xs,
    fontWeight: "700",
  },
  scenarioCalloutBody: {
    fontSize: theme.fontSize.sm,
    lineHeight: theme.fontSize.sm + 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: theme.fontSize.xs,
    fontWeight: "600",
  },
  demoBox: {
    borderWidth: 1,
    borderRadius: theme.borderRadius.lg,
    padding: 14,
    gap: 10,
  },
  demoBoxTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: "600",
  },
  chipButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.base,
    borderWidth: 1,
  },
  chipButtonLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: "500",
  },
  inlineHint: {
    fontSize: theme.fontSize.sm,
    lineHeight: theme.fontSize.sm + 6,
  },
  copyButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.base,
    borderWidth: 1,
  },
  copyButtonLabel: {
    fontSize: theme.fontSize.xs,
    fontWeight: "500",
  },
  codeBlock: {
    borderWidth: 1,
    borderRadius: theme.borderRadius.lg,
    padding: 12,
    gap: 8,
  },
  codeBlockTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: "600",
  },
  codeText: {
    fontSize: theme.fontSize.sm,
    lineHeight: theme.fontSize.sm + 4,
    fontFamily: "monospace",
  },
  searchInput: {
    fontSize: theme.fontSize.sm,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.base,
    borderWidth: 1,
    marginHorizontal: 6,
    marginBottom: 8,
  },
  sectionBlock: {
    borderWidth: 1,
    borderRadius: theme.borderRadius.lg,
    padding: 14,
    gap: 10,
    marginBottom: 12,
  },
  sectionBlockTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  eventLogInner: {
    gap: 6,
  },
  logLine: {
    fontSize: theme.fontSize.sm,
    lineHeight: theme.fontSize.sm + 4,
    fontFamily: "monospace",
  },
  overviewTable: {
    width: "100%",
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    overflow: "hidden",
  },
  overviewHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 8,
  },
  overviewRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 8,
    borderBottomWidth: 1,
  },
  overviewHead: {
    fontSize: theme.fontSize.xs,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  overviewColPath: {
    flex: 2,
    fontSize: theme.fontSize.sm,
  },
  overviewColLabel: {
    flex: 1.2,
    fontSize: theme.fontSize.sm,
  },
  overviewColStatus: {
    width: 64,
    fontSize: theme.fontSize.sm,
    fontWeight: "500",
  },
  overviewPath: {
    fontFamily: "monospace",
  },
}));
