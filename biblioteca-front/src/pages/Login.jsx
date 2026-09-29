import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./Login.css"

const API_URL = "http://localhost:8000"

function Login() {
    const navigate = useNavigate()

    const [isRegister, setIsRegister] = useState(false)

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const [error, setError] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)

    async function getCsrfToken() {
        const response = await fetch(`${API_URL}/csrf-token`, {
            credentials: "include",
        })

        if (!response.ok) {
            throw new Error("Não foi possível obter o token de segurança.")
        }

        const data = await response.json()

        return data.token
    }

    async function handleLogin() {
        const token = await getCsrfToken()

        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "X-CSRF-TOKEN": token,
            },
            body: JSON.stringify({
                email,
                senha: password,
            }),
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(
                data.message || "Não foi possível realizar o login."
            )
        }

        return data
    }

    async function handleRegister() {
        const token = await getCsrfToken()

        const response = await fetch(`${API_URL}/register`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "X-CSRF-TOKEN": token,
            },
            body: JSON.stringify({
                nome: name,
                email,
                senha: password,
                senha_confirmation: confirmPassword,
            }),
        })

        const data = await response.json()

        if (!response.ok) {
            if (response.status === 422 && data.errors) {
                const primeiroErro = Object.values(data.errors)[0][0]
                throw new Error(primeiroErro)
            }

            throw new Error(
                data.message || "Não foi possível realizar o cadastro."
            )
        }

        return data
    }

    async function handleSubmit(event) {
        event.preventDefault()

        setError("")
        setMessage("")
        setLoading(true)

        try {
            if (isRegister) {
                await handleRegister()

                setMessage(
                    "Cadastro realizado com sucesso. Faça login para continuar."
                )

                setIsRegister(false)
                setName("")
                setPassword("")
                setConfirmPassword("")
                setShowPassword(false)
                setShowConfirmPassword(false)
            } else {
                await handleLogin()
                navigate("/")
            }
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    function handleSwitch() {
        setIsRegister(!isRegister)
        setError("")
        setMessage("")
        setPassword("")
        setConfirmPassword("")
        setShowPassword(false)
        setShowConfirmPassword(false)
    }

    return (
        <main className={`login ${isRegister ? "register-mode" : ""}`}>
            <section className="login-container">
                <div className="login-panel">
                    <div className="login-content">
                        <div className="login-header">
                            <h1 className="login-title">
                                {isRegister ? "Criar conta" : "Login"}
                            </h1>

                            <p className="login-subtitle">
                                {isRegister
                                    ? "Crie sua conta para acessar a biblioteca"
                                    : "Acesse sua conta"}
                            </p>
                        </div>

                        <form
                            className="login-form"
                            onSubmit={handleSubmit}
                        >
                            {isRegister && (
                                <div className="login-field">
                                    <label htmlFor="name">
                                        Nome
                                    </label>

                                    <input
                                        id="name"
                                        type="text"
                                        placeholder="Digite seu nome"
                                        autoComplete="name"
                                        value={name}
                                        onChange={(event) =>
                                            setName(event.target.value)
                                        }
                                    />
                                </div>
                            )}

                            <div className="login-field">
                                <label htmlFor="email">
                                    E-mail
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Digite seu e-mail"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                />
                            </div>

                            <div className="login-field">
                                <label htmlFor="password">
                                    Senha
                                </label>

                                <div className="password-input">
                                    <input
                                        id="password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Digite sua senha"
                                        autoComplete={
                                            isRegister
                                                ? "new-password"
                                                : "current-password"
                                        }
                                        value={password}
                                        onChange={(event) =>
                                            setPassword(event.target.value)
                                        }
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                    >
                                        {showPassword
                                            ? "Ocultar"
                                            : "Mostrar"}
                                    </button>
                                </div>
                            </div>

                            {isRegister && (
                                <div className="login-field">
                                    <label htmlFor="confirm-password">
                                        Confirmar senha
                                    </label>

                                    <div className="password-input">
                                        <input
                                            id="confirm-password"
                                            type={
                                                showConfirmPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="Confirme sua senha"
                                            autoComplete="new-password"
                                            value={confirmPassword}
                                            onChange={(event) =>
                                                setConfirmPassword(
                                                    event.target.value
                                                )
                                            }
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    !showConfirmPassword
                                                )
                                            }
                                        >
                                            {showConfirmPassword
                                                ? "Ocultar"
                                                : "Mostrar"}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {error && (
                                <p className="login-error">
                                    {error}
                                </p>
                            )}

                            {message && (
                                <p className="login-message">
                                    {message}
                                </p>
                            )}

                            <button
                                className="login-button"
                                type="submit"
                                disabled={loading}
                            >
                                {loading
                                    ? isRegister
                                        ? "Criando..."
                                        : "Entrando..."
                                    : isRegister
                                        ? "Criar conta"
                                        : "Entrar"}
                            </button>
                        </form>

                        <button
                            className="login-switch"
                            type="button"
                            onClick={handleSwitch}
                        >
                            {isRegister
                                ? "Já tenho uma conta"
                                : "Não tenho uma conta"}
                        </button>
                    </div>
                </div>

                <div className="login-decoration">
                    <div className="login-decoration-content">
                        <h2>
                            {isRegister
                                ? "Bem-vindo à biblioteca!"
                                : "Bem-vindo de volta!"}
                        </h2>

                        <p>
                            {isRegister
                                ? "Crie sua conta para começar."
                                : "Entre novamente para continuar."}
                        </p>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Login