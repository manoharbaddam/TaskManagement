import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";

const Register = () => {
    //1. Form State (Grouped into an object for cleaner code)
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        confirm_password: "",
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        // 🛡️ Client-Side Validation: Check if passwords match BEFORE asking Django
        if (formData.password != formData.confirm_password) {
            setErrors({ confirm_password: "Passwords do not match" });
            return;
        }

        setIsLoading(true);

        try {
            //🚀 Send the data to our Django backend
            // We strip out 'confirm_password' because Django doesn't expect it in the serializer
            const payload = {
                first_name: formData.firstname,
                lastname: formData.lastname,
                email: formData.email,
                password: formData.password,
            };

            await api.post("api/v1/users/register/", payload);

            // 🎯 Success! Redirect to login page
            alert("Registration successful! You can now log in.");
            navigate("/login");
        } catch (err) {
            console.error("Registration Error:", err);

            // 🛑 Handle DRF Validation Errors (e.g., {"email": ["User with this email already exists."]})
            if (
                err.response &&
                err.response.data &&
                err.response.data.message
            ) {
                if (typeof err.response.data.message === "object") {
                    setErrors(err.response.data.message);
                } else {
                    setErrors({ general: err.response.data.message.detail });
                }
            } else {
                setErrors({
                    general: "Cannot connect to the server. Is Django running?",
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2>Create an Account</h2>
                <p>Join TaskMaster Pro today.</p>

                {/* Show general server errors here */}
                {errors.general && (
                    <div style={styles.errorBox}>{errors.general}</div>
                )}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.row}>
                        <div style={styles.inputGroup}>
                            <label>First Name</label>
                            <input
                                type="text"
                                name="first_name"
                                required
                                value={formData.first_name}
                                onChange={handleChange}
                                style={styles.input}
                            />
                            {errors.first_name && (
                                <span style={styles.fieldError}>
                                    {errors.first_name[0]}
                                </span>
                            )}
                        </div>
                        <div style={styles.inputGroup}>
                            <label>Last Name</label>
                            <input
                                type="text"
                                name="last_name"
                                required
                                value={formData.last_name}
                                onChange={handleChange}
                                style={styles.input}
                            />
                            {errors.last_name && (
                                <span style={styles.fieldError}>
                                    {errors.last_name[0]}
                                </span>
                            )}
                        </div>
                    </div>

                    <div style={styles.inputGroup}>
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            style={styles.input}
                        />
                        {/* If Django says email is taken, it shows up right under the field! */}
                        {errors.email && (
                            <span style={styles.fieldError}>
                                {errors.email[0]}
                            </span>
                        )}
                    </div>

                    <div style={styles.inputGroup}>
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            style={styles.input}
                        />
                        {errors.password && (
                            <span style={styles.fieldError}>
                                {errors.password[0]}
                            </span>
                        )}
                    </div>

                    <div style={styles.inputGroup}>
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            name="confirm_password"
                            required
                            value={formData.confirm_password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            style={styles.input}
                        />
                        {errors.confirm_password && (
                            <span style={styles.fieldError}>
                                {errors.confirm_password}
                            </span>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        style={styles.button}
                    >
                        {isLoading ? "Creating Account..." : "Register"}
                    </button>
                </form>

                <p style={styles.footerText}>
                    Already have an account?{" "}
                    <Link to="/login">Log in here</Link>
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
        minHeight: "100vh",
        backgroundColor: "#f4f7f6",
        padding: "2rem",
    },
    card: {
        width: "100%",
        maxWidth: "450px",
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
    row: { display: "flex", gap: "1rem" }, // Puts First Name and Last Name side by side
    inputGroup: {
        display: "flex",
        flexDirection: "column",
        textAlign: "left",
        flex: 1,
    },
    input: {
        padding: "0.75rem",
        borderRadius: "4px",
        border: "1px solid #ccc",
        fontSize: "1rem",
    },
    button: {
        padding: "0.75rem",
        backgroundColor: "#10b981",
        color: "white",
        border: "none",
        borderRadius: "4px",
        fontSize: "1rem",
        cursor: "pointer",
        marginTop: "0.5rem",
        fontWeight: "bold",
    },
    errorBox: {
        backgroundColor: "#fee2e2",
        color: "#b91c1c",
        padding: "0.75rem",
        borderRadius: "4px",
        marginTop: "1rem",
        fontSize: "0.875rem",
    },
    fieldError: { color: "#ef4444", fontSize: "0.75rem", marginTop: "0.25rem" },
    footerText: {
        marginTop: "1.5rem",
        textAlign: "center",
        fontSize: "0.875rem",
    },
};

export default Register;
