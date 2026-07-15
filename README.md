# 🔨 AuctionHub - Multi-Role Bidding & Auction Platform

A full-stack MERN (MongoDB, Express, React, Node.js) application designed for online auctioning. The platform supports multiple auction types (Traditional, Reverse, Sealed) with distinct access controls and customized dashboards for **Buyers** and **Sellers**.

---

## 🚀 Features

### 🔐 Authentication & Profile
- **Role-Based Access Control**: Separate flows and layouts for **Buyers** and **Sellers** via React Router navigation guards.
- **Secure Authentication**: Password hashing using `bcryptjs` and token-based sessions using `jsonwebtoken` (JWT).
- **User Profile Management**: View and edit personal profiles, profile images, and contact information.

### 💼 Seller Features
- **Product Management**: Create, update, edit, and delete products listable for auction.
- **Flexible Auction Types**: Choose from Traditional (ascending price), Reverse (descending price), or Sealed (hidden bids) auction mechanisms.
- **Media Upload**: Seamless image uploads powered by `Multer` middleware.
- **Seller Dashboard**: Overview of listed products, tracking current active bidding, and final auction statuses.

### 🛒 Buyer Features
- **Browse Catalog**: Discover active auctions with dynamic search/filters.
- **Interactive Bidding**: Place bids on active products with real-time feedback.
- **Bid Validation**: Prevents placing bids below the current highest bid or starting price.
- **Buyer Dashboard**: Easily track active bids, bidding history, and check won auctions.

---

## 🛠️ Tech Stack

### Frontend
* **Core**: React 19, JavaScript (ES6+)
* **Styling & UI**: Tailwind CSS (v4), Framer Motion (for smooth micro-animations), Heroicons
* **Routing**: React Router DOM (v7)
* **Form Handling**: React Hook Form
* **Toasts/Notifications**: React Hot Toast
* **HTTP Client**: Axios

### Backend
* **Runtime & Framework**: Node.js, Express.js (v5)
* **Database**: MongoDB with Mongoose ODM
* **Authentication**: JWT (JSON Web Tokens), BcryptJS
* **File Upload**: Multer
* **Email Notifications**: Nodemailer

---

## 📂 Project Directory Structure

```text
Auction Platform/
├── auction-platform-frontend/   # React client-side application
│   ├── src/
│   │   ├── components/         # Reusable UI elements (Inputs, Buttons, etc.)
│   │   ├── context/            # AuthContext & global state providers
│   │   ├── layouts/            # Dashboard and Public layouts
│   │   ├── pages/              # Screen components (Seller, Buyer, Home, Auth)
│   │   ├── routes/             # AppRoutes and ProtectedRoute setup
│   │   ├── services/           # Axios API modules (bidService, authService, etc.)
│   │   └── utils/              # Helper functions
│   └── package.json
├── server/                      # Express server & API endpoints
│   ├── config/                 # DB Connection & configuration settings
│   ├── controllers/            # Controller logic for auth, products, bids, etc.
│   ├── middleware/             # Route protection and upload middleware
│   ├── models/                 # Mongoose schemas (User, Product, Bid, Auction)
│   ├── routes/                 # Express route definitions
│   ├── services/               # Auxiliary services (like notification/email systems)
│   └── package.json
└── package.json                 # Project root package configuration
```

---

## ⚙️ Configuration & Setup

### 1. Prerequisites
- **Node.js** (v18+ recommended)
- **MongoDB** (Local instance or MongoDB Atlas Connection string)

### 2. Environment Variables

Create `.env` files in both backend and frontend directories as outlined below:

#### Backend (`server/.env`)
```env
PORT=5000
MONGO_URI=your_mongodb_connection_uri
JWT_SECRET=your_jwt_secret_token
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
VITE_API_BASE_URL=http://localhost:5000/api
```

#### Frontend (`auction-platform-frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🚀 Running the Application

Follow these steps to run the platform locally:

### 1. Start the Backend Server
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Run the backend in development mode (with nodemon)
npm run dev
```
The server will start on `http://localhost:5000`.

### 2. Start the Frontend Application
```bash
# Navigate to frontend directory
cd auction-platform-frontend

# Install dependencies
npm install

# Run Vite development server
npm run dev
```
The client application will run on `http://localhost:5173` (or the port specified by Vite).

---

## 🛡️ Core API Endpoints

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Register a new user (buyer/seller) | Public |
| **POST** | `/api/auth/login` | Login and retrieve JWT | Public |
| **GET** | `/api/products` | Get list of all products/auctions | Public |
| **GET** | `/api/products/:id` | Get details of a single product | Public |
| **POST** | `/api/products` | Create a new auction item (with image) | Private (Seller) |
| **PUT** | `/api/products/:id` | Update product details | Private (Seller) |
| **POST** | `/api/bids` | Place a bid on an active auction | Private (Buyer) |
| **GET** | `/api/dashboard/stats` | Retrieve metrics for dashboards | Private (Buyer/Seller) |
