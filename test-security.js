// Bad code with multiple issues
const express = require('express');
const app = express();

// SQL Injection vulnerability
app.get('/user', (req, res) => {
  const userId = req.query.id;
  const sql = "SELECT * FROM users WHERE id = " + userId; // SQL injection!
  db.query(sql, (err, results) => {
    res.json(results);
  });
});

// N+1 Query Problem
app.get('/posts', async (req, res) => {
  const users = await db.query('SELECT * FROM users');
  
  for (let user of users) {
    const posts = await db.query('SELECT * FROM posts WHERE userId = ?', user.id); // Loop query!
    user.posts = posts;
  }
  
  res.json(users);
});

// Missing error handling
app.get('/data', (req, res) => {
  const data = JSON.parse(req.body); // Could throw without try-catch!
  res.json(data);
});

// Hardcoded credentials
const apiKey = "sk_live_1234567890abcdef"; // Never hardcode secrets!
const dbPassword = "admin123";

app.listen(3000);
