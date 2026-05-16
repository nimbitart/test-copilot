// Test PR with security issues

// SQL Injection
app.get('/user', (req, res) => {
  const id = req.query.id;
  const query = "SELECT * FROM users WHERE id = " + id; // SQL injection!
  db.query(query);
});

// Missing error handling
function parseJSON(data) {
  return JSON.parse(data); // Could throw!
}

// Hardcoded secrets
const API_KEY = "sk_live_1234567890";
const PASSWORD = "admin123";

module.exports = { parseJSON };
