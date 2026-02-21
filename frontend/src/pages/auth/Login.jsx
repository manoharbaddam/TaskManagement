import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import api from "../../api/axios"; // Our custom Axios delivery driver

const login = () => {
    // 1. Form State
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // 2. UI State
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // 3. Hooks
    const { login } = useAuth(); // Grab the login function from our global brain
    const navigate = useNavigate(); // Used to redirect the user after success

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the page from refreshing on submit
        setError("");
        setIsLoading(true);

        try {
            // 🚀 Send the credentials to your Django backend
            const response = await api.post("/api/v1/users/login/", {
                email,
                password,
            });

            // 🎯 Success! Extract the data based on the custom serializer we built in Django
            const { access, refresh, user } = response.data;

            // 🧠 Save the user and tokens into global React state & LocalStorage
            login(user, { access, refresh });

            // 🚦 Redirect the user past the PrivateRoute to the Dashboard
            navigate("/dashboard");
        } catch (err) {
            console.error("THE REAL FRONTEND ERROR:", err);

            if (
                err.response &&
                err.repsonse.data &&
                err.response.data.message
            ) {
                setError(
                    err.response.data.message.detail ||
                        "Invalid email or password",
                );
            } else {
                setError("Cannot connect to the Server. Is Django running?");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2>Welcome Back</h2>
                <p>Log in to manage your tasks.</p>

                {/* Show error message if login fails */}
                {error && <div style={styles.errorBox}>{error}</div>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label>Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="architect@example.com"
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label>Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            style={styles.input}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        style={styles.button}
                    >
                        {isLoading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p style={styles.footerText}>
                    Don't have an account?{" "}
                    <Link to="/register">Register here</Link>
                </p>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f4f7f6",
        color: "#000000",

    },
    card: {
        width: "100%",
        maxWidth: "400px",
        padding: "2rem",
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        marginTop: "1rem",
    },
    inputGroup: { display: "flex", flexDirection: "column", textAlign: "left" },
    input: {
        padding: "0.75rem",
        borderRadius: "4px",
        border: "1px solid #ccc",
        fontSize: "1rem",
    },
    button: {
        padding: "0.75rem",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "4px",
        fontSize: "1rem",
        cursor: "pointer",
    },
    errorBox: {
        backgroundColor: "#fee2e2",
        color: "#b91c1c",
        padding: "0.75rem",
        borderRadius: "4px",
        marginTop: "1rem",
        fontSize: "0.875rem",
    },
    footerText: {
        marginTop: "1.5rem",
        textAlign: "center",
        fontSize: "0.875rem",
    },
};

export default login;
