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
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'frontend/index.html')));

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
    res.redirect('frontend/login.html'); // Redirect to login after signup
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
    res.redirect('frontend/dashboard.html?role=${user.role.toLowerCase()}');
  } else {
    res.status(401).send("Invalid credentials.");
  }
});

// Protection middleware for Dashboard
app.get('frontend/dashboard.html', (req, res, next) => {
  if (!req.session.userRole) {
    return res.redirect('frontend/login.html');
  }
  next();
});

// --- Booking Schema ---
const bookingSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  resourceType: { type: String, required: true }, // 'Class', 'Lab', 'Library', 'Faculty'
  resourceName: { type: String, required: true }, // e.g., 'G-1' or 'Dr. Sharma'
  slotTime: { type: String, required: true },
  bookingDate: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', bookingSchema);

// --- API Route for Booking ---
app.post('/api/book', async (req, res) => {
  // Check if user is logged in
  if (!req.session.userEmail) {
    return res.status(401).json({ success: false, message: "Please login first" });
  }

  try {
    const { resourceType, resourceName, slotTime } = req.body;

    const newBooking = new Booking({
      userEmail: req.session.userEmail,
      resourceType,
      resourceName,
      slotTime
    });

    await newBooking.save();
    res.json({ success: true, message: `Successfully booked ${resourceName}!` });
  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// --- Get User Bookings ---
app.get('/api/my-bookings', async (req, res) => {
  if (!req.session.userEmail) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const userBookings = await Booking.find({ userEmail: req.session.userEmail });
    res.json(userBookings);
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching bookings" });
  }
});

// Serve the My Bookings HTML page
app.get('/my-bookings', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/my-bookings.html'));
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));