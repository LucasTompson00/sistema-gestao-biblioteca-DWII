import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Menu,
  X,
  Search,
  BookOpen,
  Sparkles,
  Clock3,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import "./Home.css";

const API_URL = "http://localhost:8000";

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function getCsrfToken() {
    const response = await fetch(`${API_URL}/csrf-token`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Não foi possível obter o token de segurança.");
    }

    const data = await response.json();
    return data.token;
  }

  async function handleLogout() {
  setLoading(true);
  setError("");

  try {
    const csrfResponse = await fetch(`${API_URL}/csrf-token`, {
      credentials: "include",
    });

    const csrfData = await csrfResponse.json();

    const logoutResponse = await fetch(`${API_URL}/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Accept": "application/json",
        "X-CSRF-TOKEN": csrfData.token,
      },
    });

    if (!logoutResponse.ok) {
      throw new Error("Não foi possível sair da conta.");
    }

    navigate("/login", { replace: true });
  } catch (error) {
    console.error(error);
    setError(error.message);
  } finally {
    setLoading(false);
  }
}

  const categories = [
    {
      name: "Romance",
      icon: BookOpen,
    },
    {
      name: "Ficção",
      icon: Sparkles,
    },
    {
      name: "História",
      icon: BookOpen,
    },
    {
      name: "Tecnologia",
      icon: BookOpen,
    },
  ];

  const perks = [
    {
      title: "Acervo organizado",
      description: "Encontre livros de forma rápida e simples.",
      icon: BookOpen,
    },
    {
      title: "Empréstimos fáceis",
      description: "Acompanhe seus empréstimos em poucos cliques.",
      icon: Clock3,
    },
    {
      title: "Acesso seguro",
      description: "Seus dados ficam protegidos durante o uso.",
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="home-page">
      <header className="topbar">
        <div className="logo">
          <BookOpen size={28} />
          <span>BiblioTech</span>
        </div>

        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Buscar livros..."
          />
        </div>

        <button
          className="menu-button"
          type="button"
          onClick={() => setMenuOpen(true)}
        >
          <Menu size={26} />
        </button>
      </header>

      {menuOpen && (
        <div className="drawer-overlay">
          <aside className="drawer">
            <button
              className="close-button"
              type="button"
              onClick={() => setMenuOpen(false)}
            >
              <X size={26} />
            </button>

            <nav>
              <Link to="/home">Início</Link>
              <Link to="/livros">Livros</Link>
              <Link to="/emprestimos">Empréstimos</Link>
              <Link to="/perfil">Meu perfil</Link>
            </nav>

            <button
              className="logout-button"
              type="button"
              onClick={handleLogout}
              disabled={loading}
            >
              <LogOut size={20} />
              {loading ? "Saindo..." : "Sair"}
            </button>

            {error && <p className="error-message">{error}</p>}
          </aside>
        </div>
      )}

      <main>
        <section className="hero">
          <div className="hero-content">
            <span className="hero-tag">GESTÃO DE BIBLIOTECA</span>

            <h1>
              Seu universo de
              <span> livros </span>
              em um só lugar.
            </h1>

            <p>
              Encontre, consulte e acompanhe seus livros e empréstimos
              de forma simples e organizada.
            </p>

            <div className="hero-actions">
              <Link to="/livros" className="primary-button">
                Explorar livros
              </Link>

              <Link to="/emprestimos" className="secondary-button">
                Meus empréstimos
              </Link>
            </div>
          </div>
        </section>

        <section className="categories-section">
          <div className="section-heading">
            <span>CATEGORIAS</span>
            <h2>Explore por categoria</h2>
          </div>

          <div className="categories-grid">
            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <button
                  className="category-card"
                  type="button"
                  key={category.name}
                >
                  <Icon size={28} />
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="bestsellers-section">
          <div className="section-heading">
            <span>DESTAQUES</span>
            <h2>Livros em destaque</h2>
          </div>

          <div className="book-list">
            <article className="book-card">
              <div className="book-placeholder">
                <BookOpen size={42} />
              </div>

              <div className="book-info">
                <span>DESTAQUE</span>
                <h3>Livro em destaque</h3>
                <p>Consulte detalhes e disponibilidade no acervo.</p>
              </div>
            </article>

            <article className="book-card">
              <div className="book-placeholder">
                <BookOpen size={42} />
              </div>

              <div className="book-info">
                <span>MAIS LIDO</span>
                <h3>Livro mais procurado</h3>
                <p>Confira se este título está disponível.</p>
              </div>
            </article>

            <article className="book-card">
              <div className="book-placeholder">
                <BookOpen size={42} />
              </div>

              <div className="book-info">
                <span>NOVO</span>
                <h3>Novidade no acervo</h3>
                <p>Descubra os novos títulos disponíveis.</p>
              </div>
            </article>
          </div>
        </section>

        <section className="perks-section">
          {perks.map((perk) => {
            const Icon = perk.icon;

            return (
              <div className="perk-card" key={perk.title}>
                <Icon size={30} />
                <h3>{perk.title}</h3>
                <p>{perk.description}</p>
              </div>
            );
          })}
        </section>
      </main>

      <footer className="footer">
        <div className="logo">
          <BookOpen size={24} />
          <span>BiblioTech</span>
        </div>

        <p>© 2026 BiblioTech. Sistema de Gestão de Biblioteca.</p>
      </footer>
    </div>
  );
}

export default Home;