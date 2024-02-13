import { type Client, createClient } from "edgedb";
import e from "./dbschema/edgeql-js";
import ServerMessage from "./serverMessage";

class UserManager {
  client: Client;

  constructor() {
    const baseClient = createClient();
    this.client = baseClient.withConfig({ allow_user_specified_id: true });
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
