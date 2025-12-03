// apps/api/src/server.ts
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { z } from "zod";

const projects = [
    { id: 1, name: "Internal CRM", status: "active" },
    { id: 2, name: "Marketing Dashboard", status: "paused" },
    { id: 3, name: "Billing Service", status: "active" },
  ];

const app = express();
const PORT = 4000;

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});



function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.substring("Bearer ".length).trim();

  if (token !== "fake-jwt-token-123") {
    return res.status(401).json({ message: "Invalid token" });
  }

  next();
}


app.post("/api/auth/login", (req, res) => {
  const parseResult = loginSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({
      ok: false,
      errors: parseResult.error.flatten(),
    });
  }

  const { email, password } = parseResult.data;

  if (password !== "123456") {
    return res.status(401).json({
      ok: false,
      message: "Geçersiz kullanıcı adı veya şifre",
    });
  }

  return res.json({
    ok: true,
    user: {
      id: 1,
      email,
      name: "Demo User",
    },
    token: "fake-jwt-token-123",
  });
});

app.post("/api/auth/register", (req, res) => {
  const parseResult = registerSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({
      ok: false,
      errors: parseResult.error.flatten(),
    });
  }

  const { email } = parseResult.data;

  return res.status(201).json({
    ok: true,
    user: {
      id: 2,
      email,
      name: "New User",
    },
    token: "fake-jwt-token-123",
  });
});


app.get("/api/projects", requireAuth, (req, res) => {
  res.json(projects);
});

app.post("/api/projects", requireAuth, (req: Request, res: Response) => {
  const { name, status } = req.body as { name?: string; status?: string };

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  const newProject = {
    id: projects.length + 1,
    name,
    status: status ?? "active",
  };

  projects.push(newProject);

  res.status(201).json(newProject);
});





app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
