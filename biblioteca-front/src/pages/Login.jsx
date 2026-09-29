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
                Accept: "application/json",
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
                Accept: "application/json",
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
        <main className="book-page">
            {/* Cabeçalho superior decorativo */}
            <header className="book-top-bar">
                <span className="book-top-tag">
                    SISTEMA BIBLIOTECÁRIO
                </span>

                <span className="book-top-title">
                    BIBLIOTECA VIRTUAL
                </span>

                <span className="book-top-sub">
                    SALA DE ACERVO
                </span>
            </header>

            <section className="book-stage">
                {/* Livro: alterna entre capa de login e verso de cadastro */}
                <article
                    className={`book-volume ${
                        isRegister
                            ? "is-back-cover"
                            : "is-front-cover"
                    }`}
                >
                    {/* Fita Marcadora */}
                    <div
                        className="book-ribbon"
                        aria-hidden="true"
                    >
                        <span className="book-ribbon-tip"></span>
                    </div>

                    {/* Lombada de encadernação */}
                    <div
                        className="book-spine"
                        aria-hidden="true"
                    >
                        <div className="book-spine-line"></div>
                        <div className="book-spine-line"></div>
                        <div className="book-spine-line"></div>
                    </div>

                    {/* Moldura dourada interna */}
                    <div className="book-inner-border">
                        <div className="book-corner tl"></div>
                        <div className="book-corner tr"></div>
                        <div className="book-corner bl"></div>
                        <div className="book-corner br"></div>

                        <div className="book-content">
                            {/* Cabeçalho do livro */}
                            <div className="book-header">
                                <span className="book-edition-label">
                                    {isRegister
                                        ? "✦ VERSO DO VOLUME · TOMO I ✦"
                                        : "✦ REGISTRO OFICIAL · TOMO I ✦"}
                                </span>

                                <h1 className="book-title">
                                    {isRegister
                                        ? "Ficha de Registro"
                                        : "Abra a Capa"}
                                </h1>

                                <p className="book-subtitle">
                                    {isRegister
                                        ? "Preencha seus dados para receber seu cartão de leitor"
                                        : "Identifique-se para acessar o catálogo e acervo"}
                                </p>
                            </div>

                            {/* Formulário */}
                            <form
                                className="book-form"
                                onSubmit={handleSubmit}
                            >
                                {/* Nome - somente no cadastro */}
                                {isRegister && (
                                    <div className="book-field">
                                        <label htmlFor="name">
                                            Nome do Leitor / Autor
                                        </label>

                                        <input
                                            id="name"
                                            type="text"
                                            placeholder="Seu nome completo"
                                            autoComplete="name"
                                            required
                                            value={name}
                                            onChange={(event) =>
                                                setName(
                                                    event.target.value
                                                )
                                            }
                                        />
                                    </div>
                                )}

                                {/* E-mail */}
                                <div className="book-field">
                                    <label htmlFor="email">
                                        E-mail Cadastrado
                                    </label>

                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="leitor@biblioteca.org"
                                        autoComplete="email"
                                        required
                                        value={email}
                                        onChange={(event) =>
                                            setEmail(
                                                event.target.value
                                            )
                                        }
                                    />
                                </div>

                                {/* Senha */}
                                <div className="book-field">
                                    <label htmlFor="password">
                                        Palavra-Chave / Senha
                                    </label>

                                    <div className="password-input">
                                        <input
                                            id="password"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="••••••••"
                                            autoComplete={
                                                isRegister
                                                    ? "new-password"
                                                    : "current-password"
                                            }
                                            required
                                            value={password}
                                            onChange={(event) =>
                                                setPassword(
                                                    event.target.value
                                                )
                                            }
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(
                                                    !showPassword
                                                )
                                            }
                                        >
                                            {showPassword
                                                ? "Ocultar"
                                                : "Mostrar"}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirmar senha - somente no cadastro */}
                                {isRegister && (
                                    <div className="book-field">
                                        <label htmlFor="confirm-password">
                                            Confirmar Palavra-Chave
                                        </label>

                                        <div className="password-input">
                                            <input
                                                id="confirm-password"
                                                type={
                                                    showConfirmPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                placeholder="••••••••"
                                                autoComplete="new-password"
                                                required
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

                                {/* Mensagem de erro */}
                                {error && (
                                    <p className="book-feedback book-error">
                                        {error}
                                    </p>
                                )}

                                {/* Mensagem de sucesso */}
                                {message && (
                                    <p className="book-feedback book-success">
                                        {message}
                                    </p>
                                )}

                                {/* Botão de submissão */}
                                <button
                                    className="book-submit-btn"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading
                                        ? isRegister
                                            ? "Carimbando Cartão..."
                                            : "Consultando Acervo..."
                                        : isRegister
                                            ? "Emitir Cartão de Leitor"
                                            : "Entrar na Sala de Leitura"}
                                </button>
                            </form>

                            {/* Código de barras no cadastro */}
                            {isRegister && (
                                <div
                                    className="book-barcode-wrapper"
                                    aria-hidden="true"
                                >
                                    <div className="book-barcode">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>

                                    <span className="book-isbn">
                                        ISBN 978-85-1924-DWII
                                    </span>
                                </div>
                            )}

                            {/* Alternador Login/Cadastro */}
                            <div className="book-footer-switch">
                                <button
                                    type="button"
                                    className="book-switch-btn"
                                    onClick={handleSwitch}
                                >
                                    {isRegister
                                        ? "← Já possui registro? Abra a capa e entre"
                                        : "Não possui registro? Solicite um cartão de leitor →"}
                                </button>
                            </div>
                        </div>
                    </div>
                </article>
            </section>
        </main>
    )
}

export default Login