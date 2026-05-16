// SQL Injection vulnerability
app.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  const query = "SELECT * FROM users WHERE id = " + userId;
  db.query(query);
});

// Hardcoded secrets
const API_KEY = "sk_live_1234567890abcdef";
const DB_PASSWORD = "admin123";

// N+1 Query problem
app.get('/posts', async (req, res) => {
  const users = await db.query('SELECT * FROM users');
  for (let user of users) {
    user.posts = await db.query('SELECT * FROM posts WHERE userId = ' + user.id);
  }
  res.json(users);
});

// Missing error handling
function parseJSON(data) {
  return JSON.parse(data);
}

// Bad variable names
function calc(x, y) {
  const a = x + y;
  const b = a * 2;
  return b;
}
