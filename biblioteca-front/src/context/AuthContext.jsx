import { useEffect, useState } from "react";
import api, { inicializarCsrf } from "../api/client";
import { AuthContext } from "./AuthContext.js";

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        let ativo = true;

        async function verificarUsuario() {
            try {
                const { data } = await api.get("/me");

                if (ativo) {
                    setUsuario(data.usuario);
                }
            } catch {
                if (ativo) {
                    setUsuario(null);
                }
            } finally {
                if (ativo) {
                    setCarregando(false);
                }
            }
        }

        verificarUsuario();

        return () => {
            ativo = false;
        };
    }, []);

    async function login(email, password) {
        await inicializarCsrf();

        const { data } = await api.post("/login", {
            email,
            password,
        });

        setUsuario(data.usuario);
    }

    async function atualizarPerfil(dados) {
        const { data } = await api.put("/me", dados);

        setUsuario(data.usuario);

        return data.usuario;
    }

    async function logout() {
        try {
            await api.post("/logout");
        } finally {
            setUsuario(null);
        }
    }

    return (
        <AuthContext.Provider
            value={{
                usuario,
                carregando,
                login,
                atualizarPerfil,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
