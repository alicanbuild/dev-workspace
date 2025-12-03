import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProjects, createProject, type Project } from "../lib/services/projectService";

export function DashboardPage() {
    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery<Project[]>({
        queryKey: ["projects"],
        queryFn: fetchProjects,
    });

    const [name, setName] = useState("");
    const [status, setStatus] = useState("active");

    const createMutation = useMutation({
        mutationFn: createProject,
        onSuccess: () => {
            // listeyi yenile
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            setName("");
            setStatus("active");
        },
    });

    if (isLoading) {
        return <div>Loading projects...</div>;
    }

    if (error) {
        return <div>Projects could not be loaded.</div>;
    }

    return (
        <div>
            <h1 style={{ marginBottom: 16 }}>Projects</h1>

            {/* Yeni proje formu */}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    if (!name.trim()) return;
                    createMutation.mutate({ name: name.trim(), status });
                }}
                style={{ marginBottom: 24, display: "flex", gap: 8 }}
            >
                <input
                    placeholder="Project name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="active">active</option>
                    <option value="paused">paused</option>
                </select>
                <button type="submit" disabled={createMutation.isPending}>
                    {createMutation.isPending ? "Saving..." : "Add"}
                </button>
            </form>

            {/* Liste */}
            {data && data.length === 0 && <div>No projects found.</div>}

            {data && data.length > 0 && (
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {data.map((project) => (
                        <li
                            key={project.id}
                            style={{
                                padding: "8px 0",
                                borderBottom: "1px solid #e5e7eb",
                            }}
                        >
                            <strong>{project.name}</strong> - {project.status}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
