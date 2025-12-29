const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

// --- MongoDB Connection ---
// Replace 'your_mongodb_uri' with your actual MongoDB Compass or Atlas connection string
mongoose.connect('mongodb+srv://tgdadabhai99_db_user:Rudraistired@portfolio.gmhtwqm.mongodb.net/?appName=Portfolio?retryWrites=true&w=majority')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// --- User Schema ---
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['Student', 'Faculty', 'Admin'] }
});

const User = mongoose.model('User', userSchema);

// --- Middleware ---
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname))); // Serves your HTML/CSS files
app.use(session({
  secret: 'campus_secret_key',
  resave: false,
  saveUninitialized: false
}));

// --- Routes ---

// Serve Home Page
app.get('/', (req, res) => res.sendFile(path.join(__dirname, './index.html')));

// Handle Signup
app.post('/signup', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    // Hash password for security
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = new User({
      email,
      password: hashedPassword,
      role: role.toLowerCase()
    });

    await newUser.save();
    res.redirect('./login.html');
  } catch (error) {
    res.status(400).send("Error creating account. Email might already exist.");
  }
});

// Handle Login
app.post('/login', async (req, res) => {
  const { email, password, role } = req.body;
  const user = await User.findOne({ email });

  if (user && await bcrypt.compare(password, user.password)) {
    // Store user data in session
    req.session.userRole = user.role;
    req.session.userEmail = user.email;
    res.redirect('./dashboard.html');
  } else {
    res.status(401).send("Invalid credentials.");
  }
});

// Protection middleware for Dashboard
app.get('./dashboard.html', (req, res, next) => {
  if (!req.session.userRole) {
    return res.redirect('./login.html');
  }
  next();
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));