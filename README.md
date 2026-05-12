<p align="center">
<img width="1536" height="1024" alt="Project Poster" src="https://github.com/user-attachments/assets/8f888405-62e4-4f0a-be62-8aff4ddfdcce" />
</p>

# IYF Alumni Networking Platform

A full-stack alumni networking platform designed for IYF Academy students, graduates, mentors and administrators.

The platform enables students and alumni to:

* Create professional profiles
* Connect with fellow graduates
* Discover job and internship opportunities
* Share announcements and opportunities
* Maintain an active learning and networking community.

---

# 🚀 Project Vision

The goal of this project is to build a centralized digital ecosystem for IYF Academy that continues supporting students even after completing their bootcamp programs.

This platform bridges:

* Students
* Alumni
* Trainers
* Recruiters
* Administrators

into one collaborative system.

---

# 🎯 Core Features

## 🔐 Authentication System

* User registration
* Secure login
* JWT authentication
* Password hashing with bcrypt

---

## 👤 User Profiles

* Personal profile creation
* Course & cohort tracking
* Skills and bio section
* Profile updates

---

## 💼 Opportunities Board

* Job postings
* Internship opportunities
* Scholarships
* Community announcements

---

## 🔎 Alumni Directory

* Discover other students and alumni
* Search by course or cohort
* Networking and collaboration

---

# 🏗 System Architecture

```text
Frontend (React)
        ↓
Backend API (Express.js)
        ↓
MongoDB Database
```

---

# ⚙️ Tech Stack

## Frontend

* React.js
* React Router
* CSS

---

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcryptjs

---

## Development Tools

* Git & GitHub
* GitHub Codespaces
* Postman
* Render (Deployment)

---

# 📁 Project Structure

```text
iyf-s10-week-12-team-Connie-cloud-svg/
│
├── backend/                    # Express.js API
│   ├── src/
│   │   ├── app.js             # Express configuration
│   │   ├── server.js          # Entry point
│   │   ├── config/            # Database connection
│   │   ├── controllers/       # Business logic (auth, user, opportunities)
│   │   ├── models/            # Mongoose schemas (user, opportunity)
│   │   ├── routes/            # API endpoint definitions
│   │   ├── middleware/        # JWT auth, error handling
│   │   └── utils/             # Token generation, helpers
│   ├── .env.example           # Environment variables template
│   └── package.json
│
├── iyf-alumni-connect/         # Frontend root
│   └── alumni-hub/            # React application
│       ├── src/
│       │   ├── components/    # Reusable UI (Navbar, buttons, cards)
│       │   ├── context/       # The themecontext
│       │   ├── pages/         # Page components (Login, Profile, etc.)
│       │   ├── styles/        # Plain CSS files
│       │   ├── App.jsx/       # Main app component
│       │   └── Main.jsx       
│       └── package.json
│
├── frontend/                   # ⚠️ PLACEHOLDER — actual app is above
│   └── README.md
│
├── docker-compose.yml          # Local MongoDB setup
├── CONTRIBUTORS.md             # Team contributions
├── LICENSE                     # MIT License
└── README.md                   # This file
```

---

# 👥 Team Structure

## 👑 Project Lead

### Connie

Responsible for:

* Sprint planning
* Team coordination
* Pull request approvals
* Project management
* Workflow supervision

  
# 🔌 Integration

## Authentication Integration

* Frontend/backend authentication connection
* Token storage
* Session handling

 
 ## Opportunities Integration

* API integration
* Data rendering
* Opportunity synchronization

---

# 🎨 Frontend Team

## Charlene — Authentication UI

Responsible for:

* Login page
* Registration page
* Form validation
* Authentication UI integration

---

## Shayla — User Profile UI

Responsible for:

* Profile pages
* User dashboard
* Profile editing system

---

## Joshua — Opportunities UI

Responsible for:

* Job listings page
* Opportunity cards
* Opportunity filtering

---

## Mary — UI System & Components

Responsible for:

* Navbar
* Buttons
* Cards
* Reusable UI components
* Design consistency

---

# ⚙️ Backend Team

## Samuel — Authentication System

Responsible for:

* Register API
* Login API
* JWT implementation
* Password hashing
* Authentication security

---

## Cheryl — User System

Responsible for:

* User schema
* Profile APIs
* User management
* User directory system

---

## Ian — Opportunities System

Responsible for:

* Opportunity schema
* Opportunity APIs
* CRUD operations
* Data validation

---

# 🌿 Git Workflow Rules

## Main Branches

```bash
main → production
dev → integration branch
```

---

## Feature Branch Naming

```bash
feature/auth-system
feature/user-profile
feature/opportunities-api
feature/frontend-login
```

---

# 🚨 Team Rules

* Never push directly to `main`
* Every feature must have its own branch
* Pull Requests are mandatory
* All code must be reviewed before merge
* Backend APIs must be tested before frontend integration

---

# 🔧 Backend Setup

## Install Dependencies

```bash
npm install
```

---

## Run Development Server

```bash
npm run dev
```

---

# 🚀 Deployment

## Backend

* Render

## Database

* MongoDB 

## Frontend

* Vercel

---

# 📜 License

This project is developed for educational and collaborative purposes under the IYF Academy program.

---

# 💡 Mission Statement

> Empowering IYF students and alumni through technology, networking, collaboration, and opportunity sharing.
