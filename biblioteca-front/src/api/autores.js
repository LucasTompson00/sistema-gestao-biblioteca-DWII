import api from "./client";

export async function listarAutores() {
    const { data } = await api.get("/autores");
    return data;
}

export async function cadastrarAutor(dados) {
    const { data } = await api.post("/autores", dados);
    return data;
}

export async function atualizarAutor(id, dados) {
    const { data } = await api.put(`/autores/${id}`, dados);
    return data;
}

export async function excluirAutor(id) {
    await api.delete(`/autores/${id}`);
}