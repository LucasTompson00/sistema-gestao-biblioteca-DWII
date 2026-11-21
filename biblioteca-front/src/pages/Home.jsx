import { useState } from "react";
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
import "./Home.css";

const API_URL = "http://localhost:8000";

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");

  const navigate = useNavigate();

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
          Accept: "application/json",
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
    "Todos",
    "Literatura Brasileira",
    "Literatura Estrangeira",
    "Romance",
    "Filosofia",
    "História",
    "Tecnologia",
    "Infantil",
  ];

  const books = [
    {
      title: "Dom Casmurro",
      isbn: "9788535914849",
      year: "1899",
      category: "Literatura Brasileira",
      image:
        "https://covers.openlibrary.org/b/isbn/9788535914849-L.jpg",
    },
    {
      title: "O Alienista",
      isbn: "9788535902778",
      year: "1882",
      category: "Literatura Brasileira",
      image:
        "https://covers.openlibrary.org/b/isbn/9788535902778-L.jpg",
    },
    {
      title: "Memórias Póstumas de Brás Cubas",
      isbn: "9788535911671",
      year: "1881",
      category: "Literatura Brasileira",
      image:
        "https://covers.openlibrary.org/b/isbn/9788535911671-L.jpg",
    },
    {
      title: "A Arte da Guerra",
      isbn: "9788572835977",
      year: "2000",
      category: "Filosofia",
      image:
        "https://covers.openlibrary.org/b/isbn/9788572835977-L.jpg",
    },
    {
      title: "Alice no País das Maravilhas",
      isbn: "9788535909050",
      year: "1865",
      category: "Literatura Estrangeira",
      image:
        "https://covers.openlibrary.org/b/isbn/9788535909050-L.jpg",
    },
    {
      title: "A República",
      isbn: "9788572835978",
      year: "380 a.C.",
      category: "Filosofia",
      image:
        "https://covers.openlibrary.org/b/isbn/9788572835978-L.jpg",
    },
  ];

  const filteredBooks = books.filter((book) => {
    const matchesCategory =
      category === "Todos" || book.category === category;

    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      !searchText ||
      book.title.toLowerCase().includes(searchText) ||
      book.isbn.toLowerCase().includes(searchText);

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

            {error && <p className="error-message">{error}</p>}
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
              {filteredBooks.map((book) => (
                <article className="book-card" key={book.isbn}>
                  <div className="book-cover">
                    <img
                      src={book.image}
                      alt={`Capa de ${book.title}`}
                    />
                  </div>

                  <div className="book-data">
                    <span>{book.category}</span>

                    <h3>{book.title}</h3>

                    <p>ISBN {book.isbn}</p>

                    <small>{book.year}</small>
                  </div>
                </article>
              ))}

              {filteredBooks.length === 0 && (
                <div className="empty-result">
                  <BookOpen size={30} />
                  <p>Nenhum livro encontrado.</p>
                </div>
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