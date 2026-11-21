
import { useState } from "react";
import axios from "axios";

export default function CadastroLivro() {
    const [form, setForm] = useState({
        isbn: "",
        titulo: "",
        autor: "",
        ano_publicacao: "",
    });

    const [imagemCapa, setImagemCapa] = useState("");
    const [buscandoIsbn, setBuscandoIsbn] = useState(false);
    const [erroIsbn, setErroIsbn] = useState("");

    function handleChange(event) {
        const { name, value } = event.target;

        setForm((f) => ({
            ...f,
            [name]: value,
        }));
    }

    async function buscarLivro() {
        if (!form.isbn.trim()) {
            alert("Digite um ISBN antes de buscar.");
            return;
        }

        setImagemCapa("");
        setBuscandoIsbn(true);
        setErroIsbn("");
        setImagemCapa("");

        try {
            const resposta = await axios.get(
                `https://openlibrary.org/isbn/${form.isbn.trim()}.json`
            );

            console.log("Dados do livro:", resposta.data);
            console.log("Autores encontrados:", resposta.data.authors);

            let nomeAutor = "";

            const obra = resposta.data.works?.[0];

            if (obra?.key) {
                const respostaObra = await axios.get(
                    `https://openlibrary.org${obra.key}.json`
                );

                const autores = respostaObra.data.authors;

                if (autores?.length > 0) {
                    const chaveAutor = autores[0].author.key;

                    const respostaAutor = await axios.get(
                        `https://openlibrary.org${chaveAutor}.json`
                    );

                    nomeAutor = respostaAutor.data.name || "";
                }
            }

            setForm((f) => ({
                ...f,
                titulo: resposta.data.title || "",
                autor: nomeAutor,
                ano_publicacao: resposta.data.publish_date
                    ? resposta.data.publish_date.match(/\d{4}/)?.[0] || ""
                    : "",
            }));

            const capa = resposta.data.covers?.[0];

            if (capa) {
                setImagemCapa(
                    `https://covers.openlibrary.org/b/id/${capa}-M.jpg`
                );
            } else {
                setImagemCapa("");
            }

        } catch (erro) {
            console.error("Erro ao buscar livro:", erro);

            setErroIsbn("Não foi possível encontrar o livro.");
        } finally {
            setBuscandoIsbn(false);
        }
    }

    return (
        <div>
            <h1>Cadastro de Livro</h1>

            <div>
                <label>ISBN:</label>

                <input
                    type="text"
                    name="isbn"
                    value={form.isbn}
                    onChange={handleChange}
                />

                <button type="button" onClick={buscarLivro}>
                    Buscar dados
                </button>
            </div>

            <div>
                <label>Título:</label>

                <input
                    type="text"
                    name="titulo"
                    value={form.titulo}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>Autor:</label>

                <input
                    type="text"
                    name="autor"
                    value={form.autor}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>Ano de publicação:</label>

                <input
                    type="text"
                    name="ano_publicacao"
                    value={form.ano_publicacao}
                    onChange={handleChange}
                />
            </div>

            {imagemCapa && (
                <div>
                    <h3>Capa do livro</h3>

                    <img
                        src={imagemCapa}
                        alt="Capa do livro"
                        width="150"
                    />
                </div>
            )}
        </div>
    );
}
