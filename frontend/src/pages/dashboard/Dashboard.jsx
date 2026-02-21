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

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await api.patch(`/api/v1/tasks/${taskId}/`, { status: newStatus });
            fetchTasks();
        } catch (err) {
            console.err("Error updating status:", err);
            alert("Failed to delete task. You might not have permission.");
        }
    };

    const handlePriorityChange = async (taskId,newPriority) =>{
        try{
            await api.patch(`/api/v1/tasks/${taskId}/`,{ priority:newPriority });
            fetchTasks();
        }
        catch(err){
            console.err("Error updating priority: ",err);
            alert("Failed to delete task. You might not have permission.");
        }
    };

    const handleDelete = async (taskId) =>{
        if(!window.confirm("Are you sure you want to delete this task?")) return ;
        try{
            await api.delete(`/api/v1/tasks/${taskId}/`);
            fetchTasks();
        }catch(err){
            console.error("Error deleting task: ",err);
            alert("Failed to delete task.You might not have permission.");
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
                                <p style={styles.assigneeText}>
                                    👤 Assigned to: <strong>{task.assignee_name}</strong>
                                </p>
                                <p style={styles.desc}>{task.description}</p>
                                

                                <div style={styles.meta}>
                                    <select
                                        value={task.status}
                                        onChange={(e) =>
                                            handleStatusChange(
                                                task.id,
                                                e.target.value,
                                            )
                                        }
                                        style={styles.statusSelect(task.status)}
                                    >
                                        <option value="ASSIGNED">
                                            Assigned
                                        </option>
                                        <option value="ACCEPTED">
                                            Accepted
                                        </option>
                                        <option value="IN_PROGRESS">
                                            In Progress
                                        </option>
                                        <option value="COMPLETED">
                                            Completed
                                        </option>
                                    </select>

                                    {user?.role === "ADMIN" ? 
                                        <span style={styles.priority}>
                                            <select
                                                value={task.priority}
                                                onChange={(e) =>
                                                    handlePriorityChange(
                                                        task.id,
                                                        e.target.value,
                                                    )
                                                }
                                                style={styles.statusSelect(
                                                    task.priority,
                                                )}
                                            >
                                                <option value="LOW">Low</option>
                                                <option value="MEDIUM">
                                                    Medium
                                                </option>
                                                <option value="HIGH">
                                                    High
                                                </option>
                                            </select>
                                        </span>
                                     : 
                                        <span style={styles.priority}>
                                            {task.priority} Priority
                                        </span>
                                    }
                                </div>
                                {/* 🛡️ ADMIN ONLY CONTROLS */}
                                {user?.role === "ADMIN" && (
                                    <div style={styles.adminControls}>
                                        {/* We will wire up the Edit button next! */}
                                        <button style={styles.editBtn}>
                                            Edit Details
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDelete(task.id)
                                            }
                                            style={styles.deleteBtn}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
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
        color: status === "COMPLETED" ? "#145500" : "#3730a3",
    }),
    statusSelect: (status) => ({
        padding: "0.25rem 0.5rem",
        borderRadius: "4px",
        fontSize: "0.8rem",
        fontWeight: "bold",
        border: "1px solid #cbd5e1",
        cursor: "pointer",
        backgroundColor: "#ffffff",
        color: status === "COMPLETED" ? "#14bf3c" : "#3730a3",
    }),
    adminControls: {
        display: "flex",
        gap: "0.5rem",
        marginTop: "1rem",
        paddingTop: "1rem",
        borderTop: "1px solid #e2e8f0",
    },
    priority: { fontSize: "0.8rem", color: "#64748b", fontWeight: "500" },
    editBtn: {
        flex: 1,
        padding: "0.5rem",
        backgroundColor: "#e2e8f0",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        color: "#334155",
        fontWeight: "bold",
    },
    deleteBtn: {
        flex: 1,
        padding: "0.5rem",
        backgroundColor: "#fee2e2",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        color: "#b91c1c",
        fontWeight: "bold",
    },
    assigneeText: { fontSize: '0.85rem', color: '#475569', marginTop: '0.5rem', marginBottom: '0.5rem' },
};

export default Dashboard;
