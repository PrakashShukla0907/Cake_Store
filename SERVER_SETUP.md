# ✅ Backend & Frontend Servers Running

## Server Status

### Backend Server ✅

- **URL:** http://localhost:5000
- **Status:** Running
- **Port:** 5000
- **API Base:** http://localhost:5000/api/v1
- **Database:** MongoDB Atlas (Connected)

### Frontend Server ✅

- **URL:** http://localhost:5174
- **Status:** Running
- **Port:** 5174 (5173 was already in use)
- **API Calls:** Pointing to backend at http://localhost:5000/api/v1

---

## Access Your Application

### Frontend (User Interface)

```
http://localhost:5174
```

### Backend API (For Testing)

```
http://localhost:5000/api/v1
```

### All API Endpoints

```
POST   /api/v1/auth/signup          - User registration
POST   /api/v1/auth/login           - User login
POST   /api/v1/auth/logout          - User logout
GET    /api/v1/auth/me              - Get user profile

GET    /api/v1/products             - Get all products
GET    /api/v1/products/:id         - Get single product

POST   /api/v1/users/cart           - Add to cart
GET    /api/v1/users/cart           - Get cart
PUT    /api/v1/users/cart           - Update quantity
DELETE /api/v1/users/cart/:id       - Remove from cart

POST   /api/v1/user/orders          - Place order
GET    /api/v1/user/orders/my-orders - Get my orders

GET    /api/v1/admin/orders         - Get all orders (admin)
PUT    /api/v1/admin/orders/:id     - Update order status (admin)
```

---

## How to Use

### 1. **Access the Frontend**

Open your browser and go to:

```
http://localhost:5174
```

### 2. **Test Signup**

- Click "Sign Up"
- Fill in the form:
  - **Name:** John Doe
  - **Email:** john@example.com
  - **Phone:** 9123456789
  - **Password:** Test@12345
  - **Confirm Password:** Test@12345
- Click "Sign Up"

### 3. **Test Login**

- Click "Login"
- Use credentials:
  - **Email/Phone:** john@example.com (or 9123456789)
  - **Password:** Test@12345
- Click "Login"

### 4. **Test Features**

- Browse products
- Add items to cart
- Checkout and place orders
- View order history
- Access admin dashboard (if admin account)

---

## Keep Running

Both servers will keep running in the background. To stop them:

### Stop Backend

Press `Ctrl+C` in the backend terminal

### Stop Frontend

Press `Ctrl+C` in the frontend terminal

---

## MongoDB Connection Status

The backend will automatically attempt to connect to MongoDB. If you see:

- ✅ `MongoDB connected successfully` - Database is connected
- ⚠️ `MongoDB connection failed` - Database unavailable (API will still work for non-db operations)

You can continue using the application even if MongoDB is temporarily unavailable, though data operations may fail.

---

## ✨ Your Full Stack is Ready!

- **Frontend:** React with Vite ✅
- **Backend:** Express.js ✅
- **Database:** MongoDB ✅
- **Authentication:** JWT in httpOnly cookies ✅

Start building! 🚀
