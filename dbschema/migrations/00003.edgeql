CREATE MIGRATION m1wq3lqaognhpjf5cjjkysvzrzew7plxqchtaqkaov5jby33o34ika
    ONTO m16pyanzkxl4sco6ypvhzdmr5ybw6xh63uu5rbqccmczmniuao42ka
{
  CREATE SCALAR TYPE default::Topic EXTENDING enum<LOVE, CAREER, GENERAL, QUESTION>;
  ALTER TYPE default::Message {
      CREATE REQUIRED PROPERTY topic: default::Topic {
          SET REQUIRED USING (<default::Topic>{});
      };
  };
};
