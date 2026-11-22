import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BookOpen,
  CalendarDays,
  CheckCircle,
  Clock,
  Plus,
  RotateCcw,
  Trash2,
  X,
  Menu,
  LogOut,
  Pencil,
  Save,
} from "lucide-react";

import { useAuth } from "../context/useAuth";
import api from "../api/client";

import {
  listarEmprestimos,
  registrarEmprestimo,
  atualizarEmprestimo,
  devolverEmprestimo,
  excluirEmprestimo,
} from "../api/emprestimos";

import "./Home.css";
import "./Emprestimos.css";

function obterDataAtual() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

function formatarData(data) {
  if (!data) return "—";

  const valor =
    data.length === 10 ? `${data}T00:00:00` : data.replace(" ", "T");

  const dataFormatada = new Date(valor);

  if (Number.isNaN(dataFormatada.getTime())) return data;

  return dataFormatada.toLocaleDateString("pt-BR");
}

function obterMensagemErro(erro) {
  const erros = erro.response?.data?.errors;

  if (erros) {
    return Object.values(erros).flat().join(" ");
  }

  return (
    erro.response?.data?.message || "Não foi possível realizar a operação."
  );
}

function Emprestimos() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const bibliotecario = usuario?.perfil === "bibliotecario";

  const [menuAberto, setMenuAberto] = useState(false);

  const [emprestimos, setEmprestimos] = useState([]);
  const [exemplares, setExemplares] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [atualizandoPrevisao, setAtualizandoPrevisao] = useState(false);

  const [formularioAberto, setFormularioAberto] = useState(false);

  const [exemplarId, setExemplarId] = useState("");
  const [usuarioId, setUsuarioId] = useState("");
  const [dataPrevista, setDataPrevista] = useState("");

  const [emprestimoEditando, setEmprestimoEditando] = useState(null);
  const [novaDataPrevista, setNovaDataPrevista] = useState("");

  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregarEmprestimos() {
      try {
        const dados = await listarEmprestimos();

        if (ativo) {
          setEmprestimos(dados);
        }
      } catch (erro) {
        if (ativo) {
          setErro(obterMensagemErro(erro));
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarEmprestimos();

    return () => {
      ativo = false;
    };
  }, []);

  async function atualizarLista() {
    const dados = await listarEmprestimos();
    setEmprestimos(dados);
  }

  async function abrirFormulario() {
    setErro("");
    setMensagem("");
    setFormularioAberto(true);

    setExemplarId("");
    setUsuarioId("");
    setDataPrevista("");
    setUsuarios([]);

    try {
      const { data: exemplaresData } = await api.get("/exemplares");

      setExemplares(
        exemplaresData.filter((exemplar) => exemplar.status === "disponivel"),
      );

      if (bibliotecario) {
        const { data: usuariosData } = await api.get("/usuarios");

        setUsuarios(usuariosData);
      }
    } catch (erro) {
      setErro(obterMensagemErro(erro));
    }
  }

  async function salvarEmprestimo(event) {
    event.preventDefault();

    setErro("");
    setSalvando(true);

    const dados = {
      exemplar_id: Number(exemplarId),
      data_prevista: dataPrevista,
    };

    if (bibliotecario) {
      dados.usuario_id = Number(usuarioId);
    }

    try {
      await registrarEmprestimo(dados);

      setFormularioAberto(false);
      setExemplarId("");
      setUsuarioId("");
      setDataPrevista("");

      setMensagem("Empréstimo registrado com sucesso.");

      await atualizarLista();
    } catch (erro) {
      setErro(obterMensagemErro(erro));
    } finally {
      setSalvando(false);
    }
  }

  function iniciarEdicaoPrevisao(emprestimo) {
    setErro("");
    setMensagem("");

    setEmprestimoEditando(emprestimo.id);
    setNovaDataPrevista(emprestimo.data_prevista);
  }

  function cancelarEdicaoPrevisao() {
    setEmprestimoEditando(null);
    setNovaDataPrevista("");
  }

  async function salvarPrevisao(id) {
    if (!novaDataPrevista) {
      setErro("Informe uma nova data de devolução.");
      return;
    }

    setErro("");
    setMensagem("");
    setAtualizandoPrevisao(true);

    try {
      await atualizarEmprestimo(id, {
        data_prevista: novaDataPrevista,
      });

      setEmprestimoEditando(null);
      setNovaDataPrevista("");

      setMensagem("Previsão de devolução atualizada com sucesso.");

      await atualizarLista();
    } catch (erro) {
      setErro(obterMensagemErro(erro));
    } finally {
      setAtualizandoPrevisao(false);
    }
  }

  async function registrarDevolucao(id) {
    const confirmar = window.confirm(
      "Deseja realmente registrar a devolução deste exemplar?",
    );

    if (!confirmar) return;

    setErro("");
    setMensagem("");

    try {
      await devolverEmprestimo(id);

      setMensagem("Devolução registrada com sucesso.");

      await atualizarLista();
    } catch (erro) {
      setErro(obterMensagemErro(erro));
    }
  }

  async function excluirRegistro(id) {
    const confirmar = window.confirm(
      "Deseja realmente excluir este registro de empréstimo?",
    );

    if (!confirmar) return;

    setErro("");
    setMensagem("");

    try {
      await excluirEmprestimo(id);

      setMensagem("Registro excluído com sucesso.");

      await atualizarLista();
    } catch (erro) {
      setErro(obterMensagemErro(erro));
    }
  }

  async function encerrarSessao() {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="home-page emprestimos-container">
      <header className="topbar">
        <Link to="/" className="logo" onClick={() => setMenuAberto(false)}>
          <BookOpen size={23} />
          <span>Biblioteca</span>
        </Link>

        <nav className="main-nav">
          <Link to="/">Catálogo</Link>

          <Link to="/emprestimos" className="active" aria-current="page">
            Empréstimos
          </Link>

          <Link to="/perfil">Meu Perfil</Link>
        </nav>

        <button
          className="menu-button"
          type="button"
          onClick={() => setMenuAberto(true)}
          aria-label="Abrir menu"
        >
          <Menu size={21} />
        </button>
      </header>

      {menuAberto && (
        <div className="drawer-overlay" onClick={() => setMenuAberto(false)}>
          <aside
            className="drawer"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="close-button"
              type="button"
              onClick={() => setMenuAberto(false)}
              aria-label="Fechar menu"
            >
              <X size={23} />
            </button>

            <div className="drawer-logo">
              <BookOpen size={23} />
              Biblioteca
            </div>

            <nav>
              <Link to="/" onClick={() => setMenuAberto(false)}>
                Catálogo
              </Link>

              <Link
                to="/emprestimos"
                className="active"
                onClick={() => setMenuAberto(false)}
              >
                Empréstimos
              </Link>

              <Link to="/perfil" onClick={() => setMenuAberto(false)}>
                Meu Perfil
              </Link>
            </nav>

            <button
              className="logout-button"
              type="button"
              onClick={encerrarSessao}
            >
              <LogOut size={18} />
              Sair
            </button>
          </aside>
        </div>
      )}

      <header className="emprestimos-header">
        <div>
          <h1>
            {bibliotecario
              ? "Gerenciamento de Empréstimos"
              : "Meus Empréstimos"}
          </h1>

          <p>
            {bibliotecario
              ? "Consulte e gerencie os empréstimos da biblioteca."
              : "Acompanhe seus livros emprestados e suas devoluções."}
          </p>
        </div>

        <button
          className="emprestimos-novo"
          type="button"
          onClick={abrirFormulario}
        >
          <Plus size={19} />
          Novo empréstimo
        </button>
      </header>

      {mensagem && (
        <div className="emprestimos-mensagem sucesso">
          <CheckCircle size={18} />
          {mensagem}
        </div>
      )}

      {erro && <div className="emprestimos-mensagem erro">{erro}</div>}

      {formularioAberto && (
        <section className="emprestimos-formulario">
          <div className="emprestimos-formulario-header">
            <h2>Novo empréstimo</h2>

            <button
              type="button"
              onClick={() => setFormularioAberto(false)}
              disabled={salvando}
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={salvarEmprestimo}>
            {bibliotecario && (
              <div className="emprestimos-campo">
                <label>Usuário destinatário</label>

                <select
                  value={usuarioId}
                  onChange={(event) => setUsuarioId(event.target.value)}
                  required
                >
                  <option value="">Selecione um usuário</option>

                  {usuarios.map((usuario) => (
                    <option key={usuario.id} value={usuario.id}>
                      {usuario.nome} — {usuario.email}
                    </option>
                  ))}
                </select>

                {usuarios.length === 0 && (
                  <small>Não existem usuários ativos cadastrados.</small>
                )}
              </div>
            )}

            <div className="emprestimos-campo">
              <label>Exemplar disponível</label>

              <select
                value={exemplarId}
                onChange={(event) => setExemplarId(event.target.value)}
                required
              >
                <option value="">Selecione um exemplar</option>

                {exemplares.map((exemplar) => (
                  <option key={exemplar.id} value={exemplar.id}>
                    {exemplar.codigo} - {exemplar.livro?.titulo}
                  </option>
                ))}
              </select>

              {exemplares.length === 0 && (
                <small>Não existem exemplares disponíveis.</small>
              )}
            </div>

            <div className="emprestimos-campo">
              <label>Data prevista para devolução</label>

              <input
                type="date"
                value={dataPrevista}
                onChange={(event) => setDataPrevista(event.target.value)}
                min={obterDataAtual()}
                required
              />
            </div>

            <button
              className="emprestimos-salvar"
              type="submit"
              disabled={
                salvando ||
                exemplares.length === 0 ||
                !exemplarId ||
                (bibliotecario && (!usuarioId || usuarios.length === 0))
              }
            >
              {salvando ? "Registrando..." : "Registrar empréstimo"}
            </button>
          </form>
        </section>
      )}

      <section className="emprestimos-lista">
        <div className="emprestimos-lista-header">
          <h2>Registros</h2>

          <span>
            {emprestimos.length}{" "}
            {emprestimos.length === 1 ? "empréstimo" : "empréstimos"}
          </span>
        </div>

        {carregando ? (
          <p className="emprestimos-vazio">Carregando empréstimos...</p>
        ) : emprestimos.length === 0 ? (
          <div className="emprestimos-vazio">
            <BookOpen size={35} />
            <h3>Nenhum empréstimo encontrado</h3>
            <p>Os empréstimos registrados aparecerão aqui.</p>
          </div>
        ) : (
          <div className="emprestimos-cards">
            {emprestimos.map((emprestimo) => {
              const devolvido = emprestimo.situacao === "devolvido";

              const editando = emprestimoEditando === emprestimo.id;

              return (
                <article className="emprestimo-card" key={emprestimo.id}>
                  <div className="emprestimo-card-topo">
                    <div className="emprestimo-livro">
                      <BookOpen size={23} />

                      <div>
                        <h3>
                          {emprestimo.exemplar?.livro?.titulo ||
                            "Livro não identificado"}
                        </h3>

                        <span>
                          Exemplar: {emprestimo.exemplar?.codigo || "—"}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`emprestimo-status ${
                        devolvido ? "devolvido" : "ativo"
                      }`}
                    >
                      {devolvido ? "Devolvido" : "Ativo"}
                    </span>
                  </div>

                  {bibliotecario && (
                    <p className="emprestimo-usuario">
                      Usuário: {emprestimo.usuario?.nome || "Não identificado"}
                    </p>
                  )}

                  <div className="emprestimo-datas">
                    <div>
                      <CalendarDays size={17} />
                      <span>
                        Empréstimo: {formatarData(emprestimo.data_emprestimo)}
                      </span>
                    </div>

                    <div>
                      <Clock size={17} />
                      <span>
                        Previsão: {formatarData(emprestimo.data_prevista)}
                      </span>
                    </div>

                    {emprestimo.data_devolucao && (
                      <div>
                        <CheckCircle size={17} />
                        <span>
                          Devolução: {formatarData(emprestimo.data_devolucao)}
                        </span>
                      </div>
                    )}
                  </div>

                  {bibliotecario && !devolvido && editando && (
                    <div className="emprestimo-edicao-previsao">
                      <label>Nova data prevista</label>

                      <input
                        type="date"
                        value={novaDataPrevista}
                        min={obterDataAtual()}
                        onChange={(event) =>
                          setNovaDataPrevista(event.target.value)
                        }
                        disabled={atualizandoPrevisao}
                      />

                      <div className="emprestimo-edicao-botoes">
                        <button
                          type="button"
                          className="emprestimo-btn-cancelar"
                          onClick={cancelarEdicaoPrevisao}
                          disabled={atualizandoPrevisao}
                        >
                          <X size={15} />
                          Cancelar
                        </button>

                        <button
                          type="button"
                          className="emprestimo-btn-editar"
                          onClick={() => salvarPrevisao(emprestimo.id)}
                          disabled={atualizandoPrevisao || !novaDataPrevista}
                        >
                          <Save size={15} />
                          {atualizandoPrevisao ? "Salvando..." : "Salvar data"}
                        </button>
                      </div>
                    </div>
                  )}

                  {bibliotecario && (
                    <div className="emprestimo-acoes">
                      {!devolvido && (
                        <>
                          {!editando && (
                            <button
                              type="button"
                              className="emprestimo-btn-editar"
                              onClick={() => iniciarEdicaoPrevisao(emprestimo)}
                            >
                              <Pencil size={16} />
                              Alterar previsão
                            </button>
                          )}

                          <button
                            type="button"
                            className="emprestimo-btn-devolver"
                            onClick={() => registrarDevolucao(emprestimo.id)}
                          >
                            <RotateCcw size={16} />
                            Registrar devolução
                          </button>
                        </>
                      )}

                      {devolvido && (
                        <button
                          type="button"
                          className="emprestimo-btn-excluir"
                          onClick={() => excluirRegistro(emprestimo.id)}
                        >
                          <Trash2 size={16} />
                          Excluir registro
                        </button>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default Emprestimos;
