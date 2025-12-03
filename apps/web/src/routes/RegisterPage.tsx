// src/routes/RegisterPage.tsx
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerRequest } from "../lib/services/authService";

const registerSchema = z.object({
    email: z.string().email("Geçerli bir email giriniz"),
    password: z.string().min(6, "Şifre en az 6 karakter olmalı"),
    passwordConfirm: z.string(),
}).refine((data) => data.password === data.passwordConfirm, {
    message: "Şifreler uyuşmuyor",
    path: ["passwordConfirm"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterPage() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        try {
            const response = await registerRequest(data);

            if (!response.ok) {
                const errorBody = await response.json().catch(() => null);
                const message =
                    errorBody?.errors?.formErrors?.join(", ") ||
                    "Register başarısız. Bilgileri kontrol edin.";
                alert(message);
                return;
            }

            const result = await response.json();
            console.log("Register result:", result);

            alert("Register başarılı.");
        } catch (error) {
            console.error("Register error:", error);
            alert("Sunucuya ulaşılamadı.");
        }
    };

    return (
        <div style={{ maxWidth: "320px" }}>
            <h1>Register</h1>

            <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                    <label>Email</label>
                    <input {...register("email")} style={{ width: "100%", padding: "8px" }} />
                    {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}
                </div>

                <div>
                    <label>Password</label>
                    <input type="password" {...register("password")} style={{ width: "100%", padding: "8px" }} />
                    {errors.password && <p style={{ color: "red" }}>{errors.password.message}</p>}
                </div>

                <div>
                    <label>Password Confirm</label>
                    <input type="password" {...register("passwordConfirm")} style={{ width: "100%", padding: "8px" }} />
                    {errors.passwordConfirm && <p style={{ color: "red" }}>{errors.passwordConfirm.message}</p>}
                </div>

                <button type="submit" style={{ padding: "10px", marginTop: "12px" }}>
                    Register
                </button>
            </form>
        </div>
    );
}
