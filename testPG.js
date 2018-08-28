const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgres://vrfxhodtqyfprc:36b401c890699b83a74f92c4cebd21c29de6dbcbaac7fbab0865ee2b9bafcd4c@ec2-50-16-196-57.compute-1.amazonaws.com:5432/d6v73t2rti2ka",
  ssl: true
});

//console.log(pool)
func = async (req, res) => {
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT * FROM cats_table');
    console.log(result.rows)
    client.release();
  } catch (err) {
    console.error(err);
  }
}
func2 = async (sql) => {
    try {
      const client = await pool.connect()
      client.s
      const result = await client.query(sql);
      console.log(result.rows)
      client.release();
    } catch (err) {
      console.error(err);
    }
  }

const sql = "insert into cats_table (name, description, color, tags, img_path) VALUES ('quack_!quack', 'not a fucking normal cat, get lost normies', 'ginger', 'skinny', './dev/null/thing2' )"
//func2(sql)
func(1, 2)