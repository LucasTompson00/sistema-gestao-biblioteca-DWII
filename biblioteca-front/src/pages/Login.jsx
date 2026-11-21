import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/useAuth";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isRegister, setIsRegister] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    await login(email, password);
  }

  async function handleRegister() {
    const { data } = await api.post("/register", {
      nome: name,
      email,
      password,
      password_confirmation: confirmPassword,
    });

    return data;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      if (isRegister) {
        await handleRegister();

        setMessage(
          "Cadastro realizado com sucesso. Faça login para continuar.",
        );

        setIsRegister(false);
        setName("");
        setPassword("");
        setConfirmPassword("");
        setShowPassword(false);
        setShowConfirmPassword(false);
      } else {
        await handleLogin();

        navigate("/");
      }
    } catch (error) {
      const erros = error.response?.data?.errors;
      const primeiroErro = erros ? Object.values(erros)[0]?.[0] : null;

      setError(
        primeiroErro ||
          error.response?.data?.message ||
          error.message ||
          "Ocorreu um erro inesperado.",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleSwitch() {
    setIsRegister(!isRegister);
    setError("");
    setMessage("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  }

  return (
    <main className="book-page">
      {}
      <header className="book-top-bar">
        <span className="book-top-tag">SISTEMA BIBLIOTECÁRIO</span>

        <span className="book-top-title">BIBLIOTECA VIRTUAL</span>

        <span className="book-top-sub">SALA DE ACERVO</span>
      </header>

      <section className="book-stage">
        {}
        <article
          className={`book-volume ${
            isRegister ? "is-back-cover" : "is-front-cover"
          }`}
        >
          {}
          <div className="book-ribbon" aria-hidden="true">
            <span className="book-ribbon-tip"></span>
          </div>

          {}
          <div className="book-spine" aria-hidden="true">
            <div className="book-spine-line"></div>
            <div className="book-spine-line"></div>
            <div className="book-spine-line"></div>
          </div>

          {}
          <div className="book-inner-border">
            <div className="book-corner tl"></div>
            <div className="book-corner tr"></div>
            <div className="book-corner bl"></div>
            <div className="book-corner br"></div>

            <div className="book-content">
              {}
              <div className="book-header">
                <span className="book-edition-label">
                  {isRegister
                    ? "✦ VERSO DO VOLUME · TOMO I ✦"
                    : "✦ REGISTRO OFICIAL · TOMO I ✦"}
                </span>

                <h1 className="book-title">
                  {isRegister ? "Ficha de Registro" : "Abra a Capa"}
                </h1>

                <p className="book-subtitle">
                  {isRegister
                    ? "Preencha seus dados para receber seu cartão de leitor"
                    : "Identifique-se para acessar o catálogo e acervo"}
                </p>
              </div>

              {}
              <form className="book-form" onSubmit={handleSubmit}>
                {}
                {isRegister && (
                  <div className="book-field">
                    <label htmlFor="name">Nome do Leitor / Autor</label>

                    <input
                      id="name"
                      type="text"
                      placeholder="Seu nome completo"
                      autoComplete="name"
                      required
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                    />
                  </div>
                )}

                {}
                <div className="book-field">
                  <label htmlFor="email">E-mail Cadastrado</label>

                  <input
                    id="email"
                    type="email"
                    placeholder="leitor@biblioteca.org"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>

                {}
                <div className="book-field">
                  <label htmlFor="password">Palavra-Chave / Senha</label>

                  <div className="password-input">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete={
                        isRegister ? "new-password" : "current-password"
                      }
                      required
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "Ocultar" : "Mostrar"}
                    </button>
                  </div>
                </div>

                {}
                {isRegister && (
                  <div className="book-field">
                    <label htmlFor="confirm-password">
                      Confirmar Palavra-Chave
                    </label>

                    <div className="password-input">
                      <input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        required
                        value={confirmPassword}
                        onChange={(event) =>
                          setConfirmPassword(event.target.value)
                        }
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? "Ocultar" : "Mostrar"}
                      </button>
                    </div>
                  </div>
                )}

                {}
                {error && <p className="book-feedback book-error">{error}</p>}

                {}
                {message && (
                  <p className="book-feedback book-success">{message}</p>
                )}

                {}
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

              {}
              {isRegister && (
                <div className="book-barcode-wrapper" aria-hidden="true">
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

                  <span className="book-isbn">ISBN 978-85-1924-DWII</span>
                </div>
              )}

              {}
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
  );
}

export default Login;
