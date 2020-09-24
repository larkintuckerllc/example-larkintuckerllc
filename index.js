const express = require('express');
const knex = require('knex');
const pg = require('pg');

const DATABASE_URL = process.env.DATABASE_URL;
const LOADERIO_VERIFICATION_TOKEN = process.env.LOADERIO_VERIFICATION_TOKEN;
const PORT = process.env.PORT || 3000;
pg.defaults.ssl = true;

if (DATABASE_URL === undefined || LOADERIO_VERIFICATION_TOKEN === undefined) {
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
      try {
        await client.raw('SELECT VERSION()');
        res.send('success');
      } catch (err) {
        console.log(err);
        res.status(500).send('failed');
      }
    });

    app.get('/db-slow', async (req, res) => {
      try {
        await client.raw('SELECT pg_sleep(1)');
        res.send('success');
      } catch (err) {
        console.log(err);
        res.status(500).send('failed');
      }
    });

    app.get(`/${LOADERIO_VERIFICATION_TOKEN}`, (req,res) => res.send(LOADERIO_VERIFICATION_TOKEN));

    app.listen(PORT, () => console.log(`Example app listening on port ${PORT}`));
  } catch (connectErr) {
    console.log(connectErr);
    process.exit(1);
  }
})();
