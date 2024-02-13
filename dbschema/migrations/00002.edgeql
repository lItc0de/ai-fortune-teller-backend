CREATE MIGRATION m16pyanzkxl4sco6ypvhzdmr5ybw6xh63uu5rbqccmczmniuao42ka
    ONTO m1nfy537ujvriyhf64nnhyjk6dsmvh6wm7mgnjzb6h2olm43epfboq
{
  ALTER TYPE default::User {
      ALTER LINK messages {
          RESET OPTIONALITY;
      };
  };
};
