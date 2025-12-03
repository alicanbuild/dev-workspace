import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

export function Layout() {
    const clearAuth = useAuthStore((state) => state.clearAuth);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const navigate = useNavigate();

    const handleLogout = () => {
        clearAuth();
        navigate("/login");
    };

    return (
        <div
            style={{
                display: "flex",
                minHeight: "100vh",
                fontFamily: "system-ui, sans-serif",
            }}
        >

            <aside
                style={{
                    width: "220px",
                    borderRight: "1px solid #e5e7eb",
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                }}
            >

                <div>
                    <h2 style={{ fontSize: "18px", marginBottom: "16px" }}>Dev Workspace</h2>

                    <nav style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <NavLink to="/" style={{ textDecoration: "none" }}>
                            Dashboard
                        </NavLink>
                        <NavLink to="/login" style={{ textDecoration: "none" }}>
                            Login
                        </NavLink>
                        <NavLink to="/register" style={{ textDecoration: "none" }}>
                            Register
                        </NavLink>
                    </nav>
                </div>

                {isAuthenticated && (
                    <button
                        onClick={handleLogout}
                        style={{
                            marginTop: "24px",
                            padding: "8px 12px",
                            background: "#ef4444",
                            color: "#fff",
                            border: "none",
                            cursor: "pointer",
                            borderRadius: "4px",
                        }}
                    >
                        Logout
                    </button>
                )}
            </aside>


            <main style={{ flex: 1, padding: "24px" }}>
                <Outlet />
            </main>
        </div>
    );
}
