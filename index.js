const express = require('express');
const knex = require('knex');
const pg = require('pg');

const DATABASE_URL = process.env.DATABASE_URL;
const PORT = process.env.PORT || 3000;

pg.defaults.ssl = true;

if (DATABASE_URL === undefined) {
  console.log('missing environment variables');
  process.exit(1);
}

const client = knex({
  client: 'pg',
  connection: DATABASE_URL,
});

(async () => {
  try {
    const app = express();

    app.get('/', (req, res) => res.send('Hello World!'));

    app.get('/db', async (req, res) => {
      /*
      CREATE TABLE Persons (
        PersonID int,
        LastName varchar(255),
        FirstName varchar(255),
        Address varchar(255),
        City varchar(255)
      );
      */
      try {
        const rows = await client.select('lastname')
          .from('persons');
        console.log(rows);
        res.send('success');
      } catch (err) {
        console.log(err);
        res.status(500).send('failed');
      }
    });

    app.listen(PORT, () => console.log(`Example app listening on port ${PORT}`));
  } catch (connectErr) {
    console.log(connectErr);
    process.exit(1);
  }
})();
