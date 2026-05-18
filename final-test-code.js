// TERRIBLE CODE - Full of bugs and vulnerabilities

const express = require('express');
const mysql = require('mysql');
const app = express();

// ❌ Hardcoded secrets
const DB_USER = 'root';
const DB_PASS = 'password123';
const API_KEY = 'sk_live_1234567890';

// ❌ SQL Injection
app.get('/user/:id', (req, res) => {
  const id = req.params.id;
  const query = "SELECT * FROM users WHERE id = " + id;
  db.query(query, (err, result) => {
    res.json(result);
  });
});

// ❌ N+1 Query Problem
app.get('/posts', (req, res) => {
  db.query('SELECT * FROM users', (err, users) => {
    users.forEach(user => {
      db.query('SELECT * FROM posts WHERE userId = ' + user.id, (err, posts) => {
        user.posts = posts;
      });
    });
    res.json(users);
  });
});

// ❌ No error handling
app.post('/login', (req, res) => {
  const data = JSON.parse(req.body);
  const query = "SELECT * FROM users WHERE email = '" + data.email + "'";
  db.query(query, (err, user) => {
    res.json(user);
  });
});

// ❌ Bad variable names
function calc(x, y) {
  const a = x + y;
  const b = a * 2;
  return b;
}

// ❌ Memory leak
let cache = [];
app.post('/cache', (req, res) => {
  cache.push(req.body);
  res.json({ size: cache.length });
});

app.listen(3000);
