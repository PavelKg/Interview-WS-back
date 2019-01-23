const { Pool } = require('pg')

class dbPool {
  constructor() {
      this.pool = new Pool({
        user: "webuser",
        host: "dev.pepex.kg",
        database: "interview_ws",
        password: "qpjAaNeQWl",
        port: 5432,
        max: 20,
        client_encoding: "utf8"
      });
  };

  async query(text, params) {
    let client = await this.pool.connect()
    try {
      const result =  await client.query(text, params)
      return result
    } catch(err) {
      console.log("DB error=%s",err)
      throw Error(err)
    } finally {
      client.release()
    }      
  }
}

module.exports = dbPool;