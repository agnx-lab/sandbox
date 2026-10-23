// 场景：run tool 流式 PROGRESS 演示 — stderr 输出 PROGRESS: 行供 desktop 转发。
const steps = 5;
const delayMs = 120;

for (let i = 1; i <= steps; i += 1) {
  console.error(`PROGRESS:步骤 ${i}/${steps}`);
  await new Promise((resolve) => {
    setTimeout(resolve, delayMs);
  });
}

console.log(JSON.stringify({ ok: true, steps }));
