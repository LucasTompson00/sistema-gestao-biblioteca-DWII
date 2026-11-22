import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Camera, Save, X, Mail, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/useAuth";
import "./Perfil.css";

function obterDadosSalvos(chavePerfil) {
  try {
    return chavePerfil
      ? JSON.parse(localStorage.getItem(chavePerfil) || "null")
      : null;
  } catch {
    return null;
  }
}

export default function Perfil() {
  const { usuario: usuarioAutenticado } = useAuth();
  const navigate = useNavigate();

  const chavePerfil = usuarioAutenticado?.id
    ? `perfilGava_${usuarioAutenticado.id}`
    : null;

  const [usuario, setUsuario] = useState(() => {
    const dadosSalvos = obterDadosSalvos(chavePerfil);

    return {
      nome: dadosSalvos?.usuario?.nome ?? usuarioAutenticado?.nome ?? "",
      email: dadosSalvos?.usuario?.email ?? usuarioAutenticado?.email ?? "",
    };
  });

  const [foto, setFoto] = useState(
    () => obterDadosSalvos(chavePerfil)?.foto ?? null,
  );

  const [editando, setEditando] = useState(false);

  const inputFoto = useRef(null);

  function selecionarFoto(event) {
    const arquivo = event.target.files[0];

    if (!arquivo) return;

    if (!arquivo.type.startsWith("image/")) {
      alert("Selecione uma imagem válida.");
      return;
    }

    const leitor = new FileReader();

    leitor.onload = () => {
      setFoto(leitor.result);
    };

    leitor.readAsDataURL(arquivo);
  }

  function salvarAlteracoes() {
    try {
      if (!chavePerfil) {
        throw new Error("Não foi possível identificar o usuário.");
      }

      const dados = {
        usuario,
        foto,
      };

      localStorage.setItem(chavePerfil, JSON.stringify(dados));

      setEditando(false);

      alert(
        "Perfil salvo neste navegador. A atualização no banco de dados ainda não está implementada.",
      );
    } catch (erro) {
      console.error("Erro ao salvar perfil:", erro);
      alert("Não foi possível salvar. Verifique o tamanho da imagem.");
    }
  }

  function cancelarAlteracoes() {
    const dadosSalvos = obterDadosSalvos(chavePerfil);

    setUsuario({
      nome: dadosSalvos?.usuario?.nome ?? usuarioAutenticado?.nome ?? "",
      email: dadosSalvos?.usuario?.email ?? usuarioAutenticado?.email ?? "",
    });

    setFoto(dadosSalvos?.foto ?? null);
    setEditando(false);
  }

  const fotoPadrao = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    usuario.nome || "Usuario",
  )}&background=8B5E3C&color=fff&size=200`;

  return (
    <div className="perfil-container">
      <header className="perfil-header">
        <button
          className="perfil-voltar"
          type="button"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <h1>Meu Perfil</h1>
          <p>Gerencie suas informações pessoais</p>
        </div>
      </header>

      <main className="perfil-content">
        <section className="perfil-card">
          <div className="perfil-banner">
            <div className="perfil-foto-container">
              <img
                src={foto || fotoPadrao}
                alt="Foto de perfil"
                className="perfil-foto"
              />

              <button
                className="perfil-camera"
                type="button"
                onClick={() => inputFoto.current.click()}
                title="Alterar foto"
              >
                <Camera size={18} />
              </button>

              <input
                type="file"
                accept="image/*"
                ref={inputFoto}
                onChange={selecionarFoto}
                hidden
              />
            </div>

            <h2>{usuario.nome || "Usuário"}</h2>

            <span>{usuarioAutenticado?.perfil || "Usuário da biblioteca"}</span>
          </div>

          <div className="perfil-form">
            <div className="perfil-section-title">
              <User size={21} />
              <h3>Informações pessoais</h3>
            </div>

            <div className="perfil-field">
              <label>Nome completo</label>

              <input
                type="text"
                value={usuario.nome}
                disabled={!editando}
                onChange={(event) =>
                  setUsuario({
                    ...usuario,
                    nome: event.target.value,
                  })
                }
              />
            </div>

            <div className="perfil-field">
              <label>E-mail</label>

              <div className="perfil-input-icon">
                <Mail size={18} />

                <input
                  type="email"
                  value={usuario.email}
                  disabled={!editando}
                  onChange={(event) =>
                    setUsuario({
                      ...usuario,
                      email: event.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="perfil-buttons">
              {!editando ? (
                <button
                  className="perfil-btn-editar"
                  type="button"
                  onClick={() => setEditando(true)}
                >
                  Editar perfil
                </button>
              ) : (
                <>
                  <button
                    className="perfil-btn-cancelar"
                    type="button"
                    onClick={cancelarAlteracoes}
                  >
                    <X size={18} />
                    Cancelar
                  </button>

                  <button
                    className="perfil-btn-salvar"
                    type="button"
                    onClick={salvarAlteracoes}
                  >
                    <Save size={18} />
                    Salvar alterações
                  </button>
                </>
              )}
            </div>
          </div>
        </section>

        <p className="perfil-footer">Panificadora Gava © 2026</p>
      </main>
    </div>
  );
}
