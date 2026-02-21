# 🚀 TaskMaster Pro (Full-Stack Architecture)

> A decoupled, enterprise-grade task management platform featuring secure JWT authentication, strict Role-Based Access Control (RBAC), and a dynamic React frontend.



## 📋 Project Overview
TaskMaster Pro is designed to demonstrate advanced full-stack architectural patterns. It utilizes a RESTful API backend to manage data securely and a Single Page Application (SPA) frontend to deliver a seamless, state-driven user experience. 

The application solves common enterprise challenges such as token expiration handling, relational data fetching, and role-based UI rendering.

---

## 🛠️ Tech Stack
* **Backend:** Python, Django, Django REST Framework (DRF), PostgreSQL
* **Frontend:** JavaScript, React (via Vite), React Router DOM
* **Networking & Security:** Axios, JSON Web Tokens (JWT), CORS headers

---

## 🧠 System Architecture

### 1. Database & API Foundation
* **Custom User Model:** Replaced Django's default username authentication with an Email-based login system featuring embedded Role-Based Access Control (ADMIN vs. USER).
* **Relational Database:** Engineered a robust Task model with Foreign Keys linking tasks to their creators and assignees.
* **Dynamic Serializers:** Utilized `SerializerMethodField` to calculate and inject human-readable relational data (like the Assignee's full name) directly into the API response, optimizing frontend performance.

### 2. Security & Access Control
* **Stateless Authentication:** Implemented JWT access and refresh tokens, ensuring the server remains stateless and highly scalable.
* **Granular API Permissions:** Enforced strict backend business logic:
  * Users can only view tasks assigned to them.
  * Only Admins can create or delete tasks.
  * Anyone can update the status of a task they possess.

### 3. Frontend State & Routing
* **Global State Management:** Engineered a React Context provider to hold the authenticated user's profile and tokens in memory, eliminating prop-drilling.
* **Protected Routing:** Built frontend security gates that instantly redirect unauthenticated users to the login screen.
* **Axios Interceptor & Silent Refresh:** Engineered an automated delivery system that attaches authorization headers to outgoing requests. It features a "Silent Refresh" engine that catches 401 Unauthorized errors, fetches a new token in the background, and seamlessly replays the failed request without interrupting the user's workflow.

### 4. Dynamic User Interface
* **Role-Based UI Rendering:** The React application intelligently reads the global user state and physically alters the DOM based on permissions (e.g., hiding "Delete" buttons from standard users).
* **Reusable Component Architecture:** Engineered a dynamic Modal component that serves as both a "Create Task" and "Edit Task" form depending on the injected props, keeping the codebase DRY.

### 5. Advanced Data Handling
* **Server-Side Filtering:** Implemented `django-filter` to handle search and status queries on the database level, preventing the frontend from downloading and parsing unnecessary data.

---

## 🚦 Getting Started (Local Development)

### Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Create a virtual environment: `python -m venv venv`
3. Activate the environment: `source venv/bin/activate` (Mac/Linux) or `venv\Scripts\activate` (Windows)
4. Install dependencies: `pip install -r requirements.txt`
5. Run migrations: `python manage.py migrate`
6. Start the server: `python manage.py runserver`

### Frontend Setup
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Create a `.env` file and add your backend URL: `VITE_API_URL=http://127.0.0.1:8000`
4. Start the development server: `npm run dev`

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.