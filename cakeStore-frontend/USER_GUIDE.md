# 🎂 CakeStore Frontend - Complete User & Developer Guide

## Overview

You now have a **complete, production-ready React frontend** for your MERN Bakery eCommerce platform. This guide covers everything you need to know to run, develop, and deploy it.

---

## 📊 What You Have

### Pages Built (9 total)

1. **Home Page** - Products with search & pagination
2. **Login Page** - Email/Phone + password login
3. **Signup Page** - Full registration form
4. **Cart Page** - Shopping cart management
5. **Checkout Page** - Order placement with shipping address
6. **Orders Page** - View order history & status
7. **Admin Dashboard** - Admin overview
8. **Admin Products** - Product CRUD operations
9. **Admin Orders** - Order management & status updates

### Components Built (5 total)

1. **Navbar** - Responsive navigation with auth-aware menu
2. **ProductCard** - Reusable product card component
3. **ProtectedRoute** - Route protection wrapper
4. **ThemeToggle** - Dark/Light mode switcher
5. **AuthContext** - Authentication state management

### API Services (5 total)

1. **axios.js** - Central API configuration
2. **auth.api.js** - Authentication endpoints
3. **product.api.js** - Product endpoints
4. **cart.api.js** - Cart endpoints
5. **order.api.js** - Order endpoints

---

## 🚀 Getting Started

### Step 1: Install Dependencies

```bash
cd cakeStore-frontend
npm install
```

### Step 2: Start Development Server

```bash
npm run dev
```

Your app will be available at: `http://localhost:5173`

### Step 3: Ensure Backend is Running

Make sure your backend is running on `http://localhost:5000/api/v1`

### Step 4: Login or Register

- Go to `/login` to login
- Go to `/signup` to create an account

---

## 🎯 Feature Breakdown

### 1. **Authentication System** ✅

**What it does:**

- Register new users with validation
- Login with email or phone
- Maintains session with httpOnly cookies
- Auto-logs in user on page refresh
- Logout functionality

**How to use:**

- Click "Sign Up" → Fill form → Account created
- Click "Login" → Enter credentials → Logged in
- Your user info is automatically fetched and stored in context

**Files involved:**

- `src/context/AuthContext.jsx`
- `src/pages/Login.jsx`
- `src/pages/Signup.jsx`
- `src/api/auth.api.js`

---

### 2. **Product Listing & Search** ✅

**What it does:**

- Displays 12 products per page
- Real-time search functionality
- Paginated results
- Responsive product cards
- Stock status display
- Add to cart button

**How to use:**

1. Visit `/` (Home page)
2. See all products with "🎂" images
3. Type in search box to filter products
4. Use pagination buttons to browse
5. Click "🛒 Add to Cart" on any product

**Search examples:**

- "chocolate" → finds chocolate cakes
- "vanilla" → finds vanilla products
- "" (empty) → shows all products

**Files involved:**

- `src/pages/Home.jsx`
- `src/components/ProductCard.jsx`
- `src/api/product.api.js`

---

### 3. **Shopping Cart** ✅

**What it does:**

- View all items in cart
- Increase/decrease quantities
- Remove items from cart
- Calculate total price automatically
- Free shipping display
- Proceed to checkout

**How to use:**

1. Click "🛒 Add to Cart" on product
2. Go to `/cart` to view
3. Use +/- buttons to adjust quantities
4. Click "🗑️ Remove" to remove items
5. Click "Proceed to Checkout →" button

**Features:**

- Real-time total calculation
- Remove button for each item
- Continue Shopping button to go back
- Empty cart message if no items

**Files involved:**

- `src/pages/Cart.jsx`
- `src/api/cart.api.js`

---

### 4. **Checkout & Order Placement** ✅

**What it does:**

- Multi-field shipping form
- Order summary display
- Order placement
- Automatic redirect to orders page
- Success/error messages

**Checkout Fields:**

- Full Name (required)
- Email (required)
- Phone (required)
- Street Address (required)
- City (required)
- State (required)
- Postal Code (required)

**How to use:**

1. Have items in cart
2. Click "Proceed to Checkout →"
3. Fill in all fields
4. Review order summary on right side
5. Click "✓ Place Order"
6. Automatically redirected to orders page

**Files involved:**

- `src/pages/Checkout.jsx`
- `src/api/order.api.js`

---

### 5. **Order History & Tracking** ✅

**What it does:**

- View all your orders
- See order status (Processing, Shipped, Delivered, Cancelled)
- View order total and date
- See shipping address
- See items ordered

**How to use:**

1. Click "📦 My Orders" in navbar (must be logged in)
2. View all your past orders
3. Each order shows:
   - Order ID (last 8 characters)
   - Order date
   - Total amount
   - Status badge
   - Shipping address
   - Items ordered

**Order Statuses:**

- 🔄 Processing - Order being prepared
- 📦 Shipped - Order is in transit
- ✓ Delivered - Order received
- ✕ Cancelled - Order cancelled

**Files involved:**

- `src/pages/Orders.jsx`
- `src/api/order.api.js`

---

### 6. **Admin Dashboard** ✅

**What it does:**

- Admin overview page
- Links to product management
- Links to order management
- Admin-only access

**How to use:**

1. Login with admin account (role: "admin")
2. Click "👨‍💼 Admin" in navbar
3. Choose "Manage Products" or "Manage Orders"

**Files involved:**

- `src/pages/Admin/Dashboard.jsx`
- `src/components/ProtectedRoute.jsx`

---

### 7. **Admin Product Management** ✅

**What it does:**

- View all products in table
- Add new products
- Edit existing products
- Delete products
- Form validation

**How to use:**

**To Add Product:**

1. Go to `/admin/products`
2. Click "➕ Add New Product"
3. Fill form:
   - Product Name (e.g., "Chocolate Cake")
   - Price (e.g., "299")
   - Description (optional)
4. Click "✓ Add" button

**To Edit Product:**

1. Find product in table
2. Click "✏️ Edit" button
3. Modify the form
4. Click "✓ Update"

**To Delete Product:**

1. Click "🗑️ Delete" on product row
2. Confirm deletion

**Files involved:**

- `src/pages/Admin/Products.jsx`
- `src/api/product.api.js`

---

### 8. **Admin Order Management** ✅

**What it does:**

- View all customer orders
- Update order status
- See customer info
- View order details
- Track items in order

**How to use:**

1. Go to `/admin/orders`
2. See list of all orders
3. Each order shows:
   - Order ID
   - Customer email
   - Total amount
   - Order date
4. Change status dropdown:
   - 🔄 Processing
   - 📦 Shipped
   - ✓ Delivered
   - ✕ Cancelled
5. Click status dropdown to update

**Order Information Shown:**

- Order ID
- Customer email
- Total amount
- Order date
- Shipping address
- Items in order
- Current status

**Files involved:**

- `src/pages/Admin/Orders.jsx`
- `src/api/order.api.js`

---

### 9. **Dark/Light Theme** ✅

**What it does:**

- Toggle between dark and light modes
- Saves preference to localStorage
- All pages support both themes
- Professional color scheme

**How to use:**

- Click the theme toggle component (if visible in navbar)
- Or use context: `const { theme, setTheme } = useTheme()`
- Theme persists on page reload

**Color Scheme:**

- Light: Cream backgrounds with warm colors
- Dark: Dark brown backgrounds with light text

**Files involved:**

- `src/context/ThemeContext.jsx`
- `src/components/ThemeToggle.jsx`

---

## 🔐 Authentication Flow

```
User Visits App
      ↓
AuthContext.useEffect() runs
      ↓
fetchProfile() called (GET /auth/me)
      ↓
If JWT in cookie:
  ├─ User data fetched
  └─ User logged in
      ↓
If No JWT:
  └─ User is null (not logged in)
      ↓
User can access:
- Public routes: /, /login, /signup
- Protected routes (if logged in): /cart, /checkout, /orders
- Admin routes (if admin): /admin, /admin/products, /admin/orders
```

---

## 📱 Responsive Design

### breakpoints:

- **Mobile:** up to 640px
- **Tablet:** 640px - 1024px
- **Desktop:** 1024px and above

All pages are fully responsive:

- Navigation menu collapses on mobile (hamburger menu)
- Product grid adjusts columns per screen size
- Forms stack vertically on mobile
- Tables become scrollable on mobile
- Touch-friendly buttons and inputs

---

## 🛠️ Development Workflow

### Running Development Server

```bash
npm run dev
```

Hot reload enabled - changes update instantly

### Building for Production

```bash
npm run build
```

Creates optimized `dist/` folder

### Preview Production Build

```bash
npm run preview
```

Test production build locally

### Linting

```bash
npm run lint
```

Check for errors

---

## 📁 File Organization

```
API Calls Flow:
User clicks button
      ↓
Page component calls API function
      ↓
e.g., getProducts() from src/api/product.api.js
      ↓
Uses axios instance from src/api/axios.js
      ↓
Request sent to backend: http://localhost:5000/api/v1/products
      ↓
Response received and displayed
```

---

## ⚠️ Common Issues & Solutions

### Issue: "Backend not responding"

**Solution:**

1. Ensure backend is running: `npm run dev` in backend folder
2. Check backend is on port 5000
3. Verify API base URL: `http://localhost:5000/api/v1`

### Issue: "Can't login"

**Solution:**

1. Clear browser cookies
2. Ensure account exists
3. Check password is correct
4. Verify backend auth routes work

### Issue: "Products not loading"

**Solution:**

1. Check backend is running
2. Verify products exist in database
3. Check browser console for errors
4. Try refreshing page

### Issue: "Theme not changing"

**Solution:**

1. Click theme toggle in navbar (if visible)
2. Check if ThemeProvider is in main.jsx

---

## 🌐 API Endpoints Used

```
Authentication:
POST   /auth/register          Create new user
POST   /auth/login             Login user
POST   /auth/logout            Logout user
GET    /auth/me                Get current user

Products:
GET    /products               List all products
GET    /products?search=term   Search products
GET    /products?page=1        Get page
POST   /admin/products         Create product (admin)
PUT    /admin/products/:id     Update product (admin)
DELETE /admin/products/:id     Delete product (admin)

Cart:
GET    /users/cart             Get cart
PUT    /users/cart             Update cart (add/update)
DELETE /users/cart/:productId  Remove item

Orders:
POST   /orders                 Create order
GET    /orders/my-orders       Get user orders
GET    /admin/orders           Get all orders (admin)
PUT    /admin/orders/:id       Update order (admin)
```

---

## 📦 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

1. Push to GitHub
2. Connect to Vercel
3. Deploy automatically

### Deploy to Netlify

1. Push to GitHub
2. Connect to Netlify
3. Set build command: `npm run build`
4. Deploy automatically

### Deploy to Traditional Server

1. Build: `npm run build`
2. Copy `dist/` folder to server
3. Configure web server to serve index.html for all routes

---

## 🔑 Environment Variables (Optional)

Create `.env` file:

```
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

---

## 📚 Component Props Reference

### ProductCard

```jsx
<ProductCard
  product={{
    _id: "123",
    name: "Chocolate Cake",
    price: 299,
    description: "...",
    stock: 10,
  }}
/>
```

### ProtectedRoute

```jsx
<ProtectedRoute adminOnly={true}>
  <AdminPage />
</ProtectedRoute>
```

---

## 🎨 Color Scheme

**Light Mode:**

- Background: #F9F1E7 (Cream)
- Primary: Pink (#E9BCB7, pink-600)
- Text: #4A3728 (Dark brown)

**Dark Mode:**

- Background: #2B1B17 (Dark brown)
- Primary: #B97A6A (Warm brown)
- Text: #E5D3C5 (Light brown)

---

## ✅ Pre-Deployment Checklist

- [x] All pages created
- [x] API integration complete
- [x] Error handling implemented
- [x] Loading states added
- [x] Responsive design verified
- [x] Theme switching works
- [x] Authentication flows correctly
- [x] Protected routes working
- [x] Admin routes restricted
- [x] Forms validate
- [x] Production build succeeds

---

## 🎓 Learning Resources

**React:**

- Official Docs: https://react.dev
- React Hooks Guide: https://react.dev/reference/react/hooks

**React Router:**

- Official Docs: https://reactrouter.com

**Tailwind CSS:**

- Official Docs: https://tailwindcss.com
- Component Examples: https://headlessui.com

**Axios:**

- Official Docs: https://axios-http.com

---

## 📞 Support

If you encounter issues:

1. Check the browser console for errors
2. Check the network tab for API errors
3. Review the backend logs
4. Refer to troubleshooting section above
5. Check if backend is running

---

## 🎉 Next Steps

1. **Start the app:** `npm run dev`
2. **Test authentication:** Login/Signup
3. **Browse products:** Search and paginate
4. **Add to cart:** Test cart functionality
5. **Checkout:** Place an order
6. **View orders:** Check order history
7. **Admin testing:** Manage products and orders
8. **Deploy:** Build and deploy to production

---

## 📝 Notes

- All user data flows through context (AuthContext)
- Theme preference is stored in localStorage
- JWT token is in httpOnly cookie (secure)
- All API calls include error handling
- Loading states prevent double-clicks
- Forms validate on submit
- Empty states shown when no data
- Success/error messages displayed

---

**You're all set! Enjoy your production-ready CakeStore frontend! 🍰🚀**

---

**Last Updated:** February 24, 2026
**Version:** 1.0.0 - Production Ready
