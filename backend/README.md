# Backend — CommunityHub

## Team Members
- (add names and GitHub handles)

## Responsibility
The backend team handles everything behind the scenes —
the server, database, APIs and authentication logic.

## Folder Structure
```
backend/
├── server.js         → Main server entry point
├── routes/
│   └── index.js      → API route definitions
├── models/
│   └── user.js       → Database models
└── README.md
```

## API Endpoints to Build
- POST /auth/register  → Register a new user
- POST /auth/login     → Log in a user
- GET  /posts          → Get all posts
- POST /posts          → Create a new post
- GET  /posts/:id      → Get a single post
- POST /posts/:id/comments → Add a comment

## Technologies
- Node.js

## How to Run
1. Clone the repository
2. Navigate to backend folder: `cd backend`
3. Install dependencies: `npm install`
4. Start the server: `npm start`

## Notes
- Only work inside the `backend/` folder
- Agree with the frontend team on API structure before building
- Keep all routes and models well commented
