const secure = require("./secure");

module.exports = {
  secret: secure.key,
  session: { session: false },
  database: 'mongodb://127.0.0.1:27017/budgetmanager'
}