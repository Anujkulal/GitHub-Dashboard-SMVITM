# SMVITM GitHub Dashboard

A full-stack dashboard to track and visualize GitHub activity of students at SMVITM.  
This project allows admins to add students, fetch their GitHub statistics, and display top contributors and inactive users with a modern UI.

---

## Features

- **Student Management:** Add, update, and delete student GitHub profiles.
- **GitHub Integration:** Fetches real-time data (commits, activity, etc.) from GitHub.
- **Ranking Dashboard:** View top 10 contributors and inactive students.
- **Admin Authentication:** Secure admin login/logout.
- **Responsive UI:** Works well on desktop and mobile.
- **Modern Stack:** React, Zustand, Express, MongoDB, Tailwind CSS.

---

## Tech Stack

- **Frontend:** React, Zustand, Tailwind CSS, Axios, Framer Motion
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Other:** GitHub REST API, JWT (for admin auth)

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB (local or Atlas)
- GitHub API token (for higher rate limits)

### 1. Clone the repository

```bash
git clone https://github.com/anujkulal/GitHub-Dashboard-SMVITM.git
cd GitHub-Dashboard-SMVITM
```

### 2. Setup Backend

```bash
cd backend
npm install
# Create a .env file with your MongoDB URI and JWT secret
npm start
```

#### Example `.env` for backend

```
MONGO_URI=mongodb://localhost:27017/smv_github_dashboard
JWT_SECRET=your_jwt_secret
GITHUB_TOKEN=your_github_token
```

### 3. Setup Frontend

```bash
cd ../frontend
npm install
# Create a .env file with your backend URL
npm run dev
```

#### Example `.env` for frontend

```
VITE_BACKEND_URL=http://localhost:5000
```

---

## Usage

- Visit `http://localhost:5173` in your browser.
- Login as admin to add or manage students.
- View rankings and activity reports on the dashboard.

---

## Folder Structure

```
backend/
  controllers/
  models/
  routes/
  ...
frontend/
  src/
    components/
    screens/
    zustand/
    ...
```

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## Credits

- [GitHub REST API](https://docs.github.com/en/rest)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)

---
