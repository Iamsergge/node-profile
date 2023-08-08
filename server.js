const bcrypt = require('bcrypt');
const express = require('express');
const session = require('express-session'); // Add session middleware
const app = express();
const path = require('path');

app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Use session middleware
app.use(
  session({
    secret: 'your-secret-key', // Change this to a strong secret
    resave: false,
    saveUninitialized: true,
  })
);

// Sample users array for demonstration purposes
const users = [];

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Route for handling the GET request to /login
app.get('/login', (req, res) => {
  res.render('login'); // Render the login form
});

// Route for handling the POST request to /login
app.post('/login', async (req, res) => {
  const user = users.find((user) => user.email === req.body.email);
  if (!user) {
    console.log('User not found:', req.body.email);
    return res.status(404).send('User not found');
  }

  try {
    const match = await bcrypt.compare(req.body.password, user.password);
    if (match) {
      // Set user in session
      req.session.user = user.email;
      res.redirect('/dashboard'); // Redirect to the dashboard on successful login
    } else {
      console.log('Invalid password for user:', user.email);
      res.send('Invalid password');
    }
  } catch (err) {
    console.log('Error comparing passwords for user:', user.email, err);
    res.status(500).send('Error comparing passwords');
  }
});

// Route for handling the GET request to /dashboard
app.get('/dashboard', (req, res) => {
  // Check if user is in session
  if (req.session.user) {
    res.render('dashboard'); // Render the dashboard
  } else {
    res.redirect('/login'); // Redirect to login if not logged in
  }
});

// Server listening on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
