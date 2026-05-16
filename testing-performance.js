// Performance issues test

// Bad: Inefficient loop and nested queries
function getUsersWithPosts() {
  const users = [];
  
  // Loading all users into memory - inefficient!
  for (let i = 0; i < 1000000; i++) {
    const user = db.query("SELECT * FROM users WHERE id = " + i);
    users.push(user);
  }
  
  // N+1 Query - making separate query for each user's posts
  for (let user of users) {
    user.posts = db.query("SELECT * FROM posts WHERE userId = " + user.id);
    user.comments = db.query("SELECT * FROM comments WHERE userId = " + user.id);
  }
  
  return users;
}

// Bad: Synchronous file operations blocking event loop
function loadConfig() {
  const fs = require('fs');
  const config = fs.readFileSync('config.json'); // Blocks!
  return JSON.parse(config);
}

// Bad: Inefficient string concatenation in loop
function buildQuery(ids) {
  let query = "SELECT * FROM users WHERE id IN (";
  
  for (let i = 0; i < ids.length; i++) {
    query += ids[i]; // String concatenation in loop is slow!
    if (i < ids.length - 1) {
      query += ",";
    }
  }
  
  query += ")";
  return query;
}

// Bad: Unbounded array growth
let cache = [];
function addToCache(data) {
  cache.push(data); // No size limit - memory leak!
}

// Bad: Regex in loop
function validateEmails(emails) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Created in loop!
  
  return emails.filter(email => {
    return emailRegex.test(email); // Inefficient
  });
}

module.exports = {
  getUsersWithPosts,
  loadConfig,
  buildQuery,
  addToCache,
  validateEmails
};
