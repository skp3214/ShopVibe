# ShopVibe Upgrade

Welcome to **ShopVibe**, a full-featured e-commerce platform built using the MERN stack and TypeScript for both the frontend and backend. This application ensures a seamless shopping experience with features like user authentication, cart management, product browsing, and an admin dashboard for managing products, orders, and transactions.


https://github.com/user-attachments/assets/5f6d020f-cf13-41df-8192-c40b2f93990b


---

## Website Link
[https://shopvibeupgrade.netlify.app/](https://shopvibeupgrade.netlify.app/)

## Features

### User Features:
- 🔒 **Authentication:** Secure login and registration using Firebase.
- 🔍 **Product Search & Filter:** Intuitive product search and filtering.
- 🛒 **Cart Management:** Add, remove, and update items in the shopping cart.
- 📦 **Order Management:** View and manage orders with detailed order information (`pending`).
- 💳 **Checkout & Payment:** Secure payments via Stripe integration.

### Admin Features:
- 📊 **Dashboard:** Comprehensive stats and analytics.
- 🛠️ **Product Management:** Add, edit, and delete products.
- 📋 **Order Management:** View and manage customer orders.
- 💰 **Transaction Management:** Monitor and manage transactions.
- 📈 **Data Visualization:** Interactive charts (Bar, Pie, Line) for insights.
- 🛠️ **Admin Tools:** Applications like Coupon Management and Stopwatch.

---

## Screenshots
![image](https://github.com/user-attachments/assets/a677af9e-deb4-4f21-bce8-c3e624f7424c)
![image](https://github.com/user-attachments/assets/b4380a64-97e6-47ea-9cdd-f13139870459)
![image](https://github.com/user-attachments/assets/f712478e-90c8-408a-8739-a90402f5b4ac)
![image](https://github.com/user-attachments/assets/2babdb72-6e81-4dbb-82de-87bff843a26f)
![image](https://github.com/user-attachments/assets/a1169aaa-ee9b-48bc-8e61-c2df2e9a7ed0)
![image](https://github.com/user-attachments/assets/cb0443f9-fb4e-46be-93d1-8e84e80e8c84)


## Installation & Setup

### Prerequisites:
- 📥 Node.js
- 📥 MongoDB
- 📥 Stripe account

### Backend Setup:
1. 📂 Clone the repository.
2. 📁 Navigate to the `backend` directory.
3. 📦 Install dependencies:
   ```bash
   npm install
   ```
4. 🛠️ Create a `.env` file with the following(or copy from .env.sample):
   ```env
   MONGO_URI=your_mongo_connection_string
   STRIPE_KEY=your_stripe_api_key
   PORT=your_port
   ```
5. 🚀 Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup:
1. 📁 Navigate to the `frontend` directory.
2. 📦 Install dependencies:
   ```bash
   npm install
   ```
3.🛠️ Create a `.env` file with the following(or copy from .env.sample):
   ```env
   VITE_FIREBASE_API_KEY=
   VITE_FIREBASE_AUTH_DOMAIN=
   VITE_FIREBASE_PROJECT_ID=
   VITE_FIREBASE_STORAGE_BUCKET=
   VITE_FIREBASE_MESSAGING_SENDER_ID=
   VITE_FIREBASE_APP_ID=

   VITE_SERVER_URL=
   VITE_STRIPE_KEY=
   ```
4. 🚀 Start the development server:
   ```bash
   npm run dev
   ```

---

## Folder Structure

### Backend:
- 📁 **`routes/`**: API routes for users, products, orders, payments, and dashboard.
- 🛠️ **`middleware/`**: Error handling middleware.
- 📂 **`utils/`**: Utility functions like database connection.
- 📂 **`uploads/`**: Static file storage.

### Frontend:
- 📁 **`pages/`**: React components for user and admin pages.
- 🗂️ **`redux/`**: Redux Toolkit slices and API integrations.
- 🛠️ **`components/`**: Reusable UI components.
- 🔑 **`firebase/`**: Firebase configuration.

---

## Tech Stack

### Frontend:
- 🔔 `react-hot-toast`: Notifications.
- 📊 `react-chartjs-2`: Data visualization.
- 🔑 `firebase`: Authentication.
- 🌐 `axios`: API calls.

### Backend:
- 🗄️ `mongoose`: MongoDB ODM.
- 🗃️ `node-cache`: Caching.
- 💳 `stripe`: Payment gateway.
- 🖼️ `cloudinary`: Image storage.
- 📂 `multer`: File handling.

---

## Deployment

- 🌍 The backend is deployed on render.
- 🌐 The frontend is deployed on netlify.

---

## Contributions

Contributions are welcome! Please fork the repository and submit a pull request for review.

---

### Contact

For any inquiries or support, please reach out to:
- 📧 **Email:** skprajapati3214@gmail.com
- 🔗 **LinkedIn:** [skp3214](https://www.linkedin.com/in/skp3214/)

