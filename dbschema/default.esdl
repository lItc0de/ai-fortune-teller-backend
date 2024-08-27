module default {
  scalar type Role extending enum<user, assistant>;
  scalar type Topic extending enum<LOVE, CAREER, GENERAL, QUESTION>;

  type User {
    required createdAt: datetime;
    required characterTraits: array<str>;
    multi messages: Message;
    name: str;
  }

  type Message {
    required createdAt: datetime;
    required role: Role;
    required topic: Topic;
    required content: str;
  }
};
