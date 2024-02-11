import { file, serve } from "bun";
import TTS from "./tts";
import ChatManager from "./chatManager";

const tts = new TTS();
const chatManager = new ChatManager();
// let sessionManager: SessionManager;

const CORS_HEADERS = {
  headers: {
    "Access-Control-Allow-Origin": "http://localhost:5173",
    "Access-Control-Allow-Methods": "OPTIONS, POST",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept",
  },
};

const server = serve({
  async fetch(req) {
    const url = new URL(req.url);

    // Handle CORS preflight requests
    if (req.method === "OPTIONS") {
      const res = new Response("Departed", CORS_HEADERS);
      return res;
    }

    if (url.pathname === "/") return new Response("Home page!", CORS_HEADERS);

    if (url.pathname === "/tts" && req.method === "POST") {
      const data = await req.json();
      const text = data?.text;

      const audioPath = await tts.create(text);
      if (!audioPath) return new Response("An error occured!", CORS_HEADERS);

      const res = new Response(file(audioPath), CORS_HEADERS);
      return res;
    }

    if (url.pathname === "/chat" && req.method === "POST") {
      const message = await req.json();
      if (typeof message !== "object")
        return new Response("An error occured!", CORS_HEADERS);

      const response = await chatManager.handleMessage(message);
      if (!response) return new Response("An error occured!", CORS_HEADERS);

      return new Response(response, CORS_HEADERS);
    }

    return new Response("404!", CORS_HEADERS);
  },
});

console.log(`Listening on ${server.hostname}:${server.port}`);
