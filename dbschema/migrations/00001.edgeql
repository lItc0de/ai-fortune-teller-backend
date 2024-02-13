CREATE MIGRATION m1nfy537ujvriyhf64nnhyjk6dsmvh6wm7mgnjzb6h2olm43epfboq
    ONTO initial
{
  CREATE SCALAR TYPE default::Role EXTENDING enum<user, system, assistant>;
  CREATE TYPE default::Message {
      CREATE REQUIRED PROPERTY content: std::str;
      CREATE REQUIRED PROPERTY createdAt: std::datetime;
      CREATE REQUIRED PROPERTY role: default::Role;
  };
  CREATE TYPE default::User {
      CREATE REQUIRED MULTI LINK messages: default::Message;
      CREATE REQUIRED PROPERTY characterTraits: array<std::str>;
      CREATE REQUIRED PROPERTY createdAt: std::datetime;
      CREATE PROPERTY name: std::str;
  };
};
