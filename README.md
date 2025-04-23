# 💰 Expense Tracker App

A full-stack web application to track your expenses, analyze spending trends, and stay financially organized.

---

## 🛠️ Tech Stack

- **Frontend**: React (with React Router, Toast Notifications)
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Authentication**: JSON Web Tokens (JWT)
- **Styling**: CSS + basic component styling

---

## 🚀 Features

- 🔐 User Registration and Login with JWT Authentication
- ➕ Add and Delete Expenses
- 📊 Monthly Spending Reports with Comparisons
- 🚫 Session Auto-Logout on Token Expiry
- ✅ Pop-up Notifications for Success & Errors
- 🧭 Protected Routes with PrivateRoute Components

---

## 📦 Folder Structure

```
expense-tracker/
├── client/            # React Frontend
├── server/            # Express Backend
└── database/          # PostgreSQL setup
```

---

## 💻 Run the App Locally

### Backend (Server)
```bash
cd server
nvm install
node index.js
```

### Frontend (React)
```bash
cd client
npm install
npm start
```

---

## ⚙️ Environment Variables

In the root of `server/`, create a `.env` file:

```
PORT=3001
DATABASE_URL=postgresql://your_user:your_pass@localhost:5432/expense_tracker
JWT_SECRET=
```



## 📝 License

This project is licensed under the MIT License.

---

## 🙌 Author

**Ningthoujam Rabichand**  
Feel free to fork and contribute!
