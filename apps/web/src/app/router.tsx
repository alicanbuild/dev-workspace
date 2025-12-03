// src/app/router.tsx
import React from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { Layout } from "./Layout";
import { DashboardPage } from "../routes/DashboardPage";
import { LoginPage } from "../routes/LoginPage";
import { RegisterPage } from "../routes/RegisterPage";
import { RequireAuth } from "./RequireAuth";

export function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route element={<RequireAuth />}>
                        <Route index element={<DashboardPage />} />
                    </Route>

                    <Route path="login" element={<LoginPage />} />
                    <Route path="register" element={<RegisterPage />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
