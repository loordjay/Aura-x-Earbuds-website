# Aura-X Earbuds E-Commerce Website

## Overview

Aura-X is a modern, responsive e-commerce website dedicated to showcasing and selling high-quality wireless earbuds. Built with a focus on user experience, the platform features a sleek design, intuitive navigation, and comprehensive product information. Users can browse a curated selection of earbuds, read detailed descriptions and specifications, view customer reviews, and make purchases through a secure checkout process.

The website includes user authentication, shopping cart functionality, payment processing, and order management. It's designed to provide an immersive shopping experience for audio enthusiasts, with features like product carousels, contact forms, and an about section highlighting the developer's expertise.

## Features

### Frontend
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices using CSS and Tailwind CSS.
- **Product Carousel**: Interactive slider showcasing featured earbuds with detailed views.
- **Product Pages**: In-depth descriptions, specifications, and add-to-cart functionality for each earbud model.
- **User Authentication**: Login and signup pages with form validation.
- **Shopping Cart**: Add items to cart, view cart contents, and proceed to checkout.
- **Contact Form**: Integrated with Web3Forms for user inquiries.
- **Reviews Section**: Customer testimonials and ratings for products.
- **About Section**: Developer profile and project information.
- **Navigation**: Smooth scrolling and mobile-friendly menu.

### Backend
- **User Management**: Registration, login, and profile retrieval with password hashing.
- **Cart Management**: Save and manage user carts.
- **Payment Processing**: Secure payment data storage (note: for demo purposes; integrate with real payment gateways in production).
- **Order Management**: Place and track orders.
- **API Endpoints**: RESTful APIs for all operations.
- **Database**: MongoDB for data persistence.

### Additional Features
- **Security**: Password hashing with bcrypt, input validation.
- **Static File Serving**: Serves HTML, CSS, JS, and images.
- **Error Handling**: Comprehensive error responses for API calls.
- **Cross-Platform Compatibility**: Works on iOS, Android, and Windows devices.

## Tech Stack

### Frontend
- **HTML5**: Structure and content.
- **CSS3**: Styling with custom styles and Tailwind CSS for utility classes.
- **JavaScript**: Client-side interactivity (e.g., carousel, cart functionality).
- **Libraries**: Tailwind CSS (via CDN), Smooth Scroll, Locomotive Scroll.

### Backend
- **Node.js**: Runtime environment.
- **Express.js**: Web framework for building APIs and serving static files.
- **MongoDB**: NoSQL database for user, cart, payment, and order data.
- **Mongoose**: ODM for MongoDB interactions.
- **bcrypt**: Password hashing for security.
- **body-parser**: Middleware for parsing request bodies.

### Development Tools
- **npm**: Package management.
- **VS Code**: Recommended IDE.
- **Git**: Version control.

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or cloud service like MongoDB Atlas)
- npm (comes with Node.js)

### Steps
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/aura-x-earbuds.git
   cd aura-x-earbuds
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up MongoDB**:
   - Ensure MongoDB is running locally on `mongodb://localhost:27017/loginapp`.
   - Alternatively, update the `mongoURI` in `server.js` to point to your MongoDB instance.

4. **Run the Server**:
   ```bash
   node server.js
   ```
   - The server will start on `http://localhost:3000`.

5. **Access the Website**:
   - Open your browser and navigate to `http://localhost:3000`.
   - Explore the homepage, login/signup, cart, and other pages.

## Usage

### Browsing Products
- Visit the homepage to view the product carousel.
- Click "SEE MORE" on any item for detailed specifications.
- Use "Add to Cart" to add products (random prices are assigned for demo).

### User Authentication
- Click "Login" to access the login page.
- New users can sign up via the signup page.
- Authenticated users can view their dashboard and manage carts.

### Shopping Cart and Checkout
- Add items to the cart from product details.
- View the cart at `/cart.html`.
- Proceed to checkout (payment form saves data but does not process real transactions).

### API Usage
- Use tools like Postman or curl to interact with APIs.
- Example: Register a user:
  ```bash
  curl -X POST http://localhost:3000/api/signup -H "Content-Type: application/json" -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
  ```

## API Documentation

### Authentication
- **POST /api/signup**: Register a new user.
  - Body: `{ "username": "string", "email": "string", "password": "string" }`
  - Response: Success message or error.

- **POST /api/login**: Log in a user.
  - Body: `{ "username": "string", "password": "string" }`
  - Response: Success with email or error.

- **GET /api/user/:username**: Get user profile (excluding password).
  - Response: User data or error.

### Cart
- **POST /api/cart**: Save cart items.
  - Body: `{ "username": "string", "items": [{ "name": "string", "price": number, "quantity": number }] }`
  - Response: Success with cart ID.

### Payment
- **POST /api/payment**: Save payment details.
  - Body: `{ "username": "string", "nameOnCard": "string", "cardNumber": "string", "expiryDate": "string", "cvv": "string", "amount": number }`
  - Response: Success with payment ID.

### Orders
- **POST /api/order**: Place an order.
  - Body: `{ "username": "string", "cartId": "string", "paymentId": "string" }`
  - Response: Success with order ID.

## Screenshots

(Include screenshots here if available. For now, describe key pages:)

- **Homepage**: Product carousel with earbud images and descriptions.
- **Product Detail**: Expanded view with specs and add-to-cart button.
- **Login Page**: Clean form for user authentication.
- **Cart Page**: List of items with checkout option.
- **Contact Form**: User inquiry submission.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature (`git checkout -b feature/new-feature`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature/new-feature`).
5. Create a Pull Request.

Ensure code follows best practices, includes tests if applicable, and updates documentation.

## License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.

## Author

**Jayesh Koli**  
- Full-Stack Developer  
- Passionate about web development and audio technology  
- [LinkedIn](https://www.linkedin.com/in/jayesh-koli-0aa2b6217)  
- [Instagram](https://www.instagram.com/lord_jayesh/)  
- Email: [your-email@example.com]

## Acknowledgments

- Thanks to the open-source community for libraries like Express, Mongoose, and Tailwind CSS.
- Product images and descriptions are for demonstration purposes.
- Inspired by modern e-commerce platforms and audio gadget reviews.

## Future Enhancements

- Integrate real payment gateways (e.g., Stripe, PayPal).
- Add user reviews and ratings functionality.
- Implement search and filtering for products.
- Enhance mobile responsiveness and accessibility.
- Add admin panel for product management.

---

For any issues or questions, please open an issue on GitHub or contact the author.
