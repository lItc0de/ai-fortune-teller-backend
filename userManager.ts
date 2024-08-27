import { type Client, createClient } from "edgedb";
import e from "./dbschema/edgeql-js";
import ServerMessage from "./serverMessage";

export type User = {
  id: string;
  name?: string;
  createdAt: number;
  characterTraits: string[];
};

class UserManager {
  client: Client;

  constructor() {
    const baseClient = createClient();
    this.client = baseClient.withConfig({ allow_user_specified_id: true });
  }

  async createUser(user: User) {
    const query = e.insert(e.User, {
      createdAt: e.datetime(new Date(user.createdAt).toISOString()),
      characterTraits: [],
      name: user.name,
      id: user.id,
      messages: null,
    });
    const res = await query.run(this.client);

    if (!res) throw new Error("User could not be created");
  }

  async updateUser(user: Partial<User> & { id: string }) {
    const query = e.update(e.User, () => ({
      filter_single: { id: user.id },
      set: {
        name: user.name,
        characterTraits: user.characterTraits,
      },
    }));
    const res = await query.run(this.client);

    if (!res) throw new Error("User could not be updated");
  }

  async getOrCreateUser(userId: string, userName?: string) {
    const query = e.select(e.User, () => ({
      id: true,
      filter_single: { id: userId },
    }));

    const result = await query.run(this.client);

    if (result?.id !== userId) {
      await this.createUser({
        id: userId,
        characterTraits: [],
        createdAt: Date.now(),
        name: userName,
      });
    }

    return userId;
  }

  async getAllUsers() {
    const query = e.select(e.User, () => ({
      id: true,
      name: true,
      createdAt: true,
      characterTraits: true,
      messages: { content: true, createdAt: true, role: true, topic: true },
    }));

    const results = await query.run(this.client);
    return results;
  }

  async deleteAllUsersExcept(userIds: string[]) {
    const query = e.params({ ids: e.array(e.uuid) }, ({ ids }) =>
      e.delete(e.User, (user) => ({
        filter: e.op(user.id, "not in", e.array_unpack(ids)),
      }))
    );

    return await query.run(this.client, {
      ids: userIds,
    });
  }

  async addMessageToHistory(userId: string, serverMessage: ServerMessage) {
    const query = e.update(e.User, () => ({
      filter_single: { id: userId },
      set: {
        messages: { "+=": e.insert(e.Message, serverMessage.toDBMessage()) },
      },
    }));

    await query.run(this.client);
  }
}

export default UserManager;
