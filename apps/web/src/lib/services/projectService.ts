import { apiClient } from "../apiClient";

export type Project = {
  id: number;
  name: string;
  status: string;
};

export async function fetchProjects(): Promise<Project[]> {
  const response = await apiClient.get("/projects");
  return response.json();
}

export async function createProject(input: {
  name: string;
  status: string;
}): Promise<Project> {
  const response = await apiClient.post("/projects", input);
  if (!response.ok) {
    throw new Error("Project could not be created");
  }
  return response.json();
}
