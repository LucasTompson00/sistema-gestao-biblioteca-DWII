import api from "./client";

export async function listarLivros() {
    const { data } = await api.get("/livros");
    return data;
}

export async function buscarLivro(id) {
    const { data } = await api.get(`/livros/${id}`);
    return data;
}

export async function cadastrarLivro(dados) {
    const { data } = await api.post("/livros", dados);
    return data;
}

export async function atualizarLivro(id, dados) {
    const { data } = await api.put(`/livros/${id}`, dados);
    return data;
}

export async function excluirLivro(id) {
    await api.delete(`/livros/${id}`);
}
