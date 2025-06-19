const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'webuser',
  password: 'webpass',
  database: 'textbook_marketplace'
});

// Get available listings
app.get('/api/listings', (req, res) => {
  db.query(`
    SELECT L.listing_id, B.title, U.username AS seller
    FROM Listings L
    JOIN Books B ON L.book_id = B.book_id
    JOIN Users U ON L.seller_id = U.user_id
    WHERE L.is_available = TRUE
  `, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Save message (hard-coded buyer_id = 2)
app.post('/api/messages', (req, res) => {
  const { listing_id, message_text } = req.body;
  const buyer_id = 2;

  db.query('SELECT seller_id FROM Listings WHERE listing_id = ?', [listing_id], (err, results) => {
    if (err || results.length === 0) return res.status(400).json({ error: 'Invalid listing' });

    const seller_id = results[0].seller_id;

    db.query(
      `INSERT INTO Messages (sender_id, receiver_id, listing_id, message_text)
       VALUES (?, ?, ?, ?)`,
      [buyer_id, seller_id, listing_id, message_text],
      (err2) => {
        if (err2) return res.status(500).json({ error: err2 });
        res.json({ success: true });
      }
    );
  });
});

// Get seller messages (hard-coded seller_id = 1)
app.get('/api/inbox', (req, res) => {
  db.query(`
    SELECT M.message_text, M.sent_at, B.title, U.username AS sender
    FROM Messages M
    JOIN Listings L ON M.listing_id = L.listing_id
    JOIN Books B ON L.book_id = B.book_id
    JOIN Users U ON M.sender_id = U.user_id
    WHERE M.receiver_id = 1
    ORDER BY M.sent_at DESC
  `, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
