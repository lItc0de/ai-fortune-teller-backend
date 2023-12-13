import { type ServerWebSocket } from "bun";

import Bot from "./bot";

const bot = new Bot();

const sendMsg = async (ws: ServerWebSocket<{}>, message: string) => {
  const res = await bot.chat(message);
  // ws.publish("chat", res);
  ws.send(res);
  console.log("chat:", res);
};

const server = Bun.serve<{}>({
  fetch(req, server) {
    // const cookies = req.headers.get("cookie");
    const success = server.upgrade(req, { data: {} });
    if (success) return undefined;

    return new Response("Hello person, welcome to this world");
  },
  websocket: {
    open(ws) {
      ws.subscribe("chat");
      console.log("user connected");
    },
    message(ws, message) {
      if (typeof message !== "string") return;
      sendMsg(ws, message);
    },
    close(ws) {
      const msg = `User1 has left the chat`;
      server.publish("chat", msg);
      ws.unsubscribe("chat");
    },
  },
});

console.log(`Listening on ${server.hostname}:${server.port}`);
