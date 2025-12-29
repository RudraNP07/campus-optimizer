const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

// --- MongoDB Connection ---
mongoose.connect('mongodb+srv://tgdadabhai99_db_user:Rudraistired@portfolio.gmhtwqm.mongodb.net/?appName=Portfolio&retryWrites=true&w=majority')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// --- User Schema ---
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['Student', 'Faculty', 'Admin'] } // Keep these capitalized
});

const User = mongoose.model('User', userSchema);

// --- Middleware ---
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname))); 
app.use(session({
  secret: 'campus_secret_key',
  resave: false,
  saveUninitialized: false
}));

// --- Routes ---

// Serve Home Page
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

// Handle Signup
app.post('/signup', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Capitalize first letter to match Schema enum
    const formattedRole = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();

    const newUser = new User({
      email,
      password: hashedPassword,
      role: formattedRole
    });

    await newUser.save();
    console.log("User created successfully");
    res.redirect('/login.html'); // Redirect to login after signup
  } catch (error) {
    console.error(error);
    res.status(400).send("Error creating account. Email might already exist or role is invalid.");
  }
});

// Handle Login
app.post('/login', async (req, res) => {
  const { email, password, role } = req.body;
  const user = await User.findOne({ email });

  // Match input role (lowercase from HTML) to stored role
  if (user && await bcrypt.compare(password, user.password)) {
    req.session.userRole = user.role;
    req.session.userEmail = user.email;
    // Pass the role as a query parameter so dashboard.html can load the right view
    res.redirect('/dashboard.html?role=${user.role.toLowerCase()}');
  } else {
    res.status(401).send("Invalid credentials.");
  }
});

// Protection middleware for Dashboard
app.get('/dashboard.html', (req, res, next) => {
  if (!req.session.userRole) {
    return res.redirect('/login.html');
  }
  next();
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));