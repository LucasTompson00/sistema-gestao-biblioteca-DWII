
import { useEffect, useState } from "react";
import api from "../api/client";
import { AuthContext } from "./AuthContext.js";

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        async function verificarUsuario() {
            const token = localStorage.getItem("token");

            if (!token) {
                setCarregando(false);
                return;
            }

            try {
                const { data } = await api.get("/me");
                setUsuario(data.usuario);
            } catch {
                localStorage.removeItem("token");
                setUsuario(null);
            } finally {
                setCarregando(false);
            }
        }

        verificarUsuario();
    }, []);

    async function login(email, password) {
        const { data } = await api.post("/login", {
            email,
            password,
        });

        localStorage.setItem("token", data.token);
        setUsuario(data.usuario);
    }

    async function logout() {
        try {
            await api.post("/logout");
        } catch (error) {
            console.error("Erro ao encerrar sessão:", error);
        } finally {
            localStorage.removeItem("token");
            setUsuario(null);
        }
    }

    return (
        <AuthContext.Provider
            value={{ usuario, carregando, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
}
