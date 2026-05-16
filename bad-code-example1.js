// EXTREMELY BAD CODE - Full of vulnerabilities and poor practices

const express = require('express');
const mysql = require('mysql');
const fs = require('fs');
const app = express();

// ❌ CRITICAL: Hardcoded credentials in code
const DB_HOST = 'localhost';
const DB_USER = 'root';
const DB_PASSWORD = 'password123';
const DB_NAME = 'production_db';
const API_KEY = 'sk_live_1234567890abcdefghijk';
const JWT_SECRET = 'mysecretkey123456';
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'admin@123';

// ❌ CRITICAL: SQL Injection - Direct string concatenation
app.get('/api/user/:id', (req, res) => {
  const userId = req.params.id;
  const query = "SELECT * FROM users WHERE id = " + userId;
  
  const connection = mysql.createConnection({ host: DB_HOST, user: DB_USER, password: DB_PASSWORD, database: DB_NAME });
  
  connection.query(query, (err, results) => {
    if (err) {
      // ❌ Exposing internal errors to client
      res.json({ error: err.message, stack: err.stack });
      return;
    }
    res.json(results);
  });
});

// ❌ CRITICAL: SQL Injection in login
app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  
  // ❌ Storing plain text passwords
  // ❌ No input validation
  const query = "SELECT * FROM users WHERE email = '" + email + "' AND password = '" + password + "'";
  
  const connection = mysql.createConnection({ host: DB_HOST, user: DB_USER, password: DB_PASSWORD, database: DB_NAME });
  
  connection.query(query, (err, user) => {
    if (user) {
      // ❌ No token validation
      res.json({ token: jwt.sign({ id: user.id }, JWT_SECRET) });
    }
  });
});

// ❌ PERFORMANCE: Severe N+1 Query Problem
app.get('/users-with-posts', (req, res) => {
  const connection = mysql.createConnection({ host: DB_HOST, user: DB_USER, password: DB_PASSWORD, database: DB_NAME });
  
  // Get all users
  connection.query('SELECT * FROM users', (err, users) => {
    // ❌ N+1: Making a query for EACH user
    users.forEach(user => {
      connection.query('SELECT * FROM posts WHERE user_id = ' + user.id, (err, posts) => {
        user.posts = posts;
      });
    });
    
    res.json(users);
  });
});

// ❌ CODE QUALITY: No error handling
app.post('/create-user', (req, res) => {
  // ❌ No try-catch
  // ❌ No input validation
  const userData = JSON.parse(req.body); // Can throw!
  
  const connection = mysql.createConnection({ host: DB_HOST, user: DB_USER, password: DB_PASSWORD, database: DB_NAME });
  
  const query = "INSERT INTO users (name, email, password) VALUES ('" + userData.name + "', '" + userData.email + "', '" + userData.password + "')";
  connection.query(query);
  
  res.json({ success: true });
});

// ❌ PERFORMANCE: String concatenation in loop (very slow)
function buildQuery(ids) {
  let query = 'SELECT * FROM products WHERE id IN (';
  
  for (let i = 0; i < ids.length; i++) {
    query += ids[i]; // ❌ String concatenation in loop is slow!
    if (i < ids.length - 1) {
      query += ',';
    }
  }
  
  query += ')';
  return query;
}

// ❌ CODE QUALITY: Bad variable names
function calc(x, y, z) {
  const a = x + y;
  const b = a * z;
  const c = b / 2;
  return c; // What does this calculate?
}

function processData(d) {
  let r = [];
  for (let i = 0; i < d.length; i++) {
    r.push(d[i] * 2);
  }
  return r;
}

// ❌ PERFORMANCE: Regex created in loop
function validateEmails(emails) {
  const validEmails = [];
  
  for (let email of emails) {
    // ❌ Regex created in every iteration!
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (emailRegex.test(email)) {
      validEmails.push(email);
    }
  }
  
  return validEmails;
}

// ❌ SECURITY: Unbounded file read
app.get('/read-file', (req, res) => {
  const filename = req.query.file;
  // ❌ No path validation - can read any file on system!
  const content = fs.readFileSync(filename, 'utf8');
  res.send(content);
});

// ❌ CODE QUALITY: Memory leak - unbounded cache
let cache = [];
app.post('/cache', (req, res) => {
  const data = { timestamp: Date.now(), value: req.body.data };
  cache.push(data); // ❌ Cache grows infinitely - memory leak!
  res.json({ cached: cache.length });
});

// ❌ SECURITY: No authentication on admin endpoint
app.delete('/admin/user/:id', (req, res) => {
  const userId = req.params.id;
  // ❌ NO AUTH CHECK - anyone can delete users!
  const query = 'DELETE FROM users WHERE id = ' + userId;
  
  const connection = mysql.createConnection({ host: DB_HOST, user: DB_USER, password: DB_PASSWORD, database: DB_NAME });
  connection.query(query);
  
  res.json({ deleted: true });
});

// ❌ CODE QUALITY: Deeply nested code
function complexFunction(a, b, c) {
  if (a > 0) {
    if (b > 0) {
      if (c > 0) {
        if (a + b + c > 100) {
          if (a * b < 500) {
            // ... deep nesting, hard to read
            return a + b + c;
          }
        }
      }
    }
  }
  return 0;
}

// ❌ PERFORMANCE: Synchronous operations blocking event loop
app.get('/config', (req, res) => {
  // ❌ Blocking file read!
  const config = fs.readFileSync('config.json', 'utf8');
  const data = JSON.parse(config);
  res.json(data);
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

module.exports = app;
