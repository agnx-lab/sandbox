// 场景：Host 沙盒 agent ping 工具单元测试。
import { describe, expect, it, vi } from "vitest";
import { invokeHostSandboxPing } from "./agent-tools";

describe("invokeHostSandboxPing", () => {
  it("回显 message 且可选触发 notification", async () => {
    const show = vi.fn().mockResolvedValue(undefined);
    const host = {
      ui: {
        notification: { show },
      },
    } as never;

    const silent = await invokeHostSandboxPing(host, { message: "hello" });
    expect(silent).toEqual({ ok: true, echo: "hello" });
    expect(show).not.toHaveBeenCalled();

    await invokeHostSandboxPing(host, { message: "ping", notify: true });
    expect(show).toHaveBeenCalledWith({
      title: "Agent 探针",
      message: "ping",
      kind: "info",
    });
  });
});
