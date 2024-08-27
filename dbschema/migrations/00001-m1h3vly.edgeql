CREATE MIGRATION m1h3vlyrrwz55ezcycac47qj77ybrucrtncc4cfa3ezi73ho63tcna
    ONTO initial
{
  CREATE SCALAR TYPE default::Role EXTENDING enum<user, assistant>;
  CREATE SCALAR TYPE default::Topic EXTENDING enum<LOVE, CAREER, GENERAL, QUESTION>;
  CREATE TYPE default::Message {
      CREATE REQUIRED PROPERTY content: std::str;
      CREATE REQUIRED PROPERTY createdAt: std::datetime;
      CREATE REQUIRED PROPERTY role: default::Role;
      CREATE REQUIRED PROPERTY topic: default::Topic;
  };
  CREATE TYPE default::User {
      CREATE MULTI LINK messages: default::Message;
      CREATE REQUIRED PROPERTY characterTraits: array<std::str>;
      CREATE REQUIRED PROPERTY createdAt: std::datetime;
      CREATE PROPERTY name: std::str;
  };
};
