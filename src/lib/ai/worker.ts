import { WebWorkerMLCEngineHandler } from "@mlc-ai/web-llm";

const handler = new WebWorkerMLCEngineHandler();

self.onmessage = (msg: MessageEvent) => {
  try {
    handler.onmessage(msg);
  } catch (err: any) {
    console.error("[WebWorkerMLCEngine] Unhandled message error:", err);
    self.postMessage({
      kind: "error",
      uuid: msg.data?.uuid,
      error: err?.message || "Worker runtime exception"
    });
  }
};

self.onerror = (err) => {
  console.error("[WebWorkerMLCEngine] Worker error:", err);
};
