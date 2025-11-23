# Coupon Management API

A simple HTTP service for managing coupons and finding the best applicable coupon for users based on their cart and eligibility criteria.

## 🛠 Tech Stack

### Backend
- **Node.js** with **Express.js** framework
- **JavaScript ES Modules** (ESM)
- **In-memory storage** using Map data structure (no database)
- **CORS** enabled for frontend communication

### Frontend
- **React 18** with functional components and hooks
- **React Router** for client-side routing
- **Tailwind CSS** for modern, responsive styling
- **Vite** as build tool and dev server
- **Axios** for HTTP requests
- Enhanced UI/UX with beautiful design

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

The backend server will run on `http://localhost:3000`

For development with auto-reload:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

**Note:** Make sure the backend is running before using the frontend.

### Frontend Features

The frontend includes three main pages accessible via navigation:

- **Create Coupon** (`/`) - Form to create new coupons with all options
- **Find Best Coupon** (`/best-coupon`) - Test the best-coupon endpoint with custom user/cart JSON
- **All Coupons** (`/coupons`) - View all stored coupons in a beautiful card grid layout

The UI features:
- Modern design with Tailwind CSS
- Responsive layout for all screen sizes
- Smooth transitions and hover effects
- Clear visual feedback for actions
- Beautiful coupon cards with color-coded badges

## 🚀 API Endpoints

### 1. Create Coupon
**POST** `/coupons`

Creates a new coupon with specified rules and constraints.

**Request Body:**
```json
{
  "code": "SAVE20",
  "type": "PERCENT",
  "discountValue": 20,
  "maxDiscountAmount": 100,
  "minCartValue": 500,
  "expiryDate": "2024-12-31",
  "userTier": "GOLD",
  "categories": ["electronics", "clothing"],
  "maxUsage": 1000,
  "description": "20% off on electronics and clothing"
}
```

**Response (201 Created):**
```json
{
  "message": "Coupon created successfully",
  "coupon": {
    "id": 1,
    "code": "SAVE20",
    "type": "PERCENT",
    "discountValue": 20,
    "maxDiscountAmount": 100,
    "minCartValue": 500,
    "expiryDate": "2024-12-31",
    "userTier": "GOLD",
    "categories": ["electronics", "clothing"],
    "maxUsage": 1000,
    "usedCount": 0,
    "description": "20% off on electronics and clothing",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Field Descriptions:**
- `code` (required): Unique coupon code string
- `type` (required): Either `"FLAT"` or `"PERCENT"`
- `discountValue` (required): Discount amount (flat value or percentage)
- `maxDiscountAmount` (optional): Maximum discount cap for PERCENT type
- `minCartValue` (optional): Minimum cart total required
- `expiryDate` (optional): ISO date string (YYYY-MM-DD)
- `userTier` (optional): User tier restriction (e.g., "GOLD", "SILVER")
- `categories` (optional): Array of allowed product categories
- `maxUsage` (optional): Maximum number of times coupon can be used
- `description` (optional): Human-readable description

### 2. Get Best Coupon
**POST** `/coupons/best-coupon`

Finds the best applicable coupon for a given user and cart.

**Request Body:**
```json
{
  "user": {
    "tier": "GOLD"
  },
  "cart": {
    "total": 1000,
    "items": [
      {
        "name": "Laptop",
        "category": "electronics",
        "price": 800
      },
      {
        "name": "T-Shirt",
        "category": "clothing",
        "price": 200
      }
    ]
  }
}
```

**Response (200 OK):**
```json
{
  "message": "Best coupon found",
  "bestCoupon": {
    "id": 1,
    "code": "SAVE20",
    "type": "PERCENT",
    "discountValue": 20,
    "maxDiscountAmount": 100,
    "minCartValue": 500,
    "expiryDate": "2024-12-31",
    "userTier": "GOLD",
    "categories": ["electronics", "clothing"],
    "maxUsage": 1000,
    "usedCount": 0,
    "description": "20% off on electronics and clothing",
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  "discountAmount": 100,
  "finalAmount": 900,
  "applicableCount": 3
}
```

**Response when no coupon found:**
```json
{
  "message": "No applicable coupons found",
  "bestCoupon": null,
  "discountAmount": 0
}
```

### 3. List All Coupons
**GET** `/coupons`

Returns all stored coupons (useful for testing).

**Response (200 OK):**
```json
{
  "count": 2,
  "coupons": [
    {
      "id": 1,
      "code": "SAVE20",
      "type": "PERCENT",
      ...
    },
    {
      "id": 2,
      "code": "FLAT50",
      "type": "FLAT",
      ...
    }
  ]
}
```

## 🎯 Best Coupon Selection Logic

The system selects the best coupon using the following criteria (in priority order):

### 1. **Greatest Discount Saved**
The coupon that provides the highest discount amount is preferred.

- For **FLAT** coupons: `discount = min(discountValue, cartTotal)`
- For **PERCENT** coupons: `discount = min((cartTotal × discountValue) / 100, maxDiscountAmount)`

### 2. **Earliest Expiry Date** (Tie-breaker)
If multiple coupons provide the same discount, the one with the earliest expiry date is selected. Coupons without expiry dates are treated as having the latest possible date.

### 3. **Lexicographically Smallest Code** (Final tie-breaker)
If discount and expiry are the same, the coupon with the lexicographically smallest (alphabetically first) code is selected.

### Eligibility Checks

Before considering a coupon, the system verifies:

- ✅ **Expiry Date**: Coupon must not be expired
- ✅ **Minimum Cart Value**: Cart total must meet `minCartValue` requirement
- ✅ **User Tier**: User's tier must match `userTier` restriction (if specified)
- ✅ **Categories**: Cart must contain at least one item from allowed `categories` (if specified)
- ✅ **Usage Limit**: Coupon must not have exceeded `maxUsage` limit (if specified)

## 💡 Example Scenarios

### Example 1: FLAT vs PERCENT
- **Coupon A**: FLAT $50 off
- **Coupon B**: PERCENT 10% off (max $30)
- **Cart Total**: $200

**Calculation:**
- Coupon A discount: $50
- Coupon B discount: min($200 × 10%, $30) = $20

**Winner:** Coupon A (greater discount)

### Example 2: Same Discount, Different Expiry
- **Coupon A**: $50 off, expires 2024-12-31
- **Coupon B**: $50 off, expires 2024-06-30
- **Cart Total**: $200

**Winner:** Coupon B (earlier expiry date)

### Example 3: All Tied, Code Comparison
- **Coupon A**: $50 off, expires 2024-12-31, code "ZSAVE"
- **Coupon B**: $50 off, expires 2024-12-31, code "ASAVE"

**Winner:** Coupon B (lexicographically smaller code)

## 🔧 Assumptions

1. **Date Format**: Expiry dates are expected in ISO format (YYYY-MM-DD). The system compares dates at day-level precision.

2. **Cart Structure**: The cart object must have a `total` field (number). The `items` array is optional but required for category-based eligibility checks.

3. **User Structure**: The user object must have a `tier` field (string) for tier-based eligibility checks.

4. **Category Matching**: If a coupon specifies categories, the cart must contain at least one item with a matching category. Category names are case-sensitive.

5. **Usage Tracking**: The `usedCount` field is maintained but not automatically incremented. This would typically be handled by a separate endpoint in a production system.

6. **Discount Capping**: For FLAT coupons, the discount cannot exceed the cart total. For PERCENT coupons, `maxDiscountAmount` (if provided) caps the discount.

7. **No Authentication**: As per requirements, no authentication or authorization is implemented.

8. **In-Memory Storage**: All data is stored in memory and will be lost on server restart. This is intentional for this assignment.

## 📁 Final Folder Structure

```
Coupon Management/
│
├── backend/
│   ├── controllers/
│   │   └── couponController.js       # Request handlers for coupon operations
│   ├── routes/
│   │   └── couponRoutes.js           # Express route definitions
│   ├── utils/
│   │   ├── couponStorage.js          # In-memory storage and eligibility logic
│   │   └── couponComparator.js       # Best coupon selection algorithm
│   ├── index.js                      # Express app entry point
│   └── package.json                  # Backend dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout.jsx            # Layout with navigation header
│   │   ├── pages/
│   │   │   ├── CreateCoupon.jsx      # Create coupon page
│   │   │   ├── FindBestCoupon.jsx    # Find best coupon page
│   │   │   └── AllCoupons.jsx        # View all coupons page
│   │   ├── App.jsx                   # Main React component with routing
│   │   ├── main.jsx                  # React entry point
│   │   └── index.css                 # Tailwind CSS directives
│   ├── index.html                    # HTML template
│   ├── vite.config.js                # Vite configuration
│   ├── tailwind.config.js            # Tailwind CSS configuration
│   ├── postcss.config.js             # PostCSS configuration
│   └── package.json                  # Frontend dependencies
│
└── README.md                         # This file
```

## 🧪 Testing the API

### Using cURL

**Create a coupon:**
```bash
curl -X POST http://localhost:3000/coupons \
  -H "Content-Type: application/json" \
  -d '{
    "code": "SUMMER20",
    "type": "PERCENT",
    "discountValue": 20,
    "minCartValue": 500
  }'
```

**Get best coupon:**
```bash
curl -X POST http://localhost:3000/coupons/best-coupon \
  -H "Content-Type: application/json" \
  -d '{
    "user": {"tier": "GOLD"},
    "cart": {"total": 1000, "items": [{"category": "electronics"}]}
  }'
```

**List all coupons:**
```bash
curl http://localhost:3000/coupons
```

### Using the Frontend UI

1. Start both backend and frontend servers
2. Open `http://localhost:5173` in your browser
3. Use the "Add New Coupon" form to create coupons
4. Use the "Test Best Coupon" section with JSON input to test the best-coupon endpoint

## 📝 Notes

- The backend uses ES Modules (`"type": "module"` in package.json)
- CORS is enabled to allow frontend requests
- All validation errors return appropriate HTTP status codes (400 for bad requests, 500 for server errors)
- The frontend includes basic error handling and user feedback
- No database is used - all data is stored in memory and will be reset on server restart


