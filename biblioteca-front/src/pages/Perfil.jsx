import { useState, useRef } from "react";
import { User, Camera, Save, X, Mail, AtSign, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/useAuth";
import "./Perfil.css";

export default function Perfil() {
  const dadosSalvos = JSON.parse(localStorage.getItem("perfilGava") || "null");

  const [usuario, setUsuario] = useState(
    dadosSalvos?.usuario || {
      nome: "Usuário",
      username: "usuario_gava",
      email: "usuario@email.com",
    },
  );

  const [foto, setFoto] = useState(dadosSalvos?.foto || null);
  const [fotoOriginal, setFotoOriginal] = useState(dadosSalvos?.foto || null);

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
      const dados = {
        usuario: usuario,
        foto: foto,
      };

      localStorage.setItem("perfilGava", JSON.stringify(dados));

      setFotoOriginal(foto);
      setEditando(false);

      alert("Perfil salvo com sucesso!");
    } catch (erro) {
      console.error("Erro ao salvar perfil:", erro);
      alert("Não foi possível salvar. Verifique o tamanho da imagem.");
    }
  }

  function cancelarAlteracoes() {
    const dados = JSON.parse(localStorage.getItem("perfilGava") || "null");

    if (dados) {
      setUsuario(dados.usuario);
      setFoto(dados.foto);
      setFotoOriginal(dados.foto);
    } else {
      setUsuario({
        nome: "Usuário",
        username: "usuario_gava",
        email: "usuario@email.com",
      });

      setFoto(null);
      setFotoOriginal(null);
    }

    setEditando(false);
  }

  return (
    <div className="perfil-container">
      <header className="perfil-header">
        <button className="perfil-voltar" onClick={() => window.history.back()}>
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
                src={
                  foto ||
                  "https://ui-avatars.com/api/?name=Usuario&background=8B5E3C&color=fff&size=200"
                }
                alt="Foto de perfil"
                className="perfil-foto"
              />

              <button
                className="perfil-camera"
                onClick={() => inputFoto.current.click()}
                title="Alterar foto"
                type="button"
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

            <h2>{usuario.username}</h2>
            <span>Cliente Gava</span>
          </div>

          <div className="perfil-form">
            <div className="perfil-section-title">
              <User size={21} />
              <h3>Informações pessoais</h3>
            </div>

            {/* Nome completo */}
            <div className="perfil-field">
              <label>Nome completo</label>

              <input
                type="text"
                value={usuario.nome}
                disabled={!editando}
                onChange={(e) =>
                  setUsuario({
                    ...usuario,
                    nome: e.target.value,
                  })
                }
              />
            </div>

            {/* Nome de usuário */}
            <div className="perfil-field">
              <label>Nome de usuário</label>

              <div className="perfil-input-icon">
                <AtSign size={18} />

                <input
                  type="text"
                  value={usuario.username}
                  disabled={!editando}
                  onChange={(e) =>
                    setUsuario({
                      ...usuario,
                      username: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            {/* E-mail */}
            <div className="perfil-field">
              <label>E-mail</label>

              <div className="perfil-input-icon">
                <Mail size={18} />

                <input
                  type="email"
                  value={usuario.email}
                  disabled={!editando}
                  onChange={(e) =>
                    setUsuario({
                      ...usuario,
                      email: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            {/* Botões */}
            <div className="perfil-buttons">
              {!editando ? (
                <button
                  className="perfil-btn-editar"
                  onClick={() => setEditando(true)}
                >
                  Editar perfil
                </button>
              ) : (
                <>
                  <button
                    className="perfil-btn-cancelar"
                    onClick={cancelarAlteracoes}
                  >
                    <X size={18} />
                    Cancelar
                  </button>

                  <button
                    className="perfil-btn-salvar"
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
