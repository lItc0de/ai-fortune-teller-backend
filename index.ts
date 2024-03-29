import { file, serve } from "bun";
import TTS from "./tts";
import ChatManager from "./chatManager";
import UserManager from "./userManager";
import e from "./dbschema/edgeql-js";

const tts = new TTS();
const userManager = new UserManager();
const chatManager = new ChatManager(userManager);
// let sessionManager: SessionManager;

type User = {
  id: string;
  name?: string;
  createdAt: number;
  characterTraits: string[];
};

const CORS_HEADERS = {
  headers: {
    "Access-Control-Allow-Origin": "http://localhost:5173",
    "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PATCH, DELETE",
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
      const answer = {
        content: response,
      };

      return new Response(JSON.stringify(answer), {
        headers: {
          ...CORS_HEADERS.headers,
          "Content-Type": "application/json",
        },
      });
    }

    if (url.pathname === "/profile" && req.method === "POST") {
      const message = await req.json();
      if (typeof message !== "object")
        return new Response("An error occured!", CORS_HEADERS);

      const response = await chatManager.handleProfile(message);
      if (!response) return new Response("An error occured!", CORS_HEADERS);
      const answer = {
        content: response,
      };

      return new Response(JSON.stringify(answer), {
        headers: {
          ...CORS_HEADERS.headers,
          "Content-Type": "application/json",
        },
      });
    }

    if (url.pathname === "/user") {
      // Create user
      if (req.method === "POST") {
        const user = (await req.json()) as User;

        const query = e.insert(e.User, {
          createdAt: e.datetime(new Date(user.createdAt).toISOString()),
          characterTraits: [],
          name: user.name,
          id: user.id,
          messages: null,
        });
        const res = await query.run(userManager.client);

        if (!res) return new Response("An error occured!", CORS_HEADERS);

        return new Response("200", CORS_HEADERS);
      }

      // Update user
      if (req.method === "PATCH") {
        const user = (await req.json()) as Partial<User> & { id: string };

        const query = e.update(e.User, () => ({
          filter_single: { id: user.id },
          set: {
            name: user.name,
            characterTraits: user.characterTraits,
          },
        }));
        const res = await query.run(userManager.client);

        if (!res) return new Response("An error occured!", CORS_HEADERS);

        return new Response("200", CORS_HEADERS);
      }

      // Delete users
    }

    if (url.pathname === "/users") {
      if (req.method === "GET") {
        const users = await userManager.getAllUsers();

        if (!users) return new Response("An error occured!", CORS_HEADERS);

        return new Response(JSON.stringify(users), {
          headers: {
            ...CORS_HEADERS.headers,
            "Content-Type": "application/json",
          },
        });
      }

      if (req.method === "DELETE") {
        const userIds = (await req.json()) as string[];

        // const deletedIds = await userManager.deleteAllUsersExcept(userIds);

        // if (deletedIds === undefined)
        //   return new Response("An error occured!", CORS_HEADERS);

        return new Response("200", CORS_HEADERS);
      }
    }

    return new Response("404!", CORS_HEADERS);
  },
});

console.log(`Listening on ${server.hostname}:${server.port}`);
