
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
  Plus,
  Pencil,
  Trash2,
  Save,
  Users,
  Tags,
  Package,
} from "lucide-react";

import { useAuth } from "../context/useAuth";

import {
  listarLivros,
  cadastrarLivro,
  atualizarLivro,
  excluirLivro,
} from "../api/livros";

import {
  listarAutores,
  cadastrarAutor,
  atualizarAutor,
  excluirAutor,
} from "../api/autores";

import {
  listarGeneros,
  cadastrarGenero,
  atualizarGenero,
  excluirGenero,
} from "../api/generos";

import {
  listarExemplares,
  cadastrarExemplar,
  atualizarExemplar,
  excluirExemplar,
} from "../api/exemplares";

import { buscarLivroPorIsbn } from "../api/openLibrary";

import "./Home.css";

function criarLivroVazio() {
  return {
    titulo: "",
    isbn: "",
    sinopse: "",
    capa: "",
    ano_publicacao: "",
    autores: [],
    generos: [],
  };
}

function obterMensagemErro(erro) {
  const erros = erro.response?.data?.errors;

  if (erros) {
    return Object.values(erros).flat().join(" ");
  }

  return (
    erro.response?.data?.message ||
    erro.message ||
    "Não foi possível realizar a operação."
  );
}

function normalizarTexto(texto) {
  return String(texto || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function extrairGeneros(assuntos) {
  const lista = Array.isArray(assuntos)
    ? assuntos.map(normalizarTexto)
    : [];

  const regras = [
    {
      nome: "Ficção científica",
      termos: ["science fiction", "sci-fi"],
    },
    {
      nome: "Ficção histórica",
      termos: ["historical fiction"],
    },
    {
      nome: "Literatura infantil",
      termos: ["children's fiction", "juvenile fiction"],
    },
    {
      nome: "Literatura juvenil",
      termos: ["young adult fiction", "young adult literature"],
    },
    {
      nome: "Fantasia",
      termos: ["fantasy"],
    },
    {
      nome: "Mistério",
      termos: ["detective and mystery", "mystery fiction"],
    },
    {
      nome: "Suspense",
      termos: ["thriller fiction", "suspense fiction", "thrillers"],
    },
    {
      nome: "Terror",
      termos: ["horror fiction", "horror stories"],
    },
    {
      nome: "Romance",
      termos: ["romance fiction", "love stories"],
    },
    {
      nome: "Aventura",
      termos: ["adventure fiction", "adventure stories"],
    },
    {
      nome: "Poesia",
      termos: ["poetry"],
    },
    {
      nome: "Drama",
      termos: ["drama"],
    },
    {
      nome: "Contos",
      termos: ["short stories"],
    },
    {
      nome: "Biografia",
      termos: ["biography"],
    },
    {
      nome: "Autobiografia",
      termos: ["autobiography"],
    },
    {
      nome: "Quadrinhos",
      termos: ["graphic novels", "comic books", "comics"],
    },
    {
      nome: "Humor",
      termos: ["humorous stories", "humor"],
    },
    {
      nome: "Ficção",
      termos: ["fiction"],
    },
  ];

  const encontrados = regras
    .filter((regra) =>
      lista.some((assunto) =>
        regra.termos.some((termo) => assunto.includes(termo)),
      ),
    )
    .map((regra) => regra.nome);

  const generosEspecificos = encontrados.filter(
    (genero) => genero !== "Ficção",
  );

  if (generosEspecificos.length > 0) {
    return [...new Set(generosEspecificos)];
  }

  return [...new Set(encontrados)];
}

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [books, setBooks] = useState([]);
  const [carregandoLivros, setCarregandoLivros] = useState(true);
  const [erroLivros, setErroLivros] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");

  const [modalAberto, setModalAberto] = useState(false);
  const [livroEditando, setLivroEditando] = useState(null);

  const [autores, setAutores] = useState([]);
  const [generos, setGeneros] = useState([]);

  const [carregandoOpcoes, setCarregandoOpcoes] = useState(false);
  const [salvandoLivro, setSalvandoLivro] = useState(false);

  const [formLivro, setFormLivro] = useState(criarLivroVazio());

  const [erroFormulario, setErroFormulario] = useState("");
  const [feedback, setFeedback] = useState("");

  const [buscandoOpenLibrary, setBuscandoOpenLibrary] = useState(false);
  const [erroBuscaIsbn, setErroBuscaIsbn] = useState("");
  const [feedbackBuscaIsbn, setFeedbackBuscaIsbn] = useState("");

  const [autoresCriadosAutomaticamente, setAutoresCriadosAutomaticamente] =
    useState([]);

  const [generosCriadosAutomaticamente, setGenerosCriadosAutomaticamente] =
    useState([]);

  const [tipoGerenciamento, setTipoGerenciamento] = useState(null);
  const [registroEditando, setRegistroEditando] = useState(null);

  const [formCadastro, setFormCadastro] = useState({
    nome: "",
    biografia: "",
  });

  const [carregandoGerenciamento, setCarregandoGerenciamento] =
    useState(false);

  const [salvandoGerenciamento, setSalvandoGerenciamento] = useState(false);

  const [erroGerenciamento, setErroGerenciamento] = useState("");
  const [sucessoGerenciamento, setSucessoGerenciamento] = useState("");

  const [modalExemplaresAberto, setModalExemplaresAberto] = useState(false);
  const [livroSelecionado, setLivroSelecionado] = useState(null);

  const [exemplares, setExemplares] = useState([]);
  const [carregandoExemplares, setCarregandoExemplares] = useState(false);
  const [salvandoExemplar, setSalvandoExemplar] = useState(false);

  const [exemplarEditando, setExemplarEditando] = useState(null);
  const [formExemplar, setFormExemplar] = useState({ codigo: "" });

  const [erroExemplares, setErroExemplares] = useState("");
  const [feedbackExemplares, setFeedbackExemplares] = useState("");

  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const bibliotecario = usuario?.perfil === "bibliotecario";

  async function carregarCatalogo() {
    try {
      const dados = await listarLivros();
      setBooks(dados);
      setErroLivros("");
    } catch (error) {
      setErroLivros(obterMensagemErro(error));
    } finally {
      setCarregandoLivros(false);
    }
  }

  useEffect(() => {
    let ativo = true;

    async function buscarLivros() {
      try {
        const dados = await listarLivros();

        if (ativo) {
          setBooks(dados);
          setErroLivros("");
        }
      } catch (error) {
        if (ativo) {
          setErroLivros(obterMensagemErro(error));
        }
      } finally {
        if (ativo) {
          setCarregandoLivros(false);
        }
      }
    }

    buscarLivros();

    return () => {
      ativo = false;
    };
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

  async function abrirFormulario(livro = null) {
    if (!bibliotecario) return;

    setLivroEditando(livro?.id ?? null);

    setFormLivro(
      livro
        ? {
            titulo: livro.titulo,
            isbn: livro.isbn,
            sinopse: livro.sinopse,
            capa: livro.capa,
            ano_publicacao: String(livro.ano_publicacao),
            autores: (livro.autores || []).map((autor) => String(autor.id)),
            generos: (livro.generos || []).map((genero) => String(genero.id)),
          }
        : criarLivroVazio(),
    );

    setErroFormulario("");
    setFeedback("");
    setErroBuscaIsbn("");
    setFeedbackBuscaIsbn("");
    setAutoresCriadosAutomaticamente([]);
    setGenerosCriadosAutomaticamente([]);
    setModalAberto(true);
    setCarregandoOpcoes(true);

    try {
      const [dadosAutores, dadosGeneros] = await Promise.all([
        listarAutores(),
        listarGeneros(),
      ]);

      setAutores(dadosAutores);
      setGeneros(dadosGeneros);
    } catch (error) {
      setErroFormulario(obterMensagemErro(error));
    } finally {
      setCarregandoOpcoes(false);
    }
  }

  function atualizarCampo(event) {
    const { name, value } = event.target;

    setFormLivro((anterior) => ({
      ...anterior,
      [name]: value,
    }));

    if (name === "isbn") {
      setErroBuscaIsbn("");
      setFeedbackBuscaIsbn("");
      setAutoresCriadosAutomaticamente([]);
      setGenerosCriadosAutomaticamente([]);
    }
  }

  async function buscarDadosOpenLibrary() {
    setErroBuscaIsbn("");
    setFeedbackBuscaIsbn("");
    setAutoresCriadosAutomaticamente([]);
    setGenerosCriadosAutomaticamente([]);

    const isbn = formLivro.isbn.trim();

    if (!isbn) {
      setErroBuscaIsbn("Informe o ISBN antes de realizar a busca.");
      return;
    }

    setBuscandoOpenLibrary(true);

    try {
      const dados = await buscarLivroPorIsbn(isbn);

      const nomesAutoresApi = [
        ...new Map(
          (Array.isArray(dados.autores) ? dados.autores : [])
            .filter((nome) => typeof nome === "string" && nome.trim())
            .map((nome) => [normalizarTexto(nome), nome.trim()]),
        ).values(),
      ];

      const autoresFaltantes = nomesAutoresApi.filter(
        (nomeApi) =>
          !autores.some(
            (autor) =>
              normalizarTexto(autor.nome) === normalizarTexto(nomeApi),
          ),
      );

      for (const nome of autoresFaltantes) {
        await cadastrarAutor({
          nome,
          biografia: null,
        });
      }

      const nomesGenerosApi = extrairGeneros(dados.assuntos);

      const generosFaltantes = nomesGenerosApi.filter(
        (nomeApi) =>
          !generos.some(
            (genero) =>
              normalizarTexto(genero.nome) === normalizarTexto(nomeApi),
          ),
      );

      for (const nome of generosFaltantes) {
        await cadastrarGenero({ nome });
      }

      const [autoresAtualizados, generosAtualizados] = await Promise.all([
        listarAutores(),
        listarGeneros(),
      ]);

      setAutores(autoresAtualizados);
      setGeneros(generosAtualizados);

      setAutoresCriadosAutomaticamente(autoresFaltantes);
      setGenerosCriadosAutomaticamente(generosFaltantes);

      const autoresCorrespondentes = autoresAtualizados.filter((autor) =>
        nomesAutoresApi.some(
          (nome) => normalizarTexto(nome) === normalizarTexto(autor.nome),
        ),
      );

      const generosCorrespondentes = generosAtualizados.filter((genero) =>
        nomesGenerosApi.some(
          (nome) => normalizarTexto(nome) === normalizarTexto(genero.nome),
        ),
      );

      setFormLivro((anterior) => ({
        ...anterior,
        titulo: dados.titulo || anterior.titulo,
        sinopse: dados.sinopse || anterior.sinopse,
        capa: dados.capa || anterior.capa,
        ano_publicacao: dados.ano_publicacao || anterior.ano_publicacao,
        autores: autoresCorrespondentes.map((autor) => String(autor.id)),
        generos: generosCorrespondentes.map((genero) => String(genero.id)),
      }));

      const mensagens = [];

      if (autoresFaltantes.length > 0) {
        mensagens.push(
          `${autoresFaltantes.length} autor(es) cadastrado(s)`,
        );
      }

      if (generosFaltantes.length > 0) {
        mensagens.push(
          `${generosFaltantes.length} gênero(s) cadastrado(s)`,
        );
      }

      setFeedbackBuscaIsbn(
        mensagens.length > 0
          ? `${mensagens.join(" e ")} automaticamente. Confira os dados do livro.`
          : nomesGenerosApi.length > 0
            ? "Dados encontrados! Autores e gêneros já estavam cadastrados."
            : "Dados encontrados! A consulta não retornou gêneros reconhecidos.",
      );
    } catch (error) {
      setErroBuscaIsbn(obterMensagemErro(error));
    } finally {
      setBuscandoOpenLibrary(false);
    }
  }

  function alternarSelecao(tipo, id, selecionado) {
    const identificador = String(id);

    setFormLivro((anterior) => {
      const valoresAtuais = anterior[tipo];

      return {
        ...anterior,
        [tipo]: selecionado
          ? [...valoresAtuais, identificador]
          : valoresAtuais.filter((valor) => valor !== identificador),
      };
    });
  }

  async function salvarLivro(event) {
    event.preventDefault();

    setErroFormulario("");
    setSalvandoLivro(true);

    if (formLivro.autores.length === 0) {
      setErroFormulario("Selecione pelo menos um autor.");
      setSalvandoLivro(false);
      return;
    }

    if (formLivro.generos.length === 0) {
      setErroFormulario("Selecione pelo menos um gênero.");
      setSalvandoLivro(false);
      return;
    }

    const dados = {
      titulo: formLivro.titulo.trim(),
      isbn: formLivro.isbn.trim(),
      sinopse: formLivro.sinopse.trim(),
      capa: formLivro.capa.trim(),
      ano_publicacao: Number(formLivro.ano_publicacao),
      autores: formLivro.autores.map(Number),
      generos: formLivro.generos.map(Number),
    };

    try {
      if (livroEditando) {
        await atualizarLivro(livroEditando, dados);
        setFeedback("Livro atualizado com sucesso.");
      } else {
        await cadastrarLivro(dados);
        setFeedback("Livro cadastrado com sucesso.");
      }

      setModalAberto(false);
      setLivroEditando(null);
      setFormLivro(criarLivroVazio());

      await carregarCatalogo();
    } catch (error) {
      setErroFormulario(obterMensagemErro(error));
    } finally {
      setSalvandoLivro(false);
    }
  }

  async function removerLivro(id) {
    const confirmar = window.confirm("Deseja realmente excluir este livro?");

    if (!confirmar) return;

    setFeedback("");
    setErroLivros("");

    try {
      await excluirLivro(id);

      setFeedback("Livro excluído com sucesso.");

      if (livroEditando === id) {
        setModalAberto(false);
      }

      await carregarCatalogo();
    } catch (error) {
      setErroLivros(obterMensagemErro(error));
    }
  }

  function fecharFormulario() {
    if (salvandoLivro || buscandoOpenLibrary) return;

    setModalAberto(false);
    setLivroEditando(null);
    setErroFormulario("");
    setErroBuscaIsbn("");
    setFeedbackBuscaIsbn("");
    setAutoresCriadosAutomaticamente([]);
    setGenerosCriadosAutomaticamente([]);
    setFormLivro(criarLivroVazio());
  }

  async function abrirGerenciamento(tipo) {
    if (!bibliotecario) return;

    setTipoGerenciamento(tipo);
    setRegistroEditando(null);
    setFormCadastro({ nome: "", biografia: "" });
    setErroGerenciamento("");
    setSucessoGerenciamento("");
    setCarregandoGerenciamento(true);

    try {
      if (tipo === "autores") {
        const dados = await listarAutores();
        setAutores(dados);
      } else {
        const dados = await listarGeneros();
        setGeneros(dados);
      }
    } catch (error) {
      setErroGerenciamento(obterMensagemErro(error));
    } finally {
      setCarregandoGerenciamento(false);
    }
  }

  function editarRegistro(item) {
    setRegistroEditando(item);

    setFormCadastro({
      nome: item.nome,
      biografia: item.biografia || "",
    });

    setErroGerenciamento("");
    setSucessoGerenciamento("");
  }

  function atualizarCampoCadastro(event) {
    const { name, value } = event.target;

    setFormCadastro((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  }

  function cancelarEdicaoRegistro() {
    setRegistroEditando(null);
    setFormCadastro({ nome: "", biografia: "" });
    setErroGerenciamento("");
    setSucessoGerenciamento("");
  }

  async function salvarRegistro(event) {
    event.preventDefault();

    setErroGerenciamento("");
    setSucessoGerenciamento("");

    const nome = formCadastro.nome.trim();

    if (!nome) {
      setErroGerenciamento("Informe o nome.");
      return;
    }

    setSalvandoGerenciamento(true);

    try {
      if (tipoGerenciamento === "autores") {
        const dados = {
          nome,
          biografia: formCadastro.biografia.trim() || null,
        };

        if (registroEditando) {
          await atualizarAutor(registroEditando.id, dados);
        } else {
          await cadastrarAutor(dados);
        }

        const autoresAtualizados = await listarAutores();
        setAutores(autoresAtualizados);
      } else {
        const dados = { nome };

        if (registroEditando) {
          await atualizarGenero(registroEditando.id, dados);
        } else {
          await cadastrarGenero(dados);
        }

        const generosAtualizados = await listarGeneros();
        setGeneros(generosAtualizados);
      }

      setRegistroEditando(null);
      setFormCadastro({ nome: "", biografia: "" });

      setSucessoGerenciamento(
        registroEditando
          ? "Registro atualizado com sucesso."
          : "Registro cadastrado com sucesso.",
      );

      await carregarCatalogo();
    } catch (error) {
      setErroGerenciamento(obterMensagemErro(error));
    } finally {
      setSalvandoGerenciamento(false);
    }
  }

  async function removerRegistro(item) {
    const tipo = tipoGerenciamento === "autores" ? "autor" : "gênero";

    const confirmar = window.confirm(
      `Deseja realmente excluir o ${tipo} "${item.nome}"?`,
    );

    if (!confirmar) return;

    setErroGerenciamento("");
    setSucessoGerenciamento("");

    try {
      if (tipoGerenciamento === "autores") {
        await excluirAutor(item.id);

        const autoresAtualizados = await listarAutores();
        setAutores(autoresAtualizados);
      } else {
        await excluirGenero(item.id);

        const generosAtualizados = await listarGeneros();
        setGeneros(generosAtualizados);
      }

      if (registroEditando?.id === item.id) {
        cancelarEdicaoRegistro();
      }

      setSucessoGerenciamento("Registro excluído com sucesso.");

      await carregarCatalogo();
    } catch (error) {
      setErroGerenciamento(obterMensagemErro(error));
    }
  }

  function fecharGerenciamento() {
    if (salvandoGerenciamento) return;

    setTipoGerenciamento(null);
    setRegistroEditando(null);
    setFormCadastro({ nome: "", biografia: "" });
    setErroGerenciamento("");
    setSucessoGerenciamento("");
  }

  async function abrirGerenciamentoExemplares(livro) {
    if (!bibliotecario) return;

    setLivroSelecionado(livro);
    setExemplarEditando(null);
    setFormExemplar({ codigo: "" });
    setErroExemplares("");
    setFeedbackExemplares("");
    setModalExemplaresAberto(true);
    setCarregandoExemplares(true);

    try {
      const dados = await listarExemplares();
      setExemplares(dados);
    } catch (error) {
      setErroExemplares(obterMensagemErro(error));
    } finally {
      setCarregandoExemplares(false);
    }
  }

  function editarExemplar(exemplar) {
    setExemplarEditando(exemplar);
    setFormExemplar({ codigo: exemplar.codigo });
    setErroExemplares("");
    setFeedbackExemplares("");
  }

  function atualizarCampoExemplar(event) {
    const { name, value } = event.target;

    setFormExemplar((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  }

  function cancelarEdicaoExemplar() {
    setExemplarEditando(null);
    setFormExemplar({ codigo: "" });
    setErroExemplares("");
  }

  async function salvarExemplar(event) {
    event.preventDefault();

    setErroExemplares("");
    setFeedbackExemplares("");

    const codigo = formExemplar.codigo.trim();

    if (!codigo) {
      setErroExemplares("Informe o código do exemplar.");
      return;
    }

    setSalvandoExemplar(true);

    const dados = {
      livro_id: Number(livroSelecionado.id),
      codigo,
    };

    try {
      if (exemplarEditando) {
        await atualizarExemplar(exemplarEditando.id, dados);
      } else {
        await cadastrarExemplar(dados);
      }

      const exemplaresAtualizados = await listarExemplares();
      setExemplares(exemplaresAtualizados);

      setExemplarEditando(null);
      setFormExemplar({ codigo: "" });

      setFeedbackExemplares(
        exemplarEditando
          ? "Exemplar atualizado com sucesso."
          : "Exemplar cadastrado com sucesso.",
      );
    } catch (error) {
      setErroExemplares(obterMensagemErro(error));
    } finally {
      setSalvandoExemplar(false);
    }
  }

  async function removerExemplar(exemplar) {
    const confirmar = window.confirm(
      `Deseja realmente excluir o exemplar "${exemplar.codigo}"?`,
    );

    if (!confirmar) return;

    setErroExemplares("");
    setFeedbackExemplares("");

    try {
      await excluirExemplar(exemplar.id);

      const exemplaresAtualizados = await listarExemplares();
      setExemplares(exemplaresAtualizados);

      if (exemplarEditando?.id === exemplar.id) {
        cancelarEdicaoExemplar();
      }

      setFeedbackExemplares("Exemplar excluído com sucesso.");
    } catch (error) {
      setErroExemplares(obterMensagemErro(error));
    }
  }

  function fecharModalExemplares() {
    if (salvandoExemplar) return;

    setModalExemplaresAberto(false);
    setLivroSelecionado(null);
    setExemplarEditando(null);
    setFormExemplar({ codigo: "" });
    setErroExemplares("");
    setFeedbackExemplares("");
  }

  const categories = [
    "Todos",
    ...new Set(
      books.flatMap((book) =>
        (book.generos || []).map((genero) => genero.nome),
      ),
    ),
  ];

  const filteredBooks = books.filter((book) => {
    const matchesCategory =
      category === "Todos" ||
      (book.generos || []).some((genero) => genero.nome === category);

    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      !searchText ||
      (book.titulo || "").toLowerCase().includes(searchText) ||
      (book.isbn || "").toLowerCase().includes(searchText);

    return matchesCategory && matchesSearch;
  });

  const registrosGerenciamento =
    tipoGerenciamento === "autores" ? autores : generos;

  const exemplaresDoLivro = livroSelecionado
    ? exemplares.filter(
        (exemplar) =>
          Number(exemplar.livro_id) === Number(livroSelecionado.id),
      )
    : [];

  return (
    <div className="home-page">
      <header className="topbar">
        <Link to="/" className="logo">
          <BookOpen size={27} />
          <span>BiblioTech</span>
        </Link>

        <nav className="main-nav">
          <Link to="/">Início</Link>
          <a href="#catalogo">Livros</a>
          <Link to="/emprestimos">Empréstimos</Link>
          <Link to="/perfil">Meu perfil</Link>
        </nav>

        <button
          className="menu-button"
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir menu"
        >
          <Menu size={24} />
        </button>
      </header>

      {menuOpen && (
        <div className="drawer-overlay" onClick={() => setMenuOpen(false)}>
          <aside
            className="drawer"
            onClick={(event) => event.stopPropagation()}
          >
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

              <a href="#catalogo" onClick={() => setMenuOpen(false)}>
                Livros
              </a>

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
              Consulte o acervo da biblioteca, encontre títulos e descubra novas
              leituras.
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

        <section className="catalog" id="catalogo">
          {bibliotecario && (
            <div className="catalog-management">
              <div>
                <span>ÁREA DO BIBLIOTECÁRIO</span>
                <p>Gerencie os livros, autores e gêneros do acervo.</p>
              </div>

              <div className="catalog-management-actions">
                <button
                  type="button"
                  className="catalog-manage-button"
                  onClick={() => abrirGerenciamento("autores")}
                >
                  <Users size={17} />
                  Gerenciar autores
                </button>

                <button
                  type="button"
                  className="catalog-manage-button"
                  onClick={() => abrirGerenciamento("generos")}
                >
                  <Tags size={17} />
                  Gerenciar gêneros
                </button>

                <button
                  type="button"
                  className="catalog-add-book-button"
                  onClick={() => abrirFormulario()}
                >
                  <Plus size={18} />
                  Cadastrar livro
                </button>
              </div>
            </div>
          )}

          {feedback && (
            <div className="catalog-feedback sucesso">{feedback}</div>
          )}

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

              <h2>{category === "Todos" ? "Livros em destaque" : category}</h2>
            </div>

            <span className="catalog-count">
              {filteredBooks.length}{" "}
              {filteredBooks.length === 1 ? "livro" : "livros"}
            </span>
          </div>

          <div className="books-area">
            <button
              className="book-arrow left"
              type="button"
              onClick={() =>
                document.querySelector(".book-grid")?.scrollBy({
                  left: -300,
                  behavior: "smooth",
                })
              }
              aria-label="Livros anteriores"
            >
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

                      {bibliotecario && (
                        <div className="book-admin-actions">
                          <button
                            type="button"
                            onClick={() => abrirGerenciamentoExemplares(book)}
                          >
                            <Package size={14} />
                            Exemplares
                          </button>

                          <button
                            type="button"
                            onClick={() => abrirFormulario(book)}
                          >
                            <Pencil size={14} />
                            Editar
                          </button>

                          <button
                            type="button"
                            className="book-delete"
                            onClick={() => removerLivro(book.id)}
                          >
                            <Trash2 size={14} />
                            Excluir
                          </button>
                        </div>
                      )}
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

            <button
              className="book-arrow right"
              type="button"
              onClick={() =>
                document.querySelector(".book-grid")?.scrollBy({
                  left: 300,
                  behavior: "smooth",
                })
              }
              aria-label="Próximos livros"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </section>

        <section className="library-strip">
          <div>
            <span>ACERVO BIBLIOTECH</span>
            <h2>Uma biblioteca para descobrir.</h2>
          </div>

          <a href="#catalogo">
            Explorar acervo
            <ChevronRight size={17} />
          </a>
        </section>
      </main>

      <footer className="footer">
        <div className="logo">
          <BookOpen size={21} />
          <span>BiblioTech</span>
        </div>

        <p>© 2026 BiblioTech. Sistema de Gestão de Biblioteca.</p>
      </footer>

      {modalAberto && (
        <div className="book-modal-overlay" onClick={fecharFormulario}>
          <section
            className="book-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="book-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="book-modal-header">
              <div>
                <span>GERENCIAMENTO DO ACERVO</span>

                <h2 id="book-modal-title">
                  {livroEditando ? "Editar livro" : "Cadastrar livro"}
                </h2>
              </div>

              <button
                type="button"
                onClick={fecharFormulario}
                disabled={salvandoLivro || buscandoOpenLibrary}
                aria-label="Fechar formulário"
              >
                <X size={22} />
              </button>
            </header>

            {erroFormulario && (
              <div className="book-form-error">{erroFormulario}</div>
            )}

            {carregandoOpcoes ? (
              <p className="book-form-loading">
                Carregando autores e gêneros...
              </p>
            ) : (
              <form className="book-form" onSubmit={salvarLivro}>
                <div className="book-form-grid">
                  <div className="book-form-field full">
                    <label htmlFor="titulo">Título</label>

                    <input
                      id="titulo"
                      name="titulo"
                      type="text"
                      maxLength="150"
                      value={formLivro.titulo}
                      onChange={atualizarCampo}
                      required
                    />
                  </div>

                  <div className="book-form-field full">
                    <label htmlFor="isbn">ISBN</label>

                    <div className="isbn-search-row">
                      <input
                        id="isbn"
                        name="isbn"
                        type="text"
                        maxLength="20"
                        value={formLivro.isbn}
                        onChange={atualizarCampo}
                        required
                      />

                      <button
                        type="button"
                        className="isbn-search-button"
                        onClick={buscarDadosOpenLibrary}
                        disabled={
                          buscandoOpenLibrary ||
                          salvandoLivro ||
                          !formLivro.isbn.trim()
                        }
                      >
                        <Search size={16} />

                        {buscandoOpenLibrary ? "Buscando..." : "Buscar dados"}
                      </button>
                    </div>

                    {erroBuscaIsbn && (
                      <small className="isbn-search-error">
                        {erroBuscaIsbn}
                      </small>
                    )}

                    {feedbackBuscaIsbn && (
                      <small className="isbn-search-success">
                        {feedbackBuscaIsbn}
                      </small>
                    )}

                    {autoresCriadosAutomaticamente.length > 0 && (
                      <div className="isbn-authors-warning">
                        <strong>Autores cadastrados automaticamente:</strong>

                        <p>{autoresCriadosAutomaticamente.join(", ")}</p>

                        <small>
                          Os autores foram adicionados ao acervo e selecionados
                          para este livro.
                        </small>
                      </div>
                    )}

                    {generosCriadosAutomaticamente.length > 0 && (
                      <div className="isbn-authors-warning">
                        <strong>Gêneros cadastrados automaticamente:</strong>

                        <p>{generosCriadosAutomaticamente.join(", ")}</p>

                        <small>
                          Os gêneros foram adicionados ao acervo e selecionados
                          para este livro.
                        </small>
                      </div>
                    )}
                  </div>

                  <div className="book-form-field">
                    <label htmlFor="ano_publicacao">Ano de publicação</label>

                    <input
                      id="ano_publicacao"
                      name="ano_publicacao"
                      type="number"
                      value={formLivro.ano_publicacao}
                      onChange={atualizarCampo}
                      required
                    />
                  </div>

                  <div className="book-form-field full">
                    <label htmlFor="capa">Caminho ou endereço da capa</label>

                    <input
                      id="capa"
                      name="capa"
                      type="text"
                      maxLength="200"
                      placeholder="Ex.: imagens/livro.jpg"
                      value={formLivro.capa}
                      onChange={atualizarCampo}
                      required
                    />
                  </div>

                  <div className="book-form-field full">
                    <label htmlFor="sinopse">Sinopse</label>

                    <textarea
                      id="sinopse"
                      name="sinopse"
                      rows="4"
                      value={formLivro.sinopse}
                      onChange={atualizarCampo}
                      required
                    />
                  </div>
                </div>

                <div className="book-form-relations">
                  <div className="book-form-field">
                    <label>Autores</label>

                    <div className="book-check-list">
                      {autores.map((autor) => (
                        <label className="book-check-option" key={autor.id}>
                          <input
                            type="checkbox"
                            checked={formLivro.autores.includes(
                              String(autor.id),
                            )}
                            onChange={(event) =>
                              alternarSelecao(
                                "autores",
                                autor.id,
                                event.target.checked,
                              )
                            }
                          />

                          <span>{autor.nome}</span>
                        </label>
                      ))}

                      {autores.length === 0 && (
                        <small>
                          Cadastre um autor antes de adicionar livros.
                        </small>
                      )}
                    </div>
                  </div>

                  <div className="book-form-field">
                    <label>Gêneros</label>

                    <div className="book-check-list">
                      {generos.map((genero) => (
                        <label className="book-check-option" key={genero.id}>
                          <input
                            type="checkbox"
                            checked={formLivro.generos.includes(
                              String(genero.id),
                            )}
                            onChange={(event) =>
                              alternarSelecao(
                                "generos",
                                genero.id,
                                event.target.checked,
                              )
                            }
                          />

                          <span>{genero.nome}</span>
                        </label>
                      ))}

                      {generos.length === 0 && (
                        <small>
                          Cadastre um gênero antes de adicionar livros.
                        </small>
                      )}
                    </div>
                  </div>
                </div>

                <footer className="book-form-footer">
                  <button
                    type="button"
                    className="book-form-cancel"
                    onClick={fecharFormulario}
                    disabled={salvandoLivro || buscandoOpenLibrary}
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="book-form-save"
                    disabled={
                      salvandoLivro ||
                      buscandoOpenLibrary ||
                      autores.length === 0 ||
                      generos.length === 0
                    }
                  >
                    <Save size={17} />

                    {salvandoLivro
                      ? "Salvando..."
                      : livroEditando
                        ? "Salvar alterações"
                        : "Cadastrar livro"}
                  </button>
                </footer>
              </form>
            )}
          </section>
        </div>
      )}

      {tipoGerenciamento && (
        <div className="book-modal-overlay" onClick={fecharGerenciamento}>
          <section
            className="book-modal catalog-manage-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="management-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="book-modal-header">
              <div>
                <span>GERENCIAMENTO DO ACERVO</span>

                <h2 id="management-modal-title">
                  {tipoGerenciamento === "autores"
                    ? "Gerenciar autores"
                    : "Gerenciar gêneros"}
                </h2>
              </div>

              <button
                type="button"
                onClick={fecharGerenciamento}
                disabled={salvandoGerenciamento}
                aria-label="Fechar gerenciamento"
              >
                <X size={22} />
              </button>
            </header>

            {erroGerenciamento && (
              <div className="catalog-manage-error">{erroGerenciamento}</div>
            )}

            {sucessoGerenciamento && (
              <div className="catalog-manage-success">
                {sucessoGerenciamento}
              </div>
            )}

            {carregandoGerenciamento ? (
              <p>Carregando registros...</p>
            ) : (
              <div className="catalog-manage-content">
                <form className="catalog-manage-form" onSubmit={salvarRegistro}>
                  <h3>
                    {registroEditando ? "Editar registro" : "Novo registro"}
                  </h3>

                  <div className="book-form-field">
                    <label htmlFor="nomeCadastro">Nome</label>

                    <input
                      id="nomeCadastro"
                      name="nome"
                      type="text"
                      maxLength="150"
                      value={formCadastro.nome}
                      onChange={atualizarCampoCadastro}
                      required
                    />
                  </div>

                  {tipoGerenciamento === "autores" && (
                    <div className="book-form-field">
                      <label htmlFor="biografiaCadastro">Biografia</label>

                      <textarea
                        id="biografiaCadastro"
                        name="biografia"
                        rows="4"
                        value={formCadastro.biografia}
                        onChange={atualizarCampoCadastro}
                      />
                    </div>
                  )}

                  <div className="catalog-manage-form-actions">
                    {registroEditando && (
                      <button
                        type="button"
                        onClick={cancelarEdicaoRegistro}
                        disabled={salvandoGerenciamento}
                      >
                        Cancelar
                      </button>
                    )}

                    <button type="submit" disabled={salvandoGerenciamento}>
                      <Save size={16} />

                      {salvandoGerenciamento
                        ? "Salvando..."
                        : registroEditando
                          ? "Salvar alterações"
                          : "Cadastrar"}
                    </button>
                  </div>
                </form>

                <div className="catalog-manage-list">
                  <h3>
                    {tipoGerenciamento === "autores"
                      ? "Autores cadastrados"
                      : "Gêneros cadastrados"}
                  </h3>

                  {registrosGerenciamento.length === 0 ? (
                    <p>Nenhum registro cadastrado.</p>
                  ) : (
                    registrosGerenciamento.map((item) => (
                      <article className="catalog-manage-item" key={item.id}>
                        <div>
                          <strong>{item.nome}</strong>

                          {tipoGerenciamento === "autores" &&
                            item.biografia && <p>{item.biografia}</p>}
                        </div>

                        <div className="catalog-manage-item-actions">
                          <button
                            type="button"
                            onClick={() => editarRegistro(item)}
                          >
                            <Pencil size={14} />
                            Editar
                          </button>

                          <button
                            type="button"
                            className="book-delete"
                            onClick={() => removerRegistro(item)}
                          >
                            <Trash2 size={14} />
                            Excluir
                          </button>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </div>
            )}
          </section>
        </div>
      )}

      {modalExemplaresAberto && livroSelecionado && (
        <div className="book-modal-overlay" onClick={fecharModalExemplares}>
          <section
            className="book-modal catalog-manage-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="exemplar-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="book-modal-header">
              <div>
                <span>GERENCIAMENTO DO ACERVO</span>

                <h2 id="exemplar-modal-title">Exemplares</h2>
                <p>{livroSelecionado.titulo}</p>
              </div>

              <button
                type="button"
                onClick={fecharModalExemplares}
                disabled={salvandoExemplar}
                aria-label="Fechar gerenciamento"
              >
                <X size={22} />
              </button>
            </header>

            {erroExemplares && (
              <div className="catalog-manage-error">{erroExemplares}</div>
            )}

            {feedbackExemplares && (
              <div className="catalog-manage-success">
                {feedbackExemplares}
              </div>
            )}

            {carregandoExemplares ? (
              <p>Carregando exemplares...</p>
            ) : (
              <div className="catalog-manage-content">
                <form className="catalog-manage-form" onSubmit={salvarExemplar}>
                  <h3>
                    {exemplarEditando ? "Editar exemplar" : "Novo exemplar"}
                  </h3>

                  <div className="book-form-field">
                    <label htmlFor="codigoExemplar">Código do exemplar</label>

                    <input
                      id="codigoExemplar"
                      name="codigo"
                      type="text"
                      value={formExemplar.codigo}
                      onChange={atualizarCampoExemplar}
                      required
                    />
                  </div>

                  <div className="catalog-manage-form-actions">
                    {exemplarEditando && (
                      <button
                        type="button"
                        onClick={cancelarEdicaoExemplar}
                        disabled={salvandoExemplar}
                      >
                        Cancelar
                      </button>
                    )}

                    <button type="submit" disabled={salvandoExemplar}>
                      <Save size={16} />

                      {salvandoExemplar
                        ? "Salvando..."
                        : exemplarEditando
                          ? "Salvar alterações"
                          : "Cadastrar"}
                    </button>
                  </div>
                </form>

                <div className="catalog-manage-list">
                  <h3>Exemplares cadastrados</h3>

                  {exemplaresDoLivro.length === 0 ? (
                    <p>Nenhum exemplar cadastrado para este livro.</p>
                  ) : (
                    exemplaresDoLivro.map((exemplar) => (
                      <article
                        className="catalog-manage-item"
                        key={exemplar.id}
                      >
                        <div>
                          <strong>{exemplar.codigo}</strong>

                          <span
                            className={`exemplar-status ${exemplar.status}`}
                          >
                            {exemplar.status === "disponivel"
                              ? "Disponível"
                              : exemplar.status === "emprestado"
                                ? "Emprestado"
                                : exemplar.status}
                          </span>
                        </div>

                        <div className="catalog-manage-item-actions">
                          <button
                            type="button"
                            onClick={() => editarExemplar(exemplar)}
                            disabled={exemplar.status !== "disponivel"}
                            title={
                              exemplar.status !== "disponivel"
                                ? "Não é possível editar um exemplar emprestado."
                                : "Editar exemplar"
                            }
                          >
                            <Pencil size={14} />
                            Editar
                          </button>

                          <button
                            type="button"
                            className="book-delete"
                            onClick={() => removerExemplar(exemplar)}
                            disabled={exemplar.status !== "disponivel"}
                            title={
                              exemplar.status !== "disponivel"
                                ? "Não é possível excluir um exemplar emprestado."
                                : "Excluir exemplar"
                            }
                          >
                            <Trash2 size={14} />
                            Excluir
                          </button>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

export default Home;
