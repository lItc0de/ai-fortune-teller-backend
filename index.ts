import { type ServerWebSocket } from "bun";

import Bot from "./bot";

const bot = new Bot();

const sendMsg = async (ws: ServerWebSocket<{}>) => {
  const res = await bot.chat("Hello how are you?");
  ws.publish("chat", res);
  ws.send(res);
  console.log("chat:", res);
};

const server = Bun.serve<{}>({
  fetch(req, server) {
    const cookies = req.headers.get("cookie");
    const success = server.upgrade(req, { data: {} });
    if (success) return undefined;

    return new Response("Hello person, welcome to this world");
  },
  websocket: {
    open(ws) {
      ws.subscribe("chat");
      console.log("user connected");
      sendMsg(ws);
    },
    message(ws, message) {
      // the server re-broadcasts incoming messages to everyone
      ws.publish("chat", `User1: ${message}`);
    },
    close(ws) {
      const msg = `User1 has left the chat`;
      server.publish("chat", msg);
      ws.unsubscribe("chat");
    },
  },
});

console.log(`Listening on ${server.hostname}:${server.port}`);
