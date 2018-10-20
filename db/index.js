const { Pool } = require('pg')

class dbPool {
  constructor() {
      this.pool = new Pool({
        user: "postgres",
        host: "37.228.112.18",
        database: "mst_stat",
        password: "zeroc00l",
        port: 5432,
        max: 20,
        client_encoding: "utf8"
      });
  };

  async query(text, params) {
    const client = await this.pool.connect()
    try {
      const result =  await client.query(text, params)
      client.release()
      return result
    } catch(err){
      console.log("DB error=%s",err)
    }
  }
}

module.exports = dbPool;