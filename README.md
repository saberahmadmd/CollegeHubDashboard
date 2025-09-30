# 🎓 CollegeHub Dashboard
A comprehensive full-stack **College Dashboard application** that allows users to browse colleges, apply filters, save favorites, and manage reviews with a modern, responsive interface.

## ✨ Features

### 🎯 Core Functionality
- **College Browsing**: View colleges in an elegant card-based layout  
- **Advanced Filtering**: Filter by location, course, fee range, and search by name  
- **Smart Sorting**: Sort colleges by fee (low → high, high → low) or name  
- **Favorites System**: Bookmark preferred colleges for quick access  
- **Review Management**: Add and delete reviews with ratings and comments  

### 🎨 User Experience
- **Dark/Light Mode**: Toggle between themes for comfortable viewing  
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices  
- **Real-time Updates**: Instant feedback on actions and filters  
- **Error Handling**: User-friendly error messages and loading states  

### 🔧 Technical Features
- **RESTful API**: Clean backend architecture with proper error handling  
- **Database Persistence**: SQLite database with proper schema design  
- **CORS Enabled**: Secure cross-origin resource sharing  
- **Environment Configuration**: Easy configuration through environment variables  

## 🛠 Tech Stack

### Frontend
- React 18 (Hooks)  
- React Router DOM  
- CSS3 (with CSS Variables for theming)  
- Fetch API (with error handling)  

### Backend
- Node.js  
- Express.js  
- SQLite3  
- CORS  
- dotenv  

## 📁 Project Structure

```text
college-dashboard/
├── backend/
│   ├── routes/
│   │   ├── colleges.js
│   │   ├── reviews.js
│   │   └── favorites.js
│   ├── database.js
│   ├── server.js
│   ├── .env
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Home/
    │   │   ├── Colleges/
    │   │   ├── Reviews/
    │   │   ├── Favorites/
    │   │   ├── Logout/
    │   │   └── Navigation/
    │   ├── services/
    │   │   └── api.js
    │   ├── App.js
    │   ├── App.css
    │   └── index.js
    ├── public/
    ├── .env
    └── package.json

🗄 API Endpoints
Colleges
GET /api/colleges – Get all colleges (with optional filters)
GET /api/colleges/filters – Get filter options

Reviews
GET /api/reviews – Get all reviews
POST /api/reviews – Add a new review
DELETE /api/reviews/:id – Delete a review

Favorites
GET /api/favorites – Get favorites
POST /api/favorites – Add college to favorites
DELETE /api/favorites/:id – Remove from favorites

🎮 Usage Guide
Browsing Colleges
Go to Colleges page
Use filters: location, course, fee range
Search colleges by name
Sort by fee or name
⭐ Add to Favorites
Managing Reviews
Open Reviews page
Fill form → College, Rating, Comment
Submit → Review added
🗑️ Delete to remove review
Viewing Favorites
Visit Favorites page
Remove using "Remove from Favorites"
Theme Switching
Click 🌙/☀️ toggle in navbar


📊 Sample Data
8 colleges across Hyderabad, Bangalore, Chennai
Courses: CS, Electronics, MBA, MBBS, Law, etc.
Preloaded reviews
Fee range: ₹80,000 – ₹2,50,000

🛡 Error Handling
Frontend: Friendly error messages + retry

Backend: Proper HTTP codes & messages

Database: Query validation & error handling

🔮 Future Enhancements
User authentication & personalized favorites
College comparison
Multi-location/course filtering
College details modal
College photo uploads
Pagination for large lists
Export favorites









