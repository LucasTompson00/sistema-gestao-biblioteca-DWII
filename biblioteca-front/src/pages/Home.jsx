import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Search,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/useAuth";
import { listarLivros } from "../api/livros";
import "./Home.css";

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState([]);
  const [carregandoLivros, setCarregandoLivros] = useState(true);
  const [erroLivros, setErroLivros] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");

  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function carregarLivros() {
      try {
        const dados = await listarLivros();
        setBooks(dados);
      } catch (error) {
        console.error("Erro ao carregar livros:", error);

        setErroLivros(
          error.response?.data?.message ||
          "Não foi possível carregar o acervo."
        );
      } finally {
        setCarregandoLivros(false);
      }
    }

    carregarLivros();
  }, []);

  async function handleLogout() {
    setLoading(true);

    try {
      await logout();
      navigate("/login", { replace: true });
    } finally {
      setLoading(false);
    }
  }

  const categories = [
    "Todos",
    ...new Set(
      books.flatMap((book) =>
        (book.generos || []).map((genero) => genero.nome)
      )
    ),
  ];

  const filteredBooks = books.filter((book) => {
    const matchesCategory =
      category === "Todos" ||
      (book.generos || []).some(
        (genero) => genero.nome === category
      );

    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      !searchText ||
      (book.titulo || "").toLowerCase().includes(searchText) ||
      (book.isbn || "").toLowerCase().includes(searchText);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="home-page">
      <header className="topbar">
        <Link to="/" className="logo">
          <BookOpen size={27} />
          <span>BiblioTech</span>
        </Link>

        <nav className="main-nav">
          <Link to="/">Início</Link>
          <Link to="/livros">Livros</Link>
          <Link to="/emprestimos">Empréstimos</Link>
        </nav>

        <button
          className="menu-button"
          type="button"
          onClick={() => setMenuOpen(true)}
        >
          <Menu size={24} />
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
              <X size={24} />
            </button>

            <div className="drawer-logo">
              <BookOpen size={24} />
              <span>BiblioTech</span>
            </div>

            <nav>
              <Link to="/" onClick={() => setMenuOpen(false)}>
                Início
              </Link>

              <Link to="/livros" onClick={() => setMenuOpen(false)}>
                Livros
              </Link>

              <Link to="/emprestimos" onClick={() => setMenuOpen(false)}>
                Empréstimos
              </Link>

              <Link to="/perfil" onClick={() => setMenuOpen(false)}>
                Meu perfil
              </Link>
            </nav>

            <button
              className="logout-button"
              type="button"
              onClick={handleLogout}
              disabled={loading}
            >
              <LogOut size={18} />
              {loading ? "Saindo..." : "Sair"}
            </button>
          </aside>
        </div>
      )}

      <main>
        <section className="hero">
          <div className="hero-content">
            <span className="hero-small-title">BIBLIOTECH</span>

            <h1>Encontre seu próximo livro.</h1>

            <p>
              Consulte o acervo da biblioteca, encontre títulos
              e descubra novas leituras.
            </p>

            <div className="hero-search">
              <Search size={21} />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Digite o título ou ISBN..."
              />

              <button type="button">Buscar</button>
            </div>
          </div>
        </section>

        <section className="catalog">
          <div className="category-bar">
            <span className="category-title">Categorias</span>

            <div className="category-list">
              {categories.map((item) => (
                <button
                  type="button"
                  key={item}
                  className={category === item ? "selected" : ""}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="section-title">
            <div>
              <span>ACERVO</span>

              <h2>
                {category === "Todos"
                  ? "Livros em destaque"
                  : category}
              </h2>
            </div>

            <Link to="/livros">
              Ver todos
              <ChevronRight size={17} />
            </Link>
          </div>

          <div className="books-area">
            <button className="book-arrow left" type="button">
              <ChevronLeft size={18} />
            </button>

            <div className="book-grid">
              {carregandoLivros ? (
                <p>Carregando acervo...</p>
              ) : erroLivros ? (
                <p className="error-message">{erroLivros}</p>
              ) : (
                <>
                  {filteredBooks.map((book) => (
                    <article className="book-card" key={book.id}>
                      <div className="book-cover">
                        {book.capa && (
                          <img
                            src={book.capa}
                            alt={`Capa de ${book.titulo}`}
                          />
                        )}
                      </div>

                      <div className="book-data">
                        <span>
                          {(book.generos || [])
                            .map((genero) => genero.nome)
                            .join(", ") || "Sem gênero"}
                        </span>

                        <h3>{book.titulo}</h3>

                        <p>ISBN {book.isbn}</p>

                        <small>{book.ano_publicacao}</small>
                      </div>
                    </article>
                  ))}

                  {filteredBooks.length === 0 && (
                    <div className="empty-result">
                      <BookOpen size={30} />
                      <p>Nenhum livro encontrado.</p>
                    </div>
                  )}
                </>
              )}
            </div>

            <button className="book-arrow right" type="button">
              <ChevronRight size={18} />
            </button>
          </div>
        </section>

        <section className="library-strip">
          <div>
            <span>ACERVO BIBLIOTECH</span>
            <h2>Uma biblioteca para descobrir.</h2>
          </div>

          <Link to="/livros">
            Explorar acervo
            <ChevronRight size={17} />
          </Link>
        </section>
      </main>

      <footer className="footer">
        <div className="logo">
          <BookOpen size={21} />
          <span>BiblioTech</span>
        </div>

        <p>
          © 2026 BiblioTech. Sistema de Gestão de Biblioteca.
        </p>
      </footer>
    </div>
  );
}

export default Home;
