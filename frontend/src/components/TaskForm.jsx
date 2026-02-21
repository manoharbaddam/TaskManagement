import { useEffect, useState } from "react";
import api from "../api/axios";

const TaskForm = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        status: "ASSIGNED",
        priority: "MEDIUM",
        due_date: "",
        assigned_to: "", // Needs to be a valid User UUID
    });

    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // 🆕 Fetch users as soon as the modal opens
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get("/api/v1/users");
                setUsers(response.data.results || response.data);
            } catch (err) {
                console.error("Failed to fetch users for the dropdown:", err);
                setError("Could not load user list. Please try again.");
            }
        };
        fetchUsers();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            await api.post("/api/v1/tasks/", formData);
            onSuccess();
            onClose();
        } catch (err) {
            console.error("Task Creation Error:", err);
            if (
                err.response &&
                err.response.data &&
                err.response.data.message
            ) {
                // Formatting the Django validation errors into a readable string
                const errorObj = err.response.data.message;
                const errorMsg = Object.keys(errorObj)
                    .map((key) => `${key}: ${errorObj[key]}`)
                    .join(" | ");
                setError(errorMsg);
            } else {
                setError("Failed to create task. Check the console.");
            }
        } finally {
            setIsLoading(true);
        }
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <div style={styles.header}>
                    <h3>Create New Task</h3>
                    <button onClick={onClose} style={styles.closeBtn}>
                        &times;
                    </button>
                </div>

                {error && <div style={styles.errorBox}>{error}</div>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <input
                        type="text"
                        name="title"
                        placeholder="Task Title"
                        required
                        value={formData.title}
                        onChange={handleChange}
                        style={styles.input}
                    />

                    <textarea
                        name="description"
                        placeholder="Task Description"
                        required
                        value={formData.description}
                        onChange={handleChange}
                        style={{ ...styles.input, minHeight: "80px" }}
                    />

                    <div style={styles.row}>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            style={styles.input}
                        >
                            <option value="ASSIGNED">Assigned</option>
                            <option value="ACCEPTED">Accepted</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="COMPLETED">Completed</option>
                        </select>

                        <select
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            style={styles.input}
                        >
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                        </select>
                    </div>

                    <div style={styles.row}>
                        <input
                            type="date"
                            name="due_date"
                            required
                            value={formData.due_date}
                            onChange={handleChange}
                            style={styles.input}
                        />
                        <select
                            name="assigned_to"
                            required
                            value={formData.assigned_to}
                            onChange={handleChange}
                            style={styles.input}
                        >
                            <option value="" disabled>
                                Select Assignee...
                            </option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.first_name} {user.last_name} (
                                    {user.email})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={styles.actions}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={styles.cancelBtn}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            style={styles.submitBtn}
                        >
                            {isLoading ? "Saving..." : "Create Task"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    },
    modal: {
        width: "100%",
        maxWidth: "500px",
        backgroundColor: "white",
        borderRadius: "8px",
        padding: "2rem",
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "1.5rem",
    },
    closeBtn: {
        background: "none",
        border: "none",
        fontSize: "1.5rem",
        cursor: "pointer",
        color: "#64748b",
    },
    form: { display: "flex", flexDirection: "column", gap: "1rem" },
    row: { display: "flex", gap: "1rem" },
    input: {
        flex: 1,
        padding: "0.75rem",
        borderRadius: "4px",
        border: "1px solid #ccc",
        fontSize: "1rem",
        fontFamily: "inherit",
    },
    actions: {
        display: "flex",
        justifyContent: "flex-end",
        gap: "1rem",
        marginTop: "1rem",
    },
    cancelBtn: {
        padding: "0.75rem 1.5rem",
        backgroundColor: "#e2e8f0",
        color: "#475569",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontWeight: "bold",
    },
    submitBtn: {
        padding: "0.75rem 1.5rem",
        backgroundColor: "#10b981",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontWeight: "bold",
    },
    errorBox: {
        backgroundColor: "#fee2e2",
        color: "#b91c1c",
        padding: "0.75rem",
        borderRadius: "4px",
        marginBottom: "1rem",
        fontSize: "0.875rem",
    },
};

export default TaskForm;
