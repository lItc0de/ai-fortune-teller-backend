import { type ServerWebSocket } from "bun";
import SessionManager from "./sessionManager";

// const sendMsg = async (ws: ServerWebSocket<{}>, message: string) => {
//   const res = await bot.chat(message);
//   // ws.publish("chat", res);
//   ws.send(res);
//   console.log("chat:", res);
// };

const sessionManager = new SessionManager();

const server = Bun.serve<{}>({
  fetch(req, server) {
    // const cookies = req.headers.get("cookie");
    const success = server.upgrade(req, { data: {} });
    if (success) return undefined;

    return new Response("Hello person, welcome to this world");
  },
  websocket: {
    open(ws) {
      console.log("user connected");
    },
    message(ws, message) {
      if (typeof message !== "string") return;
      sessionManager.handleMessage(ws, message);
    },
    close(ws) {
      const msg = `User1 has left the chat`;
    },
  },
});

console.log(`Listening on ${server.hostname}:${server.port}`);
