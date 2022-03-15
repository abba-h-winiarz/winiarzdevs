var express = require('express');
var router = express.Router();
const pool = require('../pool');

/* GET home page. */
router.route('/')
  .get((req, res, next) => {
    pool.query('SELECT * FROM recipes2', (error, results, fields) => {
      if (error) {
        res.statusCode = 500;
        return res.send(error.message);
      }
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.send(results);
    });
  });

router.route('/addrecipe')
  .post((req, res, next) => {
    const {name,ingredients, directions} = req.body;

    pool.query('INSERT INTO recipes2 (name,ingredients, directions) VALUES(?,?,?)',
      [name,ingredients, directions], (error, results, fields) => {
        if (error) {

          res.statusCode = 500;
          return res.send(error.message);
        }

        console.log(results);

        req.body.id = results.insertId;

        res.status(201)
          .location(`${req.baseUrl}/${req.body.id}`)
          .send(req.body);
      });
  });
router.route('/:id')
  .get((req, res, next) => {
    pool.query('SELECT * FROM recipes2 WHERE id = ?',
      [req.params.id], (error, results, fields) => {
        if (error) {
          res.statusCode = 500;
          return res.send(error.message);
        }
        if (!results.length) {
          return res.sendStatus(404);
        }

        res.send(results[0]);
      });
  })
  .put((req, res, next) => {
    const { name,ingredients, directions } = req.body;

    pool.query('UPDATE recipes2 SET name = ?, ingredients = ?, directions = ?, WHERE id = ?',
      [name,ingredients, directions, req.params.id], (error, results, fields) => {
        if (error) {
          res.statusCode = 500;
          return res.send(error.message);
        }

        res.sendStatus(204);
      });
  })
  .delete((req, res, next) => {
    pool.query('DELETE FROM recipes2 WHERE id = ?',
      [req.params.id], (error, results, fields) => {
        if (error) {
          res.statusCode = 500;
          return res.send(error.message);
        }

        if (! results.affectedRows) {
          return res.sendStatus(404);
        }

        res.sendStatus(204);
      });
  });  
module.exports = router;
