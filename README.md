# JOSAM Fashion Store - Frontend

![React](https://img.shields.io/badge/React-19.1.0-blue.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC.svg)
![React Router](https://img.shields.io/badge/React_Router-7.7.0-CA472F.svg)
![Axios](https://img.shields.io/badge/Axios-1.10.0-5A29E4.svg)

JOSAM is a modern, responsive e-commerce frontend for a fast-growing menswear fashion brand based in Egypt. Built with React, Tailwind CSS, and React Router, it offers a seamless shopping experience with features like product browsing, cart management, user authentication, order tracking, and career applications.

## 🌟 Features

- **Responsive Design**: Fully mobile-friendly interface using Tailwind CSS
- **User Authentication**: Login and registration system with JWT token management
- **Product Management**: Browse, view details, and add items to cart or wishlist
- **Shopping Cart**: Full cart functionality with quantity adjustment and price calculation
- **Checkout Process**: Multi-step checkout with shipping information and order summary
- **Order Tracking**: Track orders by ID with visual status indicators
- **User Profile**: View account info, order history, and messages
- **Career Applications**: Apply for open positions with file upload (resume)
- **Messaging System**: User inbox with read/unread status and notifications
- **Help Center**: FAQ section and customer support contact form
- **SEO-Friendly Routes**: Properly structured routing for all pages

## 🛠️ Technologies Used

- **Frontend Framework**: [React 19.1.0](https://react.dev/)
- **Styling**: [Tailwind CSS 3.4.17](https://tailwindcss.com/)
- **Routing**: [React Router DOM 7.7.0](https://reactrouter.com/)
- **HTTP Client**: [Axios 1.10.0](https://axios-http.com/)
- **State Management**: React Hooks (useState, useEffect)
- **Authentication**: JWT tokens stored in cookies (js-cookie)
- **UI Components**: Custom components with React and Tailwind
- **Icons**: react-icons and Heroicons
- **Toast Notifications**: react-hot-toast
- **Form Validation**: HTML5 validation + custom JavaScript

## 📁 Project Structure

```

src/
├── components/ # Reusable UI components
├── pages/ # Page-level components
├── utils/ # Utility functions (Toast notifications)
├── App.js # Main application component with routing
├── index.js # Entry point
└── styles/
└── index.css # Tailwind imports and global styles

```

## 🔧 Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation Steps

1. **Clone the repository:**

```bash
git clone https://github.com/your-username/josam-frontend.git
cd josam-frontend
```

2. **Install dependencies:**

```bash
npm install
```

3. **Create a `.env` file** in the root directory with your API URL:

```env
REACT_APP_API_URL=http://localhost:5000
```

4. **Start the development server:**

```bash
npm start
```

5. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)

### Environment Variables

Create a `.env` file in the root directory with the following variables:

| Variable            | Description          | Example                 |
| ------------------- | -------------------- | ----------------------- |
| `REACT_APP_API_URL` | Backend API base URL | `http://localhost:5000` |

## 🚀 Available Scripts

```bash
# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build

# Eject from Create React App (not recommended)
npm run eject
```

## 🌐 API Integration

This frontend is designed to work with a backend API. The following endpoints are used:

- Authentication: `/api/auth/login`, `/api/auth/register`
- Products: `/api/products`
- Orders: `/api/orders`
- Users: `/api/users/profile`
- Careers: `/api/careers/apply`
- Messages: `/api/messages`

Ensure your backend server is running and accessible at the URL specified in `REACT_APP_API_URL`.

## 🎨 Design System

- **Primary Color**: Indigo (`#4f46e5`)
- **Typography**: System font stack with responsive sizing
- **Spacing**: Tailwind's spacing scale (4px base)
- **Shadows**: Custom shadow levels for depth
- **Border Radius**: Consistent rounded corners (xl: 0.75rem, 2xl: 1rem)

## 📱 Responsive Breakpoints

- **Mobile**: Up to 640px
- **Tablet**: 640px - 1024px
- **Desktop**: 1024px and above

The application uses a mobile-first approach with responsive layouts that adapt to different screen sizes using Tailwind's responsive prefixes.

## 📝 Key Functionalities

### Authentication Flow

- Users can register and log in
- JWT tokens are stored in cookies with 7-day expiration
- Protected routes redirect to login if unauthenticated

### Shopping Experience

- Product browsing with search and filtering
- Detailed product views with image galleries
- Add to cart and wishlist functionality
- Cart management with quantity updates

### Checkout Process

- Shipping information form with validation
- Order summary with price calculation
- Multiple payment options (currently Cash on Delivery)
- Order confirmation page

### User Dashboard

- Profile information viewing
- Order history with status tracking
- Message inbox with notification badges
- Account settings

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🧑‍💻 Developed By

[Gerges Samuel @josamcode]  
Frontend & Backend Developer

---

> 💡 Tip: You can expand this backend with payment gateway integration (e.g., Stripe, PayPal), search & filtering enhancements, and caching (e.g., Redis) for better performance.

---
