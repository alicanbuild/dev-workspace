// src/routes/LoginPage.tsx
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginRequest } from "../lib/services/authService";
import { useAuthStore } from "../stores/authStore";
import { useNavigate } from "react-router-dom";


const loginSchema = z.object({
    email: z.email("Geçerli bir email giriniz"),
    password: z.string().min(6, "Şifre en az 6 karakter olmalı"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginPage() {

    const setAuth = useAuthStore((state) => state.setAuth);
    const navigate = useNavigate();


    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            const response = await loginRequest(data);

            if (!response.ok) {
                const errorBody = await response.json().catch(() => null);
                const message =
                    errorBody?.message || "Login başarısız. Lütfen bilgileri kontrol edin.";
                alert(message);
                return;
            }

            const result = await response.json();
            console.log("Login result:", result);

            // backend'den gelen user ve token ile global auth state'i güncelle
            setAuth(result.user, result.token);

            // dashboard'a yönlendir
            navigate("/");
        } catch (error) {
            console.error("Login error:", error);
            alert("Sunucuya ulaşılamadı.");
        }
    };


    return (
        <div style={{ maxWidth: "320px" }}>
            <h1>Login</h1>

            <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                    <label>Email</label>
                    <input {...register("email")} style={{ width: "100%", padding: "8px" }} />
                    {errors.email && <p style={{ color: "red", fontSize: "14px" }}>{errors.email.message}</p>}
                </div>

                <div>
                    <label>Password</label>
                    <input type="password" {...register("password")} style={{ width: "100%", padding: "8px" }} />
                    {errors.password && <p style={{ color: "red", fontSize: "14px" }}>{errors.password.message}</p>}
                </div>

                <button type="submit" style={{ padding: "10px", marginTop: "12px" }}>
                    Login
                </button>
            </form>
        </div>
    );
}
