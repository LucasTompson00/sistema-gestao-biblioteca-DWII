import { useState } from "react"
import "./Login.css"

function Login() {
    const [isRegister, setIsRegister] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false)

    const handleSwitch = () => {
        if (isAnimating) return

        setIsAnimating(true)

        setTimeout(() => {
            setIsRegister((current) => !current)
        }, 400)

        setTimeout(() => {
            setIsAnimating(false)
        }, 800)
    }

    return (
        <main
            className={`login ${
                isRegister ? "register-mode" : ""
            } ${isAnimating ? "animating" : ""}`}
        >
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

                        <form className="login-form">
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
                                />
                            </div>

                            <div className="login-field">
                                <label htmlFor="password">
                                    Senha
                                </label>

                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Digite sua senha"
                                    autoComplete={
                                        isRegister
                                            ? "new-password"
                                            : "current-password"
                                    }
                                />
                            </div>

                            {isRegister && (
                                <div className="login-field">
                                    <label htmlFor="confirm-password">
                                        Confirmar senha
                                    </label>

                                    <input
                                        id="confirm-password"
                                        type="password"
                                        placeholder="Confirme sua senha"
                                        autoComplete="new-password"
                                    />
                                </div>
                            )}

                            <button
                                className="login-button"
                                type="submit"
                            >
                                {isRegister
                                    ? "Criar conta"
                                    : "Entrar"}
                            </button>
                        </form>

                        <button
                            className="login-switch"
                            type="button"
                            onClick={handleSwitch}
                            disabled={isAnimating}
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