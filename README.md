# Cake Store

A full-stack, responsive e-commerce web application for a cake bakery. Built entirely on the **MERN** stack (MongoDB, Express.js, React, Node.js), this project features a modern and premium user interface, seamless user authentication, product management, and an interactive admin dashboard.

---

## ✨ Features

- **Modern User Interface**: Built with React 19, Vite, and Tailwind CSS 4 for a premium, responsive design.
- **User Authentication**: Secure signup and login using JWT (JSON Web Tokens) and bcryptjs.
- **Product Catalog**: Browse dynamic cake categories and detailed product information.
- **Admin Dashboard**: Comprehensive dashboard for admins to manage inventory, products, and categories, integrated with visual analytics (Recharts).
- **Image Management**: Seamless cake image uploads handled via Cloudinary and Multer.
- **RESTful API**: Robust backend API built with Express 5 and Mongoose for rapid data querying.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19, Vite
- **Styling**: Tailwind CSS 4, Material UI (MUI), Headless UI, Emotion
- **Routing**: React Router DOM v7
- **Icons**: Lucide React, Heroicons, React Icons
- **HTTP Client**: Axios
- **Charts**: Recharts

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5
- **Database**: MongoDB (via Mongoose 9)
- **Authentication**: JWT (jsonwebtoken), bcryptjs
- **File Uploads**: Multer, Cloudinary
- **Middleware**: CORS, Cookie-Parser, Morgan, Express-Validator

---

## 🚀 Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or a local MongoDB instance)
- [Cloudinary](https://cloudinary.com/) account for image uploads

### 1. Clone the repository
```bash
git clone https://github.com/PrakashShukla0907/Cake_Store.git
cd Cake_Store
```

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd cakeStore-backend
   ```
2. Install backend dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `cakeStore-backend` folder based on the required variables:
   ```env
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```
4. Start the backend server:
   ```bash
   npm run server
   ```

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory from the project root:
   ```bash
   cd cakeStore-frontend
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

### 4. View the App
Open [http://localhost:5173](http://localhost:5173) in your browser to explore the Cake Store.

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!
