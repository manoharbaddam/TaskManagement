import { useState } from "react";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";

import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";

function App() {
    const [count, setCount] = useState(0);

    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* 🔓 Public Routes (Anyone can visit these) */}
                    <Route path="/login" element={<Login />} />

                    {/* Redirect the root URL to the dashboard automatically */}
                    <Route
                        path="/"
                        element={<Navigate to="/dashboard" replace />}
                    />

                    {/* 🔒 Protected Routes (Only logged-in users get past here) */}
                    <Route element={<PrivateRoute />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        {/* Any other private pages (like /profile) will go inside this block! */}
                    </Route>

                    {/* 404 Catch-All */}
                    <Route path="*" element={<h1>404 - Page Not Found</h1>} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
