const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'papilahan'
});

db.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Database connected');
    }
});

module.exports = db;
