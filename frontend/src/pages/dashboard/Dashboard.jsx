import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import api from "../../api/axios";
import TaskForm from "../../components/TaskForm";

const Dashboard = () => {
    const { user, logout } = useAuth(); // Grab the user object and logout function

    //State for our tasks
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await api.get("api/v1/tasks/");
            setTasks(response.data.results || response.data);
            setError("");
        } catch (err) {
            console.error("Error fetching tasks: ", err);
            setError("Failed to load tasks.Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            {/* --NavBar Section */}
            <nav style={styles.navbar}>
                <h2>TaskManager Pro</h2>
                <div style={styles.userInfo}>
                    <span>
                        Welcome, <strong>{user?.email}</strong>
                    </span>
                    <span style={styles.roleBadge}>{user?.role}</span>
                    <button onClick={logout} style={styles.logoutBtn}>
                        Logout
                    </button>
                </div>
            </nav>

            {/* --- MAIN CONTENT SECTION --- */}
            <main style={styles.main}>
                <div style={styles.header}>
                    <h1>Your Tasks</h1>
                    {/* Only show the 'Create Task' button if the user is an ADMIN */}
                    {user?.role === "ADMIN" && (
                        <button
                            onClick={() => setIsModalOpen(true)} 
                            style={styles.createBtn}
                        >
                            + New Task
                        </button>
                    )}
                </div>

                {error && <div style={styles.errorBox}>{error}</div>}

                {isLoading ? (
                    <p>Loading your tasks...</p>
                ) : tasks.length === 0 ? (
                    <div style={styles.emptyState}>
                        <p>No tasks found. You're all caught up!</p>
                    </div>
                ) : (
                    <div style={styles.taskGrid}>
                        {tasks.map((task) => (
                            <div key={task.id} style={styles.taskCard}>
                                <h3>{task.title}</h3>
                                <p style={styles.desc}>{task.description}</p>
                                <div style={styles.meta}>
                                    <span style={styles.status(task.status)}>
                                        {task.status}
                                    </span>
                                    <span style={styles.priority}>
                                        {task.priority} Priority
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
            {isModalOpen && (
                <TaskForm 
                    onClose={() => setIsModalOpen(false)} 
                    onSuccess={fetchTasks} 
                />
            )}
        </div>
    );
};

const styles = {
    container: {
        minHeight: "100vh",
        backgroundColor: "#d0d0d0",
        fontFamily: "sans-serif",
        color: "#1c1c1c",
    },
    navbar: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 2rem",
        backgroundColor: "#1e293b",
        color: "white",
    },
    userInfo: { display: "flex", gap: "1rem", alignItems: "center" },
    roleBadge: {
        backgroundColor: "#3b82f6",
        padding: "0.2rem 0.5rem",
        borderRadius: "4px",
        fontSize: "0.8rem",
        fontWeight: "bold",
    },
    logoutBtn: {
        padding: "0.5rem 1rem",
        backgroundColor: "#ef4444",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
    },
    main: { padding: "2rem", maxWidth: "1200px", margin: "0 auto" },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "2rem",
    },
    createBtn: {
        padding: "0.75rem 1.5rem",
        backgroundColor: "#10b981",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontWeight: "bold",
    },
    errorBox: {
        backgroundColor: "#7e7e7e",
        color: "#b91c1c",
        padding: "1rem",
        borderRadius: "4px",
        marginBottom: "1rem",
    },
    emptyState: {
        textAlign: "center",
        padding: "3rem",
        backgroundColor: "white",
        borderRadius: "8px",
        color: "#64748b",
    },
    taskGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "1.5rem",
    },
    taskCard: {
        backgroundColor: "white",
        color: "#000000",
        padding: "1.5rem",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
    },
    desc: { color: "#475569", fontSize: "0.9rem", margin: 0 },
    meta: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "auto",
        paddingTop: "1rem",
        borderTop: "1px solid #e2e8f0",
    },
    status: (status) => ({
        padding: "0.25rem 0.75rem",
        borderRadius: "999px",
        fontSize: "0.75rem",
        fontWeight: "bold",
        backgroundColor:
            status === "DONE"
                ? "#d1fae5"
                : status === "IN_PROGRESS"
                  ? "#fef3c7"
                  : "#e0e7ff",
        color:
            status === "DONE"
                ? "#065f46"
                : status === "IN_PROGRESS"
                  ? "#92400e"
                  : "#3730a3",
    }),
    priority: { fontSize: "0.8rem", color: "#64748b", fontWeight: "500" },
};

export default Dashboard;
