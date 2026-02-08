const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..')));

// Database setup
const db = new sqlite3.Database('./subscribers.db', (err) => {
    if (err) {
        console.error('Database error:', err);
    } else {
        console.log('Connected to SQLite database');
        db.run(`CREATE TABLE IF NOT EXISTS subscribers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            tier TEXT DEFAULT 'free',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            source TEXT DEFAULT 'landing_page'
        )`);
    }
});

// Subscribe endpoint
app.post('/api/subscribe', (req, res) => {
    const { email, tier = 'free' } = req.body;
    
    if (!email || !email.includes('@')) {
        return res.status(400).json({ error: 'Valid email required' });
    }
    
    const stmt = db.prepare('INSERT OR IGNORE INTO subscribers (email, tier) VALUES (?, ?)');
    stmt.run(email, tier, function(err) {
        if (err) {
            console.error('Subscribe error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        if (this.changes === 0) {
            return res.status(409).json({ message: 'Already subscribed' });
        }
        
        console.log(`New subscriber: ${email} (${tier})`);
        res.json({ success: true, message: 'Subscribed successfully' });
    });
    stmt.finalize();
});

// Stats endpoint
app.get('/api/stats', (req, res) => {
    db.get('SELECT COUNT(*) as total, SUM(CASE WHEN tier = "pro" THEN 1 ELSE 0 END) as pro FROM subscribers', (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({
            total_subscribers: row.total,
            pro_subscribers: row.pro,
            free_subscribers: row.total - row.pro,
            mrr: row.pro * 12
        });
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`HN Radar API running on port ${PORT}`);
    console.log(`Landing page: http://localhost:${PORT}/landing.html`);
});
