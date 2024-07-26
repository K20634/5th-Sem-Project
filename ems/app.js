const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require('mysql2');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'employee_db'
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL connected...');
});

// Routes
app.get('/', (req, res) => res.render('login'));
app.get('/main', (req, res) => res.render('main'));
app.get('/add', (req, res) => res.render('add'));
app.get('/search', (req, res) => res.render('search'));
app.get('/update', (req, res) => res.render('update'));
app.get('/about', (req, res) => res.render('about'));

// API Routes
app.post('/api/add', (req, res) => {
  const { name, address, contact, email, dob, age, gender, designation, education } = req.body;
  const sql = 'INSERT INTO employees (name, address, contact, email, dob, age, gender, designation, education) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [name, address, contact, email, dob, age, gender, designation, education], (err, result) => {
    if (err) throw err;
    res.redirect('/main');
  });
});


// Route to handle search results
app.get('/api/search', (req, res) => {
  const id = req.query.id;
  if (id) {
    const sql = 'SELECT * FROM employees WHERE id = ?';
    db.query(sql, [id], (err, result) => {
      if (err) throw err;
      res.render('search-results', { employee: result[0] || null });
    });
  } else {
    res.redirect('/search');
  }
});


app.get('/api/update', (req, res) => {
  const id = req.query.id;
  if (id) {
    const sql = 'SELECT * FROM employees WHERE id = ?';
    db.query(sql, [id], (err, result) => {
      if (err) throw err;
      res.render('update-details', { employee: result[0] || null });
    });
  } else {
    res.redirect('/update');
  }
});

// Route to handle form submission for updating employee details
app.post('/api/update/:id', (req, res) => {
  const id = req.params.id;
  const { name, address, contact, email, dob, age, gender, designation, education } = req.body;
  const sql = 'UPDATE employees SET name = ?, address = ?, contact = ?, email = ?, dob = ?, age = ?, gender = ?, designation = ?, education = ? WHERE id = ?';
  db.query(sql, [name, address, contact, email, dob, age, gender, designation, education, id], (err) => {
    if (err) throw err;
    res.redirect('/main');
  });
});




app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
