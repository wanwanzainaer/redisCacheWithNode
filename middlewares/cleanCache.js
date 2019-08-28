const { clearHash } = require("../services/cache");

module.exports = async (req, res, nex) => {
  await next();
  clearHash(rea.user.id);
};
