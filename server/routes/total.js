var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/mu';

router.get('/', function (req, res) {
  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    client.query('SELECT SUM (monthly_salary) FROM employees;', function (err, result) {
      done();

      console.log(result.rows[0]);

      res.send(result.rows[0]);

    });
  });
});

module.exports = router;
