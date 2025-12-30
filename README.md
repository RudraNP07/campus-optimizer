# campus-optimizer

CampusFlow: Campus Resource Optimizer
Optimizing Campus Resources. Saving Time. A smart, role-based platform to manage classrooms, labs, libraries, and faculty appointments efficiently.

🚀 Project Overview
CampusFlow is a full-stack web application designed to solve the common problem of resource mismanagement in educational institutions. From double-booked classrooms to long queues for faculty appointments, CampusFlow centralizes resource allocation into a single, intuitive dashboard.

Key Features
Role-Based Access Control: Dedicated interfaces for Students, Faculty, and Administrators.

Real-Time Resource Booking: Instant booking for Classrooms, Labs, Library slots, and Faculty appointments.

Dynamic Dashboard: Users can track their specific bookings and view resource availability in real-time.

Secure Authentication: Password hashing using bcryptjs and session-based management.

Persistent Storage: All user data and bookings are stored securely in MongoDB.

🛠️ Tech Stack
Frontend: HTML5, CSS3 (with Dark Mode support), JavaScript (ES6).

Backend: Node.js, Express.js.

Database: MongoDB (via Mongoose).

Authentication: Bcrypt.js & Express-Session.

Icons: FontAwesome.

📂 Project Structure

Root Folder
├── server.js             # Backend logic & API endpoints
├── frontend/             # Frontend assets
│   ├── index.html        # Landing page
│   ├── login.html        # Authentication page
│   ├── signup.html       # User registration
│   ├── dashboard.html    # Main resource hub
│   ├── user.html         # Profile & Quick Actions
│   ├── classes.html      # Class & Lab booking
│   ├── faculty.html      # Faculty appointment booking
│   ├── library.html      # Library resource booking
│   └── my-bookings.html  # User booking history
└── ... (CSS files)


⚙️ Installation & Setup
Clone the Repository:

Bash

git clone https://github.com/RudraNP07/campus-optimizer.git
cd campus-optimizer
Install Dependencies:

Bash

npm install express mongoose bcryptjs express-session body-parser
Database Configuration: The project is currently configured with a MongoDB Atlas URI in server.js. For production, ensure you replace this with your own environment variables.

Run the Server:

Bash

cd frontend

node server.js or npm start 

Access the App: Open http://localhost:3000 in your browser.

📖 How It Works
Signup/Login: Users create an account selecting a role (Student, Faculty, or Admin).

Dashboard: After logging in, users see a personalized dashboard with available resource categories.

Booking: * Navigate to Classes, Library, or Faculty.

View available time slots (e.g., Faculty available 10:00 AM – 5:00 PM).

Click "Book Slot" to reserve. The UI updates instantly to "Booked".

Manage: Users can visit the "My Bookings" page to see a table of all their successful reservations.

🛡️ Important Notices
Class Timings: 9:30 AM – 5:30 PM (Mon-Fri).

Library Timings: 9:30 AM – 5:30 PM (Closed Weekends).

Faculty Availability: 10:00 AM – 5:00 PM (Closed Sundays).

🏆 Hackathon Details [ Code@Frost ]

Project Name: CampusFlow [ Campus Resource Optimizer ]

Year: 2025

Status: Hackathon Prototype

Team Name : LUMIN

Team Members : RUDRANIL PAUL [ TEAM LEADER ] { BACKEND & DB CONNECTION & DEPLOYMENT }
               RATNADEEP KUMBHAKAR { FRONTEND & UI }
               RAJ VISHWAKARMA { FRONTEND , DEMO VIDEO }
               RAJBIR MAHATO { UI , PPT }
