# PoultryMart – Online Poultry Selling and Buying Platform

**PoultryMart** is a production-ready MERN Marketplace application cleanly divided into **`frontend`** and **`backend`** projects.

Farmers can register, list their hens, cocks, and breeding stock with photos and videos, manage pricing/location/health info, and toggle WhatsApp availability.
Customers (public visitors) do **NOT** require an account, login, or checkout. They can browse, filter, view photos/videos, and tap once to **Call** or **WhatsApp** the farmer directly.

---

## 🔑 Admin Credentials

- **Email:** `jeevan@poultrymart.com`
- **Password:** `Jeevan1234`
- **Role:** `admin`

---

## 📁 Main Folder Contents

```text
c:\Farm2Bird\
├── frontend/               # Separate React.js + Vite Frontend Project
│   ├── src/
│   │   ├── components/     # Navbar, Footer, PoultryCard, SearchBar, Filters, MediaGallery, SellerContactBox
│   │   ├── context/        # AuthContext & Toast notifications
│   │   ├── pages/          # Public, Seller, and Admin views
│   │   ├── services/       # Axios API client
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/                # Separate Node.js + Express REST API Project
│   ├── config/             # Mongoose DB & Cloudinary config
│   ├── controllers/        # Auth, Poultry, Seller, and Admin controllers
│   ├── middleware/         # Auth & Multer upload middleware
│   ├── models/             # User and Poultry Mongoose schemas
│   ├── routes/             # Express REST API routes
│   ├── seed/               # Admin seed & sample listings script
│   ├── uploads/            # Local media fallback storage
│   ├── server.js           # Express main server
│   ├── .env.example
│   └── package.json
│
└── README.md               # Main Documentation
```

---

## ⚙️ How to Run Backend & Frontend

### 1. Backend Project (`/backend`)
```bash
cd backend
npm install
npm run seed     # Seeds Admin (jeevan@poultrymart.com / Jeevan1234) & demo listings
npm start        # Starts Express API server on http://localhost:5000
```

### 2. Frontend Project (`/frontend`)
```bash
cd frontend
npm install
npm run dev      # Starts Vite development server on http://localhost:5173
```
"# Poultrymart" 
"# Poultrymart" 
"# Poultrymart" 
